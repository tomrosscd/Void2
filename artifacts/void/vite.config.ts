import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Architectural decision: PORT and BASE_PATH are no longer required.
// For GitHub Pages with a custom subdomain the site lives at the domain root,
// so base is always "/". Local dev with `vite` or `live-server` also uses "/".
// The Replit-specific plugins (cartographer, dev-banner, runtime-error-modal)
// are removed — they require env vars that don't exist outside Replit.

export default defineConfig({
  // "/" works for both local dev and a GitHub Pages custom-subdomain deployment.
  // If you ever move to a sub-path (e.g. github.io/repo-name/) change this to
  // the sub-path string, e.g. "/repo-name/".
  base: "/",

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },

  server: {
    // Falls back to Vite's default (5173) when PORT is not set.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    host: "0.0.0.0",
  },
});
