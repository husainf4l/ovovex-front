import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private apiUrl = `${environment.apiUrl}/financials`;

  constructor(private http: HttpClient) {}
  token = localStorage.getItem('token');

  getIncomeStatement(startDate: string, endDate: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this.apiUrl}/income-statement`, {
      params: { startDate, endDate },
      headers,
    });
  }
}
