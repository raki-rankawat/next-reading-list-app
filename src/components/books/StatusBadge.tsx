import { STATUS_LABELS } from "@/lib/book-status";
import type { BookStatus } from "@/types/book";

interface StatusBadgeProps {
  status: BookStatus;
}

// Tailwind only matches class names it can read as whole strings, so these stay
// literal rather than being built from the status.
const STATUS_TINTS: Record<BookStatus, string> = {
  read: "bg-status-read/15 text-status-read-ink",
  currently_reading:
    "bg-status-currently-reading/15 text-status-currently-reading-ink",
  want_to_read: "bg-status-want-to-read/15 text-status-want-to-read-ink",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${STATUS_TINTS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
