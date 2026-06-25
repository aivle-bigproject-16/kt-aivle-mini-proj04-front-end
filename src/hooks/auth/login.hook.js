import { commonAuthHook } from "@hooks/auth/commonAuth.hook";
import { setAccessToken, setUser } from "@utils/authStore";

const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

export const hookLogin = async (data) => {
  const baseUrl = `${apiBaseUrl}/auth/login`;
  const res = await commonAuthHook("POST", baseUrl, data);
  setAccessToken(res.accessToken);
  setUser({ usersId: res.usersId, loginId: res.loginId, name: res.name, email: res.email, phone: res.phone });
};
