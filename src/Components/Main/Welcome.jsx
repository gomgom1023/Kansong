import { gsap } from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Flip from "gsap/Flip";
import ScrollToPlugin from "gsap/ScrollToPlugin";

if (!gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, Flip, ScrollToPlugin);
}

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import React, { useState, useEffect, useRef, useLayoutEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguageStore } from "../../State/LanguageContext.js";
import "./welcome.css";
import useBoardState from "../../Pages/Board/store/noticeState.js";
import PopupSlider from "../Popup/PopupSlider.jsx";

const Welcome = () => {
  const { language } = useLanguageStore(); 
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const wrapRef = useRef(null);

  //section01 Refs
  const visualRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const circleRef = useRef(null); 

  //section03 Refs
  const section03Ref = useRef(null);
  const section03_textRef = useRef(null);
  const horizontalScrollContainerRef = useRef(null); 
  const objectsRef = useRef([]);

  const { initializeBoards, cleanUpBoards, paginatedNoticeBoards, paginatedNewsBoards, titleClick } = useBoardState();
  const noticeBoard = paginatedNoticeBoards();
  const newsBoard = paginatedNewsBoards();

  useEffect(() => {
    initializeBoards(); // Firestore 데이터 구독

    console.log("GSAP Plugins Registered:", gsap.core.globals());

    if (!gsap.core.globals().ScrollTrigger) {
      console.error("GSAP ScrollTrigger가 정의되지 않음!");
      gsap.registerPlugin(ScrollTrigger);
    } else {
      console.log("ScrollTrigger 정상 등록됨");
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => cleanUpBoards();
  }, [initializeBoards, cleanUpBoards]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    if (typeof ScrollTrigger === "undefined") {
      console.error("GSAP ScrollTrigger 플러그인이 등록되지 않음");
      return;
    }

    //section01 애니메이션
    const visualContainer = visualRef.current;
    const videoElement = videoRef.current;
    const textElement = textRef.current;
    const circleContainer = circleRef.current;

    gsap.set(videoElement, {
      bottom: "0", // 하단 고정
      left: "calc(50% - (30% / 2))", // 수평 중앙 기준
      width: "30%", // 초기 너비
      height: "calc(50vh)", // 초기 높이
      borderRadius: "300px 300px 0 0", // 둥근 모서리
      transformOrigin: "center bottom", // 중앙 하단 기준
    });

    mm.add("(max-width:1400px)", () => {
      gsap.set(videoElement, {
        bottom: "0", // 하단 고정
        left: "calc(50% - (40% / 2))", // 수평 중앙 기준
        width: "40%", // 초기 너비
        height: "calc(50vh)", // 초기 높이
        borderRadius: "300px 300px 0 0", // 둥근 모서리
        transformOrigin: "center bottom", // 중앙 하단 기준
      });
    });

    mm.add("(max-width:1200px)", () => {
      gsap.set(videoElement, {
        bottom: "0", // 하단 고정
        left: "calc(50% - (40% / 2))", // 수평 중앙 기준
        width: "40%", // 초기 너비
        height: "calc(45vh)", // 초기 높이
        borderRadius: "300px 300px 0 0", // 둥근 모서리
        transformOrigin: "center bottom", // 중앙 하단 기준
      });
    });
  
    
    gsap.timeline({
      scrollTrigger: {
        trigger: visualContainer,
        start: "top top", 
        end: "bottom+=1000",
        scrub: 3,
      },
    }).to(circleContainer, {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: visualContainer,
        start: "top",
        end: "bottom+=200% top",
        scrub: 1,
        pin: true,
      },
    })
    .to(
      videoElement,
      {delay:1}
    )
    .to(
      videoElement,
      {
        width: "100%",
        height: "100%",
        top: "0",
        left:"0",
        borderRadius: "0",
        duration: 3,
        scrub: 1,
      },
      "<"
    )
    .to(
      videoElement,
      {
        scale: 1,
        delay:3,
        duration: 9}
    );

    // 텍스트 애니메이션 타임라인
    gsap.timeline({
      scrollTrigger: {
        trigger: visualContainer,
        start: "top top+=60",
        end: "bottom+=100",
        scrub: 1,
      },
    }).fromTo(
      textElement,
      { opacity: 1, y: 0 },
      { opacity: 0, y: -70, duration: 1, ease: "power3.inOut" }
    );

    // GSAP 애니메이션 설정 후 matchMedia 실행
  mm.add("(max-width: 1000px)", () => {
    console.log("1000px 이하: section01 GSAP 애니메이션 제거");

    // ScrollTrigger 관련 이벤트 제거 (section01만)
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === visualRef.current) {
        trigger.kill();
      }
    });

    // GSAP 애니메이션 제거
    gsap.killTweensOf([videoRef.current, textRef.current, circleRef.current]);

    // section01 스타일 초기화
    gsap.set([videoRef.current, textRef.current, circleRef.current], { clearProps: "all" });

    console.log("GSAP 애니메이션 제거 완료");
  });

    // Section02 애니메이션
    const section02Container = document.getElementById("section02");
    const textBox = section02Container?.querySelector(".text_box");
    const imgBox = section02Container?.querySelector(".section02_img");
    const sub_TextBox = section02Container?.querySelector(".section02_sub_text");
    const isSamsungBrowser = /SamsungBrowser/.test(navigator.userAgent);

  if (!section02Container || !textBox) {
    console.error("Some refs are missing in Section02!");
    return;
  }

  gsap.set(textBox, {
    opacity: 0,
    scale: 10, 
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
    transformOrigin: "center center"
  });
  gsap.set(imgBox, {
    opacity:0,
    bottom:'-20%',
    left: "50%",
    transform: "translateX(-50%)",
    width: "280px",
    height: "340px",
    transformOrigin: "center bottom",
  });
  gsap.set(sub_TextBox, {
    opacity: 0,
    bottom: isSamsungBrowser ? '-20%' : '-17%',
    left:'50%',
    xPercent: -50,
    yPercent: -50,
    transformOrigin: "bottom", 
  });

  const textBoxTimeLine = gsap.timeline({
    scrollTrigger: {
      trigger: section02Container,
      start: "center center",
      end: "bottom+=6000",
      scrub: 1.5,
      pin: true,
    },
  })
  textBoxTimeLine
  .to(textBox, {
    opacity: 1,
    scale: 1, 
    scrub: 3,
    delay:10,
    duration: 1000000,
    ease: "power2.out",
  },">+=2")
  .to(imgBox, {
    delay:10,
    scrub: 2,
    duration: 1000000,
  })
  .to(textBox, {
    y: -250,
    delay: 10,
    scrub: 3,
    duration: 1000000,
    ease: "slow(0.7, 0.7, false)"
  },">+=2")
  .to(imgBox, {
    opacity: 1,
    top: '55%',
    left: '50%',
    xPercent: -50,
    yPercent: -50,
    scrub: 3,
    duration: 1000000,
    ease: "slow(0.7, 0.7, false)"
  },'<')
  .to(sub_TextBox, {
    opacity: 1,
    bottom: '16%',
    scrub: 3,
    duration: 1000000,
    ease: "power2.out",
  },'<')
  .to(imgBox, {
    delay:10,
    scrub: 3,
    duration: 1000000,
  })
  .to(imgBox, {
    width:'66%',
    scrub: 3,
    duration: 1000000,
    delay:10,
    ease: "power2.out",
  },">+=2")
  .to(imgBox, {
    delay:10,
    scrub: 3,
    duration: 1000000,
  },'>')
  if(window.innerWidth > 1000){
    textBoxTimeLine.to(section02Container, {
      top:'-20%',
      opacity: 0,
      scrub: 2,
      duration: 1000000,
      delay:10,
      ease: "power2.out"
    },">+=2")
    .to(section02Container, {
      delay:100,
      scrub: 3,
      ease: "power2.out",
      duration: 1000000,
    },'>+=4')
  }
  
  mm.add("(max-width: 1000px)", () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: section02Container,
        start: "center center",
        end: "bottom+=6000",
        scrub: 2,
        onUpdate: (self) => {
          console.log(`스크롤 진행 상태: ${self.progress.toFixed(2)}`);
        }
      },
    })
  .set(imgBox, {
    width: "260px",
    height:'320px'
  })
  .to(imgBox, {
    delay:1,
    duration:2,
    scrub:2
  })
  .to(imgBox, {
    width: "80%",
    duration: 2,
    ease: "power2.out",
  }, ">+=2")
  .to(imgBox, {
    delay:1,
    duration:2,
    scrub:2
  })

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
});
    
mm.add("(max-width: 780px)", () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf([textBox, imgBox, sub_TextBox]);

  gsap.set([textBox, imgBox, sub_TextBox], { clearProps: "all" });

  // 새로운 타임라인 생성
  const smallScreenTimeLine = gsap.timeline({
    scrollTrigger: {
      trigger: section02Container,
      start: "center center",
      end: "bottom+=5000",
      scrub: 2,
      pin: true,
    },
  });

  gsap.set(textBox, {
    opacity: 0,
    scale: 10,
    top:'50%',
    left: "50%",
    xPercent: -50,
    yPercent: -50,
    transformOrigin: "center center", 
  });
  gsap.set(imgBox, {
    opacity:0,
    bottom:'-20%',
    left: "50%",
    transform: "translateX(-50%)",
    width: "240px",
    height: "260px",
    transformOrigin: "center bottom",
  });
  gsap.set(sub_TextBox, {
    opacity: 0,
    bottom:'-28%',
    left:'50%',
    transform:'translateX(-50%)',
    transformOrigin: "bottom",
  });

  smallScreenTimeLine
  .to(textBox, {
    opacity: 1,
    scale: 1, 
    scrub: 3,
    delay:10,
    duration: 1000000,
    ease: "power2.out",
  },">+=2")
  .to(imgBox, {
    delay:10,
    scrub: 2,
    duration: 1000000,
  })
  .to(textBox, {
    y: -160,
    delay: 10,
    scrub: 3,
    duration: 1000000,
    ease: "slow(0.7, 0.7, false)"
  },">+=2")
  .to(imgBox, {
    opacity: 1,
    top: '57%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    scrub: 3,
    duration: 1000000,
    ease: "slow(0.7, 0.7, false)"
  },'<')
  .to(sub_TextBox, {
    opacity: 1,
    bottom: '20%',
    scrub: 3,
    duration: 1000000,
    ease: "power2.out",
  },'<')
  .to(imgBox, {
    delay:10,
    scrub: 3,
    duration: 1000000,
  })
  .to(imgBox, {
    width: '90%',
    left: 'calc(50% - 45%)',
    top: '57.5%',
    transform: 'translate(0, -50%)',
    scrub: 3,
    duration: 1000000,
    delay: 10,
    ease: "power2.out",
  }, ">+=2")
  .to(imgBox, {
    delay:10,
    scrub: 3,
    duration: 1000000,
  },'>')

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
})

  mm.add("(max-width: 580px)", () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf([textBox, imgBox, sub_TextBox]);
  
    gsap.set([textBox, imgBox, sub_TextBox], { clearProps: "all" });
  
    const smallScreenTimeLine = gsap.timeline({
      scrollTrigger: {
        trigger: section02Container,
        start: "center center",
        end: "bottom+=5000",
        scrub: 2,
        pin: true,
      },
    });
    gsap.set(textBox, {
      opacity: 0,
      scale: 10, 
      top:'55%',
      left: "50%",
      transform:'translate(-50%,-50%)',
      transformOrigin: "center center", 
    });
    gsap.set(imgBox, {
      opacity:0,
      bottom:'-20%',
      left: "50%",
      transform: "translateX(-50%)",
      width: "220px",
      height: "260px",
      transformOrigin: "center bottom",
    });
    gsap.set(sub_TextBox, {
      opacity: 0, 
      bottom:'-20%',
      left:'50%',
      transform:'translateX(-50%)',
      transformOrigin: "bottom", 
    });
  
    smallScreenTimeLine
    .to(textBox, {
      opacity: 1,
      scale: 1,
      scrub: 3,
      delay:10,
      duration: 1000000,
      ease: "power2.out",
    },">+=2")
    .to(imgBox, {
      delay:10,
      scrub: 2,
      duration: 1000000,
    })
    .to(textBox, {
      y: -200, 
      delay: 10,
      scrub: 3,
      duration: 1000000,
      ease: "slow(0.7, 0.7, false)"
    },">+=2")
    .to(imgBox, {
      opacity: 1,
      top:'38%',
      left: '50%',
      transform: 'translateX(-50%)',
      scrub: 3,
      duration: 1000000,
      ease: "slow(0.7, 0.7, false)"
    },'<')
    .to(sub_TextBox, {
      opacity: 1, 
      bottom: isSamsungBrowser ? '22%' : '20%',
      scrub: 3,
      duration: 1000000,
      ease: "power2.out",
    },'<')
    .to(imgBox, {
      delay:10,
      scrub: 3,
      duration: 1000000,
    })
    .to(imgBox, {
      width: '90%',
      left: 'calc(50% - 45%)',
      transform: 'translate(0,0)',
      scrub: 3,
      duration: 1000000,
      delay: 10,
      ease: "power2.out",
    }, ">+=2")
    .to(imgBox, {
      delay:10,
      scrub: 3,
      duration: 1000000,
    },'>')
  
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });

  //section03
  const section03 = section03Ref.current;
  const section03TextElement = section03_textRef.current;
  const scrollContainer = horizontalScrollContainerRef.current;
  const objects = gsap.utils.toArray(".horizontal-scroll-container > div");

  if (!section03 || !scrollContainer) {
    console.error("`section03` 또는 `scrollContainer`가 없음!");
    return;
  }

  let horizontalScrollWidth = scrollContainer.scrollWidth - section03.offsetWidth;

  if (horizontalScrollWidth <= 0) {
    scrollContainer.style.width = "600%"; 
    horizontalScrollWidth = scrollContainer.scrollWidth - section03.offsetWidth;
  }

  console.log("section03:", section03);
  console.log("scrollContainer:", scrollContainer);
  console.log("scrollContainer.scrollWidth:", scrollContainer?.scrollWidth);
  console.log("section03.offsetWidth:", section03?.offsetWidth);
  console.log("horizontalScrollWidth:", horizontalScrollWidth);

  if (horizontalScrollWidth <= 0 || isNaN(horizontalScrollWidth)) {
    console.error("horizontalScrollWidth 값이 잘못됨");
    return;
  }

  gsap.set(".text_obj", { backgroundSize: "0%" });
  gsap.set(scrollContainer, { 
    x: "100vw", 
    opacity: 1, 
    position: "absolute", 
    top: 0, left: 0,
    zIndex: 5 
  });
  
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: section03,
      start: "top top",
      end: `+=${horizontalScrollWidth + 7000}`,
      pin: true, 
      scrub: 1,
    },
  });

  masterTimeline.to(wrapRef.current, {
    backgroundColor:'#000',
    ease: "slow(0.7, 0.7, false)",
    duration: 1.5,
    scrollTrigger: {
      trigger: section03,
      start: 'top 90%',
      end: 'bottom 20%',
      scrub: 1,
      onEnter: () => gsap.to(wrapRef.current, {
        backgroundColor: "#000",
        duration: 1.5
      }),
    }
  }, 0);

  masterTimeline.to(gsap.utils.toArray(".text_obj"), {
    backgroundSize: "100%",
    ease: "power2.out",
    duration: 150,
    delay:1,
    stagger: { each: 4, from: "start" }
  })
  
  masterTimeline.to(section03TextElement, { 
    x: "-80%",
    opacity:0,
    ease: "power3.inOut",
    duration: 150,
  }, "+=1");

  masterTimeline.to(scrollContainer, { 
    x: "0vw", 
    ease: "power3.inOut",
    duration: 150
  }, "<");
  
  masterTimeline.to(objects, { 
    x: -horizontalScrollWidth, 
    ease: "none", 
    duration: 500,
    stagger: { each: 2, form:'start' }, 
  },'>');

  masterTimeline.to({}, {
    duration: 100,
    delay:10
  });

  masterTimeline.to(wrapRef.current, {
    ease: "slow(0.7, 0.7, false)",
    duration: 1,
    scrollTrigger: {
      trigger: section03,
      start: `bottom 10%`, 
      scrub: 1,
      onLeave: () => gsap.to(wrapRef.current, {
        backgroundColor: "#ffffff",
        duration: 1
      }),
      onLeaveBack: () => gsap.to(wrapRef.current, {
        backgroundColor: "#000",
        duration: 1
      }),
    }
  }, "+=0.5");

    mm.add("(max-width: 780px)", () => {
      console.log("780px 이하 - section03 모든 GSAP 이벤트 제거");

      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section03) {
          trigger.kill();
        }
      });

      // 모든 애니메이션 제거
      gsap.killTweensOf([section03, section03TextElement, scrollContainer, objects]);

      gsap.set([section03, section03TextElement, scrollContainer, objects], { clearProps: "all" });

      console.log("✅ section03 애니메이션 제거 완료");
      
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isLoading]);

  return (
    <div ref={wrapRef} className="main_wrap">
      <PopupSlider/>
      <div className="rotating-circle-container" ref={circleRef}>
        <svg width="160" height="160" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="rotating-circle" preserveAspectRatio="xMidYMid meet">
          {/* 원형 경로 */}
          <defs>
            <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"/>
          </defs>

          {/* 텍스트 경로 */}
          <text fill="#111111" fontSize="12" fontWeight="medium">
            <textPath href="#circlePath" startOffset="0" className="font-eng_Jomolhari">
              SCROLL DOWN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCROLL DOWN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCROLL DOWN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCROLL DOWN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCROLL DOWN
            </textPath>
          </text>
        </svg>
      </div>

      {/* Section 01 */}
      <section id="section01" className="section_box" ref={visualRef}>
        <div className="video_box">
          <video ref={videoRef} className="background-video" src="kansong_video.mp4" muted autoPlay loop playsInline></video>
        </div>
        <div className="text-overlay" ref={textRef}>
          <h1>Daegu Kansong Art Museum</h1>
          <p>
            {language === 'kor' 
              ? '1938년 보화각에서 비롯된 문화보국의 첫 걸음'
              : 'The first step of cultural patriotism starting in 1938 at Bohwagak'
            }
          </p>
        </div>
      </section>

      {/* Section 02 */}
      <section id="section02" className="section_box text-center py-28">
        <div className="text_box">
          <p className="text-xl font-eulyoo">
            {language === 'kor' ? '미래로 이어가는 문화보국 정신' : 'The spirit of cultural patriotism that continues into the future'}
          </p>
          <h2 className="text-6xl mt-3 font-eulyoo font-semibold">
            {language === 'kor' ? '대구 간송미술관' : 'Daegu Kansong Museum of Art'}
          </h2>
        </div>
        <div className="section02_img fixed-background"></div>
        <p className="section02_sub_text font-normal text-lg">
          {language === 'kor'
          ? (
            <>
             대구간송미술관이 <span className="font-semibold">‘국채보상운동’</span>의 시작점이자, <span className="font-semibold">‘한국 근대미술의 발상지’</span>인 대구에서 새롭게 출발합니다.
            </>  
          ) : (
            <>
              The Daegu Kansong Art Museum embarks on a new journey in Daegu, the birthplace of the <span className="font-semibold">‘Korean modern art movement and the starting point’</span> of <span className="font-semibold">‘the National Debt Repayment Movement’</span>.
            </>
          )} 
        </p>
      </section>

      {/* Section 03 */}
      <section ref={section03Ref} id="section03" className="section_box py-32">
        <div ref={section03_textRef} className="section03_text">
          <div>
            <h2 className="text_obj">예술의 숨결<span>한국 전통의 미술</span></h2>
            <h2 className="text_obj">시간을 담은 공간<span>역사와 문화의 조화</span></h2>
            <h2 className="text_obj">문화유산의 빛<span>예술로 남은 유산</span></h2>
            <h2 className="text_obj">과거와 미래의 연결<span>유산을 잇는 미술관</span></h2>
          </div>
        </div>

        {/* 780px 이상일 때 GSAP 가로 스크롤 유지 */}
        <div ref={horizontalScrollContainerRef} className={`horizontal-scroll-container ${window.innerWidth > 780 ? 'gsap-active' : 'swiper-active'}`}>
          {window.innerWidth > 780 ? (
            // 780px 이상 → 기존 GSAP 가로 스크롤 유지
            ["bg_object_01.jpg", "bg_object_02.jpg", "bg_object_03.jpg", "bg_object_04.jpg", "bg_object_05.jpg", "bg_object_06.webp"].map((img, idx) => {
              const titles = ["훈민정음", "미인도", "고려청자", "고려불화", "신라금관", "쌍검대무"];
              const contents = [
                `훈민정음(訓民正音)은 세종대왕이 1443년 창제하고 1446년 반포한 우리나라 고유 문자로,<br>"백성을 가르치는 바른 소리"라는 뜻을 가진다.`,
                `미인도(美人圖)는 조선 후기의 대표적인 풍속화가 신윤복(申潤福, 1758~?)이 그린 작품으로,<br>한국 미술사에서 가장 유명한 미인화 중 하나다.`,
                `고려청자는 고려 시대(918~1392)의 대표적인 도자기로,<br>세계적으로도 그 아름다움을 인정받은 한국 전통 문화유산이다.`,
                `고려불화(高麗佛畵)는 고려 시대(918~1392)에 제작된 불교 회화로,<br>동양 불교 미술의 정점으로 평가받는다.`,
                `신라 시대(5~6세기)의 대표적인 유물로, 왕이 착용했던 화려한 황금 장식이 특징이다.<br>경주의 천마총과 금령총 등에서 출토되었으며, 신라의 세련된 금세공 기술을 보여준다.`,
                `조선 후기 풍속화가 신윤복이 그린 작품으로,<br>두 명의 기녀가 쌍검을 들고 대무(對舞)를 추는 모습을 생동감 있게 표현한다.`
              ];
              return (
                <div key={img} ref={(el) => (objectsRef.current[idx] = el)} className={`object object0${idx + 1}`}>
                  <div>
                    <div className="object_box">
                      <div className="image">
                        <div style={{ background: `url(/${img}) no-repeat center/cover` }}></div>
                      </div>
                      <div id='text_pin' className="text">
                        <h3 className="parallax__item__text t1">{titles[idx]}</h3>
                        <p dangerouslySetInnerHTML={{ __html: contents[idx] }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // 780px 이하 → Swiper 적용
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5500 }}
              speed={500}
              loop
              className="swiper-container"
            >
              {["bg_object_01.jpg", "bg_object_02.jpg", "bg_object_03.jpg", "bg_object_04.jpg", "bg_object_05.jpg", "bg_object_06.webp"].map((img, idx) => {
                const titles = ["훈민정음", "미인도", "고려청자", "고려불화", "신라금관", "쌍검대무"];
                const contents = [
                  `훈민정음(訓民正音)은 세종대왕이 1443년 창제하고 1446년 반포한 우리나라 고유 문자로,<br>"백성을 가르치는 바른 소리"라는 뜻을 가진다.`,
                  `미인도(美人圖)는 조선 후기의 대표적인 풍속화가 신윤복(申潤福, 1758~?)이 그린 작품으로,<br>한국 미술사에서 가장 유명한 미인화 중 하나다.`,
                  `고려청자는 고려 시대(918~1392)의 대표적인 도자기로,<br>세계적으로도 그 아름다움을 인정받은 한국 전통 문화유산이다.`,
                  `고려불화(高麗佛畵)는 고려 시대(918~1392)에 제작된 불교 회화로,<br>동양 불교 미술의 정점으로 평가받는다.`,
                  `신라 시대(5~6세기)의 대표적인 유물로, 왕이 착용했던 화려한 황금 장식이 특징이다.<br>경주의 천마총과 금령총 등에서 출토되었으며, 신라의 세련된 금세공 기술을 보여준다.`,
                  `조선 후기 풍속화가 신윤복이 그린 작품으로,<br>두 명의 기녀가 쌍검을 들고 대무(對舞)를 추는 모습을 생동감 있게 표현한다.`
                ];
                return (
                  <SwiperSlide key={img}>
                    <div className={`object object0${idx + 1}`}>
                      <div>
                        <div className="object_box">
                          <div className="image">
                            <div style={{ background: `url(/${img}) no-repeat center/cover` }}></div>
                          </div>
                          <div id='text_pin' className="text">
                            <h3 className="parallax__item__text t1">{titles[idx]}</h3>
                            <p dangerouslySetInnerHTML={{ __html: contents[idx] }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </section>

      {/* Section 04 */}
      <section id="section04" className="section_box">
        {/* 공지사항 */}
        <div id='notice' className="media_box">
          <div className="media_box_title">
            <div>
              <h2 className="text-6xl font-eulyoo font-semibold">
                {language === 'kor' ? '공지사항' : 'Notice'}
              </h2>
              <p className="mt-3 text-lg">
                {language === 'kor' ? '간송미술관의 소식을 빠르게 알려드릴께요.' : 'We will promptly deliver the latest news about the Kansong Art Museum.'}
              </p>
            </div>
            <Link to="/Notice" className="text-lg">
              {language === 'kor' ? '간송소식 더보기' : 'View More'} 
            </Link>
          </div>
          <div className="media_box_contents">
            <table>
                  <tbody>
                    {noticeBoard.length === 0 ? (
                      <tr>
                       <td colSpan="2">게시판 항목이 없습니다</td>
                     </tr>
                    ) : (
                      noticeBoard.map((notice) => (
                        <tr key={notice.firestoreId}>
                          <td>
                            <Link to="">
                              <span className={`title_icon ${notice.category === '공지사항' ? 'notice_label' : ''}`}>{notice.label}</span>
                              <button onClick={() => titleClick(navigate, notice)}>{notice.title}</button>
                            </Link>
                          </td>
                          <td>
                            {notice.createdAt && notice.createdAt instanceof Date
                              ? notice.createdAt.toISOString().split("T")[0].replace(/-/g, ".")
                              : "날짜 없음"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
              </table>
          </div>
        </div>

        {/* 보도자료 */}
        <div id='news' className="media_box">
          <div className="media_box_title">
            <div>
              <h2 className="text-6xl font-eulyoo font-semibold">
                {language === 'kor' ? '간송뉴스' : 'News'}
              </h2>
              <p className="mt-3 text-lg">
                {language === 'kor' ? '간송미술관의 소식을 빠르게 알려드릴께요.' : 'We will promptly deliver the latest news about the Kansong Art Museum.'}
              </p>
            </div>
            
            <Link to="/News" className="text-lg">
              {language === 'kor' ? '간송뉴스 더보기' : 'View More'}
            </Link>
          </div>
          <div className="media_box_contents">
            <table>
                  <tbody>
                    {newsBoard.length === 0 ? (
                      <tr>
                       <td colSpan="2">게시판 항목이 없습니다</td>
                     </tr>
                    ) : (
                      newsBoard.map((news) => (
                        <tr key={news.firestoreId}>
                          <td>
                            <Link to="/News">
                              <span className={`title_icon ${news.category === '보도뉴스' ? 'news_label' : ''}`}>{news.label}</span>
                              <button onClick={() => titleClick(navigate, news)}>{news.title}</button>
                            </Link>
                          </td>
                          <td>
                            {news.createdAt && news.createdAt instanceof Date
                              ? news.createdAt.toISOString().split("T")[0].replace(/-/g, ".")
                              : "날짜 없음"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
              </table>
          </div>
        </div>
      </section>
      
      <section id="section05" className="section_box p-12">
          <h2 className="font-eng_Jomolhari text-5xl">Kansong Art Museum of Daegu</h2>
          <div className="section05_text_box mt-56">
            <ul className="flex justify-between font-light">
              <li>
                <p className="info_title text-lg mb-[10px]">
                  {language === 'kor' ? '오시는 길' : 'Directions'} 
                </p>
                <p>
                  <Link to="#/" onClick={(e) => {e.preventDefault(); alert("준비중입니다.");}}>
                    {language === 'kor' ? '대구광역시 수성구 미술관로 70' : '70, Misulgwan-ro, Suseong-gu, Daegu, South Korea'}
                  </Link>
                </p>
              </li>
              <li>
                <p className="info_title text-lg mb-[10px]">
                  {language === 'kor' ? '관람시간' : 'Opening Hours'}
                </p>
                <ul>
                  <li>
                    <Link to="#/" className="flex gap-2" onClick={(e) => {e.preventDefault(); alert("준비중입니다.");}}>
                      {language === 'kor'
                      ? '실내 : 오전 10시 ~ 오후 19시, 실외 : 오전 10시 ~ 오후 18시'
                      : 'Indoor : 10:00 AM ~ 7:00 PM, Outdoor : 10:00 AM ~ 6:00 PM'}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
    </div>
)};

export default Welcome;
