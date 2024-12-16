import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}
  token = localStorage.getItem('token');

  getEmployeesList(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/employees-list`, { headers });
  }
}
