import React, { useEffect, useState, createContext, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HeaderProvider } from "./State/HeaderContext.jsx";
import Layout from "./Layout";
import NotFound from "./Notfound/NotFound.jsx";
import Lenis from "@studio-freight/lenis";
import "./App.css";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "./firebase";
import useAuthStore from "./Pages/Board/store/useAuthStore";

//`lazy()`로 동적 import 적용 (각 페이지별로 필요할 때만 로드)
const Welcome = lazy(() => import("./Components/Main/Welcome"));
const Intro = lazy(() => import("./Intro/Intro.jsx"));
const Admin = lazy(() => import("./Admin.jsx"));

// 서브페이지 (코드 스플리팅 적용)
const SubVisual = lazy(() => import("./State/subVisual/Sub_Visual.jsx"));
const About01 = lazy(() => import("./Pages/About/About01.jsx"));
const About05 = lazy(() => import("./Pages/About/About05.jsx"));
const Info01 = lazy(() => import("./Pages/Info/Info01.jsx"));
const Collection01 = lazy(() => import("./Pages/Collection/Collection01.jsx"));
const Restore01 = lazy(() => import("./Pages/Restore/Restore01.jsx"));
const AllBoard = lazy(() => import('./Pages/Board/All/AllBoard.jsx'));
const Notice = lazy(() => import("./Pages/Board/Notice/Notice.jsx"));
const News = lazy(() => import("./Pages/Board/News/News.jsx"));
const CreateNotice = lazy(() => import("./Pages/Board/store/CreateNotice.jsx"));
const BoardView = lazy(() => import("./Pages/Board/store/BoardView.jsx"));
const SearchBoard = lazy(() => import("./Pages/Board/SearchBoard/SearchBoard.jsx"));
const UpdateBoard = lazy(() => import("./Pages/Board/UpdateBoard/UpdateBoard.jsx"));

// Lenis Context 생성
export const LenisContext = createContext();

function AppContent() {
  const [lenisInstance, setLenisInstance] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();
  const fetchUserRole = useAuthStore((state) => state.fetchUserRole);

  // 인트로 종료 후 실행
  const handleIntroFinish = () => {
    setShowIntro(false);
  };

  // Firebase Auth 유지 설정
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log("Firebase persistence set to browserLocalPersistence"))
      .catch((error) => console.error("Firebase persistence 설정 실패:", error));
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) fetchUserRole();
    });
  }, []);

  // Lenis 스크롤 설정
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      smoothTouch: true,
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    setLenisInstance(lenis);

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      <HeaderProvider>
        <div id="wrapper">
          {showIntro && location.pathname === "/" ? (
            <Suspense fallback={<div>로딩 중...</div>}>
              <Intro onFinish={handleIntroFinish} />
            </Suspense>
          ) : (
            <Suspense fallback={<div className="loading"><i className="xi-spinner-1"></i></div>}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Welcome />} />
                  <Route element={<SubVisual />}>
                    <Route path="About01" element={<About01 />} />
                    <Route path="About05" element={<About05 />} />
                    <Route path="Info01" element={<Info01 />} />
                    <Route path="Collection01" element={<Collection01 />} />
                    <Route path="Restore01" element={<Restore01 />} />
                    <Route path="TotalBoard" element={<AllBoard />} />
                    <Route path="Notice" element={<Notice />} />
                    <Route path="News" element={<News />} />
                    <Route path="CreateNotice" element={<CreateNotice />} />
                    <Route path="BoardView/:id" element={<BoardView />} />
                    <Route path="SearchBoard" element={<SearchBoard />} />
                    <Route path="UpdateBoard/:id" element={<UpdateBoard />} />
                  </Route>
                </Route>

                <Route path="/Admin" element={<Admin />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          )}
        </div>
      </HeaderProvider>
    </LenisContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter basename="/">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
