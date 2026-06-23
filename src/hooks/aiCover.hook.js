const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

export const compressImage = (dataUrl, targetWidth, targetHeight) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width  = targetWidth;
    canvas.height = targetHeight;
    canvas.getContext('2d').drawImage(img, 0, 0, targetWidth, targetHeight);
    resolve(canvas.toDataURL('image/jpeg', 0.7));
  };
  img.onerror = reject;
  img.src = dataUrl;
});

export const hookAiCover = async (apiKey, book, options = {}) => {
  if (!apiKey) {
    throw new Error(
      "OpenAI API Key가 필요합니다. 입력창에 sk-... 키를 입력하거나 .env에 VITE_OPENAI_API_KEY를 설정하세요.",
    );
  }

  const {
    model = 'gpt-image-2',
    size = '1024x1536',
    quality = 'medium',
    compressWidth = 512,
    compressHeight = 768,
  } = options;

  const prompt = `A book cover for a book titled "${book.title}" by ${book.author}. ${book.content}`;

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size,
      quality,
      output_format: "png",
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const status = res.status;
    if (status === 401)
      throw new Error("API Key가 유효하지 않습니다. [401 Unauthorized]");
    if (status === 429)
      throw new Error(
        "요청 한도 초과입니다. 잠시 후 재시도하세요. [429 Too Many Requests]",
      );
    throw new Error(errData.error?.message || `OpenAI 오류 [${status}]`);
  }

  const data = await res.json();
  const b64Json = data.data?.[0]?.b64_json;
  if (!b64Json) throw new Error("이미지 데이터를 받지 못했습니다.");
  const imageSrc = `data:image/png;base64,${b64Json}`;
  const compressedSrc = await compressImage(imageSrc, compressWidth, compressHeight);

  return compressedSrc;
};
