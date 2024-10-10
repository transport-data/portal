const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");
const uuid = () => Math.random().toString(36).slice(2) + "-test";

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
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

const services = ["passenger"];
const modes = ["heavy-rail"];
const sectors = ["active-mobility"];
const frequency = "annually";
const temporal_coverage_start = new Date(1990, 1, 1).toISOString();
const temporal_coverage_end = new Date(2005, 1, 1).toISOString();

const ckanUserSuffix = uuid();

describe("Should test home page integration with ckan", () => {
  before( ()=>{
    cy.createOrganizationViaAPI({ title: org, name: org });
    //create public dataset
    cy.createDatasetViaAPI({
      name: datasetName,
      title: datasetTitle,
      tag_string: tags,
      owner_org: org,
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
   
  } )

  it("Should list created Dataset in home page", () => {
    cy.visit("/");
    cy.get('.dataset-card').contains('h4', datasetTitle).should('exist')
  });


  after(() => {
    cy.deleteDatasetAPI(datasetName);
    cy.deleteOrganizationAPI(org);
  });
})
