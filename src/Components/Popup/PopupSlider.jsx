import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Cookies from "js-cookie";
import "./popupSlider.css";

const PopupSlider = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [hideFor24Hours, setHideFor24Hours] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            const hidePopupCookie = Cookies.get("hidePopup");

            console.log("쿠키 hidePopup 값:", hidePopupCookie);

            // 24시간 동안 보지 않기를 체크한 경우 팝업 숨김
            if (hidePopupCookie === "true") {
                console.log("24시간 유지 - 팝업 표시 안함");
                return;
            }

            // 기본적으로 팝업 표시
            setShowPopup(true);
        }, 100);
    }, []);

    const handleClose = () => {
        setShowPopup(false);  //팝업 숨기기 (새로고침 시 다시 보이도록)

        if (hideFor24Hours) {
            // 24시간 동안 보지 않기 설정
            Cookies.set("hidePopup", "true", { 
                expires: 1,  // 1일 유지
                path: "/", 
                sameSite: "None",  
                secure: true        
            });

            console.log("24시간 유지 쿠키 저장 완료");
        }

        console.log("닫기 버튼 클릭 - 현재 쿠키 상태:", document.cookie);
    };

    if (!showPopup) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    loop={true} 
                    className="popup-swiper">
                    <SwiperSlide>
                        <div className="popup-slide">
                            <div className="bg_box">
                                <h3>
                                    <strong>리액트</strong>를 기반으로 제작된<br/>반응형 홈페이지 입니다.
                                </h3>
                                <p>
                                    최신 프레임워크와 기술을 적용하여<br/>
                                    빠르고 유연한 사용자 경험을 목표로 하였습니다.
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="popup-slide">
                            <div className="bg_box">
                                <h3>
                                    <strong>미술관 소식</strong>에 게시판을<br/>추가해뒀습니다.
                                </h3>
                                <p>
                                    Firebase와 Storage를 활용하여<br/>
                                    게시글 CRUD 기능을 구현하고,<br/>
                                    Quill 에디터를 적용해 쉽게 작성 가능하며,<br/>
                                    관리자 로그인 기능도 추가되었습니다.
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>

                <div className="popup-buttons">
                    <label className="close1days">
                        <input
                            type="checkbox"
                            checked={hideFor24Hours}
                            onChange={(e) => setHideFor24Hours(e.target.checked)}
                        />
                        <span className="custom-checkbox"></span>
                        <span className="label-text">하루동안 보지 않기</span>
                    </label>
                    <button className="close" onClick={handleClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default PopupSlider;
