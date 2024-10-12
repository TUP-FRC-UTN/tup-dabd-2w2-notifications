import { Component, Inject, OnInit, inject } from '@angular/core';
import { EmailServiceService } from '../../../app/services/email-service.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-template-edition',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './template-edition.component.html',
  styleUrl: './template-edition.component.css'
})


@Inject('EmailServiceService')

export class TemplateEditionComponent implements OnInit {

  templateName: string = '';
  templateBody: string = '';
  modalTitle: string = '';
  modalMessage: string = '';
  isModalOpen = false;
  templateId: any = '';
  template: any;

  private readonly router = inject(ActivatedRoute)

  emailService: EmailServiceService = new EmailServiceService();


  async ngOnInit() {

    this.templateId = this.router.snapshot.paramMap.get('id');

    this.templateName = (await this.emailService.getEmailTemplates())
      .filter((x: any) => x.id == this.templateId)[0].name;

  }

  public async sendForm(form: NgForm) {

    if (form.valid) {

      return await this.editEmailTemplate(form.value.templateBodyName, form.value.templateBodyModel);

    }

  }


  async editEmailTemplate(templateName: string, templateBody: string): Promise<void> {

    let response = await this.emailService.editEmailTemplate(templateName, templateBody, this.templateId);

    if (response.ok != false) {

      this.openModal("Exito", "El template se ha editado de manera correcta.");
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


