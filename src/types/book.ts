export type BookStatus = "read" | "currently_reading" | "want_to_read";

export interface Book {
  id: string;
  title: string;
  author: string;
  type: string;
  status: BookStatus;
  score: number;
  coverUrl: string;
  link: string;
  olKey: string;
}

// A book on its way to json-server, which assigns the id — every other field is
// already known at the point it is posted.
export type NewBook = Omit<Book, "id">;
