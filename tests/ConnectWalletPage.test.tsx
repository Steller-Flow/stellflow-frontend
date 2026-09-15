/**
 * /connect-wallet wrapped <Brand /> (which is itself a <Link>) in another
 * <Link>. Nested <a> elements are invalid HTML: the browser's parser closes the
 * outer <a> when it meets the inner one, so the DOM never matches React's tree
 * and every load of the page produced a hydration error (#418).
 */
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import ConnectWalletPage from "../app/connect-wallet/page";

describe("/connect-wallet", () => {
  it("server-renders without nested <a> elements", () => {
    const html = renderToString(<ConnectWalletPage />);
    const doc = new DOMParser().parseFromString(html, "text/html");
    const anchors = Array.from(doc.querySelectorAll("a"));

    expect(anchors.length).toBeGreaterThan(0);
    // Regex on the raw string, because the parser will have already "fixed"
    // the nesting in `doc` and hidden the mismatch.
    expect(html).not.toMatch(/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/);
  });

  it("still links back to the landing page from the brand", () => {
    const html = renderToString(<ConnectWalletPage />);
    const doc = new DOMParser().parseFromString(html, "text/html");
    const brandLink = Array.from(doc.querySelectorAll("a")).find((a) =>
      a.textContent?.includes("StellFlow")
    );
    expect(brandLink?.getAttribute("href")).toBe("/");
  });
});
