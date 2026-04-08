import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'docs',
    target: 'esnext'
  },
  worker: {
    format: 'es'
  }
});
