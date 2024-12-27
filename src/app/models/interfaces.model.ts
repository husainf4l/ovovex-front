export interface Product {
  id: string;
  barcode: string;
  name: string;
  salesPrice: number;
}

export interface InvoiceProduct {
  id: string;
  name: string;
  barcode: string;
  quantity: number;
  salesPrice: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentBalance: number;
}

export interface Account {
  id: string;
  parentCode?: string;
  code: string;
  name: string;
  accountType: string;
  openingBalance: number;
  totalCredit?: number;
  totalDebit?: number;
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
  account?: Account;
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
  id: string;
  name: string;
}

export interface Journals {
  id: string;
  date: Date;
  transactions: transactions[];
}

export interface AccountAdd {
  id?: string; // Optional, used when editing existing accounts
  name: string; // Account name
  nameAr?: string; // Arabic account name, optional
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'; // Main account types
  openingBalance?: number; // Optional opening balance
  parentAccountId?: string | null; // Allow null for main accounts
  mainAccount: boolean; // Indicates whether the account is a main account
  currentBalance?: number; // Calculated balance, optional for display
  level?: number | null; // Allow null for top-level accounts
  ifrcClassification?: string | null; // Optional, for IFRS classification
}


export interface Cheque {
  chequeNumber: string;
  bankName: string;
  amount: number;
  date: string;
  accountId?: string; // New property for cheque account
}

export interface InvoiceData {
  products: any[];
  clients: any[];
  accountManagers: any[];
  number: number;
  cashAccounts: any[];
}

export interface Customer {
  id: string;
  name: string;
  accountId: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
}

// Interface for the Invoice
export interface Invoice {
  id: string;
  invoiceNumber: number;
  customerId: string;
  customerName?: string; // Optional customerName property

  accountManagerId: string | null;
  date: string;
  total: number;
  taxType: string;
  taxAmount: number;
  grandTotal: number;
  paymentMode: string;
  vendorName: string | null;
  createdAt: string;
  updatedAt: string;
  qrCode: string | null;
  customer: Customer; // The customer object is nested inside the invoice object
}

export interface CreateProductDto {
  barcode?: string; // Optional
  name: string; // Required
  companyId: string; // Required
  description?: string; // Optional
  costPrice?: string; // Optional
  salesPrice?: string; // Optional
  wholesalePrice?: string; // Optional
  avgPrice?: string; // Optional
  stock?: string; // Optional
  reorderLevel?: string; // Optional
  isActive?: string; // Optional
  origin?: string; // Optional
  family?: string; // Optional
  subFamily?: string; // Optional
  taxRate?: string; // Optional
  discountRate?: string; // Optional
  profitMargin?: string; // Optional
  location?: string; // Optional
  packaging?: string; // Optional
  category?: string; // Optional
  nrv?: string; // Optional
  itemType?: string; // Optional
  imageUrl?: string; // Optional
}

export interface BankDetailsDto {
  bankName: string;
  accountNumber: string;
  companyId: string;
}

export interface CustomerDetailsDto {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CreateAccountDto {
  code: string;
  parentCode?: string;
  mainAccount: boolean;
  level: number;
  name: string;
  nameAr: string;
  accountType:
  | 'ASSET'
  | 'LIABILITY'
  | 'EQUITY'
  | 'REVENUE'
  | 'EXPENSE'
  | 'TRADEEXPENSES';
}
