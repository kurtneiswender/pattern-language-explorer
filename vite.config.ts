import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/tools/pattern-explorer/',
  plugins: [
    react(),
    tailwindcss(),
  ],
});
