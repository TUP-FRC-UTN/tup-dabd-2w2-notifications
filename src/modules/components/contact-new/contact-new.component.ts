import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
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

@Inject('ContactsService')
export class ContactNewComponent {

  modalTitle: string = '';
  modalMessage: string = '';
  isModalOpen = false;

  contactTypes: ContactType[] = [];
  contacTypeSelected: string = '';

  contactService: ContactService = new ContactService();


  contact: Contact = {
    id: 0,
    subscriptions: [],
    contactValue: '',
    contactType: ''
  };


  form: FormGroup = new FormGroup({

    id: new FormControl(0),
    contactType: new FormControl('', [Validators.required, Validators.minLength(5)]),
    contactValue: new FormControl('', [Validators.required, Validators.minLength(5)]),
    suscriptions: new FormArray([])

  })



  get suscriptions() {
    return this.form.controls['suscriptions'] as FormArray
  }

  addSuscriptions() {

    const suscription = new FormGroup({

      name: new FormControl('', Validators.required),

    })
    this.suscriptions.push(suscription)

  }

  deleteSuscription(index: number) {

    this.suscriptions.removeAt(index)

  }

  getContactsType() {

    this.contactTypes[0].contactType = "EMAIL";

    // this.contactService.getContactType().subscribe((data) => {

    //   this.contactTypes = data;

    // })
  }



  sendForm() {

    if (this.form.valid) {

      this.contact = this.form.value as Contact

      console.log(this.contact);

      this.contactService.postContact(this.contact).subscribe(

        {
          next: (response) => {
            this.openModal(
              'Éxito',
              'El template se ha guardado de manera correcta.'
            );
            // this.resetForm();
          },
          error: (error: HttpErrorResponse) => {
            this.openModal(
              'Error',
              'Hubo un problema al guardar el template. Por favor, intente nuevamente.'
            );
            console.error('Error al enviar el template:', error);
          },
        });

    }
  }


  openModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.classList.remove('modal-open');
  }

  // private resetForm() {
  //   this.templateName = '';
  //   this.templateBody = '';
  // }

}
