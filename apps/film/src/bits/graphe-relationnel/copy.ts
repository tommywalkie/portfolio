// Strings of graphe-relationnel (fr = the film's French, en = English): the Mindmap CMS (a clean-room recreation of the
// graph CMS, drawn in the portfolio palette), the film copy and the testimonial. The AI labs and their models are proper
// names (data.ts), the same in both locales.
import type { Bilingual } from '../../lib/locale';

const fr = {
  // Film copy, in order.
  TEXT: {
    seul: 'Du besoin au produit.',
  },

  // Testimonial: Nicolas Kahn, CTO (no company: the title only).
  AUTHOR: {
    photo: 'profiles/nicolas-kahn.jpg',
    name: 'Nicolas Kahn',
    role: 'CTO',
  },
  // The only quote shown, whole.
  QUOTE: "C'est un développeur fiable, curieux et attentif aux besoins des utilisateurs.",

  // Detail 3 under the headline: the La Mètis experience card (copied from temoignage-metis). The logo is in
  // public/companies/la-metis.jpg; the period is the portfolio entry's as formatDateRange renders it.
  EXPERIENCE: {
    logo: 'companies/la-metis.jpg',
    company: 'La Mètis',
    activity: 'Intelligence stratégique',
    period: 'juin 2025 – oct. 2026 · 1 an et 5 mois',
  },

  // The app shell (top bar, breadcrumb, browser chrome).
  APP: {
    url: 'mindmap.exemple.fr/projets/modeles-ia',
    brand: 'Mindmap CMS',
    nav: ['Général', 'Entités', 'Contenu', 'Liens', 'Aperçu'],
    user: 'TB',
    crumbEntity: 'Projets / Modèles IA et Providers en 2026 / Entités / Modèle',
    crumbGraph: 'Projets / Modèles IA et Providers en 2026 / Aperçu',
    exportBtn: 'Exporter le graphe',
  },

  // The entity page (simplified): the Modèle entity's fields.
  ENTITY: {
    sideTitle: 'Entités',
    side: ['Laboratoire', 'Modèle'],
    title: 'Modèle',
    save: 'Enregistrer',
    labelName: 'Nom du champ',
    labelFormat: 'Format',
    fields: [
      { name: 'Nom', format: 'Texte' },
      { name: 'Logo', format: 'Image (PNG, JPG, WebP)' },
      { name: 'Laboratoire', format: 'Relation' },
      { name: 'Poids', format: 'Ouverts ou fermés' },
      { name: 'Modalités d’entrée', format: 'Liste de choix' },
    ],
  },

  // The graph preview.
  GRAPH: {
    preview: 'PREVIEW',
    title: 'Modèles IA et Providers en 2026',
    date: '04/11/2026',
    params: 'Paramètres',
    addFilter: '+ Filtre',
    chips: ['Laboratoire · tous 4', 'Catégorie · LLM 30'],
    clear: 'Tout retirer',
    counts: '28 nœuds · 24 liens',
    recentre: 'Recentrer',
    legend: 'Légende',
    copyPre: '© 2026 ',
    copyName: 'Tom Bazarnik',
  },

  // The sidebar that opens on a node click: the node is « Claude Fable Latest ».
  NODE: {
    name: 'Claude Fable Latest',
    type: 'Modèle',
    close: 'Fermer',
    lab: 'Anthropic',
    logo: 'anthropic',
    labelLab: 'Laboratoire',
    labelCat: 'Catégorie',
    cat: 'Routeur',
    labelWeight: 'Poids',
    weight: 'Fermés',
    labelIn: 'Modalités d’entrée',
    inputs: ['Texte', 'Image', 'Fichier'],
    labelOut: 'Modalités de sortie',
    outputs: ['Texte'],
    labelCtx: 'Contexte (tokens)',
    ctx: '1 000 000',
    labelDate: 'Date de sortie',
    date: '9 juin 2026',
    labelDesc: 'Description',
    desc: 'Ce modèle redirige toujours vers le dernier modèle de la famille Claude Fable.',
  },
};

// EN translation. The testimonial's sentence is translated as a whole.
const en: typeof fr = {
  TEXT: {
    seul: 'From need to product.',
  },

  AUTHOR: {
    photo: 'profiles/nicolas-kahn.jpg',
    name: 'Nicolas Kahn',
    role: 'CTO',
  },
  QUOTE: "He is a reliable, curious developer who pays close attention to users' needs.",

  EXPERIENCE: {
    logo: 'companies/la-metis.jpg',
    company: 'La Mètis',
    activity: 'Strategic intelligence',
    period: 'Jun 2025 – Oct 2026 · 1 year and 5 months',
  },

  APP: {
    url: 'mindmap.exemple.fr/projects/ai-models',
    brand: 'Mindmap CMS',
    nav: ['General', 'Entities', 'Content', 'Links', 'Preview'],
    user: 'TB',
    crumbEntity: 'Projects / AI models and providers in 2026 / Entities / Model',
    crumbGraph: 'Projects / AI models and providers in 2026 / Preview',
    exportBtn: 'Export graph',
  },

  ENTITY: {
    sideTitle: 'Entities',
    side: ['Laboratory', 'Model'],
    title: 'Model',
    save: 'Save',
    labelName: 'Field name',
    labelFormat: 'Format',
    fields: [
      { name: 'Name', format: 'Text' },
      { name: 'Logo', format: 'Image (PNG, JPG, WebP)' },
      { name: 'Laboratory', format: 'Relation' },
      { name: 'Weight', format: 'Open or closed' },
      { name: 'Input modalities', format: 'Choice list' },
    ],
  },

  GRAPH: {
    preview: 'PREVIEW',
    title: 'AI models and providers in 2026',
    date: 'Nov 4, 2026',
    params: 'Settings',
    addFilter: '+ Filter',
    chips: ['Laboratory · all 4', 'Category · LLM 30'],
    clear: 'Clear all',
    counts: '28 nodes · 24 links',
    recentre: 'Re-center',
    legend: 'Legend',
    copyPre: '© 2026 ',
    copyName: 'Tom Bazarnik',
  },

  NODE: {
    name: 'Claude Fable Latest',
    type: 'Model',
    close: 'Close',
    lab: 'Anthropic',
    logo: 'anthropic',
    labelLab: 'Laboratory',
    labelCat: 'Category',
    cat: 'Router',
    labelWeight: 'Weight',
    weight: 'Closed',
    labelIn: 'Input modalities',
    inputs: ['Text', 'Image', 'File'],
    labelOut: 'Output modalities',
    outputs: ['Text'],
    labelCtx: 'Context (tokens)',
    ctx: '1,000,000',
    labelDate: 'Release date',
    date: 'June 9, 2026',
    labelDesc: 'Description',
    desc: 'This model always routes to the latest model in the Claude Fable family.',
  },
};

export const STR: Bilingual<typeof fr> = { fr, en };
