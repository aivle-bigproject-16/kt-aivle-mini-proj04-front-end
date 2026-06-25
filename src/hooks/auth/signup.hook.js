import { commonAuthHook } from "@hooks/auth/commonAuth.hook";
import { setAccessToken, setUser } from "@utils/authStore";

const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

export const hookSignup = async (data) => {
  const baseUrl = `${apiBaseUrl}/users`;
  await commonAuthHook("POST", baseUrl, data);
};
