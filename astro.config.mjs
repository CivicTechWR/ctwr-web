// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://civictechwr.org',
  trailingSlash: 'always',
  build: { assets: 'assets' },
});
