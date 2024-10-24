import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environmentContacts } from '../../environments/environment.development.contacts';
import { Subscription } from '../models/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http : HttpClient = inject(HttpClient)

  getAllSubsriptions() {
    const url = `${environmentContacts.apiUrl}/subscriptions`
    return this.http.get<Subscription[]>(url)
  }
}
