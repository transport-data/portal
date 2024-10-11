const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => crypto.randomUUID();

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const sample_org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const datasetTitle = `${uuid()}${datasetSuffix}`;
const datasetName = `${uuid()}${datasetSuffix}`;

describe("Dataset individual page", () => {
  before(function () {
    cy.createOrganizationViaAPI({ title: org, name: sample_org, email: 'example@org.com' });
    cy.createDatasetViaAPI({
      id: uuid(),
      name: datasetName,
      title: datasetTitle,
      owner_org: sample_org,
      notes: "<p>TEST DESCRIPTION</p>",
      overview_text: "<p>TEST OVERVIEW</p>",
      topics: [],
      is_archived: false,
      tags: [{ name: "tag 1" }],
      geographies: [],
      userRepresents: false,
      language: "pt",
      frequency: "annually",
      tdc_category: "tdc_harmonized",
      introduction_text: "<p>EXAMPLE INTRODUCTION</p>",
      modes: ["cars"],
      temporal_coverage_start: "2024-10-01",
      temporal_coverage_end: "2024-10-31",
      geographies: [],
      license_id: "gfdl",
      private: false,
      indicators: ["indicator 1"],
      units: ["tonnes"],
      dimensioning: "dimensioning",
      url: "https://google.com",
      data_provider: "data provider",
      data_access: "data access",
      resources: [
        {
          name: "Sample Data",
          url_type: "link",
          format: "csv",
          size: 116807,
          type: "data",
          resource_type: "data",
          url: "https://google.com",
        },
        {
          name: "Sample Doc",
          url_type: "llink",
          format: "pdf",
          size: 116807,
          type: "documentation",
          resource_type: "documentation",
          url: "https://google.com",
        },
      ],
    });
  });

  it("Should show the individual page", () => {
    cy.visit(`/@${sample_org}/${datasetName}`);
    cy.contains(datasetTitle)
    cy.contains('TDC Harmonized')
    cy.contains('EXAMPLE INTRODUCTION')
    cy.contains('Share')
    cy.contains('Contact the contributor')
    cy.get('#metadata').click({ force: true })
    cy.contains('Overview', { timeout: 10000})
    cy.contains('TEST OVERVIEW')
    cy.contains('tag 1')
    cy.contains('GNU Free Documentation License 1.3 with no cover texts and no invariant sections')
    cy.get('#downloads').click({ force: true })
    cy.contains('Sample Data')
    cy.contains('Sample Doc')
  });

  after(() => {
    cy.deleteDatasetViaAPI(datasetName);
    cy.deleteOrganizationAPI(sample_org);
  });
});
