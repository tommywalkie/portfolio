import type { Bilingual } from '../../../lib/locale';

export type Lead = {
  first: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  company: string;
  sector: string;
  size: string;
  city: string;
};

const fr = {
  intro: { un: 'Des produits SaaS', integre: 'qui s’intègrent à' },

  TARGETS_B: ['Salesforce', 'HubSpot', 'Segment', 'Outreach', 'LinkedIn', 'Gmail', 'vos outils.'],
  SIGNALS_B: ['Utilise Salesforce', 'Recrute en marketing', 'A vu la page tarifs', 'Taille : 120 salariés'],

  leads: [
    { first: 'Claire', name: 'Claire Vidal', initials: 'CV', email: 'c.vidal@nomad.example', role: 'Directrice marketing', company: 'Atelier Nomad', sector: 'Mobilier et design', size: '120 salariés', city: 'Lyon' },
    { first: 'Hugo', name: 'Hugo Morel', initials: 'HM', email: 'h.morel@lumen.example', role: 'Responsable growth', company: 'Lumen Bâtiment', sector: 'Construction', size: '340 salariés', city: 'Nantes' },
    { first: 'Inès', name: 'Inès Faure', initials: 'IF', email: 'i.faure@nova.example', role: 'Head of Sales Ops', company: 'Nova Logistique', sector: 'Logistique', size: '85 salariés', city: 'Lille' },
  ] as Lead[],

  CRM: {
    url: 'crm.exemple.fr/contacts',
    app: 'Ventes',
    nav: ['Accueil', 'Leads', 'Contacts', 'Comptes', 'Opportunités', 'Rapports'],
    active: 2,
    actions: ['Modifier', 'Nouvelle tâche'],
    detailsTitle: 'Détails',
    fields: ['E-mail', 'Téléphone', 'Compte', 'Ville', 'Propriétaire'],
    phone: '04 78 00 12 34',
    owner: 'Équipe Sales',
    activityTitle: 'Activité',
    activity: [
      ['Appel de découverte', 'Planifié · jeudi'],
      ['E-mail : proposition', 'Envoyé · lundi'],
      ['Note : salon de printemps', 'Ajoutée · 2 mars'],
    ] as [string, string][],
  },

  SOCIAL: {
    url: 'linkedin.com/in/',
    buttons: ['Suivre', 'Message'],
    about: 'Infos',
    at: 'chez',
    postsTitle: 'Activité',
    posts: ['Ce qui a changé dans nos campagnes cette année.', 'Retour sur notre salon de printemps à Paris.'],
    reactions: '128 réactions',
  },

  MAIL: {
    url: 'mail.exemple.fr/inbox',
    compose: 'Nouveau message',
    folders: ['Boîte de réception', 'Envoyés', 'Brouillons'],
    subject: 'Re : démo de jeudi',
    body: ['Bonjour,', 'Merci pour la présentation, l’équipe a', 'quelques questions sur l’intégration CRM.', 'Pouvons-nous caler un point ?'],
    time: '10:42',
  },

  COPILOT: {
    title: 'Sales Copilot',
    tabs: ['Résumé', 'Activités', 'Entreprise'],
    sequence: 'Ajouter à une séquence',
    fit: 'Customer fit',
    signalsTitle: 'Top signaux',
    signals: ['Utilise probablement Salesforce', 'Recrute en marketing', 'Taille : 120 salariés', 'A vu la page tarifs'],
    feedTitle: 'Fil d’activité',
    feedFilter: 'Doit contenir…',
    feedButton: 'Filtrer',

    feed: [
      ['a répondu à un e-mail', 'Re : démo de jeudi', 'sam. 9 mars'],
      ['a vu la page tarifs', 'exemple.fr/tarifs · 2 fois', 'ven. 8 mars'],
      ['a ouvert un e-mail', 'Proposition commerciale', 'jeu. 7 mars'],
      ['a commenté un post', 'Campagnes 2024', 'mar. 5 mars'],
    ] as [string, string, string][],
    techTitle: 'Technos',
    competitors: 'Concurrents (3)',
    competitorList: ['6sense', 'ZoomInfo', 'IDC'],
    interests: 'Intérêts (3)',
    interestList: ['LinkedIn Sales Navigator', 'Salesforce CRM', 'Marketo'],
  },

  FLOATING: {
    playbook: 'Opportunités perdues à réactiver (8)',
    playbookSub: 'Contacts passés qui montrent des signes d’activité',
    columns: ['Nom', 'Persona', 'Fit'],
    rows: [
      ['Alex Martin', 'Acheteur', 3],
      ['Sam Rivière', 'Acheteur', 2],
      ['Lou Chen', 'Acheteur', 2],
    ] as [string, string, number][],
    playbooksTitle: 'Playbooks',
    playbooks: [
      ['Boîte de réception', '236'],
      ['Changements de poste', '18'],
      ['Comptes en forte activité', '42'],
      ['Ont vu la page tarifs', '27'],
    ] as [string, string][],
  },

  TARGETS: [
    'Salesforce', 'HubSpot', 'Clearbit', 'AWS (S3)', 'Segment', 'ZoomInfo', 'BigQuery', 'Common Room', '6sense', 'Outreach',
    'Eloqua', 'Snowflake', 'Marketo', 'Amplitude', 'LinkedIn', 'G2', 'Salesloft', 'Apollo', 'Gmail', 'vos outils.',
  ],

  EXPERIENCE: {
    logo: 'companies/madkudu.jpg',
    company: 'MadKudu',
    activity: 'SaaS · Sales intelligence',
    period: 'juil. 2022 – févr. 2025 · 2 ans 7 mois',
  },

  STORE: {
    logo: 'logos/chrome-web-store.svg',
    domain: 'chromewebstore.google.com',
    title: 'HG Insights Sales Copilot',

    details: ['Book 2x More Meetings with HG Insights Sales Copilot.', '5,0 ★ · 1 000 utilisateurs'],

    available: 'Disponible sur le Chrome Web Store',
  },
};

const en: typeof fr = {
  intro: { un: 'SaaS products', integre: 'that integrate with' },
  TARGETS_B: ['Salesforce', 'HubSpot', 'Segment', 'Outreach', 'LinkedIn', 'Gmail', 'your tools.'],
  SIGNALS_B: ['Uses Salesforce', 'Hiring in marketing', 'Viewed the pricing page', 'Size: 120 employees'],

  leads: [
    { first: 'Claire', name: 'Claire Vidal', initials: 'CV', email: 'c.vidal@nomad.example', role: 'Marketing director', company: 'Atelier Nomad', sector: 'Furniture and design', size: '120 employees', city: 'Lyon' },
    { first: 'Hugo', name: 'Hugo Morel', initials: 'HM', email: 'h.morel@lumen.example', role: 'Growth lead', company: 'Lumen Bâtiment', sector: 'Construction', size: '340 employees', city: 'Nantes' },
    { first: 'Inès', name: 'Inès Faure', initials: 'IF', email: 'i.faure@nova.example', role: 'Head of Sales Ops', company: 'Nova Logistique', sector: 'Logistics', size: '85 employees', city: 'Lille' },
  ] as Lead[],

  CRM: {
    url: 'crm.exemple.fr/contacts',
    app: 'Sales',
    nav: ['Home', 'Leads', 'Contacts', 'Accounts', 'Opportunities', 'Reports'],
    active: 2,
    actions: ['Edit', 'New task'],
    detailsTitle: 'Details',
    fields: ['Email', 'Phone', 'Account', 'City', 'Owner'],
    phone: '04 78 00 12 34',
    owner: 'Sales team',
    activityTitle: 'Activity',
    activity: [
      ['Discovery call', 'Scheduled · Thursday'],
      ['Email: proposal', 'Sent · Monday'],
      ['Note: spring trade show', 'Added · March 2'],
    ] as [string, string][],
  },

  SOCIAL: {
    url: 'linkedin.com/in/',
    buttons: ['Follow', 'Message'],
    about: 'Info',
    at: 'at',
    postsTitle: 'Activity',
    posts: ['What changed in our campaigns this year.', 'Looking back at our spring trade show in Paris.'],
    reactions: '128 reactions',
  },

  MAIL: {
    url: 'mail.exemple.fr/inbox',
    compose: 'New message',
    folders: ['Inbox', 'Sent', 'Drafts'],
    subject: 'Re: Thursday demo',
    body: ['Hello,', 'Thanks for the presentation, the team has', 'a few questions about the CRM integration.', 'Can we set up a call?'],
    time: '10:42',
  },

  COPILOT: {
    title: 'Sales Copilot',
    tabs: ['Summary', 'Activities', 'Company'],
    sequence: 'Add to a sequence',
    fit: 'Customer fit',
    signalsTitle: 'Top signals',
    signals: ['Probably uses Salesforce', 'Hiring in marketing', 'Size: 120 employees', 'Viewed the pricing page'],
    feedTitle: 'Activity feed',
    feedFilter: 'Must contain…',
    feedButton: 'Filter',
    feed: [
      ['replied to an email', 'Re: Thursday demo', 'Sat, Mar 9'],
      ['viewed the pricing page', 'exemple.fr/pricing · 2 times', 'Fri, Mar 8'],
      ['opened an email', 'Sales proposal', 'Thu, Mar 7'],
      ['commented on a post', 'Campaigns 2024', 'Tue, Mar 5'],
    ] as [string, string, string][],
    techTitle: 'Tech stack',
    competitors: 'Competitors (3)',
    competitorList: ['6sense', 'ZoomInfo', 'IDC'],
    interests: 'Interests (3)',
    interestList: ['LinkedIn Sales Navigator', 'Salesforce CRM', 'Marketo'],
  },

  FLOATING: {
    playbook: 'Lost opportunities to reactivate (8)',
    playbookSub: 'Past contacts showing signs of activity',
    columns: ['Name', 'Persona', 'Fit'],
    rows: [
      ['Alex Martin', 'Buyer', 3],
      ['Sam Rivière', 'Buyer', 2],
      ['Lou Chen', 'Buyer', 2],
    ] as [string, string, number][],
    playbooksTitle: 'Playbooks',
    playbooks: [
      ['Inbox', '236'],
      ['Job changes', '18'],
      ['Accounts with high activity', '42'],
      ['Viewed the pricing page', '27'],
    ] as [string, string][],
  },

  TARGETS: [
    'Salesforce', 'HubSpot', 'Clearbit', 'AWS (S3)', 'Segment', 'ZoomInfo', 'BigQuery', 'Common Room', '6sense', 'Outreach',
    'Eloqua', 'Snowflake', 'Marketo', 'Amplitude', 'LinkedIn', 'G2', 'Salesloft', 'Apollo', 'Gmail', 'your tools.',
  ],

  EXPERIENCE: {
    logo: 'companies/madkudu.jpg',
    company: 'MadKudu',
    activity: 'SaaS · Sales intelligence',
    period: 'Jul 2022 – Feb 2025 · 2 years 7 months',
  },
  STORE: {
    logo: 'logos/chrome-web-store.svg',
    domain: 'chromewebstore.google.com',
    title: 'HG Insights Sales Copilot',
    details: ['Book 2x More Meetings with HG Insights Sales Copilot.', '5.0 ★ · 1,000 users'],
    available: 'Available on the Chrome Web Store',
  },
};

export const STR: Bilingual<typeof fr> = { fr, en };
