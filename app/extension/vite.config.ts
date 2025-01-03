import webExtension from '@samrum/vite-plugin-web-extension'
import { getManifest } from './manifest.config';
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';

const dev = process.env.NODE_ENV === 'development';

export const outDir = dev ? 'dist/dev' : 'dist/build';


export default defineConfig({
  build: {
    emptyOutDir: false,
    modulePreload: false,
    outDir,
    rollupOptions: {
      input: {
        inpage: 'src/entries/background/interceptRequests.ts',
        popup: 'src/popup.html', 
    },
    output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
    },
    external: [], 
    }
  },
  optimizeDeps: {
    exclude: ['viem'],
  },
  plugins: [
    tsconfigPaths(),
    webExtension({
      manifest: getManifest({ dev })
    })
  ],
});


