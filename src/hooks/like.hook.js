import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8080";

export const hookLikeStatus = async ({ bookId }) => {
  return commonPostHook("GET", `${apiBaseUrl}/books/${bookId}/likes`, null);
};

export const hookLike = async ({ bookId }) => {
  return commonPostHook("POST", `${apiBaseUrl}/books/${bookId}/likes`, null);
};