import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Raulopoly/',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/game/engine/__tests__/**/*.test.js'],
  },
});
