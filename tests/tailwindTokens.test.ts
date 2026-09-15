/**
 * Guards against the theme-token collision that collapsed the wallet modal.
 *
 * app/globals.css names its spacing scale xs/sm/md/lg/xl/2xl/3xl — the same
 * names as Tailwind's container scale — and Tailwind's w-*, min-w-* and
 * max-w-* utilities resolve --spacing-* before --container-*. So a bare
 * `max-w-md` compiled to `max-width: var(--spacing-md)` (16px) instead of
 * 28rem. This test compiles the real stylesheet against every class used in
 * app/ and fails if any width utility resolves to a spacing token.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { compile } from "tailwindcss";

const ROOT = resolve(__dirname, "..");
const SIZE_NAMES = ["xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl"];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(entry)) out.push(full);
  }
  return out;
}

function candidatesIn(files: string[]): string[] {
  const found = new Set<string>();
  for (const file of files) {
    for (const match of readFileSync(file, "utf8").matchAll(/[\w:()[\]/.%-]+/g)) {
      found.add(match[0]);
    }
  }
  return [...found];
}

async function compileAppCss(): Promise<string> {
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  const compiler = await compile(css, {
    base: join(ROOT, "app"),
    loadStylesheet: async (id: string, base: string) => {
      const pkg = join(ROOT, "node_modules", id);
      const file = id === "tailwindcss" ? join(pkg, "index.css") : pkg;
      return { path: file, content: readFileSync(file, "utf8"), base: base || join(pkg, "..") };
    },
  });
  return compiler.build(candidatesIn(walk(join(ROOT, "app"))));
}

describe("Tailwind theme tokens", () => {
  it("no width utility in app/ resolves to a --spacing-* named token", async () => {
    const out = await compileAppCss();
    const offenders: string[] = [];
    const rules = out.matchAll(/\.((?:max-w|min-w|w|size)-[^{\s]+)\s*\{([^}]*)\}/g);
    for (const [, cls, decl] of rules) {
      for (const name of SIZE_NAMES) {
        if (decl.includes(`var(--spacing-${name})`)) offenders.push(`${cls} -> ${decl}`);
      }
    }
    expect(offenders).toEqual([]);
    expect(out).toMatch(/\.max-w-[^{]+\{\s*max-width:/); // the scan saw at least one max-w rule
  });

  it("max-w-(--container-md) compiles to the 28rem container token", async () => {
    const out = await compileAppCss();
    expect(out).toMatch(/\.max-w-\\\(--container-md\\\)\s*\{\s*max-width:\s*var\(--container-md\)/);
    expect(out).toMatch(/--container-md:\s*28rem/);
  });

  it("fade-up does not keep a transform after it finishes (fill-mode must not be forwards/both)", async () => {
    const out = await compileAppCss();
    const rule = out.match(/\.fade-up\s*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).toContain("fade-up");
    expect(rule).not.toMatch(/\b(both|forwards)\b/);
  });
});
