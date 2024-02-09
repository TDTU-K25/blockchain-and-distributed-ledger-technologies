/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "next/router": "next-router-mock",
    };
    return config;
  },
};

module.exports = {
  ...nextConfig,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
};
