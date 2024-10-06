// import { Injectable } from '@angular/core';
// import { ESLint } from 'eslint';

// // Importar las reglas recomendadas de Angular ESLint
// const angularEslintRecommended = require('@angular-eslint/eslint-plugin').configs.recommended;

// @Injectable({
//   providedIn: 'root',
// })
// export class HtmlLintService {
//   private eslint: ESLint;

//   constructor() {
//     // Configurar ESLint de forma simple y válida para su uso programático
//     this.eslint = new ESLint({
//       overrideConfig: {
//         // Definir solo las reglas necesarias
//         rules: {
//           ...angularEslintRecommended.rules,
//           'no-console': 'error',  // Puedes agregar reglas personalizadas
//         },
//       },
//     });
//   }

//   async lintUserInput(input: string): Promise<ESLint.LintResult[]> {
//     // Lint del input del usuario
//     const results = await this.eslint.lintText(input, { filePath: 'input.html' });
//     return results;
//   }
// }
