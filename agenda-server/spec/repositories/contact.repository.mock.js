const contacts = require('../models/contacts.mock');

class MockContactRepository {
  async getAll() {
    return contacts;
  }

  async getById(id) {
    return contacts[0];
  }

  async update(id, data) {
    return contacts[0];
  }

  // this method should return a contact one it is created
  // for testing purposes we will return whatever contact we have
  async create(data) {
    return contacts[0];
  }
}

module.exports = MockContactRepository;