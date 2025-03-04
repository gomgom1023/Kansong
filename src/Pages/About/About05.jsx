import { Link } from "react-router-dom";
import React from "react";
import img_mi_top from '../../images/img_mi_top.jpg';
import img_mi_symbolmark from '../../images/img_mi_symbolmark.png';
import img_mi_logotype from '../../images/img_mi_logotype.png';
import img_mi_logotype02 from '../../images/img_mi_logotype02.jpg'
import img_mi_logotype03 from '../../images/img_mi_logotype03.jpg'
import img_mi_logotype04 from '../../images/img_mi_logotype04.jpg'
import img_mi_logotype05 from '../../images/img_mi_logotype05.jpg'
import img_mi_logotype06 from '../../images/img_mi_logotype06.jpg'
import './css/about05.css'

const About05 = () => {
    return(
        <div className="sub_wrap about05">
            <div className="mi_con mi_con_01">
                <div className="mi_info">
                    <div className="info_text">
                        <h3>Museum Identity</h3>
                        <p>
                            지역을 넘어 미래로 이어지는 문화보국의 정신
                            길고 짧은 가로세로 획들이 이어지고 교차하며 만들어 내는 조형적인 로고타입과 발음 기관의모양에서 출발한 한글 형태의
                            특징을 이용하여 시간과 지역을 초월한 고미술에 관한 새로운 시각과 현대적인 컨텐츠로 간송미술관&#40;간송미술문화재단&#41;의 미래가치를 제시 할
                            대구간송미술관의 이미지를 나타내었습니다.
                        </p>
                    </div>
                    <div className="info_img">
                        <div className="img"><img src={img_mi_top} alt="Museum Identity" /></div>
                        <ul className="btn_list">
                            <li><a download href='/mi_daegu.ai'><i className="xi-download"></i>AI 다운로드</a></li>
                            <li><a download href='/mi_daegu.zip'><i className="xi-download"></i>PNG 다운로드</a></li>
                            <li><a download href='/mi_daegu.pdf'><i className="xi-download"></i>PDF 다운로드</a></li>
                        </ul>
                    </div>     
                </div>   
            </div>

            <div className="mi_con mi_con_02">
                <div className="mi_info">
                    <div className="info_text">
                        <h3>심볼마크</h3>
                        <p>
                            맑은 계곡의 고고한 소나무
                            대구간송미술관의 심볼마크는 ‘간송&#40;澗松&#41;’의 의미인 맑은 계곡의 고고한 소나무를 형상화하였습니다.
                            겸재 정선의 진경산수화에서 착안한 두 그루의 소나무는 '시련을 이겨내는 올곧은 의지와 문화로 나라를 지킨다'는 문화보국&#40;文化保國&#41; 신념으로 일생을 바친 간송의 정신을 담고 있습니다.
                            대구간송미술관은 간송 전형필 선생의 정신을 계승하여, 우리 문화유산의 의미와 가치를 온전히 보존하고 새롭게 조명하고자 합니다.
                        </p>    
                    </div>
                    <div className="info_img">
                        <img src={img_mi_symbolmark} alt="img_mi_symbolmark" />
                    </div> 
                </div>            
            </div>

            <div className="mi_con mi_con_03">
                <div className="mi_info">
                    <div className="info_text">
                        <h3>로고타입</h3>
                        <p>
                            훈민정음 해례본 &#60;정음체&#62; 요소의 현대적 재해석
                            대구간송미술관의 로고타입은 대표 유물인 훈민정음 해례본의 &#60;정음체&#62;의 요소들을 현대적으로 재해석하여 개발한 것으로,
                            천지인을 아우르는 동양 사상과 발음기관의 모양을 담아낸 한글의 우수성을 표현하고 있습니다.
                        </p>
                    </div>
                    <div className="info_img">
                        <img src={img_mi_logotype} alt="img_mi_logotype" />
                    </div>
                </div>       
            </div>

            <div className="mi_con mi_con_04">
                <div className="mi_info">
                    <div className="info_text">
                        <h3>로고타입 개발방향</h3>
                    </div>
                    <div className="info_img">
                        <ul>
                            <li>
                                <img src={img_mi_logotype02} alt='로고타입 개발방향'/>
                                <p>훈민정음에서 많이 보이는 ㄱ의 형태에서 영감을 받아 가로 세로가 직각으로 만나는 글자의 특징을 반영하였습니다.</p>
                            </li>
                            <li>
                                <img src={img_mi_logotype03} alt='로고타입 개발방향'/>
                                <p>좌우대칭되는 ㅅ의 조형적 특징과 사선의 각도를 반영하여 훈민정음과의 연관성을 높였습니다.</p>
                            </li>
                            <li>
                                <img src={img_mi_logotype04} alt='로고타입 개발방향'/>
                                <p>훈민정음 해례본의 ㅇ 형태와 같이 정원 형태로 디자인하였습니다.</p>
                            </li>
                            <li>
                                <img src={img_mi_logotype05} alt='로고타입 개발방향'/>
                                <p>ㅁ, ㄹ 은 모두 훈민정음에서 많이 보이는 직각형태에서 착안하였고, 가로선들이 직선으로 평행이 되게 일정한 굵기로 디자인하였습니다.</p>
                            </li>
                            <li>
                                <img src={img_mi_logotype06} alt='로고타입 개발방향'/>              
                                <p>자음과 모음이 결합된 형태의 경우 글자의 외형이 정사각형에 가까웠던 훈민정음에서 착안하여 서체 외형을 정리하였습니다.</p>
                            </li>
                        </ul>              
                    </div>   
                </div>   
            </div>

            <div className="mi_con mi_con_05">
                <div className="mi_info">
                    <div className="info_text">
                        <h3>전용색상</h3>
                        <p>
                            대구간송미술관의 전용 색상은 간송미술문화재단의 주요 소장품에서 추출된 색을 기본으로 지정하였습니다.
                            전용 색상 표현은 별색인쇄를 원칙으로 하며, 매뉴얼에 명시된 색상 샘플 또는 Pantone Color를 표준으로 삼습니다.
                            별색사용이 여의치 않을 경우 CMYK로 대신하여 사용할 수 있습니다. 특히 웹 환경 사용 시 각 색상의 CMYK 색상과 RGB 색상을 구별하여 적용합니다.
                        </p> 
                    </div>
                    <div className="info_img">
                        <ul className="color_list">
                            <li>
                                <span></span>
                                <ul>
                                    <li>
                                        <p>간송 암록색</p>
                                        <p>Pantone 5467 C / 627 U</p>
                                        <p>C 98 / M 79 / Y 93 / K 50</p>
                                        <p>R 13 / G 42 / B 32</p>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <span></span>
                                <ul>
                                    <li>
                                        <p>간송 소색</p>
                                        <p>Pantone Warm Gray 1 C / Warm Gray 1 U</p>
                                        <p>C 6 / M 5 / Y 15 / K 8</p>
                                        <p>R 220 / G 216 / B 201</p>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <span></span>
                                <ul>
                                    <li>
                                        <p>간송 적색</p>
                                        <p>Pantone 200 C / 200 U</p>
                                        <p>C 0 / M 100 / Y 90 / K 20</p>
                                        <p>R 196 / G 20 / B 37</p>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <span></span>
                                <ul>
                                    <li>
                                        <p>간송 묵색</p>
                                        <p>C 0 / M 0 / Y 0 / K 88</p>
                                        <p>R 70 / G 69 / B 71</p>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <span></span>
                                <ul>
                                    <li>
                                        <p>간송 지백색</p>
                                        <p>C 0 / M 1 / Y 3 / K 2</p>
                                        <p>R 248 / G 244 / B 238</p>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <span></span>
                                <ul>
                                    <li>
                                        <p>간송 등황색</p>
                                        <p>Pantone 122C / 120U</p>
                                        <p>C 5 / M 15 / Y85 / K0</p>
                                        <p>R245 / G 210 / B 70</p>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>  
            </div>        
        </div>
    )
}

export default About05;