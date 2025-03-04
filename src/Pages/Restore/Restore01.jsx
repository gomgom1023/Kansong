import React, { useState, useEffect, useRef } from "react";
import './css/restore01.css';

const Restore01 = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return(
        <div className="sub_wrap">
            <div className="restore01_text_con">
                <div className="restore01_text_con_title">
                    <div>
                        <h3 className="text-img font-eulyoo">
                            “문화유산의 아름다움을 되살리다”
                        </h3>
                        <p>
                            수리복원은 전통공예기술과 현대과학기술을 바탕으로 손상된 문화유산을 원형에 가깝게 수리하고 복원하며
                            이를 통해 수명을 연장시키는 분야입니다.<br/>
                            수리복원을 진행할 때는 우선 문화유산의 상태를 조사하고 정밀진단을 위한 과학적 분석을 수행합니다.<br/>
                            이를 바탕으로 맞춤형 보존처리를 진행하여 문화유산이 온전하게 보존될 수 있도록 합니다.
                        </p>
                    </div>
                </div>
                <div className="restore_list_wrap">
                    <ul>
                        <li onClick={()=>toggleAccordion(0)} className={activeIndex === 0 ? 'active' : ''}>
                            <h4>
                                <strong>#01</strong>
                                전통미술 복원을 위한 연구 공간
                                <i className="xi-plus-circle"></i>
                            </h4>
                            <div className={`restore_list_bot restore_list_bot_01 ${activeIndex === 0 ? 'open' : ''}`}>
                                <div></div>
                                <ul>
                                    <li>
                                        <strong><i className="xi-message"></i> 수리복원이란 무엇인가요?</strong>
                                        <p><i className="xi-forum-o"></i> 수리복원은 전통공예기술과 현대과학기술을 바탕으로 손상된 문화유산을 원형에 가깝게 수리하고 복원하며, 이를 통해 수명을 연장시키는 분야입니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 수리복원은 어떤 과정으로 이루어지나요?</strong>
                                        <p><i className="xi-forum-o"></i> 수리복원을 진행할 때는 우선 문화유산의 상태를 조사하고, 정밀진단을 위한 과학적 분석을 수행합니다. 이를 바탕으로 맞춤형 보존처리를 진행하여 문화유산이 온전하게 보존될 수 있도록 합니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 수리복원에서 전통공예기술과 현대과학기술이 어떻게 활용되나요?</strong>
                                        <p><i className="xi-forum-o"></i> 전통공예기술은 문화유산의 원형을 복원하는 데 필수적인 기법을 제공하며, 현대과학기술은 정밀진단 및 분석을 통해 보다 체계적이고 효과적인 복원 방법을 지원합니다.</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li onClick={()=>toggleAccordion(1)} className={activeIndex === 1 ? 'active' : ''}>
                            <h4>
                                <strong>#02</strong>
                                디지털 기술을 활용한 정밀 분석
                                <i className="xi-plus-circle"></i>
                            </h4>
                            <div className={`restore_list_bot restore_list_bot_02 ${activeIndex === 1 ? 'open' : ''}`}>
                                <div></div>
                                <ul>
                                    <li>
                                        <strong><i className="xi-message"></i> 문화재 복원에서 디지털 기술은 어떤 역할을 하나요?</strong>
                                        <p><i className="xi-forum-o"></i> 복원가는 디지털 현미경을 활용하여 문화재의 손상된 부분을 정밀하게 분석합니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 디지털 현미경을 활용하면 어떤 점이 좋은가요?</strong>
                                        <p><i className="xi-forum-o"></i> 디지털 현미경을 사용하면 원래의 채색층과 손상된 부위를 보다 정밀하게 확인할 수 있으며, 이를 통해 복원에 필요한 재료와 기법을 결정할 수 있습니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 디지털 분석이 특히 중요한 문화재 유형이 있나요?</strong>
                                        <p><i className="xi-forum-o"></i>  특히 전통 초상화나 고서화의 미세한 붓질을 연구하는 데 디지털 분석이 필수적인 과정입니다.</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li onClick={()=>toggleAccordion(2)} className={activeIndex === 2 ? 'active' : ''}>
                            <h4>
                                <strong>#03</strong>
                                문화재 복원의 첫걸음, 표면 오염 제거
                                <i className="xi-plus-circle"></i>
                            </h4>
                            <div className={`restore_list_bot restore_list_bot_03 ${activeIndex === 2 ? 'open' : ''}`}>
                                <div></div>
                                <ul>
                                    <li>
                                        <strong><i className="xi-message"></i> 문화재 복원 과정에서 표면 오염 제거는 왜 중요한가요?</strong>
                                        <p><i className="xi-forum-o"></i> 복원가는 문화재 표면의 오염물을 정밀하게 제거하여 원래의 형태를 회복합니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 문화재 표면의 오염물을 제거할 때 어떤 방법이 사용되나요?</strong>
                                        <p><i className="xi-forum-o"></i> 이 과정에서는 부드러운 재료를 사용하여 문서나 회화의 손상을 최소화하며 보존성을 높입니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 표면 오염 제거 과정에서 주의해야 할 점은 무엇인가요?</strong>
                                        <p><i className="xi-forum-o"></i>  문화재의 재질과 상태에 따라 적절한 방법을 선택해야 하며, 과도한 세척은 오히려 손상을 초래할 수 있기 때문에 신중한 접근이 필요합니다.</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li onClick={() => toggleAccordion(3)} className={activeIndex === 3 ? 'active' : ''}>
                            <h4>
                                <strong>#04</strong>
                                전통 안료의 비밀과 색상의 복원
                                <i className="xi-plus-circle"></i>
                            </h4>
                            <div className={`restore_list_bot restore_list_bot_04 ${activeIndex === 3 ? 'open' : ''}`}>
                                <div></div>
                                <ul>
                                    <li>
                                        <strong><i className="xi-message"></i> 전통 안료는 어떻게 제작되었나요?</strong>
                                        <p><i className="xi-forum-o"></i> 전통 안료는 천연 광물, 식물, 동물성 물질에서 추출되며, 문화재의 원래 색상을 재현하는 데 중요한 역할을 합니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 복원 과정에서 전통 안료를 어떻게 활용하나요?</strong>
                                        <p><i className="xi-forum-o"></i> 과학적 분석을 통해 기존 안료 성분을 파악한 후, 전통 기법을 이용해 유사한 색조를 재현합니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 전통 안료와 현대 안료의 차이점은 무엇인가요?</strong>
                                        <p><i className="xi-forum-o"></i> 전통 안료는 자연에서 얻어진 순수한 색상을 제공하지만, 현대 안료는 내구성과 안정성을 강화하여 복원에 활용됩니다.</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li onClick={() => toggleAccordion(4)} className={activeIndex === 4 ? 'active' : ''}>
                            <h4>
                                <strong>#05</strong>
                                금속 문화재의 보존과 복원 기술
                                <i className="xi-plus-circle"></i>
                            </h4>
                            <div className={`restore_list_bot restore_list_bot_05 ${activeIndex === 4 ? 'open' : ''}`}>
                                <div></div>
                                <ul>
                                    <li>
                                        <strong><i className="xi-message"></i> 금속 문화재는 왜 특별한 관리가 필요한가요?</strong>
                                        <p><i className="xi-forum-o"></i> 금속은 공기 중 수분과 화학반응을 일으켜 부식되기 쉬우므로, 정밀한 보존 처리가 필요합니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 금속 문화재의 복원 과정에서 가장 중요한 단계는?</strong>
                                        <p><i className="xi-forum-o"></i> 표면 부식 제거 후 보호 코팅을 적용하는 과정이 핵심이며, 부식 방지 처리가 필수적입니다.</p>
                                    </li>
                                    <li>
                                        <strong><i className="xi-message"></i> 금속 문화재 복원에 사용되는 현대 기술은?</strong>
                                        <p><i className="xi-forum-o"></i> X-ray 분석을 통해 내부 손상 상태를 파악하고, 레이저 클리닝 기법으로 부식을 정밀하게 제거할 수 있습니다.</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Restore01