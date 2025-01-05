import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    port: 5174,
    strictPort: true,
  },
});
