import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Contacts } from '../models/contacts';
import { environmentContacts } from '../../environments/environment.development.contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  http : HttpClient = inject(HttpClient)
  
  getAllContacts() {
    const url = `${environmentContacts.apiUrl + "/contacts"}`
    return this.http.get<Contacts[]>(url)
  }
  getContactById(id : number) {
    const url = `${environment + "/contacts/" + id}`
    console.log(environmentContacts.apiUrl + "/" + id)
    return this.http.get<Contacts>(url + "/" + id)
  }
}
