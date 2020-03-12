import { Pipe, PipeTransform } from '@angular/core';

import { Contact } from 'src/app/shared/contact.model';

@Pipe({ name: 'filterContactList' })
export class FilterContactListPipe implements PipeTransform {

  // verify if contact contains the search string in one of their fields
  private containsSearchText(contact: Contact, searchText: string) {
    return contact.firstName.toLowerCase().includes(searchText.toLowerCase()) || 
           contact.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
           contact.phone.toLowerCase().includes(searchText.toLowerCase());
  }

  transform(contacts: Contact[], searchText: string) {
    if (!contacts){
      return [];
    }

    if (!searchText) {
      return contacts;
    }
    return contacts.filter(contact => this.containsSearchText(contact, searchText));
  }
}
