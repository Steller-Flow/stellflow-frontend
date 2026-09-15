/**
 * Regression tests for the connect → onboarding → dashboard path under a
 * PRODUCTION-style page load: the guard is server-rendered (no session on the
 * server), then hydrated in a browser that already has a session in
 * localStorage. Before the fix, AuthGuard read localStorage during render, so
 * the server tree (null) and the first client tree (children) disagreed and
 * React threw a recoverable hydration error (#418) on every guarded route.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import { AuthGuard } from "../app/components/AuthGuard";
import { connectWallet, completeOnboarding } from "../app/lib/walletSession";

// hydrateRoot is driven with React's own act() here (testing-library's render
// can't hydrate), which requires opting in to the act environment.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: mockReplace, prefetch: vi.fn() }),
}));

const ADDRESS = "GBXGHABC123DEF456GHIJKL789MNOPQRSTUVWXYZ1234567890ABCDEFGH";

type Mode = "connect" | "onboarded";

const tree = (mode: Mode) => (
  <AuthGuard mode={mode}>
    <p data-testid="protected">Protected Content</p>
  </AuthGuard>
);

/**
 * Simulates a full page load: server render with an empty session, then
 * hydrate with `seedSession` applied first (what the browser has in
 * localStorage). Returns the container, the recoverable errors React reported
 * during hydration, and a dispose function.
 */
async function loadPage(mode: Mode, seedSession: () => void) {
  localStorage.clear();
  const html = renderToString(tree(mode));

  seedSession();

  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  const hydrationErrors: string[] = [];
  const consoleError = vi.spyOn(console, "error").mockImplementation((...args) => {
    hydrationErrors.push(String(args[0]));
  });

  let root: Root | undefined;
  await act(async () => {
    root = hydrateRoot(container, tree(mode), {
      onRecoverableError: (error) => hydrationErrors.push(String(error)),
    });
  });
  consoleError.mockRestore();

  return {
    html,
    container,
    hydrationErrors,
    dispose: async () => {
      await act(async () => root?.unmount());
      container.remove();
    },
  };
}

let disposers: Array<() => Promise<void>> = [];

describe("AuthGuard under a production page load (SSR + hydrate)", () => {
  beforeEach(() => {
    localStorage.clear();
    mockReplace.mockClear();
  });

  afterEach(async () => {
    for (const dispose of disposers) await dispose();
    disposers = [];
  });

  it("returning user with a full session reaches /dashboard without a hydration error or a redirect", async () => {
    const page = await loadPage("onboarded", () => {
      connectWallet(ADDRESS, "TESTNET");
      completeOnboarding();
    });
    disposers.push(page.dispose);

    expect(page.hydrationErrors).toEqual([]);
    expect(page.container.querySelector('[data-testid="protected"]')).not.toBeNull();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("never renders protected content on the server, even though the client may have a session", async () => {
    const page = await loadPage("onboarded", () => {
      connectWallet(ADDRESS, "TESTNET");
      completeOnboarding();
    });
    disposers.push(page.dispose);

    expect(page.html).not.toContain("Protected Content");
  });

  it("user with no session is sent to /connect-wallet and never sees protected content", async () => {
    const page = await loadPage("onboarded", () => {});
    disposers.push(page.dispose);

    expect(page.hydrationErrors).toEqual([]);
    expect(page.container.querySelector('[data-testid="protected"]')).toBeNull();
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/connect-wallet");
  });

  it("user who connected but did not onboard is sent from /dashboard to /onboarding", async () => {
    const page = await loadPage("onboarded", () => {
      connectWallet(ADDRESS, "TESTNET");
    });
    disposers.push(page.dispose);

    expect(page.hydrationErrors).toEqual([]);
    expect(page.container.querySelector('[data-testid="protected"]')).toBeNull();
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/onboarding");
  });

  it("user who connected but did not onboard can load /onboarding (connect mode) without a hydration error", async () => {
    const page = await loadPage("connect", () => {
      connectWallet(ADDRESS, "TESTNET");
    });
    disposers.push(page.dispose);

    expect(page.hydrationErrors).toEqual([]);
    expect(page.container.querySelector('[data-testid="protected"]')).not.toBeNull();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
