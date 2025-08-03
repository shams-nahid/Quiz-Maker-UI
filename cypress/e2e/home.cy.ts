describe("Home Page E2E", () => {
  it("should display and interact with counter", () => {
    cy.visit("http://localhost:3000");

    // Check if counter starts at 0
    cy.contains("Counter: 0").should("be.visible");

    // Click increment button
    cy.contains("+").click();
    cy.contains("Counter: 1").should("be.visible");

    // Click decrement button
    cy.contains("-").click();
    cy.contains("Counter: 0").should("be.visible");
  });
});
