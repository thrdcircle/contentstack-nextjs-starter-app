const withPWA = require('next-pwa');

const config = {
  publicRuntimeConfig: { // Will be available on both server and client
    CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
    CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
    CONTENTSTACK_REGION: process.env.CONTENTSTACK_REGION,
    CONTENTSTACK_MANAGEMENT_TOKEN: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    CONTENTSTACK_CUSTOM_HOST: process.env.CONTENTSTACK_CUSTOM_HOST,
    CONTENTSTACK_APP_HOST: process.env.CONTENTSTACK_APP_HOST,
  },
  devIndicators: {
    autoPrerender: false,
  },
  pwa: {
    dest: 'public',
  },
};
module.exports = process.env.NODE_ENV === 'development' ? config : withPWA(config);
