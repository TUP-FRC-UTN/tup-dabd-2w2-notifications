import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Contact } from '../models/contact';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import {SubscriptionMod} from '../../app/models/subscription'
@Injectable({
  providedIn: 'root'
})


export class ContactService {

  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private apiUrl: string;

  constructor() {

    this.apiUrl = environment.apis.contacts.url;

    if (isPlatformBrowser(this.platformId)) {
      console.log('API URL:', this.apiUrl);
    }
  }

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<any[]>(`${this.apiUrl + "/contacts"}`).pipe(
      map(contacts => contacts.map(contact => this.transformToContact(contact)))
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
      contactType: data.contact_type,
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
}

