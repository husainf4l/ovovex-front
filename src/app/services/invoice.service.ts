import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';


interface InvoiceData {
  products: any[];
  clients: any[];
  accountManager: any[];
  invoiceNumber: number;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoice`;


  constructor(private http: HttpClient) { }

  getInvoiceData(): Observable<InvoiceData> {
    return this.http.get<InvoiceData>(`${this.apiUrl}/invoice-data`);
  }


  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, invoiceData);
  }


}

