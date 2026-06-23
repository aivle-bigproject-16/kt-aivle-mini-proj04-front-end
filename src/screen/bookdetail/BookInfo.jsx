import { getUser } from "@utils/authStore";
import HeartIcon from "@/assets/heart.svg?react";

function BookInfo({ bookData, isLiked, likeCount, isLikeLoading, onLikeToggle, onEdit, onDelete }) {
  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isOwner = !!getUser()?.usersId && getUser()?.usersId === bookData.usersId;

  return (
    <>
      <h2 className="book-title">{bookData.title}</h2>
      <p className="book-author">저자: {bookData.author}</p>

      <h3 className="content-label">내용</h3>
      <div className="content-box">
        <p>{bookData.description}</p>
      </div>

      <div className="book-date-like">
        <p className="book-date">등록일: {formatDate(bookData.createdAt)}</p>
        <div className="like-wrapper">
          <button
            type="button"
            className={`like-button ${isLiked ? "liked" : ""}`}
            aria-label="좋아요"
            title={!getUser() ? "로그인 후 이용 가능합니다" : "좋아요"}
            onClick={onLikeToggle}
            disabled={isLikeLoading || !getUser()}>
            <HeartIcon aria-hidden="true" focusable="false" />
          </button>
          <span className="like-count">{likeCount}</span>
        </div>
      </div>

      {isOwner && (
        <div className="action-buttons">
          <button className="btn-edit" onClick={onEdit}>수정</button>
          <button className="btn-delete" onClick={onDelete}>삭제</button>
        </div>
      )}
    </>
  );
}

export default BookInfo;
