import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  showNotifications = false;
  showModal = false;
  selectedNotification: Notification | null = null;

  ngOnInit() {
    // Ejemplo de notificaciones
    this.notifications = [
      {
        id: 1,
        title: 'Nueva plantilla creada',
        content: '<strong>Plantilla de Bienvenida</strong> ha sido creada exitosamente.',
        isRead: false,
        timestamp: new Date()
      },
      {
        id: 2,
        title: 'Contacto actualizado',
        content: 'El contacto <em>Juan Pérez</em> ha sido actualizado.',
        isRead: true,
        timestamp: new Date(Date.now() - 3600000)
      }
    ];
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

  showNotificationDetails(notification: Notification) {
    this.selectedNotification = notification;
    this.showModal = true;
    notification.isRead = true;
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
