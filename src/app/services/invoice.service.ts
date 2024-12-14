import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceData } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoice`;

  constructor(private http: HttpClient) { }

  getInvoiceData(): Observable<InvoiceData> {
    return this.http.get<InvoiceData>(`${this.apiUrl}/invoice-data`);
  }

  getInvoicesDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/invoices-data`);
  }

  getInvoiceDetails(invoiceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/invoice-details/${invoiceId}`);
  }

  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, invoiceData);
  }

  submiteInvoice(invoice: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submitEinvoice`, invoice)
  }
}
