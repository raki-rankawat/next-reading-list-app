// The Open Library search response, narrowed to the fields the request asks
// for by name — nothing else comes back, so nothing else is described here.
// Every field but `key` and `title` is optional: the API omits them for works
// with no cover, no credited author, or no ratings yet.
export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  ratings_average?: number;
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  docs: OpenLibraryDoc[];
}

// One result flattened into what a card renders. `olKey` keeps Open Library's
// `key` verbatim, including the `/works/` prefix, so feature 07 can compare it
// against a saved book's `olKey` without normalising either side.
export interface SearchResult {
  olKey: string;
  title: string;
  author: string;
  coverUrl: string | null;
  score: number;
}
