import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Contact } from '../models/contact';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
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


  getContactById(id: number) {
    const url = `${this.apiUrl + "/contacts/" + id}`
    return this.http.get<Contact>(url + "/" + id)
  }


  postContact(contact: Contact) {

    const url = `${this.apiUrl + "/contacts/"}`

    return this.http.post<Contact>(url, contact);

  }

  editContact(contact: Contact) {

    const url = `${this.apiUrl + "/contacts/" + contact.id}`

    return this.http.put<Contact>(url, contact.contactValue);

  }

  deleteContact(id: number): Observable<any> {

    const url = `${this.apiUrl +  "/contacts/" + id}`

    return this.http.delete(`${url}/${id}`);
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

}
