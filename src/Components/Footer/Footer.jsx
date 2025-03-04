import React, {useContext, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeaderContext } from "../../State/HeaderContext";
import { resources } from '../../State/Menu';
import footer_logo from '/footer_logo.png';
import { useLanguageStore } from "../../State/LanguageContext";
import './footer.css'

export default function Footer(){
    const {language} = useLanguageStore();
    const { setHeaderClass } = useContext(HeaderContext); // 헤더 상태 초기화 함수
    const navigate = useNavigate();
    
    // 메뉴 클릭 시 상태 초기화 및 경로 이동
    const handleMenuClick = (path) => {
        if (path === "/") {
        setHeaderClass(""); // 메인 페이지로 이동 시 초기화
        } else {
        setHeaderClass("sub_class"); // 서브 페이지로 이동 시 초기화
        }
        navigate(path); // 페이지 이동
    };

    return(
        <footer id='footer' className="flex border-t border-[#111111]">
            <div id='footer_left' className="w-[60%] p-24">
                <h2 className="footer_logo"><Link to='/'><img src={footer_logo} alt='대구 간송미술관' className="max-w-[220px] w-full"/></Link></h2>
                <ul className="footer_menu flex gap-8 flex-row flex-nowrap justify-between w-full mt-16 mb-24 text-lg font-medium text-[#111111]">
                    {resources.map(({ href, text, text_eng, subMenu }) => (
                        <li key={href}>
                            <Link to={href} onClick={()=>{handleMenuClick(href)}} className="block w-full text-lg">
                                {language === 'kor' ? text : text_eng}
                            </Link>
                            {subMenu && (
                                <ul className="footer_sub_menu mt-4">
                                {subMenu.map(({sub_href,sub_text, sub_text_eng}) => (
                                    <li key={sub_href}>
                                    <Link to={sub_href} onClick={()=>{handleMenuClick(sub_href)}} className="block w-full py-2 text-base">
                                        {language === 'kor' ? sub_text : sub_text_eng}</Link>
                                    </li>
                                ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
                <p className="text-base">© KANSONG ART MUSEUM DAEGU. All rights reserved.</p>
            </div>
            <div id='footer_right' className="w-[40%] border-l border-l-[#111111]">
                <div className="footer_right_top px-20 py-24">
                    <ul>
                        <li>
                            <p className="text-sm text-gray-400">Address</p>
                            <p className="mt-2 text-lg font-eng_noto">
                                {language === 'kor' ? '대구광역시 수성구 미술관로 70' : '70 Art Museum-ro, Suseong-gu, Daegu'}</p>
                        </li>
                        <li className="mt-10">
                            <p className="text-sm text-gray-400">Call Us</p>
                            <p className="mt-2 text-lg font-eng_noto">
                                T&#41; 053 - 793 - 2022<br/>
                                F&#41; 053 - 794 - 2022
                            </p>
                        </li>
                        <li className="mt-10">
                            <p className="text-sm text-gray-400">News</p>
                            <p className="mt-2 text-lg font-eng_noto">
                                {language === 'kor'
                                ? '언론ㆍ취재 지원 관련 문의 : 070-4280-6713 (대외협력팀)'
                                : 'Inquiries regarding media and coverage support : 070-4280-6713 (External Cooperation Team)'}
                            
                            </p>
                        </li>
                        <li className="mt-10">
                            <p className="text-sm text-gray-400">Email</p>
                            <p className="mt-2 text-lg font-eng_noto">nfo_daegu@kansong.org</p>
                        </li>
                    </ul>

                    <p className="m_add hidden text-base">© KANSONG ART MUSEUM DAEGU. All rights reserved.</p>
                </div>
                <div className="footer_right_bot px-20 py-12 border-t border-t-[#111111]">
                    <ul className="flex gap-4 justify-between">
                        <li>
                            <Link to='' className='w-full text-sm block text-center hover:underline duration-150'>
                                {language === 'kor' ? '이용약관' : 'Terms and Conditions'}
                                
                            </Link>
                        </li>
                        <li>
                            <Link to='' className='w-full text-sm block text-center hover:underline duration-150'>
                                {language === 'kor' ? '개인정보처리방침' : 'Privacy Policy'}
                            </Link>
                        </li>
                        <li>
                            <a href="https://kansong.org/foundation/index.do" target='_blank' className='w-full text-sm block text-center hover:underline duration-150'>
                                {language === 'kor' ? '간송미술재단' : 'Kansong Art Foundation'}                     
                            </a>
                        </li>
                        <li>
                            <a href="https://kansong.org/seoul/index.do" target='_blank' className='w-full text-sm block text-center hover:underline duration-150'>
                                {language === 'kor' ? '간송미술관' : 'Kansong Art Museum'}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}