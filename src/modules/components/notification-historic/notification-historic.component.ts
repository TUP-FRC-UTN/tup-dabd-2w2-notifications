import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {  NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Notification } from '../../../app/models/notification';
import { MainContainerComponent } from 'ngx-dabd-grupo01';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../../app/services/notifications.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  //Modal
  modalTitle = '';
  modalMessage = '';
  isModalOpen = false;


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

      this.notificationService.getAllNotifications()
      .subscribe(response => {
        this.notifications = response; 
        this.filteredNotifications = [...this.notifications];  
        this.totalItems = this.filteredNotifications.length;
      });
      
      this.notifications.push(
        {
          id: 1,
          subject: "Aprovecha esta PROMOCIÓN!",
          recipient: 'gabrielacollazo@hotmail.com',
          templateId: 1,
          templateName: 'Promoción',
          statusSend: 'SENT',
          dateSend: '2002-12-24 17:12',
        },
        {
          id: 2,
          subject: "Pago de Epec rechazado",
          recipient: 'jorge@example.com',
          templateId: 2,
          templateName: 'Cuenta',
          statusSend: 'VISUALIZED',
          dateSend: '2024-05-15 03:16',
        },
        {
          id: 3,
          recipient: 'maria@example.com',
          subject: "Su comentario ha sido enviado",
          templateId: 1,
          templateName: 'Comentarios',
          statusSend: 'SENT',
          dateSend:'2024-01-30 19:46',
        },
        {
          id: 4,
          recipient: 'luisa@example.com',
          subject: "Te recordamos el cumpleaños de ...",
          templateId: 3,
          templateName: 'Recordatorio',
          statusSend: 'VISUALIZED',
          dateSend: '2023-11-05 15:31',
        },
        {
          id: 5,
          recipient: 'pablo@example.com',
          subject: "Confirmación de envío de producto",
          templateId: 2,
          templateName: 'Confirmación',
          statusSend: 'SENT',
          dateSend: '2023-10-01 12:00',
        },
      );
      
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
        console.log(this.emailFilter)
        console.log(notification.recipient)
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
    const data = this.filteredNotifications.map((notification) => ({
      Usuario: notification.recipient,
      'Tipo de Notificación': notification.templateName,
      Fecha: notification.dateSend,
      Estado: notification.statusSend === "VISUALIZED" ? "VISTO" : "NO VISTO",
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notificaciones');
    const now = new Date();
    const dateTime = `${now.toLocaleDateString().replace(/\//g, '-')}_${now.getHours()}-${now.getMinutes()}`;
    const fileName = `Notificaciones-${dateTime}.xlsx`; // Nombre del archivo
    XLSX.writeFile(wb, fileName);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Notificaciones', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Usuario', 'Tipo de Notificación', 'Fecha', 'Estado']],
      body: this.filteredNotifications.map((notification) => [
        notification.recipient,
        notification.templateName,
        notification.dateSend,
        notification.statusSend === "VISUALIZED" ? "VISTO" : "NO VISTO",
      ]),
      columnStyles: {
        0: { cellWidth: 60 }, // Usuario
        1: { cellWidth: 60 }, // Tipo de Notificación
        2: { cellWidth: 40 }, // Fecha
        3: { cellWidth: 30 }, // Estado
      },
      styles: { overflow: 'linebreak' },
    });

    const now = new Date();
    const dateTime = `${now.toLocaleDateString().replace(/\//g, '-')}_${now.getHours()}-${now.getMinutes()}`;
    const fileName = `Notificaciones-${dateTime}.pdf`;

    doc.save(fileName);
    console.log('PDF generado');
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

  // Modal handlers
  showModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalOpen = true;
  }

  showInfo() {
    const message = `
      <strong>Sistema de control de notificaciones</strong><br>
      Aquí puedes visualizar todos las notificaciones del sistema.<br><br>

      <strong>Iconografía:</strong><br>
      Visto: <i class="bi bi-check2-circle text-success large-icon"></i><br>
      No visto: <i class="bi bi-x-circle text-danger large-icon"></i>
    `;

    this.showModal('Información', message);
  }
}