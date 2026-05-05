import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/el-sendero/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'img/**/*'],
      manifest: {
        name: 'El Sendero',
        short_name: 'El Sendero',
        description: 'El camino del guerrero. Encontrá tu guardia.',
        theme_color: '#0d0c0b',
        background_color: '#0d0c0b',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/el-sendero/',
        icons: [
          { src: 'img/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-cache', expiration: { maxAgeSeconds: 60 * 5 } }
          }
        ]
      }
    })
  ],
})
