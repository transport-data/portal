import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  pageLoadTimeout: 120000,
  experimentalMemoryManagement: true,
  env: {
    FRONTEND_URL: "",
    API_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZTI5MkpfcjFKVnBUcmtWUXNWNld4dTE4d2tvRG9zclFuZ1FNSFZlNXdZIiwiaWF0IjoxNzI2NjcwMjY5fQ.jlz_FDtZMTlBe2lDjKek33YckgZZgAKpPhv6poZ1jmw",
    CKAN_USERNAME: "ckan_admin",
    CKAN_PASSWORD: "test1234",
    ORG_NAME_SUFFIX: "-organization-test",
    GROUP_NAME_SUFFIX: "-group-test",
    DATASET_NAME_SUFFIX: "-dataset-test",
    REPORT_NAME_SUFFIX: "-report-test",
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    apiUrl: "http://ckan-dev:5000",
  },
});
