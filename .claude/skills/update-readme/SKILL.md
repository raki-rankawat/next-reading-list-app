---
name: update-readme
description: Updates README.md after a feature is implemented — refreshes the progress table and appends a build-log entry covering what shipped, what was decided, and what broke, derived from the commits since README was last touched. Use when the user says "update the readme", "update readme after this feature", or runs /update-readme.
---

# Update README

Bring `README.md` up to date with the work that landed since it was last updated. Everything written must be derived from the repo — commits, diffs, and the feature docs — never from memory or assumption.

## Steps

1. **Find the range** - Get the last commit that touched the README:

   ```bash
   git log -1 --format=%H -- README.md
   ```

   That hash is the start of the range. If the command returns nothing, use the repo's first commit (`git rev-list --max-parents=0 HEAD`). Everything from there to `HEAD` is what this update must cover.

2. **Gather what happened** - Within that range, collect:

   - `git log <start>..HEAD --oneline` — the commits, including merge commits
   - `git diff <start>..HEAD --stat` — which files and areas actually changed
   - `git log <start>..HEAD --format="%h %s%n%b"` — the commit bodies, which already carry the what/why bullets written by `/commit-msg`

   Then read `context/current-feature.md` (goals, notes, decisions for the feature just finished) and the matching spec in `context/features/`. If a decision or fix is not visible in the commits or these docs, do not write it down.

3. **Handle the first run** - If `README.md` is still the unmodified `create-next-app` boilerplate, replace it entirely rather than editing around it. The default text describes things this project no longer has (`app/page.tsx`, Geist fonts, Vercel deploy) and is actively misleading. Build the full structure from step 4.

4. **Write the README** - Target this structure, creating any section that doesn't exist yet and leaving sections not covered by this update untouched:

   ```markdown
   # Reading List

   <one-line description of the app>

   ## Status

   | # | Feature | Status |
   |---|---------|--------|
   | 00 | Project Init & Boilerplate Cleanup | ✅ Done |
   | 01 | json-server Setup | ⬜ Not started |
   ...

   ## Getting Started

   <the real commands, both processes — see CLAUDE.md>

   ## Tech Stack

   ## Project Structure

   ## Build Log

   ### 00 — Project Init & Boilerplate Cleanup

   `888de9b`

   **Shipped** — what now exists that didn't before
   **Decisions** — non-obvious choices and the reasoning
   **Fixes** — anything that broke during the work and how it was resolved
   ```

   - The **Status** table lists every spec in `context/features/`, so the reader sees the whole roadmap and where it stands.
   - The **Build Log** grows downward: newest entry appended at the bottom, existing entries never rewritten or deleted.
   - Omit the **Fixes** line entirely when nothing broke — do not pad it with "None".
   - Keep entries short. Three to six lines per feature, not a diff transcript.

5. **Commit** - Show the user what changed, then invoke `/commit-msg` to commit it (`docs:` type). Ask before committing, per `context/ai-interaction.md`.

## Rules

- Never invent progress. A feature is only ✅ Done if its commits are in the log.
- Never describe a fix that isn't evidenced in the commits or `current-feature.md`.
- Keep the Getting Started commands in sync with `CLAUDE.md` — both `npm run dev` and the separate `json-server` process, since there is no bundled backend.
- Don't reintroduce `create-next-app` boilerplate text once it has been removed.
