import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  base: './',
  css: {
    devSourcemap: true,
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: true,
  },
});
