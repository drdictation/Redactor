import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy PDF libraries into separate chunks for better Core Web Vitals
        manualChunks: {
          'pdf-engine': ['pdfjs-dist', 'pdf-lib'],
        },
      },
    },
  },
})
