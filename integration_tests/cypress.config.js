import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  pageLoadTimeout: 120000,
  includeShadowDom: true,
  env: {
    FRONTEND_URL: '',
    API_KEY: process.env.API_KEY,
    CKAN_USERNAME: process.env.CKAN_USERNAME,
    CKAN_PASSWORD: process.env.CKAN_PASSWORD,
    ORG_NAME_SUFFIX: '_organization_test',
    DATASET_NAME_SUFFIX: '_dataset_test',
  },
  e2e: {
    baseUrl: process.env.baseUrl,
  },
})
