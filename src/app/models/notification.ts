export interface NotificationApi {
    id: number;
    recipient: string;
    subject: string;
    templateId: number;
    content : string;
    dateSend: string; 
    isRead : boolean;
    statusSend : string;
}
export interface NotificationFront {
    id: number;
    recipient: string;
    subject: string;
    templateId: number;
    content : string;
    dateSend: Date; 
    isRead : boolean;
    statusSend : string;
}