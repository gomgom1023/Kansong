import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import useBoardState from "./noticeState";
import useAuthStore from "./useAuthStore";
import "../boardview.css";

const BoardView = () => {
    const { isAdmin } = useAuthStore();
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { getPreviousNextBoards, getBoardById, incrementViewCount, initializeBoards } = useBoardState();
    const { prevBoard, nextBoard } = getPreviousNextBoards(id);
    const [board, setBoard] = useState(location.state?.board || null);
    const [content, setContent] = useState(""); // 🔥 Storage에서 가져온 HTML 내용 저장
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoard = async () => {
            if (location.state?.skipIncrement === true) {
                console.log("🚀 [BoardView] 조회수 증가 스킵됨 (skipIncrement 활성화)");
                setBoard(location.state.board);
                fetchContent(location.state.board.contentsURL);
                setLoading(false);
                return;
            }
    
            const fetchedBoard = await getBoardById(id);
            if (fetchedBoard) {
                setBoard(fetchedBoard);
                fetchContent(fetchedBoard.contentsURL);
    
                // Firestore 조회수 증가 실행 (Welcome에서 접근한 경우 제외)
                console.log("📌 [BoardView] Firestore 조회수 증가 실행");
                await incrementViewCount(id, fetchedBoard.category);
            }
    
            setLoading(false);
        };
    
        fetchBoard();
    }, [id, location.state]);
    
    // Storage에서 HTML 내용을 가져와서 표시
    const fetchContent = async (url) => {
        if (!url) {
            console.error("🚨 [BoardView] contentsURL이 존재하지 않음!");
            return;
        }
        try {
            const response = await fetch(url);
            const htmlContent = await response.text();
            setContent(htmlContent);
        } catch (error) {
            console.error("🚨 [BoardView] 컨텐츠 불러오기 실패:", error);
        }
    };

    if (!board) {
        return (
            <div>
                <h2>잘못된 접근입니다.</h2>
                <Link to="/TotalBoard">목록으로 돌아가기</Link>
            </div>
        );
    }

    const formattedDate = board.createdAt
        ? (board.createdAt instanceof Date
            ? board.createdAt
            : new Date(board.createdAt.seconds * 1000)
        ).toISOString().split("T")[0].replace(/-/g, ".")
        : "날짜 없음";

        const returnRoute = location.state?.returnRoute || sessionStorage.getItem("lastSearchRoute") || "/TotalBoard";

    return (
        <div className="sub_wrap">
            <div className="view_title">
                <span>{board.label}</span>
                <h2>{board.title}</h2>
                <ul>
                    <li>
                        <span>
                            <strong>작성일</strong>&nbsp;:&nbsp;
                            {formattedDate}
                        </span>
                    </li>
                    <li><span><strong>조회&nbsp;:&nbsp;</strong>{board.count || 0}</span></li>
                </ul>
            </div>
            
            {/* 🔥 Storage에서 불러온 HTML 내용 렌더링 */}
            <div className="view_contents">
                {loading ? <p>내용 불러오는 중...</p> : <div dangerouslySetInnerHTML={{ __html: content }} />}
            </div>
            <div className="file_section">
                <h4><i className="xi-attachment"></i> 첨부파일</h4>
                {board.fileURL ? (
                    <a 
                        href={board.fileURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        download>
                        {decodeURIComponent(board.fileURL.split("/").pop())}
                    </a>
                ) : (
                    <p>첨부파일이 없습니다.</p>
                )}
            </div>

            <div className="view_bot">
                <ul>
                    <li>
                        {prevBoard ? (
                            <>
                                <span className="view_bot_arr">이전글<i className="xi-caret-up-min" /></span>
                                <button
                                    className="view_bot_text"
                                    onClick={async () => {
                                        const firestoreId = prevBoard.firestoreId;  // 🔥 Firestore ID 사용
                                        const category = prevBoard.category; 
                                    
                                        if (!firestoreId || !category) {
                                            console.error("❌ [prevBoard] Firestore ID 또는 category가 없습니다.");
                                            return;
                                        }
                                    
                                        console.log("🔄 [prevBoard 클릭] Firestore ID:", firestoreId);
                                    
                                        // ✅ Firestore에서 조회수 증가 실행
                                        await incrementViewCount(firestoreId, category);
                                    
                                        // ✅ Firestore에서 최신 count 값을 가져옴
                                        const updatedBoard = await getBoardById(firestoreId);
                                    
                                        if (updatedBoard) {
                                            navigate(`/BoardView/${firestoreId}`, {
                                                state: { 
                                                    board: updatedBoard, // 🔥 최신 count 반영
                                                    skipIncrement: true, 
                                                    returnRoute 
                                                }
                                            });
                                        } else {
                                            console.error("❌ Firestore에서 게시글을 가져오는 데 실패함.");
                                        }
                                    }}>
                                    {prevBoard.title}
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="view_bot_arr">이전글<i className="xi-caret-up-min" /></span>
                                <span className="view_bot_text">이전글이 없습니다.</span>
                            </>
                        )}
                    </li>
                    <li>
                        {nextBoard ? (
                            <>
                                <span className="view_bot_arr">다음글<i className="xi-caret-down-min" /></span>
                                <button
                                    className="view_bot_text"
                                    onClick={async () => {
                                        const firestoreId = nextBoard.firestoreId;  // 🔥 Firestore ID 사용
                                        const category = nextBoard.category; 
                                    
                                        if (!firestoreId || !category) {
                                            console.error("❌ [nextBoard] Firestore ID 또는 category가 없습니다.");
                                            return;
                                        }
                                    
                                        console.log("🔄 [nextBoard 클릭] Firestore ID:", firestoreId);
                                    
                                        // ✅ Firestore에서 조회수 증가 실행
                                        await incrementViewCount(firestoreId, category);
                                    
                                        // ✅ Firestore에서 최신 count 값을 가져옴
                                        const updatedBoard = await getBoardById(firestoreId);
                                    
                                        if (updatedBoard) {
                                            navigate(`/BoardView/${firestoreId}`, {
                                                state: { 
                                                    board: updatedBoard, // 🔥 최신 count 반영
                                                    skipIncrement: true, 
                                                    returnRoute 
                                                }
                                            });
                                        } else {
                                            console.error("❌ Firestore에서 게시글을 가져오는 데 실패함.");
                                        }
                                    }}
                                    >
                                    {nextBoard.title}
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="view_bot_arr">다음글<i className="xi-caret-down-min" /></span>
                                <span className="view_bot_text">다음글이 없습니다.</span>
                            </>
                        )}
                    </li>
                </ul>
            </div>

            <div className="view_btn">
                {isAdmin && (
                    <button onClick={() => navigate(`/UpdateBoard/${id}`)} className="update">수정하기</button>
                )}
                <button onClick={() => navigate(returnRoute)} className="list">목록</button>
            </div>
        </div>
    );
};

export default BoardView;
