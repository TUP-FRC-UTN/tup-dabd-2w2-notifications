import { ContactType } from "./contactType";

export interface AuditHistory {
    revision_id: number;            // Identificador único de la revisión
    entity: string;                 // Nombre de la entidad (en este caso, ContactEntity)
    entity_id: number;              // ID del contacto auditado
    revision_date: string;          // Fecha y hora de la revisión (en formato ISO)
    changed_by: number;             // ID del usuario que hizo el cambio
    changes: Changes;               // Los cambios hechos en la entidad (ContactEntity)
  }
  
  export interface Changes {
    contact_value: string;          // Valor del contacto (email, número de teléfono, enlace)
    contact_type: ContactType;      // Tipo de contacto (EMAIL, PHONE, SOCIAL_MEDIA_LINK)
  }


  export interface ContactAudit {
    entityId: number;         // ID del contacto auditado
    revisionDate: string;     // Fecha y hora de la revisión (en formato ISO)
    changedBy: number;        // ID del usuario que hizo el cambio
    contactValue: string;     // Valor del contacto (email, número de teléfono, enlace)
    contactType: ContactType; // Tipo de contacto (EMAIL, PHONE, SOCIAL_MEDIA_LINK)
  }
  
