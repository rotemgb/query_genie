import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    
    server: {
      port: 5173,

      // Use proxy ONLY if we're running locally (not dev/prod build)
      proxy: env.VITE_API_URL.startsWith("http://localhost")
        ? {
            "/query": {
              target: env.VITE_API_URL,
              changeOrigin: true,
            }
          }
        : undefined
    }
  };
});
