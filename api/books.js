import {
  getBooksFromDb,
  makeNextId,
  normalizeBook,
  readJsonBody,
  persistBooks,
  sendJson,
} from "./_lib/db.js";

export default async function handler(req, res) {
  const books = await getBooksFromDb();

  if (req.method === "GET") {
    return sendJson(res, books);
  }

  if (req.method === "POST") {
    const body = readJsonBody(req);
    const nextBook = normalizeBook({
      ...body,
      id: body.id ?? makeNextId(books),
      createdAt: body.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const nextBooks = [nextBook, ...books];
    await persistBooks(nextBooks);
    return sendJson(res, nextBook, 201);
  }

  return sendJson(res, { message: "Method Not Allowed" }, 405);
}
