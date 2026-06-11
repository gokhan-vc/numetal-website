import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Numetal — agent accelerator studio. Cloudflare Pages (SSR) for the /fees engine,
// static prerender for landing + legal. Security headers live in src/middleware.ts.
export default defineConfig({
  site: 'https://numetal.xyz',
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough' }),
  trailingSlash: 'never',
  build: { format: 'file' },
});
