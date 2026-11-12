// Enforces "Python in this app is a uv project" (pyproject.toml + uv.lock): fails on a bare `python3`, a bare
// `python`, a direct .venv interpreter path or a `pip` call in package.json and the shell/TS/JS scripts.
// Run Python as `uv run python ...`, add a dependency with `uv add <package>`. Part of `pnpm run check`.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const files = ['package.json', ...readdirSync('scripts').filter((n) => /\.(sh|mjs|ts)$/.test(n) && n !== 'check-uv.mjs').map((n) => join('scripts', n))];
const BAD = [
  [/\bpython3\b/, 'bare python3: use `uv run python`'],
  [/(?<!uv run )(?<![\w./-])python(?!\w)(?= +[-\w./"'$])/, 'bare python: use `uv run python`'],
  [/\.venv[\\/](Scripts|bin)[\\/]/, 'direct .venv interpreter: use `uv run python`'],
  [/\bpip3?\b +(install|uninstall)/, 'pip: use `uv add <package>` / `uv sync`'],
];

const problems = [];
for (const f of files) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/^\s*(#|\/\/)/.test(line)) return; // comments may say anything
      for (const [re, why] of BAD) if (re.test(line)) problems.push(`${f}:${i + 1}  ${why}\n    ${line.trim().slice(0, 140)}`);
    });
}
for (const need of ['pyproject.toml', 'uv.lock', '.python-version']) if (!existsSync(need)) problems.push(`missing ${need}: this is a uv project (run \`uv sync\`)`);

if (problems.length) {
  console.error(`check-uv: ${problems.length} problem(s)\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`check-uv: ${files.length} files, uv only`);
