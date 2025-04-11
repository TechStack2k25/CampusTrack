import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target:
          process.env.MODE === 'production'
            ? process.env.VITE_PRODUCTION_URL
            : process.env.VITE_BACKENED_URL, // your backend server
        changeOrigin: true,
        ws: true, // Enable WebSocket proxy
      },
    },
  },
  plugins: [react()],
});
