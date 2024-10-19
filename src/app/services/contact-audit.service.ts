import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditHistory } from '../models/contacts/contactAudit';
import { transformAuditHistoryData } from './contacts/utils/contactAuditFromCamelToSnake';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactAuditService {

  private readonly http = inject(HttpClient); // Angular's new inject function

  // URL de la API que devuelve el historial de auditoría
  private apiUrl = "http://localhost:3000/contact-audit"; // Ajusta según tu mock API

  /**
   * Método para obtener todo el historial de auditoría
   */
  get(): Observable<AuditHistory[]> {
    return this.http.get<AuditHistory[]>(this.apiUrl)
      .pipe(
        map(data => transformAuditHistoryData(data)) // Aplicar la transformación de snake_case a camelCase
      );
  }

  /**
   * Método para obtener un historial de auditoría por ID.
   */
  getById(id: string): Observable<AuditHistory> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<AuditHistory>(url)
      .pipe(
        map(data => transformAuditHistoryData([data])[0]) // Transforma un solo objeto
      );
  }

}
