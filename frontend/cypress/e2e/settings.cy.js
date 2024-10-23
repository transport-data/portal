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
  
    cy.contains("Select").click();
  
    // Check the number of rows in the table body to determine if the user is the last one
    cy.get('table tbody tr').then(($rows) => {
      const numberOfRows = $rows.length;

      cy.get('table').contains('td', normalUser)
        .parents("tr")
        .within(() => {
          cy.contains("Remove").click();
        });

      // If this was the last user, check for the "No Sysadmin Users Found" message
      if (numberOfRows === 1) {
        cy.contains("No Sysadmin Users Found").should("be.visible");
      } else {
        // Otherwise, check that the user has been removed from the table
        cy.get('table').contains('td', normalUser).should("not.exist");
      }
    });
    cy.deleteUserApi(normalUser);

  });
});
