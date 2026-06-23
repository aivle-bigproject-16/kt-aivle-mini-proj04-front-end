import { useEffect, useState } from "react";
import "@screen/booklist.screen.css";
import { hookBookList } from "@hooks/bookList.hook.js";
import { Link, useOutletContext, useNavigate } from "react-router";

function BookListScreen() {
  const [bookList, setBookList] = useState([]);
  const { changeLoading } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        changeLoading(true, "도서 목록을 가져오고 있습니다.");

        const data = await hookBookList();
        if (data) {
          setBookList(data);
          changeLoading(false);
        }
      } catch (err) {
        changeLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="book-list-page">
      <main className="book-main">
        <div className="book-main-top">
          <h2>도서 목록</h2>
        </div>

        <section className="book-list">
          {bookList?.map((book, index) => (
            <div className="book-card" key={`${book.id}-${index}`}>
              <Link to={`${book.bookId}`}>
                <div className="book-cover">
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} />
                  ) : (
                    <div className="empty-cover">표지 없음</div>
                  )}
                </div>
              </Link>

              <h3>{book.title}</h3>

              <p>저자 · {book.author}</p>

              <p>{book.updatedAt?.slice(0, 10)}</p>
            </div>
          ))}

          <Link to={"submit"}>
            <div className="book-card">
              <div className="book-cover add-cover">
                <span>+</span>
                <p>새 도서 등록</p>
              </div>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default BookListScreen;
