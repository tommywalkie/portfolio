# Playbook: apps/film

How this project turns a resume film, one story bit (one slide) at a time, into videos. A bit is a React + Remotion
component with its own timeline and copy; the master timeline lays the bits end to end on a beat grid, and the same
timeline drives the picture and the soundtrack.

## Variants of the film

There is one film. It comes in two themes, two languages and two devices: 8 video versions in total.

- Themes: `dark` (default) and `light` (`FILM_THEME`, `src/brand/theme.ts`); light renders get a `__light` suffix.
- Locales: French and English (see i18n below); English renders get an `__en` suffix.
- Devices: `desktop` (1920x1080, default) and `mobile` (1080x1920 portrait, `FILM_DEVICE`, `src/lib/device.ts`);
  mobile renders get a `__mobile` suffix. Each device has its own cues and soundtrack. Responsive layouts follow real
  breakpoints (see Design rules), and most story bits draw a phone or tablet layout on desktop and a full-screen
  phone layout on mobile.
- The playing order of the bits is in `src/plans.ts`.

## Layout

```
src/lib/grid.ts                  fps, BPM, bars (b), f60, line(), chain(), bitClock(), BitTimeline type
src/timeline.ts                  master: lays the bits end to end -> ACT, CUE, COPY, TOTAL, actOf(), planActs()
src/plans.ts                     the playing order of the bits
src/sync.ts                      the film's sound events (gathered from each bit's cues) + the voice quota
src/Film.tsx                     the whole film: one Sequence per bit, plus the transitions between bits
src/bits/timelines.ts            story-order list of the bits' timelines          (add new bits here)
src/bits/registry.tsx            same order, components + FILM_SEED map          (and here)
src/bits/types.ts                BitProps { seed }, BitModule { slug, Component, cues? }
src/bits/<slug>/timeline.ts      the bit's bars, cues and copy (pure TS, no React)
src/bits/<slug>/index.tsx        the bit's picture and its sound cues: default export BitModule
src/bits/<slug>/copy.ts          the bit's strings, { fr, en }
src/bits/_shared/                reusable pieces: casio/ (Calculator, lcd), ui/ (below), sfx.ts (sound vocabulary)
src/brand/tokens.ts              the palette, fonts and type roles: the only place a hex colour may be written
src/lib/device.ts                FILM_DEVICE: desktop 1920x1080 (default) or mobile 1080x1920 portrait
src/fx/, src/lib/                shared effects (Chain, Cursor...) and helpers (anim, tilt, measure, i18n...)
src/data/tools.ts                every tool of the career with a 1-5 score and its logo source
scripts/                         render, checks and the sound pipeline (below)
audio/                           kit.json (earshot sound kit), score*.json, music/ (generated beds, git-ignored)
scripts/render-bit.sh            renders one bit for N seeds (pnpm run bit <slug> ...)
```

### Shared UI (`src/bits/_shared/ui/`)

Reusable pieces for the web-app slides. Each takes frame px, absolute frames and copy strings from the calling bit; none
holds a literal string of its own. All colours come from `tokens.ts`.

- `BrowserWindow.tsx`: `<BrowserWindow x y w h r border chromeH chromeOpacity url>{app}</BrowserWindow>`. A light-mode
  window with a visible border (default 3 px `C.mute`), a chrome bar (default 56 px, three dots and an address pill) and
  the app below, in window coordinates. To morph it into a device, pass the same numbers every frame and fade
  `chromeOpacity` to 0 (arep-checkin does this).
- `DeviceFrame.tsx`: `<DeviceFrame x y w h r pad opacity camera? />`. A near-black bezel `pad` px around a screen rect
  (tablet ~28, phone ~14). Draw it BEFORE the screen it frames.
- `ExperienceCard.tsx`: `<ExperienceCard logo name activity period F at x y w? h? textScale? />`. Logo (a path in the
  website's `public/`, e.g. `companies/arep.jpg`), name 36 px, activity 26 px, period 22 px. Enters on E.smooth over 24 f
  and rises 16 px on E.out over 30 f from `at`. Give it about 2 s of reading before the bit's end.
- `Quote.tsx`: `<Quote photo name title sentences times F at x y w size? cy? />`. A testimonial: a large opening mark in
  `C.accent`, the sentence big and bold, then the photo, name and title. `sentences` is a carousel of WHOLE sentences;
  each sentence's line count is measured, so the block's height is known every frame and eases between sentences.
- `ToolChip.tsx`: logo + name tag on a light chip (any logo reads on it).

## Adding a bit

1. `src/bits/<slug>/timeline.ts`: export a `BitTimeline` `{ slug, bars, build(from, locale) }`. Inside `build`,
   `const { at } = bitClock(from)`, write every cue as `at(bar, beat, sub)` (bar 1 = the bit's first downbeat), and every
   copy id as `<slug>.<name>` (use `chain()` or `line()`).
2. `src/bits/<slug>/index.tsx`: a component `({ seed }) => ...`.
   - `const F = useCurrentFrame() + actOf(SLUG).from`: cues are absolute frames. Read cues with `CUE['<slug>.<cue>']`;
     discrete state on `fd(F)`.
   - Every variation comes from `rand(\`${SLUG}:${seed}:<what>\`)`. Seed 1 is the reference.
   - Text through `<Chain chain="<slug>.<name>" ... />`, never a literal.
   - Motion from `src/lib/anim.ts` tokens (`E`, `prog`, `mix`, `lmix`, `SPR`). No CSS animations, no Math.random, no Date.
   - Big vector scenes go in one full-frame `<svg>` with a moving `<g transform>` (stays sharp at any zoom).
   - Sound: export `cues` on the BitModule, built only with `sfx()` from `_shared/sfx.ts` (see Sound).
3. Add the timeline to `src/bits/timelines.ts`, the module to `src/bits/registry.tsx` (with `FILM_SEED[slug] = 1`)
   and the slug to the order in `src/plans.ts`.
4. Check, from `apps/film` in Git Bash: `pnpm run check` (tsc, lint-film, grid-check). A continuous action
   (a race, a stream) still needs a cue at least every 72 f: add cues that mark its progress.
5. Stills: `npx remotion still Bit-<slug> ../../tmp/<slug>-f<N>.png --frame=<N>`.

## Design rules

- Visual quality is the priority. The whole film stays under 2 minutes; a bit takes the bars its picture and reading
  holds need.
- Dark stage `C.stage`, the site's palette and fonts from `src/brand/tokens.ts`. Never write a hex colour outside
  `tokens.ts` (the lint fails).
- Every app illustration is re-themed with the portfolio palette (hunter-green surfaces, screamin-green accent), never
  the app's original colours. Apps are drawn in LIGHT mode (light green-grey surfaces, green accents, dark green text) so
  they stand out from the dark stage.
- Devices have real frames: a desktop app in a browser window with a visible border or a monitor, a tablet and a phone in
  their bezels. Never a borderless panel. Responsive layouts follow real breakpoints: desktop = full sidebar; tablet and
  phone = no sidebar, a hamburger instead.
- Every block that contains text is designed for responsiveness: it sizes to its content (wrapping, auto height,
  measured width) so text always fits. Never a fixed box that clips or overflows its text.
- 3D rotation: every app window drifts with the standard tilt of `src/lib/tilt.ts` (`tilt(F)` on the window's box,
  `perspective: TILT_PERSPECTIVE` on its parent).
- Layout ratio: a slide with an illustration and a message column splits the 1920 px width as illustration 60 %
  (x 0-1150) · gap 5 % (x 1150-1250) · message 35 % (x 1250-1824, inside the 96 px margin). Mirrored when the text is on
  the left. Nothing of the illustration enters the gap or the message zone: shrink the illustration, never the gap.
- Headline sides: headlines that sit left or right take turns, starting with the calculator on the RIGHT. Headlines
  on top, at the bottom or centred never move and do not take a turn. Current order: casio R · olympiades L · arep R ·
  sncf L · copilot R · paris L · front-au-cloud R · graphe L · arrivee R (titre, polyvalence, ia-workflow, contact and
  rugby do not take a turn).
- Detail gap: the details that are not the illustration (message, quote, company card, store card...) keep at least 40 px
  between each other.
- At most 3 details on screen at any frame (a testimonial, a window, a statistic, a graph, a line of story text each
  count as 1). One bit = one slide = one act of the film. Only show what the story bit asks for.
- Text timing: text appears as soon as there is room for it (e.g. once the main content has zoomed out); no long delays
  before the message. Keep slides lively: something visibly changes about every second.
- Read time: a quote sentence stays fully on screen for words / 3.5 s + 2 s, rounded up to the 9 f grid.
- Quotes: shown whole (3 lines are fine). A carousel of quotes of different lengths for one person is vertically centred
  and grows and shrinks smoothly. Name and role only, never the person's company. Real name and photo
  (`public/profiles/<name>.jpg` of the website).
- Experience cards show the company logo, name, activity and, in smaller text, the period and its duration (dates from
  `apps/website/src/content/experiences/`).
- Copy speaks to recruiters: it names the skill or the value brought (« Applications responsives. »), never a plain
  description of what the picture shows. The owner's role is written « Développeur Fullstack » (capital D and F).
- Status colours (present / absent, success / error) sit in the palette: accent green for done, a muted red or a neutral
  for pending.
- Pro and private projects are clean-room: simplified, invented content, fictional names and emails, never a pasted
  screenshot. Cinetic hard bans apply (`.agents/skills/cinetic/SKILL.md`, "Hard bans"), except what `tokens.ts` marks
  as brand-supplied.

## Rendering

Run from `apps/film`. The pnpm scripts start Git Bash through `scripts/gitbash.mjs` (proxy for Bash for Windows).
Output goes to `out/film/`, which is git-ignored.

### Python (uv only)

Python in this app is a uv project: `pyproject.toml` (the dependencies), `uv.lock` (the exact versions) and
`.python-version`. Never call `python3`, `python` or `pip` directly:

- First setup, or a new machine: `uv sync` creates `.venv` from the lockfile.
- Run a script: `uv run python scripts/<name>.py ...`. Add a dependency: `uv add <package>`; commit `uv.lock`.
- Earshot (the sound-kit engine) is not in the project: it is a uv tool in its own environment (see Sound), found by
  `scripts/audio/kit.py` through `$EARSHOT_PYTHON` or `uv tool dir`.
- `pnpm run check` runs `scripts/check-uv.mjs`, which fails on a bare `python3`, `python` or `pip` in the scripts.

```
pnpm run film:v1.1               # whole build, French + English (cues, kit, soundtrack, music, render)
pnpm run film:v1.1:fr            # or :en, one language
pnpm run film:v1.1:light         # the light-theme films (:light:fr, :light:en), files get a __light suffix
pnpm run film:v1.1:sound         # rebuild only the sound and put it on the existing videos (seconds, no picture render)
pnpm run film:v1.1:sound -- lofi # same with another music bed (warm | kalimba | lofi | retro | drift | none)
pnpm run film:v1.1:music         # the five beds, each on its own French video, to compare
pnpm run film:v1.1:web           # copy the finished films and cut them into HLS for the website
```

- Before a full render, `scripts/render.sh` runs the text audit (`scripts/layout-audit.sh`) on the film and warns about
  overlapping, overflowing or covered text. `TEXT_GATE=strict` makes it stop the render; `TEXT_GATE=0` skips it.
- One bit: `pnpm run bit <slug> [--seeds 1,2,3] [--locale en] [--master]` writes
  `out/bits/<slug>/<slug>__seed-<n>.mp4` (an `__en` suffix for English).
- Never report a render as done from its exit code: check that the output exists and its timestamp is new.
- Contact sheet: `ffmpeg -v error -y -i <video> -vf "select=not(mod(n\,36)),scale=480:-1,tile=4x5" -frames:v 1 tmp/sheet.png`.
- The finished films are not committed. `pnpm run film:v1.1:web` writes them, and their HLS streams, into
  `apps/website/public/` (git-ignored), where the website's video player reads them.

## Sound

- Effects: every story bit exports `cues` (absolute frames), built only with `sfx(name, f, id, opts)` from
  `src/bits/_shared/sfx.ts`. That file is the sound vocabulary: one sound per on-screen event type, the same in every
  bit (a click is a click everywhere). `src/sync.ts` gathers them, rejects any sound outside the vocabulary and applies a
  voice quota (at most 2 sounds starting within 0.3 s, except typing and touch taps; important events win).
- The sounds come from the earshot sound kit (`audio/kit.json`, rendered into `audio/kit/`): one bank sound per role,
  with several takes of it for variety. Variety comes from takes, never from switching sounds for the same event.
  `scripts/audio/score.py` places them from `out/cues.json` (`audio/score-v1.1.json`: loudness -25 LUFS).
- Music: `scripts/audio/ambient.py` generates five calm beds (`audio/music/<style>.wav` plus a seamless 12-bar
  `<style>__loop.wav`), fitted to the film's length and mixed at -26 LUFS by `scripts/audio/v1.1-extras.py`, which also
  adds the sailboat sea and the rugby referee whistle.
- Earshot is installed as a uv tool (`uv tool install "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot"`).

## i18n (French and English)

The film is written in French. `locale` (`fr` | `en`) picks the text every bit shows. The timing is the same for both:
every copy entry is timed from its French text, and the English text only changes what is shown.

- `src/lib/locale.ts` (pure, for the Node scripts too): the `Locale` type, `DEFAULT_LOCALE = 'fr'`, `envLocale()` (reads
  `FILM_LOCALE`) and `ACTIVE_LOCALE`. `src/lib/i18n.ts` (React): `LocaleProvider`, `useLocale()`, `useStrings(STR)`.
- Per bit, `src/bits/<slug>/copy.ts` exports `STR = { fr: {...}, en: {...} }`, the same keys in both (`en` is typed as
  `typeof fr`, so a missing key fails tsc). Components read `const S = useStrings(STR)`.
- Timelines: `build(from, locale)`. A chain fragment is `[frenchText, inF, displayText]`: the French text gives the frames,
  the display text is what the locale shows. The master builds both locales and throws if the frames of one copy differ.
- `FILM_LOCALE=en npx tsx scripts/grid-check.ts src/timeline.ts` runs the checks on the English text (its word counts are
  English; the frames stay the French ones).
- Translated too: the calculator's menus and program names, code identifiers and file names, every wireframe label. English
  uses American spelling. Not translated: Casio Basic keywords, URLs, brands and products, names of people, companies,
  labs and models. Dates are written per locale in the dictionary.
- Never compute a timing from the English text. A text block measures its own displayed text, so it sizes to the English line.
