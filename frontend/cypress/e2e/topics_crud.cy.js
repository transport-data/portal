const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const topicSuffix = Cypress.env("ORG_NAME_SUFFIX");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const parentTopic = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const topic = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const sample_topic = `${uuid()}_2_${Cypress.env("ORG_NAME_SUFFIX")}`;

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
          cy.get("section").should("not.contain", topic + " edited");
        })
      });
    });
  });

  after(() => {
    cy.deleteGroupAPI(parentTopic);
    cy.deleteGroupAPI(topic);
  });
});

describe("List and Search Topic", () => {
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should search and list topics", () => {
    //create an org so that it can be searched
    cy.visit("/dashboard/topics/create");
    cy.get("input[name=title]").type(sample_topic);
    cy.get("input[name=name]").should("have.value", sample_topic);
    cy.get("textarea[name=description]").type("Test description");
    cy.get("button[type=submit]").click();
    
    cy.visit("/dashboard/topics/");
    cy.get("input[name=search]").type(sample_topic);
    cy.get("section").should("not.contain", "No Topics found");
    cy.get("section").should("contain", sample_topic);

    cy.visit(`/dashboard/topics/${sample_topic}/edit`).then(() => {
      cy.get("input[name=title]").should("have.value", sample_topic);
      cy.contains('Delete Topic').click()
      cy.wait(2000)
      cy.get('#confirmDelete').click()
    });
  });
  after(() => {
    cy.deleteGroupAPI(sample_topic);
  });
});

