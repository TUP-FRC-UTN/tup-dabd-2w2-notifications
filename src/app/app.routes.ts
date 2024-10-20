import { Routes } from '@angular/router';

import { TemplateEmailComponent } from '../modules/components/template-email/template-email.component';
import { TemplateListComponent } from '../modules/components/template-list/template-list.component';
import { TemplateEditionComponent } from '../modules/components/template-edition/template-edition.component';

export const routes: Routes = [
  {
    path: 'templates/new',
    component: TemplateEmailComponent,
  },
  {
    path: 'templates',
    component: TemplateListComponent,
  },
  {
    path: 'template/change/:id',
    component: TemplateEditionComponent,
  },
];
