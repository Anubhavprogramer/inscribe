import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add SPA fallback for client-side routing
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // This ensures all routes fall back to index.html for client-side routing
  preview: {
    port: 3000,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    // This is crucial for SPA routing in development
    historyApiFallback: true,
  },
})
