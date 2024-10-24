import { ContactType } from "./contactType";

export interface ContactAudit {
    contactId: number;            // Unique identifier for the contact
    revisionDate: string;         // Date and time of the revision (formatted as ISO string)
    revisionId: number;           // Unique identifier for the revision
    revisionType: string;         // Type of revision (e.g., ADD, UPDATE, DELETE)
    contactValue: string;         // Value of the contact (email, phone number, etc.)
    contactType: ContactType;     // Type of contact (EMAIL, PHONE, SOCIAL_MEDIA_LINK)
  }
  


