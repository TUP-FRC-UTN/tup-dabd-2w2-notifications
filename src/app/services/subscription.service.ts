import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subscription } from '../models/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  
  private http: HttpClient = inject(HttpClient)

  getAllSubscriptions() {
    const url = `${environment.apis.contacts.url}/subscriptions`
    return this.http.get<Subscription[]>(url)
  }

}
