import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Requests to /api go to the database API (server/index.js).
    proxy: { '/api': 'http://localhost:3001' },
  },
})
