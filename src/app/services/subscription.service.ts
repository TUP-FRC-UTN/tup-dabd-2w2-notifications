import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subscription } from '../models/suscriptions/subscription';
import { ContactModel } from '../models/contacts/contactModel';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface ApiSubscriptionUpdate {
  contactId: number;
  subscriptionId: number;
  subscriptionValue: boolean;
}

interface ApiContactResponse {
  id: number;
  subscriptions: string[];
  contact_value: string;
  contact_type: string;
  active: boolean;
}




@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {




  private http: HttpClient = inject(HttpClient)

  private apiUrl: string = environment.apis.contacts.url;

  getAllSubscriptions(): Observable<Subscription[]> {

    const url = `${environment.apis.contacts.url}/subscriptions`;

    return this.http.get<Subscription[]>(url).pipe(
      map(subscriptions => subscriptions.map(subscription => ({
        ...subscription,
        name: this.getSubscriptionNameInSpanish(subscription.name)
      })))
    );
  }


  updateContactSubscriptions(contact: ContactModel): Observable<ContactModel> {
    return this.getAllSubscriptions().pipe(
      switchMap(availableSubscriptions => {
        // Primero obtenemos el estado actual del contacto
        return this.getContactSubscriptions(contact.id).pipe(
          switchMap(currentContact => {
            // Encontramos las suscripciones que necesitan ser desactivadas
            // (las que están en currentContact.subscriptions pero no en contact.subscriptions)
            const subscriptionsToUpdate = availableSubscriptions.filter(subscription =>
              currentContact.subscriptions.includes(subscription.name) &&
              !contact.subscriptions.includes(subscription.name)
            );

            if (subscriptionsToUpdate.length === 0) {
              return of(contact);
            }

            const updateObservables = subscriptionsToUpdate.map(subscription => {
              const updateData: ApiSubscriptionUpdate = {
                contactId: contact.id,
                subscriptionId: subscription.id,
                subscriptionValue: false
              };

              console.log('Actualizando suscripción:', updateData);
              return this.http.put<any>(`${this.apiUrl}/contacts/subscriptions`, updateData);
            });

            return forkJoin(updateObservables).pipe(
              map(() => contact)
            );
          })
        );
      })
    );
  }



  private getContactSubscriptions(contactId: number): Observable<ApiContactResponse> {
    return this.http.get<ApiContactResponse>(
      `${this.apiUrl}/contacts/${contactId}`
    );
  }


  getSubscriptionNameInSpanish(englishName: string): string {
    const translations: { [key: string]: string } = {
      'GENERAL': 'General',
      'MODERATION': 'Moderación',
      'CONSTRUCTION': 'Construcción',
      'EMPLOYEE_PAYMENT': 'Pago de Empleados',
      'EXPENSES_EXPIRATION': 'Vencimiento de Gastos',
      'DEBT': 'Deuda',
      'GENERAL_BILL': 'Factura General',
      'PAYMENT': 'Pago',
      'USER': 'Usuario',
      'ASSOCIATED_USER_CREATED': 'Usuario Asociado Creado',
      'WORKER_LATE_DEPARTURE': 'Salida Tardía de Trabajador',
      'INVENTORY': 'Inventario',
      'GENERAL_EXPENSE': 'Gasto General'
    };

    return translations[englishName] || englishName;
  }

}









