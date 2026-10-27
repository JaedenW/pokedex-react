import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3000 },
  // Keep CRA's output folder so the gh-pages deploy script still works
  build: { outDir: 'build' },
});
