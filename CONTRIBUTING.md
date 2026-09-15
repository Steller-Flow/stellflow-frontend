# Contributing to StellFlow Frontend

Thanks for your interest. This document covers how to set up the project,
the workflow we use, and what we expect from a pull request.

## Prerequisites

- **Node.js 20+** and npm (the CI runs Node 20; `package.json` sets
  `engines.node >= 20`)
- The [Freighter](https://freighter.app/) browser extension, only if you
  want to exercise the wallet-connect flow in the browser. The test suite
  mocks it and does not need it.
- **No backend and no database.** The app currently runs entirely on
  in-memory zustand stores seeded with sample data; the axios client in
  `app/lib/api/` has no callers yet (see #46). Nothing in the checks below
  makes a network request.

## Clone and test

```bash
git clone https://github.com/Steller-Flow/stellflow-frontend.git
cd stellflow-frontend
npm ci
npm test
```

You should see 6 files / 36 tests pass.

To run the app itself, `npm run dev` and open http://localhost:3000. No
`.env` is required; `.env.example` lists the one variable the code reads.

## Workflow

1. **Comment on the issue first.** Say you'd like to take it and, for anything
   non-trivial, outline your approach. This avoids duplicate work and lets us
   catch design problems early. If there's no issue for what you want to
   change, open one.
2. **Branch** from `main`: `git checkout -b fix/short-description` or
   `feat/short-description`.
3. **Make your change** with focused commits and descriptive messages.
4. **Run the local checks** (below) until they all pass.
5. **Open a pull request** against `main`. Put `Closes #N` in the description
   so the issue is linked and closed on merge.

## Local checks

Run these from the repo root before opening a PR. CI runs the same commands
in the same order and will reject a PR that fails any of them.

```bash
npm ci
npm run typecheck     # tsc --noEmit — strict mode
npm run lint          # eslint (next/core-web-vitals + next/typescript)
npm test              # vitest run
npm run build         # next build
```

`npm run lint` currently exits 0 with warnings; don't add to them (#55 will
turn on `--max-warnings 0`).

There is also a small Playwright suite in `e2e/` that builds a **production**
bundle, serves it, and drives the wallet-connect flow in a real browser with
a fake Freighter extension. It exists because the modal-layout bug that
motivated it is invisible to jsdom. Run it before touching anything under
`/connect-wallet`, `AuthGuard`, or `app/globals.css`:

```bash
npx playwright install chromium        # once
npm run test:e2e                       # ~2 min: next build + 3 tests
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e   # or use your installed Chrome
```

CI runs it as a separate job after typecheck/lint/test/build.

## Pull request expectations

- **One issue per PR.** Keep unrelated changes out; open a second PR instead.
- **New behaviour needs a test.** Component tests go in
  `tests/<Component>.test.tsx`, module tests in `tests/<module>.test.ts`.
  `vitest.config.ts` only picks up files under `tests/`.
- **Match the existing test style.** `tests/setup.tsx` mocks
  `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`),
  `next/image`, and `window.matchMedia` globally. Component tests use
  `render` + `screen` from `@testing-library/react` and `userEvent` for
  interaction — see `tests/InvoiceForm.test.tsx` for the pattern. For
  anything behind `AuthGuard`, seed the session with `setupWalletSession()`
  from `tests/mocks.ts` and clear it in `afterEach` with
  `clearWalletSession()`. Store tests don't need rendering: call
  `useInvoiceStore.getState().addInvoice(...)` and assert on `getState()`.
- **Mock the wallet, never require it.** A test must not depend on the
  Freighter extension or on Horizon being reachable. Tests that touch
  `app/lib/freighter.ts` should `vi.mock("@stellar/freighter-api")` (and
  `stellar-sdk` if they reach `getFreighterBalance`); `tests/mocks.ts` has
  `mockFreighter()` / `mockStellarSdk()` return values for this. Today
  `tests/WalletModal.test.tsx` gets away without a mock only because
  `isConnected()` rejects in jsdom and is caught — don't rely on that.
- **Client components are explicit.** Anything that uses hooks, `window`,
  `localStorage`, or a zustand store needs `"use client"` at the top of the
  file. Don't read `localStorage` during render — do it in `useEffect` (see
  #48 for why).
- **Read the Next.js docs that ship with the installed version.** This repo
  runs Next.js 16 and the App Router conventions differ from older
  tutorials. `node_modules/next/dist/docs/` is authoritative
  (`AGENTS.md` says the same).
- **Don't hand-format amounts or addresses inline.** Use
  `shortenAddress` from `app/lib/walletSession.ts` for addresses; amount
  formatting is being consolidated in #57.
- **Design tokens over raw values.** Colours, spacing and radii are CSS
  variables defined in `app/globals.css` and exposed as Tailwind utilities
  (`bg-primary`, `p-md`, `rounded-xl`, `text-text-secondary`, …). Use those
  rather than hex codes or arbitrary `[…]` values, and check both themes
  with the toggle in the dashboard header.
- **Never write `max-w-md` / `w-lg` / `min-w-sm` etc.** The named spacing
  tokens (`--spacing-md` …) share names with Tailwind's container scale, and
  the width utilities resolve spacing first, so `max-w-md` is 16px here.
  Use `max-w-(--container-md)`. `tests/tailwindTokens.test.ts` fails the
  build if a bare one sneaks in.
- **Don't change application logic in a docs or CI PR**, and vice versa.
- **Never commit secrets.** `.env*` is git-ignored except `.env.example`;
  if you add a `NEXT_PUBLIC_*` variable, add it there with a comment and to
  the README table. Remember that anything prefixed `NEXT_PUBLIC_` is
  inlined into the browser bundle.
- **Review target: 48 hours.** A maintainer aims to leave a first review
  within two days of the PR being opened. Please don't force-push over a
  reviewed commit; push follow-up commits instead so the review history stays
  readable.

## Security issues

Do **not** open a public issue for a vulnerability. See [SECURITY.md](SECURITY.md)
for how to report privately.

## License

By contributing you agree that your contributions are licensed under the
[MIT License](LICENSE).
