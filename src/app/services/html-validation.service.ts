// import { Injectable } from '@angular/core';
// const { JSDOM } = require('jsdom');

// @Injectable({
//   providedIn: 'root'
// })

// export class HtmlValidationService {

//   constructor() { }


//   validateHTML(htmlContent: string): boolean {

//     try {

//       const dom = new JSDOM(htmlContent);
//       const document = dom.window.document;

//       if (!document.querySelector('html') || !document.querySelector('head') || !document.querySelector('body')) {
//         console.error('El documento no tiene la estructura básica de HTML.');
//         return false;
//       }

//       const links = document.querySelectorAll('a');
//       links.forEach((x: HTMLAnchorElement) => {
//         const href = x.getAttribute('href');
//         if (!href || href.includes('{{')) {

//         }
//       });
//       return true;
//     } catch (error) {
//       console.error('Error al procesar el HTML:', error);
//       return false;
//     }
//   }


// }
