import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      configPath: "./wrangler.jsonc",
      auxiliaryWorkers: [{ configPath: "../testing-hono/wrangler.jsonc" }],
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
