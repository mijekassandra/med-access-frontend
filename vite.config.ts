import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      'localhost',
      '.loca.lt'   // allow any loca.lt subdomain
    ]
  },
  plugins: [react()],
})
