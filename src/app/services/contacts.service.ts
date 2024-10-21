import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Contacts } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  /*private readonly*/ http : HttpClient = inject(HttpClient)
  urlBase : string = "http://localhost:8585/contacts"
  
  getAllContacts() {
    //const url = `${environment + "/contacts"}`
    return this.http.get<Contacts[]>(this.urlBase)
  }
  getContactById(id : number) {
    //const url = `${environment + "/contacts/" + id}`
    console.log(this.urlBase + "/" + id)
    return this.http.get<Contacts>(this.urlBase + "/" + id)
  }
}
