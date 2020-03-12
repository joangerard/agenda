import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from "@angular/router";

import { ContactService } from '../../shared/contact.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {

  contactForm: FormGroup;
  submitted: boolean = false;
  serverError: string = "";
  success: boolean = false;
  editionMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private formBuilder: FormBuilder,
  ) { 
    this.contactForm = this.formBuilder.group({
      _id: [],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['',Validators.compose([Validators.required, Validators.pattern(/^\+\d+\s\d+\s\d{6}\d*$/)])]
    });
  }

  _showErrorMessages(error: any) {
    console.log(error);
    this.serverError = "";

    switch(error.status) {
      case 404:
        this.serverError = "Contact not found";
        break;

      case 400:
        let errorMsg = error.error.error;
        for(const key in errorMsg) {
          this.serverError += errorMsg[key]+'\n';
        }
        break;

      default:
        this.serverError = "There is a problem with the system. Please try again later.";
        break;
    }
    
  }

  invalidFirstName(): boolean
  {
  	return (this.submitted && this.contactForm.controls.firstName.status === 'INVALID');
  }

  invalidLastName(): boolean
  {
  	return (this.submitted && this.contactForm.controls.lastName.status === 'INVALID');
  }

  invalidPhone(): boolean
  {
  	return (this.submitted && this.contactForm.controls.phone.status === 'INVALID');
  }

  ngOnInit(): void {
    this.getContact();
  }

  getContact(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    // Edition mode
    if (id) {
      this.editionMode = true;
      
      this.contactService.getContact(id)
      .subscribe(contact => {
        this.contactForm.setValue(contact);
      }, data => {
        // TODO: classify errors by status code.
        // put all this responsability in another class.
        this._showErrorMessages(data);
      });
    }
    
  }

  // edit contact
  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
        return;
    }

    const id = this.route.snapshot.paramMap.get('id');

    //update contact
    this.contactService.updateContact(id, this.contactForm.value)
      .subscribe((data: any) => {
        this.success = true;
        // redirect after 2 seconds to the main page
        setTimeout(() => {
            this.router.navigate(["/"]);
        }, 3000);
      }, data => {
        // TODO: classify errors by status code.
        // put all this responsability in another class.
        this._showErrorMessages(data);
      })
  }

  // add contact
  onSubmitNew(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
        return;
    }

    //update contact
    this.contactService.createContact(this.contactForm.value)
      .subscribe((data: any) => {
        this.success = true;
        // redirect after 2 seconds to the main page
        setTimeout(() => {
            this.router.navigate(["/"]);
        }, 3000);
      }, data => {
        // TODO: classify errors by status code.
        // put all this responsability in another class.
        this._showErrorMessages(data);
      })
  }
}
