import { useEffect, useState } from "react";
import { gsap } from "gsap";
import "./intro.css";
import headerLogo from '/header_logo.png'

const Intro = ({onFinish}) => {
    const [showIntro, setShowIntro] = useState(true);
    
    useEffect(() => {
        const tl = gsap.timeline();

        tl
        .to(".intro-container", {
            opacity: 0,
            duration: 1.5,
            delay: 2, // 화면이 일정 시간 유지된 후 사라짐
            ease: "power2.inOut",
            onComplete: () => {
                setShowIntro(false);
                onFinish();
            }
        },'<');

    }, [onFinish]);

    if (!showIntro) return null;

    return(
        <div className="intro-container">
            <h1 className="intro_logo"><img src={headerLogo} alt="대구 간송미술관"/></h1>
        </div>
    )
}

export default Intro;