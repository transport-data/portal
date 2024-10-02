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

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe("Create and edit org members", () => {
  before(() => {
    cy.createOrganizationAPI(org);
    cy.createUserApi(adminUser, adminUserEmail, adminUserPassword);
    cy.createUserApi(normalUser, normalUserEmail, normalUserPassword);
    cy.createOrganizationMemberAPI(org, adminUser, "admin");
  });
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should create and edit org", () => {
    cy.visit(`/dashboard/organizations/${org}/members`);
    cy.contains(adminUser);
    cy.contains("admin");
    cy.contains("Add member").click();
    cy.get("button[role=combobox]").eq(0).click();
    cy.contains(`${normalUser} - ${normalUserEmail}`).click();
    cy.get('#userLabel').click();
    cy.get('form').get('select').eq(1).select('editor', { force: true })
    cy.get("button[type=submit]").click({ force: true });
    cy.visit(`/dashboard/organizations/${org}/members`).then(() => {
      cy.contains(normalUser);
      cy.contains("editor");
    });
  });

  after(() => {
    cy.deleteOrganizationAPI(org);
    cy.deleteUserApi(adminUser);
    cy.deleteUserApi(normalUser);
  });
});
