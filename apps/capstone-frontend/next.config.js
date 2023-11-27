//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },

  compiler: {
    // For other options, see https://nextjs.org/docs/architecture/nextjs-compiler#emotion
    emotion: true,
    removeConsole: false,
  },
  transpilePackages: ['mui-file-input'],
  rewrites: async () => [
    {
      //rewrite /api/admin/:path* to localhost:3000/:path* - the request will only make it to rewrite if the middleware sees an admin session
      source: '/api/admin/:path*',
      destination: 'http://localhost:3000/:path*',
    },
    {
      //rewrite /api/:path* to localhost:3000/:path* - the request will only make it to rewrite if the middleware sees a valid session
      source: '/api/:path*',
      destination: 'http://localhost:3000/:path*',
    },
  ],
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
