import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { CONTACTS } from './contacts.mock';
import { Observable, of } from 'rxjs';
import { map,tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  // TODO: mode this into a configuration file
  private contactsUrlApi = '/api/v1/contact';

  constructor(private http: HttpClient) { }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.contactsUrlApi + '/all')
      .pipe(
        // the server returns {"contacts": {...}}
        // so obtain the {...} object only
        map(contacts => contacts["contacts"])
      );
  }

  getContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.contactsUrlApi}/${id}`)
      .pipe(
        // the server returns {"contact": {...}}
        // so obtain the {...} object only
        map(contact => contact['contact'])
      );
  }

  updateContact(id: string, data): Observable<Contact> {
    let url: string = `${this.contactsUrlApi}/${id}`;
    return this.http.put<Contact>(url, data)
      .pipe(
        // the server returns {"contact": {...}}
        // so obtain the {...} object only
        map(data => data['contact'])
      );
  }

  createContact(data): Observable<Contact> {
    let url: string = `${this.contactsUrlApi}/`;
    return this.http.post<Contact>(url, data)
      .pipe(
        // the server returns {"contact": {...}}
        // so obtain the {...} object only
        map(data => data['contact'])
      );
  }
}
