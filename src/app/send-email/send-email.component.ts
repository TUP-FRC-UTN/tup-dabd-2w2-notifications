import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent {
  variables : Map<String, String> = new Map<String, String>
}
