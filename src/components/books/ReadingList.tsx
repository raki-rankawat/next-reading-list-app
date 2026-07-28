"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import BookDrawer from "@/components/books/BookDrawer";
import BookTable from "@/components/books/BookTable";
import StatePanel from "@/components/ui/StatePanel";
import { useBooks } from "@/hooks/useBooks";

// The design's accent, which every shipped surface has translated as
// `stone-900` — the table's links and the drawer's do the same.
const ADD_BOOK_BUTTON =
  "inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white";

export default function ReadingList() {
  const { books, isLoading, error, updateStatus, removeBook } = useBooks();
  // Which book the drawer shows and whether it is open are separate: the
  // selection outlives the close so the panel still has content to render while
  // it slides out. Tracking the id rather than the book itself keeps the drawer
  // on live data once features 04 and 05 start mutating the list.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedBook = books.find((book) => book.id === selectedId) ?? null;

  function openBook(id: string) {
    setSelectedId(id);
    setIsDrawerOpen(true);
  }

  let body: ReactNode;
  if (isLoading) {
    body = (
      <StatePanel
        tone="light"
        variant="card"
        busy
        message="Loading your books…"
      />
    );
  } else if (error) {
    body = (
      <StatePanel
        tone="light"
        variant="error"
        title="Couldn't load your reading list"
        message={error}
      />
    );
  } else if (books.length === 0) {
    // The one state the design does specify: its dashed 96px/24px panel, down
    // to the copy.
    body = (
      <StatePanel
        tone="light"
        variant="dashed"
        title="Your reading list is empty"
        message="Search for a book to start tracking what you read."
      >
        <Link href="/search" className={ADD_BOOK_BUTTON}>
          + Add Book
        </Link>
      </StatePanel>
    );
  } else {
    body = <BookTable books={books} onSelect={openBook} />;
  }

  return (
    <>
      {/* The design's single row from `sm` up. Below it the two stack, since
          the 28px heading and the button together overrun a phone's width and
          shrinking either one to fit would cost more than the wrap does. */}
      <header className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-stone-900">
            My Reading List
          </h1>
          {!isLoading && !error && (
            <p className="mt-1.5 text-sm text-stone-500">
              {books.length} {books.length === 1 ? "book" : "books"}
            </p>
          )}
        </div>
        <Link href="/search" className={ADD_BOOK_BUTTON}>
          + Add Book
        </Link>
      </header>
      {body}
      <BookDrawer
        book={selectedBook}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusChange={updateStatus}
        onDelete={removeBook}
      />
    </>
  );
}
