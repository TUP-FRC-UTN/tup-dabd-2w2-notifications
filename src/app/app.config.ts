import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideClientHydration, } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withComponentInputBinding()),
  provideClientHydration(), provideHttpClient(),
  importProvidersFrom(BsDatepickerModule.forRoot()),
  { provide: BsDatepickerModule, useClass: BsDatepickerModule }
  ]
};
