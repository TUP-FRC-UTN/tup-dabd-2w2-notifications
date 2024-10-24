import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactAudit, ContactAuditResponse } from '../models/contacts/contactAudit';
import { environmentContacts } from '../../environments/environment.development.contacts';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class ContactAuditService {


  private mockApiUrl = 'https://my-json-server.typicode.com/114050-RODI-CARO-Nicolas/contact-audit-mock/audit_history'


  private mapToCamelCase(audit: ContactAuditResponse): ContactAudit {
    return _.mapKeys(audit, (value: any, key: any) => _.camelCase(key)) as ContactAudit;
  }




  
  http : HttpClient = inject(HttpClient)




  




  /**
   * Método para obtener todo el historial de auditoría
   */

  getContactAudits(): Observable<ContactAudit[]> {

   // const url = `${environmentContacts.apiUrl + "api/contacts/audit"}`
     const url = `${this.mockApiUrl}`
    return this.http.get<ContactAuditResponse[]>(url).pipe(
      map((response: ContactAuditResponse[]) => 
        response.map(audit => this.mapToCamelCase(audit))
      )
    );
  }



  /*
  get(): Observable<ContactAudit[]> {
    
    const url = `${environmentContacts.apiUrl + "api/contacts/audit"}`
    return this.http.get<ContactAudit[]>(url).pipe(
      map((response : ContactAuditResponse[]) => 
      response.map(audit => this.ampToCamelCase(audit))
    )
    );
  } */







}
