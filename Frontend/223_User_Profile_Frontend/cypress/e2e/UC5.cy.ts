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
    cy.get('[data-cy="filter-first-name"]').click();
    cy.get('[data-cy="filter-first-name"]').type('j')
    cy.wait(2000)
    cy.get('[data-cy="filter-first-name"]').clear();
    cy.get('[data-cy="filter-last-name"]').click();
    cy.get('[data-cy="filter-last-name"]').type('b');
    cy.wait(2000)
    cy.get('[data-cy="filter-last-name"]').clear();
    cy.get('[data-cy="filter-min-age"]').click();
    cy.get('[data-cy="filter-min-age"]').type('25');
    cy.wait(2000)
    cy.get('[data-cy="filter-min-age"]').clear();
    cy.get('[data-cy="filter-max-age"]').click();
    cy.get('[data-cy="filter-max-age"]').type('15');
    cy.wait(2000)
    cy.get('[data-cy="filter-max-age"]').clear();
    cy.scrollTo(0, 1500)
    cy.wait(2000)
    cy.get('#root div.css-y1erhp button[tabindex="0"]').click();
    cy.wait(500)
    cy.scrollTo(0, 1500)
    cy.wait(2000)
    cy.get('[data-cy="filter-first-name"]').click();
    cy.get('[data-cy="filter-first-name"]').type('firstname27');
    cy.wait(2000)
    cy.get('[data-testid="DeleteIcon"] path').click();
  })
})