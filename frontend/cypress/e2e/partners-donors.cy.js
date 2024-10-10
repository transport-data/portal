
import partners from '../../src/data/partners.json';


describe("List partners and donors", () => {
  const firstPartner = partners[0];
  
  it("show partner title, image and website", () => {
    
    cy.visit(`/partners`);
    
    cy.get('.grid img').should('have.attr', 'src', firstPartner.image) 
    cy.contains(firstPartner.name) 
    cy.get(`.grid a[href="${firstPartner.url}"]`) 
      
  });


});
