describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#root button').click();
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').click();
    cy.get('#password').type('1234');
    cy.get('#root button[type="submit"]').click();
    cy.wait(2000)
    cy.get('#root button:nth-child(3)').click();
    cy.wait(2000)
    cy.get('#\\:r4l\\:').click();
    cy.get('#\\:r4l\\:').type('james{enter}');
  })
})