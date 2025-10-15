import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3008,          // your dev port
    host: true,           // allow external access
    allowedHosts: [
      'dashboard.aiyug.us',  
    ],
  },
})
