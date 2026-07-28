"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import SearchResultCard from "@/components/search/SearchResultCard";
import { useBookSearch } from "@/hooks/useBookSearch";
import { useBooks } from "@/hooks/useBooks";
import { toNewBook } from "@/lib/open-library";
import type { SearchResult } from "@/types/open-library";

// The design has no state panels — it renders a fixed result set and nothing
// else — so these follow the home page's, translated into the dark palette:
// same geometry, same dashed border for the two "nothing here yet" cases. Each
// panel sets its own vertical padding, since the error one is shorter and two
// competing `py-` utilities resolve by stylesheet order, not by which was
// written last.
const STATE_PANEL = "rounded-xl px-6 text-center";
const STATE_TITLE = "text-dark-ink mb-2 text-base font-semibold";
const STATE_BODY = "text-dark-muted text-sm";

// An add that failed carries the result it was for, so a rejection landing after
// the user has moved on to another card is reported on the card it belongs to —
// the same reason the drawer keys its save and delete errors by book id.
interface AddError {
  olKey: string;
  message: string;
}

export default function SearchBooks() {
  const [query, setQuery] = useState("");
  const { results, isSearching, error } = useBookSearch(query);
  // The reading list is loaded here purely to answer one question per card:
  // is this book already in it? The mutation is the other half — a card flips to
  // "Already Added" because the hook now holds the book, not because the card
  // remembers having added it.
  const { books, error: listError, addBook } = useBooks();
  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [addError, setAddError] = useState<AddError | null>(null);

  const trimmedQuery = query.trim();

  // Matched on `olKey` and never on title: editions of the same work share a
  // title across different works, and different works share one too.
  const addedKeys = useMemo(
    () => new Set(books.map((book) => book.olKey)),
    [books],
  );

  async function handleAdd(result: SearchResult) {
    setAddingKey(result.olKey);
    setAddError(null);

    try {
      await addBook(toNewBook(result));
    } catch (caught) {
      setAddError({
        olKey: result.olKey,
        message:
          caught instanceof Error ? caught.message : "Couldn't add this book.",
      });
    } finally {
      setAddingKey((current) => (current === result.olKey ? null : current));
    }
  }

  // What the live region below announces, kept to a summary: the results are
  // read on request, not read out in full every time a keystroke changes them.
  // The error case stays empty because its panel is a `role="alert"` and would
  // otherwise be announced twice.
  let status = "";
  let body: ReactNode;
  if (trimmedQuery === "") {
    body = <IdleState />;
  } else if (isSearching) {
    body = <LoadingState />;
    status = "Searching Open Library…";
  } else if (error) {
    body = <ErrorState message={error} />;
  } else if (results.length === 0) {
    body = <NoResultsState query={trimmedQuery} />;
    status = "No books found.";
  } else {
    status = `${results.length} ${results.length === 1 ? "result" : "results"} found.`;
    body = (
      // `auto-fill` rather than a fixed column count: the design's 230px floor
      // is what decides how many fit, which lands on 3-4 across the 1200px
      // container and collapses to one on a phone without a breakpoint.
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
        {results.map((result) => (
          <SearchResultCard
            key={result.olKey}
            result={result}
            isAdded={addedKeys.has(result.olKey)}
            isAdding={addingKey === result.olKey}
            error={addError?.olKey === result.olKey ? addError.message : null}
            onAdd={() => handleAdd(result)}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <Link
        href="/"
        className="text-dark-muted hover:text-dark-ink mb-[22px] inline-flex items-center gap-1.5 text-[13.5px]"
      >
        ← Back to list
      </Link>
      <h1 className="text-dark-ink mb-5 text-[26px] font-semibold">
        Add a Book
      </h1>
      {/* The design styles its placeholder globally as the input's own colour
          at half opacity, which is what these two utilities reproduce without
          reaching for a global rule. */}
      {/* `text` and not `search`: the design's input carries no decoration, and
          `search` has the browser draw a clear button inside it. */}
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by title or author..."
        aria-label="Search for a book"
        className="border-dark-border bg-dark-card text-dark-ink placeholder:text-dark-ink mb-8 w-full max-w-[420px] rounded-[10px] border px-4 py-3 text-sm outline-none placeholder:opacity-50"
      />

      {/* Results arrive from typing rather than from a submit a screen reader
          would follow, so the change has to be announced — but only as a count.
          The grid sits outside the region, or every search would read out all
          two dozen cards. */}
      <p aria-live="polite" className="sr-only">
        {status}
      </p>
      {/* Without the reading list there is nothing to compare against, so every
          card would offer to add a book that may already be there. Saying so is
          the alternative to letting "Already Added" quietly stop being true. */}
      {listError && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-[13px] text-red-200"
        >
          Couldn&apos;t load your reading list, so books already in it aren&apos;t
          marked. {listError}
        </p>
      )}
      {body}
    </>
  );
}

function IdleState() {
  return (
    <div
      className={`border-dark-border border border-dashed ${STATE_PANEL} py-24`}
    >
      <p className={STATE_TITLE}>Search Open Library</p>
      <p className={STATE_BODY}>
        Type a title or an author above to find books to add.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className={`bg-dark-card border-dark-border border ${STATE_PANEL} py-24`}
    >
      <p className={STATE_BODY}>Searching Open Library…</p>
    </div>
  );
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div
      className={`border-dark-border border border-dashed ${STATE_PANEL} py-24`}
    >
      <p className={STATE_TITLE}>No books found</p>
      <p className={STATE_BODY}>
        Nothing on Open Library matched &ldquo;{query}&rdquo;. Try a different
        title or author.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      className={`border border-red-900 bg-red-950/40 ${STATE_PANEL} py-16`}
      role="alert"
    >
      <p className="mb-2 text-base font-semibold text-red-100">
        Couldn&apos;t search Open Library
      </p>
      <p className="text-sm text-red-300">{message}</p>
    </div>
  );
}
