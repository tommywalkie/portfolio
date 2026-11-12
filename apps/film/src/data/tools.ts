// Every tool, language and service shown in the career timeline, with a display score.
// Shared by every bit that shows logos (polyvalence, projects, AI...). Pure data: no React.
//
// score: how strongly the tool is put forward, 1 (background, small) to 5 (speciality, centre).
//   React and Node.js are the specialities. Tune scores freely: bits read them, nothing is hard-coded.
// logo: file in public/logos/ (copied by scripts/copy-logos.mjs from `source`).
// source: where the logo comes from
//   gb:<file>    github.com/gilbarbara/logos (the -icon variant when it exists, smaller and square)
//   si:<file>    simple-icons (single-colour; drawn on light chips)
//   local:<file> the portfolio's refs/logos/ (only when neither library has it)
// mono: single-colour black logo, needs a light background to read.

type ToolCategory = 'language' | 'frontend' | 'backend' | 'data' | 'cloud' | 'devops' | 'testing' | 'ai' | 'gamedev' | 'tooling' | 'hardware' | 'integration';

export type Tool = {
  id: string;
  label: string;
  category: ToolCategory;
  score: 1 | 2 | 3 | 4 | 5;
  source: string;
  mono?: boolean;
};

export const TOOLS: Tool[] = [
  // Languages
  { id: 'typescript', label: 'TypeScript', category: 'language', score: 5, source: 'gb:typescript-icon.svg' },
  { id: 'javascript', label: 'JavaScript', category: 'language', score: 4, source: 'gb:javascript.svg' },
  { id: 'python', label: 'Python', category: 'language', score: 3, source: 'gb:python.svg' },
  { id: 'php', label: 'PHP', category: 'language', score: 2, source: 'gb:php.svg' },
  { id: 'csharp', label: 'C#', category: 'language', score: 2, source: 'gb:c-sharp.svg' },
  { id: 'java', label: 'Java', category: 'language', score: 1, source: 'gb:java.svg' },
  { id: 'c', label: 'C', category: 'language', score: 1, source: 'gb:c.svg' },
  { id: 'cpp', label: 'C++', category: 'language', score: 1, source: 'gb:c-plusplus.svg' },

  // Frontend
  { id: 'react', label: 'React', category: 'frontend', score: 5, source: 'gb:react.svg' },
  { id: 'vue', label: 'Vue', category: 'frontend', score: 4, source: 'gb:vue.svg' },
  { id: 'nextjs', label: 'Next.js', category: 'frontend', score: 3, source: 'gb:nextjs-icon.svg' },
  { id: 'astro', label: 'Astro', category: 'frontend', score: 3, source: 'gb:astro-icon.svg' },
  { id: 'angularjs', label: 'AngularJS', category: 'frontend', score: 2, source: 'si:angularjs.svg', mono: true },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend', score: 4, source: 'gb:tailwindcss-icon.svg' },
  { id: 'sass', label: 'Sass', category: 'frontend', score: 2, source: 'gb:sass.svg' },
  { id: 'chakra', label: 'Chakra UI', category: 'frontend', score: 2, source: 'si:chakraui.svg', mono: true },
  { id: 'styled-components', label: 'styled-components', category: 'frontend', score: 2, source: 'si:styledcomponents.svg', mono: true },
  { id: 'redux', label: 'Redux', category: 'frontend', score: 2, source: 'gb:redux.svg' },
  { id: 'tanstack-query', label: 'TanStack Query', category: 'frontend', score: 4, source: 'gb:react-query-icon.svg' },
  { id: 'threejs', label: 'Three.js', category: 'frontend', score: 3, source: 'gb:threejs.svg' },
  { id: 'leaflet', label: 'Leaflet', category: 'frontend', score: 2, source: 'gb:leaflet.svg' },
  { id: 'vite', label: 'Vite', category: 'frontend', score: 3, source: 'gb:vite-icon.svg' },
  { id: 'mdx', label: 'MDX', category: 'frontend', score: 2, source: 'gb:mdx.svg' },

  // Backend
  { id: 'nodejs', label: 'Node.js', category: 'backend', score: 5, source: 'gb:nodejs-icon.svg' },
  { id: 'nestjs', label: 'NestJS', category: 'backend', score: 4, source: 'gb:nestjs.svg' },
  { id: 'adonisjs', label: 'AdonisJS', category: 'backend', score: 3, source: 'gb:adonisjs-icon.svg' },
  { id: 'symfony', label: 'Symfony', category: 'backend', score: 1, source: 'gb:symfony.svg' },
  { id: 'graphql', label: 'GraphQL', category: 'backend', score: 4, source: 'gb:graphql.svg' },
  { id: 'websockets', label: 'WebSockets', category: 'backend', score: 3, source: 'gb:websocket.svg' },
  { id: 'typeorm', label: 'TypeORM', category: 'backend', score: 3, source: 'gb:typeorm.svg' },
  { id: 'drizzle', label: 'Drizzle ORM', category: 'backend', score: 3, source: 'gb:drizzle-orm-icon.svg' },

  // Data
  { id: 'postgresql', label: 'PostgreSQL', category: 'data', score: 4, source: 'gb:postgresql.svg' },
  { id: 'mongodb', label: 'MongoDB', category: 'data', score: 3, source: 'gb:mongodb-icon.svg' },
  { id: 'mysql', label: 'MySQL', category: 'data', score: 2, source: 'gb:mysql-icon.svg' },
  { id: 'sqlite', label: 'SQLite', category: 'data', score: 2, source: 'gb:sqlite.svg' },
  { id: 'redis', label: 'Redis', category: 'data', score: 3, source: 'gb:redis.svg' },
  { id: 'airflow', label: 'Airflow', category: 'data', score: 1, source: 'gb:airflow-icon.svg' },

  // Cloud
  { id: 'aws', label: 'AWS', category: 'cloud', score: 4, source: 'gb:aws.svg' },
  { id: 'aws-ecs', label: 'AWS ECS', category: 'cloud', score: 2, source: 'gb:aws-ecs.svg' },
  { id: 'aws-s3', label: 'AWS S3', category: 'cloud', score: 2, source: 'gb:aws-s3.svg' },
  { id: 'aws-rds', label: 'AWS RDS', category: 'cloud', score: 2, source: 'gb:aws-rds.svg' },
  { id: 'aws-dynamodb', label: 'AWS DynamoDB', category: 'cloud', score: 2, source: 'gb:aws-dynamodb.svg' },
  { id: 'aws-sqs', label: 'AWS SQS', category: 'cloud', score: 2, source: 'gb:aws-sqs.svg' },
  { id: 'aws-redshift', label: 'AWS Redshift', category: 'cloud', score: 1, source: 'gb:aws-redshift.svg' },
  { id: 'aws-cloudwatch', label: 'AWS CloudWatch', category: 'cloud', score: 2, source: 'gb:aws-cloudwatch.svg' },
  { id: 'vercel', label: 'Vercel', category: 'cloud', score: 2, source: 'gb:vercel-icon.svg' },

  // DevOps
  { id: 'docker', label: 'Docker', category: 'devops', score: 4, source: 'gb:docker-icon.svg' },
  { id: 'terraform', label: 'Terraform', category: 'devops', score: 3, source: 'gb:terraform-icon.svg' },
  { id: 'traefik', label: 'Traefik', category: 'devops', score: 2, source: 'gb:traefik-proxy-icon.svg' },
  { id: 'git', label: 'Git', category: 'devops', score: 4, source: 'gb:git-icon.svg' },
  { id: 'github', label: 'GitHub', category: 'devops', score: 3, source: 'gb:github-icon.svg' },
  { id: 'github-actions', label: 'GitHub Actions', category: 'devops', score: 3, source: 'gb:github-actions.svg' },
  { id: 'circleci', label: 'CircleCI', category: 'devops', score: 2, source: 'gb:circleci.svg' },
  { id: 'datadog', label: 'Datadog', category: 'devops', score: 2, source: 'gb:datadog-icon.svg' },
  { id: 'trivy', label: 'Trivy', category: 'devops', score: 1, source: 'si:trivy.svg', mono: true },
  { id: 'jenkins', label: 'Jenkins', category: 'devops', score: 1, source: 'gb:jenkins.svg' },
  { id: 'sonarqube', label: 'SonarQube', category: 'devops', score: 1, source: 'gb:sonarqube.svg' },

  // Testing
  { id: 'playwright', label: 'Playwright', category: 'testing', score: 3, source: 'gb:playwright.svg' },
  { id: 'vitest', label: 'Vitest', category: 'testing', score: 3, source: 'gb:vitest.svg' },
  { id: 'selenium', label: 'Selenium', category: 'testing', score: 1, source: 'gb:selenium.svg' },

  // AI
  { id: 'claude-code', label: 'Claude Code', category: 'ai', score: 4, source: 'gb:claude-icon.svg' },
  { id: 'opencode', label: 'OpenCode', category: 'ai', score: 3, source: 'gb:opencode-icon.svg' },
  { id: 'cursor', label: 'Cursor', category: 'ai', score: 2, source: 'gb:cursor-icon.svg' },
  { id: 'copilot', label: 'GitHub Copilot', category: 'ai', score: 2, source: 'gb:github-copilot.svg' },

  // Game development
  { id: 'godot', label: 'Godot', category: 'gamedev', score: 3, source: 'gb:godot-icon.svg' },

  // Tooling and project management
  { id: 'zed', label: 'Zed', category: 'tooling', score: 2, source: 'si:zedindustries.svg', mono: true },
  { id: 'notion', label: 'Notion', category: 'tooling', score: 2, source: 'gb:notion-icon.svg' },
  { id: 'jira', label: 'Jira', category: 'tooling', score: 2, source: 'gb:jira.svg' },
  { id: 'clickup', label: 'ClickUp', category: 'tooling', score: 2, source: 'gb:clickup-icon.svg' },

  // Hardware
  { id: 'arduino', label: 'Arduino', category: 'hardware', score: 1, source: 'gb:arduino.svg' },
];

// Integrations: the CRM, data and mail services a buying-signal product plugs into (copilot-extension).
// Kept out of TOOLS on purpose: the polyvalence bits read every entry of TOOLS, so these logos would
// otherwise join their tag fields. Same shape and logo copy as TOOLS (scripts/copy-logos.ts copies both).
export const INTEGRATIONS: Tool[] = [
  { id: 'salesforce', label: 'Salesforce', category: 'integration', score: 1, source: 'gb:salesforce.svg' },
  { id: 'hubspot', label: 'HubSpot', category: 'integration', score: 1, source: 'gb:hubspot.svg' },
  { id: 'linkedin', label: 'LinkedIn', category: 'integration', score: 1, source: 'gb:linkedin-icon.svg' },
  { id: 'gmail', label: 'Gmail', category: 'integration', score: 1, source: 'gb:google-gmail.svg' },
  { id: 'snowflake', label: 'Snowflake', category: 'integration', score: 1, source: 'gb:snowflake-icon.svg' },
  { id: 'segment', label: 'Segment', category: 'integration', score: 1, source: 'gb:segment-icon.svg' },
  { id: 'g2', label: 'G2', category: 'integration', score: 1, source: 'si:g2.svg', mono: true },
  { id: 'chrome-web-store', label: 'Chrome Web Store', category: 'integration', score: 1, source: 'gb:chrome-web-store.svg' },
  { id: 'outreach', label: 'Outreach', category: 'integration', score: 1, source: 'brand:outreach-icon.svg' }, // mark cut from outreach.io's stacked logo
  { id: 'apollo', label: 'Apollo.io', category: 'integration', score: 1, source: 'brand:apollo.svg' }, // svgl.app
];

// AI labs: the hubs of the graph-CMS slide (graphe-relationnel). Kept out of TOOLS for the same reason as INTEGRATIONS.
export const LABS: Tool[] = [
  { id: 'openai', label: 'OpenAI', category: 'ai', score: 1, source: 'gb:openai-icon.svg' },
  { id: 'anthropic', label: 'Anthropic', category: 'ai', score: 1, source: 'gb:anthropic-icon.svg' },
  { id: 'mistral', label: 'Mistral', category: 'ai', score: 1, source: 'gb:mistral-ai-icon.svg' },
  { id: 'qwen', label: 'Qwen', category: 'ai', score: 1, source: 'gb:qwen-icon.svg' },
  { id: 'deepseek', label: 'DeepSeek', category: 'ai', score: 1, source: 'brand:deepseek.svg' }, // lobehub icons (DeepSeek color mark)
  { id: 'zhipu', label: 'GLM (Zhipu)', category: 'ai', score: 1, source: 'brand:zhipu.svg' }, // lobehub icons (Zhipu color mark, the GLM models)
];

/** The logo path for staticFile(). */
export const logoOf = (t: Tool) => `logos/${t.id}.svg`;

const ids = new Set<string>();
for (const t of [...TOOLS, ...INTEGRATIONS, ...LABS]) {
  if (ids.has(t.id)) throw new Error(`tools: duplicate id "${t.id}"`);
  ids.add(t.id);
}
