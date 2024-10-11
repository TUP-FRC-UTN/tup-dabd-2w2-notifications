import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject, Injectable } from '@angular/core';
import { EmailServiceService } from '../../../app/services/email-service.service'

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css'
})


export class TemplateListComponent implements OnInit{


  private readonly EmailService = inject(EmailServiceService);
  templates: any[] = [];



  emailService = new EmailServiceService();

  ngOnInit(): void {
   
    this.getEmailTemplates();
  }


  public async getEmailTemplates(): Promise<void> {

    this.templates = await this.emailService.getEmailTemplates();

    return await this.emailService.getEmailTemplates();

  }

}
