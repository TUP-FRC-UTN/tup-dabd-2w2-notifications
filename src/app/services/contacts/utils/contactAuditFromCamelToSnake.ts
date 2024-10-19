import _ from 'lodash';

import { AuditHistory, Changes } from '../../../models/contacts/contactAudit';

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