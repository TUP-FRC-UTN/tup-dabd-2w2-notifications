import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../app/services/contact.service';
import { Contact } from '../../../app/models/contact';

@Component({
  selector: 'app-contact-modify-subs-email',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact-modify-subs-email.component.html',
  styleUrl: './contact-modify-subs-email.component.css'
})
@Inject('ContactService')
export class ContactModifySubsEmailComponent implements OnInit{
  
  serviceContact : ContactService = new ContactService()

  modification : FormGroup = new FormGroup({
    contactId : new FormControl('', Validators.required),
    subscriptionId : new FormControl('', Validators.required),
    subscriptionValue : new FormControl(false)
  })

  allContacts : Contact[] = []
  selectedContactId : number = 0
  selectedContact : Contact | undefined

  ngOnInit(): void {
    this.serviceContact.getAllContacts().subscribe((data) => {
      data.forEach(c => {
        if (c.contactType === 'EMAIL') {
          this.allContacts.push(c)
        }
      })
    })
    this.serviceContact.getContactById(this.selectedContactId).subscribe((data) => {
      this.selectedContact = data
    })
  }

  submit() {

  }
}
