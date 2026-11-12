# Portfolio

A personal portfolio website built with **Astro** and **React**, hosted at [tommywalkie.com](https://tommywalkie.com).

## Structure

The repository is a **monorepo** managed with **pnpm** (workspace mode). It contains two main projects:

| Path                     | Description                                                                                 |
|--------------------------|---------------------------------------------------------------------------------------------|
| `apps/website`           | The public portfolio site built with **Astro** (static site generator). |
| `apps/film`              | A **Cinetic**‑based film project (**React** + **Remotion** + **Earshot**) that generates videos, animations, and interactive demos. |

Both projects share a common **pnpm workspace** (`pnpm-workspace.yaml`) and a single **package.json** at the repository root.

---

## Tech stack

| Layer                     | Technology                                                                                 |
|---------------------------|--------------------------------------------------------------------------------------------|
| **Website**               | Astro, React, TypeScript, Tailwind CSS, Vite |
| **Film project**          | Cinetic (React), Remotion (video rendering), Earshot (audio & orchestration) |

---

## Prerequisites

- **Website** (`apps/website`)
  - **Git** (to clone the repository)
  - **NVM** – latest, to install and pin Node.js
  - **Node.js** – 22 (pinned in `.nvmrc` and used by the Dockerfile)
  - **pnpm** – 10 (pinned via `packageManager` in `package.json`)

- **Film** (`apps/film`), everything above plus:
  - **uv** – latest ([install guide](https://docs.astral.sh/uv/getting-started/installation/)), to manage the Python 3.12 environment
  - **Earshot** – the sound-kit engine, installed as a **uv tool** (see below); `scripts/audio/kit.py` finds it through `$EARSHOT_PYTHON` or `uv tool dir`
  - **ffmpeg** – available on `PATH`, used by the audio mix, video probes and QA scripts

- **Optional** – if you work with **OpenCode**, **Claude Code** or **Codex**, install the skills pinned in `skills-lock.json` (currently the `cinetic` skill): `npx skills add Leonxlnx/cinetic --skill cinetic`, then pick your agent(s).

---

## Installation & Development

```bash
# 1. Clone the repo
git clone https://github.com/tommywalkie/portfolio.git
cd portfolio

# 2. Install Node.js via NVM (if you don't have it)
nvm install   # picks up the pinned version from .nvmrc
nvm use

# 3. Install pnpm (10.x, the version is pinned in package.json)
npm i -g pnpm   # or use your preferred installer

# 4. Install uv (if you don't have it) – required only for apps/film
#    curl -LsSf https://astral.sh/uv/install.sh | sh   (macOS/Linux)
#    powershell -c "irm https://astral.sh/uv/install.ps1 | iex"   (Windows)

# 5. Install dependencies
pnpm install

# 6. Set up the film's Python environment and sound-kit engine (apps/film only)
pnpm uv:sync
uv tool install "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot"

# 7. Start the development server
pnpm dev

# 8. Optional: if you use OpenCode, Claude Code or Codex, install the skill
#    pinned in skills-lock.json (the cinetic skill):
npx skills add Leonxlnx/cinetic --skill cinetic   # then pick your agent(s)

# The film's videos are not installed here: see "Film videos" below.
```

The `dev` script runs `pnpm --filter website dev`, so you get live reload for the website. The film project has its own commands (`pnpm --filter ./apps/film studio`, `pnpm --filter ./apps/film film:v1.1`, ...) run from `apps/film` or via `pnpm --filter`.

---

## Building & Preview

```bash
# Build the website (produces the static files in ./dist)
pnpm run build

# Preview the built site locally
pnpm preview
```

`pnpm run build` alone gives you the static shell: the film pages stream videos packaged as HLS chunks. Those videos are
not in the repository — produce them yourself or fetch them from CI, see [Film videos](#film-videos).

---

## Film videos

The film pages stream videos as 3-rendition fMP4 HLS (1080p/720p/480p). There are 8 versions (French/English × dark/light
× desktop/mobile). Two ways to get them:

**Render locally** (requires the film prerequisites: uv, Earshot, ffmpeg, and bash — Git Bash on Windows):

```bash
# 1. Render the film mp4s in apps/film (sound mix + picture, out/film/)
pnpm film:render

# 2. Package them into HLS into apps/website/public/videos/ (and copy the mp4 fallbacks to public/)
pnpm film:hls

# 3. Rebuild the website so the videos land in ./dist
pnpm run build
```

**Alternatively, fetch them from CI**: the manual `Film render` workflow renders all 8 versions on GitHub's runners and
bundles them into the `website-videos` artifact, laid out like `apps/website/public`. Download it with the `gh` CLI:

```bash
gh run download <run-id> -n website-videos -D apps/website/public
pnpm run build   # then build (or build the Docker image) as usual
```

or from the [Actions page](https://github.com/tommywalkie/portfolio/actions) (open the `Film render` run, download
`website-videos`, and unpack it into `apps/website/public/`).

---

## License

MIT © Tom Bazarnik
