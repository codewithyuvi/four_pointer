import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

      // ✅ REQUIRED FOR ALGOKIT / PERA
      buffer: "buffer",
      process: "process/browser",
    },
  },

  // ✅ VERY IMPORTANT
  define: {
    global: "globalThis",
  },
}));