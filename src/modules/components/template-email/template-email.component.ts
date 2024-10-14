import { Component, Inject } from '@angular/core';
import { EmailServiceService } from '../../../app/services/email-service.service'
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './template-email.component.html',
  styleUrl: './template-email.component.css'
})


@Inject('EmailServiceService')
@Inject('HtmlValidationService')

export class TemplateEmailComponent {

  templateName: string = '';
  templateBody: string = '';
  modalTitle: string = '';
  modalMessage: string = '';
  isModalOpen = false;

  emailService: EmailServiceService = new EmailServiceService();


  public async sendForm(form: NgForm) {

    if (form.valid) {

      return await this.sendEmailTemplate(form.value.templateNameModel, form.value.templateBodyModel);

    }

  }


  async sendEmailTemplate(templateName: string, templateBody: string): Promise<void> {

    let response = await this.emailService.sendEmailTemplate(templateName, templateBody);

    if (response.ok != false) {

      this.openModal("Exito", "El template se ha guardado de manera correcta.");
      this.templateName = '';
      this.templateBody = '';

    } else {

      this.openModal("Error", "Ha ocurrido un error intentar nuevamente.");

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



}
