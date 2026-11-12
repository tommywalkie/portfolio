// Non-text data of graphe-relationnel: the graph's example data, four AI labs (hubs) and their models. Lab and model
// names are proper names, the same in every locale. Logos are in public/logos/ (copied by scripts/copy-logos.ts).
// Every other string the picture shows is in copy.ts (i18n).

export const LABS = [
  { id: 'openai', name: 'OpenAI', logo: 'openai', models: ['GPT-5', 'GPT-5 Mini', 'GPT-5 Nano', 'o3', 'o4 Mini', 'gpt-oss-120b'] },
  { id: 'anthropic', name: 'Anthropic', logo: 'anthropic', models: ['Claude Opus 4.6', 'Claude Sonnet 4.5', 'Claude Fable Latest', 'Claude Haiku 4.5', 'Claude Fable 5.1', 'Claude Opus 4.8', 'Claude Sonnet 4.6'] },
  { id: 'mistral', name: 'Mistral', logo: 'mistral', models: ['Mistral Large', 'Mistral Medium 3.1', 'Mistral Small 4', 'Codestral', 'Devstral Small', 'Magistral Small'] },
  { id: 'qwen', name: 'Qwen', logo: 'qwen', models: ['Qwen3 Coder', 'Qwen3 235B A22B', 'Qwen3 Max', 'Qwen3 Embedding 8B', 'Qwen3 VL 8B Thinking'] },
];
