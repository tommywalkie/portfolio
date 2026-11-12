import type { Bilingual } from '../../../lib/locale';

const fr = {

  TEXT: {
    powered: "Propulsé par l'IA.",
  },

  CHAT: {

    sys: {
      mcp: 'MCP · Blender connecté',
      skill: 'Skill · réponses courtes',
      ask: "Demande d'informations",
      agentsMd: 'Écriture · AGENTS.md',
      specMd: 'Écriture · SPEC.md',
      subModel: 'Sous-agent · modèle 3D (Blender)',
      subScene: 'Sous-agent · scène Three.js',
      eslint: 'Modification · eslint.config.js',
      lint: 'Exécution · pnpm lint',
    },

    tom: {
      game: "Salut ! J'aimerais un petit jeu web en Three.js : un cheval 3D qui se balade. On commence par écrire une spec ensemble ?",
      eslint: 'Enforce les types dans notre codebase avec ESLint.',
    },

    cards: [
      { title: 'Quel rendu ?', options: ['Low poly', 'Toon', 'Réaliste', 'Autre…'] },
      { title: 'Quel moteur physique ?', options: ['Aucun, animation simple', 'cannon-es', 'Rapier', 'Autre…'] },
    ],

    reply: "C'est fait : la règle est active et le lint passe.",
  },
};

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
