import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Form, FormsModule } from '@angular/forms';
import { EmailServiceService } from '../services/email-service.service';
import { EmailTemplate } from '../models/emailTemplates';
import { EmailData } from '../models/emailData';
import { Variable } from '../models/variables';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent implements OnInit{

  service : EmailServiceService = inject(EmailServiceService);

  emailToSend : string = ""
  subject : string = ""
  name : string = ""
  value : string = ""
  templateID : number = 0

  variables : Variable[] = []
  templates : EmailTemplate[] = []

  ngOnInit(): void {
    this.service.getEmailTemplatesNew().subscribe((data) => {
      this.templates = data
    })
  }

  enviar(form : Form) {

    const data : EmailData = {
      recipient: this.emailToSend,
      subject: this.subject,
      variables: this.variables,
      template_id: this.templateID
    }
    
    console.log(data)
    this.service.sendEmail(data).subscribe({
      next: (data) => {
        alert("Enviado con exito")
        this.clean()
      },
      error: (errr) => {
        alert("Hubo un error al enviar el correo, pruebe más tarde")
      }
    })
    //this.clean()
  }
  addVariables() {
    if (this.name != null && this.name !== "" && this.value != null && this.value !== "") {

      const newVariable : Variable = {
        key : this.name,
        value : this.value
      }

      this.variables.push(newVariable)
      this.name = "";
      this.value = "";
    }    
  }
  clean() {
    this.emailToSend = ""
    this.subject = ""
    this.name = ""
    this.value = ""
    this.templateID = 0
    this.variables = []
  }
}
