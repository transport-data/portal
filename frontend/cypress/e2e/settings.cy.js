const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");

const uuid = () => Math.random().toString(36).slice(2) + "-test";
const sampleToken = `${uuid}-sample-token`

const normalUser = `${uuid()}${Cypress.env("USER_NAME_SUFFIX")}_normal`;
const normalUserPassword = "test1234";
const normalUserEmail = Math.random().toString(36).slice(2) + "@test2.com";

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

    cy.contains("Are you sure you want to revoke Token").should("be.visible");
    cy.get('button').contains('Yes').click({ force: true });

    cy.contains(sampleToken).should("not.exist");
  });

  it("Should Manage Sysadmins", () => {

    cy.createUserApi(normalUser, normalUserEmail, normalUserPassword);
    
    cy.visit("/dashboard/settings");

    cy.contains("Sysadmins").click();

    cy.contains("New Sysadmin").click();
    cy.contains("Add Sysadmins")

    cy.get('input[placeholder="Select a User"]').type(normalUser);
    cy.get('[role="option"]').contains(normalUser).click();

    cy.contains("Select").click()

    cy.get('table').contains('td', normalUser).should('be.visible');

    cy.get('table').contains('td', normalUser)
      .parents("tr")
      .within(() => {
        cy.contains("Remove").click();
      });
  
    cy.get('table').contains('td', normalUser).should("not.exist");
    cy.deleteUserApi(normalUser);

  });
});
