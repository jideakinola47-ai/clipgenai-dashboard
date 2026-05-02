import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/cloudinary-sign': 'http://localhost:5175',
      '/process-video': 'http://localhost:5175',
    },
  },
})
