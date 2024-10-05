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

  beforeEach(() => {
		cy.login(ckanUserName, ckanUserPassword);
	});

  it("Should search the dataset by name and go to dataset page", () => {
    
		cy.visit(`/`);

    cy.get('input[placeholder="Find statistics, forecasts & studies"]').focus().type(
      datasetTitle, { delay: 0 }
    );

		cy.wait(1500);

		const titleElement = cy.get("div").contains("h5", datasetTitle);
		const parent = titleElement.parents("a");
		titleElement.should("exist");
		
		parent.click();
		cy.get("div").should("contain", datasetTitle);

  });

	it("Should search the dataset filtered by region", () => {
    
		cy.visit(`/`);

		const input = cy.get('input[placeholder="Find statistics, forecasts & studies"]');

		input.focus().click();

		cy.wait(500);

		cy.get(`[data-value="in:a region, country or a city"]`).click();
		cy.get(`[data-value="in: Asia"]`).click();

		input.type( datasetTitle, { delay: 0 });

		cy.wait(1500);

		const titleElement = cy.get("div").contains("h5", datasetTitle);
		const parent = titleElement.parents("a");
		titleElement.should("exist");
		
		parent.click();
		cy.get("div").should("contain", datasetTitle);

  });


  it("Should store a search and redirect to search page after with search params", () => {
    
		cy.visit(`/`);

		const input = cy.get('input[placeholder="Find statistics, forecasts & studies"]');

		input.focus().click();

		cy.wait(500);

		cy.get(`[data-value="in:a region, country or a city"]`).click();
		cy.get(`[data-value="in: Asia"]`).click();

		input.type( 'Recent Search Test', { delay: 0 });

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

