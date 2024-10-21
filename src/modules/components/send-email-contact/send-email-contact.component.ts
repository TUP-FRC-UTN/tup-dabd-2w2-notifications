import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmailServiceService } from '../../../app/services/email-service.service';
import { Variable } from '../../../app/models/variables';
import { Contacts } from '../../../app/models/contacts';
import { ContactsService } from '../../../app/services/contacts.service';

@Component({
  selector: 'app-send-email-contact',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './send-email-contact.component.html',
  styleUrl: './send-email-contact.component.css'
})
@Inject('EmailServiceService')
@Inject('ContactsService')
export class SendEmailContactComponent implements OnInit{
  
  subjectToSend : string = ""
  variables : Variable[] = []
  template_id : number | undefined
  contact_id : number | undefined

  serviceEmail = new EmailServiceService()
  serviceContacts = new ContactsService()

  allContacts : Contacts[] = []
  /*emailDataWithContact = new FormGroup({
    subject : new FormControl(''),
    variables : new FormControl(''),
    template_id : new FormControl(''),
    contact_id : new FormControl('')
  })*/


  ngOnInit(): void {
    
  }

  submit() {
    throw new Error('Method not implemented.');
  }
}
