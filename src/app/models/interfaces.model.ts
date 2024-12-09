
export interface Product {
    id: string;
    barcode: string;
    name: string;
    salesPrice: number;
}

export interface InvoiceProduct {
    id: string;
    barcode: string;
    description: string;
    quantity: number;
    salesPrice: number;
    total: number;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    currentBalance: number
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
    transactions?: transactions[]; // Array of related transactions
    leases?: Lease[]; // Array of related leases
    createdAt: string;
    updatedAt: string;
    currency?: string;
    expanded?: boolean;
    mainAccount: boolean;
    level?: number; // To track nesting level

}
export interface transactions {
    id: string;
    accountId: string;
    debit?: number;
    credit?: number;
    currency: string;
    notes?: string;
    journalEntryId?: string;
    createdAt: string;
    account?: Account
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
    accountId: string;
    account: string;
    debit: number;
    credit: number;
    notes: string;
}


export interface accountManagers {
    id: string,
    displayName: string
}


export interface Journals {
    id: string,
    date: Date,
    transactions: transactions[];
}


export interface AccountAdd {
    id?: string;
    name: string;
    accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'; // Adjust based on your schema
    openingBalance?: number;
    parentAccountId?: string | null; // Nullable for main accounts
    mainAccount: boolean;
    currentBalance?: number; // Automatically calculated, but can be included

}

