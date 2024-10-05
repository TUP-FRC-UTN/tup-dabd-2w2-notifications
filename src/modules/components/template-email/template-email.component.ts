import { Component, Inject } from '@angular/core';
import { EmailServiceService } from '../../../app/services/email-service.service'
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-template-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './template-email.component.html',
  styleUrl: './template-email.component.css'
})

export class TemplateEmailComponent {

  constructor(private emailService: EmailServiceService) { }

  templateName: string = '';
  templateBody: string = '';


  public async sendEmail(templateName: string, templateBody: string): Promise<void> {

    let response = await this.emailService.sendEmailTemplate(templateName, templateBody);

    if (response.ok != false) {
      Swal.fire({
        title: '¡Success!',
        text: 'The template has created successfully',
        icon: 'success',
        confirmButtonText: 'Ok'


      });

      this.templateName = '';
      this.templateBody = '';



    } else {
      Swal.fire({
        title: 'Error',
        text: 'An error ocurred try again',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }
}







