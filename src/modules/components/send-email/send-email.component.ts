import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Form, FormsModule } from '@angular/forms';
import { EmailService } from '../../../app/services/emailService';
import { TemplateModel } from '../../../app/models/templates/templateModel';
import { EmailData } from '../../../app/models/notifications/emailData';
import { Variable } from '../../../app/models/variables';
import { Base64Service } from '../../../app/services/base64-service.service';
import { ToastService } from 'ngx-dabd-grupo01';
import { TemplateService } from '../../../app/services/template.service';


@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})

@Inject('EmailService')
@Inject('Base64Service')
@Inject('TemplateService')
export class SendEmailComponent implements OnInit {
  toastService: ToastService = inject(ToastService)

  @ViewChild('iframePreview', { static: false }) iframePreview!: ElementRef;

  emailService = new EmailService();
  templateService = new TemplateService();

  base64Service: Base64Service = new Base64Service();

  emailToSend: string = ""
  subject: string = ""
  name: string = ""
  value: string = ""
  templateID: string = '';

  variables: Variable[] = []
  templates: TemplateModel[] = []

  showModalToRenderHTML: boolean = false;


  ngOnInit(): void {

    this.templateService.getAllTemplates().subscribe((data) => {
      this.templates = data;
    });
  }


  previewSelectedTemplate(): void {

    const selectedTemplate = this.templates.find(t => t.id == parseInt(this.templateID));

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


  enviar(form: Form) {

    const data: EmailData = {
      recipient: this.emailToSend,
      subject: this.subject,
      variables: this.variables,
      templateId: Number(this.templateID)
    }
    this.emailService.sendEmail(data).subscribe({
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

      const newVariable: Variable = {
        key: this.name,
        value: this.value
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
