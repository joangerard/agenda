const assert = require('assert');
const ContactService = require('../../services/contact.service');
const contacts = require('../models/contacts.mock');
const MockContactRepository = require('../repositories/contact.repository.mock');
const ErrorHandler = require('../../shared/error-handler');
const ContactValidator = require('fastest-validator');

describe("contact.service", () => {
    var contactRepository;
    var contactService;
    var contactValidator;
    var errorHandler;

    beforeAll(() => {
        errorHandler = new ErrorHandler();
        contactValidator = new ContactValidator();
        contactRepository = new MockContactRepository();
        contactService = new ContactService(
            contactRepository,
            contactValidator,
            errorHandler
        );
    })
    
    it("should return all contacts", async () => {
        const allContacts = await contactService.getAll();

        expect(allContacts.length).toBe(4);
        assert.deepEqual(allContacts, contacts);
    });

    it("should return a contact", async () => {
        const searchedContact = contacts[0];
        const foundContact = await contactService.getById(searchedContact._id);

        expect(foundContact).toEqual(searchedContact);
    });

    it("should update a contact", async () => {
        spyOn(errorHandler, 'getErrors');
        spyOn(contactValidator, 'validate');
        spyOn(contactRepository, 'update');

        const searchedContact = contacts[0];
        const foundContact = await contactService.update(searchedContact._id, searchedContact);

        expect(errorHandler.getErrors).toHaveBeenCalled();
        expect(contactValidator.validate).toHaveBeenCalled();
        expect(contactRepository.update).toHaveBeenCalled();
    });

    it("should create a contact", async () => {
        const contact = {
            "firstName": "Loucas",
            "lastName": "Bontempi",
            "phone": "+33 47 181000"
        };

        spyOn(errorHandler, 'getErrors');
        spyOn(contactValidator, 'validate');
        spyOn(contactRepository, 'create');

        const newContact = await contactService.create(contact);

        expect(errorHandler.getErrors).toHaveBeenCalled();
        expect(contactValidator.validate).toHaveBeenCalled();
        expect(contactRepository.create).toHaveBeenCalled();
    });
});
