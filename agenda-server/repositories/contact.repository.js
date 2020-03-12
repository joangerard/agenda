const mongoose = require('mongoose');

class ContactRepository {
    constructor(contact) {
        this.contact = contact;
    }

    async getAll() {
        return this.contact.find();
    }

    async getById(id) {
        // if the id received is not a valid
        // mongoose format id then 
        // the contact is not in the db
        if(!mongoose.Types.ObjectId.isValid(id)) {
            throw {
                name: "NotFound",
                message: 'Contact not found'
            };
        }
        return this.contact.findOne( {_id: id});
    }

    async update(id, data) {
        // if the id received is not a valid
        // mongoose format id then 
        // the contact is not in the db
        if(!mongoose.Types.ObjectId.isValid(id)) {
            throw {
                name: "InvalidParam",
                message: 'Invalid id parameter'
            };
        }

        return this.contact.updateOne( 
            { _id: id },
            { $set: data}
        );
    }
    
    async create(data) {
        return this.contact.create(data);
	}
}

module.exports = ContactRepository;
