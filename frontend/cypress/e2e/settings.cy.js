const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");

const uuid = () => Math.random().toString(36).slice(2) + "-test";
const sampleToken = `${uuid}-sample-token`

describe("Settings Page", () => {
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it("Should Add and Revoke API keys", () => {
    
    cy.visit("/dashboard/settings");

    cy.contains("New Token").click();
    cy.contains("Create a new API Token")

    cy.get('input[placeholder="api_token"]').type(sampleToken);

    cy.contains("Create Token").click()

    cy.contains(sampleToken).should("be.visible")

    cy.contains(sampleToken)
    .parents(".flex.justify-between")
    .within(() => {
      cy.get(".lucide-trash2").click();
    });

    cy.contains(sampleToken).should("not.exist");
    
  });
});
