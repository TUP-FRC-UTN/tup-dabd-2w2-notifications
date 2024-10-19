import {_, mapKeys, camelCase} from 'lodash';

import { AuditHistory, Changes, ContactAudit } from '../../../models/contacts/contactAudit';

export const transformAuditHistoryData = (data: any[]): AuditHistory[] => {
  return data.map(item => {
    return {
      revision_id: item.revision_id,                // Identificador de la revisión
      entity: item.entity,                          // Nombre de la entidad (ContactEntity)
      entity_id: item.entity_id,                    // ID de la entidad
      revision_date: item.revision_date,            // Fecha y hora de la revisión
      changed_by: item.changed_by,                  // ID del usuario que realizó el cambio
      changes: {
        contact_value: item.changes.contact_value,  // Valor del contacto
        contact_type: item.changes.contact_type,    // Tipo de contacto
      } as Changes                                  // Aseguramos que los cambios cumplan con la interfaz Changes
    } as AuditHistory;
  });
};


export function transformToContactAuditData(auditHistories: AuditHistory[]): ContactAudit[] {
  return auditHistories
    .filter(audit => audit.entity === 'ContactEntity') // Filtrar solo por la entidad ContactEntity
    .map(audit => {
      const contactAudit = {
        entityId: audit.entity_id,
        revisionDate: audit.revision_date,
        changedBy: audit.changed_by,
        contactValue: audit.changes.contact_value,
        contactType: audit.changes.contact_type
      };
      return mapKeys(contactAudit, (value: any, key : any) => camelCase(key)); // Convertir a camelCase
    });
}