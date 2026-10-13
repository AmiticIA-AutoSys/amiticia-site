import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    allowedHosts: ["amiticia.cc", "www.amiticia.cc", "localhost"],
  },
  // Canonical and og: URLs are absolute; SITE_URL picks the origin (preview stacks use a tunnel URL).
  define: {
    __SITE_URL__: JSON.stringify(process.env.SITE_URL || "https://amiticia.cc"),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
