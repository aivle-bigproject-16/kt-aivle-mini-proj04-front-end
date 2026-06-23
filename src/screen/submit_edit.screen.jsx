import "@screen/submit_edit.screen.css";

import { useState, useEffect, useRef } from "react";
import { hookBooks, hookBookCover } from "@hooks/books.hook.js";
import { useNavigate, useLocation } from "react-router-dom";
import AICoverGenerator from "@screen/AICoverGenerator.jsx";
import { getUser } from "@utils/authStore";

function SubmitEdit() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
    cover: "",
  });
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();

  const titleCountRef = useRef(null);
  const authorCountRef = useRef(null);
  const contentCountRef = useRef(null);

  const syncCounter = (ref, value, max, isContent) => {
    if (!ref.current) return;
    const len = value.length;
    ref.current.textContent = `${len}/${max}`;
    ref.current.className = `char-counter${len > max ? " over" : isContent && len < 10 && len > 0 ? " under" : ""}`;
  };

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await hookBooks("GET", { id });
        setForm({
          id,
          usersId: getUser()?.usersId,
          title: res.title,
          author: res.author,
          content: res.content,
          cover: res.cover || "",
        });
        setAudioUrl(
          res.audioUrl || localStorage.getItem(`audio_${res.id}`) || "",
        );
        requestAnimationFrame(() => {
          syncCounter(titleCountRef, res.title || "", 100, false);
          syncCounter(authorCountRef, res.author || "", 50, false);
          syncCounter(contentCountRef, res.content || "", 5000, true);
        });
      } catch (error) {
        alert("도서 정보를 불러오는 데 실패했습니다.");
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }
    if (!form.author.trim()) {
      alert("저자를 입력하세요.");
      return;
    }
    if (!form.content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }
    if (form.title.trim().length > 100) {
      alert("제목은 100자 이하로 입력하세요.");
      return;
    }
    if (form.author.trim().length > 50) {
      alert("저자는 50자 이하로 입력하세요.");
      return;
    }
    if (form.content.trim().length < 10) {
      alert("내용을 10자 이상 입력하세요.");
      return;
    }
    if (form.content.trim().length > 5000) {
      alert("내용은 5000자 이하로 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await hookBooks(id ? "PATCH" : "POST", {
        id,
        title: form.title,
        author: form.author,
        content: form.content,
        usersId: form.usersId ?? getUser()?.usersId,
      });

      if (form.cover) {
        await hookBookCover(res.id, form.cover);
      }

      alert(id ? "도서가 수정되었습니다." : "도서가 등록되었습니다.");

      if (id) {
        navigate(-1);
      } else {
        if (audioUrl) {
          await hookBooks("PATCH", { id: res.id, audioUrl });
        }
        setForm({ title: "", author: "", content: "", cover: "" });
      }
    } catch (error) {
      alert(id ? "도서 수정에 실패했습니다." : "도서 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="main">
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 뒤로가기
          </button>
        </div>

        <section className="content">
          <section className="form-card">
            <div className="form-title">
              {id ? "도서 수정" : "새 도서 등록"}
            </div>

            <form className="book-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="title">제목</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  disabled={isGenerating}
                  value={form.title}
                  onChange={handleChange}
                  onCompositionEnd={handleChange}
                  onInput={(e) =>
                    syncCounter(titleCountRef, e.target.value, 100, false)
                  }
                  placeholder="제목을 입력하세요 (최대 100자)"
                />
                <span
                  ref={titleCountRef}
                  className={`char-counter${form.title.length > 100 ? " over" : ""}`}>
                  {form.title.length}/100
                </span>
              </div>

              <div className="form-field">
                <label htmlFor="author">저자</label>
                <input
                  id="author"
                  type="text"
                  name="author"
                  value={form.author}
                  disabled={isGenerating}
                  onChange={handleChange}
                  onCompositionEnd={handleChange}
                  onInput={(e) =>
                    syncCounter(authorCountRef, e.target.value, 50, false)
                  }
                  placeholder="저자를 입력하세요 (최대 50자)"
                />
                <span
                  ref={authorCountRef}
                  className={`char-counter${form.author.length > 50 ? " over" : ""}`}>
                  {form.author.length}/50
                </span>
              </div>

              <div className="form-field">
                <label htmlFor="content">내용</label>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  disabled={isGenerating}
                  onChange={handleChange}
                  onCompositionEnd={handleChange}
                  onInput={(e) =>
                    syncCounter(contentCountRef, e.target.value, 5000, true)
                  }
                  placeholder="내용을 입력하세요 (10자 이상, 최대 5000자)"
                />
                <span
                  ref={contentCountRef}
                  className={`char-counter${form.content.length > 5000 ? " over" : form.content.length < 10 && form.content.length > 0 ? " under" : ""}`}>
                  {form.content.length}/5000
                </span>
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate(-1)}>
                  취소
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading || isGenerating}>
                  {loading
                    ? "저장 중..."
                    : isGenerating
                      ? "생성 중..."
                      : id
                        ? "수정"
                        : "저장"}
                </button>
              </div>
            </form>
          </section>

          <section className="ai-section">
            <div className="form-title">AI 표지 생성</div>

            <div className="ai-body">
              <AICoverGenerator
                book={{
                  title: form.title,
                  author: form.author,
                  content: form.content,
                  cover: form.cover,
                }}
                setForm={setForm}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default SubmitEdit;
