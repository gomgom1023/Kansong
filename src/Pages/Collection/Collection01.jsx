import React, { useEffect, useState, useRef } from "react";
import './css/collection01.css';

const Collection01 = () => {
    const [activeIndex1, setActiveIndex1] = useState(0);
    const [activeIndex2, setActiveIndex2] = useState(0);
    const frameRef1 = useRef(null);
    const frameRef2 = useRef(null);
    const startTimeRef1 = useRef(null);
    const startTimeRef2 = useRef(null);

    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);
    const [count3, setCount3] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    
    const targetValues = [1, 1, 7]; // 최종 숫자 값
    const duration = 3000; // 전체 애니메이션 지속 시간 (3초)
    const jackpotRef = useRef(null);

    // GIF 리스트
    const gifList = [
        { gif: "/collection_list_icon01.gif", text: "기증, 기탁 접수" },
        { gif: "/collection_list_icon02.gif", text: "소장자 면담, 자료실사" },
        { gif: "/collection_list_icon03.gif", text: "기증, 기탁 신청서 접수" },
        { gif: "/collection_list_icon04.gif", text: "작품수집심의위원회 심사" },
        { gif: "/collection_list_icon05.gif", text: "기증, 기탁 협약 <br/>기증자 예우" }
    ];

    const gifList02 = [
        { gif: "/collection_list_icon06.gif", text: "‘기증, 기탁자의 벽‘<br/>명패 게시<br/><small>(기탁자의 경우 기탁 기간 동안 게시)</small>" },
        { gif: "/collection_list_icon07.gif", text: "기증, 기탁식 개최" },
        { gif: "/collection_list_icon08.gif", text: "전시 개막식 초청 및 도슨트 제공" },
        { gif: "/collection_list_icon09.gif", text: "도록, 전시 초대권 제공" },
        { gif: "/collection_list_icon10.gif", text: "영인본, 도록, 아트상품<br/>구매 시 할인" }
    ]

    useEffect(() => {
        const updateFrame1 = (time) => {
            if (!startTimeRef1.current) startTimeRef1.current = time;
            const elapsed = time - startTimeRef1.current;

            if (elapsed > 3000) { // 3초 후 다음 GIF
                setActiveIndex1((prevIndex) => (prevIndex + 1) % gifList.length);
                startTimeRef1.current = time;
            }

            frameRef1.current = requestAnimationFrame(updateFrame1);
        };

        frameRef1.current = requestAnimationFrame(updateFrame1);

        return () => cancelAnimationFrame(frameRef1.current);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const updateFrame2 = (time) => {
                if (!startTimeRef2.current) startTimeRef2.current = time;
                const elapsed = time - startTimeRef2.current;

                if (elapsed > 3000) { // 3초 후 다음 GIF
                    setActiveIndex2((prevIndex) => (prevIndex + 1) % gifList02.length);
                    startTimeRef2.current = time;
                }

                frameRef2.current = requestAnimationFrame(updateFrame2);
            };

            frameRef2.current = requestAnimationFrame(updateFrame2);

            return () => cancelAnimationFrame(frameRef2.current);
        }, 3000);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.8 }
        );

        if (jackpotRef.current) {
            observer.observe(jackpotRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible) {
            startRolling(setCount1, targetValues[0], duration);
            startRolling(setCount2, targetValues[1], duration + 500);
            startRolling(setCount3, targetValues[2], duration + 1000);
        }
    }, [isVisible]);

    function startRolling(setCount, target, time) {
        let speed = 50; 
        let current = Math.floor(Math.random() * 100);
        setCount(current);
        
        const interval = setInterval(() => {
            current = Math.floor(Math.random() * 10);
            setCount(current);
            if (time <= 500) {
                clearInterval(interval);
                setCount(target);
            }
            time -= 100; 
            speed += 20;
        }, speed);
    }

    return(
        <div className="sub_wrap">
            <div className="collection_01_wrap">
                <div className="header_text">
                    <h3>문화유산을 <strong>보존</strong>하고,<br/>함께 나누는 <strong>마음</strong>입니다.</h3>
                    <div className="scroll-container">
                        <div className="scroll-content">
                            <p><i className="xi-wechat"></i> 대구간송미술관에서는 소중한 우리 문화유산을 보존하고 전시 및 연구자료로 활용하기 위하여 자료를 수집합니다.</p>
                            <p><i className="xi-wechat"></i> 대구 · 경북 지역의 역사와 문화가 담긴 소중한 자료를 간송이 지켜나갈 수 있도록 시민 여러분의 기증 및 기탁을 기다리고 있습니다.</p>
                        </div>
                        <div className="scroll-content">
                            <p><i className="xi-wechat"></i> 대구간송미술관에서는 소중한 우리 문화유산을 보존하고 전시 및 연구자료로 활용하기 위하여 자료를 수집합니다.</p>
                            <p><i className="xi-wechat"></i> 대구 · 경북 지역의 역사와 문화가 담긴 소중한 자료를 간송이 지켜나갈 수 있도록 시민 여러분의 기증 및 기탁을 기다리고 있습니다.</p>
                        </div>
                    </div>     
                </div>  

                <div className="collection_01_box_wrap">
                    <div className="box_list box_list_01">
                        <h4>기증, 기탁절차</h4>
                        <ul className="collection_list">
                            {gifList.map((item, index) => {
                                const isActive = index === activeIndex1;
                                const imageUrl = isActive ? item.gif : `${item.gif}?stop`;

                                return (
                                    <React.Fragment key={index}>
                                        <li className={`list ${isActive ? "active" : ""}`}>
                                            <img 
                                                src={imageUrl} 
                                                alt={item.text} 
                                                onLoad={(e) => !isActive && e.target.setAttribute("src", `${item.gif}?stop`)} 
                                            />
                                            <span className="list_text">
                                                <strong>{String(index + 1).padStart(2, "0")}</strong>
                                                <span dangerouslySetInnerHTML={{ __html: item.text }} />
                                            </span>
                                        </li>
                                        {index < gifList.length - 1 && (
                                            <li className={`arrow ${isActive ? "arrow-active" : ""}`}>
                                                <span className="arrow-icon"><i className="xi-arrow-right"></i></span>
                                            </li>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="box_list box_list_02">
                        <h4>기증, 기탁자 예우</h4>
                        <ul className="collection_list">
                            {gifList02.map((item, index) => {
                                const isActive = index === activeIndex2;
                                const imageUrl = isActive ? item.gif : `${item.gif}?stop`;

                                return (
                                    <React.Fragment key={index}>
                                        <li className={`list ${isActive ? "active" : ""}`}>
                                            <img 
                                                src={imageUrl} 
                                                alt={item.text} 
                                                onLoad={(e) => !isActive && e.target.setAttribute("src", `${item.gif}?stop`)} 
                                            />
                                            <span className="list_text">
                                                <strong>{String(index + 1).padStart(2, "0")}</strong>
                                                <span dangerouslySetInnerHTML={{ __html: item.text }} />
                                            </span>
                                        </li>
                                        {index < gifList02.length - 1 && (
                                            <li className={`arrow ${isActive ? "arrow-active" : ""}`}>
                                                <span className="arrow-icon"><i className="xi-arrow-right"></i></span>
                                            </li>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="box_list box_list_03">
                        <h4>신청방법</h4>
                        <ul className="call_list">
                            <li>
                                <p>
                                    <i className="xi-call"></i>
                                    <span>전화문의 자료연구팀</span>
                                </p>
                                <strong>070-4419-5383</strong>
                            </li>
                            <li>
                                <p>
                                    <i className="xi-mail-o"></i>
                                    <span>이메일신청</span>
                                </p>
                                <strong>inbokyi@kansong.org</strong>
                            </li>
                        </ul>
                        
                        <a className='collection_btn' href="/기증기탁신청서파일.hwpx" download>
                            <i className="xi-download"></i>
                            <span>기증, 기탁 신청서 다운로드</span>
                        </a>
                    </div>
                    <div className="box_list box_list_04">
                        <h4>자료 기증ㆍ기탁</h4>
                        <ul ref={jackpotRef} className="bold_list">
                            <li>
                                <span>기증건수</span>
                                <p><strong>{count1}<span>건</span></strong></p>
                            </li>
                            <li>
                                <span>기증인</span>
                                <p><strong>{count2}<span>명</span></strong></p>
                            </li>
                            <li>
                                <span>기증 문화유산</span>
                                <p><strong>{count3}<span>점</span></strong></p>
                            </li>
                        </ul>
                            
                        <table>
                            <colgroup>
                                <col style={{'width' : '15%'}}/>
                                <col style={{'width' : '15%'}}/>
                                <col style={{'width' : '15%'}}/>
                                <col style={{'width' : '40%'}}/>
                                <col style={{'width' : '15%'}}/>
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>기증년도</th>
                                    <th>연번</th>
                                    <th>기증자</th>
                                    <th>대표작품</th>
                                    <th>수량</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2024</td>
                                    <td>0001</td>
                                    <td>제동식</td>
                                    <td>안중식 &#60;도원문진도&#62;등</td>
                                    <td>7점</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Collection01;