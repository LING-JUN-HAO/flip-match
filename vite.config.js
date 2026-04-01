import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? packageJson.name;
const buildBase = process.env.BASE_PATH ?? `/${repositoryName}/`;

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? buildBase : '/',
}));
