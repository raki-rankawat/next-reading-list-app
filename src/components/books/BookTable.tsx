import StarScore from "@/components/books/StarScore";
import StatusBadge from "@/components/books/StatusBadge";
import type { Book } from "@/types/book";

interface BookTableProps {
  books: Book[];
  onSelect: (id: string) => void;
}

const COLUMNS = ["Name", "Type", "Status", "Score", "Author", "Link"];

export default function BookTable({ books, onSelect }: BookTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-stone-200">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  className="px-5 py-3.5 text-left text-[11.5px] font-semibold tracking-wider text-stone-500 uppercase"
                >
                  {column}
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
                <td className="px-5 py-4 whitespace-nowrap">
                  {/* The whole row is clickable for pointers; this button is
                      what carries that same action for keyboard users. */}
                  <button
                    type="button"
                    onClick={() => onSelect(book.id)}
                    className="text-left text-[14.5px] font-medium text-stone-900 hover:underline"
                  >
                    {book.title}
                  </button>
                </td>
                <td className="px-5 py-4 text-[13.5px] whitespace-nowrap text-stone-500">
                  {book.type}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={book.status} />
                </td>
                <td className="px-5 py-4">
                  <StarScore score={book.score} />
                </td>
                <td className="px-5 py-4 text-[13.5px] whitespace-nowrap text-stone-500">
                  {book.author}
                </td>
                <td className="px-5 py-4">
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
