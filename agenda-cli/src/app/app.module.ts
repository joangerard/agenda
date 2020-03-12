import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contact-list/contacts.component';
import { FilterContactListPipe } from 'src/app/shared/pipes/filter-contact-list.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContactEditComponent } from './contacts/contact-edit-add/contact-edit.component';
import { AppRoutingModule } from './app-routing/app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    FilterContactListPipe,
    ContactEditComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
