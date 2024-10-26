import { Component, inject, OnInit } from '@angular/core';

import {TableColumn, TableComponent} from 'ngx-dabd-grupo01';
import {  ContactAudit } from '../../../app/models/contacts/contactAudit';
import { ContactAuditService } from '../../../app/services/contact-audit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-audit-history',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './contact-audit-history.component.html',
  styleUrl: './contact-audit-history.component.css'
})
export class ContactAuditHistoryComponent implements OnInit {


    



  items: ContactAudit[] = [];
  columns: TableColumn[] = [];
  isLoading: boolean = true;

  private subscription = new Subscription()


  private readonly contactAuditService = inject(ContactAuditService)


  loadData():void {
    this.isLoading = true;
    this.subscription.add(
      this.contactAuditService.getContactAudits().subscribe({
        next: (data : ContactAudit[]) => 
        {
          console.log('Datos que llegan al componente: ', data)
          this.items = data;
        }
         
      })
    )
  }

  ngOnInit():void {
    this.columns = [
      { headerName: "ID del Contacto", accessorKey: "contactId" },
      { headerName: "Fecha del cambio", accessorKey: "revisionDate" },
      { headerName: "ID del cambio", accessorKey: "revisionId" },
      { headerName: "Tipo de revision", accessorKey: "revisionType" },
      { headerName: "Tipo de contacto", accessorKey: "contactType" },
      { headerName: "Valor del contacto", accessorKey: "value" }
     
    ];
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }







  


}
