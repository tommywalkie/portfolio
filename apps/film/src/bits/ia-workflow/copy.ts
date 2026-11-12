// Strings of ia-workflow (fr = the film's French, en = English). No window; a chat column on the stage (system rows,
// the user's bubbles, the agent's question cards), then an IDE wireframe (src/horse.ts) and the horse preview. The timing is a
// fixed plan in timeline.ts, the same in both locales. Code, file names, paths and tool names are kept as they are.
import type { Bilingual } from '../../lib/locale';

const fr = {
  // Film copy (French), on one line.
  TEXT: {
    powered: "Propulsé par l'IA.",
  },

  // Detail 1: the chat column. System rows (small, muted), the user's bubbles, the agent's question cards
  // and its reply. The demo builds a web game: a 3D horse walking, in Three.js. French typography: a no-break space before
  // « : », « ! » and « ? » (written  ).
  CHAT: {
    // system rows: a spinner, then a check
    sys: {
      mcp: 'MCP · Blender connecté',
      skill: 'Skill · réponses courtes',
      ask: "Demande d'informations", // The question tool's status row, before each question card
      agentsMd: 'Écriture · AGENTS.md',
      specMd: 'Écriture · SPEC.md',
      subModel: 'Sous-agent · modèle 3D (Blender)',
      subScene: 'Sous-agent · scène Three.js',
      eslint: 'Modification · eslint.config.js',
      lint: 'Exécution · pnpm lint',
    },
    // the user's messages
    tom: {
      game: "Salut ! J'aimerais un petit jeu web en Three.js : un cheval 3D qui se balade. On commence par écrire une spec ensemble ?",
      eslint: 'Enforce les types dans notre codebase avec ESLint.',
    },
    // the agent's question cards: the title, then one button per line (the last one is the free-text option)
    cards: [
      { title: 'Quel rendu ?', options: ['Low poly', 'Toon', 'Réaliste', 'Autre…'] },
      { title: 'Quel moteur physique ?', options: ['Aucun, animation simple', 'cannon-es', 'Rapier', 'Autre…'] },
    ],
    // the agent's reply once the rule is on
    reply: "C'est fait : la règle est active et le lint passe.",
  },
};

// EN translation. Names of people, products, models, tools and file paths are kept.
const en: typeof fr = {
  TEXT: {
    powered: 'Powered by AI.',
  },

  CHAT: {
    sys: {
      mcp: 'MCP · Blender connected',
      skill: 'Skill · short answers',
      ask: 'Asking for input',
      agentsMd: 'Writing · AGENTS.md',
      specMd: 'Writing · SPEC.md',
      subModel: 'Subagent · 3D model (Blender)',
      subScene: 'Subagent · Three.js scene',
      eslint: 'Editing · eslint.config.js',
      lint: 'Running · pnpm lint',
    },
    tom: {
      game: "Hi! I'd like a small web game in Three.js: a 3D horse walking around. Shall we write a spec together first?",
      eslint: 'Enforce types in our codebase with ESLint.',
    },
    cards: [
      { title: 'Which look?', options: ['Low poly', 'Toon', 'Realistic', 'Other…'] },
      { title: 'Which physics engine?', options: ['None, simple animation', 'cannon-es', 'Rapier', 'Other…'] },
    ],
    reply: 'Done: the rule is on and lint passes.',
  },
};

export const STR: Bilingual<typeof fr> = { fr, en };
