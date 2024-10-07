const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const topicSuffix = Cypress.env("ORG_NAME_SUFFIX");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const adminUser = `${uuid()}${Cypress.env("USER_NAME_SUFFIX")}_admin`;
const adminUserPassword = "test1234";
const adminUserEmail = Math.random().toString(36).slice(2) + "@test.com";
const normalUser = `${uuid()}${Cypress.env("USER_NAME_SUFFIX")}_normal`;
const normalUserPassword = "test1234";
const normalUserEmail = Math.random().toString(36).slice(2) + "@test2.com";

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

describe("Show geography page the country list", () => {
  before(() => {
    cy.viewport(1920, 2160);
  });

  it("Should click on Argentina group and redirect to search page.", () => {
    cy.visit(`/geography`);
    cy.get("#Argentina", { timeout: 60000 }).click({ force: true });
    cy.url({ timeout: 60000 }).should("contains", "/search?country=arg");
  });
});
