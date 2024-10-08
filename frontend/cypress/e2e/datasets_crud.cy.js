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

describe("List and Search Datasets", () => {
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

  const validateDataset = () => {
    cy.get("div").should("contain", datasetTitle);
    tags.forEach((x, i) => {
      if (i === 1) cy.get("div").contains("more");
      else if (i > 1) return;
      else {
        cy.get("div").contains(x);
      }
    });
    cy.get("div").should("contain", frequency);
  };

  it("Should search the dataset by name", () => {
    cy.visit(`/search`);
    cy.get('input[placeholder="Find statistics, forecasts & studies"]').type(
      datasetTitle
    );
    cy.get("button[id=search-button]").click();
    validateDataset();
  });

  it("Should search the dataset by name and redirect to the dataset details page when clicked", () => {
    cy.visit(`/search`);
    cy.get('input[placeholder="Find statistics, forecasts & studies"]').type(
      datasetTitle
    );
    cy.get("button[id=search-button]").click();
    cy.get(`#dataset-search-item-${datasetTitle}`).click();
    cy.url().should("match", new RegExp(`/${org}/[\\d\\w]+`));
  });

  it("Should filter the dataset using the advanced filter and the quick filters", () => {
    cy.visit(`/search`);
    cy.get("#show-advanced-filter").then((x) => {
      if (x.length) {
        return cy.wrap(x).scrollIntoView().click({ force: true });
      } else
        return cy
          .get("#show-advanced-filter-large-w")
          .scrollIntoView()
          .click({ force: true });
    });

    cy.get("button").contains("Keyword").scrollIntoView().click();
    cy.get(`input[id=${tags[0]}]`).click();

    cy.get("button").contains("Location").scrollIntoView().click();
    cy.get("a").contains("Countries").scrollIntoView().click();
    cy.get(`input[id=${geographies[0]}]`).click();

    cy.get("button[id=quick-filter-by-startYear-endYear]")
      .scrollIntoView()
      .click();
    cy.get("input[placeholder=YYYY]")
      .first()
      .type(temporal_coverage_start.slice(0, 4));
    cy.get("input[placeholder=YYYY]")
      .eq(1)
      .type(temporal_coverage_end.slice(0, 4));
    cy.get(`button[id=years-covered-search-button]`).click();

    cy.get("button[id=quick-filter-dropdown-button-services]")
      .scrollIntoView()
      .click();
    cy.get(`#${services[0]}`).click();

    cy.get("button[id=quick-filter-dropdown-button-sectors]")
      .scrollIntoView()
      .click();
    cy.get(`#${sectors[0]}`).click();
    cy.get("body").click();
    cy.get("button[id=quick-filter-dropdown-button-modes]")
      .scrollIntoView()
      .click();
    cy.get(`#${modes[0]}`).scrollIntoView().click();

    validateDataset();
  });

  after(() => {
    cy.deleteDatasetViaAPI(datasetName);
    cy.deleteOrganizationAPI(sample_org);
  });
});

const ownerOrg = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}_owner_org`;
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

  it("Should create edit then delete datasets", () => {
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
      cy.contains("Successfully edited", { timeout: 10000 });
      cy.request("GET", apiUrl("package_show") + `?id=${dataset}`).then(
        (response) => {
          expect(response.status).to.eq(200);
          expect(response.body.result.title).to.eq(dataset + " edited");
          expect(response.body.result.resources).to.have.length(3);
        }
      );
      cy.visit(`/dashboard/datasets/${dataset}/edit`).then(() => {
        cy.contains("Delete Dataset").click();
        cy.wait(2000);
        cy.get("#confirmDelete").click();
        cy.visit("/dashboard/datasets").then(() => {
          cy.get("section").should("not.contain", dataset + " edited");
        });
      });
    });
  });

  after(() => {
    cy.deleteOrganizationAPI(ownerOrg);
    cy.deleteGroupAPI(topic1);
    cy.deleteGroupAPI(topic2);
  });
});
