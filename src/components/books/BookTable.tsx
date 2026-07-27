import StarScore from "@/components/books/StarScore";
import StatusBadge from "@/components/books/StatusBadge";
import type { Book } from "@/types/book";

interface BookTableProps {
  books: Book[];
}

const COLUMNS = ["Name", "Type", "Status", "Score", "Author", "Link"];

export default function BookTable({ books }: BookTableProps) {
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
                className="border-b border-stone-200 last:border-b-0 hover:bg-stone-50"
              >
                <td className="px-5 py-4 text-[14.5px] font-medium whitespace-nowrap text-stone-900">
                  {book.title}
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
