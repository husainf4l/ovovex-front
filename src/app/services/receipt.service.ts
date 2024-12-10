import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface ReceiptData {
  cashAccounts: any[];
  clients: any[];
  accountManagers: any[];
  receiptNumber: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private apiUrl = `${environment.apiUrl}/receipt`;

  constructor(private http: HttpClient) {}

  getReceiptData(): Observable<ReceiptData> {
    return this.http.get<ReceiptData>(`${this.apiUrl}/receipt-data`);
  }

  getReceiptList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/receipt-list`);
  }

  saveReceipt(receipt: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, receipt);
  }
}
