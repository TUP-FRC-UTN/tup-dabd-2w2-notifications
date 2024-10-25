import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../app/models/contact';
import { ContactService } from '../../../app/services/contact.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactType } from '../../../app/models/contactType';


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

  onContactTypeChange() {
    // Resetear los valores cuando cambia el tipo de contacto
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
      const contactData = {
        type: this.selectedContactType,
        value: this.selectedContactType === 'email' ? this.email : this.phone
      };

      console.log('Datos del formulario:', contactData);
      this.showModal('Éxito', 'El contacto ha sido registrado correctamente');
      this.resetForm(form);
    } else {
      this.showModal('Error', 'Por favor complete todos los campos requeridos correctamente');
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
