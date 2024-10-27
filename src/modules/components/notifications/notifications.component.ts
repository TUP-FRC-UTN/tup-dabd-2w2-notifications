import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../app/services/notification.service';
import { NotificationApi, NotificationFront } from '../../../app/models/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
@Inject("NotificationService")
export class NotificationsComponent implements OnInit {
  notifications: NotificationFront[] = [];
  selectedNotification: NotificationFront | null = null;
  showNotifications = false;
  showModal = false;

  notificationService = new NotificationService();

  ngOnInit() {
    // this.notifications = [
    //   //Por si se necesita objectos.
    //   {
    //     "id": 10,
    //     "recipient": "example@example.com",
    //     "contactId": 10,
    //     "subject": "Bienvenido a nuestro servicio",
    //     "templateId": 101,
    //     "body": "Hola, bienvenido a nuestra plataforma. ¡Estamos emocionados de tenerte con nosotros!",
    //     "dateSend": new Date("2024-10-26T10:00:00Z"),
    //     "isRead": false,
    //     "statusSend": "Enviado",
    //     "dateNotification": "2024-10-26T09:00:00Z"
    //   },
    //   {
    //     "id": 11,
    //     "recipient": "usuario1@example.com",
    //     "contactId": 11,
    //     "subject": "Confirmación de tu pedido",
    //     "templateId": 102,
    //     "body": "Gracias por tu compra. Tu pedido ha sido confirmado.",
    //     "dateSend": new Date("2024-10-25T15:30:00Z"),
    //     "isRead": true,
    //     "statusSend": "Entregado",
    //     "dateNotification": "2024-10-25T15:00:00Z"
    //   },
    //   {
    //     "id": 12,
    //     "recipient": "usuario2@example.com",
    //     "contactId": 12,
    //     "subject": "Restablecimiento de contraseña",
    //     "templateId": 103,
    //     "body": "Has solicitado restablecer tu contraseña. Haz clic en el enlace a continuación para continuar.",
    //     "dateSend": new Date("2024-10-24T08:45:00Z"),
    //     "isRead": false,
    //     "statusSend": "Pendiente",
    //     "dateNotification": "2024-10-24T08:30:00Z"
    //   },
    //   {
    //     "id": 13,
    //     "recipient": "usuario3@example.com",
    //     "contactId": 13,
    //     "subject": "Boletín mensual",
    //     "templateId": 104,
    //     "body": "¡Consulta las últimas actualizaciones y noticias en nuestro boletín de octubre!",
    //     "dateSend": new Date("2024-10-23T12:00:00Z"),
    //     "isRead": true,
    //     "statusSend": "Enviado",
    //     "dateNotification": "2024-10-23T11:45:00Z"
    //   },
    //   {
    //     "id": 14,
    //     "recipient": "usuario4@example.com",
    //     "contactId": 14,
    //     "subject": "Verificación de cuenta",
    //     "templateId": 105,
    //     "body": "Por favor, verifica tu cuenta haciendo clic en el enlace que te enviamos.",
    //     "dateSend": new Date("2024-10-22T14:20:00Z"),
    //     "isRead": false,
    //     "statusSend": "Fallido",
    //     "dateNotification": "2024-10-22T14:00:00Z"
    //   },
    //   {
    //     "id": 15,
    //     "recipient": "usuario5@example.com",
    //     "contactId": 15,
    //     "subject": "Recordatorio de evento",
    //     "templateId": 106,
    //     "body": "No olvides nuestro próximo evento. ¡Esperamos verte allí!",
    //     "dateSend": new Date("2024-10-21T18:00:00Z"),
    //     "isRead": false,
    //     "statusSend": "Enviado",
    //     "dateNotification": "2024-10-21T17:30:00Z"
    //   }
    // ];
    
    
    this.notificationService.getAllNotification().subscribe({
      next: (notification) => {
        this.notifications = notification;
        console.log(notification);
      },
      error: (error) => {
        console.error('Error al cargar las notificaciones', error);
      }
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (!this.showNotifications) {
      this.closeModal();
    }
  }


  showNotificationDetails(notification: NotificationFront) {
    this.selectedNotification = notification;
    console.log(notification, this.selectedNotification)
    this.showModal = true;
    notification.isRead = true;
    this.notificationService.isRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
      },
      error: (error) => {
        console.error('Error al actualizar la notificación como leída', error);
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedNotification = null;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const notificationsWrapper = document.querySelector('.notifications-wrapper');
    if (!notificationsWrapper?.contains(target)) {
      this.showNotifications = false;
    }
  }
}
