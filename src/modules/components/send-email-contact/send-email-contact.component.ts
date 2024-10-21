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
  contacts_id : number[] = []

  serviceEmail = new EmailServiceService()
  serviceContacts = new ContactsService()

  allContacts : Contacts[] = []
  selectedContactId : number = 0
  /*emailDataWithContact = new FormGroup({
    subject : new FormControl(''),
    variables : new FormControl(''),
    template_id : new FormControl(''),
    contact_id : new FormControl('')
  })*/


  ngOnInit(): void {
    this.serviceContacts.getAllContacts().subscribe((data) => {
      data.forEach(contact => {
        if (contact.contact_type === "EMAIL") {
          this.allContacts.push(contact)
        }
      })
    })
  }

  submit() {
    throw new Error('Method not implemented.');
  }
  addContact() {
    if (this.selectedContactId != 0) {
      this.contacts_id.push(this.selectedContactId)
    }
  }
  showContactById(id : number): string {
    let contactName : string = ""
    this.serviceContacts.getContactById(id).subscribe((data) => {
      contactName = data.contact_value
    })
    return contactName
  }
}
