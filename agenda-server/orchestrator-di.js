const ContactService = require('./services/contact.service');
const ContactRepository = require('./repositories/contact.repository');
const ContactMongoDb = require('./models/mongo/contact');
const ErrorHandler = require('./shared/error-handler');
const Validator = require('fastest-validator');

/**
 * This class is in charge of denpendency injection of the classes.
 */
class OrchestratorDI {
    constructor() {
        this.errorHandler = new ErrorHandler();
        this.validator = new Validator(); 
        this.contactRepository = new ContactRepository(ContactMongoDb);
        this.contactService = new ContactService(
            this.contactRepository,
            this.validator,
            this.errorHandler
        );
    }

    static instance() {
        return new OrchestratorDI();
    }
}

module.exports = OrchestratorDI.instance();