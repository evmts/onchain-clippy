import pkg from './package.json'

export const getManifest = ({ dev }: { dev?: boolean }) => ({
	name: `${pkg.extension.name}${dev ? ' (dev)' : ''}`,
	description: pkg.extension.description,
	version: pkg.version,
	manifest_version: 3,
	action: {
		default_popup: 'src/popup.html',
		default_icon: {
			'48': 'icons/icon48.png',
			'128': 'icons/icon128.png',
		},
	},
	background: {
		service_worker: 'src/entries/background/interceptRequests.ts',
	},
	content_scripts: [
		{
			id: 'inpage',
			matches: ['*://*/*'],
			js: ['src/entries/content/index.ts'],
			run_at: 'document_start',
			world: 'MAIN',
		},
		{
			id: 'inpage2',
			matches: ['*://*/*'],
			js: ['src/entries/content/listen.ts'],
			run_at: 'document_start',
		},
	],
	icons: {
		'48': 'icons/icon48.png',
		'128': 'icons/icon128.png',
	},
	permissions: [
		'activeTab',
		'contextMenus',
		'declarativeNetRequest',
		'scripting',
		'sidePanel',
		'storage',
		'tabs',
		'unlimitedStorage',
		'webRequest',
	],
	content_security_policy: {
		extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
		sandbox:
			"sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'",
	},
})
