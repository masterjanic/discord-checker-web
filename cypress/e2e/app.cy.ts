describe("Navigation", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("/");
  });

  it("Should redirect to the login page when not logged in", () => {
    cy.visit("/dashboard");
    cy.url().should("not.include", "/dashboard");
  });
});
