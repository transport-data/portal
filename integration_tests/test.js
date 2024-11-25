import cypress from "cypress";
import { CKANIntegrationTests } from "ckan-integration-tests";

const assets = new CKANIntegrationTests();
assets.addAllSpecs();

cypress
  .run(assets.options)
  .then(console.log)
  .catch(console.error)
  .finally(() => assets.cleanUp());