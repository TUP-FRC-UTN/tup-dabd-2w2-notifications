import { inject, Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment.development';
import { Base64Service } from './base64-service.service';
@Injectable({
  providedIn: 'root'
})


@Inject("Base64Service")
export class EmailServiceService {

  private readonly http = inject(HttpClient)

  base64Service: Base64Service = new Base64Service();

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

      return response?.length != 0 ? response.map((x: any) => { return { id: x.id, name: x.name, body: this.base64Service.decodeFromBase64(x.base64body) } }) : null;

    } catch (error) {

      console.error('Un error ha ocurrido al obtener los templates, re intente nuevamente.', error);
      return error;

    }


  }

  public async editEmailTemplate(templateName: string, templateBody: string, id: string): Promise<any> {

    const url = `${env.apiUrl}/email-templates/` + id;

    try {

      const response = await this.http.put<any>(url, { name: templateName, base64body: this.base64Service.encodeToBase64(templateBody) }).toPromise();

      return response?.id != '' ? response : null;

    } catch (error) {

      console.error('Un error ha ocurrido al tratar de actualizar el template intente nuevamente...', error);
      return error;

    }
  }

}




