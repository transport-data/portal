const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const sample_org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const datasetTile = `${uuid()}${datasetSuffix}`;
const datasetName = `${uuid()}${datasetSuffix}`;
const notes = `${uuid()}${datasetSuffix}`;
const tags = ["tag1", "tag2", "tag3"];
const geographies = ["Africa"];
const regions = ["afr"];
const random = Math.random() * 100;
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
      title: datasetTile,
      tag_string: tags,
      owner_org: sample_org,
      notes: notes,
      geographies: geographies,
      regions: regions,
      tdc_category: tdc_category,
      temporal_coverage_start: new Date(1990, 1, 1).toISOString(),
      temporal_coverage_end: new Date(2005, 1, 1).toISOString(),
      is_archived: false,
      sectors: ['active-mobility'],
      modes: ['heavy-rail'],
      services: ['passenger'],
      frequency: 'annually',
    });
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should search and list datasets", () => {
    cy.visit(`/search`);
    cy.get('input[id=":R2l4mH2:"]').type(datasetName);
    cy.get("button[id=search-button]").click();
    cy.get("div").should("contain", datasetName);
  });

  after(() => {
    cy.deleteDatasetViaAPI(datasetName);
    cy.deleteOrganizationAPI(sample_org);
  });
});
