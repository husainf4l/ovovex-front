import { Injectable } from "@angular/core";
import { environment } from "../enviroments/environment";
import { HttpClient } from "@angular/common/http";
import {  Observable } from 'rxjs';



@Injectable({
    providedIn: 'root',
  })
  export class ProductsService {
    private apiUrl = `${environment.apiUrl}/product`;
  
  
    constructor(private http: HttpClient) { }
  
    getInvoiceProducts(): Observable<any[]> {
        return this.http.get<any>(`${this.apiUrl}/invoice-products`);
    }

}

