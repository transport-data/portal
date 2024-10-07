const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const topicSuffix = Cypress.env("ORG_NAME_SUFFIX");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const parentTopic = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const topic = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}_org`;
const sample_topic = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}b`;

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

describe("List and Search Topic (Dashboard)", () => {
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
    cy.get("section").should("contain", sample_topic);
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

const publicTopic = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}_public`;
const publicTopic2 = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}_public_2`;
const datasetName = `${uuid()}_dataset`
const datasetName2 = `${uuid()}_dataset_2`
const datasetName3 = `${uuid()}_dataset_3`

describe("List topics (Public)", () => {
  before(() => {
    cy.createOrganizationViaAPI({ title: org, name: org });
    cy.createTopicAPI(publicTopic, publicTopic);
    cy.createTopicAPI(publicTopic2, publicTopic2);
    cy.createDatasetViaAPI({
      name: datasetName,
      title: 'Dataset belonging to topic 1',
      owner_org: org,
      is_archived: false,
      notes: 'x',
      tdc_category: 'public',
      topics: [publicTopic],
    });
    cy.createDatasetViaAPI({
      name: datasetName2,
      title: 'Dataset belonging to topic 2',
      owner_org: org,
      notes: 'x',
      tdc_category: 'public',
      is_archived: false,
      topics: [publicTopic2],
    });
    cy.createDatasetViaAPI({
      name: datasetName3,
      title: 'TDC Harmonized Dataset',
      owner_org: org,
      notes: 'x',
      tdc_category: 'tdc_harmonized',
      is_archived: false,
      topics: [],
    });
  });
  it("Should search and list topics", () => {
    //create an org so that it can be searched
    cy.visit("/datasets");
    cy.contains(publicTopic).should("exist");
    cy.contains(publicTopic2).should("exist");
    cy.contains('TDC Harmonized Dataset').should("exist");
    cy.contains('Dataset belonging to topic 1').should("exist");
    cy.contains('Dataset belonging to topic 2').should("exist");
    cy.get(`#show_all_${publicTopic}`).click({ force: true });
    cy.wait(2000)
    cy.contains('Dataset belonging to topic 1').should("exist");
    cy.contains('Dataset belonging to topic 2').should("not.exist");
  });
  after(() => {
    cy.deleteDatasetViaAPI(datasetName);
    cy.deleteDatasetViaAPI(datasetName2);
    cy.deleteOrganizationAPI(org);
    cy.deleteGroupAPI(publicTopic);
    cy.deleteGroupAPI(publicTopic2);
  });
  })
