// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '0.0.0.0',   // Listens on all network interfaces, allowing access from other devices
    port: 5186,         // Optional: Use the desired port for the Vite server
    proxy: {
      '/api': {
        target: 'contactmbackend-production.up.railway.app',  // Replace with your backend API URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
