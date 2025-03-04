import React, { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LenisContext } from "./App"; // LenisContext 가져오기
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import { HeaderContext } from "./State/HeaderContext.jsx";

const Layout = () => {
  const { setHeaderClass } = useContext(HeaderContext);
  const lenis = useContext(LenisContext); // Lenis 가져오기
  const location = useLocation();

  useEffect(() => {
    const isMainPage = location.pathname === "/";

    if (isMainPage) {
      setHeaderClass("");
    } else {
      setHeaderClass("sub_class");
    }
  }, [location.pathname, setHeaderClass]);

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1 }); // Lenis로 스크롤 최상단 이동
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenis, location.pathname]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
