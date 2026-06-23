import axios from "axios";

export const commonAuthHook = async (method, url, data) => {
  const req = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
    },
    ...(data && { data }),
  };
  try {
    const response = await axios(req);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      alert("인증에 실패했습니다. 다시 로그인해주세요.");
      window.location.href = "/login";
    }
  }
}
