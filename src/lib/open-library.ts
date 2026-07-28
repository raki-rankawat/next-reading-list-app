import type {
  OpenLibraryDoc,
  OpenLibrarySearchResponse,
  SearchResult,
} from "@/types/open-library";

const SEARCH_URL = "https://openlibrary.org/search.json";

// `ratings_average` is not in the default response — asking for fields by name
// is the only way to get the rating the card's stars show, and it trims the
// payload to what is actually rendered while it is there.
const SEARCH_FIELDS = "key,title,author_name,cover_i,ratings_average";

// The API pages at 100 results, which is 100 covers for a grid nobody scrolls
// to the end of.
const RESULT_LIMIT = 24;

const UNREACHABLE_MESSAGE =
  "Couldn't reach Open Library. Check your connection and try again.";

function buildCoverUrl(coverId: number): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

export async function searchBooks(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}&fields=${SEARCH_FIELDS}&limit=${RESULT_LIMIT}`;

  let response: Response;

  try {
    response = await fetch(url, { signal });
  } catch (caught) {
    // An abort is the caller replacing this search with a newer one, not a
    // failure — it has to reach the caller as itself so it isn't reported.
    if (caught instanceof DOMException && caught.name === "AbortError") {
      throw caught;
    }
    throw new Error(UNREACHABLE_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(`Open Library couldn't run that search (${response.status}).`);
  }

  const data = (await response.json()) as OpenLibrarySearchResponse;

  return data.docs.map(toSearchResult);
}

function toSearchResult(doc: OpenLibraryDoc): SearchResult {
  return {
    olKey: doc.key,
    title: doc.title,
    // Only the first name: `author_name` lists every credited contributor —
    // translators and narrators included — and the design's card gives the
    // author a single line under the title.
    author: doc.author_name?.[0] ?? "Unknown author",
    coverUrl: doc.cover_i === undefined ? null : buildCoverUrl(doc.cover_i),
    // Open Library's community rating, 0-5 as a float, rounded to whole stars.
    // It is the card's display rating only — feature 07 adds books with a score
    // of 0, since the score in the reading list is the user's own.
    score: Math.round(doc.ratings_average ?? 0),
  };
}
