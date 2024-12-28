import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) { }
  token = localStorage.getItem('token');

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Example for JWT token
    });
  }


  createClient(data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post<any>(`${this.apiUrl}/create-new`, data, { headers });
  }


  getClientDetails(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${clientId}/details`, {
      headers: this.getHeaders(),
    });
  }

  getAccountStatement(clientId: string): Observable<{ accountStatement: any[] }> {
    return this.http.get<{ accountStatement: any[] }>(
      `${this.apiUrl}/${clientId}/account-statement`,
      { headers: this.getHeaders() }
    );
  }


  getClients(): Observable<{ clients: any[] }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<{ clients: any[] }>(`${this.apiUrl}/all-clients`, { headers });
  }

  bulkUploadClients(clients: any[]): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/bulk`, { clients }, { headers });
  }


}
