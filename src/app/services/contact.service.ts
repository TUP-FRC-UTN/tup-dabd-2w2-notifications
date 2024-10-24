import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Contact } from '../models/contact';
import { ContactType } from '../models/contactType';
import { environmentContacts } from '../../environments/environment.development.contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  http: HttpClient = inject(HttpClient)

  getAllContacts() {
    const url = `${environmentContacts.apiUrl + "/contacts"}`
    return this.http.get<Contact[]>(url)
  }

  getContactById(id: number) {
    const url = `${environment + "/contacts/" + id}`
    console.log(environmentContacts.apiUrl + "/" + id)
    return this.http.get<Contact>(url + "/" + id)
  }

  getContactType() {
    const url = `${environmentContacts.apiUrl + "/contactsType"}`
    return this.http.get<ContactType[]>(url)
  }

  postContact(contact: Contact) {

    const url = `${environment + "/contacts/"}`

    return this.http.post<Contact>(url, contact);

  }

}
