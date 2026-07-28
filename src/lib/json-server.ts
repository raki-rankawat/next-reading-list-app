import type { Book, BookStatus, NewBook } from "@/types/book";

const API_BASE_URL = "http://localhost:3001";

const UNREACHABLE_MESSAGE =
  "Couldn't reach the book API. Make sure json-server is running on port 3001.";

export async function getBooks(): Promise<Book[]> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/books`);
  } catch {
    throw new Error(UNREACHABLE_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(`Couldn't load your books (${response.status}).`);
  }

  return (await response.json()) as Book[];
}

// Returns the created book, which is the only way to learn the id json-server
// assigned it — the caller needs that to key the row it adds to the table.
export async function createBook(book: NewBook): Promise<Book> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
  } catch {
    throw new Error(UNREACHABLE_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(`Couldn't add this book (${response.status}).`);
  }

  return (await response.json()) as Book;
}

// Returns the book as json-server stored it, so the caller updates its local
// copy from the server's response rather than from what it hoped it wrote.
export async function updateBookStatus(
  id: string,
  status: BookStatus,
): Promise<Book> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  } catch {
    throw new Error(UNREACHABLE_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(`Couldn't save the new status (${response.status}).`);
  }

  return (await response.json()) as Book;
}

// The response body is ignored — json-server echoes the deleted record, and
// there is nothing left to update a local copy from.
export async function deleteBook(id: string): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/books/${id}`, { method: "DELETE" });
  } catch {
    throw new Error(UNREACHABLE_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(`Couldn't delete this book (${response.status}).`);
  }
}
