import React, {useRef} from "react";
import { useNavigate } from "react-router-dom";
import useBoardState from "../store/noticeState"; // ✅ Zustand store 가져오기
import CustomDropdown from "../store/CustomDropdown/CustomDropdown";
import searchIcon from '../../../images/search_icon.png';
import '../../Board/notice.css';

const SearchState = ({ onSearch }) => {
    const { searchQuery, setSearchQuery, searchCategory, setSearchCategory } = useBoardState();
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
    
        const query = searchRef.current.value.trim();
        if (!query) {
            console.warn("❌ 검색어가 비어 있음! 검색 중단.");
            return;
        }
    
        console.log("🔍 검색 실행 중... 검색어:", query);
    
        setSearchQuery(query); // ✅ Zustand 상태 업데이트
    
        if (onSearch) {
            onSearch();
        }
    }; 
    
    return (
        <div className="search_wrap">
            <form onSubmit={(e) => handleSearch(e)} className="search_wrap">
            <div className="search_select">
              <CustomDropdown selectedValue={searchCategory} onSelect={setSearchCategory} />
            </div>

            <label>
              <input ref={searchRef} type="text" name="search" placeholder="검색어를 입력하세요" />
            </label>

            <button type="submit">
              <img src={searchIcon} alt="Search" />
            </button>
          </form>
        </div>
    );
};

export default SearchState;
