export function searchBooks(books, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return books.filter(book =>
    book.title.toLowerCase().includes(q) ||
    book.author.toLowerCase().includes(q)
  );
}
