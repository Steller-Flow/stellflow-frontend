# Security Policy

## Status

**The StellFlow frontend is an unaudited prototype. It has no backend
connection, submits no Stellar transactions, and stores its "session" in
`localStorage`. Do not use it with real funds or treat any screen in it as a
record of money movement.**

No third-party security review has been performed. The current architecture
has known properties that will change before this is a product — they are
tracked publicly because they were found by the maintainers rather than
reported by a third party:

- Authentication is a set of `localStorage` flags
  (`app/lib/walletSession.ts`); anyone with devtools can "log in" to the
  dashboard. There is no server-side session (#46).
- The axios client keeps both an access **and** a refresh token in
  `localStorage` (`app/lib/api/axiosClient.ts`); it has no callers yet, but
  that design is wrong and is part of #46.
- The escrow wizard fabricates a transaction hash and marks the escrow
  `FUNDED` without contacting the network (#47).
- Dependencies with open advisories are listed in #54.

New findings should go through the private channel below.

## Reporting a vulnerability

Please report security issues **privately** by email to
**ojukwulevichinedu@gmail.com**. Do not open a public GitHub issue, discussion,
or pull request for a security problem.

Include as much of the following as you can:

- A description of the issue and its impact
- The affected component(s) or module(s) under `app/`
- Steps that reproduce it (a failing test under `tests/` is ideal)
- Any suggested fix

You will receive an acknowledgement, and we will work with you on a fix and
disclosure timeline before anything is published.

## Scope

### In scope

- **Wallet interaction** — any path that could get Freighter to sign a
  transaction the user did not intend, misrepresent what is being signed,
  or submit to a different network than the one shown
  (`app/lib/freighter.ts`, and whatever replaces the simulated flow in
  `app/components/escrow/EscrowWizard.tsx`)
- **Cross-site scripting** — rendering user- or backend-supplied strings
  (invoice notes, client names, milestone descriptions, notification
  bodies) in a way that executes script
- **Token and session handling** — leaking or mishandling backend tokens
  once #46 lands; storing anything sensitive where another origin or
  extension can read it
- **Supply chain** — a dependency in `package.json` that ships malicious
  code or a resolved version in `package-lock.json` that doesn't match the
  registry
- **Build-time secret exposure** — a `NEXT_PUBLIC_*` variable or build
  step that puts a secret into the client bundle

### Out of scope

- Bypassing `AuthGuard` by editing `localStorage` — this is the documented
  current behaviour, not a vulnerability, until there is a server session
- The sample data and fabricated metrics on the landing page (#52, #56);
  they are known and not a security matter
- Issues that require a compromised Freighter extension, browser, or
  Stellar validator set
- Vulnerabilities in third-party dependencies with no demonstrated impact on
  this app (`npm audit` output on its own is not a report; #54 tracks the
  current list)
- Findings on the Vercel preview deployment that hold no real data

## Supported versions

Only the `main` branch is supported. There are no tagged releases yet.
