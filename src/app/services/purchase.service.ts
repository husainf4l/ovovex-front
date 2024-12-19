import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product, PurchaseProduct, Supplier } from '../models/purchase.model';

@Injectable({
    providedIn: 'root',
})
export class PurchaseService {
    private baseUrl = `${environment.apiUrl}/invoice`; // Base URL for the API

    constructor(private http: HttpClient) { }
    token = localStorage.getItem('token');


    /**
     * Fetch data for creating a purchase
     */
    getPurchaseData(): Observable<{
        suppliers: Supplier[];
        products: Product[];
        purchaseNumber: number;
    }> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
        });

        return this.http.get<{
            suppliers: Supplier[];
            products: Product[];
            purchaseNumber: number;
        }>(`${this.baseUrl}/purchase-data`, { headers });
    }


    createPurchase(purchaseData: any): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
        });

        return this.http.post<any>(`${this.baseUrl}/create`, purchaseData, { headers });
    }


    getPurchaseDetails(purchaseId: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
        });

        return this.http.get<any>(`${this.baseUrl}/details/${purchaseId}`, { headers });
    }
}
