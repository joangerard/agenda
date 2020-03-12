import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { ContactsComponent } from './contacts.component';
import { Contact } from 'src/app/shared/contact.model';
import { CONTACTS } from 'src/app/shared/contacts.mock';
import { ContactService } from 'src/app/shared/contact.service';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';

class ContactServiceMock extends ContactService {

  getContacts(): Observable<Contact[]> {
    return of(CONTACTS);
  }
}

describe('ContactsComponent', () => {
  let contactComponent: ContactsComponent;
  let contactService: ContactServiceMock;

  beforeEach(() => {
    const http = jasmine.createSpyObj('HttpClient', ['get']);
    contactService = new ContactServiceMock(http);
    contactComponent = new ContactsComponent(contactService);
  });

  it('ngOnInit: shoud already load all the contacts',  async(() => {
    contactComponent.ngOnInit();
    expect(contactComponent.contacts).toEqual(CONTACTS);
  }));

  it('getContacts: shoud return all contacts',  async(() => {
    contactComponent.getContacts();
    expect(contactComponent.contacts).toEqual(CONTACTS);
  }));
});
