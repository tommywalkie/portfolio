// Strings of ia-workflow (fr = the film's French, en = English). No window; a chat column on the stage (system rows,
// the user's bubbles, the agent's question cards), then an IDE wireframe (src/horse.ts) and the horse preview. The timing is a
// fixed plan in timeline.ts, the same in both locales. Code, file names, paths and tool names are kept as they are.
// The AionUI team strings (APP, MEMBERS, TASKS, TOM, ARSENE, CRON) stay here: the team window is off (SHOW_TEAM in index.tsx).
import type { Bilingual } from '../../lib/locale';

export type Member = { name: string; initials: string; model: string; logo: string; leader?: boolean };

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

  // The team window of the AionUI desktop app (SHOW_TEAM = false: not rendered, kept for later). Solo chats and team.
  APP: {
    title: 'AionUi',
    teamsLabel: 'Équipes',
    team: 'Wishlist',
    convsLabel: 'Conversations',
    convs: ['Comparer des ORM pour Next.js', 'Comment configurer un cron', 'Différences entre SSR et SSG'],
    settings: 'Paramètres',
    header: 'Équipe Wishlist',
  },

  // The team, in order: the leader (Arsène, the dispatcher) first. Plain initials, no character art.
  // `logo` is the id of the model's logo in public/logos/ (copied by copy-logos).
  MEMBERS: [
    { name: 'Arsène', initials: 'A', model: 'DeepSeek', logo: 'deepseek', leader: true },
    { name: 'Riri', initials: 'R', model: 'Claude', logo: 'anthropic' },
    { name: 'Fifi', initials: 'F', model: 'Qwen', logo: 'qwen' },
    { name: 'Loulou', initials: 'L', model: 'Mistral', logo: 'mistral' },
    { name: 'Mamie Baba', initials: 'MB', model: 'GLM', logo: 'zhipu' },
  ] as Member[],

  // the user's messages to Arsène (team window, off).
  TOM: {
    ask: 'Fais-moi une app de wishlist avec Next.js',
    a1: 'Oui, avec connexion.',
  },

  // Arsène's messages (team window, off).
  ARSENE: {
    q1: 'Comptes utilisateurs ?', // a no-break space before the mark (French typography)
    ack: 'Compris, je délègue.',
  },

  // What Arsène hands to each member (team window, off).
  TASKS: {
    Riri: 'Front Next.js : pages et vues.',
    Fifi: 'API et base de données.',
    Loulou: 'Tests des routes et des pages.',
    'Mamie Baba': "Surveille l'équipe toutes les 10 min : specs suivies, personne n'est bloqué.",
  } as Record<string, string>,

  // Mamie Baba's tool chip (team window, off).
  CRON: 'cron · toutes les 10 min',

  // The team window's message box: the same wording in every column (team window, off).
  placeholder: (name: string) => `Écrire à ${name}…`,
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

  APP: {
    title: 'AionUi',
    teamsLabel: 'Teams',
    team: 'Wishlist',
    convsLabel: 'Conversations',
    convs: ['Compare ORMs for Next.js', 'How to set up a cron', 'SSR vs SSG differences'],
    settings: 'Settings',
    header: 'Wishlist team',
  },

  MEMBERS: [
    { name: 'Arsène', initials: 'A', model: 'DeepSeek', logo: 'deepseek', leader: true },
    { name: 'Riri', initials: 'R', model: 'Claude', logo: 'anthropic' },
    { name: 'Fifi', initials: 'F', model: 'Qwen', logo: 'qwen' },
    { name: 'Loulou', initials: 'L', model: 'Mistral', logo: 'mistral' },
    { name: 'Mamie Baba', initials: 'MB', model: 'GLM', logo: 'zhipu' },
  ] as Member[],

  TOM: {
    ask: 'Build me a wishlist app with Next.js',
    a1: 'Yes, with login.',
  },

  ARSENE: {
    q1: 'User accounts?',
    ack: 'Got it, I’m delegating.',
  },

  TASKS: {
    Riri: 'Next.js front end: pages and views.',
    Fifi: 'API and database.',
    Loulou: 'Tests for routes and pages.',
    'Mamie Baba': 'Checks on the team every 10 min: specs tracked, nobody blocked.',
  } as Record<string, string>,

  CRON: 'cron · every 10 min',

  placeholder: (name: string) => `Write to ${name}…`,
};

export const STR: Bilingual<typeof fr> = { fr, en };
