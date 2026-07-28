import type { BookStatus } from "@/types/book";

// The order the design lists the drawer's status options in.
export const BOOK_STATUSES: readonly BookStatus[] = [
  "want_to_read",
  "currently_reading",
  "read",
];

export const STATUS_LABELS: Record<BookStatus, string> = {
  read: "Read",
  currently_reading: "Currently Reading",
  want_to_read: "Want to Read",
};
