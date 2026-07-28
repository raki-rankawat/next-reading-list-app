import ReadingList from "@/components/books/ReadingList";

export default function Home() {
  return (
    <main className="flex-1 bg-stone-50">
      <div className="mx-auto max-w-[1100px] px-5 pt-14 pb-20 sm:px-8">
        <ReadingList />
      </div>
    </main>
  );
}
