import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../app/services/notification.service';
import { NotificationApi, NotificationFront } from '../../../app/models/notification';

// interface Notification {
//   id: number;
//   title: string;
//   content: string;
//   isRead: boolean;
//   timestamp: Date;
// }

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
    // Ejemplo de notificaciones  
  //   this.notifications = [
  //     {
  //       id: 1,
  //       title: 'Nueva plantilla creada',
  //       content: this.template,
  //       isRead: false,
  //       timestamp: new Date()
  //     },
  //     {
  //       id: 2,
  //       title: 'Contacto actualizado',
  //       content: 'El contacto <em>Juan Pérez</em> ha sido actualizado.',
  //       isRead: true,
  //       timestamp: new Date(Date.now() - 3600000)
  //     }
  //   ];
  // }

    //Cambiar por getNotificationByContact
    this.notificationService.getAllNotification().subscribe({
      next: (notification) => {
        this.notifications = notification;
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
    this.showModal = true;
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

  // Click fuera del dropdown para cerrarlo
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const notificationsWrapper = document.querySelector('.notifications-wrapper');
    if (!notificationsWrapper?.contains(target)) {
      this.showNotifications = false;
    }
  }
}
