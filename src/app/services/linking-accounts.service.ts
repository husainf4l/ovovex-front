import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LinkingAccountsService {
    private readonly apiUrl = `${environment.apiUrl}/linking-accounts`;

    constructor(private http: HttpClient) { }

    // Helper to get headers
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    // Fetch all linking accounts for a company
    getAll(): Observable<any> {
        const headers = this.getHeaders();
        return this.http.get(this.apiUrl, { headers });
    }

    // Create a new linking account
    create(data: any): Observable<any> {
        const headers = this.getHeaders();
        return this.http.post(this.apiUrl, data, { headers });
    }

    // Update an existing linking account
    update(id: string, data: any): Observable<any> {
        const headers = this.getHeaders();
        return this.http.patch(`${this.apiUrl}/${id}`, data, { headers });
    }

    // Delete a linking account
    delete(id: string): Observable<any> {
        const headers = this.getHeaders();
        return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }
}
