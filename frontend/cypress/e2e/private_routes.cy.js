const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");

describe("Test private routes", () => {

  it("should go to login if user not authenticated", () => {
    cy.visit(`/dashboard`);
    cy.url().should("include", "/auth/signin");
      
  });

  it("should go to dashboard if user is authenticated", () => {
    cy.login(ckanUserName, ckanUserPassword);
    cy.visit(`/dashboard`);
    cy.get("h1").should("contain", "Dashboard")
  });

});
