import type { BookStatus } from "@/types/book";

interface StatusBadgeProps {
  status: BookStatus;
}

const STATUS_STYLES: Record<BookStatus, { label: string; className: string }> = {
  read: {
    label: "Read",
    className: "bg-status-read/15 text-status-read-ink",
  },
  currently_reading: {
    label: "Currently Reading",
    className:
      "bg-status-currently-reading/15 text-status-currently-reading-ink",
  },
  want_to_read: {
    label: "Want to Read",
    className: "bg-status-want-to-read/15 text-status-want-to-read-ink",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = STATUS_STYLES[status];

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}
