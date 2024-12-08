import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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


  constructor(private http: HttpClient) { }

  // Fetch all journal entries
  getAllJournalEntries(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createJournalEntry(data: JournalEntryPayload): Observable<any> {
    const transactions = data.transactions.map((transaction) => ({
      ...transaction,
      currency: transaction.currency || 'JOD',
    }));

    const payload = { ...data, transactions };

    return this.http.post<any>(this.apiUrl, payload).pipe(
      catchError((error) => {
        console.error('Error creating journal entry:', error);
        return throwError(() => error);
      })
    );
  }


}
