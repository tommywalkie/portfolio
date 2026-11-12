import type { Bilingual } from '../../../lib/locale';

const fr = {

  TEXT: {
    stack: ['Frontend,', 'Backend,', 'Cloud.'],
    quote1: ['Son code était constamment propre, et il contribuait même au design UI/UX.'],
    quote2: ['Je pouvais toujours compter sur lui.'],
  },

  GATE: {
    build: 'build',
    test: 'test',
    success: 'Succès',
    head: 'GitHub Actions',
  },

  UI: {
    react: {
      url: 'localhost:3000',
      title: 'Bienvenue sur React',
      body: 'Modifiez src/App.tsx puis enregistrez pour recharger.',
      link: 'En savoir plus →',
    },
    swagger: {
      url: 'mon-api.local/docs',
      title: 'Mon API',
      version: 'v1',
      rows: [
        ['GET', '/leads'],
        ['POST', '/accounts'],
        ['PATCH', '/signals/{id}'],
        ['DELETE', '/leads/{id}'],
      ] as [string, string][],
    },
    ide: {
      title: 'leads.module.ts',
    },
    aws: {
      url: 'eu-west-3 · production',
      head: 'Services',
      rows: [
        ['ECS', 'api-prod'],
        ['SQS', 'leads-queue'],
        ['RDS', 'pg-main'],
      ] as [string, string][],
    },
    term: {
      title: 'zsh · mon-api',
      command: 'trivy image my-api:latest',
      image: 'my-api:latest (alpine 3.20)',
      total: 'Total : 142 vulnérabilités',
      split: 'élevée 3 · moyenne 21 · faible 118',
      ok: '0 vulnérabilité critique',
    },
  },

  AUTHOR: {
    photo: 'profiles/manuel-darcemont.jpg',
    name: 'Manuel Darcemont',
    role: 'Co-Fondateur & CTO',
  },
};

const en: typeof fr = {
  TEXT: {
    stack: ['Frontend,', 'Backend,', 'Cloud.'],
    quote1: ['His code was consistently clean, and he even contributed to the UI/UX design.'],
    quote2: ['I could always count on him.'],
  },

  GATE: {
    build: 'build',
    test: 'test',
    success: 'Success',
    head: 'GitHub Actions',
  },

  UI: {
    react: {
      url: 'localhost:3000',
      title: 'Welcome to React',
      body: 'Edit src/App.tsx, then save to reload.',
      link: 'Learn more →',
    },
    swagger: {
      url: 'my-api.local/docs',
      title: 'My API',
      version: 'v1',
      rows: [
        ['GET', '/leads'],
        ['POST', '/accounts'],
        ['PATCH', '/signals/{id}'],
        ['DELETE', '/leads/{id}'],
      ] as [string, string][],
    },
    ide: {
      title: 'leads.module.ts',
    },
    aws: {
      url: 'eu-west-3 · production',
      head: 'Services',
      rows: [
        ['ECS', 'api-prod'],
        ['SQS', 'leads-queue'],
        ['RDS', 'pg-main'],
      ] as [string, string][],
    },
    term: {
      title: 'zsh · my-api',
      command: 'trivy image my-api:latest',
      image: 'my-api:latest (alpine 3.20)',
      total: 'Total: 142 vulnerabilities',
      split: 'high 3 · medium 21 · low 118',
      ok: '0 critical vulnerability',
    },
  },

  AUTHOR: {
    photo: 'profiles/manuel-darcemont.jpg',
    name: 'Manuel Darcemont',
    role: 'Co-founder & CTO',
  },
};

export const STR: Bilingual<typeof fr> = { fr, en };
