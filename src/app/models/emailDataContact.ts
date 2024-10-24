import { Variable } from "./variables"

export interface EmailDataContact {
    subject: string
    variables: Variable[]
    template_id : number
    contact_ids: number[]
}