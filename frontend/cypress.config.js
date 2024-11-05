import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  pageLoadTimeout: 120000,
  defaultCommandTimeout: 60000,
  experimentalMemoryManagement: true,
  env: {
    FRONTEND_URL: "",
    API_KEY:
      "CKAN_API_TOKEN",
    CKAN_USERNAME: "ckan_admin",
    CKAN_PASSWORD: "test1234",
    ORG_NAME_SUFFIX: "-organization-test",
    GROUP_NAME_SUFFIX: "-group-test",
    DATASET_NAME_SUFFIX: "-dataset-test",
    REPORT_NAME_SUFFIX: "-report-test",
  },
  e2e: {
    baseUrl: "http://127.0.0.1:3000",
    apiUrl: "http://ckan-dev:5000",
  },
});
