"use client";

import { useCallback, useEffect, useState } from "react";

import { deleteBook, getBooks, updateBookStatus } from "@/lib/json-server";
import type { Book, BookStatus } from "@/types/book";

interface UseBooksResult {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  updateStatus: (id: string, status: BookStatus) => Promise<void>;
  removeBook: (id: string) => Promise<void>;
}

export function useBooks(): UseBooksResult {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getBooks();
        if (!cancelled) setBooks(data);
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Something went wrong loading your books.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Rejects on failure rather than storing the error here: `error` above is the
  // load failure that replaces the whole table, and a rejected save should not
  // do that. The caller reports it next to the control the user just used.
  const updateStatus = useCallback(async (id: string, status: BookStatus) => {
    const updated = await updateBookStatus(id, status);
    setBooks((current) =>
      current.map((book) => (book.id === id ? updated : book)),
    );
  }, []);

  // Rejects on failure for the same reason as `updateStatus`. Dropping the book
  // from local state is the table's refresh: the server is now the shorter list,
  // so refetching it would only cost a round trip to learn that.
  const removeBook = useCallback(async (id: string) => {
    await deleteBook(id);
    setBooks((current) => current.filter((book) => book.id !== id));
  }, []);

  return { books, isLoading, error, updateStatus, removeBook };
}
