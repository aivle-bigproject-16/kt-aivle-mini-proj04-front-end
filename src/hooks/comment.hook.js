import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

const normalizeComment = (comment) => ({
  ...comment,
  id: comment.commentsId,
  name: comment.authorName,
});

export const hookComment = async (method, data = {}) => {
  const baseUrl = `${apiBaseUrl}/comment`;
  let url = baseUrl;
  let body = data;

  if (method === "GET") {
    const page = data.page ?? 0;
    url = `${baseUrl}?bookId=${data.bookId}&page=${page}`;
    body = null;
  }

  if (method === "POST") {
    url = baseUrl;
    body = {
      bookId: Number(data.bookId),
      content: data.content,
    };
  }

  if (method === "PATCH") {
    url = `${baseUrl}/${data.id}`;
    body = {
      content: data.content,
    };
  }

  if (method === "DELETE") {
    url = `${baseUrl}/${data.id}`;
    body = null;
  }

  const res = await commonPostHook(method, url, body);

  if (Array.isArray(res)) {
    return res.map(normalizeComment);
  }

  return res ? normalizeComment(res) : res;
};