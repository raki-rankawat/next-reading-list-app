# Current Feature

Project Init & Boilerplate Cleanup

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

Initialize the Next.js project and clean up the default boilerplate, resulting in a minimal, intentional starting point worth its own commit before any real feature work begins.

Requirements:

- Initialize Next.js (App Router) + TypeScript + Tailwind project
- Clean up the default Next.js boilerplate:
  - `src/app/page.tsx` should show a single `h1` with the project's actual name (not the default Next.js starter content)
  - `src/app/globals.css` should have all default starter styles removed, keeping only the Tailwind import

Acceptance criteria:

- `npm run dev` runs the Next.js app on :3000 with no errors
- `page.tsx` shows only the project name as an `h1` — no default Next.js content remains
- `globals.css` contains only the Tailwind import — no default starter styles

## Notes

<!-- Any extra notes -->

Source spec: `context/features/00-project-init.md`.

Next.js scaffolding already exists from `create-next-app`, so "initialize" is satisfied — the work is the cleanup plus one structural fix.

Structural fix: the App Router currently sits at `app/` in the repo root, but this spec and `coding-standards.md` both specify `src/app/`. Confirmed with the user to relocate it to `src/app/` now, while it is a cheap move, so later features (`src/components/`, `src/lib/`, `src/types/`) land in a consistent tree.

Implementation parts:

1. Move `app/` → `src/app/`, keeping the `@/*` import alias working
2. Reduce `page.tsx` to a single `h1` with the project name
3. Strip `globals.css` down to the Tailwind import

## History

<!-- Keep this updated. Earliest to latest -->
