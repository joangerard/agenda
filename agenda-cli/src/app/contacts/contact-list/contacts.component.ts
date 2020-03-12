import { Component, OnInit } from '@angular/core';
import { Contact } from '../../shared/contact.model';
import { ContactService } from '../../shared/contact.service';
import { FilterContactListPipe } from 'src/app/shared/pipes/filter-contact-list.pipe';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Contact[];
  searchText: string = "";

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(): void {
    this.contactService.getContacts()
      .subscribe(contacts => this.contacts = contacts);
  }
}
