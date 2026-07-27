---
name: understand-feature
description: Generates a plain-language, code-level explanation of how a feature (already implemented and merged) actually works, based on its git history — for learning purposes, not for modifying code. User-invoked only.
disable-model-invocation: true
---

# Understand Feature

You are producing a code-level explanation of an already-implemented feature, for the user's own learning. The feature spec file path is given as an argument: $ARGUMENTS

This is a read-only, explanatory task. Do not modify any source files. Do not check out or switch branches — the user's current working tree must be left exactly as it is.

## Steps

1. **Identify the feature name** from $ARGUMENTS (e.g. `02-home-table-view.md` -> "home-table-view").

2. **Find the commit range for this feature** using git history, without changing the working tree:
   - Run `git log --oneline --all --grep="<feature-name-or-keywords>"` to find candidate commits
   - Also check `git log --oneline --all --grep="feature/<feature-name>"` in case the merge commit references the branch name
   - If multiple commits are found (unsquashed feature branch), identify the first and last commit of that feature's range
   - If exactly one commit is found (squashed merge), that single commit is the feature's full diff
   - If nothing is found automatically, stop and ask the user to confirm the relevant commit hash(es) — do not guess

3. **Get the diff** for the identified range: `git diff <before>..<after>` (or `git show <commit>` if a single squashed commit). Do not apply, revert, or check out this diff — only read it.

4. **Cross-reference the spec** at $ARGUMENTS (its Goal, Requirements, and Acceptance Criteria) against what the diff actually shows, so the explanation ties "what was asked for" to "what was actually built."

5. **Write the explanation** to a new file at `context/understanding/<same-number-and-name-as-the-spec>.md` (e.g. `context/understanding/02-home-table-view.md`). Cover:
   - What this feature does, in plain language
   - Key files added/changed, and the role each one plays
   - Key components/functions introduced, and how they connect to each other
   - Any non-obvious decisions visible in the diff (why something was built a certain way, if inferable)
   - How this feature connects to features before/after it, if relevant

6. **Do not touch `context/current-feature.md`, the feature spec itself, or any source file.** This skill only reads and produces one new file.

## Notes

- This folder (`context/understanding/`) is a personal learning reference, not part of the always-loaded context in @CLAUDE.md — it will grow large over time and isn't needed for every session.
- If the user wants to actually run or browse the code as it existed at that point in history (not just read a diff), suggest `git worktree add ../review-<feature-name> <commit-hash>` instead of checking out in place — this leaves the current working branch untouched.
