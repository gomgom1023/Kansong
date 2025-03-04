import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Pagenation from '../store/Pagenation';
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import useBoardState from "../store/noticeState";
import SearchState from "../searchState/SearchState";
import useAuthStore from "../store/useAuthStore";
import '../../Board/notice.css';

const News = () => {
    const { initializeBoards, cleanUpBoards, paginatedNewsBoards, titleClick, tabs, getTotalPagesForNews,
            setSearchQuery, setSearchCategory, searchCategory, searchBoardsByQuery, deleteSelectedBoards, deleteAllBoards,
            setCurrentPage, getGlobalIndex} = useBoardState();
    const boards = paginatedNewsBoards();
    const { isAdmin, logout } = useAuthStore();
    const [selectedBoards, setSelectedBoards] = useState([]);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

  // Firestore 구독 시작 및 해제
  useEffect(() => {
    initializeBoards(); // 실시간 구독 시작
    setCurrentPage(1); // 공지사항 페이지는 마운트될 때 1페이지로 초기화
    return () => cleanUpBoards(); // 컴포넌트 언마운트 시 구독 해제
  }, [initializeBoards, cleanUpBoards, setCurrentPage]);

  const handleSearch = async () => {
    let searchResults = await searchBoardsByQuery();

    if (!Array.isArray(searchResults)) {
        searchResults = [];
    }

    navigate("/SearchBoard", { state: { searchResults: [...searchResults] } });
  };

  const handleCreateButtonClick = () => {
    if(isAdmin){
      navigate("/CreateNotice");
    }else{
      const confirmed = window.confirm('권한이 필요한 페이지 입니다.\n관리자 로그인을 하시겠습니까?');
      if(confirmed){
        navigate("/Admin", { state: { redirect: location.pathname } });
        }
      }
    }

  const handleCheckboxChange = (firestoreId, checked) => {
    setSelectedBoards((prev) => {
      if (checked) {
        return [...prev, firestoreId];  // 🔥 boardId가 firestoreId인 경우 그대로 추가
      } else {
        return prev.filter((id) => id !== firestoreId);
      }
    });
  };
      
    
  const handleDeleteSelected = async () => {
    if (selectedBoards.length === 0) {
      alert("삭제할 게시글을 선택하세요.");
      return;
    }
    const confirmed = window.confirm("선택한 게시글을 삭제하시겠습니까?");
    if (confirmed) {
      await deleteSelectedBoards(selectedBoards);
      setSelectedBoards([]);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm("모든 게시글을 삭제하시겠습니까?");
    if (confirmed) {
      await deleteAllBoards();
    }
  };

  const handleLogout = async() => {
    try{
      await signOut(auth);
      logout();
    }catch(error){
      console.error("로그아웃 실패:", error);
    }
  }

  const totalPagesForNews = getTotalPagesForNews();

  return(
    <div className="sub_wrap board notice">
        <div className="notice_top_contents">
            <div className="tab_box">
                <ul>
                    {tabs.map((tab) => (
                    <li key={tab.to}>
                      <Link to={tab.to} className={`${location.pathname === tab.to ? 'active' : ''}`}>{tab.label}</Link>
                      {tab !== tabs[tabs.length - 1] && <span className="text-gray-200">&#124;</span>}
                    </li>
                    ))}
                </ul>
            </div>
            <SearchState onSearch={handleSearch} />
        </div> 

        <div className="board_btn_box">
            {isAdmin ? (
            <>
                <button className="create" onClick={handleCreateButtonClick}>글등록</button>
                <button className="checkDelete" onClick={handleDeleteSelected}>선택삭제</button>
                <button className="allDelete" onClick={handleDeleteAll}>전체삭제</button>
                <button className="logout" onClick={handleLogout}>로그아웃</button>
            </>
            ) : (
            <button className="adminBtn" onClick={handleCreateButtonClick}>관리자 로그인</button>
            )}
        </div>

        <table>
            {/* 관리자 여부에 따라 colgroup 구성 */}
            {isAdmin ? (
                <colgroup>
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "55%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
                </colgroup>
            ) : (
                <colgroup>
                <col style={{ width: "10%" }} />
                <col style={{ width: "65%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
                </colgroup>
            )}
            <thead className="text-white">
                <tr className="text-base">
                    {isAdmin && (<th>선택</th>)}
                    <th>순서</th>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>조회</th>
                </tr>
            </thead>
            <tbody>
                {boards && boards.length === 0 ? (
                    <tr>
                        <td colSpan={isAdmin ? '5' : '4'}>게시판 항목이 없습니다</td>
                      </tr>
                ) : (
                    boards.map((news,index) => (
                        <tr key={news.firestoreId}>
                            {isAdmin && (
                              <td className="board_check">
                                <input
                                  type="checkbox"
                                  onChange={(e) => handleCheckboxChange(news.firestoreId, e.target.checked)}
                                  checked={selectedBoards.includes(news.firestoreId)}
                                />
                              </td>
                            )}
                            <td className="board_no">{getGlobalIndex(index)}</td>
                            <td className="board_title text_left">
                              <span className={`title_icon ${news.category === '보도뉴스' ? 'news_label' : ''}`}>
                                {news.label ? news.label : "기본 라벨"}  {/* "기본 라벨"로 출력되는지 확인 */}
                              </span>
                              <button onClick={() => titleClick(navigate, news, location.pathname)}>{news.title}</button>
                          </td>
                          <td className="board_date">
                            <span className="mobile_board_title">작성일</span>
                            {news.createdAt
                                ? new Date(
                                    news.createdAt.toDate?.() || 
                                    news.createdAt.seconds * 1000 || 
                                    news.createdAt
                                  ).toISOString().split("T")[0].replace(/-/g, ".")
                                : "날짜 없음"}
                          </td>
                          <td className="board_count">
                            <span className="mobile_board_title">조회수</span>
                            {news.count}
                          </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>

        <Pagenation totalPages={totalPagesForNews}/>
    </div>
  )
}

export default News;