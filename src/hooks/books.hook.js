import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8080";

export const hookBooks = async (method, data) => {
  const baseUrl = `${apiBaseUrl}/books/${data.id}`;
  let url = baseUrl;

  if (method === "POST") {
    data = toBackendBook(data);
    url = `${apiBaseUrl}/books`;
  }

  if (method === "PATCH") {
    data = toBackendBook(data);
  }

  const res = await commonPostHook(method, url, data);
  return res ? normalizeBook(res) : res;
};

const normalizeBook = (book) => ({
  ...book,
  id: book.bookId,
  content: book.description,
});

const toBackendBook = (data) => {
  const payload = {};
  if (data.usersId !== undefined) payload.usersId = data.usersId;
  if (data.title !== undefined) payload.title = data.title;
  if (data.author !== undefined) payload.author = data.author;
  if (data.content !== undefined) payload.description = data.content;
  return payload;
};

export const hookBookCover = async (id, cover) => {
  const url = `${apiBaseUrl}/books/${id}/cover`;
  const res = await commonPostHook("PATCH", url, { cover });
  return res ? normalizeBook(res) : res;
};
