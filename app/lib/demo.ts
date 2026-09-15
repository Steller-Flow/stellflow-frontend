/**
 * Demo mode. The dashboard has no backend yet (#46), so its invoices,
 * escrows, analytics and notifications are fixtures held in memory. Demo
 * mode is ON unless NEXT_PUBLIC_DEMO_MODE is exactly "false", so the public
 * deployment stays populated — but every page must say so out loud (see
 * SampleDataBanner) so nobody mistakes a fixture for a record.
 *
 * Only the escrow-contract panel (app/lib/soroban.ts) is live data; it is
 * unaffected by this flag.
 */
export const DEMO_MODE: boolean = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
