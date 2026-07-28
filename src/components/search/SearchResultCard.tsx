import Image from "next/image";

import StarScore from "@/components/books/StarScore";
import type { SearchResult } from "@/types/open-library";

// Sits behind the cover, so a result Open Library has no cover for keeps the
// design's labelled placeholder rather than an empty frame — the same
// arrangement the drawer uses, in the dark palette's stripe values.
const COVER_PLACEHOLDER =
  "bg-[repeating-linear-gradient(135deg,oklch(0.27_0.014_260),oklch(0.27_0.014_260)_8px,oklch(0.3_0.012_260)_8px,oklch(0.3_0.012_260)_16px)]";

interface SearchResultCardProps {
  result: SearchResult;
}

export default function SearchResultCard({ result }: SearchResultCardProps) {
  return (
    <div className="bg-dark-card border-dark-border flex flex-col gap-3 rounded-[14px] border p-4 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
      <div
        className={`relative aspect-[2/3] w-full overflow-hidden rounded-lg ${COVER_PLACEHOLDER}`}
      >
        <span className="text-dark-muted absolute inset-0 flex items-center justify-center font-mono text-[10.5px]">
          cover
        </span>
        {result.coverUrl && (
          <Image
            src={result.coverUrl}
            alt={`Cover of ${result.title}`}
            fill
            sizes="(max-width: 767px) 100vw, 280px"
            className="object-cover"
          />
        )}
      </div>
      <div>
        <p className="text-dark-ink mb-[3px] text-[14.5px] leading-[1.3] font-semibold">
          {result.title}
        </p>
        <p className="text-dark-muted text-[12.5px]">{result.author}</p>
      </div>
      <StarScore score={result.score} size="xs" tone="dark" />
    </div>
  );
}
