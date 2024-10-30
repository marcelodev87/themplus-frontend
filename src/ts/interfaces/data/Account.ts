export interface DataAccount {
    name: string;
    description: string;
    agency: string;
    account: string;
}

export interface Account {
    id: string;
    name: string;
    balance: number;
    enterprise_id: string;
    account_number: string;
    agency_number: string;
    description: string;
    created_at: string;
}
