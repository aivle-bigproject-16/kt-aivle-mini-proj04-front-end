function BookCover({ title, cover }) {
  const hasCoverImage = cover && cover.trim() !== "";

  return (
    <div className="book-cover">
      {hasCoverImage ? (
        <img src={cover} alt={`${title} 표지`} />
      ) : (
        <div className="book-cover-placeholder">
          <span className="placeholder-icon">📖</span>
          <span className="placeholder-text">{title}</span>
        </div>
      )}
    </div>
  );
}

export default BookCover;
