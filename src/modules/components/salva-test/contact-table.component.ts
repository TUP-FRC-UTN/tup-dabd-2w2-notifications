


import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-table',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './contact-table.component.html',
  styleUrls: ['./contact-table.component.scss']
})
export class ContactTableComponent implements OnInit {
  contacts: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  searchTerm = '';

  constructor() {}

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return this.startIndex + this.itemsPerPage;
  }

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    // Simular datos de ejemplo
    this.contacts = [
      { name: 'gbritos13@gmail.com', type: 'Email' },
      { name: 'guille_bmx@gmail.com', type: 'Email' },
      // ... más datos
    ];

    this.updatePagination();
  }

  updatePagination() {
    this.totalItems = this.contacts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
    // Asegurarse de que la página actual es válida con el nuevo tamaño
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1; // Resetear a la primera página
    this.updatePagination();
  }
}
