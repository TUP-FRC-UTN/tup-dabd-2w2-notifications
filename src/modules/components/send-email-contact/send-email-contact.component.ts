import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmailServiceService } from '../../../app/services/email-service.service';

@Component({
  selector: 'app-send-email-contact',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './send-email-contact.component.html',
  styleUrl: './send-email-contact.component.css'
})
export class SendEmailContactComponent {
submit() {
throw new Error('Method not implemented.');
}
  emailDataWithContact = new FormGroup({
    subject : new FormControl(''),
    variables : new FormControl(''),
    template_id : new FormControl(''),
    contact_id : new FormControl('')
  })

  service : EmailServiceService = inject(EmailServiceService)
}
