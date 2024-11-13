const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");

describe("onboarding flow", () => {
  beforeEach(function () {
    cy.login(ckanUserName, ckanUserPassword);
  });

  it(
    "Should follow topics, locations and organizations",
    {
      retries: {
        runMode: 5,
        openMode: 0,
      },
    },
    () => {
      cy.visit("/onboarding");
      cy.contains(
        "Select locations, topics and organisations you want to follow"
      );

      // button should be disabled
      //    cy.get('button[type="submit"]')
      //      .should('be.visible')
      //      .and('be.disabled')

      cy.get(".flex.flex-wrap.items-center.gap-2").then(($div) => {
        // Check if locations exist
        const $spans = $div.find("span");

        if ($spans.length > 0) {
          cy.wrap($spans).first().click();

          // button should not be disabled
          cy.get('button[type="submit"]')
            .should("be.visible")
            .and("not.be.disabled")
            .click();

          cy.wait(2000);
          cy.contains("Find your organisation");
        } else {
          cy.log("No Locations Found.");
        }
      });
    }
  );

  it("Should request organization participation", () => {
    cy.visit("/onboarding");
    cy.contains(
      "Select locations, topics and organisations you want to follow"
    );

    // skip to next step
    cy.contains("Skip").click();
    cy.contains("Find your organisation");

    // button should be disabled
    //    cy.get('button[type="submit"]')
    //    .should('be.visible')
    //    .and('be.disabled')

    cy.get('button[type="button"]').click();
    // type organization name
    cy.get('input[placeholder="Select an organisation"]').type(
      "Your Organisation Name"
    );

    // request new org
    cy.contains("Request a new organisation").click();
    cy.wait(2000);
    cy.contains("Create a new organisation");
  });

  it("Should invite users", () => {
    cy.visit("/onboarding");
    cy.contains(
      "Select locations, topics and organisations you want to follow"
    );

    // skip to next step
    cy.contains("Invite colleagues").click();
    cy.contains("Invite friends & colleagues");

    // type invalid email
    cy.get('input[placeholder="name1@email.com; name2@email.com;"]').type(
      "invalid_email"
    );

    cy.contains("Invalid email");

    // type valid email
    cy.get('input[placeholder="name1@email.com; name2@email.com;"]').type(
      "sample@example.com"
    );
  });
});
