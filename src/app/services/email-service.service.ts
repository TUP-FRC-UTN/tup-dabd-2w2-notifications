import { inject, Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Base64Service } from './base64-service.service';
import { TemplateSendModel } from '../models/templateSendModel';
import { TemplateModelResponse } from '../models/templateModelResponse';
import { EmailData } from '../models/emailData';
import { EmailTemplate } from '../models/emailTemplates';
import { EmailDataContact } from '../models/emailDataContact';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
@Inject('Base64Service')
export class EmailServiceService {

  private readonly http = inject(HttpClient);

  private apiUrl = environment.apis.contacts.url;

  base64Service: Base64Service = new Base64Service();

  sendEmailTemplate(
    template: TemplateSendModel
  ): Observable<TemplateModelResponse> {
    const url = `${this.apiUrl}/email-templates`;

    return this.http.post<TemplateModelResponse>(url, {
      name: template.name,
      base64body: this.base64Service.encodeToBase64(template.body),
    });
  }

  getEmailTemplates() {

    const url = `${this.apiUrl}/email-templates`;

    return this.http.get<TemplateModelResponse[]>(url);
  }

  editEmailTemplate(template: TemplateModelResponse): Observable<TemplateModelResponse> {

    const url = `${this.apiUrl}/email-templates/` + template.id;

    return this.http.put<TemplateModelResponse>(url, {
      name: template.name,
      base64body: this.base64Service.encodeToBase64(template.base64body),

    });

  }


  getEmailTemplatesNew(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(`${this.apiUrl}/email-templates`)
  }
  sendEmail(data: EmailData) {
    const url = `${this.apiUrl}/emails/send`
    return this.http.post<EmailData>(url, data)
  }
  sendEmailWithContacts(data: EmailDataContact) {
    const url = `${this.apiUrl}/emails/send-to-contacts`
    return this.http.post<EmailDataContact>(url, data)
  }

}
