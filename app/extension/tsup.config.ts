import { defineConfig } from 'tsup';
import { getManifest } from './manifest.config';
import path from 'path';
import fs from 'fs';

const dev = process.env.NODE_ENV === 'development';

export const outDir = dev ? 'dist/dev' : 'dist/build';

function copyStaticFiles() {
    const srcStaticPaths = [
        { src: path.resolve(__dirname, 'src/popup.html'), dest: path.resolve(outDir, 'popup.html') },
        { src: path.resolve(__dirname, 'public/icons'), dest: path.resolve(outDir, 'icons') },
    ];

    srcStaticPaths.forEach(({ src, dest }) => {
        if (fs.existsSync(src)) {
            if (fs.statSync(src).isDirectory()) {
                fs.cpSync(src, dest, { recursive: true });
            } else {
                fs.mkdirSync(path.dirname(dest), { recursive: true });
                fs.copyFileSync(src, dest);
            }
            console.log(`Copied ${src} to ${dest}`);
        } else {
            console.warn(`Path does not exist: ${src}`);
        }
    });
}

export default defineConfig({
entry: [
    'src/entries/**/*.{ts,tsx}', 
    'src/**/*.{ts,tsx}',  
],
  outDir,
  format: ['esm', 'cjs'], 
  splitting: false,
  sourcemap: dev,
  clean: true,
  dts: false,
  minify: !dev,
  external: ['fs', 'path'], 
  esbuildOptions: (options) => {
    options.entryNames = '[dir]/[name]'; 
    options.chunkNames = '[dir]/[name]'; ;
  },
  onSuccess: async () => {
    const manifest = getManifest({ dev });
    await fs.promises.writeFile(
      path.join(outDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2),
    );
    copyStaticFiles();
  },
});
