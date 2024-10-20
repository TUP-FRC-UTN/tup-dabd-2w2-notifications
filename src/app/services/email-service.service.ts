import { inject, Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Base64Service } from './base64-service.service';
import { TemplateSendModel } from '../models/templateSendModel';
import { TemplateModelResponse } from '../models/templateModelResponse';
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
    const url = `${env.apiUrl}/email-templates`;

    return this.http.post<TemplateModelResponse>(url, {
      name: template.name,
      base64body: this.base64Service.encodeToBase64(template.body),
    });
  }

  getEmailTemplates() {
    
    const url = `${env.apiUrl}/email-templates`;

    return this.http.get<TemplateModelResponse[]>(url);
  }

  editEmailTemplate(template:TemplateModelResponse) : Observable<TemplateModelResponse> {

    const url = `${env.apiUrl}/email-templates/` + template.id;

    return this.http.put<TemplateModelResponse>(url, {
      name: template.name,
      base64body: this.base64Service.encodeToBase64(template.base64body),
      
    });
    
  }
}
