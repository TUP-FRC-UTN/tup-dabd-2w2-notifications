export interface ContactApi { //lo que viene del back
    id: number;
    subscriptions: null | string[]; // Puede ser null o un array
    contact_value: string;
    contact_type: string;
  }

export interface Contact { //lo mapeo en este sin el snake_case

  id: number
  subscriptions: string[]
  contactValue: string
  contactType: string
  active:boolean
  showSubscriptions: false
}
