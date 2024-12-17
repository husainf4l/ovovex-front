import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { InitiateService } from './inisiate/initiate.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private initiateService: InitiateService
  ) {}
  token = localStorage.getItem('token'); // Retrieve token from localStorage

  getCompanies(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`, // Include the token here
    });

    return this.http.get<any[]>(`${this.apiUrl}/settings`, { headers });
  }

  async updateCompanySettings(companyId: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found. Please log in again.');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    console.log(companyId);

    try {
      // 1. Wait for the backend to update the company ID
      await firstValueFrom(
        this.http
          .patch<any>(
            `${this.apiUrl}/settings/update-company`,
            { companyId },
            { headers }
          )
          .pipe(
            tap((response) => {
              if (response.token) {
                // Save the new token
                localStorage.setItem('token', response.token);
                console.log('Token updated successfully.');
              }
            })
          )
      );

      console.log('Company updated successfully.');

      // 2. Refresh user data by calling initiate
      await this.initiateService.initiate(token);
      console.log('User data refreshed successfully.');

      // 3. Introduce a small delay (e.g., 500ms)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 4. Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Failed to update company settings:', error);
    }
  }
}
