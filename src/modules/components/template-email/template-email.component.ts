import { Component, Inject, inject } from '@angular/core';
import { ToastService } from 'ngx-dabd-grupo01';
import { TemplateService } from '../../../app/services/template.service';
import { AbstractControl, FormsModule, NgForm, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TemplateModel } from '../../../app/models/templates/templateModel';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-template-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './template-email.component.html',
  styleUrl: './template-email.component.css',
})
@Inject('TemplateService')
@Inject('HtmlValidationService')
export class TemplateEmailComponent {
  templateName: string = '';
  templateBody: string = '';
  modalTitle: string = '';
  modalMessage: string = '';
  isModalOpen = false;

  template: TemplateModel = {
    id: 0,
    name: '',
    body: '',
    active: true
  };

  templateService: TemplateService = new TemplateService();
  toastService: ToastService = inject(ToastService);

  public async sendForm(form: NgForm) {
    // Agrega el validador a templateBody
    const templateBodyControl = form.controls['templateBodyModel'];
    templateBodyControl.setValidators([this.isValidHTML()]);
    templateBodyControl.updateValueAndValidity();

    if (form.valid) {
      return await this.sendEmailTemplate(
        form.value.templateNameModel,
        form.value.templateBodyModel
      );
    }
  }

  async sendEmailTemplate(templateName: string, templateBody: string) {

    this.template.name = templateName;
    this.template.body = templateBody;

    this.templateService.sendTemplate(this.template).subscribe({
      next: (response) => {
        this.toastService.sendSuccess("Plantilla guardada correctamente")
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
         this.toastService.sendError("Hubo un error guardando la plantilla");
        console.error('Error al enviar el template:', error);
      },
    });
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

  private resetForm() {
    this.templateName = '';
    this.templateBody = '';
  }
  isValidHTML(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const html = control.value;
  
      if (!html) {
        return null; // No hay valor, no se aplica la validación
      }
  
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
  
      const isValid = !doc.getElementsByTagName('parsererror').length; // Verifica si hay errores
  
      return isValid ? null : { invalidHtml: true }; // Retorna un objeto de error si es inválido
    };
  }
  
}
