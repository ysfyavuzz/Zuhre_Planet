import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/_core': path.resolve(__dirname, './src/_core'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React ekosistemi
          'react-vendor': ['react', 'react-dom'],
          // Router ve state management
          'router-vendor': ['wouter'],
          'query-vendor': ['@tanstack/react-query'],
          // UI kütüphaneleri
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-slot',
            '@radix-ui/react-checkbox',
          ],
          // Animasyon ve görsel kütüphaneler
          'motion-vendor': ['framer-motion', 'swiper'],
          // Form ve validasyon
          'form-vendor': ['zod'],
          // Utility kütüphaneleri
          'utils-vendor': ['date-fns', 'clsx', 'class-variance-authority', 'tailwind-merge'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
