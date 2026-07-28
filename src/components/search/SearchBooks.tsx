"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import SearchResultCard from "@/components/search/SearchResultCard";
import { useBookSearch } from "@/hooks/useBookSearch";

// The design has no state panels — it renders a fixed result set and nothing
// else — so these follow the home page's, translated into the dark palette:
// same geometry, same dashed border for the two "nothing here yet" cases. Each
// panel sets its own vertical padding, since the error one is shorter and two
// competing `py-` utilities resolve by stylesheet order, not by which was
// written last.
const STATE_PANEL = "rounded-xl px-6 text-center";
const STATE_TITLE = "text-dark-ink mb-2 text-base font-semibold";
const STATE_BODY = "text-dark-muted text-sm";

export default function SearchBooks() {
  const [query, setQuery] = useState("");
  const { results, isSearching, error } = useBookSearch(query);

  const trimmedQuery = query.trim();

  let body: ReactNode;
  if (trimmedQuery === "") {
    body = <IdleState />;
  } else if (isSearching) {
    body = <LoadingState />;
  } else if (error) {
    body = <ErrorState message={error} />;
  } else if (results.length === 0) {
    body = <NoResultsState query={trimmedQuery} />;
  } else {
    body = (
      // `auto-fill` rather than a fixed column count: the design's 230px floor
      // is what decides how many fit, which lands on 3-4 across the 1200px
      // container and collapses to one on a phone without a breakpoint.
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
        {results.map((result) => (
          <SearchResultCard key={result.olKey} result={result} />
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

      {/* The result area announces itself, since results arrive from typing in
          the box above rather than from a submit a screen reader would follow. */}
      <div aria-live="polite">{body}</div>
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
