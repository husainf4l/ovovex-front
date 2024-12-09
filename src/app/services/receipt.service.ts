import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';


interface ReceiptData {
  cashAccounts: any[]
  clients: any[];
  accountManagers: any[];
  receiptNumber: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {


  private apiUrl = `${environment.apiUrl}/receipt`;


  constructor(private http: HttpClient) { }

  getReceiptData(): Observable<ReceiptData> {
    return this.http.get<ReceiptData>(`${this.apiUrl}/receipt-data`);
  }

  saveReceipt(receipt: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, receipt);
  }

}
