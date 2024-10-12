import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment.development';
import { Base64Service } from './base64-service.service';
@Injectable({
  providedIn: 'root'
})


export class EmailServiceService {

  private readonly http = inject(HttpClient)

  private readonly base64Service = inject(Base64Service);

  public async sendEmailTemplate(templateName: string, templateBody: string): Promise<any> {

    const url = `${env.apiUrl}/email-templates`;

    try {

      const response = await this.http.post<any>(url, { name: templateName, base64body: this.base64Service.encodeToBase64(templateBody) }).toPromise();

      return response?.id != '' ? response : null;

    } catch (error) {

      console.error('Error to send the template, try again please:', error);
      return error;

    }
  }


  public async getEmailTemplates() {

    const url = `${env.apiUrl}/email-templates`;

    try {

      const response = await this.http.get<any>(url).toPromise();

      return response?.length != 0 ? response : null;

    } catch (error) {

      console.error('Error to get templates, try again please:', error);
      return error;

    }  
  }
  /*public async sendEmail(emailToSend: string, subject: string, variables: Map<string, string>) {
    const body = {
        "recipient": emailToSend,      // Recipient's email address
        "subject": subject,        // Email subject
        "variables": variables,
        "template_id": 0            // ID of the template to use
    }
    const url = `${env.apiUrl}/emails/send`
    try{
      const response = await this.http.post<any>(url)
    }
  }*/
}




