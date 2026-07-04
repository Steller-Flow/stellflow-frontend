# StellFlow Frontend

Cross-border payroll, invoice, and escrow platform built on the Stellar network.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Stellar SDK](https://stellar.org/developers) + [Freighter API](https://docs.freighter.app/)
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

### Lint

```bash
npm run lint
```

### Tests

```bash
npm test            # Run once
npm run test:watch  # Watch mode
```

## Project Structure

```
stellflow-frontend/
├── app/
│   ├── auth/
│   │   └── loading/page.tsx         # Onboarding loading animation
│   ├── components/
│   │   ├── landing/                  # Landing page section components
│   │   │   ├── CTASection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── FooterSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── MetricsSection.tsx
│   │   │   ├── ProblemsSection.tsx
│   │   │   └── UseCasesSection.tsx
│   │   ├── AuthGuard.tsx             # Route protection by auth state
│   │   ├── Brand.tsx                 # Logo + brand text
│   │   ├── DashboardAccount.tsx      # Wallet address + logout
│   │   ├── DashboardShell.tsx        # Sidebar layout + empty state
│   │   ├── LandingDashboardPreview.tsx
│   │   ├── LandingNav.tsx            # Landing page navigation
│   │   ├── OnboardingForm.tsx        # Multi-step onboarding wizard
│   │   ├── OnboardingGate.tsx        # Guards onboarding route
│   │   ├── WalletModal.tsx           # Wallet selection modal
│   │   └── WorkspaceLoader.tsx       # Animated workspace setup
│   ├── connect-wallet/
│   │   └── page.tsx                  # Wallet connection page
│   ├── dashboard/
│   │   ├── analytics/page.tsx
│   │   ├── escrows/page.tsx
│   │   ├── invoices/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── settings/page.tsx
│   │   └── page.tsx                  # Dashboard home
│   ├── lib/
│   │   └── walletSession.ts          # LocalStorage session helpers
│   ├── onboarding/
│   │   ├── failure/page.tsx
│   │   ├── success/page.tsx
│   │   └── page.tsx                  # Onboarding form page
│   ├── globals.css                   # Tailwind + design tokens
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Landing page
├── public/                           # Static assets
├── tests/
│   ├── setup.ts                      # Vitest setup
│   ├── AuthGuard.test.tsx
│   ├── LandingNav.test.tsx
│   ├── OnboardingForm.test.tsx
│   ├── WalletModal.test.tsx
│   └── walletSession.test.ts
├── vitest.config.ts                  # Test configuration
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Environment Variables

This project currently uses `localStorage` for session management and does not require environment variables for local development.

If backend API integration is added in the future, create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |

## Key Features

- **Wallet Connection** — Freighter, Albedo, WalletConnect support
- **Onboarding Flow** — Multi-step profile, workspace, and security setup
- **Dashboard** — Invoices, escrows, analytics, notifications, settings
- **Auth Guards** — Route protection based on wallet + onboarding state
- **Responsive** — Mobile-first design with Tailwind CSS

## License

MIT
