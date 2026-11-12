// Brand tokens: the only place a colour, face or type size is written down. Acts import these;
// scripts/lint-film.mjs fails any hex colour that is not declared here.
//
// The brand is tommywalkie.com (src/styles/global.css of the portfolio), in BOTH of its modes:
//   dark  (src/brand/theme.ts, the default) the "hunter green" scale for stage, surfaces and type,
//         and the "screamin green" of the logo's dot as the one accent.
//   light the site's white page, hunter-green type and surfaces, screamin-green-600/700 as the accent.
// Brand-supplied: a saturated green accent the taste rules would call neon.
//
// C is one theme's table, picked at module load from FILM_THEME / __FILM_THEME__. Both tables have the
// same keys (LIGHT_PALETTE is typed as typeof DARK_PALETTE), so an act that compiles in one theme
// compiles in the other. One bundle carries one theme: scripts/film-v1.1.sh --theme light bundles
// twice. The dark table is untouched by the light work, so a dark render stays pixel-identical.
//
// Two ramps live here, and keeping them apart is the whole design:
//   the CHROME ramp (stage, ink2, ink3, line, deep, mute, soft, text, bright, white) is the film's own
//     furniture: the page, the headlines, the quotes, the company and store cards. It follows the site,
//     which means it INVERTS between themes - dark page + light type, light page + dark type.
//   the APP ramp (appPaper..appInkMute) is the palette of the apps and sites *depicted inside* a slide
//     (the LinkedIn/CRM/mail/IDE windows, the check-in app, the wireframes, the site plan). Those are
//     drawn in light mode in both themes, one step darker in light so they still stand off the page
//     (if they used an equivalent of bg-light-50 then go for bg-light-100, if
//     bg-light-100 then go for bg-light-200). Its ink does not move: it is already dark.
// An act that paints a depicted surface must read an app* token; one that paints the film's own type
// or card must read a chrome token. C.white / C.bright / C.text / C.soft / C.mute and C.stage / C.ink2
// are therefore NOT usable inside a mockup: the first five are type in chrome and surfaces in an app,
// and C.stage is the page in chrome and dark ink on a light app surface.
import type React from 'react';
import { H, W } from '../timeline';
import { LIGHT } from './theme';

const DARK_PALETTE = {
  // chrome: the film's own page, surfaces and type (cinetic:brand-supplied hunter-green scale, portfolio dark mode)
  stage: '#152418', // hunter-green-950: the page background in dark mode, every slide sits on it
  ink2: '#203424', // hunter-green-900: raised surfaces (windows, cards)
  ink3: '#263F2A', // hunter-green-800: panels inside surfaces, inputs, chips
  line: '#2D4F32', // hunter-green-700: hairlines and borders, >= 1.5 px on screen
  deep: '#39623E', // hunter-green-600: secondary fills, inactive states
  mid: '#4C7D51', // hunter-green-500: the site's primary
  mute: '#6D9A71', // hunter-green-400: secondary text
  soft: '#99BC9A', // hunter-green-300: highlighted secondary text (the hero's "Paris")
  text: '#C2D8C2', // hunter-green-200: body text and the logo's T in dark mode
  bright: '#E1EBE0', // hunter-green-100: statements, the brightest type
  white: '#F2F7F2', // hunter-green-50: rare highlights
  // cinetic:brand-supplied the logo dot, screamin-green-500. Meaning: the horse, the dot,
  // whatever marks the identity. It arrives on new things and relaxes to text; well under 8% of the frame.
  accent: '#09DE2E',
  accentDeep: '#01B821', // screamin-green-600: the accent on light surfaces (the logo dot in light mode)
  // the depicted apps (cinetic:brand-supplied the check-in app's status and avatar tones, adapted to the palette)
  appPaper: '#F2F7F2', // hunter-green-50: a depicted window's paper, chrome and cards that sit on the stage
  appPage: '#E1EBE0', // hunter-green-100: the page an app draws inside its own window
  appBand: '#C2D8C2', // hunter-green-200: a band, sidebar rule or skeleton bar inside a depicted app
  appFill: '#99BC9A', // hunter-green-300: a filled placeholder, an avatar ring, a hovered row
  appEdge: '#6D9A71', // hunter-green-400: a depicted window's outer border and hairlines
  appInk: '#203424', // hunter-green-900: the type drawn on a depicted surface
  appInkDeep: '#152418', // hunter-green-950: the darkest ink on a depicted surface (was C.stage as ink)
  appInkBody: '#263F2A', // hunter-green-800: body text on a depicted band/sidebar (= ink3's dark value, pinned so it stays dark ink in light)
  appInkMute: '#39623E', // hunter-green-600: secondary type inside a depicted app
  appInkFaint: '#6D9A71', // hunter-green-400: tertiary / meta type inside a depicted app (a timestamp, a subtitle)
  appHi: '#F2F7F2', // the light ink on a saturated fill (initials on a green avatar, a button label)
  // A depicted DARK app: an IDE, editor or terminal drawn in its own dark theme. Its surfaces are
  // pinned to the dark chrome values in both film themes, because the app being drawn stays dark
  // whether the film sits on a green page or a white one. In the dark theme each equals the chrome
  // token it stands in for, so a dark render is unchanged.
  dkPage: '#152418', // = stage: the depicted dark app's page
  dkChrome: '#203424', // = ink2: its chrome bar and side panels
  dkPanel: '#263F2A', // = ink3: an input or pill inside that chrome
  dkLine: '#2D4F32', // = line: its hairlines
  dkFill: '#39623E', // = deep: its secondary fills and inactive states
  dkInk: '#E1EBE0', // = bright: its type
  dkBody: '#C2D8C2', // = text: its body type (a second text weight a dark editor keeps, e.g. unhighlighted code rows)
  dkDim: '#6D9A71', // = mute: its dimmest type (punctuation, terminal chatter)
  dkMute: '#99BC9A', // = soft: its secondary type
  pendingRed: '#C9787F', // status: not yet present (soft desaturated rose: reads on light green, clear on the dark stage)
  appTeal: '#2F6664', // avatar fill (teal, desaturated)
  appNeutral: '#56655C', // avatar fill (neutral green-grey)
  appBezel: '#0B0F0C', // the tablet's and phone's body (near black)
  // cinetic:brand-supplied the site plan's tones (sncf-carte, a stylised clean-room map): light ground,
  // buildings, rails, walkways and trees, all in the palette's green-grey family
  mapGround: '#E4ECE2', // the plan's ground (a touch greyer than the page)
  mapBuilding: '#C3D4C1', // ateliers: blocks on the ground
  mapRail: '#5E6F62', // rail tracks: dark grey-green, read as steel on the light ground
  mapSleeper: '#8D9C8E', // sleepers under the rails
  mapWalk: '#F6F9F4', // walkways and level crossings: near white
  // objects and scenes drawn on the stage (a stadium, a horse, a machine), kept apart from the brand
  // scale for the same reason as the calculator below: a drawn THING keeps its own colours in both themes,
  // because what inverts with the site is the PAGE and the film's TYPE, not the subject of a picture.
  // Each one pins the dark theme's value of the chrome token it stands in for, so a dark render is
  // unchanged; without them an illustration colour-inverts in light (a pale ball went near-black and its
  // cast shadow went white, a dispenser's pale dome went near-black, a capsule lost its white half).
  objStage: '#152418', // = stage: the darkest tone of a drawn object — a hole, a hoof, a mane, a cast shadow
  objInk2: '#203424', // = ink2: a shaded facet, a far-side limb
  objInk3: '#263F2A', // = ink3: a placeholder shape on a depicted surface
  objLine: '#2D4F32', // = line: a seam or lace on a pale object
  objDeep: '#39623E', // = deep: a body in shadow, a pitch of grass
  objMute: '#6D9A71', // = mute: a mid tone, a seam, a soft shadow
  objSoft: '#99BC9A', // = soft: a lit face, a crowd speckle
  objText: '#C2D8C2', // = text: a bright face, a ball's body
  objBright: '#E1EBE0', // = bright: a highlight, a goalpost, a glass dome
  objWhite: '#F2F7F2', // = white: the lightest thing in a drawing — a specular hit, a capsule's white half
  // real-world objects drawn on the stage (the calculator), kept apart from the brand scale.
  // A physical thing keeps its own colours in both themes: the Graph 35+E is grey plastic, not a token.
  lcd: '#B9CBB1', // the Graph 35+E's LCD glass
  lcdInk: '#1F2A1E', // pixels on the LCD
  shell: '#DDE4DF', // the calculator's body
  shellEdge: '#3D7B78', // the calculator's teal rim
  fkey: '#A9CBA7', // the calculator's F1-F6 keys
  key: '#2B3A35', // the calculator's dark keys
  keyLabel: '#E6ECE8', // labels on dark keys
  // starter role names the cinetic components read (fx/, lib/Audit): ink = type, paper = stage.
  ink: '#E1EBE0',
  paper: '#152418',
  mist: '#203424',
};

// The same keys on the site's light page. The chrome ramp mirrors the portfolio's light mode
// (bg-white, bg-primary-50/100, border-primary-200, text-primary-900/700/600, secondary-600/700);
// the app ramp steps one shade darker down hunter green so the depicted screens still read as raised
// off a white page; the physical objects and the app's own status tones do not move.
const LIGHT_PALETTE: typeof DARK_PALETTE = {
  // chrome: mirrors src/styles/global.css light mode (html bg white, color primary-950)
  stage: '#FFFFFF', // the site's light page (html { background-color: white }, FilmPlayer's bg-white)
  ink2: '#F2F7F2', // hunter-green-50: bg-primary-50, the card a light page raises
  ink3: '#E1EBE0', // hunter-green-100: bg-primary-100, the chip inside that card
  line: '#C2D8C2', // hunter-green-200: border-primary-200
  deep: '#99BC9A', // hunter-green-300: secondary fills, inactive states
  mid: '#4C7D51', // hunter-green-500: --color-primary, the same in both modes
  mute: '#39623E', // hunter-green-600: secondary type (text-secondary-600 sits beside it on the site)
  soft: '#2D4F32', // hunter-green-700: highlighted secondary type (text-primary-700)
  text: '#203424', // hunter-green-900: body type (text-primary-900)
  bright: '#152418', // hunter-green-950: statements, the heaviest type (html color)
  white: '#152418', // hunter-green-950: on a white page nothing reads brighter than the heaviest type
  accent: '#01B821', // screamin-green-600: the accent as type on a light page (the site's own light accent)
  accentDeep: '#05901E', // screamin-green-700: text-secondary-700, the accent on the site's light mode
  // the depicted apps: IDENTICAL to the dark theme (replacing the one-step rule:
  // use the company card colour as the baseline and keep darkening one step from there — that baseline IS
  // the dark ramp's, so a depicted screen does not change between themes at all).
  appPaper: '#F2F7F2',
  appPage: '#E1EBE0',
  appBand: '#C2D8C2',
  appFill: '#99BC9A',
  appEdge: '#6D9A71',
  appInk: '#203424', // type on a depicted surface: already dark, stays
  appInkDeep: '#152418', // the darkest depicted ink: stays
  appInkBody: '#263F2A', // body text on a depicted band/sidebar: pinned (its light chrome ink3 would wash out on the darker band)
  appInkMute: '#39623E', // secondary depicted type: stays
  appInkFaint: '#6D9A71', // tertiary type inside a depicted app: pinned, same as the dark theme
  appHi: '#F2F7F2', // light ink on a saturated fill: stays (a white label on a green button)
  // A depicted DARK app keeps its own dark theme in both film themes: the same pinned values as the
  // dark palette, so an IDE window looks like an IDE window on a white page too.
  dkPage: '#152418',
  dkChrome: '#203424',
  dkPanel: '#263F2A',
  dkLine: '#2D4F32',
  dkFill: '#39623E',
  dkInk: '#E1EBE0',
  dkBody: '#C2D8C2', // pinned: a depicted dark app does not care what page the film sits on
  dkDim: '#6D9A71',
  dkMute: '#99BC9A',
  pendingRed: '#C9787F', // status tone: stays
  appTeal: '#2F6664', // avatar fill: stays
  appNeutral: '#56655C', // avatar fill: stays
  appBezel: '#203424', // the device body, lightened: hunter-green-900 on a white page, not near black
  mapGround: '#E4ECE2', // the plan is a depicted thing too: pinned, same as the dark theme
  mapBuilding: '#C3D4C1',
  mapRail: '#5E6F62', // steel: stays
  mapSleeper: '#8D9C8E', // stays
  mapWalk: '#F6F9F4',
  // objects and scenes: pinned to the dark theme's values, identical in both palettes
  objStage: '#152418',
  objInk2: '#203424',
  objInk3: '#263F2A',
  objLine: '#2D4F32',
  objDeep: '#39623E',
  objMute: '#6D9A71',
  objSoft: '#99BC9A',
  objText: '#C2D8C2',
  objBright: '#E1EBE0',
  objWhite: '#F2F7F2',
  lcd: '#B9CBB1', // the calculator is a physical object: every tone stays
  lcdInk: '#1F2A1E',
  shell: '#DDE4DF',
  shellEdge: '#3D7B78',
  fkey: '#A9CBA7',
  key: '#2B3A35',
  keyLabel: '#E6ECE8',
  // starter role names, following the chrome ramp
  ink: '#152418',
  paper: '#FFFFFF',
  mist: '#F2F7F2',
};

export const C: typeof DARK_PALETTE = LIGHT ? LIGHT_PALETTE : DARK_PALETTE;

export const FONT = {
  text: '"Outfit Variable", system-ui, sans-serif', // the site's one sans, for every role; typeStyle and measure.ts read it
  mono: '"Geist Mono Variable", "Geist Mono", ui-monospace, monospace', // terminals and code only
};

/** Faces the FontGate waits for before anything renders or measures (one entry per weight in use). */
export const FACES = ['400 16px "Outfit Variable"', '600 16px "Outfit Variable"', '800 16px "Outfit Variable"', '400 16px "Geist Mono Variable"'];

/** Layout unit: 1 at 1080p, scales every size with the short side of the frame (16:9, 9:16, 1:1). */
export const U = Math.min(W, H) / 1080;

// One token per role, reused everywhere, so nothing is "almost matched" (size in px at 1080p).
// Weights follow the site: h1 800, h2/h3 700, body 400.
/**
 * Headline line pitch, as a multiple of the display size. Every multi-line headline (a block that wraps,
 * or a stack of lines placed one by one) sets its lines this far apart. The reference is copilot-extension
 * (72 px lines 94 px apart, about 1.3). Its lead is TYPE.display.lead, so typeStyle('display') and every
 * display Chain use it too.
 */
export const HEADLINE_LEAD = 1.3;

export const TYPE = {
  display: { size: 120, weight: 700, track: -0.035, lead: HEADLINE_LEAD }, // statements and the name
  line: { size: 64, weight: 500, track: -0.02, lead: 1.15 }, // fragment chains (fx/Chain), up to ~8 words
  quote: { size: 44, weight: 400, track: -0.01, lead: 1.3 }, // testimonial sentences: a full sentence, read calmly
  secondary: { size: 40, weight: 500, track: -0.01, lead: 1.2 }, // names, roles, URLs, labels
  ui: { size: 24, weight: 500, track: 0, lead: 1.3 }, // smallest readable size on screen
};

/** CSS for a type role at a size (px). Tabular figures always, so numbers never jitter in width. */
export const typeStyle = (role: keyof typeof TYPE, size = TYPE[role].size * U): React.CSSProperties => ({
  fontFamily: FONT.text,
  fontSize: size,
  fontWeight: TYPE[role].weight,
  letterSpacing: `${TYPE[role].track}em`,
  lineHeight: TYPE[role].lead,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'pre',
});
