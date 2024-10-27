import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Form, FormsModule } from '@angular/forms';
import { EmailServiceService } from     '../../../app/services/email-service.service';
import { TemplateModelResponse } from '../../../app/models/templateModelResponse';
import { EmailData } from '../../../app/models/emailData';
import { Variable } from '../../../app/models/variables';
import { Base64Service } from '../../../app/services/base64-service.service';
import { TemplatePreviewModel } from '../../../app/models/templatePreviewModel';
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

  @ViewChild('iframePreview', { static: false }) iframePreview!: ElementRef; 

  service = new EmailServiceService();

  base64Service: Base64Service = new Base64Service();

  emailToSend : string = ""
  subject : string = ""
  name : string = ""
  value : string = ""
  templateID: string = '';

  variables : Variable[] = []
  templates : TemplatePreviewModel[] = []

  showModalToRenderHTML: boolean = false;


  ngOnInit(): void {

    this.service.getEmailTemplatesForPreview().subscribe((data) => {
      this.templates = data;

    
    });
  }



 

   previewSelectedTemplate(): void { 
    const selectedTemplate = this.templates.find(t => t.id == this.templateID);

    if (selectedTemplate) {
      this.showModalToRenderHTML = true;
      console.log("selectedTemplate ", selectedTemplate);
      console.log("showModalToRenderHTML ", this.showModalToRenderHTML)

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


  enviar(form : Form) {

    const data : EmailData = {
      recipient: this.emailToSend,
      subject: this.subject,
      variables: this.variables,
      templateId: Number(this.templateID)
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
    this.templateID = '';
    this.variables = []
  }


 


}
