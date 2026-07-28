import SearchBooks from "@/components/search/SearchBooks";

export default function Search() {
  return (
    <main className="bg-dark-bg flex-1">
      <div className="mx-auto max-w-[1200px] px-8 pt-12 pb-20">
        <SearchBooks />
      </div>
    </main>
  );
}
