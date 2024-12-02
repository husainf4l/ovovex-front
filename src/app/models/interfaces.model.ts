
export interface Item {
    id: string;
    barcode: string;
    name: string;
    price: number;
}

export interface InvoiceItem {
    id: string;
    barcode: string;
    description: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface Account {
    id: string;
    hierarchyCode: string;
    name: string;
    accountType: string;
    openingBalance: number;
    currentBalance: number;
    parentAccountId: string | null;
    parentAccount?: Account | null; // Optional reference to parent account
    children?: Account[]; // Optional array of child accounts
    transactions?: Transaction[]; // Array of related transactions
    leases?: Lease[]; // Array of related leases
    createdAt: string;
    updatedAt: string;
    currency?: string;
    expanded?: boolean;
    level?: number; // To track nesting level

}
export interface Transaction {
    id: string;
    accountId: string;
    amount: number;
    currency: string;
    notes?: string;
    journalEntryId?: string;
    createdAt: string;
}

export interface Lease {
    id: string;
    accountId: string;
    leaseLiability: number;
    rouAsset: number;
    leaseTerm: number;
    createdAt: string;
}



export interface JournalEntry {
    account: string;
    debit: number;
    credit: number;
    notes: string;
}