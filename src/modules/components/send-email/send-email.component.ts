import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { Form, FormsModule } from '@angular/forms';
import { EmailServiceService } from     '../../../app/services/email-service.service';
import { TemplateModelResponse } from '../../../app/models/templateModelResponse';
import { EmailData } from '../../../app/models/emailData';
import { Variable } from '../../../app/models/variables';
import { Base64Service } from '../../../app/services/base64-service.service';
import { ToastService } from 'ngx-dabd-grupo01';


@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})

@Inject('EmailServiceService')
@Inject('Base64Service')
export class SendEmailComponent implements OnInit{
  toastService : ToastService = inject(ToastService)

  service = new EmailServiceService();

  base64Service: Base64Service = new Base64Service();

  emailToSend : string = ""
  subject : string = ""
  name : string = ""
  value : string = ""
  templateID : number = 0

  variables : Variable[] = []
  templates : TemplateModelResponse[] = []

  ngOnInit(): void {

    this.service.getEmailTemplates().subscribe((data) => {
      this.templates = data;

      this.templates.forEach((x, index) => {
        this.templates[index].base64body = this.base64Service.decodeFromBase64(
          x.base64body
        );
      });
    });
  }

  enviar(form : Form) {

    const data : EmailData = {
      recipient: this.emailToSend,
      subject: this.subject,
      variables: this.variables,
      templateId: this.templateID
    }
    this.service.sendEmail(data).subscribe({
      next: (data) => {
        this.toastService.sendSuccess("Enviado con exito")
        this.clean()
      },
      error: (errr) => {
        this.toastService.sendError("Hubo un error al enviar el correo, pruebe más tarde")
      }
    })
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
