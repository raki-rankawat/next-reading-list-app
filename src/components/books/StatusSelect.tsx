"use client";

import { BOOK_STATUSES, STATUS_LABELS } from "@/lib/book-status";
import type { BookStatus } from "@/types/book";

interface StatusSelectProps {
  status: BookStatus;
  onChange: (status: BookStatus) => void;
  disabled: boolean;
}

// The design's drawer status field: a full-width white box with the platform's
// own select chrome — deliberately not the table's coloured pill. The disabled
// styling is the one addition, since the design has no notion of a save in
// flight.
export default function StatusSelect({
  status,
  onChange,
  disabled,
}: StatusSelectProps) {
  return (
    <select
      aria-label="Status"
      value={status}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as BookStatus)}
      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-[9px] text-sm text-stone-900 disabled:cursor-wait disabled:opacity-60"
    >
      {BOOK_STATUSES.map((option) => (
        <option key={option} value={option}>
          {STATUS_LABELS[option]}
        </option>
      ))}
    </select>
  );
}
