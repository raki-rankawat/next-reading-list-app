"use client";

import Image from "next/image";
import { useState } from "react";

import StarScore from "@/components/books/StarScore";
import StatusSelect from "@/components/books/StatusSelect";
import type { Book, BookStatus } from "@/types/book";

const FIELD_LABEL =
  "text-[11px] font-semibold tracking-[.05em] text-stone-500 uppercase";

// Sits behind the cover, so a missing or still-loading image leaves the
// design's labelled placeholder rather than a broken frame.
const COVER_PLACEHOLDER =
  "bg-[repeating-linear-gradient(135deg,#e7e5e4,#e7e5e4_8px,#f5f5f4_8px,#f5f5f4_16px)]";

// The design's two reds for the delete button: its border and its text. The
// confirm popup fills its own Delete with that same ink value, so the flow
// introduces no red the design does not already name. Kept as literals rather
// than @theme tokens since nothing outside this control refers to them.
const DELETE_BORDER = "border-[oklch(0.75_0.14_25)]";
const DELETE_INK = "text-[oklch(0.5_0.16_25)]";

interface BookDrawerProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: BookStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

// A save that fails carries the book it was for, so a rejection that lands
// after the drawer has moved on isn't reported against whatever is on screen
// now — the same reason the in-flight book is tracked by id rather than a flag.
interface SaveError {
  bookId: string;
  message: string;
}

// The overlay stays mounted so the panel can transition in both directions —
// mounting it on open would leave it already in place with nothing to animate
// from. `inert` keeps the closed panel out of the tab order. `book` outlives
// `isOpen` on close, which is what gives the closing panel something to render.
export default function BookDrawer({
  book,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
}: BookDrawerProps) {
  const [savingBookId, setSavingBookId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<SaveError | null>(null);
  // Which book is armed for deletion, rather than a bare flag: the same reason
  // the ids above are tracked, and it means a confirm can never carry over to a
  // different book than the one it was raised for.
  const [confirmingBookId, setConfirmingBookId] = useState<string | null>(null);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<SaveError | null>(null);

  const isConfirming = book !== null && confirmingBookId === book.id;

  // Closing is a "never mind", so it disarms the confirm — reopening a book
  // should not present an already-armed delete. A delete already in flight is
  // the exception: leaving mid-request would disarm the confirm the failure
  // message renders in, so the request is allowed to land first.
  function handleClose() {
    if (deletingBookId !== null) return;
    setConfirmingBookId(null);
    onClose();
  }

  async function handleDelete(id: string) {
    setDeletingBookId(id);
    setDeleteError(null);

    try {
      await onDelete(id);
      // `onClose` and not `handleClose`: the id below is still set until the
      // `finally` runs, so going through the guard above would refuse the very
      // close this succeeded in earning.
      setConfirmingBookId(null);
      onClose();
    } catch (caught) {
      setDeleteError({
        bookId: id,
        message:
          caught instanceof Error ? caught.message : "Couldn't delete the book.",
      });
    } finally {
      setDeletingBookId((current) => (current === id ? null : current));
    }
  }

  async function handleStatusChange(id: string, status: BookStatus) {
    setSavingBookId(id);
    setSaveError(null);

    try {
      await onStatusChange(id, status);
    } catch (caught) {
      setSaveError({
        bookId: id,
        message:
          caught instanceof Error
            ? caught.message
            : "Couldn't save the new status.",
      });
    } finally {
      setSavingBookId((current) => (current === id ? null : current));
    }
  }

  return (
    <div
      inert={!isOpen}
      className={`fixed inset-0 z-40 ${isOpen ? "" : "pointer-events-none"}`}
    >
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close book details"
        className={`absolute inset-0 h-full w-full cursor-default bg-black/35 transition-opacity duration-[250ms] ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Below `md` (768px) the panel fills the viewport as an overlay, per the
          responsive rules in project-overview.md; above it, the design's 400px
          panel hinged to the right, separated by shadow rather than a border. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-drawer-title"
        // Behind the confirm popup the fields are dimmed and blurred, so they
        // should be out of the tab order too, not merely hard to read.
        inert={isConfirming}
        className={`absolute inset-y-0 right-0 w-full overflow-y-auto bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.14)] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] md:w-[400px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {book && (
          <div className="px-7 pt-6 pb-10">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="mb-4 text-[22px] leading-none text-stone-500 hover:text-stone-900"
            >
              ×
            </button>

            <div
              className={`relative mx-auto mb-[22px] aspect-[2/3] w-[150px] overflow-hidden rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] ${COVER_PLACEHOLDER}`}
            >
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-stone-500">
                cover
              </span>
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>

            <h2
              id="book-drawer-title"
              className="mb-1 text-center text-[19px] font-semibold text-stone-900"
            >
              {book.title}
            </h2>
            <p className="mb-6 text-center text-[13.5px] text-stone-500">
              {book.type}
            </p>

            <dl className="flex flex-col gap-[18px]">
              <div>
                <dt className={`mb-1 ${FIELD_LABEL}`}>Author</dt>
                <dd className="text-[14.5px] text-stone-900">{book.author}</dd>
              </div>
              <div>
                <dt className={`mb-1 ${FIELD_LABEL}`}>Link</dt>
                <dd>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[14.5px] font-medium text-stone-900 hover:underline"
                  >
                    Open Library
                  </a>
                </dd>
              </div>
              <div>
                <dt className={`mb-1.5 ${FIELD_LABEL}`}>Score</dt>
                <dd>
                  <StarScore score={book.score} size="lg" />
                </dd>
              </div>
              <div>
                <dt className={`mb-1.5 ${FIELD_LABEL}`}>Status</dt>
                <dd>
                  <StatusSelect
                    status={book.status}
                    disabled={savingBookId === book.id}
                    onChange={(status) => handleStatusChange(book.id, status)}
                  />
                  {saveError?.bookId === book.id && (
                    <p
                      role="alert"
                      className="mt-2 text-[12.5px] font-medium text-red-700"
                    >
                      {saveError.message}
                    </p>
                  )}
                </dd>
              </div>
            </dl>

            {/* The design puts this button inside the field column, so its top
                edge sits 18px (the column gap) plus its own 6px margin below the
                status field — 24px, which is what `mt-6` reproduces here, where
                it has to live outside the `dl` to keep that list valid. */}
            <button
              type="button"
              onClick={() => {
                setDeleteError(null);
                setConfirmingBookId(book.id);
              }}
              className={`mt-6 w-full rounded-lg border p-[11px] text-sm font-semibold ${DELETE_BORDER} ${DELETE_INK}`}
            >
              Delete Book
            </button>
          </div>
        )}
      </aside>

      {/* Sibling of the panel rather than a child of it: the panel scrolls, and
          an overlay inside it would scroll along with the fields it is meant to
          be covering. Sharing the panel's geometry keeps the dimming confined to
          the drawer, so the table behind it stays under its own backdrop. */}
      {book && isConfirming && (
        <div className="absolute inset-y-0 right-0 flex w-full items-center justify-center p-6 md:w-[400px]">
          <button
            type="button"
            onClick={() => setConfirmingBookId(null)}
            aria-label="Keep this book"
            className="absolute inset-0 h-full w-full cursor-default bg-black/30 backdrop-blur-[3px]"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            aria-describedby="delete-confirm-body"
            className="relative w-full rounded-xl bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          >
            <h3
              id="delete-confirm-title"
              className="mb-1.5 text-[15.5px] font-semibold text-stone-900"
            >
              Delete this book?
            </h3>
            <p
              id="delete-confirm-body"
              className="mb-4 text-[13.5px] leading-[1.5] text-stone-500"
            >
              <span className="font-medium text-stone-900">{book.title}</span>{" "}
              will be removed from your reading list. This can&apos;t be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmingBookId(null)}
                disabled={deletingBookId === book.id}
                className="flex-1 rounded-lg border border-stone-200 bg-white p-[11px] text-sm font-semibold text-stone-900 disabled:cursor-wait disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(book.id)}
                disabled={deletingBookId === book.id}
                className="flex-1 rounded-lg bg-[oklch(0.5_0.16_25)] p-[11px] text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
              >
                {deletingBookId === book.id ? "Deleting…" : "Delete"}
              </button>
            </div>
            {deleteError?.bookId === book.id && (
              <p
                role="alert"
                className="mt-3 text-[12.5px] font-medium text-red-700"
              >
                {deleteError.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
