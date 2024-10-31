export interface Notification {
    id: number;
    recipient: string;
    contactId?: number; 
    subject: string;
    templateId: number;
    templateName: string; 
    statusSend: string;
    dateSend: string | Date; 
    body: string;
    isRead?: boolean; 
    dateNotification?: string | Date; 
}