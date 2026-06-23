import { getBooksFromDb, sendJson } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, { message: "Method Not Allowed" }, 405);
  }

  const books = await getBooksFromDb();

  const stats = {
    totalBookCount: books.length,
    coverBookCount: books.filter((book) => Boolean(book.cover)).length,
    likedBookCount: books.filter((book) => Boolean(book.like)).length,
  };

  return sendJson(res, stats);
}
