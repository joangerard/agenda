const contacts = require('../models/contacts.mock');

class MockContactDb {
  async find() {
      return contacts;
  }
  async findOne(param) {
      return contacts[0];
  }
  async updateOne(param1, param2) {

  }
  async create(param1) {

  }
}

module.exports = MockContactDb;