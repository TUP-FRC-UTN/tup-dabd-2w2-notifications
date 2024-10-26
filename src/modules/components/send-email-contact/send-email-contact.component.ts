import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmailServiceService } from '../../../app/services/email-service.service';
import { Variable } from '../../../app/models/variables';
import { Contact } from '../../../app/models/contact';
import { ContactService } from '../../../app/services/contact.service';
import { EmailTemplate } from '../../../app/models/emailTemplates';
import { Base64Service } from '../../../app/services/base64-service.service';
import { EmailDataContact } from '../../../app/models/emailDataContact';
import { CommonModule } from '@angular/common';
import { ToastService } from 'ngx-dabd-grupo01';

@Component({
  selector: 'app-send-email-contact',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './send-email-contact.component.html',
  styleUrl: './send-email-contact.component.css'
})
@Inject('EmailServiceService')
@Inject('ContactsService')
@Inject('Base64Service')
export class SendEmailContactComponent implements OnInit{

  subjectToSend : string = ""
  variables : Variable[] = []
  template_id : number = 0
  contacts_id : number[] = []

  serviceEmail = new EmailServiceService()
  serviceContacts = new ContactService()
  base64Service: Base64Service = new Base64Service()
  toastService : ToastService = inject(ToastService)

  allContacts : Contact[] = []
  allTemplates : EmailTemplate[] = []
  selectedContactId : number = 0
  variableName : string = ""
  variableValue : string = ""

  /*emailDataWithContact = new FormGroup({
    subject : new FormControl(''),
    variables : new FormControl(''),
    template_id : new FormControl(''),
    contact_id : new FormControl('')
  })*/


  ngOnInit(): void {
    this.serviceContacts.getAllContacts().subscribe((data) => {
      data.forEach(contact => {
        if (contact.contactType === "EMAIL") {
          this.allContacts.push(contact)
        }
      })
    })
    this.serviceEmail.getEmailTemplatesNew().subscribe((data) => {
      this.allTemplates = data
    })
  }
  addContact() {
    if (this.selectedContactId != 0) {
      this.contacts_id.push(this.selectedContactId)
    }
    this.selectedContactId = 0
  }
  showContactById(id: number): string {
    const contact = this.allContacts.find(contact => contact.id == id);
    return contact ? contact.contactValue : '';
  }
  addVariables() {
    if (this.variableName != null && this.variableName !== "" && this.variableValue != null && this.variableValue !== "") {

      const newVariable : Variable = {
        key : this.variableName,
        value : this.variableValue
      }

      this.variables.push(newVariable)
      this.variableName = "";
      this.variableValue = "";
    }
  }
  submit() {
    const data : EmailDataContact = {
      subject: this.subjectToSend,
      variables: this.variables,
      templateId: this.template_id,
      contactIds: this.contacts_id
    }
    this.serviceEmail.sendEmailWithContacts(data).subscribe({
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
    this.template_id = 0
    this.contacts_id = []
  }
}
