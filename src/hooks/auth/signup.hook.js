import { commonAuthHook } from "@hooks/auth/commonAuth.hook";
import { setAccessToken, setUser } from "@utils/authStore";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8080";

export const hookSignup = async (data) => {
  const baseUrl = `${apiBaseUrl}/users`;
  await commonAuthHook("POST", baseUrl, data);
};
