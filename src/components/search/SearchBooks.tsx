"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import SearchResultCard from "@/components/search/SearchResultCard";
import StatePanel from "@/components/ui/StatePanel";
import { useBookSearch } from "@/hooks/useBookSearch";
import { useBooks } from "@/hooks/useBooks";
import { toNewBook } from "@/lib/open-library";
import type { SearchResult } from "@/types/open-library";

// An add that failed carries the result it was for, so a rejection landing after
// the user has moved on to another card is reported on the card it belongs to —
// the same reason the drawer keys its save and delete errors by book id. It also
// carries the search it was raised during, which is what keeps it from
// outliving that search: a failure against a result set the box has moved on
// from is no more this query's than the results themselves are. Tagged and
// derived rather than cleared in an effect, following `useBookSearch` — and it
// covers the rejection that lands *after* the query changed, which clearing on
// keystroke would not.
interface AddError {
  olKey: string;
  query: string;
  message: string;
}

export default function SearchBooks() {
  const [query, setQuery] = useState("");
  const { results, isSearching, error } = useBookSearch(query);
  // The reading list is loaded here purely to answer one question per card:
  // is this book already in it? The mutation is the other half — a card flips to
  // "Already Added" because the hook now holds the book, not because the card
  // remembers having added it.
  const {
    books,
    isLoading: isListLoading,
    error: listError,
    addBook,
  } = useBooks();
  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [addError, setAddError] = useState<AddError | null>(null);

  const trimmedQuery = query.trim();

  // Matched on `olKey` and never on title: unrelated works carry the same title
  // — a search for "The Hobbit" returns Tolkien's and several others — so the
  // key is the only stable identity Open Library gives us for a work.
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
        query: trimmedQuery,
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
    body = (
      <StatePanel
        tone="dark"
        variant="dashed"
        title="Search Open Library"
        message="Type a title or an author above to find books to add."
      />
    );
  } else if (isSearching || isListLoading) {
    // The reading list is held to as well as the search: a card drawn before
    // the list has landed would offer to add a book that may already be in it,
    // which is the one way this screen can write a duplicate. In practice the
    // list arrives inside the 400ms debounce and this never shows on its
    // account — but "in practice" is not a state. A list that fails to load
    // ends this too, and says so in the notice below.
    body = (
      <StatePanel
        tone="dark"
        variant="card"
        busy
        message="Searching Open Library…"
      />
    );
    status = "Searching Open Library…";
  } else if (error) {
    body = (
      <StatePanel
        tone="dark"
        variant="error"
        title="Couldn't search Open Library"
        message={error}
      />
    );
  } else if (results.length === 0) {
    body = (
      <StatePanel
        tone="dark"
        variant="dashed"
        title="No books found"
        message={`Nothing on Open Library matched “${trimmedQuery}”. Try a different title or author.`}
      />
    );
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
            error={
              addError?.olKey === result.olKey &&
              addError.query === trimmedQuery
                ? addError.message
                : null
            }
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
          Couldn&apos;t load your reading list, so books already in it
          aren&apos;t marked. {listError}
        </p>
      )}
      {body}
    </>
  );
}
