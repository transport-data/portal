const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");
const uuid = () => Math.random().toString(36).slice(2) + "-test";

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const privateDatasetTitle = `${uuid()}${datasetSuffix} Private`;
const privateDatasetName = `${uuid()}${datasetSuffix}_private`;
const privateDatasetTitle2 = `${uuid()}${datasetSuffix} Private`;
const privateDatasetName2 = `${uuid()}${datasetSuffix}_private`;
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
const rejectMessage = uuid();
const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");

const editorUser = describe("Dataset Approval", () => {
  before(() => {
    cy.createOrganizationViaAPI({ title: org, name: org });
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
      approval_status: "pending",
      services: services,
      frequency: frequency,
      private: true,
    });
    
    cy.createDatasetViaAPI({
      name: privateDatasetName2,
      title: privateDatasetTitle2,
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
      approval_status: "pending",
      services: services,
      frequency: frequency,
      private: true,
    });
  });

  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should list pending dataset for the admin", () => {
    cy.visit("/dashboard/datasets-requests");
    cy.get("div").contains("h2", privateDatasetTitle).should("exist");
    cy.get("div").contains("Pending").should("exist");
  });

  it("Should filter the dataset using the approval status filter ", () => {
    cy.visit("/dashboard/datasets-requests");
    cy.get(
      "div.flex.max-w-full.cursor-pointer.items-center.gap-2.text-sm.text-sm"
    )
      .contains("Pending")
      .click();
    cy.get("div").contains("h2", privateDatasetTitle).should("exist");
    cy.get("div").contains("Pending").should("exist");
  });

  it("Should open a pending dataset and reject its approval and reopen the page to see the reject message at the top", () => {
    cy.visit("/dashboard/datasets-requests");
    cy.get("div").contains("h2", privateDatasetTitle).should("exist");
    cy.get(
      `a[href="/dashboard/datasets/${privateDatasetName}/edit?fromDatasetsRequests=true"]`
    ).click();
    cy.get("#rejectButton").click();
    cy.get("#rejectDatasetMessage").type(rejectMessage);
    cy.get("#confirmReject").click();

    cy.get("div").contains("h2", privateDatasetTitle).should("exist");
    cy.get("div").contains("Rejected").should("exist");

    cy.get(
      `a[href="/dashboard/datasets/${privateDatasetName}/edit?fromDatasetsRequests=true"]`
    ).click();
    cy.contains(rejectMessage)
  });

  it("Should open a pending dataset and approve it", () => {
    cy.visit("/dashboard/datasets-requests");
    cy.get("div").contains("h2", privateDatasetTitle2).should("exist");
    cy.get(
      `a[href="/dashboard/datasets/${privateDatasetName2}/edit?fromDatasetsRequests=true"]`
    ).click();
    cy.get("#approveDatasetButton").click();
    cy.get("#confirmApproval").click();

    cy.get("div").contains("h2", privateDatasetTitle2).should("exist");
    cy.get("div").contains("Approved").should("exist");
    cy.get("div").contains("Public").should("exist");
  });

  after(() => {
    cy.deleteDatasetAPI(privateDatasetName);
    cy.deleteDatasetAPI(privateDatasetName2);
    cy.deleteOrganizationAPI(org);
  });
});
