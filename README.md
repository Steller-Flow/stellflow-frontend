# StellFlow Frontend

[![CI](https://github.com/Steller-Flow/stellflow-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Steller-Flow/stellflow-frontend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The web app for StellFlow, a payroll / invoice / escrow platform for
freelancers and clients that settles in USDC on Stellar. This is the
Next.js 16 App Router front end: a marketing landing page, a Freighter
wallet-connect and onboarding flow, and a dashboard for invoices,
milestone escrows, analytics and notifications. The escrow contract lives in
[stellflow-smartcontract](https://github.com/Steller-Flow/stellflow-smartcontract)
and the REST API in
[stellflow-backend](https://github.com/Steller-Flow/stellflow-backend); see
[How the three repos fit together](#how-the-three-repos-fit-together).

> **⚠️ Status: UI prototype with a live, read-only link to the contract.**
> Builds, runs, and is deployed to Vercel. Two things are real: the
> Freighter connect step, and the escrow-contract panel, which reads
> `get_admin` / `is_paused` / `get_version` / `get_escrow_ttl` / `get_escrow`
> from the deployed testnet contract over Soroban RPC on every page load.
> Everything else in the dashboard runs on in-memory **sample data, labelled
> as such** on every page. No Stellar transaction is ever built, signed or
> submitted; the axios client in `app/lib/api/` has no callers and doesn't
> match the backend's routes; "auth" is a set of `localStorage` flags. The
> table below says exactly what is wired. See [Known issues](#known-issues)
> and [SECURITY.md](SECURITY.md) before relying on any of it.

## What's wired and what isn't

| Area | Status | Where | Notes |
|---|---|---|---|
| Landing page | ✅ real | `app/page.tsx`, `app/components/landing/` | The former metrics strip is now the live contract panel; the hero mock-up is labelled "Illustrative preview" |
| **Escrow contract reads** (admin, paused, version, TTL, latest ledger, `get_escrow` lookup) | ✅ **real, live** | `app/lib/soroban.ts`, `app/components/ContractStatus.tsx` | Read-only simulation over Soroban RPC from the browser; on `/` and `/dashboard/escrows`. No signing |
| Freighter connect | ✅ real | `app/lib/freighter.ts`, `app/components/WalletModal.tsx` | `requestAccess` + `getNetwork`; address and network go to `localStorage` |
| Albedo / WalletConnect | ❌ stub | `WalletModal.tsx:89-93` | Buttons exist; clicking navigates without a session (#50) |
| Session / route guards | ⚠️ client-only | `app/lib/walletSession.ts`, `app/components/AuthGuard.tsx` | `localStorage` flags, no server session; hydration error for returning users (#48) |
| Onboarding (4 steps, zod) | ✅ real | `app/components/OnboardingForm.tsx` | Stores nothing but an `onboarded` flag |
| Invoices — create, list, filter, sort, paginate, bulk actions | ✅ real, in-memory | `app/lib/invoiceStore.ts`, `app/components/Invoice*.tsx` | Seeded with 5 sample invoices in demo mode, labelled "sample data"; lost on reload (#52) |
| Invoice "Pay Now" | ❌ stub | `app/dashboard/invoices/[id]/page.tsx:92` | Shows a success toast, does nothing (#57) |
| Escrows — 5-step wizard, list, detail with state diagram | ⚠️ in-memory, simulated | `app/components/escrow/`, `app/lib/escrowStore.ts` | Wizard fakes signing with `setTimeout` and a random tx hash (#47) |
| Escrow fund / release / refund / dispute | ❌ absent | — | Detail page is read-only |
| Analytics | ❌ static | `app/components/analytics/AnalyticsCharts.tsx` | Hardcoded Recharts data, behind the sample-data banner; empty state when demo mode is off (#52) |
| Notifications | ⚠️ empty | `app/lib/stores/notificationStore.ts` | Store + UI work; nothing ever adds a notification |
| Settings | ❌ placeholder | `app/dashboard/settings/page.tsx` | Empty state with a dead button (#51) |
| Backend API client | ❌ dead code | `app/lib/api/` | Zero imports; paths/envelope don't match the backend (#46) |
| socket.io client | ❌ absent | — | Not a dependency; backend events are not consumed |
| Soroban contract **writes** (create / fund / release) | ❌ absent | — | Reads are wired (row above); no transaction is ever built or signed (#47) |
| Dark mode, toasts, error boundary, skeletons, responsive sidebar | ✅ real | `app/lib/theme.tsx`, `app/components/` | Skeletons are shown on a fixed timer, not a fetch (#52) |

## Stack

| | |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 16.2 (App Router, Turbopack), [React](https://react.dev/) 19.2, TypeScript 5 strict |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 4 with design tokens as CSS variables in `app/globals.css`; `clsx` + `tailwind-merge`; `framer-motion`; `lucide-react` icons |
| State | [zustand](https://zustand.docs.pmnd.rs/) 5 (`persist` for UI, theme and notifications); `localStorage` for the wallet session |
| Forms | react-hook-form 7 + zod 4 |
| Stellar | [`@stellar/freighter-api`](https://docs.freighter.app/) 6 for connect/sign; [`@stellar/stellar-sdk`](https://github.com/stellar/js-stellar-sdk) 17 for Soroban RPC simulation (`app/lib/soroban.ts`) and the Horizon client |
| Data | axios 1 client in `app/lib/api/` (unused); `recharts` 3; `date-fns` 4 |
| Tests | vitest 4 + `@testing-library/react` + jsdom; Playwright (`e2e/`) against a production build |
| Deploy | Vercel (`vercel.json`), live at https://stellflow.vercel.app |

The version of Next.js in `node_modules` ships its own docs at
`node_modules/next/dist/docs/`; read those rather than older tutorials
(`AGENTS.md` says the same to AI assistants).

## Prerequisites

- Node.js 20 or later and npm
- The [Freighter](https://freighter.app/) browser extension, set to
  **Testnet**, if you want to go past the landing page in a browser. The
  test suite does not need it.

That's all. There is no database, and no backend has to be running.

## Setup

```bash
git clone https://github.com/Steller-Flow/stellflow-frontend.git
cd stellflow-frontend
npm ci
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # next build — production bundle
npm start            # next start — serve the production bundle
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # vitest run
npm run test:watch   # vitest
```

To walk through the app: open `/`, click **Connect Wallet**, choose
Freighter and approve, complete the four onboarding steps, and you land on
`/dashboard`. **Log out** in the dashboard header clears the session.

## Environment variables

Every variable has a committed default, so the app runs with no env file at
all. `.env.example` has the same list with comments; copy it to `.env.local`
to override.

| Variable | Required | Default | Read in | Used for |
|---|---|---|---|---|
| `NEXT_PUBLIC_ESCROW_CONTRACT_ID` | no | `CA77HTQMZAFBU5GVVFOEHT6AGCOVZJ2MXSEZ33DJJSZWY6NFFPPI67RS` | `app/lib/soroban.ts` | The escrow contract the panel reads |
| `NEXT_PUBLIC_STELLAR_NETWORK` | no | `testnet` | `app/lib/soroban.ts` | `testnet` or `public`; picks the passphrase, default RPC and explorer links |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | no | `https://soroban-testnet.stellar.org` | `app/lib/soroban.ts` | Soroban RPC endpoint, called from the browser |
| `NEXT_PUBLIC_DEMO_MODE` | no | `true` | `app/lib/demo.ts` | `false` empties the sample stores and hides the banner |
| `NEXT_PUBLIC_API_URL` | no | `https://api.stellflow.io` (does not exist) | `app/lib/api/axiosClient.ts:3` | Base URL for the backend, **including its `/api` prefix**; the module has no callers yet (#46) |

`NEXT_PUBLIC_*` variables are inlined into the browser bundle at build time
— never put a secret in one. CI builds with
`NEXT_PUBLIC_API_URL=http://localhost:3001/api`.

## Pages

All routes are in `app/` (App Router). "Guard" is the client-side check
in `app/components/AuthGuard.tsx`: `connect` requires a connected wallet and
redirects an already-onboarded user to `/dashboard`; `onboarded` requires
both flags and redirects otherwise.

| Route | Guard | What it does |
|---|---|---|
| `/` | — | Landing page: nav, hero, **live contract panel** (see below), problems, features, how-it-works, use cases, CTA, footer. Nav's sign-in link goes to `/dashboard` or `/connect-wallet` depending on session |
| `/connect-wallet` | — | Wallet picker (`WalletModal`). Freighter → `requestAccess` → stores address/network → `/onboarding` (or `/dashboard` if already onboarded) |
| `/onboarding` | `connect` | 4-step wizard: wallet (pre-filled from session), profile (name/email/country), role + workspace name, review. Sets the `onboarded` flag and goes to `/dashboard` |
| `/onboarding/success` | — | "Workspace is ready" card with a link to `/dashboard` |
| `/onboarding/failure` | — | "Setup failed" card with retry (`/auth/loading`) and back (`/onboarding`) links. Nothing routes here today |
| `/auth/loading` | — | Animated "preparing workspace" stepper that redirects to `/onboarding/success` on a timer |
| `/dashboard` | `onboarded` | Three overview cards (hardcoded `0`s, #51) and an empty-state card |
| `/dashboard/invoices` | `onboarded` | Table of invoices with search, status / client / date-range / amount filters, six sort columns, client-side pagination, row selection with bulk delete and bulk send |
| `/dashboard/invoices/new` | `onboarded` | Invoice form: client details, currency (USDC/XLM/USD), issue/due dates, dynamic line items with quantity × unit price, tax rate, notes; live totals; zod validation |
| `/dashboard/invoices/[id]` | `onboarded` | Invoice detail: line items, totals, status badge, role-dependent actions (Pay Now — stub, Send reminder, Mark paid, Delete) |
| `/dashboard/escrows` | `onboarded` | Live contract panel, then escrow cards with state badge, release progress and milestone count; **Create Escrow** opens the 5-step wizard inline (freelancer → amount → milestones → review → confirm) |
| `/dashboard/escrows/[id]` | `onboarded` | Read-only escrow detail: parties, amounts, milestones with status, transaction history, and an `EscrowStateDiagram` of the 7-state flow |
| `/dashboard/analytics` | `onboarded` | Four stat cards plus monthly-earnings area chart, transaction-volume bar chart and payment-methods pie — all static data |
| `/dashboard/notifications` | `onboarded` | Notification list with unread count, mark-read, mark-all-read, delete, clear-all — always empty today |
| `/dashboard/settings` | `onboarded` | Placeholder empty state |

Every `/dashboard/*` page renders inside `DashboardShell`: collapsible
sidebar (hover-expands when collapsed, drawer on mobile), header with the
notification bell, theme toggle, shortened wallet address and log-out.

## Pointing it at a local backend

Honest version first: **today, nothing in the UI calls the backend.** The
client in `app/lib/api/` exists but is imported by nothing, and where it
does describe endpoints they disagree with the backend's real routes
(missing `/api` prefix, `/auth/refresh` instead of `/auth/refresh-token`,
`{ data }` instead of `{ success, data }`, and 11 methods for routes that
don't exist). Issue #46 is the plan for fixing that.

When it is wired, the setup will be:

1. Run [stellflow-backend](https://github.com/Steller-Flow/stellflow-backend)
   locally (`npm run dev` there → http://localhost:3001). Its default
   `CORS_ORIGIN` is already `http://localhost:3000`, so no change is needed
   on that side.
2. Here, create `.env.local` with
   `NEXT_PUBLIC_API_URL=http://localhost:3001/api` (note the `/api`) and
   restart `npm run dev` — `NEXT_PUBLIC_*` values are read at build time,
   so a running dev server won't pick up the change.
3. The backend's Swagger UI at http://localhost:3001/api-docs is the
   source of truth for request and response shapes.

## Running tests

```bash
npm test             # vitest run — 12 files, 65 tests
npm run test:watch
npm run test:e2e     # Playwright: builds + serves a production bundle, 3 tests (~2 min)
npm run typecheck
npm run lint         # 0 errors, 16 warnings today (#55)
```

Unit tests live in `tests/` and `vitest.config.ts` only looks there.
`tests/setup.tsx` mocks `next/navigation`, `next/image` and
`window.matchMedia`; `tests/mocks.ts` has `setupWalletSession()` /
`clearWalletSession()` to get past `AuthGuard`. Covered: `walletSession`,
`InvoiceForm`, `WalletModal`, `AuthGuard` (including SSR + hydrate),
`LandingNav`, `OnboardingForm`, `freighter.ts`, the `/connect-wallet`
page markup, `soroban.ts` (RPC mocked; success, not-found, RPC failure),
demo mode, and a Tailwind test that compiles `app/globals.css` and fails if
a width utility resolves to a spacing token. The stores, escrow wizard,
invoice table, dashboard shell and notification centre have no tests (#53).

`e2e/wallet-modal.spec.ts` drives a real Chrome against `next build && next
start` with a fake Freighter extension: the wallet modal opens at a usable
size, approve → onboarding → dashboard survives reloads, decline shows the
error. Run `npx playwright install chromium` once, or
`PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` to use an installed Chrome.

CI (`.github/workflows/ci.yml`) runs `npm ci`, typecheck, lint, test and
build on every push and pull request to `main`, on Node 20, then the e2e
suite as a second job.

## Project layout

```
app/
├── layout.tsx                 root layout: fonts, ThemeProvider, ErrorBoundary, ToastProvider
├── page.tsx                   landing page (composes components/landing/*)
├── globals.css                Tailwind 4 + design tokens (light and .dark)
├── connect-wallet/ onboarding/ auth/loading/    entry flow pages
├── dashboard/                 one folder per page, [id] routes for detail views
├── components/
│   ├── landing/               hero, metrics, features, … (server components)
│   ├── escrow/                EscrowWizard and its five step components
│   ├── analytics/             AnalyticsCharts (recharts)
│   ├── empty-states/          per-page empty state cards
│   ├── ContractStatus         live contract panel + escrow lookup; SampleDataBanner
│   ├── AuthGuard, OnboardingGate, DashboardAccount   session guards + header
│   ├── DashboardShell         sidebar layout, EmptyState, OverviewCards
│   ├── WalletModal, WalletInfo (unmounted), OnboardingForm, InvoiceForm, InvoiceTable, InvoiceFilters
│   ├── NotificationCenter, ThemeToggle, ToastProvider, ErrorBoundary, Skeleton, EscrowStateDiagram
└── lib/
    ├── soroban.ts             read-only Soroban RPC client for the escrow contract (getters + get_escrow)
    ├── demo.ts                NEXT_PUBLIC_DEMO_MODE flag
    ├── walletSession.ts       the real session: five stellflow_* localStorage keys + change event
    ├── freighter.ts           Freighter connect / network / balance / sign wrappers
    ├── invoiceStore.ts, escrowStore.ts        zustand stores the pages use (seeded with sample data)
    ├── invoiceTypes.ts, escrowTypes.ts, types.ts   types (duplicated across the three, #49)
    ├── stores/                uiStore, notificationStore (used); authStore, invoiceStore, escrowStore (dead, #49)
    ├── api/                   axios client + services (dead, #46)
    └── theme.tsx              ThemeProvider / useTheme
tests/                         vitest + testing-library; setup.tsx, mocks.ts
e2e/                           Playwright suite (production build) + fake Freighter extension
public/                        stellflow-logo.svg and the default Next.js SVGs
```

## How the three repos fit together

```
 browser ── this app ──┬── @stellar/freighter-api ── Freighter ── signs ──┐
                       │                                                  ▼
                       │                            Soroban escrow contract (testnet)
                       │                            CA77HTQMZAFBU5GVVFOEHT6AGCOVZJ2MXSEZ33DJJSZWY6NFFPPI67RS
                       │                                                  │
                       └── axios ── stellflow-backend (Express + Postgres) ◄┘ records txHash / contractId,
                                     JWT sessions, invoices, escrow mirror, notifications, socket.io events
```

Intended division of labour, as documented in the other two READMEs:

1. **Contract** ([stellflow-smartcontract](https://github.com/Steller-Flow/stellflow-smartcontract),
   testnet `CA77HTQMZAFBU5GVVFOEHT6AGCOVZJ2MXSEZ33DJJSZWY6NFFPPI67RS`,
   SEP-0055 verified build) holds the funds. The **client's wallet** signs
   `create_escrow` / `fund_escrow`; the **freelancer's wallet** signs
   `release`; disputes go to the contract admin.
2. **Backend** ([stellflow-backend](https://github.com/Steller-Flow/stellflow-backend))
   owns accounts, invoices, and an off-chain *mirror* of escrow state keyed
   by `contractId` / `txHash`, plus notifications and analytics. It never
   holds keys or submits transactions.
3. **This app** is where both wallets sign. It should build the Soroban
   transaction, get Freighter to sign it, submit it, and then tell the
   backend (`POST /api/escrows/:id/fund` with the `txHash`, etc.) so the
   mirror and the counterparty's notifications update.

**Today this app does step 3's first half (connect Freighter), reads the
contract, and nothing else.** `app/lib/soroban.ts` simulates the contract's
read-only getters over Soroban RPC — `get_admin`, `is_paused`,
`get_version`, `get_escrow_ttl`, and `get_escrow(escrow_id: u64)` decoded
field-for-field from `types.rs` — and `ContractStatus` shows the result on
`/` and `/dashboard/escrows`, including `EscrowError::EscrowNotFound (#3)`
for ids that don't exist (no escrows have been created on the deployment
yet, so that is what a lookup returns today). No transaction is built or
signed, and the backend is not called. Issues #47 (on-chain writes) and #46
(API) are the two halves of closing that gap; the backend's own #44 (it
doesn't verify `txHash` against the network yet) is the third piece.

The state vocabularies also differ and need a mapping when the wiring
lands: this app's `EscrowState` has 7 values
(`app/lib/escrowTypes.ts:1`), the backend and contract use 5
(`PENDING | FUNDED | RELEASED | REFUNDED | DISPUTED`). See #49.

## Known issues

The full list is on the [issue tracker](https://github.com/Steller-Flow/stellflow-frontend/issues).
The ones that matter most before anyone relies on this app:

| # | Area | Summary |
|---|---|---|
| [#46](https://github.com/Steller-Flow/stellflow-frontend/issues/46) | backend | API client is dead code and doesn't match the backend's routes or envelope; no auth service |
| [#47](https://github.com/Steller-Flow/stellflow-frontend/issues/47) | stellar | no transaction is ever built or signed; escrow wizard fakes it; Pay Now is a toast |
| [#48](https://github.com/Steller-Flow/stellflow-frontend/issues/48) | auth | `AuthGuard` reads `localStorage` in render → hydration error for every returning user |
| [#49](https://github.com/Steller-Flow/stellflow-frontend/issues/49) | data | two auth stores and duplicate invoice/escrow stores; wizard records an empty client address |
| [#52](https://github.com/Steller-Flow/stellflow-frontend/issues/52) | data | sample data is now labelled and behind `NEXT_PUBLIC_DEMO_MODE`; static analytics and fake loading delays remain |
| [#54](https://github.com/Steller-Flow/stellflow-frontend/issues/54) | security | `npm audit`: critical advisory in `next` 16.2.6, high in `axios`; no audit gate in CI |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, the local check commands,
and PR expectations. Issues labelled
[`good first issue`](https://github.com/Steller-Flow/stellflow-frontend/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
are scoped for newcomers.

To report a vulnerability, see [SECURITY.md](SECURITY.md) — please do not open
a public issue.

## License

[MIT](LICENSE) © 2026 StellFlow
