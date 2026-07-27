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
