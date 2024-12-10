import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) { }



  getEmployeesList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employees-list`);
  }


}
