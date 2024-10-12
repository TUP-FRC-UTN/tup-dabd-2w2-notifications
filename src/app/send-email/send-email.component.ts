import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Form, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent {
  //variables : Map<String, String> = new Map<String, String>
  emailToSend : string = ""
  subject : string = ""
  name : string = ""
  value : string = ""
  variables : Map<string, string> = new Map<string, string>()

  enviar(form : Form) {

  }
  addVariables() {
    if (this.name != null && this.name !== "" && this.value != null && this.value !== "") {
      this.variables.set(this.name, this.value);
      this.name = "";
      this.value = "";
    }    
  }
}
