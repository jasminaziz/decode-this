import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Local dev only: `npm run dev` serves the interface and proxies API
    // calls to `vercel dev --listen 3100`, which runs the /api function.
    proxy: {
      '/api': 'http://localhost:3100',
    },
  },
})
