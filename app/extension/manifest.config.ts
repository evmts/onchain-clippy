import pkg from './package.json';

export const getManifest = ({ dev }: { dev?: boolean }) => ({
    name: `${pkg.extension.name}${dev ? ' (dev)' : ''}`,
    description: pkg.extension.description,
    version: pkg.version,
    manifest_version: 3,
    action: {
        default_popup: "popup.html",
        default_icon: {
            '48': `icons/icon48.png`,
            '128': `icons/icon128.png`,
        },
    },
    background: {
      service_worker: 'entries/background/interceptRequests.js'
    },
    content_scripts: [
      {
        id: "inpage",
        matches: ['*://*/*'],
        js: ['entries/content/index.js'],
        run_at: 'document_start',
        world: 'MAIN',
      },
      {
        id: "inpage2",
        matches: ['*://*/*'],
        js: ['entries/content/listen.js'],
        run_at: 'document_start'
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