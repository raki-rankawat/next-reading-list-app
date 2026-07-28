# Learning Notes

> Concepts this codebase relies on, for someone reading it for the first time.
>
> This is not documentation of _what_ the app does — the [README](../../README.md)
> build log covers that, and the numbered notes beside this one walk through
> each feature. This is a list of the **ideas** you need in your head for the
> code to read as obvious rather than arbitrary.

## How to use this

Each entry is: what the concept is, where it lives here, and why it was worth
doing. If a definition is new to you, that is the signal to go and read about it
properly — the entry gives you the name to search for, not a full tutorial.

Entries marked **★** are the ones that shaped the most code. If you only learn
five things, learn those.

---

## 0. The five that matter most

| Concept                                               | Section                                               |
| ----------------------------------------------------- | ----------------------------------------------------- |
| Derived state over stored state                       | [1.2](#12--derived-state-over-stored-state-)          |
| Keying transient state by id, not booleans            | [1.3](#13--key-transient-state-by-id-not-by-boolean-) |
| Race conditions in async UI                           | [2.2](#22--stale-responses-and-late-rejections-)      |
| Reject vs. set an error state                         | [2.4](#24--reject-vs-store-the-error-)                |
| Matching on stable identifiers, never display strings | [6.3](#63--stable-identifiers-vs-display-strings-)    |

---

## 1. React state

### 1.1 — Lifting state up, and splitting it when it has two jobs

**Concept.** When two components need the same state, it moves to their closest
common parent. Less obviously: one piece of state that answers two questions
should usually be two pieces of state.

**Here.** [`ReadingList.tsx`](../../src/components/books/ReadingList.tsx) holds
`selectedId` and `isDrawerOpen` separately. A single `selectedBook | null` would
be simpler, but closing the drawer would blank it instantly — and the drawer
slides out over 300ms, so it needs content to render _while closing_. Keeping
the id after the panel closes is what gives it something to draw.

Tracking the **id** rather than the book object also means the drawer always
re-derives from the live list (`books.find(...)`), so an edit shows up
immediately instead of leaving a stale copy on screen.

### 1.2 — Derived state over stored state ★

**Concept.** If a value can be calculated from state you already have, calculate
it during render. Don't store it in its own `useState` and try to keep the two in
sync — that's where "the UI shows the wrong thing for one render" bugs come from.

**Here.** [`useBookSearch.ts`](../../src/hooks/useBookSearch.ts) is the clearest
example. It stores exactly one thing:

```ts
interface Settled {
  query: string; // the query this answer belongs to
  results: SearchResult[];
  error: string | null;
}
```

and derives everything the UI needs from whether that tag still matches the
current input:

```ts
const isSettled = settled.query === trimmed;

return {
  results: isSettled ? settled.results : [],
  isSearching: trimmed !== "" && !isSettled,
  error: isSettled ? settled.error : null,
};
```

Three separate `useState`s for results, loading, and error would each need
clearing at the right moment, and any missed case shows stale results under a new
query. Here it is impossible by construction: results that don't belong to what's
in the box are simply not returned.

A side benefit worth noticing — the 400ms debounce window automatically reads as
"searching", because during it the tag doesn't match yet. Nobody had to write
that.

> **Go learn:** derived state, "single source of truth", and why
> `useEffect` + `setState` to sync two states is an anti-pattern.

### 1.3 — Key transient state by id, not by boolean ★

**Concept.** For "something is in flight" state, store _which_ thing rather than
_whether_ something is.

**Here.** Everywhere. [`BookDrawer.tsx`](../../src/components/books/BookDrawer.tsx)
has `savingBookId`, `deletingBookId`, `confirmingBookId` — not `isSaving`,
`isDeleting`, `isConfirming`. The drawer is permanently mounted and just swaps
its `book` prop, so with a boolean this happens:

1. You change Book A's status. The request is slow.
2. You close the drawer and open Book B.
3. A's request fails.
4. `isSaving` is still true and the error renders — **against Book B**.

With an id, the render is guarded by `saveError?.bookId === book.id`, so a late
failure lands on the book it belongs to or nowhere at all. The same pattern keys
search cards by `olKey` in [`SearchBooks.tsx`](../../src/components/search/SearchBooks.tsx).

### 1.4 — Effect cleanup

**Concept.** The function you return from `useEffect` runs before the next
effect and on unmount. Any effect that starts something asynchronous needs one,
or it writes state after the component stopped caring.

**Here.** Two flavours:

```ts
// useBooks.ts — a flag the async function checks before every setState
let cancelled = false;
// ...
return () => {
  cancelled = true;
};
```

```ts
// useBookSearch.ts — cancels the timer AND aborts the in-flight request
return () => {
  clearTimeout(timer);
  controller.abort();
};
```

### 1.5 — Debouncing

**Concept.** Delay reacting to input until it stops changing, so you fire one
request instead of one per keystroke. `setTimeout` in an effect,
`clearTimeout` in the cleanup — each keystroke cancels the previous timer.

**Here.** [`useBookSearch.ts`](../../src/hooks/useBookSearch.ts), 400ms. The design
has no search button, so typing is the only trigger; without a debounce, "dune"
would be four API calls.

### 1.6 — `useMemo` for derived collections

**Concept.** Recompute a value only when its inputs change.

**Here.** [`SearchBooks.tsx`](../../src/components/search/SearchBooks.tsx) builds a
`Set` of every saved `olKey`:

```ts
const addedKeys = useMemo(() => new Set(books.map((b) => b.olKey)), [books]);
```

Two things at once: the `Set` gives O(1) lookup per card instead of scanning the
list 24 times, and `useMemo` stops the `Set` being rebuilt on every keystroke.

### 1.7 — Branch ladder instead of nested ternaries

**Concept.** When a component has four or more mutually exclusive states, assign
JSX to a variable through `if/else if` and render the variable.

**Here.** Both [`ReadingList.tsx`](../../src/components/books/ReadingList.tsx) and
[`SearchBooks.tsx`](../../src/components/search/SearchBooks.tsx) build a `body`
variable. The ordering is load-bearing: the empty-query check runs before the
loading check, so an empty box shows the idle panel rather than a spinner.

---

## 2. Async, and the bugs that live there

### 2.1 — `try` / `catch` / `finally` around every fetch

**Concept.** `fetch` rejects only on network failure — a 404 or 500 **resolves**
with `response.ok === false`. Both have to be handled, and they're different code
paths.

**Here.** [`json-server.ts`](../../src/lib/json-server.ts) does both, every time:

```ts
try {
  response = await fetch(`${API_BASE_URL}/books`);
} catch {
  throw new Error(UNREACHABLE_MESSAGE); // network / server down
}

if (!response.ok) {
  throw new Error(`Couldn't load your books (${response.status}).`); // HTTP error
}
```

The two produce different messages because they're different problems — one
means "start json-server", the other means "the request was wrong".

### 2.2 — Stale responses and late rejections ★

**Concept.** The response you're waiting for might not be the one you still
want. Two distinct hazards:

- **Stale success** — an older request finishes after a newer one, and overwrites
  the newer result.
- **Late rejection** — a request fails after the user has moved on, and the error
  is reported against whatever is on screen now.

**Here.** Three defences, and it's worth seeing why one alone isn't enough:

1. **Abort** the outgoing request ([`useBookSearch.ts`](../../src/hooks/useBookSearch.ts)) —
   stops the network work.
2. **Tag** the answer with what it answers, then check the tag before rendering
   ([`useBookSearch.ts`](../../src/hooks/useBookSearch.ts), and `AddError.query` in
   [`SearchBooks.tsx`](../../src/components/search/SearchBooks.tsx)).
3. **Guard** the cleanup so it only clears state it owns:
   ```ts
   setSavingBookId((current) => (current === id ? null : current));
   ```

The tag is the one people skip, and it's the one that catches this: clearing an
error when the query changes looks correct, but a rejection can land _after_ the
change and re-populate what you just cleared. You can't clear your way out of a
race — you have to check relevance at render time.

### 2.3 — `AbortController`, and why an abort isn't an error

**Concept.** `AbortController` cancels a `fetch`. The aborted request rejects
with a `DOMException` named `AbortError` — which is not a failure, it's you
cancelling on purpose. Reporting it would show "something went wrong" every time
the user typed a letter.

**Here.** [`open-library.ts`](../../src/lib/open-library.ts) rethrows it unchanged
so callers can recognise it, and [`useBookSearch.ts`](../../src/hooks/useBookSearch.ts)
returns early:

```ts
if (controller.signal.aborted) return;
```

### 2.4 — Reject vs. store the error ★

**Concept.** Not every failure deserves the same treatment. Ask: _does this
failure invalidate the whole screen, or just the control the user touched?_

**Here.** [`useBooks.ts`](../../src/hooks/useBooks.ts) splits them deliberately:

- The **initial load** stores `error` in the hook → the table is replaced by an
  error panel. Correct: there's nothing to show.
- **Mutations** (`addBook`, `updateStatus`, `removeBook`) `throw` and let the
  caller catch → the error appears next to the button that failed. Storing it in
  the hook would blow away a perfectly good table because one save failed.

### 2.5 — No optimistic updates here (and why)

**Concept.** An _optimistic update_ applies a change locally before the server
confirms, then rolls back on failure. It feels faster; it costs you rollback
logic and a window where the UI is lying.

**Here.** Deliberately not used. `updateStatus` updates local state from the
**server's response**, not from what was sent:

```ts
const updated = await updateBookStatus(id, status);
setBooks((current) => current.map((b) => (b.id === id ? updated : b)));
```

If it fails, the select snaps back — the UI never shows a status that didn't
persist. Against localhost the delay is invisible, so optimism buys nothing.

### 2.6 — Update local state instead of refetching

**Concept.** After a successful mutation you can either refetch the list or
apply the same change locally. Refetching is simpler and always correct;
applying locally saves a round trip.

**Here.** All three mutations apply locally — append on create, map on update,
filter on delete. Single-user app, no other writer, so local state and the server
can't disagree.

---

## 3. TypeScript

### 3.1 — Union literal types

```ts
export type BookStatus = "read" | "currently_reading" | "want_to_read";
```

**Why it matters.** `status: string` would compile with `"reading"`,
`"READ"`, or a typo. The union makes those errors, and it makes
`Record<BookStatus, string>` exhaustive — add a fourth status and every lookup
table fails to compile until you handle it. That's the feature, not a nuisance.

### 3.2 — Derived types with `Omit`

```ts
export type NewBook = Omit<Book, "id">;
```

**Why.** A book being POSTed has every field except the `id`, which is the
server's to assign. Writing the interface out twice means they drift; `Omit`
means adding a field to `Book` automatically requires it at creation.

> Also worth knowing: `Pick`, `Partial`, `Required`, `Record`, `NonNullable`.
> [`Spinner.tsx`](../../src/components/ui/Spinner.tsx) uses
> `Record<NonNullable<SpinnerProps["size"]>, string>` to build a lookup keyed by
> exactly the values the optional prop allows.

### 3.3 — `unknown` in `catch`, and narrowing

**Concept.** In modern TypeScript a caught value is `unknown`, because JS lets
you throw anything. You must narrow before using it.

**Here.** The same three lines everywhere something can fail:

```ts
catch (caught) {
  setError(caught instanceof Error ? caught.message : "Couldn't add this book.");
}
```

The fallback string isn't defensive padding — a non-`Error` throw would
otherwise render as `undefined`.

### 3.4 — Typing the API boundary honestly

**Here.** [`open-library.ts` types](../../src/types/open-library.ts) mark almost
every field optional:

```ts
export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[]; // absent for uncredited works
  cover_i?: number; // absent when there's no cover
  ratings_average?: number; // absent when nobody has rated it
}
```

That is what the API actually returns. Declaring them required would be a lie the
compiler then helpfully enforces, and you'd find out at runtime. The `?` is what
forces `?? "Unknown author"` and the `cover_i === undefined` check to exist.

---

## 4. Tailwind CSS

### 4.1 — Tailwind only sees complete class strings ★

**Concept.** Tailwind scans your source as **text**. It never runs it. A class
built at runtime doesn't exist in the stylesheet.

```tsx
// Broken — this class will never be generated
className={`bg-status-${status}`}

// Works — the full string is present in the source
const TINTS = { read: "bg-status-read/15", /* ... */ };
```

**Here.** [`StatusBadge.tsx`](../../src/components/books/StatusBadge.tsx) and
[`StatePanel.tsx`](../../src/components/ui/StatePanel.tsx) both write every
combination out longhand for this reason. When you see a verbose lookup table of
class strings, this is why.

### 4.2 — Conflicting utilities resolve by stylesheet order, not class order

**Concept.** `className="py-24 py-16"` does **not** give you `py-16`. Both land
in the stylesheet, and the CSS cascade picks whichever is defined later there.
Appending an override to a shared class string is unreliable.

**Here.** This was a real bug in feature 06. The fix: each panel sets its own
padding once, and [`StatePanel.tsx`](../../src/components/ui/StatePanel.tsx) now
_derives_ it from the variant so there's nothing to override.

### 4.3 — `@theme` tokens

**Concept.** Tailwind v4 defines design tokens in CSS, and each one generates
matching utilities.

**Here.** [`globals.css`](../../src/app/globals.css) — `--color-status-read`
generates `bg-status-read`, `text-status-read`, `border-status-read`. Note there
are **six** status colours, not three: each status has a darker `-ink` companion,
because a single hue can't be both a pale badge background and readable text on
itself.

### 4.4 — `currentColor` as a theming mechanism

**Concept.** `currentColor` resolves to the element's inherited `color`. Style a
child with it and it adapts to wherever it's placed, with no prop.

**Here.** [`Spinner.tsx`](../../src/components/ui/Spinner.tsx) is
`border-current border-t-transparent`. That single component draws itself grey on
the light table, muted blue on the dark search grid, and white inside filled
buttons — because each parent already set a text colour. Compare
[`StarScore.tsx`](../../src/components/books/StarScore.tsx), which needed an explicit
`tone` prop because its colours are _not_ the surrounding text colour.

### 4.5 — Mobile-first breakpoints

**Concept.** An unprefixed utility applies everywhere; `md:` applies at ≥768px
**and up**. So the base styles are the small-screen styles.

**Here.** [`BookTable.tsx`](../../src/components/books/BookTable.tsx) —
`hidden md:table-cell` means "hidden by default, shown from 768px". Read
`px-5 sm:px-8` the same way: 20px padding on phones, 32px from 640px.

### 4.6 — `motion-reduce:`

**Concept.** Respects the OS "reduce motion" setting, for users who get motion
sickness or vestibular symptoms from animation.

**Here.** `motion-reduce:animate-none` on the spinner. The text beside it still
says what's happening, so nothing is lost by freezing it.

---

## 5. Accessibility

This is the area most likely to be unfamiliar, and it's ~15% of the code here.

### 5.1 — Live regions: `alert` vs `status`

**Concept.** Screen readers announce a page once. Content that appears _later_
is silently missed unless it's in a live region.

| Role                 | Interrupts?     | Use for                          |
| -------------------- | --------------- | -------------------------------- |
| `role="alert"`       | Yes (assertive) | Errors — something went wrong    |
| `role="status"`      | No (polite)     | Progress — "Saving…", counts     |
| `aria-live="polite"` | No              | Same as `status`, on any element |

**Here.** `role="alert"` on every failure message, `role="status"` on the drawer's
`Saving…`. In [`StatePanel.tsx`](../../src/components/ui/StatePanel.tsx) the role is
derived from the variant, so an error panel _cannot_ be built without it — before
that, the table's error was silent and the search's wasn't.

### 5.2 — Live regions announce their whole contents

**Concept.** When a live region changes, the reader announces **everything**
inside it, not just what changed. So wrap the smallest thing that carries the
news.

**Here.** A real bug, caught after feature 06 merged: `aria-live` wrapped the
results grid, so every keystroke read out all 24 cards. Now
[`SearchBooks.tsx`](../../src/components/search/SearchBooks.tsx) has a `sr-only`
paragraph holding a one-line summary, with the grid **outside** it:

```tsx
<p aria-live="polite" className="sr-only">
  {status}
</p>
```

### 5.3 — `aria-hidden` for decoration

**Concept.** Hides an element from assistive tech while leaving it visible.

**Here.** The spinner is always `aria-hidden`, because every placement pairs it
with visible text ("Saving…", "Adding…"). Announcing both would be a stutter.

### 5.4 — `inert`

**Concept.** Makes a subtree unfocusable and unclickable — the correct way to
disable background content behind an overlay. Better than `tabIndex={-1}`, which
only handles the element you put it on.

**Here.** Twice in [`BookDrawer.tsx`](../../src/components/books/BookDrawer.tsx): the
closed drawer is `inert` so a hidden panel isn't in the tab order, and the panel
goes `inert` behind the delete confirmation, because fields blurred behind an
overlay shouldn't be reachable by keyboard either.

### 5.5 — `display: none` removes elements from the accessibility tree

**Concept.** Not just invisible — genuinely absent. Which means Tailwind's
`hidden` is safe to use for responsive duplication.

**Here.** [`BookTable.tsx`](../../src/components/books/BookTable.tsx) renders the
author twice: once in its own column, once under the title for mobile. Exactly
one is ever displayed, so it's never announced twice.

`visibility: hidden` removes content too. But `opacity: 0`, off-screen
positioning, and zero-size clipping do **not** — the content stays in the
accessibility tree and is still announced. That asymmetry is worth internalising:

- Hiding it from **everyone** → `display: none` / `visibility: hidden`.
- Hiding it from **sight only**, still announced → `sr-only` (which is how the
  search view's live-region summary works — invisible, but read aloud).
- Visible but not **reachable** → `inert`. Nothing CSS does can achieve this,
  which is exactly why the attribute exists.

### 5.6 — Don't break table semantics

**Concept.** Screen readers announce a `<table>` with row and column context
("Row 3, Status, Currently Reading"). Applying `display: block` to table elements
— the popular CSS trick for stacking tables on mobile — **destroys** that.

**Here.** The mobile table hides columns instead. Fewer columns, still a real
table. The dropped fields are all in the drawer, which goes full-screen at the
same breakpoint.

### 5.7 — Clickable rows need a real focusable control

**Concept.** `onClick` on a `<tr>` works for a mouse and is invisible to a
keyboard. Adding `role="button"` to a `<tr>` breaks the table semantics in 5.6.

**Here.** The row keeps its `onClick` for pointers, and the title cell contains a
genuine `<button>` carrying the same action for keyboard users. Best of both,
no ARIA needed.

### 5.8 — Accessible names must be distinguishable

**Concept.** Screen reader users can list every button on a page. Twenty-four
buttons all named "Add" is a useless list.

**Here.** `aria-label={`Add ${result.title} to your reading list`}` on each card.

---

## 6. Data layer and external APIs

### 6.1 — Isolate fetches behind typed functions

**Concept.** No component calls `fetch` directly. `src/lib/` owns the URLs, the
verbs, the error messages, and the response types; components call functions.

**Here.** [`json-server.ts`](../../src/lib/json-server.ts) (our fake backend) and
[`open-library.ts`](../../src/lib/open-library.ts) (third party). Swapping
json-server for a real API is one file.

### 6.2 — REST verbs

| Verb                | Here               | Meaning                                    |
| ------------------- | ------------------ | ------------------------------------------ |
| `GET /books`        | `getBooks`         | Read the list                              |
| `POST /books`       | `createBook`       | Create — server assigns the id             |
| `PATCH /books/:id`  | `updateBookStatus` | Partial update — only `{ status }` is sent |
| `DELETE /books/:id` | `deleteBook`       | Remove                                     |

`PATCH` not `PUT`: `PUT` replaces the whole record, so it would need every field
and would clobber anything it didn't send.

### 6.3 — Stable identifiers vs. display strings ★

**Concept.** Match records on identifiers, never on names. Names collide, change,
and get punctuated differently.

**Here.** This is the entire reason "Already Added" is its own feature. A search
for "The Hobbit" returns Tolkien's novel, a graphic-novel adaptation, and a movie
companion — all titled _The Hobbit_. Matching on title marks all three as added
when you add any one.

So every book stores `olKey` — Open Library's own id, `/works/OL27482W` — and
matching compares that. It's kept **verbatim, prefix included**, so neither side
needs normalising before comparison.

> This generalises far beyond this app: email addresses change, usernames change,
> display names collide. Match on the id.

### 6.4 — Ask an API for the fields you need

**Concept.** Many APIs return a default field set and let you request others.
Cheaper payloads, and sometimes the only way to get what you want.

**Here.** [`open-library.ts`](../../src/lib/open-library.ts) sends
`fields=key,title,author_name,cover_i,ratings_average&limit=24`.
`ratings_average` is **not** in the default response — without asking, the card's
star rating is unobtainable. `limit` matters too: the API pages at 100 results,
which is 100 cover images nobody scrolls to.

### 6.5 — Arrays from APIs are rarely what the label says

**Here.** `author_name` is not "the author" — it's every credited contributor,
including translators and narrators. The card shows one line, so it takes
`author_name?.[0]` with a fallback. Read the API docs before you `join(", ")`.

### 6.6 — `next/image` and remote hosts

**Concept.** Next.js optimises images through its own server, so remote hosts
must be allow-listed or it refuses.

**Here.** [`next.config.ts`](../../next.config.ts) allows
`covers.openlibrary.org/b/id/**`. Also note the guard: `next/image` treats
`src=""` as an **error**, not as "nothing to draw", so every cover render is
wrapped in `{book.coverUrl && ...}` with a striped placeholder behind it.

---

## 7. Conventions used throughout

- **Server components by default.** Only files needing state, effects, or event
  handlers carry `'use client'`. Here that leaves the two `page.tsx` files as the
  only server components — the data loads client-side deliberately, so a genuine
  loading state exists and mutations can happen without a round trip through the
  server.
- **One job per component.** `StatusBadge` renders a pill. `StarScore` renders
  stars. `Spinner` spins. They know nothing about books, fetching, or each other.
- **Comments explain _why_, not _what_.** The code says what it does. Comments
  are reserved for the reasoning you can't recover by reading it — why the confirm
  popup is a sibling of the drawer and not a child, why the score is `0` and not
  the search result's rating.
- **Deviations get recorded.** The design file is the source of truth for UI;
  where the code departs from it, the reason is written down in
  [`context/current-feature.md`](../current-feature.md)'s history and the README
  build log.

---

## Where to go next

1. Read [`src/types/book.ts`](../../src/types/book.ts) — 17 lines, and the whole
   data model.
2. Read [`src/lib/json-server.ts`](../../src/lib/json-server.ts) — every way this
   app talks to its backend.
3. Read [`src/hooks/useBooks.ts`](../../src/hooks/useBooks.ts) — sections 1.4, 2.4,
   2.5 and 2.6 all in 80 lines.
4. Then pick any of the numbered walkthroughs in this folder — start with
   [`02-home-table-view.md`](02-home-table-view.md) — and read it alongside the
   code it describes.
