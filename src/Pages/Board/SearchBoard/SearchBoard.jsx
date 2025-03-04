import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagenation from "../store/Pagenation";
import useBoardState from "../store/noticeState";
import '../SearchBoard/search.css';

const SearchBoard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { initializeBoards, cleanUpBoards, titleClick, convertCreatedAt } = useBoardState();
    const storedSearchResults = sessionStorage.getItem("searchResults");
    const [searchBoards, setSearchBoards] = useState(
        location.state?.searchResults || (storedSearchResults ? JSON.parse(storedSearchResults) : [])
    );
    console.log("🔥 searchBoards 상태:", searchBoards);
    console.log("🔥 location.state:", location.state);
    console.log("🔥 location.state.searchResults:", location.state?.searchResults);
    useEffect(() => {
        if (!location.state?.searchResults || location.state.searchResults.length === 0) {
            console.log("🔄 location.state.searchResults가 없어서 Zustand 검색 실행");
            
            // Zustand에서 검색 실행해서 최신 검색 결과 가져오기
            useBoardState.getState().searchBoardsByQuery().then((results) => {
                console.log("✅ Zustand에서 가져온 검색 결과:", results);
                setSearchBoards(results);
            });
        } else {
            console.log("✅ location.state.searchResults 존재:", location.state.searchResults);
            sessionStorage.setItem("searchResults", JSON.stringify(location.state.searchResults));
            setSearchBoards(location.state.searchResults);
        }
    }, [location.state?.searchResults]);

    useEffect(() => {
        initializeBoards();
        return () => cleanUpBoards();
    }, [initializeBoards, cleanUpBoards]);

    useEffect(() => {
        if (!location.state?.searchResults) {
            console.log("🔄 기존 검색 결과 유지:", searchBoards);
        }
    }, [searchBoards]); // ✅ searchBoards가 변경될 때마다 실행되도록 수정
    

   useEffect(() => {
    return () => {
        console.log("🔥 검색 데이터 초기화 실행");
        sessionStorage.removeItem("searchResults");
    };
}, [location.pathname]); // ✅ 페이지가 변경될 때 실행


    const boardPerPage = useBoardState.getState().boardPerPage;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(searchBoards.length / boardPerPage);

    // 🔥 Firestore 구독 시작 및 해제
    useEffect(() => {
        initializeBoards();
        return () => cleanUpBoards();
    }, [initializeBoards, cleanUpBoards]);

    const currentResult = Array.isArray(searchBoards)
    ? searchBoards.slice((currentPage - 1) * boardPerPage, currentPage * boardPerPage)
    : [];

    return (
        <div className="sub_wrap board search_board">
            <h2 className="text-2xl font-bold">검색 결과</h2>

            <table>
                <thead className="text-white">
                    <tr className="text-base">
                        <th>순서</th>
                        <th>제목</th>
                        <th>작성일</th>
                        <th>조회</th>
                    </tr>
                </thead>
                <tbody>
                    {currentResult.length === 0 ? (
                        <tr>
                            <td colSpan="4">검색 결과가 없습니다.</td>
                        </tr>
                    ) : (
                        currentResult.map((board, index) => (
                            <tr key={board.firestoreId || board.id}>
                                <td>{index + 1}</td>
                                <td className="text_left">
                                    <span className={`title_icon ${board.category === "공지사항" ? "notice_label" : "news_label"}`}>
                                        {board.label}
                                    </span>
                                    <button onClick={() => titleClick(navigate, board)}>
                                        {board.title}
                                    </button>
                                </td>
                                {console.log("📌 board.createdAt:", board.createdAt)}
                                <td>
                                    {board.createdAt
                                        ? new Date(board.createdAt).toISOString().split("T")[0].replace(/-/g, ".")
                                        : "날짜 없음"}
                                </td>
                                <td>{board.count}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <button 
                onClick={() => {
                    sessionStorage.removeItem("searchResults"); 
                    sessionStorage.removeItem("lastSearchRoute"); 
                    navigate("/TotalBoard");
                }} 
                className="px-4 py-2 mt-4 bg-gray-900 text-white text-sm">
                돌아가기
            </button>

            <Pagenation totalPages={totalPages} />
        </div>
    );
};

export default SearchBoard;
