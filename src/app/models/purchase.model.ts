export interface Supplier {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    contactPerson?: string;
}

export interface Product {
    id: string;
    barcode: string;
    name: string;
    costPrice: number;
    salesPrice: number;
    wholesalePrice: number;
    stock: number;
}

export interface PurchaseProduct {
    id: string;
    barcode: string;
    name: string;
    quantity: number;
    costPrice: number;
    total: number;
}


export interface Product {
    id: string;
    barcode: string;
    name: string;
    description?: string;
    costPrice: number;
    salesPrice: number;
    wholeSalePrice?: number;
    stock: number;
    reorderLevel?: number;
    category?: string;
    nrv?: number; // Net Realizable Value
    valuationMethod?: string; // e.g., 'FIFO', 'LIFO', etc.
    isActive?: boolean;
    companyId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
