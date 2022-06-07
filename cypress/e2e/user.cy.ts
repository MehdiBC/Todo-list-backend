describe('sign up and controller of the user.', () => {
  before(() => {
    cy.request('/users').then((response) => {
      expect(response.status).to.eq(200);
    });
    const createUserDto = {
      email: 'mehdi.b.chikha@gmail.com',
      password: 'salut',
      role: 'user',
    };
    cy.request('POST', `/sign-up`, createUserDto)
      .then((response) => {
        expect(response.status).to.eq(201);
      });
  });

  let users = [];
  let length = 0;

  it('Getting all users', () => {
    cy.request('users').then((response) => {
      expect(response.status).to.eq(200);
      users = response.body;
      length = response.body.length;
      expect(users.length).to.eq(1);
    });
  });

  it('Getting a user by id', () => {
    cy.request(`users/${users[length - 1].id}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', users[length - 1].id);
      expect(response.body).to.have.property('email', users[length - 1].email);
    });
  });

  it('Getting a user by non existing id', () => {
    cy.request({ url: `users/0`, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(404);
      cy.log(response.body);
      expect(response.body.message).to.eq(`User with id=0 does not exist`);
    });
  });

  it('Updating a user', () => {
    const email = 'hela@gmail.com';
    cy.request('PATCH', `/users/${users[length - 1].id}`, { email })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(users[length - 1].id);
        expect(response.body.email).to.eq(email);
      });
  });

  it('Deleting a user by id', () => {
    cy.request('DELETE', `users/${users[length - 1].id}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('affected').to.eq(1);
        cy.request('users').then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.length).to.eq(length - 1);
        });
      });
  });
});
