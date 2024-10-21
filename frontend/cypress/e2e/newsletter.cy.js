
describe("Newsletter Test", () => {
  it("Should see newsletter button", () => {
    cy.visit("/");
    const btn = cy.get(".tdc-newsletter");
    btn.should('exist');
  });
});
