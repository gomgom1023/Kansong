import { useLocation } from "react-router-dom";
import './notfound.css';

export default function NotFound() {
  const location = useLocation();
  console.log("404 NotFound 페이지 접근: ", location.pathname);

  return (
    <section id="notfound">
        <div>
            <h2>페이지를 찾을 수 없습니다.</h2>
            <p>요청된 경로: {location.pathname}</p>
            <a href="/">메인페이지로 돌아가기</a>
        </div>
    </section>
  );
}
