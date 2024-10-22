import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  pageLoadTimeout: 120000,
  experimentalMemoryManagement: true,
  env: {
    FRONTEND_URL: "",
    API_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJzNHFrb20wOVUwejhkQzEtN1ltSkc5V2FXTmpaS1F6dzU3YTJwX25JMnA0IiwiaWF0IjoxNzI2NDk0Nzk1fQ.oLxb3eIue5SYcjYNCm96iZ0C8dZ7IR-lfRU578ODzQc",
    CKAN_USERNAME: "ckan_admin",
    CKAN_PASSWORD: "test1234",
    ORG_NAME_SUFFIX: "-organization-test",
    GROUP_NAME_SUFFIX: "-group-test",
    DATASET_NAME_SUFFIX: "-dataset-test",
    REPORT_NAME_SUFFIX: "-report-test",
  },
  e2e: {
    baseUrl: "http://127.0.0.1:3000",
    apiUrl: "http://ckan:5000",
  },
});
