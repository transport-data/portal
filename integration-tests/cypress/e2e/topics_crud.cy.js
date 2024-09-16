const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const topicSuffix = Cypress.env("ORG_NAME_SUFFIX");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const parentTopic = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const topic = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;

describe("Create and edit topics", () => {
  before(() => {
    cy.createGroupAPI(parentTopic);
  });
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should create and edit topic", () => {
    cy.visit("/dashboard/topics/create");
    //get input with name=title
    cy.get("input[name=title]").type(topic);
    //check if input with name url has the content of "test-team"
    cy.get("input[name=name]").should("have.value", topic);
    cy.get("textarea[name=description]").type("Test description");
    cy.get("button[type=submit]").click();
    cy.visit(`/dashboard/topics/${topic}/edit`).then(() => {
      cy.get("input[name=title]").should("have.value", topic);
      cy.get("input[name=title]").clear().type(topic + " edited");
      cy.get("button[type=submit]").click();
      cy.visit(`/dashboard/topics/${topic}/edit`).then(() => {
        cy.get("input[name=title]").should("have.value", topic + " edited");
        cy.contains('Delete Topic').click()
        cy.wait(2000)
        cy.get('#confirmDelete').click()
        //check if value is no longer preset
        cy.visit('/dashboard/topics').then(() => {
          cy.get("table").should("not.contain", topic + " edited");
        })
      });
    });
  });

  after(() => {
    cy.deleteGroupAPI(parentTopic);
    cy.deleteGroupAPI(topic);
  });
});

