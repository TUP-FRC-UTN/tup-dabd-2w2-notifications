import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ContactAudit } from '../models/contacts/contactAudit';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContactAuditService {

  //private apiUrl = 'https://my-json-server.typicode.com/114050-RODI-CARO-Nicolas/contact-audit-mock/audit_history'

  private apiUrl = `${env.apiUrl}/audit/contacts`

  private readonly httpClient = inject(HttpClient); // Angular's new inject function

  // URL de la API que devuelve el historial de auditoría


  /**
   * Método para obtener todo el historial de auditoría
   */
  get(): Observable<ContactAudit[]> {
    return this.httpClient.get<ContactAudit[]>('/api/audit/contacts');
  }







}
