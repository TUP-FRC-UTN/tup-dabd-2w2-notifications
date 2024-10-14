import { Routes } from '@angular/router';

import { TemplateEmailComponent } from '../modules/components/template-email/template-email.component';
import { TemplateListComponent } from '../modules/components/template-list/template-list.component';
import { SendEmailComponent } from '../modules/components/send-email/send-email.component';


export const routes: Routes = [


    {
        path: 'templates/new', component: TemplateEmailComponent
    },
    {
        path: 'templates', component: TemplateListComponent
    },
    {
        path: 'send-email', component: SendEmailComponent
    }
];
