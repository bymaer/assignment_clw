import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // слушать все адреса
    watch: {
      usePolling: true // для лучшей работы в Docker
    }
  }
});
