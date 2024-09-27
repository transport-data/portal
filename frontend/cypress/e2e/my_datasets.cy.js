const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const sample_org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const datasetTitle = `${uuid()}${datasetSuffix}`;
const datasetName = `${uuid()}${datasetSuffix}`;
const notes = `${uuid()}${datasetSuffix}`;
const tags = ["tag1", "tag2", "tag3"];
const geographies = ["cpv"];
const regions = ["afr"];
const random = Math.random() * 100;
const tdc_category =
  random < 33
    ? "public"
    : random > 33 && random < 66
    ? "tdc_formatted"
    : "tdc_harmonized";

describe("Should Create a Dataset for Signed in User", () => {
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
    cy.createOrganizationAPI(org );
    cy.createDatasetAPI(org, datasetName, {
      title: datasetTitle,
      tag_string: tags,
      notes: notes,
      geographies: geographies,
      //regions: regions,
      tdc_category: tdc_category,

    });
  });

  it("Should list created Dataset", () => {
    cy.visit("/dashboard/datasets");

    cy.get('.dataset-card h2').each(($el) => {
      if ($el.text() === datasetTitle) {
        cy.wrap($el).should('have.text', datasetTitle);
        return false; 
      }
    });

  });

  after(() => {
    cy.deleteDatasetAPI(datasetName);
  });

})