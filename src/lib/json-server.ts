import type { Book } from "@/types/book";

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
