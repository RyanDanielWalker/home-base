# 0018. Give Home Base its own repo, and keep Snippr as the main build

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0002](./0002-carry-over-snippr-working-rules.md), [0003](./0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)

## In plain English

Home Base lives in its own repository with its own planning space. Snippr stays Ryan's main project; Home Base is a long-term build alongside it, not a side quest that replaces it.

## Context

Covers the decision log row "Own repo and own Claude Project; Snippr stays the main build; Express & Local idles," decided 2026-11-18. Ryan has three projects: Snippr (shipping), Express & Local (idling), and Home Base (new). Home Base could have been folded into an existing fitness planning space.

## Options considered

1. **Own repo and planning space; Snippr stays the main build; Express & Local idles.** Clear focus and clean history. One more project to keep current.
2. **Fold it into the existing fitness project.** Fewer places to look. Mixes a software project's decisions with personal planning.
3. **Pause Snippr.** All attention on Home Base. Stops a project that's working.

## Decision

Option 1. The repo is public ([0003](./0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)) and set up like Snippr ([0002](./0002-carry-over-snippr-working-rules.md)).

## Consequences

- **Good:** Each project's history tells one story.
- **Bad:** Two active codebases compete for the same evenings. The v1 scope is kept small for that reason.
- **Follow-ups:** none.
