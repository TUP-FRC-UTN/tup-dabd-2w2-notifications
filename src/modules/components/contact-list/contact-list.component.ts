import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../app/services/contact.service';
import { Contact } from '../../../app/models/contact';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})



@Inject('ContactsService')
export class ContactListComponent {

  private subscriptionVisibility = new Map<number, boolean>();




  contacts: Contact[] = [
    {
      id: 1,
      subscriptions: ["Multas", "Acceso"],
      contactType: "Email",
      contactValue: "gbritos13@gmail.com",
      showSubscriptions: false
    },
    {
      id: 2,
      subscriptions: ["Multas"],
      contactType: "Email",
      contactValue: "guillee_bmx_13@gmail.com",
      showSubscriptions: false
    },
    {
      id: 3,
      subscriptions: ["Multas", "Promociones", "Eventos"],
      contactType: "Phone",
      contactValue: "123-456-7890",
      showSubscriptions: false
    },
    {
      id: 4,
      subscriptions: [],
      contactType: "Email",
      contactValue: "maria.garcia@empresa.com",
      showSubscriptions: false
    },
    {
      id: 5,
      subscriptions: ["Newsletter"],
      contactType: "Phone",
      contactValue: "098-765-4321",
      showSubscriptions: false
    },
    {
      id: 6,
      subscriptions: ["Ofertas", "Eventos"],
      contactType: "Email",
      contactValue: "juan.perez@compañia.com",
      showSubscriptions: false
    }
  ];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  searchTerm = '';
  isModalOpen = false;
  modalTitle = '';
  modalMessage = '';


  constructor() {
    this.initializePagination();
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

  exportToExcel() {
    // Implementar lógica de exportación a Excel
    this.showModal('Export to Excel', 'Exportación a Excel iniciada');
  }

  exportToPdf() {
    // Implementar lógica de exportación a PDF
    this.showModal('Export to PDF', 'Exportación a PDF iniciada');
  }

  editContact(contact: Contact) {
    // Implementar lógica de edición
    console.log('Editando contacto:', contact);
  }

  deleteContact(contact: Contact) {
    // Implementar lógica de eliminación
    console.log('Eliminando contacto:', contact);
  }

  addSubscription(contact: Contact) {
    // Implementar lógica para agregar suscripción
    console.log('Agregando suscripción a:', contact);
  }

  clearSearch() {
    this.searchTerm = '';
    // Implementar lógica de limpieza de filtros
  }

  showInfo() {
    this.showModal('Información', 'Sistema de gestión de contactos y suscripciones.');
  }

  showModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  filterContacts(status: 'all' | 'active' | 'inactive') {
    // Implementar lógica de filtrado
    console.log('Filtrando por estado:', status);
  }

  // Método para filtrar los contactos según el término de búsqueda
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

    // Método para verificar si las suscripciones están visibles
    isSubscriptionVisible(contactId: number): boolean {
      return this.subscriptionVisibility.get(contactId) || false;
    }

    // Método para alternar la visibilidad
    toggleSubscriptions(contact: Contact): void {
      const currentVisibility = this.subscriptionVisibility.get(contact.id) || false;
      this.subscriptionVisibility.set(contact.id, !currentVisibility);
    }


}



