import React, { useEffect, useState } from "react";
import { useLocation, Link, Outlet } from "react-router-dom";
import { resources } from "../Menu";
import { useLanguageStore } from "../LanguageContext";
import subVisualAbout from "../../images/sub_visual_About.jpg";
import subVisualInfo from "../../images/sub_visual_Info.jpg";
import subVisualCollection from "../../images/sub_visual_Collection.jpg";
import subVisualRestore from "../../images/sub_visual_Restore.jpg";
import subVisualNotice from "../../images/sub_visual_Notice.jpg";
import menu_location_arrow from '../../images/menu_location_arrow.png';
import './subvisual.css';

const SubVisual = () => {
    const { language } = useLanguageStore()
    const location = useLocation();
    const currentPath = location.pathname;
    const [show,setShow] = useState(false);

    const imageMapping = {
        About: subVisualAbout,
        Info: subVisualInfo,
        Collection: subVisualCollection,
        Restore: subVisualRestore,
        Notice: subVisualNotice,
    }

    let currentMenu = resources.find((menu) =>
        menu.href === currentPath ||
        menu.subMenu?.some((sub) => sub.sub_href === currentPath)
    );


    if (currentPath === "/TotalBoard") {
        currentMenu = {
            text: "미술관 소식",
            text_eng: "Museum News",
            sub_text: "전체 게시판",
            sub_text_eng: "Total Board",
            imageName: "Notice",
        };
    } else if (currentPath.startsWith("/BoardView/")) {
        currentMenu = {
            text: "미술관 소식",
            text_eng: "Museum News",
            sub_text: "게시글 보기",
            sub_text_eng: "View Post",
            imageName: "Notice", // Notice 이미지 사용
        };
    }else if (currentPath.startsWith("/CreateNotice")) {
        currentMenu = {
            text: "미술관 소식",
            text_eng: "Museum News",
            sub_text: "게시글 작성",
            sub_text_eng: "Work Post",
            imageName: "Notice", // Notice 이미지 사용
        };
    }else if (currentPath.startsWith("/UpdateBoard/")) { // UpdateBoard 경로 처리
        currentMenu = {
            text: "미술관 소식",
            text_eng: "Museum News",
            sub_text: "게시판 수정",
            sub_text_eng: "Edit Post",
            imageName: "Notice",
        };
    } else if(currentPath === "/SearchBoard"){
        currentMenu = {
            text: "미술관 소식",
            text_eng: "Museum News",
            sub_text: "게시판 검색",
            sub_text_eng: "Search List",
            imageName: "Notice", // Notice 이미지 사용
        };
    } 
    else if (!currentMenu) {
        const parentPath = resources.find((menu) =>
            currentPath.startsWith(menu.href)
        );
        currentMenu = parentPath || null;
    }

      // 잘못된 경로 처리
    if (!currentMenu) {
        console.warn(`경로(${currentPath})에 해당하는 메뉴가 없습니다.`);
        return (
        <div className="error_page">
            <h2>잘못된 접근입니다.</h2>
            <p>존재하지 않는 페이지입니다.</p>
            <Link to="/">홈으로 돌아가기</Link>
        </div>
        );
    }

    const imageName = currentMenu?.imageName || 'default';
    const backgroundImage = imageMapping[imageName] || null;

    const menuTitle = currentMenu?.text || '대구 간송미술관';
    const menuTitle_eng = currentMenu?.text_eng || 'Daegu Kansong Museum of Art';
    const subMenuTitle =
      currentPath === "/TotalBoard" || currentPath.startsWith('/BoardView/')
      ? currentMenu?.sub_text || "대구 간송미술관"
      : currentMenu?.subMenu?.find((sub) => sub.sub_href === currentPath)?.sub_text || "대구 간송미술관";

    const subMenuTitle_eng =
      currentPath === "/TotalBoard" || currentPath.startsWith('/BoardView/')
      ? currentMenu?.sub_text_eng || "Daegu Kansong Museum of Art"
      : currentMenu?.subMenu?.find((sub) => sub.sub_href === currentPath)?.sub_text_eng || "Daegu Kansong Museum of Art";

    useEffect(()=>{
        setShow(false);
        const timeOut = setTimeout(()=>setShow(true),10);
        return () => clearTimeout(timeOut);
    },[location.pathname])

    return(
        <div className="sub_visual_wrap">
            <div className={`sub_visual sub_visual_${currentMenu.imageName}`} style={{backgroundImage: `url(${backgroundImage})`}}>
                <h2 className={`${language === 'kor' ? "sub_title" : "sub_title_eng"} ${show ? 'fade-in' : ''}`}>
                    {language === 'kor' ? menuTitle : menuTitle_eng}
                </h2>
                <div className="slide-up-container">
                    <ul className={`menu_location ${show ? 'slide-up' : ''}`}>
                        <li><Link to='/'>HOME</Link></li>
                        <li><span><img src={menu_location_arrow}/></span></li>
                        <li><span>{language === 'kor' ? menuTitle : menuTitle_eng}</span></li>
                        <li><span><img src={menu_location_arrow}/></span></li>
                        <li><span>{language === 'kor' ? subMenuTitle : subMenuTitle_eng}</span></li>
                    </ul>
                </div>  
            </div>
            <Outlet/>
        </div>
    )
}

export default SubVisual;