import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: "/creator-portal/",
  plugins: [
VitePWA({
  registerType: "autoUpdate",
  injectRegister: false,

pwaAssets: {
  disabled: true,
},
manifest: {
  name: "Amuze Creator Portal",
  short_name: "Amuze",
  description: "Creator Portal",
  theme_color: "#ffffff",
  background_color: "#ffffff",

  icons: [
    {
      src: "/creator-portal/amuze-logo.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "/creator-portal/amuze-logo.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
  ],
},
  workbox: {
    globPatterns: [
      "**/*.{js,css,html,svg,png,ico}"
    ],
    cleanupOutdatedCaches: true,
    clientsClaim: true,

    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  },

  devOptions: {
    enabled: false,
    navigateFallback: "index.html",
    suppressWarnings: true,
    type: "module",
  },
}),
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ["recharts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // host: true,
    proxy: {
      // When the frontend calls "/api", Vite redirects it
      "/api": {
        target: "https://uat.api.amuze.com.mm/api/",
        // target: 'http://localhost:7000/api/',

        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
