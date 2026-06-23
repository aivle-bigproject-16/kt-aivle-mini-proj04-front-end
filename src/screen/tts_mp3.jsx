import { useState } from "react";
import "@screen/tts_mp3.css";
import { hookAITTS } from "@hooks/tts_mp3.hook";

export default function TtsGenerator({ book, onAudioUpdate, apiKey }) {
  const [voice, setVoice] = useState("alloy");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!apiKey?.trim()) {
      setError("OpenAI API Key를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const script = book.content;
      const base64Url = await hookAITTS(apiKey.trim(), script, voice);
      setAudioUrl(base64Url);
      if (onAudioUpdate) onAudioUpdate(base64Url);
    } catch (err) {
      setError(err.message || "TTS 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="aitts">
      <h3>🎧 오디오북 생성</h3>

      <div className="aitts-field">
        <label htmlFor="tts-voice">목소리</label>
        <select
          id="tts-voice"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}>
          <option value="alloy">Alloy (중성)</option>
          <option value="echo">Echo (남성)</option>
          <option value="fable">Fable (영국 남성)</option>
          <option value="onyx">Onyx (저음 남성)</option>
          <option value="nova">Nova (여성)</option>
          <option value="shimmer">Shimmer (부드러운 여성)</option>
        </select>
      </div>

      <button
        type="button"
        className="aitts-btn"
        onClick={handleGenerate}
        disabled={isLoading}>
        {isLoading ? "생성 중..." : "🎙️ 오디오 생성"}
      </button>

      {error && <p className="aitts-error">{error}</p>}

      {audioUrl && (
        <p className="aitts-success">✅ 오디오 생성 완료. 등록 후 에피소드 페이지에서 재생할 수 있습니다.</p>
      )}

      <p className="aitts-notice">
        * TTS 생성 시 OpenAI API 비용이 발생합니다.
      </p>
    </div>
  );
}
