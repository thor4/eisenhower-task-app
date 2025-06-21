import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
  base: '/eisenhower-task-app/', // GitHub Pages base path
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 3000,
  },
})