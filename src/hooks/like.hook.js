import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = "/api";

export const hookLikeStatus = async ({ bookId }) => {
  return commonPostHook("GET", `${apiBaseUrl}/books/${bookId}/likes`, null);
};

export const hookLike = async ({ bookId }) => {
  return commonPostHook("POST", `${apiBaseUrl}/books/${bookId}/likes`, null);
};