import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.heic'],

  build: {
    // Raise threshold — large media assets are expected in this project
    chunkSizeWarningLimit: 1500,

    // Inline tiny assets as base64 (< 4 KB) to save extra round trips
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        // Rolldown (Vite 8) requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/react-hot-toast/') || id.includes('node_modules/react-icons/')) {
            return 'vendor-ui';
          }
        },
      },
    },
  },
})
