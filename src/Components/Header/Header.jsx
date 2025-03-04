import { Link, useLocation, useNavigate } from "react-router-dom"
import React, { useEffect, useRef, useState, useContext } from "react"
import { HeaderContext } from "../../State/HeaderContext"; // Context import
import { useLanguageStore } from "../../State/LanguageContext";
import { resources } from '../../State/Menu';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CSSTransition } from "react-transition-group";
import headerLogo from '/header_logo.png'
import './header.css'

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
  const {language, toggleLanguage} = useLanguageStore();
  const { headerClass, setHeaderClass } = useContext(HeaderContext); // Context 값 사용
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
  const [langHover, setLangHover] = useState(false);
  const [menuToggle,setMenuToggle] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const visualRef = useRef(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const isMainPage = location.pathname === "/";
  
    const handleScroll = () => {
      if(window.innerWidth <= 1000){
        return;
      }

      const currentScrollY = window.scrollY;
  
      if (isMainPage) {
        // 메인 페이지 로직
        const visualContainer = visualRef.current;
        if (!visualContainer) return;
  
        const rect = visualContainer.getBoundingClientRect();
        const visualStart = rect.top + currentScrollY; // 첫 번째 섹션 시작
        const visualTriggerPoint = visualStart + 30; // hidden 활성화 트리거 지점
        const gsapProgress = ScrollTrigger.getAll()[0]?.progress || 0; // GSAP 진행률
  
        // 최상단 초기화 상태
        if (currentScrollY === 0) {
          requestAnimationFrame(() => setHeaderClass("")); // 최상단 초기화
          lastScrollY.current = currentScrollY;
          return;
        }
  
        // 첫 번째 섹션에서 hidden 활성화
        if (gsapProgress < 0.3) {
          if (currentScrollY >= visualTriggerPoint) {
            setTimeout(() => setHeaderClass("hidden"), 10); // 숨김
          } else if (currentScrollY < visualTriggerPoint) {
            setTimeout(() => setHeaderClass(""), 10); // 초기화
          }
        } else {
          // 첫 번째 섹션 이후 일반적인 스크롤 동작
          const isScrollingDown = currentScrollY > lastScrollY.current;
          setTimeout(() => setHeaderClass(isScrollingDown ? "hidden" : "show"), 10);
        }
  
        lastScrollY.current = currentScrollY; // 마지막 스크롤 위치 업데이트
      } else {
        if (currentScrollY > 100) {
          setHeaderClass("sub_class_white"); // 스크롤 100 이상이면 white 클래스 추가
        } else {
          setHeaderClass("sub_class"); // 초기 sub_class 복구
        }
      }
    };
  
    // resize 이벤트 추가: 1000px 이하에서는 handleScroll 제거, 1001px 이상에서는 다시 등록
    const handleResize = () => {
      if (window.innerWidth > 1000) {
        window.addEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      // 스크롤 이벤트 제거
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname, setHeaderClass]);

  const toggleLanguageMenu = () => {
    setLanguageMenuVisible((prev) => {
      const newState = !prev;
      setLangHover(newState)
      return newState
    })
  }

  const handleChangeLanguage = (lang) => {
    toggleLanguage(lang);
    setLanguageMenuVisible(false);
    setLangHover(false);
  };

  const openMenu = () => {
    setIsAnimating(true);
    setMenuToggle(true);
  };

  const closeMenu = (path) => {
    console.log("🔎 메뉴 클릭 - 이동할 경로:", path);
    setMenuToggle(false);
    setIsAnimating(true);
  
    const hamburgerOpen = document.getElementById("hamburger_open");
    let transitionEnded = false;
  
    if (hamburgerOpen) {
      const handleTransitionEnd = (e) => {
        if (e.propertyName === "opacity") {
          hamburgerOpen.removeEventListener("transitionend", handleTransitionEnd);
          transitionEnded = true;
          navigate(path);
          setIsAnimating(false);
        }
      };
  
      hamburgerOpen.addEventListener("transitionend", handleTransitionEnd);
    }

    setTimeout(() => {
      if (!transitionEnded) {
        navigate(path);
        setIsAnimating(false);
      }
    }, 200);
  };  

  const onAnimationEnd = () => {
    if (!menuToggle) {
      setIsAnimating(false); // 닫기 애니메이션 완료 후 상태 초기화
    }
  };

    return (
      <CSSTransition in={headerClass !== 'hidden'} timeout={300} classNames="header-transition" nodeRef={visualRef}>
        <header id="header">
          <div ref={visualRef} className={`header_bar flex justify-between items-center py-4 px-6 border-b border-[#111111] ${headerClass}`}>
            <h1>
              <Link to="/" className="block">
                <img src={headerLogo} alt="대구 간송미술관" className="w-[50px] md:w-15 headerLogo_dark" />
              </Link>
            </h1>
            <nav id='nav' className="hidden md:block max-w-3xl w-full">
              <ul className="header_menu flex gap-8 flex-row flex-nowrap justify-between w-full text-lg font-medium text-[#111111]">
                {resources.map(({ href, text, text_eng, subMenu }) => (
                  <li key={href}>
                    <Link to={href} className="">
                      {language === 'kor' ? text : text_eng}
                    </Link>
                    {subMenu && (
                      <ul className="sub_menu">
                        {subMenu.map(({sub_href,sub_text, sub_text_eng}) => (
                          <li key={sub_href}>
                            <Link to={sub_href} className="block w-full px-6 py-3 text-sm">
                              {language === 'kor' ? sub_text : sub_text_eng}</Link>
                          </li>
                        ))}
                      </ul>
                      )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-9">
              <div className="choice_lang">
                <button onClick={toggleLanguageMenu} className="text-lg line- flex flex-row items-center gap-[6px]">
                  <span className='text-base'>{language.toUpperCase()}</span>
                  <img className={`max-w-[16px] w-full transition-transform duration-300 transform ${langHover ? 'rotate-180' : 'rotate-0'}`} src="/lan_icon.png" alt="Language" />
                </button>
                <ul className={`choice-lang-menu ${langHover ? 'active' : ''} text-sm`}>
                  <li><button onClick={() => handleChangeLanguage('kor')}>KOR</button></li>
                  <li><button onClick={() => handleChangeLanguage('eng')}>ENG</button></li>
                </ul>
              </div>
              
              <button onClick={openMenu} className="hamburger-menu">
                <ul>
                  <li><span></span></li>
                  <li><span></span></li>
                  <li><span></span></li>
                </ul>
              </button>
            </div>
          </div>
          
          <div id="hamburger_open" className={`${menuToggle ? "open" : "close"} ${isAnimating ? "animating" : ""}`} onAnimationEnd={onAnimationEnd}>
            <div className="segment"></div>
            <div className="segment"></div>
            <div className="segment"></div>
            <div className="segment"></div>
            <div className="segment"></div>
            <div className="close_btn font-eulyoo text-white flex justify-end mt-[1em] mx-[1em]">
              <button onClick={closeMenu} className="hover:underline p-2 text-lg">
                {language === 'kor' ? '닫기' : 'Close'}
              </button>
            </div>
            <div className="max-w-[1300px] my-3 mx-auto px-10">
              <h2 className="hamburger_title text-white text-[6rem] text-center font-eng_Jomolhari">Kansong Museum of Daegu</h2>
            </div>
            <div className="menu_list max-w-[1300px] w-full mx-auto px-10">
              <ul className="w-full">
                {resources.map(({href,text, text_eng, subMenu})=>(
                  <li key={href} className="flex justify-between items-center px-3 py-10">
                    <Link className="text-4xl font-eulyoo" to={href} onClick={(e) => {e.preventDefault(); closeMenu(href)}}>
                      {language === 'kor' ? text : text_eng}
                    </Link>
                    {subMenu && (
                      <ul className="open_sub_menu flex items-center">
                        {subMenu.map(({sub_href,sub_text, sub_text_eng}) => (
                          <li key={sub_href}>
                            <Link className="text-4xl font-eulyoo" to={sub_href} onClick={(e) => {e.preventDefault(); closeMenu(sub_href)}}>
                              {language === 'kor' ? sub_text : sub_text_eng}
                            </Link>
                            <span>&#47;</span>
                          </li>
                        ))}
                    </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>
      </CSSTransition>
      
    )
}
