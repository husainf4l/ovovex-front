import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanySettingsService {
  private apiUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) {}

  getCompanySettings(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<any>(`${this.apiUrl}/company-settings`, { headers });
  }

  updateCompanySettings(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    console.log(formData);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Ensure `headers` are passed with `formData`
    return this.http.patch<any>(
      `${this.apiUrl}/company-settings/update`,
      formData,
      {
        headers,
      }
    );
  }
}
