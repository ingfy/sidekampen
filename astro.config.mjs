import { defineConfig } from 'astro/config';
import react from "@astrojs/react";


// https://astro.build/config
export default defineConfig({
  site: "https://ingfy.github.io",
  base: "/sidekampen",
  integrations: [react()],
  vite: {
    
  }
});