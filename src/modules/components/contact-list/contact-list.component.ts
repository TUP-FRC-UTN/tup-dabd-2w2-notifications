import { Component, ViewChild, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactService } from '../../../app/services/contact.service';
import { Contact } from '../../../app/models/contact';
import { Router } from '@angular/router';
import { stat } from 'fs';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})

@Inject('ContactService')
export class ContactListComponent implements OnInit {

  private readonly router = inject(Router);

  private contactService = new ContactService();

  constructor() {
    this.initializePagination();
  }

  ngOnInit(): void {
    this.getFilteredContacts();
  }

  @ViewChild('editForm') editForm!: NgForm;

  contacts: Contact[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  searchTerm = '';
  isActiveFilter : boolean | undefined;


  isModalOpen = false;
  isEditModalOpen = false;
  modalTitle = '';
  modalMessage = '';


  isDeleteModalOpen = false;
  contactToDelete?: Contact | null = null;


  editingContact: Contact = {
    id: 0,
    subscriptions: [],
    contactValue: '',
    contactType: '',
    active: true,
    showSubscriptions: false,
  };

  getFilteredContacts(): void {
    this.contactService.getAllContactsWithFilters(this.searchTerm, this.isActiveFilter)
    .subscribe(filteredContacts => {
      this.contacts = filteredContacts;
    })
  };

  onSearchTextChange(newSearchText : string) : void {
    this.searchTerm = newSearchText;
    this.getFilteredContacts();

  }


    // Métodos para filtros de estado
    filterByStatus(status: 'all' | 'active' | 'inactive') {
      if(status==='all'){
        this.isActiveFilter=undefined;
      }
      else if(status==='active') {
        this.isActiveFilter = true;
      }
      else if(status==='inactive'){
        this.isActiveFilter=false;
      }
      this.getFilteredContacts();
    }

  onStatusChange(newStatus : boolean | undefined) : void {
    this.isActiveFilter = newStatus;
    this.getFilteredContacts();
  }



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
        this.showModal('Éxito', 'El contacto ha sido actualizado correctamente');
      },
      error: (error: HttpErrorResponse) => {
        this.closeEditModal();
        this.showModal('Error', 'Ha ocurrido un error al intentar actualizar el contacto intente nuevamente...');
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

  initializePagination() {
    this.totalItems = this.contacts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return this.startIndex + this.itemsPerPage;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.initializePagination();
  }


  get filteredContacts(): Contact[] {
    if (!this.searchTerm.trim()) {
      return this.contacts;
    }

    const term = this.searchTerm.toLowerCase();
    return this.contacts.filter(contact =>
      contact.contactValue.toLowerCase().includes(term) ||
      contact.contactType.toLowerCase().includes(term) ||
      contact.subscriptions.some(sub => sub.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
  }

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
    // Implementar lógica de exportación a Excel
    this.showModal('Exportar', 'Exportando a Excel...');
  }

  exportToPDF() {
    // Implementar lógica de exportación a PDF
    this.showModal('Exportar', 'Exportando a PDF...');
  }



  // Método para mostrar información
  showInfo() {
    this.showModal('Información', 'Sistema de gestión de contactos y suscripciones.');
  }
}
