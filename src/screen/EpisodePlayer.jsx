function EpisodePlayer({ ttsPath }) {
  const hasAudio = !!ttsPath;

  return (
    <div className={`ep-player${hasAudio ? "" : " ep-player--disabled"}`}>
      <span className="ep-player-label">🎧 오디오북</span>
      {hasAudio ? (
        <audio className="ep-player-audio" controls src={ttsPath} />
      ) : (
        <div className="ep-player-empty">오디오북이 없습니다.</div>
      )}
    </div>
  );
}

export default EpisodePlayer;
