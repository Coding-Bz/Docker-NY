describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#root button').click();
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#root form > div:nth-child(2)').click();
    cy.get('#password').type('1234');
    cy.get('#root button[type="submit"]').click();
    cy.wait(2000)
    cy.get('#root button:nth-child(3)').click();
    cy.get('tr:nth-child(2) [data-testid="EditIcon"]').click();
    cy.get('[name="address"]').click();
    cy.get('[name="address"]').clear();
    cy.get('[name="address"]').type('Herostrasse 12');
    cy.get('[name="birthDate"]').click();
    cy.get('[name="birthDate"]').clear();
    cy.get('[name="birthDate"]').type('2000-03-29');
    cy.get('div[role="dialog"] > div:nth-child(2)').click();
    cy.get('[name="email"]').clear();
    cy.get('[name="email"]').type('tylerdurden@gmail.com');
    cy.get('[name="firstName"]').click();
    cy.get('[name="firstName"]').clear();
    cy.get('[name="firstName"]').type('tyler');
    cy.get('[name="lastName"]').click();
    cy.get('[name="lastName"]').clear();
    cy.get('[name="lastName"]').type('durden');
    cy.get('div:nth-child(3) > button:nth-child(2)').click();
    cy.get('[data-cy="filter-first-name"]').click();
    cy.get('[data-cy="filter-first-name"]').type('ty');
    cy.get('[data-testid="EditIcon"] path').click();
    cy.wait(1000)
    cy.get('div[role="dialog"] button:nth-child(1)').click();
    cy.get('#root div.css-19kzrtu').click();
    cy.get('[data-cy="filter-first-name"]').clear();
    cy.get('[data-cy="filter-first-name"]').type('firstname1{enter}');
    cy.wait(1000)
    cy.get('tr:nth-of-type(1) [data-testid="EditIcon"] path').click();
    cy.get('div[tabindex="-1"]').click();
    cy.get('[name="address"]').clear();
    cy.get('[name="address"]').type('Im Meier 67');
    cy.wait(2000)
    cy.get('div:nth-child(3) > button:nth-child(2)').click();
    cy.get('tr:nth-of-type(1) [data-testid="EditIcon"] path').click();
    cy.wait(2000)
    cy.get('div[role="dialog"] button:nth-child(1)').click();
    cy.get('[data-cy="filter-first-name"]').click();
    cy.get('[data-cy="filter-first-name"]').type('0');
    cy.get('[data-testid="EditIcon"]').click();
    cy.get('html').click();
    cy.get('[name="address"]').clear();
    cy.get('div:nth-child(3) > button:nth-child(2)').click();
    cy.wait(2000)
    cy.get('div[role="dialog"] button:nth-child(1)').click();
    cy.wait(1000)
    cy.get('[data-testid="EditIcon"] path').click();
    cy.get('div[tabindex="-1"]').click();
    cy.get('[name="profileImageUrl"]').clear();
    cy.get('[name="profileImageUrl"]').type('C:Users/my_image');
    cy.get('div:nth-child(3) > button:nth-child(2)').click();
    cy.wait(1000)
    cy.get('div[role="dialog"] button:nth-child(1)').click();
    cy.get('[data-testid="EditIcon"] path').click();
    cy.get('[name="birthDate"]').click();
    cy.get('[name="birthDate"]').clear();
    cy.get('[name="birthDate"]').type('2020-11-11');
    cy.get('div:nth-child(3) > button:nth-child(2)').click();
    cy.get('div[role="dialog"] button:nth-child(1)').click();
    cy.get('#root button:nth-child(4)').click();
    cy.wait(1000)
    cy.get('#email').click();
    cy.get('#email').type('user1@example.com');
    cy.get('#password').click();
    cy.get('#password').type('1234');
    cy.get('#root button[type="submit"]').click();
    cy.get('[data-testid="PersonIcon"]').click();
  })
})