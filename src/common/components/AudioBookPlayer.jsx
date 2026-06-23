function AudioBookPlayer({ audioUrl, bookId }) {
  const src = audioUrl || localStorage.getItem(`audio_${bookId}`);
  if (!src) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <h4 style={{ margin: '0 0 8px', fontSize: '15px' }}>🎧 오디오북</h4>
      <audio controls src={src} style={{ width: '100%' }} />
    </div>
  );
}

export default AudioBookPlayer;
