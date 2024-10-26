import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactService } from '../../../app/services/contact.service';
import { Contact } from '../../../app/models/contact';
import { Router } from '@angular/router';
import { NgbPagination, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MainContainerComponent } from 'ngx-dabd-grupo01';
import { ToastService } from 'ngx-dabd-grupo01';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbPagination,
    NgbDropdownModule,
    MainContainerComponent
  ],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {


  private router = inject(Router);
  private contactService = inject(ContactService);
  private toastService = inject(ToastService)

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  sizeOptions: number[] = [10, 25, 50];

  // Filtros
  searchTerm = '';
  isActiveContactFilter: boolean | undefined = true;
  selectedContactType: string = '';

  // Datos y estados
  contacts: Contact[] = [{
    id: 1,
    subscriptions: ["Newsletter", "Ofertas"],
    contactType: "Email",
    contactValue: "gbritos13@gmail.com",
    active: true,
    showSubscriptions: false,
  },
  {
    id: 2,
    subscriptions: ["Noticias"],
    contactType: "Email",
    contactValue: "guillee_bmx_13@gmail.com",
    active: true,
    showSubscriptions: false,
  },
  {
    id: 3,
    subscriptions: ["Newsletter", "Promociones", "Eventos"],
    contactType: "Phone",
    contactValue: "123-456-7890",
    active: true,
    showSubscriptions: false,
  }];
  filteredContacts: Contact[] = [];

  // Estados de modales
  isModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  modalTitle = '';
  modalMessage = '';

  // Referencias
  @ViewChild('editForm') editForm!: NgForm;
  contactToDelete: Contact | null = null;
  editingContact: Contact = this.getEmptyContact();

  constructor() {
    this.initializePagination();
  }

  ngOnInit(): void {
    this.loadContacts();
  }

  private getEmptyContact(): Contact {
    return {
      id: 0,
      subscriptions: [],
      contactValue: '',
      contactType: '',
      active: true,
      showSubscriptions: false
    };
  }

  // Carga de datos
  loadContacts() {
    this.contactService
      .getFilteredContactsFromBackend(
        this.isActiveContactFilter,
        this.searchTerm,
        this.selectedContactType
      )
      .subscribe({
        next: (contacts) => {
          this.contacts = contacts;
          this.filteredContacts = [...this.contacts];
          this.updatePagination();
        },
        error: (error) => {
          this.showModal('Error', 'Error al cargar los contactos');
          console.error('Error loading contacts:', error);
        }
      });
  }

  // Filtros
  filterByStatus(status: 'all' | 'active' | 'inactive') {
    this.isActiveContactFilter = status === 'all'
      ? undefined
      : status === 'active';
    this.loadContacts();
  }

  filterByContactType(contactType: string) {
    this.selectedContactType = contactType;
    this.loadContacts();
  }

  onSearchTextChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.loadContacts();
  }

  clearSearch() {
    this.searchTerm = '';
    this.selectedContactType = '';
    this.isActiveContactFilter = true;
    this.loadContacts();
  }

  // Paginación
  initializePagination() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalItems = this.contacts.length;
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadContacts();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadContacts();
  }

  // CRUD Operations
  saveContact() {
    this.router.navigate(['/contact/new']);
  }

  editContact(contact: Contact) {
    this.contactService.updateContact(contact).subscribe({
      next: (response) => {
        const index = this.contacts.findIndex(c => c.id === contact.id);
        if (index !== -1) {
          this.contacts[index] = { ...contact };
        }
        this.closeEditModal();
        this.toastService.sendSuccess('Éxito El contacto ha sido actualizado correctamente')

      },
      error: (error: HttpErrorResponse) => {
        this.toastService.sendError('Error Ha ocurrido un error al intentar actualizar el contacto intente nuevamente...')
        this.closeEditModal();
        console.error('Error al editar el contacto:', error);
      },
    });
  }

  deleteContact(contact: Contact) {
    this.contactService.deleteContact(contact.id).subscribe({
      next: () => {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        this.closeDeleteModal();
        this.showModal('Éxito', 'El contacto ha sido eliminado correctamente');

        this.initializePagination();
      },
      error: (error: HttpErrorResponse) => {
        this.closeDeleteModal();
        this.showModal('Error', 'Ha ocurrido un error al intentar eliminar el contacto. Por favor, intente nuevamente.');
        console.error('Error al eliminar el contacto:', error);
      }
    });
  }

  // Modal handlers
  showModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openEditModal(contact: Contact) {
    this.editingContact = { ...contact };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingContact = {
      id: 0,
      subscriptions: [],
      contactValue: '',
      contactType: '',
      active: true,
      showSubscriptions: false
    };
  }
  openDeleteModal(contact: Contact) {
    this.contactToDelete = contact;
    this.isDeleteModalOpen = true;
  }


  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.contactToDelete = null;
  }

  confirmDelete() {
    if (this.contactToDelete) {
      this.deleteContact(this.contactToDelete);
    }
  }


  saveEditedContact() {
    if (this.editForm.form.valid) {
      this.editContact(this.editingContact);
    }
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
    this.showModal('Información', 'Sistema de gestión de contactos. Aquí puedes administrar todos los contactos del sistema.');
  }

}
