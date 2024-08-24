import cypress from "cypress";
import path from "path";
import { CKANIntegrationTests } from "ckan-integration-tests";

const assets = new CKANIntegrationTests();

const fixturesDir = path.resolve("cypress/fixtures");
const supportFile = path.resolve("cypress/support/e2e.js");
const specs = "**/*.cy.js";

assets.options.config = {
  fixturesFolder: fixturesDir,
  supportFile: supportFile,
};
assets.options.spec = specs;

console.log(`Running tests with options: ${JSON.stringify(assets.options, null, 2)}`);

cypress
  .run(assets.options)
  .then(r => {
    console.log(r)
    assets.cleanUp()

    // if the cypress tests fail to run, log the error
    if (r.failures) {
      console.error('Could not execute cypress tests')
      console.error(r.message)
      process.exit(1)
    }
    // return exit code of 1 if any tests fail
    r.totalFailed ? process.exit(1) : process.exit(0)
  })
  .catch(e => {
    console.error(e.message)
    process.exit(1)
  });
