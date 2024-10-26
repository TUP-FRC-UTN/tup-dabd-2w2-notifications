import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Contact } from '../models/contact';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import {SubscriptionMod} from '../../app/models/subscription';
import { ContactType } from '../models/contacts/contactAudit';

@Injectable({
  providedIn: 'root'
})


export class ContactService {

  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private apiUrl: string;

  constructor() {

    this.apiUrl = environment.apis.contacts.url;

  }

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<any[]>(`${this.apiUrl + "/contacts"}`).pipe(
      map(contacts => contacts.map(contact => this.transformToContact(contact)))
    );
  }

  getFilteredContactsFromBackend(active: boolean = true, searchText: string = '', contactType?: string): Observable<Contact[]> {
    let url = `${this.apiUrl}/contacts?active=${active}`;
  
    if (searchText) {
      url += `&search=${encodeURIComponent(searchText)}`;
    }
    if (contactType !== undefined && contactType !== '') {
      url += `&contactType=${contactType}`;
    }
    return this.http.get<any[]>(url).pipe(
      map(contacts => contacts.map(contact => this.transformToContact(contact)))
    );
  }

  getAllContactsWithClientSideFilters(searchText: string = '', isActive?: boolean): Observable<Contact[]> {
    return this.getAllContacts().pipe(
      map(contacts => {

        let filteredContacts = contacts;
        if (searchText) {
          filteredContacts = filteredContacts.filter(contact =>
            contact.contactValue.toLowerCase().includes(searchText.toLowerCase()) ||
            contact.contactType.toLowerCase().includes(searchText.toLowerCase())
          );
        }

        if (isActive !== undefined) {
          filteredContacts = filteredContacts.filter(contact => contact.active === isActive);
        }
        return filteredContacts;
      })
    );
  }



  


  getContactById(id: number): Observable<Contact> {
    return this.http.get<any>(`${this.apiUrl}/contacts/${id}`).pipe(
      map(contact => this.transformToContact(contact))
    );
  }

  saveContact(contact: Contact): Observable<Contact> {
    const apiContact = this.transformToApiContact(contact);
    return this.http.post<any>(`${this.apiUrl}/contacts`, apiContact).pipe(
      map(response => this.transformToContact(response))
    );
  }
  modifacateSubscription(data : SubscriptionMod) {
    const url = `${this.apiUrl}/contacts/subscription`
    return this.http.put<SubscriptionMod>(url, data)
  }

  updateContact(contact: Contact): Observable<Contact> {
    const apiContact = this.transformToApiContact(contact);
    return this.http.put<any>(`${this.apiUrl}/contacts/${contact.id}`, apiContact).pipe(
      map(response => this.transformToContact(response))
    );
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contacts/${id}`);
  }

  private transformToContact(data: any): Contact {
    return {
      id: data.id,
      subscriptions: data.subscriptions,
      contactValue: data.contact_value,
      contactType: this.mapContactType(data.contact_type),
      active: data.active,
      showSubscriptions: false
    };
  };

  private transformToApiContact(contact: Contact): any {
    return {
      id: contact.id,
      subscriptions: contact.subscriptions,
      contact_value: contact.contactValue,
      contact_type: contact.contactType,
      active: contact.active
    };
  }

  private mapContactType(contactType: ContactType): string {
    switch (contactType) {
      case ContactType.EMAIL:
        return 'Correo eléctronico';
      case ContactType.PHONE:
        return 'Teléfono';
      case ContactType.SOCIAL_MEDIA_LINK:
        return 'Red social';
      default:
        throw new Error(`Unknown contact type: ${contactType}`);
    }
  }
}

