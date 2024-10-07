const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");
const uuid = () => Math.random().toString(36).slice(2) + "-test";

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const datasetTitle = `${uuid()}${datasetSuffix}`;
const datasetName = `${uuid()}${datasetSuffix}`;
const draftDatasetTitle = `${uuid()}${datasetSuffix} Draft`;
const draftDatasetName = `${uuid()}${datasetSuffix}_draft`;
const privateDatasetTitle = `${uuid()}${datasetSuffix} Private`;
const privateDatasetName = `${uuid()}${datasetSuffix}_private`;
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
const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");

describe("Should Create a Dataset for Signed in User", () => {
  before( ()=>{
    
    //cy.createUserApi( ckanUserName, ckanUserEmail, ckanUserPassword );
    cy.createOrganizationAPI(org);
    cy.createOrganizationMemberAPI(org,ckanUserName);

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
    //draft dataset
    cy.createDatasetViaAPI({
      name: draftDatasetName,
      title: draftDatasetTitle,
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
      state:'draft'
    });
    //private dataset
    cy.createDatasetViaAPI({
      name: privateDatasetName,
      title: privateDatasetTitle,
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
      private:true
    });
  });

  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should list created Dataset", () => {
    cy.visit("/dashboard/datasets/my-organization");
    cy.get('div').contains('h2', datasetTitle).should('exist')
  });

  it("Should filter the dataset using the advanced filter ", () => {
    cy.visit("/dashboard/datasets/my-organization");
    cy.get("button").contains("Keyword").scrollIntoView().click();
    cy.get(`input[id=${tags[0]}]`).click();
    cy.get("button").contains("Location").scrollIntoView().click();
    cy.get("a").contains("Countries").scrollIntoView().click();
    cy.get(`input[id=${geographies[0]}]`).click();
    cy.get('div').contains('h2', datasetTitle).should('exist')
  });

  it("Should filter Public datasets ", () => {
    cy.visit("/dashboard/datasets/my-organization");
    cy.get(".selectable-items-list").contains("Public").scrollIntoView().click();
    cy.get('div').contains('h2', draftDatasetTitle).should('not.exist')
    cy.get('div').contains('h2', privateDatasetTitle).should('not.exist')
    cy.get('div').contains('h2', datasetTitle).should('exist')
  });

  it("Should filter Private datasets ", () => {
    cy.visit("/dashboard/datasets/my-organization");
    cy.get(".selectable-items-list").contains("Private").scrollIntoView().click();
    cy.get('div').contains('h2', draftDatasetTitle).should('not.exist')
    cy.get('div').contains('h2', privateDatasetTitle).should('exist')
    cy.get('div').contains('h2', datasetTitle).should('not.exist')
  });

  it("Should filter Draft datasets ", () => {
    cy.visit("/dashboard/datasets/my-organization");
    cy.get(".selectable-items-list").contains("Draft").scrollIntoView().click();
    cy.get('div').contains('h2', draftDatasetTitle).should('exist')
    cy.get('div').contains('h2', datasetTitle).should('not.exist')
    cy.get('div').contains('h2', privateDatasetTitle).should('not.exist')
  });


  after(() => {
    cy.deleteDatasetAPI(datasetName);
    cy.deleteDatasetAPI(draftDatasetName);
    cy.deleteDatasetAPI(privateDatasetName);
    cy.deleteOrganizationAPI(org);
   // cy.deleteUserApi(ckanUserName);
  });
})