// Copy every tool logo listed in src/data/tools.ts into public/logos/<id>.svg.
// Sources are cloned/downloaded into the portfolio's tmp/ folder first:
//   tmp/gilbarbara-logos/logos/   (git clone --depth 1 --sparse https://github.com/gilbarbara/logos)
//   tmp/simple-icons/             (https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<name>.svg)
//   refs/logos/                   (the portfolio's own folder)
// Run from films/cinetic-resume: npx tsx scripts/copy-logos.ts
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { INTEGRATIONS, LABS, TOOLS } from '../src/data/tools';

const project = join(import.meta.dirname, '..');
const portfolio = join(project, '..', '..');
// Each kind lists its folders in order: the first one holding the file wins. Downloads live in the
// portfolio's tmp/ only (never a tmp/ inside films/).
const roots: Record<string, string[]> = {
  gb: [join(portfolio, 'tmp', 'gilbarbara-logos', 'logos')],
  si: [join(portfolio, 'tmp', 'simple-icons')],
  brand: [join(portfolio, 'tmp', 'brand-logos')], // logos taken from the brands' own sites or svgl.app
  local: [join(portfolio, 'refs', 'logos')],
};
const out = join(project, 'public', 'logos');
mkdirSync(out, { recursive: true });

let missing = 0;
for (const t of [...TOOLS, ...INTEGRATIONS, ...LABS]) {
  const [kind, file] = t.source.split(':');
  const src = (roots[kind] ?? []).map((dir) => join(dir, file ?? '')).find((p) => existsSync(p)) ?? '';
  if (!src) {
    console.log(`MISSING ${t.id} <- ${t.source}`);
    missing++;
    continue;
  }
  copyFileSync(src, join(out, `${t.id}.svg`));
}
const total = TOOLS.length + INTEGRATIONS.length + LABS.length;
console.log(`copy-logos: ${total - missing}/${total} copied to public/logos`);
if (missing) process.exit(1);
