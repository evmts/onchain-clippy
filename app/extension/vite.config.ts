import webExtension from '@samrum/vite-plugin-web-extension'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getManifest } from './manifest.config'

const dev = process.env.NODE_ENV === 'development'

export const outDir = dev ? 'dist/dev' : 'dist/build'

const defineOptions = {
	'process.env': {},
}

export default defineConfig({
	define: defineOptions,
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
				manualChunks: {
					vendor: ['@shazow/whatsabi', 'viem'],
          vendorx: []
				},
			},
			external: ['fs', 'path'],
		},
	},
	plugins: [
		nodePolyfills({
			globals: {
				process: true,
				Buffer: true,
				global: true,
			},
			protocolImports: true,
		}),
		tsconfigPaths(),
		webExtension({
			manifest: getManifest({ dev }),
		}),
	],
	loader: {
		'.wasm': 'file',
	},
	optimizeDeps: {
		exclude: ['@shazow/whatsabi', 'viem'],
		esbuildOptions: {
			target: 'esnext',
			supported: {
				'wasm-unsafe-eval': true,
			},
		},
	},
})
