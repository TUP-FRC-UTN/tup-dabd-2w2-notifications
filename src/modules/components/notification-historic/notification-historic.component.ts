import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {  NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Notification } from '../../../app/models/notification';
import { MainContainerComponent } from 'ngx-dabd-grupo01';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../../app/services/notifications.service';
@Component({
  selector: 'app-notification-historic',
  standalone: true,
  imports: [CommonModule, NgbPagination,  MainContainerComponent, FormsModule],
  templateUrl: './notification-historic.component.html',
  styleUrl: './notification-historic.component.css'
})
export class NotificationHistoricComponent implements OnInit {
  notifications: Notification[] = [];
  selectedNotification?: Notification;
  filteredNotifications: Notification[] = [];

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  sizeOptions: number[] = [10, 25, 50];


   // Filtros
   searchTerm = '';
   status: string = '';
   dateFrom: string = '';
   dateUntil:string = '';
  emailFilter:string = '';
  currentFilter: string = 'status';
  private notificationService = inject(NotificationsService);
  ngOnInit(): void {
    this.loadNotifications();
  }
  constructor() {
    this.initializePagination();
  }

  loadNotifications(): void {

   /*    this.notificationService.getAllNotifications()
      .subscribe(response => {
        this.notifications = response;
        this.filteredNotifications = [...this.notifications];
        this.totalItems = this.filteredNotifications.length;
      });
 */

       this.notifications =   [
        {
          id: 1,
          recipient: 'gabrielacollazo@hotmail.com',
          templateId: 1,
          templateName: 'Promoción',
          statusSend: 'ENVIADO',
          dateSend: '2002-12-24',
        },
        {
          id: 2,
          recipient: 'jorge@example.com',
          templateId: 2,
          templateName: 'Cuenta',
          statusSend: 'VISUALIZADO',
          dateSend: '2024-05-15',
        },
        {
          id: 3,
          recipient: 'maria@example.com',
          templateId: 1,
          templateName: 'Comentarios',
          statusSend: 'ENVIADO',
          dateSend:'2024-01-30',
        },
        {
          id: 4,
          recipient: 'luisa@example.com',
          templateId: 3,
          templateName: 'Recordatorio',
          statusSend: 'VISUALIZADO',
          dateSend: '2023-11-05',
        },
        {
          id: 5,
          recipient: 'pablo@example.com',
          templateId: 2,
          templateName: 'Confirmación',
          statusSend: 'ENVIADO',
          dateSend: '2023-10-01',
        },
      ];

      this.filteredNotifications = [...this.notifications];
      this.totalItems = this.filteredNotifications.length;
  }

  clearFilters(): void {
    this.currentFilter = 'Todos';
    this.dateFrom = '';
    this.dateUntil = '';
    this.status = '';
    this.emailFilter = '';
    this.searchTerm = '';

    this.filteredNotifications = [...this.notifications];
    this.totalItems = this.filteredNotifications.length; // Actualizar el total de items visibles
  }

  filterNotifications(): void {

    this.filteredNotifications = this.notifications.filter(notification => {
      let matches = true;

      if (this.status) {
        matches = matches && notification.statusSend === this.status.toUpperCase();
      }

      if (this.dateFrom) {
        matches = matches && notification?.dateSend >= this.dateFrom;
      }
      if (this.dateUntil) {
        matches = matches && notification.dateSend <= this.dateUntil;
      }

      if (this.emailFilter) {
        matches = matches && notification.recipient.includes(this.emailFilter);
      }

      return matches;
    });
    this.totalItems = this.filteredNotifications.length;

  }


  onFilterChange(filter: string) {
    this.currentFilter = filter;

    if (filter === 'Usuario') {
      this.status = '';
      this.dateFrom = '';
      this.dateUntil = '';
    } else if (filter === 'Fecha') {
      this.status = '';
      this.emailFilter = '';
    } else if (filter === 'Estado') {
      this.emailFilter = '';
      this.dateFrom = '';
      this.dateUntil = '';
    }

  this.filterNotifications();
  }


  exportToExcel(): void {
   alert("Descargando excel")
  }

  exportToPDF(): void {
    alert("Descargando PDF")
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadNotifications();
  }

  onSearchTextChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.loadNotifications();
  }
 // Paginación
  initializePagination() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalItems = this.notifications.length;
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadNotifications();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadNotifications();
  }


}
