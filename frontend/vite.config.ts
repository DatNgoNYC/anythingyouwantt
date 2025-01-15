import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': { // proxy for rest-api
        target: 'http://localhost:3000', // Proxy to your backend server
        changeOrigin: true, // Adjust the origin header
      },
    },
  },
})
