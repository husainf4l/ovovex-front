import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/interfaces.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChartOfAccountsService {
  private baseUrl = `${environment.apiUrl}/chart-of-accounts`;

  constructor(private http: HttpClient) {}
  token = localStorage.getItem('token');

  // Fetch all accounts
  getAccounts(): Observable<Account[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<Account[]>(`${this.baseUrl}`, { headers });
  }

  // Fetch account by ID
  getAccountById(id: string): Observable<Account> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<Account>(`${this.baseUrl}/${id}`, { headers });
  }

  // Create a new account
  createAccount(account: Partial<Account>): Observable<Account> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post<Account>(`${this.baseUrl}`, account, { headers });
  }

  // Update an account
  updateAccount(id: string, account: Partial<Account>): Observable<Account> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.put<Account>(`${this.baseUrl}/${id}`, account, {
      headers,
    });
  }

  // Delete an account
  deleteAccount(id: string): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
}
