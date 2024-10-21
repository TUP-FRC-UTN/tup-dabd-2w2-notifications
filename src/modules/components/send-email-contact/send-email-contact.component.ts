import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmailServiceService } from '../../../app/services/email-service.service';
import { Variable } from '../../../app/models/variables';
import { Contacts } from '../../../app/models/contacts';
import { ContactsService } from '../../../app/services/contacts.service';
import { EmailTemplate } from '../../../app/models/emailTemplates';
import { Base64Service } from '../../../app/services/base64-service.service';
import { EmailDataContact } from '../../../app/models/emailDataContact';

@Component({
  selector: 'app-send-email-contact',
  standalone: true,
  imports: [RouterLink, FormsModule],
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
  serviceContacts = new ContactsService()
  base64Service: Base64Service = new Base64Service();

  allContacts : Contacts[] = []
  allTemplates : EmailTemplate[] = []
  selectedContactId : number = 0
  selectedTemplateId : number = 0
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
        if (contact.contact_type === "EMAIL") {
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
  }
  showContactById(id : number): string {
    let contactName : string = ""
    this.serviceContacts.getContactById(id).subscribe((data) => {
      contactName = data.contact_value
    })
    return contactName
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
      template_id: this.template_id,
      contact_ids: this.contacts_id
    }

    console.log(data);
    
    this.serviceEmail.sendEmailWithContacts(data).subscribe({
      next: (response) => {
        alert("Enviado con exito")
        this.clean()
      },
      error: (errr) => {
        alert("Hubo un error al enviar el correo, pruebe más tarde")
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
