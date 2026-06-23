import coverLogo from "/service-logo.svg";
import { useEffect, useEffectEvent, useState } from "react";
import { Link, useOutletContext } from "react-router";
import { hookMainStats } from "@hooks/mainStats.hook.js";
import "@screen/main.screen.css";
import logoStyle from "@/common/components/ServiceLogo.module.css";

const statLabels = {
  totalBookCount: "등록 도서",
  coverBookCount: "표지 생성 도서",
  likedBookCount: "선호 도서",
};

const defaultStats = {
  totalBookCount: 0,
  coverBookCount: 0,
  likedBookCount: 0,
};

function MainScreen() {
  const [statsData, setStatsData] = useState(defaultStats);
  const { changeLoading } = useOutletContext();
  const handleLoading = useEffectEvent((status, message = "") => {
    changeLoading(status, message);
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        handleLoading(true, "도서 현황을 불러오고 있습니다.");
        const data = await hookMainStats();
        setStatsData({ ...defaultStats, ...data });
      } catch (error) {
        setStatsData(defaultStats);
      } finally {
        handleLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = Object.entries(statLabels).map(([key, label]) => ({
    value: statsData[key],
    label,
  }));

  return (
    <div className="main-page">
      <main>
        <section className="hero">
          <div className="main-shell hero-content">
            <div className="hero-mark">
              <img src={coverLogo} alt="CoverAI" />
              <h3 className={logoStyle["text-logo"]}>PIC:STORY</h3>
            </div>
            <h1>도서 관리 시스템에 오신 것을 환영합니다!</h1>
            <p className="hero-subtext">
              예비 작가들의 창작 활동을 AI 표지 자동 생성으로 응원합니다.
            </p>
            <div className="hero-actions">
              <Link to={"/books"}>
                <button type="button" className="hero-btn">
                  도서 목록
                </button>
              </Link>
              <Link to={"/books/submit"}>
                <button type="button" className="hero-btn ghost">
                  새 도서 등록
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="도서 현황">
          <div className="main-shell stats-grid">
            {stats.map((item) => (
              <div className="stat" key={item.label}>
                <span className="stat-value">{item.value}</span>
                <span className="stat-label">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainScreen;
