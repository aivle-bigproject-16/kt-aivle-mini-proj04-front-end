import style from "@/common/components/Header.module.css";
import Button from "@/common/components/Button";
import { Link, useNavigate } from "react-router";
import ServiceLogo from "@/common/components/ServiceLogo";
import { hookUser, clearUser, clearAccessToken } from "@/utils/authStore";
import { useEffect, useRef, useState } from "react";
import searchStyle from "@/common/components/Search.module.css";
import { hookBookList } from "@hooks/bookList.hook.js";
import { searchBooks } from "@utils/searchBooks.js";

function HeaderBtn({ type, children }) {
  const [clicked, setClicked] = useState(false);
  const rootRef = useRef(null);
  const isSearch = type === "search";
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const searchInputRef = useRef(null);
  const hasSearchResult = searchQuery.length > 0;
  const buttonClassName = `${style["header-btn"]} ${
    isSearch && clicked ? style["search-active"] : ""
  }`;

  useEffect(() => {
    const loadAlarms = async () => {
      const response = await fetch("/alarm_data.json");
      const data = await response.json();
      setAlarms(data.alarms ?? []);
    };

    loadAlarms();

    if (isSearch) {
      const getBooks = async () => {
        const data = await hookBookList();
        setBooks(data);
      };
      getBooks();
    }

    const handleOutsideClick = (event) => {
      if (!rootRef.current || rootRef.current.contains(event.target)) {
        return;
      }
      setClicked(false);
      setSearchText("");
      setSearchQuery([]);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSearch]);

  useEffect(() => {
    if (clicked) searchInputRef.current?.focus();
  }, [clicked]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchText(query);

    if (!query.trim()) {
      setSearchQuery([]);
      return;
    }
    const res = searchBooks(books, query);
    setSearchQuery(res);
  };

  const handleResultClick = () => {
    setClicked(false);
    setSearchText("");
    setSearchQuery([]);
  };

  const renderAlarmContent = (alarm) => {
    return (
      <span className={searchStyle.alarmContent}>
        {alarm.content.split(/(<book>.*?<\/book>)/g).map((part, index) => {
          const bookMatch = part.match(/<book>(.*?)<\/book>/);

          if (bookMatch) {
            return (
              <Link
                key={`${alarm.id}-link-${index}`}
                className={searchStyle.alarmLink}
                to={`/books/${alarm.bookId}`}
                onClick={() => {
                  handleResultClick();
                }}>
                {bookMatch[1]}
              </Link>
            );
          }

          return <span key={`${alarm.id}-text-${index}`}>{part}</span>;
        })}
      </span>
    );
  };
  return (
    <div ref={rootRef}>
      <div style={{ position: "relative" }}>
        <Button
          className={buttonClassName}
          onClick={() => {
            if (isSearch) {
              if (!clicked) setClicked(true);
              return;
            }

            setClicked((prev) => !prev);
          }}>
          <div className={style["header-icon-wrap"]}>
            <img
              src={`/${type}.svg`}
              alt={type}
              className={style["header-icon"]}
            />
            {isSearch && (
              <input
                ref={searchInputRef}
                type="text"
                className={style["header-input"]}
                value={searchText}
                onChange={handleSearchChange}
                placeholder="제목 혹은 저자를 검색하세요"
              />
            )}
          </div>
          <span className={`${style["header-btn-text"]}`}>{children}</span>
        </Button>

        {isSearch && searchText.trim() && (
          <ul className={searchStyle.searchResult}>
            {hasSearchResult ? (
              searchQuery.map((book) => (
                <li key={book.id}>
                  <Link
                    className={searchStyle.resultLink}
                    onClick={handleResultClick}
                    to={`/books/${book.id}`}>
                    <span>{book.title}</span>
                    <span>{book.author}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className={searchStyle.resultLink}>
                <span>찾으시는 검색어 결과가 없습니다.</span>
              </li>
            )}
          </ul>
        )}

        {!isSearch && clicked && (
          <ul
            className={`${searchStyle.searchResult} ${searchStyle.alarmResult}`}>
            {alarms.length > 0 ? (
              alarms.flatMap((alarm, index) => {
                const alarmItems = [
                  <li key={alarm.id} className={searchStyle.alarmItem}>
                    {renderAlarmContent(alarm)}
                  </li>,
                ];

                if (index < alarms.length - 1) {
                  alarmItems.push(
                    <li
                      key={`${alarm.id}-divider`}
                      className={searchStyle.alarmDivider}
                      aria-hidden="true"
                    />,
                  );
                }

                return alarmItems;
              })
            ) : (
              <li className={searchStyle.alarmItem}>
                <span>알림이 없습니다.</span>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

function Header() {
  const user = hookUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    clearAccessToken();
    navigate("/");
  };

  return (
    <header>
      <Link to={"/"}>
        <ServiceLogo />
      </Link>
      <div className={style.btBox}>
        <HeaderBtn type="search">검색</HeaderBtn>
        <HeaderBtn type="alarm">알림</HeaderBtn>
        {user ? (
          <Button className={`${style["header-btn"]} ${style["auth-btn"]}`} onClick={handleLogout}>
            <span className={style["header-btn-text"]}>로그아웃</span>
          </Button>
        ) : (
          <Button className={`${style["header-btn"]} ${style["auth-btn"]}`} onClick={() => navigate("/login")}>
            <span className={style["header-btn-text"]}>로그인</span>
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
