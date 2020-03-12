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

describe('ContactEditComponent:edition mode', () => {

  // to test
  let contactEditComponent: ContactEditComponent;

  //dependencies
  
  let activeRouter: ActivatedRoute;
  const contactService = jasmine.createSpyObj('ContactService', ['getContact', 'updateContact']);
  const router = jasmine.createSpyObj('Router', ['navigate']);

  let fixture: ComponentFixture<ContactEditComponent>;
  let contact: Contact;

  function createComponent() {
    contact = CONTACTS[0];
    activeRouter = TestBed.inject(ActivatedRoute);

    // return the first contact id in order to search that one
    spyOn(activeRouter.snapshot.paramMap, 'get').and.returnValue(contact._id);

    // return the first contact by default
    contactService.getContact.and.returnValue(of(contact));

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

  beforeEach(async(setup));

  it('should create', () => {
    expect(contactEditComponent).toBeTruthy();
  });

  it('should show the first, last name and the phone number', () => {
    let inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs[0].value).toBe(contact.firstName);
    expect(inputs[1].value).toBe(contact.lastName);
    expect(inputs[2].value).toBe(contact.phone);
  });

  it('should invalidate the form when first name is empty', () => {
    // The name was valid
    expect(contactEditComponent.invalidFirstName()).toBeFalse();

    // get first name input
    let firstNameInput = fixture.debugElement.query(By.css('#firstNameInput')).nativeElement;
    
    // change it to be empty
    firstNameInput.value = '';
    firstNameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // click submit button
    contactEditComponent.onSubmit();
    
    // the first name is not valid
    expect(contactEditComponent.invalidFirstName()).toBeTrue();
  });

  it('should invalidate the form when the last name is empty', () => {
    // The name was valid
    expect(contactEditComponent.invalidLastName()).toBeFalse();

    // get last name input
    let lastNameInput = fixture.debugElement.query(By.css('#lastNameInput')).nativeElement;
    
    // change it to be empty
    lastNameInput.value = '';
    lastNameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // click submit button
    contactEditComponent.onSubmit();
    
    // the last name is not valid
    expect(contactEditComponent.invalidLastName()).toBeTrue();
  });

  it('should invalidate the form when the phone is empty', () => {
    // The phone was valid
    expect(contactEditComponent.invalidPhone()).toBeFalse();

    // get phone input
    let phoneInput = fixture.debugElement.query(By.css('#phoneInput')).nativeElement;
    
    // change it to be empty
    phoneInput.value = '';
    phoneInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // click submit button
    contactEditComponent.onSubmit();
    
    // the phone is not valid
    expect(contactEditComponent.invalidPhone()).toBeTrue();
  });

  it('should invalidate the form when the phone does not have the pattern', () => {
    // The phone was valid
    expect(contactEditComponent.invalidPhone()).toBeFalse();

    // get phone input
    let phoneInput = fixture.debugElement.query(By.css('#phoneInput')).nativeElement;
    
    // change it to be empty
    phoneInput.value = '+32 09 2134';
    phoneInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // click submit button
    contactEditComponent.onSubmit();
    
    // the phone is not valid
    expect(contactEditComponent.invalidPhone()).toBeTrue();
  });

  it('should update contact and redirects', fakeAsync(() => {
    // updat contact
    let phoneInput = fixture.debugElement.query(By.css('#phoneInput')).nativeElement;
    phoneInput.value = '+32 09 2134485';
    phoneInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // mock services: suppose the server updated the contact
    contactService.updateContact.and.returnValue(of('OK'));

    // click submit button
    contactEditComponent.onSubmit();

    // wait 3003ms
    tick(3003);

    // expect to redirect
    expect(router.navigate.calls.count()).toBe(1);
    expect(contactEditComponent.success).toBeTrue();
  }));

  it('there is an error on the server while trying to update', async() => {
    // updat contact
    let phoneInput = fixture.debugElement.query(By.css('#phoneInput')).nativeElement;
    phoneInput.value = '+32 09 2134485';
    phoneInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // mock services: suppose the server throw an error
    contactService.updateContact.and.returnValue(throwError(
      {
        status:500
      }
    ));

    // click submit button
    contactEditComponent.onSubmit();

    // not success
    expect(contactEditComponent.success).toBeFalse();
    expect(contactEditComponent.serverError).toBe("There is a problem with the system. Please try again later.");
  });

  it('displays a message when "Not found" returned for the server', async() => {
    // updat contact
    let phoneInput = fixture.debugElement.query(By.css('#phoneInput')).nativeElement;
    phoneInput.value = '+32 09 2134485';
    phoneInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // mock services: suppose the server throw an error
    contactService.updateContact.and.returnValue(throwError(
      {
        status:404
      }
    ));

    // click submit button
    contactEditComponent.onSubmit();

    // not success
    expect(contactEditComponent.success).toBeFalse();
    expect(contactEditComponent.serverError).toBe("Contact not found");
  });

  it('shows a validation error when trying to update (server side)', async() => {
    // updat contact
    let phoneInput = fixture.debugElement.query(By.css('#phoneInput')).nativeElement;
    phoneInput.value = '+32 09 2134485';
    phoneInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // mock services: suppose the server throw an error
    contactService.updateContact.and.returnValue(throwError(
      {
        status:400,
        error: {
          error: {
            phone: "Phone number invalid"
          }
        }
      }
    ));

    // click submit button
    contactEditComponent.onSubmit();

    // not success
    expect(contactEditComponent.success).toBeFalse();
    expect(contactEditComponent.serverError).toBe("Phone number invalid\n");
  });
});

