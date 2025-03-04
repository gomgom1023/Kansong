import React, {useEffect, useState, useRef} from "react";
import './ino01.css'

const Info01 = () => {
    const [activeTab, setActiveTab] = useState(null);
    const headerOffset = 120;
    const sectionsRef = useRef({});
    const isClickingRef = useRef(false);
    const isScrollingRef = useRef(false);
    const scrollYRef = useRef(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupTableRef = useRef(null);
    const observerRef = useRef(null);
    
    useEffect(() => {
        document.querySelectorAll(".move_tab a").forEach((link) => {
            if (link.getAttribute("href") === `#${activeTab}`) {
                link.classList.add("active");
                link.classList.remove("normal");
            } else {
                link.classList.remove("active");
                link.classList.add("normal");
            }
        });
    }, [activeTab]);

      useEffect(() => {
        const sections = Object.values(sectionsRef.current);

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (isClickingRef.current) return;

                const visibleSection = entries.find((entry) => entry.isIntersecting);
                if (visibleSection) {
                    setActiveTab(visibleSection.target.id);
                }
            },
            { rootMargin: `-${headerOffset}px 0px -40% 0px`, threshold: 0.3 }
        );

        sections.forEach((section) => section && observerRef.current.observe(section));

        return () => observerRef.current.disconnect();
    }, []);

    // 스크롤 이벤트 (가장 가까운 섹션 찾기)
    useEffect(() => {
        const handleScroll = () => {
            if (isClickingRef.current) return; //  클릭 중이면 감지 중단

            isScrollingRef.current = true; // 스크롤 시작 감지

            const sections = Object.values(sectionsRef.current);
            let closestSection = null;
            let minDistance = Infinity;

            sections.forEach((section) => {
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const distance = Math.abs(rect.top - headerOffset);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSection = section;
                    }
                }
            });

            if (closestSection) {
                setActiveTab(closestSection.id);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 클릭 이벤트: 기존 상태 초기화 후 이동
    const handleClick = (e, id) => {
        e.preventDefault();
        isClickingRef.current = true;
        isScrollingRef.current = false;

        document.querySelectorAll(".move_tab a").forEach((link) => {
            link.classList.remove("active");
        });

        setActiveTab(null);
        setTimeout(() => setActiveTab(id), 10);

        const targetElement = document.getElementById(id);
        if (targetElement) {
            const offsetPosition =
                targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({ top: offsetPosition, behavior: "smooth" });

            setTimeout(() => {
                isClickingRef.current = false;
            }, 800);
        }
    };

    useEffect(() => {
        const handleTouchMove = () => {
            isClickingRef.current = false;
            isScrollingRef.current = true;
        };

        window.addEventListener("touchmove", handleTouchMove, { passive: true });

        return () => window.removeEventListener("touchmove", handleTouchMove);
    }, []);

  // 리사이징 이벤트 개선
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        if (isClickingRef.current) return; 

        const sections = Object.values(sectionsRef.current);
        let closestSection = null;
        let minDistance = Infinity;

        sections.forEach((section) => {
          if (section) {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - headerOffset);

            if (distance < minDistance) {
              minDistance = distance;
              closestSection = section;
            }
          }
        });

        if (closestSection) {
          setActiveTab(closestSection.id);
        }
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isPopupOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "auto";
      window.scrollTo(0, scrollYRef.current);
    }
  }, [isPopupOpen]);
  
  useEffect(() => {
    const popupTable = popupTableRef.current;
    if (!popupTable) return;

    const handleWheel = (event) => {
      event.stopPropagation();
    };

    popupTable.addEventListener("wheel", handleWheel);
    popupTable.addEventListener("touchmove", handleWheel);

    return () => {
      popupTable.removeEventListener("wheel", handleWheel);
      popupTable.removeEventListener("touchmove", handleWheel);
    };
  }, [isPopupOpen]);

    return(
        <div id='info01' className="sub_wrap">
            <div className="move_tab">
                <ul key={activeTab}>
                    <li>
                        <a href="#con01" onClick={(e) => handleClick(e, "con01")} className={activeTab === "con01" ? "active" : "normal"}>
                            <i className="xi-alarm-o"></i><span>관람시간</span>
                        </a>
                    </li>
                    <li>
                        <a href="#con02" onClick={(e) => handleClick(e, "con02")} className={activeTab === "con02" ? "active" : "normal"}>
                            <i className="xi-money"></i><span>관람료</span>
                        </a>
                    </li>
                    <li>
                        <a href="#con03" onClick={(e) => handleClick(e, "con03")} className={activeTab === "con03" ? "active" : "normal"}>
                            <i className="xi-info-o"></i><span>관람 시 유의사항</span>
                        </a>
                    </li>
                    <li>
                        <a href="#con04" onClick={(e) => handleClick(e, "con04")} className={activeTab === "con04" ? "active" : "normal"}>
                            <i className="xi-wheelchair"></i><span>유모차, 휠체어 대여</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div className="info01_con_wrap">
                <div id='con01' ref={(el) => (sectionsRef.current["con01"] = el)} className="con_box">
                    <div className="title">
                        <h3>관람시간</h3>
                    </div>

                    <div className="con">
                        <h4>관람시간 &#40;실내&#41;</h4>
                        <ul className="dot_list">
                            <li><p>하절기&#40;4월~10월&#41;: 오전 10시 ~ 오후 7시</p></li>
                            <li><p>동절기&#40;11월~3월&#41;: 오전 10시 ~ 오후 6시</p></li>
                        </ul>
                       <span className="span_text">* 매표시간 : 관람시작 30분 전 ~ 관람종료 1시간 전</span>

                        <h4>관람시간 &#40;실외&#41;</h4>
                        <ul className="dot_list">
                            <li>
                                <p>안전사고 예방을 위해 야간 시간대의 야외공간&#40;박석마당, 수공간&#41; 출입이 제한될 수 있습니다.</p>
                            </li>
                        </ul>
                        <span className="span_text">* 야외공간 출입제한 : 오후 10:00 ~ 다음날 오전 08:00</span>
                        
                        <h4>휴관일</h4>
                        <ul className="dot_list">
                            <li>
                                <p>매주 월요일, 매년 1월 1일, 음력 설날 및 추석 당일, 기타 시장이 정하는 휴관일</p>
                            </li>
                            <li>
                                <p>월요일이 공휴일인 경우에는 월요일 당일 개관 후 다음날 평일 휴관합니다.</p>
                            </li>
                        </ul>
                    </div>      
                </div>
                <div id='con02' ref={(el) => (sectionsRef.current["con02"] = el)} className="con_box">
                    <div className="title">
                        <h3>관람료</h3>
                    </div>
                    <div className="con">
                        <h4>관람료 _ <small>상설전시</small></h4>
                        <table>
                            <thead>
                                <tr>
                                    <th rowSpan='2'>구분</th>
                                    <th colSpan='2' style={{'borderBottom':'1px solid #ccc'}}>금액</th>
                                    <th rowSpan='2'>비고</th>
                                </tr>
                                <tr>
                                    <th style={{'borderLeft' : '1px solid #ccc'}}>개인</th>
                                    <th>단체 &#40;20명 이상&#41;</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>성인</td>
                                    <td>6,000원</td>
                                    <td>5,000원</td>
                                    <td>20세 이상 64세 이하</td>
                                </tr>
                                <tr>
                                    <td>어린이, 청소년</td>
                                    <td>3,000원</td>
                                    <td>2,000원</td>
                                    <td>8세 이상 19세 이하</td>
                                </tr>
                            </tbody>
                        </table>
                        <br/>
                        <ul className="dot_list">
                            <li>
                                <p>주말 및 공휴일은 전시장 내 혼잡으로 단체관람을 받지 않습니다.</p>
                            </li>
                            <li>
                                <p>주말, 공휴일 경우 현장 단체예매도 불가합니다.</p>
                            </li>
                            <li>
                                <p>단체관람은 평일&#40;화요일~금요일&#41;만 가능합니다.</p>
                            </li>
                            <li>
                                <p>문의사항 : 대구간송미술관 &#40;☎ 053-793-2022&#41;</p>
                            </li>
                        </ul>			
                        
                        <h4>관람료 할인</h4>
                        <ul className="dot_list">
                            <li><p>할인 · 무료관람 대상자는 신분증 등 증명자료가 필요합니다.</p></li>
                            <li><p>단체관람은 사전문의 부탁드립니다. &#40;☎ 053-793-2022&#41;</p></li>
                            <li><p>무료 입장객도 발권 후 입장합니다.</p></li>
                        </ul>
                        
                        <h4>안내사항</h4>
                        <ul className="dot_list">
                            <li>
                                <p>만 7세 이하 및 만 65세 이상, 등록장애인, 국가유공자는 신분증/증빙서류 확인 후 현장 발권</p>
                                <span className="inner_span_text"> → 인터넷&#40;인터파크&#41; 예매 없이, 안내 데스크에서 바로 발권 가능합니다.</span>
                            </li>
                            <li>
                                <p>증빙서류 안내</p>
                                <ul className="line_list">
                                    <li><span>7세 이하 : 등본 &#40;모바일 가능&#41;</span></li>
                                    <li><span>65세 이상 : 신분증</span></li>
                                    <li><span>등록장애인 : 복지카드 &#40;중증 : 보호자 1명 포함 무료, 경증 : 본인 무료&#41;</span></li>
                                    <li><span>국가유공자: 국가유공자증 / 선순위 등록증</span></li>
                                </ul>
                            </li>
                            <li>
                                <p>관람료 20% 할인</p>
                                <ul className="line_list">
                                    <li><span>주민등록상 주소지가 대구인 사람 &#40;증빙서류 : 신분증&#41;</span></li>
                                </ul>
                            </li>
                            <li>
                                <p>관람료 30% 할인</p>
                                <ul className="line_list">
                                    <li><span>자원봉사 누적시간이 100시간 이상인자 &#40;증빙서류 : 100시간 이상 확인 증빙자료&#41;</span></li>
                                    <li><span>막내 나이가 18세 이하인 다자녀 가정의 부모와 자녀 &#40;증빙서류 : 다자녀카드&#41;</span></li>
                                </ul>
                            </li>
                            <li>
                                <p>관람료 50% 할인</p>
                                <ul className="line_list">
                                    <li><span>&#91;국민기초생활보장법&#93;에 따른 수급자 및 차상위계층 &#40;증빙서류: 국민기초생활 수급자 증명서&#41;</span></li>
                                </ul>
                            </li>
                            <li>
                                <p>관람료 100% 할인</p>
                                <ul className="line_list">
                                    <li><span>7세 이하의 어린이, 65세 이상의 노인</span></li>
                                    <li><span>「장애인복지법」에 따른 등록 장애인&#40;장애의 정도가 심한 장애인은 보호자 1명 포함&#41;</span></li>
                                    <li><span>「독립유공자 예우 및 지원에 관한 법률」 등 타 법령에서 무료관람 대상자로 규정된 사람</span></li>
                                </ul>
                            </li>
                        </ul>         
                        <br/>
                        <button className="popup-btn" onClick={()=>setIsPopupOpen(true)}><i className="xi-library-add"></i>&nbsp;&nbsp;무료대상자 기준 자세히 보기</button>

                        {isPopupOpen && (
                            <div className="popup_box">
                                <div className="popup_con">
                                    <div className="con_top">
                                        <h5>무료대상자 기준</h5>
                                        <button className="close_btn" onClick={()=>setIsPopupOpen(false)}><i className="xi-close"></i></button>
                                    </div> 
                                    <p style={{'color': '#fb353d', 'margin' : '0 0 10px', 'padding' : '0 2em'}}>※ 제 3호부터 17호까지는 해당증명서 제출 신분증 미지참시 정상입장료가 발생합니다.</p>
                                    
                                    <div className="popup_table" ref={popupTableRef}>
                                        <table>
                                            <colgroup>
                                                <col style={{ width: "70%" }} />                    
                                                <col style={{ width: "30%" }} />  
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th>무료대상자 구분</th>
                                                    <th>증빙서류</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>국빈.외교사절단 및 그 수행자</td>
                                                    <td>-</td>
                                                </tr>
                                                <tr>
                                                    <td>7세 이하의 어린이, 65세 이상의 노인</td>
                                                    <td>신분증</td>
                                                </tr>
                                                <tr>
                                                    <td>장애인복지법에 따른 등록장애인</td>
                                                    <td>장애인증, 장애인 복지카드</td>
                                                </tr>
                                                <tr>
                                                    <td>공무수행을 위하여 출입하는 사람</td>
                                                    <td>공무원증</td>
                                                </tr>
                                                <tr>
                                                    <td>&#91;국가유공자 등 예우 및 지원에 관한 법률 시행령&#93;<br/>제86조제1항 각호의 어느 하나에 해당하는 사람</td>
                                                    <td>국가유공자증</td>
                                                </tr>
                                                <tr>
                                                    <td>&#91;독립유공자예우에 관한 법률&#93;<br/>제23조 및 같은 법 시행령 제15조에 해당하는 사람	</td>
                                                    <td>국가유공자증</td>
                                                </tr>
                                                <tr>
                                                    <td>&#91;참전유공자 예우 및 단체설립에 관한 법률&#93;<br/>제2조 제2호 해당하는 사람</td>
                                                    <td>국가유공자증</td>
                                                </tr>
                                                <tr>
                                                    <td>&#91;고엽제 후유증 등 환자지원 및 단체설립에 관한 법률&#93;<br/>제8조의3 각 호의 어느하나에 해당하는 사람	</td>
                                                    <td>고궁 등 이용증</td>
                                                </tr>
                                                <tr>
                                                    <td>&#91;5.18민주유공자 예우 및 단체설립에 관한 법률 시행령&#93;<br/>제52조제1항 각 호에 어느하나에 해당하는 사람</td>
                                                    <td>국가유공자증</td>
                                                </tr>
                                                <tr>
                                                    <td>&#91;특수임무유공자 예우 및 단체설립에 관한 법률&#93;<br/>제74조 및 같은 법 시행령 제58조에 해당하는 사람</td>
                                                    <td>국가유공자증</td>
                                                </tr>
                                                <tr>
                                                    <td>&#91;의사상자 등 예우 및 지원에 관한 법률 시행령&#93;<br/>제17조의2 제1항 각 호의 어느하나에 해당하는 사람</td>
                                                    <td>의사상자증</td>
                                                </tr>
                                                <tr>
                                                    <td>&#91;국군포로의 송환 및 대우 등에 관한 법률&#93;<br/>제2조 제5호에 따른 등록포로 및 같은 조 제3호에 따른 억류지 출신 포로가족	</td>
                                                    <td>귀환용사증</td>
                                                </tr>
                                                <tr>
                                                    <td>&#91;보훈보상대상자 지원에 관한 법률&#93;<br/>제2조 제1항 어느 하나에 해당하는 보훈보상대상자, 그 유족 또는 가족</td>
                                                    <td>보훈보상증</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div id='con03' ref={(el) => (sectionsRef.current["con03"] = el)} className="con_box">
                    <div className="title">
                        <h3>관람 시 유의사항</h3>
                    </div>
                    <div className="con">
                        <ul className="none_list">
                            <li><p><strong>01</strong>미술관의 모든 구역은 금연구역입니다. 미술관에서는 흡연을 삼가 주십시오.</p></li>
                            <li><p><strong>02</strong>미술관 내 음식물 반입은 삼가 주십시오.</p></li>
                            <li><p><strong>03</strong>안내견 이외의 반려동물&#40;애완동물&#41; 출입은 삼가 주십시오.</p></li>
                            <li><p><strong>04</strong>미술관 입장 전, 휴대전화는 전원을 끄거나 진동으로 전환하여 주십시오.</p></li>
                            <li><p><strong>05</strong>미술관에서는 정숙해 주시고 뛰어다니는 행위는 삼가 주십시오.</p></li>
                            <li><p><strong>06</strong>전시ㆍ시설물에 손을 대거나 손상을 입힐 수 있는 행위는 절대 삼가 주십시오.</p></li>
                            <li><p><strong>07</strong>플래시, 삼각대, 셀카봉 등을 이용한 촬영과 상업적 용도의 촬영은 금지합니다.</p></li>
                            <li><p><strong>08</strong>미술관 내에서는 자전거, 킥보드, 스케이드보드, 바퀴 달린 신발 등을 이용하실 수 없습니다.</p></li>
                        </ul>
                    </div>                    
                </div>

                <div id='con04' ref={(el) => (sectionsRef.current["con04"] = el)} className="con_box">
                    <div className="title">
                        <h3>유모차<small>or</small>휠체어 대여</h3>
                    </div>
                    <div className="con">
                        <h4>유아, 노약자, 장애인은 유모차ㆍ휠체어를 무료로 이용하실 수 있습니다.</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>구분</th>
                                    <th>유모차</th>
                                    <th>휠체어</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>이용대상</td>
                                    <td>24개월 미만 영유아</td>
                                    <td>노약자, 장애인 등</td>
                                </tr>
                                <tr>
                                    <td>보유대수</td>
                                    <td>4대</td>
                                    <td>4대</td>
                                </tr>
                                <tr>
                                    <td>이용시간</td>
                                    <td colSpan='2'>미술관 개방시간 내 이용</td>
                                </tr>
                                <tr>
                                    <td>대여장소</td>
                                    <td colSpan={2}>안내데스크 &#40;지상2층&#41;</td>
                                </tr>
                            </tbody>
                        </table>
                            

                        <h4>유의 및 당부사항</h4>
                        <ul className="dot_list">
                            <li><p>대여를 원하는 이용객은 간단한 인적사항 기재 후 쉽게 대여할 수 있습니다.</p></li>
                            <li><p>파손 및 분실할 경우에는 사용자에게 배상에 대한 책임이 있습니다.</p></li>
                            <li><p>유모차와 휠체어에 무거운 물건을 싣거나 무리한 사용을 금하여 주시기 바랍니다.</p></li>
                            <li><p>안전사고 방지를 위해 경사지나 도로에서의 사용을 삼가주십시오.</p></li>
                            <li><p>유모차와 휠체어는 가급적 실내에서만 이용하여 주시기 바랍니다.</p></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info01;