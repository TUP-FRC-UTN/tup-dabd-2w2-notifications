import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { Notification } from '../models/notification';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {


private http = inject(HttpClient);
private apiUrl: string;

constructor() {

  this.apiUrl = environment.apis.notifications.url;

}

getAllNotifications(): Observable<Notification[]> {
  return this.http.get<any[]>(`${this.apiUrl + "/notifications"}`).pipe(
    map(notifications => notifications.map(notification => this.transformNotification(notification)))
  );
}

private transformNotification(data: any): Notification {
  return {
    id: data.id,
    recipient: data.recipient,
    templateId: data.template_id,
    templateName:data.template_name,
    statusSend: data.status_send,
    dateSend:data.date_send,
  };
};

}

