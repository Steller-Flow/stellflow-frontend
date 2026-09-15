import { defineConfig, devices } from "@playwright/test";

const PORT = 3210;

// Runs against a PRODUCTION build: the wallet-modal layout bug this suite
// guards was reported from the deployed site, and production is what the
// reviewer sees. `npm run test:e2e` builds first; set E2E_REUSE=1 to point
// at a server you already started on the port.
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      // PLAYWRIGHT_CHANNEL=chrome runs against an installed Google Chrome
      // instead of the downloaded Chromium (`npx playwright install chromium`).
      use: { ...devices["Desktop Chrome"], channel: process.env.PLAYWRIGHT_CHANNEL },
    },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/connect-wallet`,
    reuseExistingServer: !!process.env.E2E_REUSE,
    timeout: 180_000,
  },
});
