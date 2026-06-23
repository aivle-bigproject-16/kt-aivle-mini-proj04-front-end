import { readFile } from "node:fs/promises";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const seedDbFilePath = path.join(rootDir, "db.json");
const runtimeDbFilePath = process.env.VERCEL ? "/tmp/db.json" : seedDbFilePath;

const clone = (value) => JSON.parse(JSON.stringify(value));

const ensureRuntimeDb = async () => {
  if (!process.env.VERCEL) {
    return;
  }

  try {
    await access(runtimeDbFilePath);
  } catch {
    const seedRaw = await readFile(seedDbFilePath, "utf8");
    await mkdir(path.dirname(runtimeDbFilePath), { recursive: true });
    await writeFile(runtimeDbFilePath, seedRaw, "utf8");
  }
};

export const loadDb = async () => {
  await ensureRuntimeDb();
  const raw = await readFile(runtimeDbFilePath, "utf8");
  return JSON.parse(raw);
};

export const responseJson = (data, status = 200) => ({ data, status });

export const sendJson = (res, data, status = 200) => {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(JSON.stringify(data));
};

export const readJsonBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
};

export const findBookIndex = (books, id) =>
  books.findIndex((book) => String(book.id) === String(id));

export const makeNextId = (books) => {
  const numericIds = books
    .map((book) => Number(book.id))
    .filter((value) => Number.isFinite(value));

  if (numericIds.length > 0) {
    return String(Math.max(...numericIds) + 1);
  }

  return String(Date.now());
};

export const normalizeBook = (book) => {
  const now = new Date().toISOString();
  return {
    like: false,
    coverImageUrl: "",
    audioUrl: "",
    ...book,
    id: String(book.id),
    createdAt: book.createdAt ?? now,
    updatedAt: book.updatedAt ?? now,
  };
};

export const getBooksFromDb = async () => {
  const db = await loadDb();
  return clone(db.books ?? []).map(normalizeBook);
};

export const persistBooks = async (books) => {
  const payload = JSON.stringify({ books }, null, 2);
  await ensureRuntimeDb();
  await writeFile(runtimeDbFilePath, payload, "utf8");
};
