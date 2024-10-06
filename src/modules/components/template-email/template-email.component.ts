import { Component, Inject } from '@angular/core';
import { EmailServiceService } from '../../../app/services/email-service.service'
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
// import { HtmlLintService } from '../../../app/services/html-lint-service.service';




@Component({
  selector: 'app-template-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './template-email.component.html',
  styleUrl: './template-email.component.css'
})

export class TemplateEmailComponent {

  constructor(private emailService: EmailServiceService /*, private htmlLintService: HtmlLintService*/) { }

  templateName: string = '';
  templateBody: string = '';
  lintResults: any[] = [];




  public async sendEmail(templateName: string, templateBody: string): Promise<void> {



    // const lintResults = await this.htmlLintService.lintUserInput(this.templateBody);
    // this.lintResults = lintResults[0].messages;


    // if (this.isValidHTML(templateBody)) {


    //   console.log("ES VALIDO")

    // } else {

    //   console.log("NO ES VALIDO")


    // }


    // return;


    let response = await this.emailService.sendEmailTemplate(templateName, templateBody);

    if (response.ok != false) {
      Swal.fire({
        title: '¡Success!',
        text: 'The template has created successfully',
        icon: 'success',
        confirmButtonText: 'Ok'


      });

      this.templateName = '';
      this.templateBody = '';



    } else {
      Swal.fire({
        title: 'Error',
        text: 'An error ocurred try again',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  // isValidHTML(input: string): boolean {



  //   console.log('Iniciando validación de HTML');

  //   if (!input || typeof input !== 'string') {
  //     console.log('Input inválido: está vacío o no es una cadena');
  //     return false;
  //   }

  //   if (!/\<[a-z][\s\S]*\>/i.test(input)) {
  //     console.log('Input inválido: no contiene etiquetas HTML');
  //     return false;
  //   }

  //   // Regex más inclusivo para atributos de Angular
  //   const angularAttributesRegex = /\[([\w\.\-]+)\]|\([\w\.\-]+\)|\[\([\w\.\-]+\)\]/g;
  //   const cleanedInput = input.replace(angularAttributesRegex, 'data-angular-attr');
  //   console.log('Input limpio de atributos Angular:', cleanedInput);

  //   // Lista de etiquetas que se cierran automáticamente
  //   const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

  //   // Contar etiquetas manualmente
  //   const tags = cleanedInput.match(/<\/?[a-z][\s\S]*?>/gi) || [];
  //   let openTags: { name: string, index: number }[] = [];

  //   for (let i = 0; i < tags.length; i++) {
  //     const tag = tags[i];
  //     console.log(`Procesando tag ${i}:`, tag);

  //     if (tag.startsWith('</')) {
  //       // Etiqueta de cierre
  //       const tagName = tag.slice(2, -1).toLowerCase();
  //       if (openTags.length > 0 && openTags[openTags.length - 1].name === tagName) {
  //         openTags.pop();
  //       } else {
  //         console.log('Etiqueta de cierre sin correspondencia:', tag);
  //         console.log('Etiquetas abiertas en este punto:', openTags.map(t => t.name));
  //         return false;
  //       }
  //     } else {
  //       // Etiqueta de apertura
  //       const tagName = tag.slice(1).split(/\s/)[0].toLowerCase();
  //       if (!selfClosingTags.includes(tagName) && !tag.endsWith('/>')) {
  //         openTags.push({ name: tagName, index: i });
  //       }
  //     }

  //     console.log('Estado actual de openTags:', openTags.map(t => t.name));
  //   }

  //   if (openTags.length !== 0) {
  //     console.log('Etiquetas no cerradas:', openTags.map(t => t.name));
  //     return false;
  //   }

  //   console.log('HTML validado correctamente');
  //   return true;


  // }




}







