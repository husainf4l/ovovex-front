import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/purchase.model';
import { CreateProductDto } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}
  token = localStorage.getItem('token');

  getProducts(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/all-products`, { headers });
  }

  addProduct(product: Product): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.post(`${this.apiUrl}/products`, product, { headers });
  }

  fetchInventory(startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/inventory`, {
      params,
      headers,
    });
  }

  bulkUpload(products: CreateProductDto[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/bulk`, { data: products });
  }
}
