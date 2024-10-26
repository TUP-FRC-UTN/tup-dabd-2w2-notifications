import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { NotificationApi } from '../models/notification';
import { forkJoin, map, switchMap } from 'rxjs';

interface EmailTemplate {
  id: number;
  name: string;
  body: string;
}

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
    const params = new HttpParams().set('contactId', 1);//Esta seteado en 1
    const url = `${this.apiUrl}/notifications`;
    return this.http.get<NotificationApi[]>(url, { params }).pipe(
      switchMap((notifications) => {
        const notificationRequests = notifications.map((notification) =>
          this.getTemplateById(notification.templateId).pipe(
            map((template) => ({

              ...notification,
              content: template.body,
              isRead: notification.statusSend === 'VISUALIZED',
              dateSend: this.convertDateString(notification.dateSend),
              dateNotification: new Date().toISOString()
            }))
          )
        );
        return forkJoin(notificationRequests);
      }),
      map((notificationsWithTemplates) =>
        notificationsWithTemplates.sort((a, b) => b.id - a.id)
      )
    );
  }
  getAllNotification() {
    const url = `${this.apiUrl}/notifications`;
    return this.http.get<NotificationApi[]>(url).pipe(
      switchMap((notifications) => {
        const notificationRequests = notifications.map((notification) =>
          this.getTemplateById(notification.templateId).pipe(
            map((template) => ({

              ...notification,
              content: this.template,
              isRead: notification.statusSend === 'VISUALIZED',
              dateSend: this.convertDateString(notification.dateSend),
              dateNotification: new Date().toISOString() //lo cree aca pq no lo manda desde el back
            }))
          )
        );
        return forkJoin(notificationRequests);
      }),
      map((notificationsWithTemplates) =>
        notificationsWithTemplates.sort((a, b) => b.id - a.id)
      )
    );
  }

  getTemplateById(id: number) {
    const url = `${this.apiUrl}/email-templates/${id}`;
    return this.http.get<EmailTemplate>(url);
  }

  isRead(id: number) {
    const url = `${this.apiUrl}/notifications/${id}`
    const body = { statusSend: 'VISUALIZED' };
    return this.http.put(url, body)
  }

  private convertDateString(dateString: string): Date {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  template: string = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tarjeta con Imagen</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }

            .tarjeta {
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                width: 300px; /* Ancho de la tarjeta */
            }

            .tarjeta img {
                width: 100%; /* Ajusta la imagen al ancho de la tarjeta */
                height: auto;
            }

            .contenido {
                padding: 15px;
            }

            .contenido h2 {
                margin: 0;
                font-size: 1.5em;
            }

            .contenido p {
                line-height: 1.5;
                color: #555;
            }
        </style>
    </head>
    <body>

    <div class="tarjeta">
        <img src="https://via.placeholder.com/300x200" alt="Imagen de Ejemplo">
        <div class="contenido">
            <h2>Título de la Tarjeta</h2>
            <p>Este es un texto descriptivo que acompaña la imagen en la tarjeta. Puedes agregar más información aquí.</p>
        </div>
    </div>

    </body>
    </html>
    `

}
