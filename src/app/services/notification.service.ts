import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Notification, NotificationModelChart } from '../../app/models/notifications/notification';
import { forkJoin, map, Observable, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl: string;

  constructor() {

    this.apiUrl = environment.apis.notifications.url;
  }

  private http: HttpClient = inject(HttpClient)

  getNotificationByContact() {
    const params = new HttpParams().set('contactId', 1);
    const url = `${this.apiUrl}/notifications`;

    return this.http.get<Notification[]>(url, { params }).pipe(
      switchMap(notifications => {
        const detailedRequests = notifications.map(notification =>
          this.http.get<Notification>(`${this.apiUrl}/notifications/${notification.id}`).pipe(
            map(detailedNotification => ({
              ...notification,
              body: detailedNotification.body || '',
              isRead: notification.statusSend === 'VISUALIZED',
              dateSend: this.convertDate(notification.dateSend),
              dateNotification: new Date().toLocaleDateString()
            }))
          )
        );

        return forkJoin(detailedRequests);
      }),
      map((notificationsWithTemplates) =>
        notificationsWithTemplates.sort((a, b) => b.id - a.id)
      )
    );
  }

  getAllNotification() {
    const url = `${this.apiUrl}/notifications`;
    return this.http.get<Notification[]>(url).pipe(
      switchMap(notifications => {
        const detailedRequests = notifications.map(notification =>
          this.http.get<Notification>(`${this.apiUrl}/notifications/${notification.id}`).pipe(
            map(detailedNotification => ({
              ...notification,
              body: detailedNotification.body || '',
              isRead: notification.statusSend === 'VISUALIZED',
              dateSend: this.convertDate(notification.dateSend),
              dateNotification: new Date().toLocaleDateString()
            }))
          )
        );

        return forkJoin(detailedRequests);
      }),
      map((notificationsWithTemplates) =>
        notificationsWithTemplates.sort((a, b) => b.id - a.id)
      )
    );
  }

  getNotificationById(id: number) {
    const url = `${this.apiUrl}/notifications/${id}`;
    return this.http.get<Notification>(url);
  }


  isRead(id: number) {
    const url = `${this.apiUrl}/notifications/${id}`
    const body = { statusSend: 'VISUALIZED' };
    return this.http.put(url, body)
  }

  private convertDate(date: string | Date): Date {
    if (typeof date === 'string') {
      const [day, month, yearTime] = date.split('/');
      const [year, time] = yearTime.split(' ');
      const [hours, minutes, seconds] = time ? time.split(':') : [0, 0, 0];
      return new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    }
    return date;
  }


  getAllNotificationsNotFiltered(): Observable<NotificationModelChart[]> {

    const url = `${this.apiUrl}/notifications`;


    return this.http.get<NotificationModelChart[]>(url);

  }


}
