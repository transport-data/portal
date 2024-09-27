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

describe("List and Search Topic", () => {
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
    cy.createOrganizationViaAPI({ title: org, name: sample_org });
    cy.createDatasetViaAPI({
      name: datasetName,
      title: datasetTile,
      tag_string: tags,
      owner_org: org,
      notes: notes,
      geographies: geographies,
      regions: regions,
      tdc_category: tdc_category,
      temporal_coverage_start,
      temporal_coverage_end,
      url,
      overview_text,
      language,
      is_archived,
      sectors,
      modes,
      services,
      frequency,
      indicator,
      units,
      dimensioning,
      related_datasets,
      contributors,
    });
  });

  it("Should search and list topics", () => {
    //create an org so that it can be searched
    cy.visit("/dashboard/topics/create");
    cy.get("input[name=title]").type(sample_topic);
    cy.get("input[name=name]").should("have.value", sample_topic);
    cy.get("textarea[name=description]").type("Test description");
    cy.get("button[type=submit]").click();

    cy.visit("/dashboard/topics/");
    cy.get("section").should("contain", sample_topic);
    cy.get("input[name=search]").type(sample_topic);
    cy.get("section").should("not.contain", "No Topics found");
    cy.get("section").should("contain", sample_topic);

    cy.visit(`/dashboard/topics/${sample_topic}/edit`).then(() => {
      cy.get("input[name=title]").should("have.value", sample_topic);
      cy.contains("Delete Topic").click();
      cy.wait(2000);
      cy.get("#confirmDelete").click();
    });
  });
  after(() => {
    cy.deleteDatasetViaAPI(datasetName);
  });
});
