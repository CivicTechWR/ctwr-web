// @ts-check
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://civictechwr.org',
  trailingSlash: 'always',
  build: { assets: 'assets' },
  env: {
    schema: {
      // Optional so a build without the token still publishes the sample photos.
      INSTAGRAM_ACCESS_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      INSTAGRAM_USER_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
