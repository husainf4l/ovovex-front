import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';


interface InvoiceData {
  products: any[];
  clients: any[];
  accountManagers: any[];
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

  getInvoiceDetails(invoiceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/invoice-details/${invoiceId}`);
  }




  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, invoiceData);
  }


}

