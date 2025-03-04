import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import useAuthStore from "../store/useAuthStore";
import Quill from "quill";
import Delta from "quill-delta"; // Delta를 직접 import
import "quill/dist/quill.snow.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ImageResize from "quill-image-resize";
import "../UpdateBoard/update.css";

Quill.register("modules/imageResize", ImageResize);

const UpdateBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAdmin } = useAuthStore();
  const isDeltaInserted = useRef(false); // 🔥 Delta 삽입 여부 추적

  const [updateInput, setUpdateInput] = useState({
    title: "",
    contents: "",
    category: "공지사항",
    file: null,
    fileURL: "",
  });

  const [loading, setLoading] = useState(true);
  const [isQuillReady, setIsQuillReady] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  /** ✅ Firestore에서 게시글 데이터 불러오기 */
  const fetchBoard = useCallback(async () => {
    console.log("📌 Firestore에서 최신 데이터 가져오는 중...");

    const collections = ["Notice", "News"];
    let fetchedData = null;

    for (const collectionName of collections) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            fetchedData = { firestoreId: docSnap.id, ...docSnap.data() };
            console.log(`✅ Firestore에서 최신 데이터 가져옴 - 컬렉션: ${collectionName}, ID: ${id}`);
            break;
        }
    }

    if (!fetchedData) {
        console.error("❌ 게시글을 찾을 수 없습니다. ID:", id);
        setLoading(false);
        alert("게시글을 찾을 수 없습니다.");
        navigate("/TotalBoard");  
        return;
    }

    let contentsData = fetchedData.contents || "";
    if (fetchedData.contentsURL) {
        try {
            console.log("🌐 Storage에서 contents 가져오기...");
            const response = await fetch(fetchedData.contentsURL);
            contentsData = await response.text();
            console.log("✅ Storage에서 가져온 contents:", contentsData);
        } catch (error) {
            console.error("❌ Storage에서 contents 불러오기 실패:", error);
        }
    }

    setUpdateInput({
        title: fetchedData.title,
        contents: contentsData,
        category: fetchedData.category,
        file: fetchedData.file || null,
        fileURL: fetchedData.fileURL || "",
    });

    setLoading(false);
}, [id, navigate]);



  /** ✅ Quill 에디터 초기화 */
  const initializeQuill = useCallback(() => {
    if (quillRef.current && !quillInstance.current) {
      console.log("✅ Quill 초기화 시작...");

      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
          imageResize: {},
        },
      });

      quillInstance.current.on("text-change", () => {
        const editorContent = quillInstance.current.root.innerHTML;
        setUpdateInput((prev) => ({ ...prev, contents: editorContent }));
        console.log("📌 Quill 내용 변경됨:", editorContent);
      });

      setIsQuillReady(true);
      console.log("✅ Quill 초기화 완료");
    }
  }, []);

  useEffect(() => {
    if (isQuillReady && updateInput.contents && !isDeltaInserted.current) {
      console.log("📝 Quill에 초기 내용 삽입 시도:", updateInput.contents);
  
      setTimeout(() => {
        if (quillInstance.current) {
          const editor = quillInstance.current;
  
          if (!editor) {
            console.error("❌ Quill 인스턴스가 초기화되지 않음!");
            return;
          }
  
          // 🔥 변환 전 원본 HTML 데이터 확인
          console.log("📌 변환 전: updateInput.contents ->", updateInput.contents);
  
          // 🔥 기존 Delta 변환 방식 (문제 발생 가능)
          // const newDelta = new Delta(editor.clipboard.convert(updateInput.contents));
  
          // 🚀 **강제 HTML 삽입 (이미지 포함 가능)**
          editor.clipboard.dangerouslyPasteHTML(0, updateInput.contents);
  
          // 🔥 Delta 삽입 후 상태 갱신 방지
          isDeltaInserted.current = true;
  
          setTimeout(() => {
            editor.root.blur();
            editor.root.focus();
          }, 50);
  
          console.log("✅ Quill HTML 삽입 완료 (렌더링 강제 업데이트)");
  
          // 🚀 **Quill 내부 데이터 직접 확인**
          console.log("🔍 Quill 현재 getContents():", editor.getContents());
          console.log("🔍 Quill 현재 getText():", editor.getText());
          console.log("🔍 Quill 현재 innerHTML:", editor.root.innerHTML);
        }
      }, 200);
    }
  }, [isQuillReady, updateInput.contents]);
  
  
  /** ✅ Firestore 데이터 가져온 후 Quill 초기화 */
  useEffect(() => {
    if (!loading) {
      initializeQuill();
    }
  }, [loading, initializeQuill]);

  /** ✅ Firestore에서 데이터 불러오기 */
  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  /** ✅ 게시글 수정 처리 */
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isAdmin) {
        alert("관리자만 수정할 수 있습니다.");
        return;
    }

    if (!updateInput.title.trim()) {
        alert("제목을 입력하세요.");
        return;
    }

    if (!quillInstance.current) {
        console.error("❌ Quill 인스턴스가 존재하지 않습니다.");
        alert("내용을 입력하세요.");
        return;
    }

    const editorContent = quillInstance.current.root.innerHTML; // 🔥 최신 Quill 내용 가져오기
    console.log("✅ 최신 Quill 내용:", editorContent);

    let contentsURL = updateInput.contentsURL || null;
    let contentsText = editorContent.trim() || "";  // 🔥 HTML 내용 저장

    try {
        // 🔥 Quill 내용을 Firestore Storage에 업로드
        const contentsBlob = new Blob([contentsText], { type: "text/html" });
        const contentsRef = ref(storage, `contents/${id}_${Date.now()}.html`);

        console.log("🚀 Storage 업로드 시작...");
        await uploadBytes(contentsRef, contentsBlob);
        contentsURL = await getDownloadURL(contentsRef);
        console.log("✅ Storage 업로드 완료:", contentsURL);
    } catch (error) {
        console.error("🚨 Storage 업로드 실패:", error);
        alert("내용 저장 중 오류가 발생했습니다.");
        return;
    }

    // ✅ Firestore 업데이트 (🔥 contents도 함께 저장!)
    const collectionName = updateInput.category === "공지사항" ? "Notice" : "News";
    const boardRef = doc(db, collectionName, id);

    try {
        await updateDoc(boardRef, {
            title: updateInput.title,
            contents: contentsText,  // 🔥 Firestore에 직접 HTML 내용 저장
            contentsURL,  // 🔥 Storage URL 저장
            category: updateInput.category,
        });

        console.log("✅ Firestore 업데이트 완료:", { title: updateInput.title, contents: contentsText, contentsURL });

        alert("게시글이 수정되었습니다.");
        navigate(`/BoardView/${id}`, { state: { updated: true } });

    } catch (error) {
        console.error("🚨 Firestore 업데이트 실패:", error);
        alert("게시글 수정 중 오류가 발생했습니다.");
    }
};

  return (
    <div className="sub_wrap">
      {loading ? (
        <p>게시글 데이터를 불러오는 중...</p>
      ) : !isAdmin ? (
        <p>관리자만 접근할 수 있습니다.</p>
      ) : (
        <form onSubmit={handleSubmit} className="update-container">
          <div className="input-group">
            <label>제목</label>
            <input name="title" type='text' value={updateInput.title} onChange={(e) => setUpdateInput({ ...updateInput, title: e.target.value })} placeholder="제목" />
          </div>
          
          <div className="input-group">
            <label>내용</label>
            <div ref={quillRef} style={{ height: "300px", backgroundColor: "#fff" }} />
          </div>

          <div className="input-group">
            <label>첨부파일</label>
            {updateInput.fileURL && <p>📎 <a href={updateInput.fileURL} target="_blank" rel="noopener noreferrer">기존 파일 다운로드</a></p>}
            <input type="file" name="file" onChange={(e) => setUpdateInput({ ...updateInput, file: e.target.files[0] })} />
          </div>
          
          <button type="submit" className="submit-btn">수정 완료</button>
        </form>
      )}
    </div>
  );
};

export default UpdateBoard;
