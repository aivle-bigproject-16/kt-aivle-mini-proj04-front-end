import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const normalizeBook = (book) => ({
  ...book,
  id: book.bookId,
  content: book.description,
});

export const hookBookList = async () => {
  const res = await commonPostHook("GET", `${apiBaseUrl}/books`, null);
  if (!Array.isArray(res)) return [];
  return res
    .map(normalizeBook)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

