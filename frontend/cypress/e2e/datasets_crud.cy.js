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
const geographies = ["afg"];
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
  before(function () {
    cy.createOrganizationViaAPI({ title: org, name: sample_org });
    cy.createDatasetViaAPI({
      name: datasetName,
      title: datasetTitle,
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
    });
  });

  beforeEach(() => {
    cy.login(ckanUserName, ckanUserPassword);
  });

  const validateDataset = () => {
    cy.get("div").should("contain", datasetTitle);
    tags.forEach((x, i) => {
      if (i === 1) cy.get("div").contains("more");
      else if (i > 1) return;
      else {
        cy.get("div").contains(x);
      }
    });
    cy.get("div").should("contain", frequency);
  };

  it("Should search the dataset by name", () => {
    cy.visit(`/search`);
    cy.get('input[placeholder="Find statistics, forecasts & studies"]').type(
      datasetTitle
    );
    cy.get("button[id=search-button]").click();
    validateDataset();
  });
  
  it("Should search the dataset by name and redirect to the dataset details page when clicked", () => {
    cy.visit(`/search`);
    cy.get('input[placeholder="Find statistics, forecasts & studies"]').type(
      datasetTitle
    );
    cy.get("button[id=search-button]").click();
    cy.get(`#dataset-search-item-${datasetTitle}`).click();
    cy.url().should('match', new RegExp(`/${org}/[\\d\\w]+`));
  });

  it("Should filter the dataset using the advanced filter and the quick filters", () => {
    cy.visit(`/search`);
    cy.get("label[id=show-advanced-filter-large-w]").scrollIntoView().click();
    cy.get("button").contains("Keyword").scrollIntoView().click();
    cy.get(`input[id=${tags[0]}]`).click();

    cy.get("button").contains("Location").scrollIntoView().click();
    cy.get("a").contains("Countries").scrollIntoView().click();
    cy.get(`input[id=${geographies[0]}]`).click();

    cy.get("button[id=quick-filter-by-startYear-endYear]").scrollIntoView().click();
    cy.get("input[placeholder=YYYY]")
    .first()
    .type(temporal_coverage_start.slice(0, 4));
    cy.get("input[placeholder=YYYY]").eq(1).type(
      temporal_coverage_end.slice(0, 4)
    );
    cy.get(`button[id=years-covered-search-button]`).click();

    cy.get("button[id=quick-filter-dropdown-button-service]").scrollIntoView().click();
    cy.get(`#quick-filter-dropdown-service-item-${services[0]}`).click();

    cy.get("button[id=quick-filter-dropdown-button-sector]").scrollIntoView().click();
    cy.get(`#quick-filter-dropdown-sector-item-${sectors[0]}`).click();

    cy.get("button[id=quick-filter-dropdown-button-mode]").scrollIntoView().click();
    cy.get(`#quick-filter-dropdown-mode-item-${modes[0]}`).click();

    validateDataset();
  });
  
  after(() => {
    cy.deleteDatasetViaAPI(datasetName);
    cy.deleteOrganizationAPI(sample_org);
  });
});
