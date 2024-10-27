import { Component, Inject } from '@angular/core';
import { TemplateService } from '../../../app/services/template.service';
import { FormsModule, NgForm } from '@angular/forms';
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

  public async sendForm(form: NgForm) {
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
        this.openModal(
          'Éxito',
          'El template se ha guardado de manera correcta.'
        );
        this.resetForm();
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
}
