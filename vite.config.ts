import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
    base: '/creator-portal/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
server: {
  // host: true,
    proxy: {
      // When the frontend calls "/api", Vite redirects it
      '/api': {
<<<<<<< Updated upstream
        target: 'https://uat.api.amuze.com.mm/api/', 
=======
        // target: 'https://uat.api.amuze.com.mm/api/', // Your real backend
        target: 'http://localhost:7000/api/', 
>>>>>>> Stashed changes
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
