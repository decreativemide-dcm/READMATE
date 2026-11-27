import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'prompt',
      injectRegister: 'inline',

      // Use the existing public/manifest.webmanifest
      manifest: false,

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webmanifest,woff2}'
        ],
        navigateFallback: 'index.html'
      }
    })
  ]
})
