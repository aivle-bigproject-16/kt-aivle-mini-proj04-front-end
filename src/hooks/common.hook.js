import axios from "axios";
import { getAccessToken, clearAccessToken } from "@utils/authStore";
import { refreshAccessToken } from "@hooks/auth/refreshAccessToken.hook";

export const commonPostHook = async (method, url, data) => {
  const accessToken = getAccessToken();
  const req = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    ...(data && { data }),
  };
  try {
    const response = await axios(req);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 && accessToken) {
      try {
        const newToken = await refreshAccessToken();
        const retryResponse = await axios({
          ...req,
          headers: {
            ...req.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
        return retryResponse.data;
      } catch (_) {
        clearAccessToken();
        window.location.href = "/login";
      }
    }
  }
};
