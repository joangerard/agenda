const assert = require('assert');
var ContactRepository = require('../../repositories/contact.repository');
const contacts = require('../models/contacts.mock');
const MockContactDb = require('./contact.db.mock');

describe("contact.repository", () => {
    var contactDb;
    var contactRepository;

    beforeEach(() => {
        contactDb = new MockContactDb();
        contactRepository = new ContactRepository(contactDb);
    })
    
    it("should return all contacts", async () => {
        const allContacts = await contactRepository.getAll();
        expect(allContacts.length).toBe(4);
        assert.deepEqual(allContacts, contacts);
    });

    it("should throw an exception when id is invalid in getById", async() => {
        let error;
        try {
            await contactRepository.getById('123');
        } catch (e) {
            error = e;
        }
        const expectedError = {
            name: "NotFound",
            message: 'Contact not found'
        };
        expect(error).toEqual(expectedError);
    });

    it("should return a contact", async () => {
        const contact = await contactRepository.getById(contacts[0]._id);
        assert.deepEqual(contact, contacts[0]);
    });

    it("should throw an exception when id is invalid in update", async() => {
        let error;
        try {
            await contactRepository.update('123', contacts[0]);
        } catch (e) {
            error = e;
        }
        const expectedError = {
            name: "InvalidParam",
            message: 'Invalid id parameter'
        };
        expect(error).toEqual(expectedError);
    });

    it("should call update", async () => {
        const contact = contacts[0];
        spyOn(contactDb, 'updateOne');

        await contactRepository.update(contact._id, contact);

        expect(contactDb.updateOne).toHaveBeenCalled();
    });

    it("should call create", async () => {
        const contact = {
            "firstName": "Loucas",
            "lastName": "Bontempi",
            "phone": "+33 47 181000"
        };

        spyOn(contactDb, 'create');

        await contactRepository.create(contact);

        expect(contactDb.create).toHaveBeenCalled();
    });
});
