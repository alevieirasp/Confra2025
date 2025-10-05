import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['5173-ii37kp0z0mlaovhugj0bm-0328b1f3.manusvm.computer'],
    proxy: {
      '/api': {
        target: 'https://5000-ii37kp0z0mlaovhugj0bm-0328b1f3.manusvm.computer',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
