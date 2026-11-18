# 0003. Keep real data and the private brief out of the repo

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** `.gitignore`, `docs/PRODUCT.md`, [0011](./0011-single-user-multi-user-ready.md)

## In plain English

The repository is public, and the app will hold health data. So no real data goes in the repo, ever: seed data, test fixtures, screenshots, and demos all use made-up data. The original product brief also stays out, because it describes Ryan's health. A cleaned-up version of it lives at `docs/PRODUCT.md`.

## Context

Ryan chose a public repo on 2026-11-18 because Home Base is a possible portfolio piece. Vercel deploys private repos just as well, so public is about being seen, not about hosting.

The product brief written at kickoff explains *why* the app exists in personal health terms. The app itself will store what Ryan logs: movement sessions, strength numbers, and later possibly lab results. A public repo is permanent in practice: even a deleted file stays in git history and may already be cached or forked.

## Options considered

1. **Public repo, no real data, brief kept private.** The code and reasoning are visible; the personal parts aren't. Costs a cleaned-up product doc and some discipline about fixtures.
2. **Private repo.** Nothing leaks by accident. But a private repo can't be shown as a portfolio piece without granting access one person at a time.
3. **Public repo with the brief committed.** Simplest, and the brief is the best explanation of the product. It would publish health details permanently.

## Decision

Option 1.

- **The brief is not committed.** `docs/PRODUCT.md` carries the product: principles, the to-do list rules, the movement grid, phases, integrations, and what's out of scope, with the personal health background removed.
- **No real data in the repo.** Seed data, fixtures, screenshots, and demo accounts use invented data. Importing Ryan's pre-app log is a v1 feature, and the import file itself never goes in the repo.
- **`.gitignore` backs this up** with patterns for a `private/` folder, anything named like the product brief, and `*.export.csv` / `*.export.json`. Like the deny rules in [0002](./0002-carry-over-snippr-working-rules.md), this is a guardrail, not a wall.

## Consequences

- **Good:** The repo can be linked from a resume without second thoughts.
- **Bad:** Two product documents exist: the private brief and `docs/PRODUCT.md`. The repo wins where they disagree, and the brief is background.
- **Bad:** Made-up demo data has to be written and kept believable. That's a little extra work every time a screenshot is taken.
- **Follow-ups:** when screenshots or a demo account are added, record how they're generated so nobody reaches for real data out of convenience.
