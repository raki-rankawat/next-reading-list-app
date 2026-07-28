import StarScore from "@/components/books/StarScore";
import StatusBadge from "@/components/books/StatusBadge";
import type { Book } from "@/types/book";

interface BookTableProps {
  books: Book[];
  onSelect: (id: string) => void;
}

// Below `md` (768px) the table simplifies to Name and Status, per the
// responsive rules in project-overview.md — the design itself has no mobile
// treatment at all. Everything dropped here is still one tap away in the
// drawer, which goes full-screen at exactly the same breakpoint, so the table
// becomes an index and the drawer holds the detail. Author is the exception:
// it moves under the title rather than leaving, since it is half of how a book
// is recognised.
const HIDDEN_ON_MOBILE = "hidden md:table-cell";

const COLUMNS = [
  { label: "Name" },
  { label: "Type", className: HIDDEN_ON_MOBILE },
  { label: "Status" },
  { label: "Score", className: HIDDEN_ON_MOBILE },
  { label: "Author", className: HIDDEN_ON_MOBILE },
  { label: "Link", className: HIDDEN_ON_MOBILE },
];

export default function BookTable({ books, onSelect }: BookTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-stone-200">
              {COLUMNS.map((column) => (
                <th
                  key={column.label}
                  className={`px-5 py-3.5 text-left text-[11.5px] font-semibold tracking-wider text-stone-500 uppercase ${column.className ?? ""}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                onClick={() => onSelect(book.id)}
                className="cursor-pointer border-b border-stone-200 last:border-b-0 hover:bg-stone-50"
              >
                <td className="px-5 py-4 md:whitespace-nowrap">
                  {/* The whole row is clickable for pointers; this button is
                      what carries that same action for keyboard users. */}
                  <button
                    type="button"
                    onClick={() => onSelect(book.id)}
                    className="text-left text-[14.5px] font-medium text-stone-900 hover:underline"
                  >
                    {book.title}
                  </button>
                  {/* The author's mobile home, where its own column isn't —
                      the same text the hidden cell holds, just relocated. Plain
                      text rather than a second control: tapping it still opens
                      the drawer, since the row above it is the click target,
                      and the title button stays the one keyboard path in. */}
                  <p className="mt-0.5 text-[12.5px] text-stone-500 md:hidden">
                    {book.author}
                  </p>
                </td>
                <td
                  className={`px-5 py-4 text-[13.5px] whitespace-nowrap text-stone-500 ${HIDDEN_ON_MOBILE}`}
                >
                  {book.type}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={book.status} />
                </td>
                <td className={`px-5 py-4 ${HIDDEN_ON_MOBILE}`}>
                  <StarScore score={book.score} />
                </td>
                <td
                  className={`px-5 py-4 text-[13.5px] whitespace-nowrap text-stone-500 ${HIDDEN_ON_MOBILE}`}
                >
                  {book.author}
                </td>
                <td className={`px-5 py-4 ${HIDDEN_ON_MOBILE}`}>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="text-[13.5px] font-medium whitespace-nowrap text-stone-900 hover:underline"
                  >
                    Open Library
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
