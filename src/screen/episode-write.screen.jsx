import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { hookEpisodes } from "@hooks/episodes.hook";
import { getUser } from "@utils/authStore";
import TtsGenerator from "@screen/tts_mp3.jsx";
import "@screen/episode-write.screen.css";

function EpisodeWriteScreen() {
  const { bookId, id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({ episodeTitle: "", episodeIndex: "", content: "", ttsPath: "" });
  const [apiKey, setApiKey] = useState("");
  const episodeMeta = useRef({ episodeId: null, bookId: null, usersId: null, episodeIndex: null });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const titleCountRef = useRef(null);
  const contentCountRef = useRef(null);

  const syncCounter = (ref, value, max) => {
    if (!ref.current) return;
    const len = value.length;
    ref.current.textContent = `${len}/${max}`;
    ref.current.className = `ep-char-counter${len > max ? " over" : ""}`;
  };

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const data = await hookEpisodes("GET", { id });
        const title = data.episodeTitle ?? data.episode_title ?? "";
        const content = data.content ?? "";
        const episodeIndex = data.episodeIndex ?? data.episode_index ?? "";
        setForm({ episodeTitle: title, episodeIndex: String(episodeIndex), content });
        episodeMeta.current = {
          episodeId: data.episodeId ?? Number(id),
          bookId: data.bookId,
          usersId: data.usersId,
          episodeIndex: data.episodeIndex ?? data.episode_index,
        };
        requestAnimationFrame(() => {
          syncCounter(titleCountRef, title, 100);
          syncCounter(contentCountRef, content, 10000);
        });
      } catch (err) {
        setFetchError("에피소드를 불러오는 데 실패했습니다.");
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.episodeTitle.trim()) {
      alert("제목을 입력하세요.");
      return;
    }
    if (form.episodeTitle.trim().length > 100) {
      alert("제목은 100자 이하로 입력하세요.");
      return;
    }
    if (!form.episodeIndex || isNaN(Number(form.episodeIndex)) || Number(form.episodeIndex) < 1) {
      alert("회차 번호를 올바르게 입력하세요.");
      return;
    }
    if (!form.content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }
    if (form.content.trim().length < 10) {
      alert("내용을 10자 이상 입력하세요.");
      return;
    }
    if (form.content.trim().length > 10000) {
      alert("내용은 10000자 이하로 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        const meta = episodeMeta.current;
        await hookEpisodes("PATCH", {
          id,
          episodeId: meta.episodeId ?? Number(id),
          bookId: meta.bookId,
          usersId: meta.usersId ?? getUser()?.usersId,
          episodeIndex: meta.episodeIndex,
          episodeTitle: form.episodeTitle.trim(),
          content: form.content.trim(),
          ttsPath: form.ttsPath || undefined,
        });
        alert("에피소드가 수정되었습니다.");
        navigate(`/episodes/${id}`);
      } else {
        const res = await hookEpisodes("POST", {
          bookId: Number(bookId),
          usersId: getUser()?.usersId,
          episodeTitle: form.episodeTitle.trim(),
          episodeIndex: Number(form.episodeIndex),
          content: form.content.trim(),
          ttsPath: form.ttsPath || undefined,
        });
        alert("에피소드가 등록되었습니다.");
        navigate(`/episodes/${res.episodeId ?? res.id}`);
      }
    } catch (err) {
      alert(isEdit ? "수정 중 오류가 발생했습니다." : "등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return (
      <div className="ep-write-page">
        <p className="ep-write-error">{fetchError}</p>
      </div>
    );
  }

  return (
    <div className="ep-write-page">
      <div className="ep-write-container">
        <button className="ep-write-back" onClick={() => navigate(-1)}>
          ← 뒤로 가기
        </button>

        <h2 className="ep-write-heading">
          {isEdit ? "에피소드 수정" : "에피소드 작성"}
        </h2>

        <form className="ep-write-form" onSubmit={handleSubmit}>
          <div className="ep-write-field ep-write-field--narrow">
            <label htmlFor="episodeIndex">회차</label>
            <input
              id="episodeIndex"
              name="episodeIndex"
              type="number"
              min="1"
              value={form.episodeIndex}
              onChange={handleChange}
              placeholder="예) 1"
            />
          </div>

          <div className="ep-write-field">
            <label htmlFor="episodeTitle">제목</label>
            <input
              id="episodeTitle"
              name="episodeTitle"
              type="text"
              value={form.episodeTitle}
              onChange={handleChange}
              onInput={(e) => syncCounter(titleCountRef, e.target.value, 100)}
              placeholder="제목을 입력하세요 (최대 100자)"
            />
            <span
              ref={titleCountRef}
              className={`ep-char-counter${form.episodeTitle.length > 100 ? " over" : ""}`}>
              {form.episodeTitle.length}/100
            </span>
          </div>

          <div className="ep-write-field">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              onInput={(e) => syncCounter(contentCountRef, e.target.value, 10000)}
              placeholder="내용을 입력하세요 (10자 이상, 최대 10000자)"
            />
            <span
              ref={contentCountRef}
              className={`ep-char-counter${form.content.length > 10000 ? " over" : form.content.length < 10 && form.content.length > 0 ? " under" : ""}`}>
              {form.content.length}/10000
            </span>
          </div>

          <div className="ep-write-tts">
            <div className="ep-write-field">
              <label htmlFor="tts-apikey">OpenAI API Key</label>
              <input
                id="tts-apikey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
            <TtsGenerator
              book={{
                title: form.episodeTitle || "에피소드",
                author: "",
                content: form.content,
              }}
              apiKey={apiKey}
              onAudioUpdate={(base64Url) =>
                setForm((prev) => ({ ...prev, ttsPath: base64Url }))
              }
            />
          </div>

          <div className="ep-write-buttons">
            <button type="button" className="ep-btn-cancel" onClick={() => navigate(-1)}>
              취소
            </button>
            <button type="submit" className="ep-btn-save" disabled={loading}>
              {loading ? "저장 중..." : isEdit ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EpisodeWriteScreen;
