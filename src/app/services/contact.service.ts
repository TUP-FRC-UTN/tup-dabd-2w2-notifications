import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Contact, ContactApi } from '../models/contact';
import { ContactType } from '../models/contactType';
import { environmentContacts } from '../../environments/environment.development.contacts';
import { map } from 'rxjs';
import { SubscriptionMod } from '../models/subscription';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  http: HttpClient = inject(HttpClient)

  getAllContacts() {
    const url = `${environmentContacts.apiUrl + "/contacts"}`;
    return this.http.get<ContactApi[]>(url).pipe(
      map(contacts => contacts.map(contact => ({
        id: contact.id,
        subscriptions: contact.subscriptions || [], // Asignar un array vacío si es null
        contactValue: contact.contact_value, // Mapeo del nombre de la propiedad
        contactType: contact.contact_type // Mapeo del nombre de la propiedad
      })))
    );
  }

  getContactById(id: number) {
    const url = `${environmentContacts.apiUrl + "/contacts/" + id}`
    return this.http.get<ContactApi>(url).pipe(
      map(contact => ({
        id : contact.id,
        subscriptions : contact.subscriptions || [],
        contactValue: contact.contact_value, // Mapeo
        contactType: contact.contact_type
      }))
    )
  }

  getContactType() {
    const url = `${environmentContacts.apiUrl + "/contactsType"}`
    return this.http.get<ContactType[]>(url)
  }

  postContact(contact: Contact) {

    const url = `${environmentContacts.apiUrl + "/contacts/"}`

    return this.http.post<Contact>(url, contact);

  }
  modifacateSubscription(data : SubscriptionMod) {
    const url = `${environmentContacts.apiUrl}/contacts/subscription`
    return this.http.put<SubscriptionMod>(url, data)
  }

}
