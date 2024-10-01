const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");
const datasetSuffix = Cypress.env("DATASET_NAME_SUFFIX");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const ownerOrg = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const topic1 = `topic_${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const topic2 = `topic_2_${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;
const dataset = `${uuid()}${datasetSuffix}`;
const apiUrl = (path) => {
  return `${Cypress.config("apiUrl")}/api/3/action/${path}`;
};

describe("Create and edit datasets", () => {
  before(() => {
    cy.createOrganizationAPI(ownerOrg, ownerOrg);
    cy.createTopicAPI(topic1, topic1);
    cy.createTopicAPI(topic2, topic2);
  });
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should dataset", () => {
    cy.visit("/dashboard/datasets/create");
    cy.get("input[name=title]").type(dataset);
    cy.get("input[name=name]").should("have.value", dataset);
    cy.contains("Select organization for dataset").click();
    cy.get("select").select(ownerOrg, { force: true });
    cy.get("button[role=combobox]").eq(1).click();
    cy.contains(topic1).click();
    cy.contains(topic2).click();
    cy.get(".tiptap.ProseMirror").eq(0).type("NOTES");
    cy.get(".tiptap.ProseMirror").eq(1).type("OVERVIEW");
    cy.get('input[type="checkbox"]').eq(1).click();
    cy.contains("Next").click();
    cy.contains("Add a source").click();
    cy.get('input[name="sources.0.title"]').type("source title");
    cy.get('input[name="sources.0.url"]').type("https://google.com");
    cy.contains("Select TDC Category").click();
    cy.get("select").eq(1).select("Public Data", { force: true });
    cy.get("button[role='combobox']").eq(2).click();
    cy.get('input[role="combobox"').type("tonnes{enter}");
    cy.contains("From...").click();
    cy.get(".lucide-chevron-left").click();
    cy.get('button[name="day"]').contains("1").click();
    cy.contains("Modes").click();
    cy.wait(1000);
    cy.contains("To...").click();
    cy.get(".lucide-chevron-left").click();
    cy.get('button[name="day"]').contains("2").click();
    cy.contains("Modes").click();
    cy.wait(1000);
    cy.get('input[name="indicator"]').type("indicator");
    cy.get('input[name="dimensioning"]').type("dimensioning");
    cy.wait(1000);
    cy.contains("Next").click().click();
    cy.get("input[type=file]").eq(0).selectFile("cypress/fixtures/sample.csv", {
      force: true,
    });
    cy.get("input[type=file]")
      .eq(1)
      .selectFile("cypress/fixtures/sample-pdf-with-images.pdf", {
        force: true,
      });
    cy.wait(5000);
    cy.get("select").eq(0).select("gfdl", { force: true });
    cy.get("button[type=submit]").click();
    cy.request("GET", apiUrl("package_show") + `?id=${dataset}`).then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body.result.title).to.eq(dataset);
        expect(response.body.result.resources).to.have.length(2);
      }
    );
    cy.visit(`/dashboard/datasets/${dataset}/edit`).then(() => {
      cy.get("input[name=title]").should("have.value", dataset);
      cy.get("input[name=title]")
        .clear()
        .type(dataset + " edited");
      cy.contains("Next").click();
      cy.contains("Next").click();
      cy.get("input[type=file]")
        .eq(0)
        .selectFile("cypress/fixtures/airtravel.csv", {
          force: true,
        });
      cy.wait(5000);
      cy.get("button[type=submit]").click();
      cy.contains('Successfully edited', { timeout: 10000 });
      cy.request("GET", apiUrl("package_show") + `?id=${dataset}`).then(
        (response) => {
          expect(response.status).to.eq(200);
          expect(response.body.result.title).to.eq(dataset + " edited");
          expect(response.body.result.resources).to.have.length(3);
        }
      );
      cy.visit(`/dashboard/datasets/${dataset}/edit`).then(() => {
        cy.contains('Delete Dataset').click()
        cy.wait(2000)
        cy.get('#confirmDelete').click()
        cy.visit('/dashboard/datasets').then(() => {
          cy.get("section").should("not.contain", dataset + " edited");
        })
      });
    });
  });

  after(() => {
    cy.deleteOrganizationAPI(ownerOrg);
    cy.deleteGroupAPI(topic1);
    cy.deleteGroupAPI(topic2);
  });
});
