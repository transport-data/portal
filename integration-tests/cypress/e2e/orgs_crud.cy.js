const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const topicSuffix = Cypress.env("ORG_NAME_SUFFIX");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;

describe("Create and edit orgs", () => {
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should create and edit org", () => {
    cy.visit("/dashboard/organizations/create");
    //get input with name=title
    cy.get("input[name=title]").type(org);
    //check if input with name url has the content of "test-team"
    cy.get("input[name=name]").should("have.value", org);
    cy.get("textarea[name=description]").type("Test description");
    cy.get("button[type=submit]").click();
    cy.visit(`/dashboard/organizations/${org}/edit`).then(() => {
      cy.get("input[name=title]").should("have.value", org);
      cy.get("input[name=title]").clear().type(org + " edited");
      cy.get("button[type=submit]").click();
      cy.visit(`/dashboard/organizations/${org}/edit`).then(() => {
        cy.get("input[name=title]").should("have.value", org + " edited");
        cy.contains('Delete Organization').click()
        cy.wait(2000)
        cy.get('#confirmDelete').click()
        //check if value is no longer preset
        cy.visit('/dashboard/organizations').then(() => {
          cy.get("section").should("not.contain", org + " edited");
        })
      });
    });
  });

  after(() => {
    cy.deleteOrganizationAPI(org);
  });
});

