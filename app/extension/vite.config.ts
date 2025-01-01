import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import webExtension from '@samrum/vite-plugin-web-extension';
import { getManifest } from './manifest.config';

const dev = process.env.NODE_ENV === 'development';

export const outDir = dev ? 'dist/dev' : 'dist/build';

export default defineConfig({
  build: {
      emptyOutDir: false,
      modulePreload: false,
      rollupOptions: {
          input: {
              inpage: 'src/entries/background/interceptRequests.ts',
              popup: 'src/popup.ts', // Add popup.html as an entry
          },
          output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].js',
          },
          external: [], // Ensure dependencies are properly listed here
      },
  },
  plugins: [
      tsconfigPaths(),
      webExtension({
          manifest: getManifest({ dev }),
      }),
  ],
});
