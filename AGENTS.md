# ACNOCTEM PUBLIC / FUNNEL — AGENT ENTRY

This repository owns only the public-facing static website, funnel, landing/content/SEO and
client-side acquisition surface.

Canonical backend/orchestration/state lives in:
https://github.com/pedrograd/telegram-ai-sales

Before changing architecture, product/data contracts, Telegram, finance, CRM, AI policy,
payments, authentication or operational state, read in the canonical backend repository:
1. `AGENTS.md`
2. `PROJECT_STATE.md`
3. `NEXT_ACTIONS.md`
4. `CHANGELOG_AI.md`
5. `docs/AI_COORDINATION.md`

## Repository boundary
- Do not create a second backend, Telegram bot, database, finance ledger, task store,
  owner dashboard or AI orchestrator here.
- Keep this repository deployable as the public/static funnel unless a verified requirement
  proves server-side code is necessary.
- Never commit API keys, tokens, database URLs, cookies, private invite links or customer/legal data.
- Browser code is untrusted; privileged actions belong behind the canonical backend.
- Analytics/conversion events must use documented canonical event names and avoid collecting
  unnecessary sensitive data.

## Concurrent work
Before writing, inspect open issues and pull requests for overlap.
Use one issue -> one branch -> one pull request.
Claim new work with:
`CLAIMED_BY: <agent/tool> | BRANCH: <branch> | SCOPE: <scope>`

If another active package owns the same files or production resource, stay read-only or choose
non-overlapping work. Live provider state and current default branches outrank stale chat context.

## Completion
Record RESULT / EVIDENCE / BLOCKERS / NEXT and include applicable CI/deployment evidence.
Do not call public changes live until the deployed site is independently verified.
