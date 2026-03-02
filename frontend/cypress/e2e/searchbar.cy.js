import searchbarConfig from "../../src/data/searchbar.config.json"
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
const geographies = ["cpv"];
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

describe("Searchbar component", () => {

	
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


  it("Should search the dataset by name and redirect to search page", () => {
    cy.visit(`/`);

    cy.get('input[placeholder="Find statistics, forecasts & studies"]')
      .focus()
      .type(datasetTitle, { delay: 0 });

    cy.contains("button", "Search").click();

    cy.url().should("include", "/search");
    cy.url().should("include", `query=${encodeURIComponent(datasetTitle)}`);
  });

  it("Should allow selecting region filter in searchbar", () => {
    cy.visit(`/`);

    cy.get('input[placeholder="Find statistics, forecasts & studies"]')
      .focus()
      .click();

    cy.contains(searchbarConfig.regions.description).click();
    cy.get(".search-bar").contains(`${searchbarConfig.regions.name}:`);
  });

  it("Should allow selecting country filter in searchbar", () => {
    cy.visit(`/`);

    cy.get('input[placeholder="Find statistics, forecasts & studies"]')
      .focus()
      .click();

    cy.contains(searchbarConfig.countries.description).click();
    cy.get(".search-bar").contains(`${searchbarConfig.countries.name}:`);
  });


  it("Should store a search and redirect to search page after with search params", () => {
    cy.visit(`/`);

    cy.get('input[placeholder="Find statistics, forecasts & studies"]')
      .focus()
      .type('Recent Search Test', { delay: 0 });

    cy.get('button').contains('Search').click();

    cy.visit(`/`);

		cy.get('input[placeholder="Find statistics, forecasts & studies"]').focus().click();
    const recentSearches = cy.get('.recent-searches');

    recentSearches.should("contain", "Recent Search Test");
  });


  after(() => {
    cy.deleteDatasetViaAPI(datasetName);
    cy.deleteOrganizationAPI(sample_org);
  });
});
