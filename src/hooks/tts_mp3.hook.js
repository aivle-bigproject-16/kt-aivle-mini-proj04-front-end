const OPENAI_TTS_URL = "https://api.openai.com/v1/audio/speech";
const TTS_MODEL = "tts-1";

export const hookAITTS = async (apiKey, script, voice = "alloy") => {
  const res = await fetch(OPENAI_TTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice,
      input: script,
      response_format: "opus",
    }),
  });

  if (!res.ok) {
    const status = res.status;
    if (status === 401)
      throw new Error("API Key가 유효하지 않습니다. [401 Unauthorized]");
    if (status === 429)
      throw new Error(
        "요청 한도 초과입니다. 잠시 후 재시도하세요. [429 Too Many Requests]",
      );
    throw new Error(`TTS 오류 [${status}]`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return `data:audio/ogg;codecs=opus;base64,${btoa(binary)}`;
};
