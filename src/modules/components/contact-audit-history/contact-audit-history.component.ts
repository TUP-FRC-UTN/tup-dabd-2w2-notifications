import { Component, inject, OnInit } from '@angular/core';

import {TableColumn, TableComponent} from 'ngx-dabd-grupo01';
import { ContactType } from '../../../app/models/contacts/contactType';
import { AuditHistory, ContactAudit } from '../../../app/models/contacts/contactAudit';
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
      this.contactAuditService.getContactAuditHistory().subscribe({
        next: (data : ContactAudit[]) => this.items = data
      })
    )
  }

  ngOnInit():void {
    this.columns = [
      { headerName: "ID del Contacto", accessorKey: "entityId" },
      { headerName: "Fecha del cambio", accessorKey: "revisionDate" },
      { headerName: "Cambiado por", accessorKey: "changedBy" },
      { headerName: "Tipo de contacto", accessorKey: "contactTpe" },
      { headerName: "Valor", accessorKey: "value" }
    ];
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }







  


}
