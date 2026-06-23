import style from "@/common/components/Search.module.css";
import Button from "@/common/components/Button";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { hookBookList } from "@hooks/bookList.hook.js";

import { searchBooks } from "@utils/searchBooks.js";

export default function Search() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [books, setBooks] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState([]);
  const searchInputRef = useRef(null);
  const searchResultRef = useRef(null);
  const hasSearchResult = searchQuery.length > 0;

  const handleClickSearch = () => {
    setIsSearchOpen((prev) => {
      if (prev) {
        setSearchText("");
        setSearchQuery([]);
      }
      return !prev;
    });
  };

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

  useEffect(() => {
    const getBooks = async () => {
      const data = await hookBookList();
      setBooks(data);
    };
    getBooks();

    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutsideResult = (event) => {
      const isInsideInput = searchInputRef.current?.contains(event.target);
      const isInsideResult = searchResultRef.current?.contains(event.target);

      if (isInsideInput || isInsideResult) return;

      setIsSearchOpen(false);
      setSearchText("");
      setSearchQuery([]);
    };

    document.addEventListener("mousedown", handleClickOutsideResult);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideResult);
    };
  }, []);

  return (
    <div className={style.searchWrap}>
      <Button className={style.search} onClick={handleClickSearch}>
        검색
      </Button>
      {isSearchOpen && (
        <textarea
          ref={searchInputRef}
          className={`${style.searchInput} ${hasSearchResult ? style.searchInputJoined : ""}`.trim()}
          placeholder="제목 혹은 저자를 검색하세요"
          value={searchText}
          onChange={handleSearchChange}
        />
      )}
      {hasSearchResult && (
        <ul ref={searchResultRef} className={style.searchResult}>
          {searchQuery.map((book) => (
            <li key={book.id}>
              <Link className={style.resultLink} to={`/books/${book.id}`}>
                <span>{book.title}</span>
                <span>{book.author}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
