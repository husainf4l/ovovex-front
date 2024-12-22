import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

export interface Transaction {
  accountId: string;
  debit?: number | null; // Allow null values
  credit?: number | null; // Allow null values
  currency?: string;
  notes?: string;
}

export interface JournalEntryPayload {
  date: string; // ISO format date
  transactions: Transaction[];
}

@Injectable({
  providedIn: 'root',
})
export class JournalEntryService {
  private apiUrl = `${environment.apiUrl}/journal-entry`;
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  // Fetch all journal entries
  getAllJournalEntries(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  createJournalEntry(data: JournalEntryPayload): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const transactions = data.transactions.map((transaction) => ({
      ...transaction,
      currency: transaction.currency || 'JOD',
    }));

    const payload = { ...data, transactions };

    return this.http.post<any>(this.apiUrl, payload, { headers }).pipe(
      catchError((error) => {
        console.error('Error creating journal entry:', error);
        return throwError(() => error);
      })
    );
  }


  submitJournalEntries(entries: any[]): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    // Send the entries array directly
    return this.http.post(`${this.apiUrl}/bulk`, entries, { headers });
  }


}
