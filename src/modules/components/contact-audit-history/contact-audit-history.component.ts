import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbPagination, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MainContainerComponent } from 'ngx-dabd-grupo01';
import {  ContactAudit } from '../../../app/models/contacts/contactAudit';
import { ContactAuditService } from '../../../app/services/contact-audit.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-contact-audit-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbPagination,
    NgbDropdownModule,
    MainContainerComponent
  ],
  templateUrl: './contact-audit-history.component.html',
  styleUrl: './contact-audit-history.component.css'
})
export class ContactAuditHistoryComponent implements OnInit {

  
  isLoading: boolean = true;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  sizeOptions: number[] = [10, 25, 50];


  // Filtros
  searchTerm = '';
  selectedContactType: string = '';

  //Datos y estados
  contactAuditItems: ContactAudit[] = [];
  filteredContactAuditItems: ContactAudit[]=[];

  // Estados de modales
  isInformationModalOpen = false;
  informationModalTitle = '';
  informationModalMessage = '';
  selectedContactAudit: ContactAudit | null = null;

   //Estado de filtors
   showInput: boolean = false;


  // Modal handlers
  showInformationModal(title: string, message: string) {
    this.informationModalTitle = title;
    this.informationModalMessage = message;
    this.isInformationModalOpen = true;
  }

  closeInformationModal() {
    this.isInformationModalOpen = false;
  }


  exportToExcel() {
    // Implementar la lógica de exportación a Excel
    console.log('Exportando a Excel...');
  }

  exportToPDF() {
    // Implementar la lógica de exportación a PDF
    console.log('Exportando a PDF...');
  }


  showInfo() {
    const message = `
      <strong>Sistema de gestión de contactos</strong><br>
      Aquí puedes administrar todos los contactos del sistema.<br><br>

      <strong>Iconografía:</strong><br>
      Activos: <i class="bi bi-check2-circle text-success large-icon"></i><br>
      Inactivos: <i class="bi bi-x-circle text-danger large-icon"></i>
    `;

    this.showInformationModal('Información', message);
  }

  
  // Paginación
  initializePagination() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalItems = this.contactAuditItems.length;
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadData();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  
  

  private subscription = new Subscription()


  private readonly contactAuditService = inject(ContactAuditService)


  loadData():void {
    this.isLoading = true;
    this.subscription.add(
      this.contactAuditService.getContactAudits().subscribe({
        next: (data : ContactAudit[]) => 
        {
          console.log('Datos que llegan al componente: ', data)
          this.contactAuditItems = data;
        }
         
      })
    )
  }

  ngOnInit():void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  clearSearch() {
    this.searchTerm = '';
    this.selectedContactType = '';
    this.showInput = false; // Ocultar input al limpiar
    this.loadData();
  }

  filterByContactType(contactType: string): void {
    //Implementar logica de filtrado por frontend
    this.showInput = true;
  }

  onSearchTextChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.getFilteredContactAudits();
  }

  
  getFilteredContactAudits(): void {
    //Implementar lógica de filtrado para todos
  }








  


}
