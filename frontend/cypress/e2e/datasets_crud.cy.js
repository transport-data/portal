const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => crypto.randomUUID();

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const sample_org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const datasetTitle = `${uuid()}${datasetSuffix}`;
const datasetName = `${uuid()}${datasetSuffix}`;
const notes = `${uuid()}${datasetSuffix}`;
const tags = ["tag1", "tag2", "tag3"];
const geographies = ["Africa"];
const regions = ["afr"];
const random = Math.random() * 100;
const services = ["passenger"];
const modes = ["heavy-rail"];
const sectors = ["active-mobility"];
const frequency = "annually";
const temporal_coverage_start = new Date(1990, 1, 1).toISOString();
const temporal_coverage_end = new Date(2005, 1, 1).toISOString();
const tdc_category =
  random < 33
    ? "public"
    : random > 33 && random < 66
    ? "tdc_formatted"
    : "tdc_harmonized";

describe("List and Search Datasets", () => {
  beforeEach(function () {
    cy.createOrganizationViaAPI({ title: org, name: sample_org });
    cy.createDatasetViaAPI({
      name: datasetName,
      title: datasetTitle,
      tag_string: tags,
      owner_org: sample_org,
      notes: notes,
      geographies: geographies,
      regions: regions,
      tdc_category: tdc_category,
      temporal_coverage_start: temporal_coverage_start,
      temporal_coverage_end: temporal_coverage_end,
      is_archived: false,
      sectors: sectors,
      modes: modes,
      services: services,
      frequency: frequency,
    });
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should search and list datasets", () => {
    cy.visit(`/search`);
    cy.get('input[placeholder="Find statistics, forecasts & studies"]').type(
      datasetTitle
    );
    cy.get("button[id=search-button]").click();
    cy.get("div").should("contain", datasetTitle);
    cy.get("div").should("contain", tags);
    cy.get("div").should("contain", frequency);
  });

  it("Should be able to filter the dataset using the advanced filter", () => {
    cy.visit(`/search`);
    cy.get("label[id=show-advanced-filter]").click();
    // cy.get("div").should("contain", datasetTitle);
    // cy.get("div").should("contain", tags);
    // cy.get("div").should("contain", frequency);
  });

  after(() => {
    cy.deleteDatasetViaAPI(datasetName);
    cy.deleteOrganizationAPI(sample_org);
  });
});
