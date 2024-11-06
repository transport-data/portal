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


describe("newsfeed tests", () => {

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


  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });


  it("should list orgs created by user", ()=>{
    cy.visit("/dashboard/newsfeed");
    cy.get(".selectable-items-list").contains("Organizations").click();
    cy.get('p.text-base').contains(`You created a new organization ${org}`);
  });

  it("should list dataset created by user", ()=>{
    cy.visit("/dashboard/newsfeed");
    cy.get(".selectable-items-list").contains("Datasets").click();
    cy.get('p.text-base').contains(`You created a new dataset ${datasetTitle}`);
  });

  it("should list dataset deleted by user", ()=>{
    cy.deleteDatasetAPI(datasetName);
    cy.visit("/dashboard/newsfeed");
    cy.get(".selectable-items-list").contains("Datasets").click();
    cy.get('p.text-base').contains(`You deleted the dataset ${datasetTitle}`);
  });

  it("should list organization deleted by user", ()=>{
    cy.deleteOrganizationAPI(sample_org);
    cy.visit("/dashboard/newsfeed");
    cy.get(".selectable-items-list").contains("Organizations").click();
    cy.get('p.text-base').contains(`You deleted the organization ${org}`);
  });

  

});
