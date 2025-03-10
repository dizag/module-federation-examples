const { withFederatedSidecar } = require('@module-federation/nextjs-ssr/bundle');
// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const remotes = isServer => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    home: `home@http://localhost:3001/_next/static/${location}/remoteEntry.js?${Date.now()}`,
    shop: `shop@http://localhost:3002/_next/static/${location}/remoteEntry.js?${Date.now()}`,
    checkout: `checkout@http://localhost:3000/_next/static/${location}/remoteEntry.js?${Date.now()}`,
  };
};
module.exports = withFederatedSidecar(
  {
    name: 'checkout',
    filename: 'static/chunks/remoteEntry.js',
    exposes: {
      './title': './components/exposedTitle.js',
      './checkout': './async-pages/checkout',
      './pages-map': './pages-map.js',
    },
    remotes,
    shared: {
      react: {
        requiredVersion: false,
        singleton: true,
      },
    },
  },
  {
    experiments: {
      flushChunks: true,
      hot:true
    },
  },
)({
  webpack5: true,
  webpack(config, options) {
    config.module.rules.push({
      test: /_app.js/,
      loader: '@module-federation/nextjs-ssr/lib/federation-loader.js',
    });

    return config;
  },
});
