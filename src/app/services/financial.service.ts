import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private apiUrl = `${environment.apiUrl}/financials`;

  constructor(private http: HttpClient) { }

  /**
   * Fetch income statement data for the given date range.
   * @param startDate Start date of the range
   * @param endDate End date of the range
   * @returns Observable of the income statement data
   */
  getIncomeStatement(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/income-statement`, {
      params: { startDate, endDate },
    });
  }
}
