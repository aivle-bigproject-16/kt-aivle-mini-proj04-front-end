import axios from "axios";
import { setAccessToken, setUser } from "@utils/authStore";

const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

export const refreshAccessToken = async () => {
  const res = await axios.post(`${apiBaseUrl}/auth/refresh`, null, {
    withCredentials: true,
  });
  const { accessToken, loginId, name, email, phone, usersId } = res.data;
  setAccessToken(accessToken);
  if (usersId) setUser({ usersId, loginId, name, email, phone });
  return accessToken;
};

