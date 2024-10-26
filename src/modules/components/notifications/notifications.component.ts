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
    this.notificationService.getNotificationByContact().subscribe({
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
