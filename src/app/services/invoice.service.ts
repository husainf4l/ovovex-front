import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceData } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoice`;

  constructor(private http: HttpClient) {}
  token = localStorage.getItem('token');

  getInvoiceData(): Observable<InvoiceData> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<InvoiceData>(`${this.apiUrl}/invoice-data`, {
      headers,
    });
  }

  getInvoicesDetails(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<any>(`${this.apiUrl}/invoices-data`, {
      headers,
    });
  }

  getInvoiceDetails(invoiceId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<any>(`${this.apiUrl}/invoice-details/${invoiceId}`, {
      headers,
    });
  }

  createInvoice(invoiceData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/create`, invoiceData, {
      headers,
    });
  }

  submiteInvoice(invoice: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/submitEinvoice`, invoice, {
      headers,
    });
  }
}
