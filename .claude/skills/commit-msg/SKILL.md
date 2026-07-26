---
name: commit-msg
description: Generates a conventional commit message from the staged diff and runs the commit. Use when the user says "write a commit message", "generate a commit", "commit my changes", or runs /commit-msg.
---

# Commit Message

Generate a conventional commit message from the staged changes and commit them.

## Steps

1. **Check for staged changes** - Run `git diff --staged --stat`. If the output is empty, stop immediately and tell the user to stage their changes first (`git add ...`). Do not stage anything yourself, and do not commit.

2. **Read the staged diff** - Run `git diff --staged` and read it in full. Base the message only on what is actually staged — ignore unstaged and untracked changes.

3. **Generate the message** - Write a message in this format:

   ```
   type(scope): short subject

   - bullet of what changed
   - bullet of why
   ```

   - **type** must be one of: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`
   - **scope** is the area touched, derived from the diff (e.g. `drawer`, `search`, `db`, `context`). Omit the parens entirely if no single scope fits: `type: short subject`
   - **subject** is under 60 characters, imperative mood, lowercase, no trailing period
   - **body bullets** are optional but encouraged — cover what changed and why. Skip the body only for genuinely trivial one-line changes.

4. **Commit** - Run `git commit` with the generated message. On Windows PowerShell, pass a multi-line message with a single-quoted here-string, with the closing `'@` at column 0:

   ```powershell
   git commit -m @'
   feat(drawer): add status dropdown to book detail

   - Replaces the static status pill with an editable select
   - Lets the user change status without leaving the drawer
   '@
   ```

5. **Report** - Show the resulting commit's short hash and subject line.

## Rules

- Never include a `Co-Authored-By` trailer.
- Never mention Claude, AI, or "Generated with" anywhere in the message.
- One logical change per commit — if the staged diff spans clearly unrelated changes, say so and suggest splitting before committing.
- Never use `--no-verify` or `--amend`; create a new commit.
- Never run `git add`, `git push`, or any other git command beyond the diff checks and the commit itself.
