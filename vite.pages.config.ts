import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/BankQK/',
  plugins: [react()],
  define: { 'import.meta.env.VITE_LOCAL_MODE': JSON.stringify('true') },
  build: { outDir: 'dist-pages', emptyOutDir: true },
});
