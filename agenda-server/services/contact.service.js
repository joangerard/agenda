class ContactService {
    _contactValidationSchema = {
		firstName: { type: "string", min: 1, max: 400,},
		lastName: { type: "string", min: 1, max: 400},
		phone: { type: "string", pattern: /^\+\d+\s\d+\s\d{6}\d*$/},
    };
    
    constructor(contactRepository, contactValidator, errorHandler){
        this.contactRepository = contactRepository;
        this.contactValidator = contactValidator;
        this.errorHandler = errorHandler;
    }

    async getAll() {
        return this.contactRepository.getAll();
    }

    async getById(id) {
        let contact = await this.contactRepository.getById(id);

        if(!contact) {
            throw {
                name: "NotFound",
                message: 'Contact not found'
            };
        }

        return contact;
    }

    async update(id, data) {
        var validationResponse = this.contactValidator.validate(data, this._contactValidationSchema);
        this.errorHandler.getErrors(validationResponse);
        return this.contactRepository.update(id, data);
    }

    async create(data) {
        var validationResponse = this.contactValidator.validate(data, this._contactValidationSchema);
        this.errorHandler.getErrors(validationResponse);
        return this.contactRepository.create(data);
    }
}

module.exports = ContactService;
