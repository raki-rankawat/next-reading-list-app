# Feature: Project Init & Boilerplate Cleanup

## Status

Not Started

## Goal

Initialize the Next.js project and clean up the default boilerplate, resulting in a minimal, intentional starting point worth its own commit before any real feature work begins.

## Requirements

- Initialize Next.js (App Router) + TypeScript + Tailwind project
- Clean up the default Next.js boilerplate:
  - `src/app/page.tsx` should show a single `h1` with the project's actual name (not the default Next.js starter content)
  - `src/app/globals.css` should have all default starter styles removed, keeping only the Tailwind import

## Acceptance Criteria

- `npm run dev` runs the Next.js app on :3000 with no errors
- `page.tsx` shows only the project name as an `h1` — no default Next.js content remains
- `globals.css` contains only the Tailwind import — no default starter styles

## Depends On

- Nothing — this is the true foundation feature

## Notes

Kept as its own feature (rather than folded into feature 1) specifically so this can be committed on its own — a clean "project init" commit before json-server setup and any real functionality lands. Feature 1 depends on this being done first.
