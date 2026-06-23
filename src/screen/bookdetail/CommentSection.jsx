import { getUser } from "@utils/authStore";

function CommentItem({ comment, editingId, editingContent, onEdit, onEditChange, onEditSubmit, onEditCancel, onDelete }) {
  const isOwner = !!getUser()?.usersId && getUser()?.usersId === comment.usersId;
  const isEditing = editingId === comment.commentsId;

  return (
    <article className="comment-item">
      <div className="comment-meta">
        <span className="comment-user">{comment.authorName}</span>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isOwner && (
          <div className="comment-actions">
            <button type="button" className="comment-edit" onClick={() => onEdit(comment)}>수정</button>
            <button type="button" className="comment-delete" onClick={() => onDelete(comment.commentsId)}>삭제</button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="comment-edit-form">
          <textarea
            className="comment-input"
            value={editingContent}
            onChange={(e) => onEditChange(e.target.value)}
            rows={3}
          />
          <div className="comment-edit-actions">
            <button type="button" className="btn-edit comment-submit" onClick={() => onEditSubmit(comment.commentsId)}>저장</button>
            <button type="button" className="comment-delete" onClick={onEditCancel}>취소</button>
          </div>
        </div>
      ) : (
        <p className="comment-text">{comment.content}</p>
      )}
    </article>
  );
}

function CommentPagination({ currentPage, hasNextPage, onPageChange }) {
  const lastKnown = currentPage + 1;
  const pages = Array.from({ length: lastKnown }, (_, i) => i);

  if (lastKnown <= 1 && !hasNextPage) return null;

  return (
    <div className="comment-pagination">
      {pages.map((page) => (
        <button
          key={page}
          className={`comment-page-btn${page === currentPage ? " active" : ""}`}
          onClick={() => onPageChange(page)}>
          {page + 1}
        </button>
      ))}
      {hasNextPage && (
        <button
          className="comment-page-btn"
          onClick={() => onPageChange(currentPage + 1)}>
          {currentPage + 2}
        </button>
      )}
    </div>
  );
}

function CommentSection({
  comments,
  commentInput,
  commentError,
  currentPage,
  hasNextPage,
  editingId,
  editingContent,
  onCommentInputChange,
  onCommentSubmit,
  onCommentDelete,
  onCommentEdit,
  onCommentEditChange,
  onCommentEditSubmit,
  onCommentEditCancel,
  onPageChange,
}) {
  return (
    <section className="comments-section">
      <div className="comments-header">
        <h3>댓글</h3>
        <span>{comments.length}개</span>
      </div>

      {getUser() ? (
        <form className="comment-form" onSubmit={onCommentSubmit}>
          <textarea
            value={commentInput}
            onChange={(e) => onCommentInputChange(e.target.value)}
            placeholder="댓글을 입력하세요."
            rows={4}
            className="comment-input"
          />
          {commentError && <p className="comment-error">{commentError}</p>}
          <button type="submit" className="btn-edit comment-submit">댓글 등록</button>
        </form>
      ) : (
        <p className="comment-login-notice">
          댓글을 작성하려면 <a href="/login">로그인</a>이 필요합니다.
        </p>
      )}

      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="no-comments">첫 번째 댓글을 남겨보세요.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.commentsId}
              comment={comment}
              editingId={editingId}
              editingContent={editingContent}
              onEdit={onCommentEdit}
              onEditChange={onCommentEditChange}
              onEditSubmit={onCommentEditSubmit}
              onEditCancel={onCommentEditCancel}
              onDelete={onCommentDelete}
            />
          ))
        )}
      </div>

      <CommentPagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        onPageChange={onPageChange}
      />
    </section>
  );
}

export default CommentSection;
