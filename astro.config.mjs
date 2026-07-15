import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://airdb.tech",
  output: "static",
  publicDir: "static",
  integrations: [sitemap()],
});
