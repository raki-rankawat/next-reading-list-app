"use client";

import { useEffect, useState } from "react";

import { getBooks } from "@/lib/json-server";
import type { Book } from "@/types/book";

interface UseBooksResult {
  books: Book[];
  isLoading: boolean;
  error: string | null;
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

  return { books, isLoading, error };
}
