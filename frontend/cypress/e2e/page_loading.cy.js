const pageToVisit = "/datasets";

describe('Page Loading Component', () => {
    beforeEach(() => {
      cy.visit('/'); // Change this to the initial route of your app
    });
  
    it('should show the loading bar during page transitions', () => {
      cy.get(`a[href="${pageToVisit}"]`).first().click({ force: true }); // Change the selector to match your navigation
      cy.get('.progress').should('exist');
      cy.wait(10000);
      cy.url().should('include', pageToVisit); 
      cy.get('.progress').should('not.exist'); 


    });
  });