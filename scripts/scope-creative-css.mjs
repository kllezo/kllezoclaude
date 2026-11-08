// Scope an original global stylesheet under a root class so it can live inside the app.
// Usage: node scope.mjs <postcssPath> <in.css> <out.css> <rootClass> <title>
import fs from "node:fs";
import { createRequire } from "node:module";

const [postcssPath, input, output, root, title] = process.argv.slice(2);
const require = createRequire(postcssPath + "/");
const postcss = require("postcss");

const R = `.${root}`;
// :where() keeps every original selector at its original specificity (the original was global CSS),
// so app components placed inside the page (e.g. the enquiry form) keep their own styles.
const W = `:where(${R})`;
const PAGE = `html:has(${R})`;

function scopeSelector(sel) {
  const s = sel.trim();
  if (s === ":root" || s === "html") return PAGE;
  if (s === "body") return `${PAGE} body`;
  if (/^body[.:\[]/.test(s)) return `${PAGE} ${s}`; // body.hov #cur-ring
  if (/^body\s/.test(s)) return `${PAGE} ${s}`;
  if (/^html[\s.:\[]/.test(s)) return s.replace(/^html/, PAGE);
  return `${W} ${s}`;
}

const css = fs.readFileSync(input, "utf8").replace(/\r\n/g, "\n");
const ast = postcss.parse(css);
ast.walkRules((rule) => {
  if (rule.parent && rule.parent.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
  rule.selectors = rule.selectors.map(scopeSelector);
});
// Self-hosted fonts via next/font: prefer the app's font variables, keep the original stacks as fallback.
ast.walkDecls(/^--font-(serif|sans)$/, (d) => {
  d.value = d.value
    .replace(/'Cormorant Garamond'/, "var(--font-cormorant), 'Cormorant Garamond'")
    .replace(/'Inter'/, "var(--font-inter), 'Inter'");
});
const header = `/* ${title}\n   Original Kllezo Creative stylesheet (kllezo-v3), scoped under ${R} for the app.\n   Declarations are original; only selectors were scoped. Fixes are marked "PORT FIX". */\n`;
fs.writeFileSync(output, header + ast.toString());
console.log("ok", output);
