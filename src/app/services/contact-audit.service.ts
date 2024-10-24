import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactAudit, ContactAuditResponse } from '../models/contacts/contactAudit';
import { environmentContacts } from '../../environments/environment.development.contacts';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { ContactType } from '../models/contacts/contactAudit';


@Injectable({
  providedIn: 'root'
})
export class ContactAuditService {





  private mapToCamelCase(audit: ContactAuditResponse): ContactAudit {
    return _.mapKeys(audit, (value: any, key: any) => _.camelCase(key)) as ContactAudit;
    
  }

  private mockApiUrl = 'https://my-json-server.typicode.com/114050-RODI-CARO-Nicolas/contact-audit-mock/audit_history'

  
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
  
  private transformResponseToContactAudit = (response: ContactAuditResponse): ContactAudit => {
    return {
      contactId: response.contact_id,
      value: response.value,
      contactType: this.mapContactType(response.contact_type),
      revisionId: response.revision_id,
      revisionType: response.revision_type,
      revisionDate: response.revision_date
    };
  }

 
  
  



  http : HttpClient = inject(HttpClient)




  /**
   * Método para obtener todo el historial de auditoría
   */

  getContactAudits(): Observable<ContactAudit[]> {

   // const url = `${environmentContacts.apiUrl + "api/contacts/audit"}`
     const url = `${this.mockApiUrl}`
    return this.http.get<ContactAuditResponse[]>(url)
    .pipe(
      map(
        responses => responses.map(this.transformResponseToContactAudit)
      )
    );
  }



}
