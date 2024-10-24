import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../app/services/contact.service';
import { Contact } from '../../../app/models/contact';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})



@Inject('ContactsService')
export class ContactListComponent {


  contacts: Contact[] = [];



  contactService: ContactService = new ContactService();


  ngOnInit(): void {
    this.getAllContacts();
  }


  getAllContacts() {
    this.contactService.getAllContacts().subscribe((data) => {
      this.contacts = data;
    });
  }

  getContactById(id: number) {
    this.contactService.getContactById(id).subscribe((data) => {
      this.contacts.push(data);
    });
  }


}
