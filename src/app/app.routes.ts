import { Routes } from '@angular/router';
import { TemplateEmailComponent } from '../modules/components/template-email/template-email.component';
import { TemplateListComponent } from '../modules/components/template-list/template-list.component';
import { TemplateEditionComponent } from '../modules/components/template-edition/template-edition.component';
import { SendEmailComponent } from '../modules/components/send-email/send-email.component';
import { SendEmailContactComponent } from '../modules/components/send-email-contact/send-email-contact.component';
import { ContactListComponent } from '../modules/components/contact-list/contact-list.component';
import { ContactNewComponent } from '../modules/components/contact-new/contact-new.component';
import { ContactModifySubsEmailComponent } from '../modules/components/contact-modify-subs-email/contact-modify-subs-email.component';

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
  {
    path: 'send-email',
    component: SendEmailComponent,
  },
  {
    path: 'send-email-contact',
    component: SendEmailContactComponent,
  },
  {
    path: 'contacts',
    component: ContactListComponent
  }, 
  {
    path: 'contact/new',
    component: ContactNewComponent
  },
  {
    path: 'contact/modify-subs',
    component: ContactModifySubsEmailComponent
  }
];
