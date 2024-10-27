import { Routes } from '@angular/router';
import { TemplateEmailComponent } from '../modules/components/template-email/template-email.component';
import { TemplateListComponent } from '../modules/components/template-list/template-list.component';
import { SendEmailComponent } from '../modules/components/send-email/send-email.component';
import { SendEmailContactComponent } from '../modules/components/send-email-contact/send-email-contact.component';
import { ContactAuditHistoryComponent } from '../modules/components/contact-audit-history/contact-audit-history.component';
import { ContactListComponent } from '../modules/components/contact-list/contact-list.component'
import { ContactNewComponent } from '../modules/components/contact-new/contact-new.component'
import { ContactModifySubsEmailComponent } from '../modules/components/contact-modify-subs-email/contact-modify-subs-email.component'
import { NotificationHistoricComponent } from '../modules/components/notification-historic/notification-historic.component';

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
    path: 'send-email',
    component: SendEmailComponent,
  },
  {
    path: 'send-email-contact',
    component: SendEmailContactComponent,
  },
  {
    path: 'notifications-historic',
    component: NotificationHistoricComponent,
  },
  {
    path: 'contact-audit', component: ContactAuditHistoryComponent
  },
  {

    path: 'contacts',
    component: ContactListComponent
  },
  {
    path: 'contact/new',
    component: ContactNewComponent
  }

];
