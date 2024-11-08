import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    open: true, // Abre automáticamente el navegador
  },
});
