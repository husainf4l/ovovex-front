import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root',
})
export class ChartOfAccountsService {
  private baseUrl = 'http://localhost:3000/api/chart-of-accounts';

  constructor(private http: HttpClient) { }

  // Fetch all accounts
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}`);
  }

  // Fetch account by ID
  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/${id}`);
  }

  // Create a new account
  createAccount(account: Partial<Account>): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}`, account);
  }

  // Update an account
  updateAccount(id: string, account: Partial<Account>): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/${id}`, account);
  }

  // Delete an account
  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
