import { Variable } from "./variables";

export interface EmailData {
    subject: string;
    variables: Variable[];
    template_id: number;
    contact_id: number[];
}