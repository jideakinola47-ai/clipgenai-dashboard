import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Let Vite automatically handle HMR in Codespaces
    hmr: true, // This tells Vite to auto-configure
    watch: {
      usePolling: true,
      interval: 100,
    },
    host: true,
    port: 5173,
  },
})