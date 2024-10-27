import { inject, Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Base64Service } from './base64-service.service';
import { environment } from '../../environments/environment';
import { TemplateModel } from '../models/templates/templateModel'

@Injectable({
  providedIn: 'root',
})
@Inject('Base64Service')
export class TemplateService {

  private readonly http = inject(HttpClient);

  private apiUrl = environment.apis.notifications.url;

  base64Service: Base64Service = new Base64Service();

  getAllTemplates(): Observable<TemplateModel[]> {

    return this.http.get<any[]>(`${this.apiUrl + "/email-templates"}`).pipe(
      map(x => x.map(y => this.transformToTemplate(y)))
    );
  }

  sendTemplate(template: TemplateModel): Observable<TemplateModel> {

    const apiTemplate = this.transformToApiTemplate(template);
    return this.http.post<any>(`${this.apiUrl}/email-templates`, apiTemplate).pipe(
      map(response => this.transformToTemplate(response))
    );
  }

  updateTemplate(template: TemplateModel): Observable<TemplateModel> {

    const apiContact = this.transformToApiTemplateBase64(template);

    return this.http.put<any>(`${this.apiUrl}/email-templates/${template.id}`, apiContact).pipe(
      map(response => this.transformToTemplate(response))
    );
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/email-templates/${id}`);
  }


  private transformToTemplate(data: any): TemplateModel {
    return {
      id: data.id,
      name: data.name,
      body: data.body,
      active: data.active,
    };
  };

  private transformToApiTemplate(template: TemplateModel): any {
    return {
      name: template.name,
      base64body: this.base64Service.encodeToBase64(template.body)
    };
  }

  private transformToApiTemplateBase64(template: TemplateModel): any {
    return {
      id: template.id,
      name: template.name,
      base64body: this.base64Service.encodeToBase64(template.body),
    };
  }

}
