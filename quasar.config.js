const { configure } = require('quasar/wrappers');
const dotenv = require('dotenv');

dotenv.config();

module.exports = configure((/* ctx */) => ({
  boot: ['axios', 'pinia'],
  css: ['app.scss'],
  extras: [
    // 'ionicons-v4',
    // 'mdi-v7',
    'fontawesome-v6',
    // 'eva-icons',
    // 'themify',
    // 'line-awesome',
    // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
    'roboto-font',
    'material-icons',
  ],
  build: {
    env: process.env,
    target: {
      browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
      node: 'node20',
    },
    vueRouterMode: 'history',
    vitePlugins: [
      [
        'vite-plugin-checker',
        {
          vueTsc: {
            tsconfigPath: 'tsconfig.vue-tsc.json',
          },
          eslint: {
            lintCommand: 'eslint "./**/*.{js,ts,mjs,cjs,vue}"',
          },
        },
        { server: false },
      ],
    ],
  },
  devServer: {
    open: true,
  },
  framework: {
    config: {},
    lang: 'pt-BR',
    plugins: ['Notify', 'Dialog', 'Meta', 'Loading', 'LocalStorage', 'Cookies'],
  },
  animations: 'all',
  ssr: {
    pwa: false,
    prodPort: 3000,
    middlewares: ['render'],
  },
  pwa: {
    workboxMode: 'generateSW',
    injectPwaMetaTags: true,
    swFilename: 'sw.js',
    manifestFilename: 'manifest.json',
    useCredentialsForManifestTag: false,
  },
  cordova: {},
  capacitor: {
    hideSplashscreen: true,
  },
  electron: {
    inspectPort: 5858,
    bundler: 'packager',
    packager: {},
    builder: {
      appId: 'themplus-frontend',
    },
  },
  bex: {
    contentScripts: ['my-content-script'],
  },
}));
