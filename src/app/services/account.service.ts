import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AccountAdd } from '../models/interfaces.model';
import { formatISO } from 'date-fns';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) { }
  token = localStorage.getItem('token');


  getAccountStatement(
    accountId: string,
    page: number = 1,
    limit: number = 10,
    filters?: any
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          // Adjust the endDate to include up to 23:59:59
          if (key === 'endDate') {
            const adjustedEndDate = this.adjustEndDate(filters[key]);
            params = params.set(key, adjustedEndDate);
          } else {
            params = params.set(key, filters[key]);
          }
        }
      });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/${accountId}/statement`, {
      params,
      headers,
    });
  }

  // Helper function to adjust endDate to 23:59:59
  private adjustEndDate(endDate: string): string {
    const date = new Date(endDate);
    date.setHours(23, 59, 59, 999); // Set to end of day
    return formatISO(date); // Convert back to ISO format
  }
  createAccount(account: AccountAdd): Observable<AccountAdd> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post<AccountAdd>(`${this.apiUrl}`, account, { headers });
  }

  getAccounts(): Observable<AccountAdd[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<AccountAdd[]>(`${this.apiUrl}`, { headers });
  }

  getMainAccounts(): Observable<AccountAdd[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<AccountAdd[]>(`${this.apiUrl}/main`, { headers });
  }
}
