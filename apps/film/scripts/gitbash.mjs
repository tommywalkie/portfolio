// Runs a bash script with Git Bash (not the WSL bash.exe on PATH), streaming its output; for npm scripts on Windows,
// where cmd.exe mangles a quoted "C:/Program Files/..." command. Usage: node scripts/gitbash.mjs <script.sh> [args...]
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const candidates = [process.env.GIT_BASH, 'C:\\Program Files\\Git\\bin\\bash.exe', 'C:\\Program Files (x86)\\Git\\bin\\bash.exe'];
const bash = candidates.find((p) => p && existsSync(p)) ?? 'bash';
const r = spawnSync(bash, process.argv.slice(2), { stdio: 'inherit' });
process.exit(r.status ?? 1);
