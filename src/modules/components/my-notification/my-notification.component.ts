import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Notification } from '../../../app/models/notification';
import { MainContainerComponent } from 'ngx-dabd-grupo01';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NotificationService } from '../../../app/services/notification.service';


@Component({
  selector: 'app-my-notification',
  standalone: true,
  imports: [CommonModule, NgbPagination, MainContainerComponent, FormsModule],
  templateUrl: './my-notification.component.html',
  styleUrl: './my-notification.component.css'
})
export class MyNotificationComponent implements OnInit {

  notifications: Notification[] = [];
  selectedNotification?: Notification;
  filteredNotifications: Notification[] = [];

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  sizeOptions: number[] = [10, 25, 50];

  // Modal Info
  modalTitle = '';
  modalMessage = '';
  isModalOpen = false;

  // Modal Noti
  modalTitleNoti = '';
  modalMessageNoti = '';
  isModalOpenNoti = false;
  showModalToRenderHTML: boolean = false;

  // Filtros
  searchTerm = '';
  status: string = '';
  dateFrom: string = '';
  dateUntil: string = '';
  emailFilter: string = '';
  currentFilter: string = 'status';

  private notificationService = inject(NotificationService);
  @ViewChild('iframePreview', { static: false }) iframePreview!: ElementRef;

  ngOnInit(): void {
    
    this.loadNotifications();

  }

  constructor() {
    this.initializePagination();
  }

  loadNotifications(): void {
    this.notificationService.getNotificationByContact()
      .subscribe(response => {
        this.notifications = response;
        this.filteredNotifications = [...this.notifications];
        this.totalItems = this.filteredNotifications.length;
      });
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
    this.totalItems = this.filteredNotifications.length;
  }

  filterNotifications(): void {
    this.filteredNotifications = this.notifications.filter(notification => {
      let matches = true;
      if (this.status) {
        matches = matches && notification.statusSend === this.status.toUpperCase();
      }
      if (this.dateFrom) {
        matches = matches && notification.dateSend >= this.dateFrom;
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
    const data = this.filteredNotifications.map((notification) => ({
      Usuario: notification.recipient,
      'Asunto': notification.templateName,
      Fecha: notification.dateSend,
      Estado: notification.statusSend === "VISUALIZED" ? "VISTO" : "PENDIENTE",
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notificaciones');
    const now = new Date();
    const dateTime = `${now.toLocaleDateString().replace(/\//g, '-')}_${now.getHours()}-${now.getMinutes()}`;
    const fileName = `Notificaciones-${dateTime}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
  
  exportToPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Notificaciones', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Usuario', 'Asunto', 'Fecha', 'Estado']],
      body: this.filteredNotifications.map((notification) => [
        notification.recipient,
        notification.templateName,
        new Date(notification.dateSend).toLocaleDateString() + ' ' + new Date(notification.dateSend).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notification.statusSend === "VISUALIZED" ? "VISTO" : "PENDIENTE",
      ]),
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
      },
      styles: { overflow: 'linebreak' },
    });
    const now = new Date();
    const dateTime = `${now.toLocaleDateString().replace(/\//g, '-')}_${now.getHours()}-${now.getMinutes()}`;
    //seteamos nombre pdf
    const fileName = `Notificaciones-${dateTime}`;
    doc.save(fileName+".pdf");
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadNotifications();
  }

  onSearchTextChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.notificationService.getNotificationByContact().subscribe(data => {
      this.filteredNotifications = data.filter(n => n.subject.toUpperCase().includes(this.searchTerm.toUpperCase()))
    })    
  }

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
  showModalInfo(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalOpen = true;
  }

  showModalNoti(title: string, message: string) {
    this.modalTitleNoti = title;
    this.modalMessageNoti = message;
    this.isModalOpenNoti = true;
  }

  verNotification(notification: Notification): void {
    this.selectedNotification = notification;
    const message = notification.body;
    this.isModalOpenNoti = true;
    this.showModalNoti(notification.subject, message);
  }

  showInfo() {
    const message = `
      <strong>Sistema de control de notificaciones</strong><br>
      Aquí puedes visualizar todos las notificaciones del sistema.<br><br>
      <strong>Iconografía:</strong><br>
      Visto: <i class="bi bi-check2-circle text-success large-icon"></i><br>
      No visto: <i class="bi bi-x-circle text-danger large-icon"></i><br>
      Ver: <i class="bi bi-eye text-info" style="font-size: 1.3rem; color:info"></i>
    `;
    this.showModalInfo('Información', message);
  }

  // Pagination
  get paginatedNotifications() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredNotifications.slice(startIndex, endIndex);
  }

  previewContent(notification: Notification): void {
    // Llamar al método isRead para marcar la notificación como leída
    this.notificationService.isRead(notification.id).subscribe(
      () => {
        // Si la actualización fue exitosa, continúa mostrando el contenido
        this.showModalToRenderHTML = true;
        this.selectedNotification = notification;
  
        setTimeout(() => {
          const iframe = this.iframePreview.nativeElement as HTMLIFrameElement;
          iframe.srcdoc = notification.body; // Usa el body de la notificación como contenido del iframe
          iframe.onload = () => {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDocument) {
              const height = iframeDocument.documentElement.scrollHeight;
              iframe.style.height = `${height}px`; // Ajusta la altura del iframe
            }
          };
        }, 5);
      },
      (err) => {
        console.error("Error al marcar la notificación como leída", err);
        // Maneja el error si es necesario
      }
    );
  }

  // Cierra los modales
  closeModal(): void {
    this.isModalOpen = false;
    this.isModalOpenNoti = false;
    this.selectedNotification = undefined;
  }

  closeModalToRenderHTML(): void {
    this.showModalToRenderHTML = false;
  }
}