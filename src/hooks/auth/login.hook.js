import { commonAuthHook } from "@hooks/auth/commonAuth.hook";
import { setAccessToken, setUser } from "@utils/authStore";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8080";

export const hookLogin = async (data) => {
  const baseUrl = `${apiBaseUrl}/auth/login`;
  const res = await commonAuthHook("POST", baseUrl, data);
  setAccessToken(res.accessToken);
  setUser({ usersId: res.usersId, loginId: res.loginId, name: res.name, email: res.email, phone: res.phone });
};
