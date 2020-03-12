import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ContactEditComponent } from './contact-edit.component';
import { Router } from "@angular/router";
import { ContactService } from '../../shared/contact.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CONTACTS } from '../../shared/contacts.mock';
import { of, Observable, throwError } from 'rxjs';
import { MockActiveRouter } from '../../shared/active-router.mock';
import { Contact } from 'src/app/shared/contact.model';
import { By } from '@angular/platform-browser';
import { createPublicKey } from 'crypto';

describe('ContactEditComponent:addition mode', () => {

  // to test
  let contactEditComponent: ContactEditComponent;

  //dependencies
  
  let activeRouter: ActivatedRoute;
  const contactService = jasmine.createSpyObj('ContactService', [
    'getContact',
    'updateContact',
    'createContact']);
  const router = jasmine.createSpyObj('Router', ['navigate']);

  let fixture: ComponentFixture<ContactEditComponent>;
  let contact: Contact;

  function createComponent() {
    contact = CONTACTS[0];
    activeRouter = TestBed.inject(ActivatedRoute);

    // return the first contact id in order to search that one
    spyOn(activeRouter.snapshot.paramMap, 'get').and.returnValue(null);

    // initialize component
    fixture = TestBed.createComponent(ContactEditComponent);
    contactEditComponent = fixture.componentInstance;
    fixture.detectChanges();
  }

  function setup() {
    // define dependencies
    TestBed.configureTestingModule({
      declarations: [
        ContactEditComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        {provide: ActivatedRoute, useClass: MockActiveRouter},
        {provide: Router, useValue: router},
        {provide: ContactService, useValue: contactService},
      ]
    }).compileComponents();

    createComponent();
  }

  function emptyForm() {
    // get first name input
    let firstNameInput = fixture.debugElement.query(By.css('#firstNameInput')).nativeElement;
    let lastNameInput = fixture.debugElement.query(By.css('#lastNameInput')).nativeElement;
    let phoneInput = fixture.debugElement.query(By.css('#phoneInput')).nativeElement;
    
    // change it to be empty
    firstNameInput.value = '';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.value = '';
    lastNameInput.dispatchEvent(new Event('input'));
    phoneInput.value = '';
    phoneInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function fillForm() {
     // get first name input
     let firstNameInput = fixture.debugElement.query(By.css('#firstNameInput')).nativeElement;
     let lastNameInput = fixture.debugElement.query(By.css('#lastNameInput')).nativeElement;
     let phoneInput = fixture.debugElement.query(By.css('#phoneInput')).nativeElement;
     
     // change it to be empty
     firstNameInput.value = 'Juan';
     firstNameInput.dispatchEvent(new Event('input'));
     lastNameInput.value = 'Perez';
     lastNameInput.dispatchEvent(new Event('input'));
     phoneInput.value = '+33 47 1810990';
     phoneInput.dispatchEvent(new Event('input'));
     fixture.detectChanges();
  }

  beforeEach(async(setup));

  beforeEach(emptyForm);

  it('should create', () => {
    expect(contactEditComponent).toBeTruthy();
  });

  it('should create as addition mode', () => {
    expect(contactEditComponent.editionMode).toBeFalse();
  });

  it('should show empty inputs: last name and the phone number', () => {
    let inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs[0].value).toBe('');
    expect(inputs[1].value).toBe('');
    expect(inputs[2].value).toBe('');
  });

  it('should invalidate the form when trying to send empty form', () => {
    // send an empty form
    contactEditComponent.onSubmitNew();
    
    // show not valid fields
    expect(contactEditComponent.invalidFirstName()).toBeTrue();
    expect(contactEditComponent.invalidLastName()).toBeTrue();
    expect(contactEditComponent.invalidPhone()).toBeTrue();
  });

  it('should create contact and redirects', fakeAsync(() => {
    //
    fillForm();

    // mock services: suppose the server created the contact
    contactService.createContact.and.returnValue(of('OK'));

    // click submit button
    contactEditComponent.onSubmitNew();

    // wait 3003ms
    tick(3003);

    // expect to redirect
    expect(router.navigate.calls.count()).toBe(1);
    expect(contactEditComponent.success).toBeTrue();
  }));

  it('there is an error on the server while trying to create', async() => {
    // fill form correctly
    fillForm();

    // mock services: suppose the server throw an error
    contactService.createContact.and.returnValue(throwError(
      {
        status:500
      }
    ));

    // click submit button
    contactEditComponent.onSubmitNew();

    // not success
    expect(contactEditComponent.success).toBeFalse();
    expect(contactEditComponent.serverError).toBe("There is a problem with the system. Please try again later.");
  });
});

