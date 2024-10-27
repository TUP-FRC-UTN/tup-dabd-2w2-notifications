export interface NotificationApi {
    id: number;
    recipient: string;
    contactId : number;
    subject: string;
    templateId: number;
    body : string;
    dateSend: string; 
    isRead : boolean;
    statusSend : string;
    dateNotification : string 
}
export interface NotificationFront {
    id: number;
    recipient: string;
    contactId : number;
    subject: string;
    templateId: number;
    body : string;
    dateSend: Date; 
    isRead : boolean;
    statusSend : string;
    dateNotification : string
}