import { Link } from "react-router";
import "@screen/NotFound.screen.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <main>
        <section className="hero">
          <div className="main-shell hero-content">
            <div className="error-mark">
              <div className="error-icon">404</div>
            </div>
            <h1>페이지를 찾을 수 없습니다</h1>
            <p className="hero-subtext">
              요청하신 페이지가 없거나 이동되었을 수 있습니다.
            </p>
            <div className="hero-actions">
              <Link to={"/"}>
                <button type="button" className="hero-btn">
                  홈으로 돌아가기
                </button>
              </Link>
              <Link to={"/books"}>
                <button type="button" className="hero-btn ghost">
                  도서 목록
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NotFound;
