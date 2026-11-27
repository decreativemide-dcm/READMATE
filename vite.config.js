
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: false,

      workbox: {
        importScripts: ['push-handler.js'],

        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webmanifest,woff2}'
        ],

        navigateFallback: 'index.html'
      }
    })
  ]
});
