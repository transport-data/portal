const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");
const uuid = () => crypto.randomUUID();
const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const sample_org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const draftDatasetTitle = `${uuid()}${datasetSuffix} Draft`;
const draftDatasetName = `${uuid()}${datasetSuffix}_draft`;
const notes = `${uuid()}${datasetSuffix}`;
const tags = ["tag1", "tag2", "tag3"];
const geographies = ["cpv"];
const random = Math.random() * 100;
const tdc_category =
  random < 33 ? "public" : random < 66 ? "tdc_formatted" : "tdc_harmonized";
const services = ["passenger"];
const modes = ["heavy-rail"];
const sectors = ["active-mobility"];
const frequency = "annually";
const temporal_coverage_start = new Date(1990, 1, 1).toISOString();
const temporal_coverage_end = new Date(2005, 1, 1).toISOString();

describe("Should Create a Dataset as Draft", () => {
  before(() => {
    cy.createOrganizationViaAPI({ title: org, name: sample_org });
    cy.createDatasetViaAPI({
      name: draftDatasetName,
      title: draftDatasetTitle,
      tag_string: tags,
      owner_org: sample_org,
      notes: notes,
      geographies: geographies,
      tdc_category: tdc_category,
      temporal_coverage_start: temporal_coverage_start,
      temporal_coverage_end: temporal_coverage_end,
      is_archived: false,
      sectors: sectors,
      modes: modes,
      services: services,
      frequency: frequency,
      state: "draft",
    });
  });

  beforeEach(() => {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should find created Draft dataset", () => {
    cy.visit("/dashboard/datasets");
    cy.get(".selectable-items-list").contains("Draft").scrollIntoView().click();
    cy.get("div").contains("h2", draftDatasetTitle).should("exist");
  });

  after(() => {
    cy.deleteDatasetAPI(draftDatasetName);
    cy.deleteOrganizationAPI(sample_org);
  });
});