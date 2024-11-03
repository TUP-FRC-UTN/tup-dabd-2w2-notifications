import { Component, inject, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TemplateService } from '../../../app/services/template.service';
import { Variable } from '../../../app/models/variables';
import { ContactModel } from '../../../app/models/contacts/contactModel';
import { ContactService } from '../../../app/services/contact.service';
import { TemplateModel } from '../../../app/models/templates/templateModel';
import { Base64Service } from '../../../app/services/base64-service.service';
import { EmailDataContact } from '../../../app/models/notifications/emailDataContact';
import { CommonModule } from '@angular/common';
import { ToastService } from 'ngx-dabd-grupo01';
import { EmailService } from '../../../app/services/emailService';

@Component({
  selector: 'app-send-email-contact',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './send-email-contact.component.html',
  styleUrl: './send-email-contact.component.css'
})
@Inject('TemplateService')
@Inject('EmailService')
@Inject('ContactService')
@Inject('Base64Service')
export class SendEmailContactComponent implements OnInit {

  subjectToSend: string = ""
  variables: Variable[] = []
  template_id: string = '';
  contacts_id: number[] = []

  templateService = new TemplateService()
  emailService = new EmailService();
  serviceContacts = new ContactService()
  base64Service: Base64Service = new Base64Service()
  toastService: ToastService = inject(ToastService)

  allContacts: ContactModel[] = []
  allTemplates: TemplateModel[] = []
  selectedContactId: number | null = null
  variableName: string = ""
  variableValue: string = ""

  //Estado para modal de preview template
  showModalToRenderHTML: boolean = false;

  //ViewChild para preview de template
  @ViewChild('iframePreview', { static: false }) iframePreview!: ElementRef;



  ngOnInit(): void {
    this.serviceContacts.getAllContacts().subscribe((data) => {
      this.allContacts = data
        .filter(contact => contact.contactType === "Correo eléctronico")
        .sort((a, b) => a.contactValue.localeCompare(b.contactValue));
    });
    this.templateService.getAllTemplates().subscribe((data) => {
      this.allTemplates = data
    })
  }
  addContact() { //CAMBIOS
    if (this.selectedContactId) {
      this.contacts_id.push(this.selectedContactId)
    }
    this.selectedContactId = null
  }
  showContactById(id: number): string {
    const contact = this.allContacts.find(contact => contact.id == id);
    return contact ? contact.contactValue : '';
  }
  addVariables() {
    if (this.variableName != null && this.variableName !== "" && this.variableValue != null && this.variableValue !== "") {

      const newVariable: Variable = {
        key: this.variableName,
        value: this.variableValue
      }

      this.variables.push(newVariable)
      this.variableName = "";
      this.variableValue = "";
    }
  }
  submit() {
    const data: EmailDataContact = {
      subject: this.subjectToSend,
      variables: this.variables,
      templateId: Number(this.template_id),
      contactIds: this.contacts_id
    }
    this.emailService.sendEmailWithContacts(data).subscribe({
      next: (response) => {
        this.toastService.sendSuccess("Enviado con exito")
        this.clean()
      },
      error: (errr) => {
        this.toastService.sendError("Hubo un error al enviar el correo, pruebe más tarde")
      }
    })
  }
  clean() {
    this.subjectToSend = ""
    this.variables = []
    this.template_id = ''
    this.contacts_id = []
  }

  //Previsualizacion de template

  previewSelectedTemplate(): void {
    const selectedTemplate = this.allTemplates.find(t => t.id == parseInt(this.template_id));
    console.log('selectedTemplate: ', selectedTemplate)

    if (selectedTemplate) {
      this.showModalToRenderHTML = true;
      // Colocamos el contenido HTML de la plantilla en el iframe
      setTimeout(() => {
        const iframe = this.iframePreview.nativeElement as HTMLIFrameElement;
        iframe.srcdoc = selectedTemplate.body;
        iframe.onload = () => {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDocument) {
            const height = iframeDocument.documentElement.scrollHeight;
            iframe.style.height = `${height}px`;
          }
        };
      }, 5);
    }
  }

  closeModalToRenderHTML() {
    this.showModalToRenderHTML = false;
  }

  //Agregado probar

  /* toggleContactSelection(contactId: number) {
    const index = this.contacts_id.indexOf(contactId);
    if (index === -1) {
      this.contacts_id.push(contactId); // Agregar si no está en la lista
    } else {
      this.contacts_id.splice(index, 1); // Quitar si ya está en la lista
    }
  }
  trackByContactId(index: number, contact: ContactModel): number {
    return contact.id;
  }
    */



  

  showContactModal: boolean = false;
  selectedContacts: any[] = []; // Lista de contactos seleccionados (con detalles)

   // Agregar la variable para controlar la visibilidad del modal
   openContactSelectionModal() {
    this.showContactModal = true;
  }

  closeContactSelectionModal() {
    this.showContactModal = false;
  }

  confirmContactSelection() {
    // Al confirmar, actualizamos la lista de contactos seleccionados
    this.selectedContacts = this.allContacts.filter(contact => 
      this.contacts_id.includes(contact.id)
    );
    this.showContactModal = false;
  }

  toggleContactSelection(contactId: number) {
    const index = this.contacts_id.indexOf(contactId);
    if (index === -1) {
      this.contacts_id.push(contactId); // Agregar si no está en la lista
    } else {
      this.contacts_id.splice(index, 1); // Quitar si ya está en la lista
    }
  }

  trackByContactId(index: number, contact: any): number {
    return contact.id;
  }
  
  


}
