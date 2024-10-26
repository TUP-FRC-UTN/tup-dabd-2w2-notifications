import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../app/models/contact';
import { ContactService } from '../../../app/services/contact.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact-new',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact-new.component.html',
  styleUrl: './contact-new.component.css'
})

@Inject('ContactService')
export class ContactNewComponent {

  selectedContactType: string = '';
  email: string = '';
  phone: string = '';
  isModalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  contactService = new ContactService();

  onContactTypeChange() {
    this.email = '';
    this.phone = '';
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.selectedContactType = '';
    this.email = '';
    this.phone = '';
  }

  sendForm(form: NgForm) {

    if (form.valid) {

      const contact: Contact = {
        id: 1,
        subscriptions: [
          'General',
          'Moderación',
          'Construcción',
          'Pago a empleados',
          'Vencimiento de gastos',
          'Deuda',
          'Factura general',
          'Pago',
          'Usuario',
          'Usuario asociado creado',
          'Salida tardía del trabajador',
          'Inventario',
          'Gasto general'],
        contactValue: this.selectedContactType === 'email' ? this.email : this.phone,
        contactType: this.selectedContactType,
        active: true,
        showSubscriptions: false
      };

      this.contactService.saveContact(contact).subscribe({
        next: (response) => {
          this.showModal('Éxito', 'El contacto ha sido registrado correctamente');
          this.resetForm(form);
        },
        error: (error: HttpErrorResponse) => {
          this.showModal('Error', 'Por favor complete todos los campos requeridos correctamente');
          console.error('Error al enviar el template:', error);
        },
      });


    }


  }

  showModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
