import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Company, User } from '../../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InitiateService {
  // Signals for reactive state management

  private apiUrl = `${environment.apiUrl}/initiate`;

  constructor(private http: HttpClient) { }


  initiate(token: string): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<{ companyData: Company; userData: User }>(this.apiUrl, { headers })
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch initiate data:', error);
          throw error;
        })
      )
      .subscribe({
        next: (response) => {

          console.log(response);

          this.saveToStorage('userData', response);
        },

        error: (error) => {
          console.error('Error during initiate process:', error);
        },


      });
  }
  private saveToStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));

  }

}
