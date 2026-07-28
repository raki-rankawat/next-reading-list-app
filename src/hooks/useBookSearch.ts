"use client";

import { useEffect, useState } from "react";

import { searchBooks } from "@/lib/open-library";
import type { SearchResult } from "@/types/open-library";

// The design searches as the query changes rather than on a submit — it has no
// submit control at all. Debouncing keeps that behaviour without putting a
// request on every keystroke.
const DEBOUNCE_MS = 400;

interface UseBookSearchResult {
  results: SearchResult[];
  isSearching: boolean;
  error: string | null;
}

// What a finished search produced, tagged with the query it answered. Storing
// the query alongside the outcome is what lets everything else be derived: a
// result set is only shown while it still belongs to what is in the box.
interface Settled {
  query: string;
  results: SearchResult[];
  error: string | null;
}

const IDLE: Settled = { query: "", results: [], error: null };

// Takes the live input value and owns everything that follows from it, so the
// page holds only the text the user typed. An empty query is not a search: it
// falls back to the idle state instead of asking Open Library for nothing.
export function useBookSearch(query: string): UseBookSearchResult {
  const trimmed = query.trim();
  const [settled, setSettled] = useState<Settled>(IDLE);

  useEffect(() => {
    if (trimmed === "") return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const results = await searchBooks(trimmed, controller.signal);
        setSettled({ query: trimmed, results, error: null });
      } catch (caught) {
        // A superseded search has nothing to report and no state to land in —
        // the effect that replaced it is already showing its own.
        if (controller.signal.aborted) return;
        setSettled({
          query: trimmed,
          results: [],
          error:
            caught instanceof Error
              ? caught.message
              : "Something went wrong searching Open Library.",
        });
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  // Anything the box has moved on from is not this query's answer, so it is
  // withheld rather than left on screen looking like one. Deriving the flag
  // this way also makes the debounce read as loading, which is what it is —
  // the request is coming, it just hasn't been sent yet.
  const isSettled = settled.query === trimmed;

  return {
    results: isSettled ? settled.results : [],
    isSearching: trimmed !== "" && !isSettled,
    error: isSettled ? settled.error : null,
  };
}
