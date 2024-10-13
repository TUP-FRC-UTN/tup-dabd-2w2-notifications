import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Form, FormsModule } from '@angular/forms';
import { EmailServiceService } from '../services/email-service.service';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent {
  //variables : Map<String, String> = new Map<String, String>
  service : EmailServiceService = inject(EmailServiceService);
  emailToSend : string = ""
  subject : string = ""
  name : string = ""
  value : string = ""
  variables : Map<string, string> = new Map<string, string>()
  //templateID : number | undefined
  templateID : number = 0

  enviar(form : Form) {
    //this.service.sendEmail(this.emailToSend, this.subject, this.variables)
    const json = {
      "recipient": this.emailToSend,      // Recipient's email address
      "subject": this.subject,        // Email subject
      "variables": this.variables,
      "template_id": this.templateID            // ID of the template to use
    }
    alert(JSON.stringify(json))
    console.log(json)
  }
  addVariables() {
    if (this.name != null && this.name !== "" && this.value != null && this.value !== "") {
      this.variables.set(this.name, this.value);
      this.name = "";
      this.value = "";
    }    
  }
}
