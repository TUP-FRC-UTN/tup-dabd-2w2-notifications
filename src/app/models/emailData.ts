import { Variable } from "./variables";

export interface EmailData {
    recipient: string;
    subject: string;
    variables: Variable[];
    template_id: number;
}