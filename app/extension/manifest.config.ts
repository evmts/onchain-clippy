import pkg from './package.json';

export const getManifest = ({ dev }: { dev?: boolean }) => ({
    name: `${pkg.extension.name}${dev ? ' (dev)' : ''}`,
    description: pkg.extension.description,
    version: pkg.version,
    manifest_version: 3,
    action: {
        default_popup: "src/popup.html",
        default_icon: {
            '48': `icons/icon48.png`,
            '128': `icons/icon128.png`,
        },
    },
    content_scripts: [
      {
        id: "inpage",
        matches: ['*://*/*'],
        js: ['src/entries/content/index.ts'],
        run_at: 'document_start',
        world: 'MAIN',
      }
    ],
    icons: {
        '48': `icons/icon48.png`,
        '128': `icons/icon128.png`,
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
        'webRequest'
      ]
 });