import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface ReceiptData {
  cashAccounts: any[];
  clients: any[];
  accountManagers: any[];
  receiptNumber: number;
  chequeAccounts: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private apiUrl = `${environment.apiUrl}/receipt`;

  constructor(private http: HttpClient) {}
  token = localStorage.getItem('token');

  getReceiptData(): Observable<ReceiptData> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<ReceiptData>(`${this.apiUrl}/receipt-data`, {
      headers,
    });
  }

  getReceiptList(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/receipt-list`, { headers });
  }

  saveReceipt(receipt: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}`, receipt, { headers });
  }
}
