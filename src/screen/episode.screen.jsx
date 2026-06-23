import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { hookEpisodes } from "@hooks/episodes.hook";
import { getUser } from "@utils/authStore";
import EpisodePlayer from "@screen/EpisodePlayer.jsx";
import "@screen/episode.screen.css";

function EpisodeScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const data = await hookEpisodes("GET", { id });
        setEpisode(data);
      } catch (err) {
        setError("에피소드를 찾을 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEpisode();
  }, [id]);

  if (isLoading) {
    return (
      <div className="episode-page">
        <p className="episode-status">에피소드를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="episode-page">
        <button className="episode-back" onClick={() => navigate(-1)}>← 뒤로 가기</button>
        <p className="episode-status">{error || "에피소드를 찾을 수 없습니다."}</p>
      </div>
    );
  }

  return (
    <div className="episode-page">
      <div className="episode-container">
        <button className="episode-back" onClick={() => navigate(-1)}>
          ← 뒤로 가기
        </button>

        <div className="episode-header">
          <span className="episode-index">{episode.episodeIndex ?? episode.episode_index}화</span>
          <h1 className="episode-title">{episode.episodeTitle ?? episode.episode_title}</h1>
          <span className="episode-view">조회수 {episode.view ?? 0}</span>
          <span className="episode-date">
            {episode.created_at
              ? new Date(episode.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>

        <div className="episode-content">
          {episode.content}
        </div>

        <EpisodePlayer ttsPath={episode.ttsPath} />
      </div>
    </div>
  );
}

export default EpisodeScreen;
