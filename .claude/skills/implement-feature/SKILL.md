---
name: implement-feature
description: Implements a feature from a spec file, following the document -> branch -> implement -> test -> commit -> merge -> delete branch workflow defined in @context/ai-interaction.md. User-invoked only.
disable-model-invocation: true
---

# Implement Feature

You are implementing a single feature end-to-end, following the standing workflow in @context/ai-interaction.md. The feature spec file path is given as an argument: $ARGUMENTS

## Steps

1. **Document** - Read the feature spec at $ARGUMENTS. Update @context/current-feature.md: copy the feature name, goals, and requirements from the spec into it, and set Status to "In Progress".

2. **Branch** - Create a new branch named `feature/[feature-name]` (derive the name from the spec file, e.g. `02-home-table-view.md` -> `feature/home-table-view`).

3. **Implement (looped, one part at a time)** - Break the spec's requirements from @context/current-feature.md (sourced from $ARGUMENTS) into discrete parts before starting. Then, for each part in order:

   a. Implement only that part, following @context/coding-standards.md. Do not add anything beyond the spec's requirements.
   b. Stop. Show a short summary of what changed (files touched, key decision) for this part only.
   c. Wait for explicit approval (e.g. "resume", "continue", "looks good") before starting the next part. Do not implement the next part automatically, and do not batch multiple parts into one pause.
   d. If the reviewer requests a change, make it, show the updated summary, and wait again before moving on.

   Repeat a-d until every part of the spec is implemented and approved. Only then move to Test.

4. **Test** - Verify the feature works in the browser. Confirm json-server is running if the feature depends on it. Run `npm run build` and fix any errors before proceeding. Do not move to the next step until the build passes.

5. **Iterate** - If something doesn't match the spec or the design reference (when one is linked in the spec), fix it now, before committing.

6. **Commit** - Ask for permission before committing. Once approved, invoke `/commit-msg` to generate and run the commit — don't hand-write the commit message here. Do not commit until the build passes.

7. **Merge** - Merge the feature branch to main.

8. **Delete Branch** - Ask before deleting the branch, then delete it once merged.

9. **Review** - Do a quick self-review of the code for logic errors, unnecessary complexity, and consistency with existing patterns.

10. **Update README** - Invoke `/update-readme` to refresh the progress table and append a build-log entry for this feature. It derives the entry from the commits since the README was last touched, so run it after the merge, not before.

11. **Close out** - Update @context/current-feature.md: set Status to "Completed", clear the Goals/Notes content, and append a one-line summary of what was built to the History section.

## Rules

- Never skip the confirmation step before committing or deleting a branch.
- If something isn't working after 2-3 attempts, stop and explain the issue rather than continuing to guess.
- Don't refactor unrelated code and don't add features not in the spec.
