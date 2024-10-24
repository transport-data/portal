const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const datasetTitle = `${uuid()}${datasetSuffix}`;
const datasetName = `${uuid()}${datasetSuffix}`;
const notes = `${uuid()}${datasetSuffix}`;
const tags = ["tag1", "tag2", "tag3"];
const geographies = ["cpv"];
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
const temporal_coverage_start = "1999-01-01"
const temporal_coverage_end = "2020-01-01"


describe("Follow/Unfollow Datasets, Organization and Geographies", () => {
  before( ()=>{
    cy.createOrganizationViaAPI({ title: org, name: org }); 
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
    

  });

  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
    
  });

  

  it("Follow dataset", () => {
    cy.visit(`/${org}/${datasetName}`);
    cy.get('.follow-btn').click();
    const datasetFollowItem = cy.get('[role="menuitemcheckbox"]').first()
    datasetFollowItem.click();
    datasetFollowItem.should('have.attr', 'aria-checked', 'true');
  });

  it("Follow organization", () => {
    cy.visit(`/${org}/${datasetName}`);
    cy.get('.follow-btn').click();
    const orgFollowItem = cy.get('[role="menuitemcheckbox"]').eq(1)
    orgFollowItem.click();
    orgFollowItem.should('have.attr', 'aria-checked', 'true');
  });

  it("Follow region", () => {
    cy.visit(`/${org}/${datasetName}`);
    cy.get('.follow-btn').click();
    const regionFollowItem = cy.get('[role="menuitemcheckbox"]').contains('Cabo Verde')
    regionFollowItem.click();
    regionFollowItem.should('have.attr', 'aria-checked', 'true');
  });

  
  

});
