const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");

const uuid = () => Math.random().toString(36).slice(2) + "-test";

const org = `${uuid()}${Cypress.env("ORG_NAME_SUFFIX")}`;

describe("newsfeed tests", () => {
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should see the activities", () => {

    cy.visit("/dashboard/organizations/create");
    //get input with name=title
    cy.get("input[name=title]").type(org);
    //check if input with name url has the content of "test-team"
    cy.get("input[name=name]").should("have.value", org);
    cy.get("textarea[name=description]").type("Test description");
    cy.get("button[type=submit]").click();

    cy.visit("dashboard/newsfeed");
    cy.contains(`You created a new organization ${org}`)

    cy.visit(`/dashboard/organizations/${org}/edit`)
    cy.contains('button', 'Delete Organization').click();
    cy.get("button#confirmDelete").click();

    cy.visit("dashboard/newsfeed");
    cy.contains(`You deleted the organization ${org}`)
  });
});
