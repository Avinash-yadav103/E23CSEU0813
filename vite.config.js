import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Forward all /evaluation-service/* requests to the external API.
      // This sidesteps the browser CORS restriction entirely — the Vite
      // dev server (Node) makes the request server-side and returns it.
      '/evaluation-service': {
        target: 'http://4.224.186.213',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

