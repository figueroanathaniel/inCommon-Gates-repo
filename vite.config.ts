import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// The Academy is a branch of inCommon's own site: a static build served at
// incommonspace.com/bazi/, beside inCommon on the same origin, so it reads
// the same sign in. It has no server. Every asset and route carries the base.
export default defineConfig({
  base: "/bazi/",
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
