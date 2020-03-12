import { async } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { CONTACTS } from 'src/app/shared/contacts.mock';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

describe('ContactService', () => {
  let contactService: ContactService;
  let httpClientSpy: { 
    get: jasmine.Spy,
    put: jasmine.Spy,
    post: jasmine.Spy
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post']);
    contactService = new ContactService(<any> httpClientSpy);
  });

  it('getContacts: should return all contacts', async(() => {
    httpClientSpy.get.and.returnValue(of({"contacts": CONTACTS}));
    contactService.getContacts().subscribe(
      contacts => expect(contacts).toEqual(CONTACTS),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBeGreaterThanOrEqual(1, 'one+ call');
  }));

  it('getContact: should return a contact by id', async(() => {
    const contact = CONTACTS[0];

    httpClientSpy.get.and.returnValue(of({"contact": contact}));

    contactService.getContact(contact._id).subscribe(
      contact => expect(contact).toEqual(contact),
      fail
    );

    expect(httpClientSpy.get.calls.count()).toBeGreaterThanOrEqual(1, 'one+ call');
  }));

  it('updateContact: should return a contact by id', async(() => {
    const contact = CONTACTS[0];

    httpClientSpy.put.and.returnValue(of({"contact": contact}));

    contactService.updateContact(contact._id, contact).subscribe(
      contact => expect(contact).toEqual(contact),
      fail
    );
    
    expect(httpClientSpy.put.calls.count()).toBeGreaterThanOrEqual(1, 'one+ call');
  }));

  it('createContact: should return a contact', async(() => {
    const contact = CONTACTS[0];

    httpClientSpy.post.and.returnValue(of({"contact": contact}));

    contactService.createContact(contact).subscribe(
      contact => expect(contact).toEqual(contact),
      fail
    );
    
    expect(httpClientSpy.post.calls.count()).toBeGreaterThanOrEqual(1, 'one+ call');
  }));
});
