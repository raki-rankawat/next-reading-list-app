"use client";

import Image from "next/image";

import StarScore from "@/components/books/StarScore";
import StatusBadge from "@/components/books/StatusBadge";
import type { Book } from "@/types/book";

const FIELD_LABEL =
  "text-[11px] font-semibold tracking-[.05em] text-stone-500 uppercase";

// Sits behind the cover, so a missing or still-loading image leaves the
// design's labelled placeholder rather than a broken frame.
const COVER_PLACEHOLDER =
  "bg-[repeating-linear-gradient(135deg,#e7e5e4,#e7e5e4_8px,#f5f5f4_8px,#f5f5f4_16px)]";

interface BookDrawerProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

// The overlay stays mounted so the panel can transition in both directions —
// mounting it on open would leave it already in place with nothing to animate
// from. `inert` keeps the closed panel out of the tab order. `book` outlives
// `isOpen` on close, which is what gives the closing panel something to render.
export default function BookDrawer({ book, isOpen, onClose }: BookDrawerProps) {
  return (
    <div
      inert={!isOpen}
      className={`fixed inset-0 z-40 ${isOpen ? "" : "pointer-events-none"}`}
    >
      <button
        type="button"
        onClick={onClose}
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
        className={`absolute inset-y-0 right-0 w-full overflow-y-auto bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.14)] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] md:w-[400px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {book && (
          <div className="px-7 pt-6 pb-10">
            <button
              type="button"
              onClick={onClose}
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
                  <StatusBadge status={book.status} />
                </dd>
              </div>
            </dl>
          </div>
        )}
      </aside>
    </div>
  );
}
