import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Contacts } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private readonly http : HttpClient = inject(HttpClient)
  urlBase : string = "localhost:8085/contacts"
  
  getAllContacts() {
    //const url = `${environment + "/contacts"}`
    return this.http.get<Contacts[]>(this.urlBase)
  }
  getContactById(id : number) {
    //const url = `${environment + "/contacts/" + id}`
    return this.http.get<Contacts>(this.urlBase + "/" + id)
  }
}
