/* eslint-disable import/no-extraneous-dependencies, import/extensions */
import { fileURLToPath } from 'node:url';

import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createJiti from 'jiti';
import withNextIntl from 'next-intl/plugin';
import TerserPlugin from 'terser-webpack-plugin'; // Import TerserPlugin

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/libs/Env');

const withNextIntlConfig = withNextIntl('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
export default withSentryConfig(
  bundleAnalyzer(
    withNextIntlConfig({
      eslint: {
        dirs: ['.'],
      },
      poweredByHeader: false,
      reactStrictMode: true,
      experimental: {
        serverComponentsExternalPackages: ['@electric-sql/pglite'],
      },
      webpack(config, { isServer }) {
        if (!isServer) {
          // Modify Terser configuration
          // eslint-disable-next-line no-param-reassign
          config.optimization.minimizer = [
            new TerserPlugin({
              terserOptions: {
                output: {
                  ascii_only: true, // Ensure output is ASCII only
                },
                // Add other Terser options if needed
              },
            }),
          ];
        }
        return config;
      },
    }),
  ),
  {
    // Sentry configuration
    org: 'appointify',
    project: 'javascript-nextjs',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
    telemetry: false,
  },
);
