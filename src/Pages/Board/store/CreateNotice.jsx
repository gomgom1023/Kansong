import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import useAuthStore from "./useAuthStore";
import './create.css';
import ImageResize from "quill-image-resize";

Quill.register("modules/imageResize", ImageResize);

const CreateNotice = () => {
    const [createInput, setCreateInput] = useState({
        title: "",
        contents: "",
        category: "공지사항",
        fileURL: null,
    });

    const { isAdmin } = useAuthStore();
    const { title, contents, category } = createInput;
    const titleRef = useRef(null);
    const quillRef = useRef(null);
    const fileRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [quill, setQuill] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!quill && quillRef.current) {
            const q = new Quill(quillRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                        ["clean"],
                    ],
                },
            });

            q.on("text-change", () => {
                setCreateInput((prev) => ({ ...prev, contents: q.root.innerHTML }));
                setIsDirty(true);
            });

            setQuill(q);
        }
    }, []);

    // 🔥 브라우저 새로고침, URL 직접 입력 시 확인창 띄우기
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = "작성 중인 글이 있습니다. 정말 나가시겠습니까?"; // 🔥 브라우저 기본 메시지 (사용자 지정 불가)
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);

    // 🔥 메뉴 클릭 시 confirm 창 띄우기
    useEffect(() => {
        const handleNavigation = (e) => {
            const target = e.target.closest("a"); // 메뉴 클릭 시 <a> 태그 감지
            if (target && isDirty) {
                const confirmLeave = window.confirm("글 작성을 취소하시겠습니까?");
                if (!confirmLeave) {
                    e.preventDefault();
                    navigate(location.pathname, { replace: true }); // 현재 페이지 유지
                } else {
                    setCreateInput({ title: "", contents: "", category: "공지사항", fileURL: null });
                    setIsDirty(false);
                }
            }
        };

        document.addEventListener("click", handleNavigation);
        return () => {
            document.removeEventListener("click", handleNavigation);
        };
    }, [isDirty, navigate, location.pathname]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);
    
        try {
            const uploadTask = uploadBytes(storageRef, file);
            await uploadTask;
            const fileURL = await getDownloadURL(storageRef);
            
            console.log("✅ 파일 업로드 완료:", fileURL);
            setCreateInput((prev) => ({ ...prev, fileURL }));
            setIsDirty(true);
        } catch (error) {
            console.error("❌ 파일 업로드 실패:", error);
            alert("파일 업로드 중 오류가 발생했습니다.");
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            alert("관리자 권한이 필요합니다.");
            return;
        }
        if (title.trim() === "" || contents.trim() === "") {
            alert("제목과 내용을 입력하세요.");
            return;
        }
        
        setIsSubmitting(true); // 🔥 버튼 상태 변경 (등록중...)

        const collectionName = category === "보도자료" ? "News" : "Notice";
        const label = category === "보도자료" ? "보도" : "공지";
    
        try {
            let contentsURL = null;
            let contentsText = contents.trim() || ""; // ✅ 기본값 설정 (빈 문자열 방지)
    
            // 🔥 HTML 파일로 변환하여 Storage에 저장
            if (contentsText) {
                const contentsBlob = new Blob([contentsText], { type: "text/html" });
                const contentsRef = ref(storage, `contents/${Date.now()}.html`);
                await uploadBytes(contentsRef, contentsBlob);
                contentsURL = await getDownloadURL(contentsRef);
            }
    
            // ✅ Firestore에 `contents` 직접 저장 추가!
            await addDoc(collection(db, collectionName), {
                title,
                contents: contentsText,  // ✅ Firestore에도 `contents` 필드 직접 저장
                contentsURL,  // ✅ Storage 경로도 함께 저장
                category,
                label,
                count: 0,
                fileURL: createInput.fileURL || "첨부파일 없음",
                createdAt: new Date(),
            });
    
            alert("게시글이 등록되었습니다.");
            setIsDirty(false);
            setCreateInput({ title: "", contents: "", category: "공지사항", fileURL: null });
            quill.root.innerHTML = ""; // 🔥 Quill 에디터 초기화
            setIsSubmitting(false); // 🔥 버튼 상태 복귀
            navigate("/TotalBoard");
        } catch (error) {
            console.error("게시글 저장 실패:", error);
            setIsSubmitting(false); // 🔥 오류 발생 시 버튼 원래대로
        }
    };    

    return (
        <div className="sub_wrap">
            <form onSubmit={handleSubmit} className="create-container">
                <div className="input-group">
                    <label>제목</label>
                    <input ref={titleRef} type='text' name="title" value={title}
                        onChange={(e) => {
                            setCreateInput((prev) => ({ ...prev, title: e.target.value }));
                            setIsDirty(true);
                        }}
                        placeholder="제목" />
                </div>
                <div className="input-group">
                    <label>내용</label>
                    <div ref={quillRef} className="editor-container"/>
                </div>

                <div className="input-group check_box">
                    <label>카테고리 선택</label>
                    <div>
                        <input 
                            type="radio" 
                            name="category" 
                            value="공지사항" 
                            checked={category === "공지사항"} 
                            onChange={() => {
                                setCreateInput((prev) => ({ ...prev, category: "공지사항" }));
                                setIsDirty(true);
                            }} />
                        <span className="label">공지사항</span>
                        
                        <input 
                            type="radio" 
                            name="category" 
                            value="보도자료" 
                            checked={category === "보도자료"} 
                            onChange={() => {
                                setCreateInput((prev) => ({ ...prev, category: "보도자료" }));
                                setIsDirty(true);
                            }} 
                        />
                        <span className="label">보도자료</span>
                    </div>
                </div>

                <div className="input-group">
                    <label className="file">파일 첨부</label>
                    <input type="file" ref={fileRef} onChange={(e) => {
                        handleFileUpload(e);
                        setIsDirty(true);
                    }} />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    <i className={isSubmitting ? "xi-spinner-1 xi-spin" : "xi-cloud-upload-o"}></i>
                    {isSubmitting ? '글 등록중...' : '글 등록'}
                </button>
            </form>
        </div>
    );
};

export default CreateNotice;
