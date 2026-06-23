import { useNavigate } from "react-router";

function EpisodeList({ episodes, bookId, isOwner, onEpisodeDelete }) {
  const navigate = useNavigate();

  const handleDelete = (e, episode) => {
    e.stopPropagation();
    if (!window.confirm(`"${episode.episodeTitle}" 에피소드를 삭제하시겠습니까?`)) return;
    onEpisodeDelete?.(episode.episodeId);
  };

  const handleEdit = (e, episode) => {
    e.stopPropagation();
    navigate(`/episodes/${episode.episodeId}/edit`);
  };

  return (
    <section className="episodes-section">
      <div className="episodes-header">
        <h3>에피소드</h3>
        <span>{episodes?.length ?? 0}화</span>
        {isOwner && (
          <button
            className="episode-write-btn"
            onClick={() => navigate(`/books/${bookId}/episodes/new`)}>
            + 작성
          </button>
        )}
      </div>
      {!episodes?.length ? (
        <p className="no-episodes">회차가 등록되지 않았습니다.</p>
      ) : (
        <div className="episode-list">
          {episodes.map((episode, index) => (
            <div
              key={episode.episodeId ?? index}
              className={`episode-item${isOwner ? " episode-item--owner" : ""}`}
              onClick={() => navigate(`/episodes/${episode.episodeId}`)}>
              <span className="episode-number">{episode.episodeIndex ?? index + 1}화</span>
              <span className="episode-title">{episode.episodeTitle ?? "제목 없음"}</span>
              {isOwner && (
                <div className="episode-item-actions">
                  <button
                    className="ep-item-edit"
                    onClick={(e) => handleEdit(e, episode)}
                    title="수정">
                    수정
                  </button>
                  <button
                    className="ep-item-delete"
                    onClick={(e) => handleDelete(e, episode)}
                    title="삭제">
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default EpisodeList;
