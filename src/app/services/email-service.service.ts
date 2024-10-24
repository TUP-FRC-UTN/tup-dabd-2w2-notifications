import { inject, Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Base64Service } from './base64-service.service';
import { TemplateSendModel } from '../models/templateSendModel';
import { TemplateModelResponse } from '../models/templateModelResponse';
import { EmailData } from '../models/emailData';
import { EmailTemplate } from '../models/emailTemplates';
import { EmailDataContact } from '../models/emailDataContact';
import { environmentNotifications } from '../../environments/environment.development.notifications';
@Injectable({
  providedIn: 'root',
})
@Inject('Base64Service')
export class EmailServiceService {
  
  private readonly http = inject(HttpClient);

  base64Service: Base64Service = new Base64Service();

  sendEmailTemplate(
    template: TemplateSendModel
  ): Observable<TemplateModelResponse> {
    const url = `${environmentNotifications.apiUrl}/email-templates`;

    return this.http.post<TemplateModelResponse>(url, {
      name: template.name,
      base64body: this.base64Service.encodeToBase64(template.body),
    });
  }

  getEmailTemplates() {

    const url = `${environmentNotifications.apiUrl}/email-templates`;

    return this.http.get<TemplateModelResponse[]>(url);
  }

  editEmailTemplate(template:TemplateModelResponse) : Observable<TemplateModelResponse> {

    const url = `${environmentNotifications.apiUrl}/email-templates/` + template.id;

    return this.http.put<TemplateModelResponse>(url, {
      name: template.name,
      base64body: this.base64Service.encodeToBase64(template.base64body),

    });

  }


  getEmailTemplatesNew(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(`${environmentNotifications.apiUrl}/email-templates`)
  }
  sendEmail(data: EmailData) {
    const url = `${environmentNotifications.apiUrl}/emails/send`
    return this.http.post<EmailData>(url, data)
  }
  sendEmailWithContacts(data : EmailDataContact) {
    const url = `${environmentNotifications.apiUrl}/emails/send-to-contacts`
    return this.http.post<EmailDataContact>(url, data)
  }

}
