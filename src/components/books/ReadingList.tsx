"use client";

import type { ReactNode } from "react";

import BookTable from "@/components/books/BookTable";
import { useBooks } from "@/hooks/useBooks";

export default function ReadingList() {
  const { books, isLoading, error } = useBooks();

  let body: ReactNode;
  if (isLoading) {
    body = <LoadingState />;
  } else if (error) {
    body = <ErrorState message={error} />;
  } else if (books.length === 0) {
    body = <EmptyState />;
  } else {
    body = <BookTable books={books} />;
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight text-stone-900">
          My Reading List
        </h1>
        {!isLoading && !error && (
          <p className="mt-1.5 text-sm text-stone-500">
            {books.length} {books.length === 1 ? "book" : "books"}
          </p>
        )}
      </header>
      {body}
    </>
  );
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-6 py-24 text-center shadow-sm">
      <p className="text-sm text-stone-500">Loading your books…</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 px-6 py-24 text-center">
      <p className="mb-2 text-base font-semibold text-stone-900">
        Your reading list is empty
      </p>
      <p className="text-sm text-stone-500">
        Search for a book to start tracking what you read.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
      <p className="mb-2 text-base font-semibold text-red-900">
        Couldn&apos;t load your reading list
      </p>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}
