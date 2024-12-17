import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InitiateService {
  private apiUrl = `${environment.apiUrl}/initiate`;

  // Reactive user data using BehaviorSubject
  private userDataSubject = new BehaviorSubject<User | null>(
    this.loadFromStorage()
  );
  userData$ = this.userDataSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Fetch userData and update BehaviorSubject
  initiate(token: string): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<{ userData: User }>(this.apiUrl, { headers }) // Expecting userData only
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch initiate data:', error);
          throw error;
        })
      )
      .subscribe({
        next: (response) => {
          const userData = response.userData; // Extract userData
          this.saveToStorage('userData', userData); // Save userData
          this.userDataSubject.next(userData); // Update BehaviorSubject
          console.log('UserData updated:', userData);
        },
        error: (error) => console.error('Error during initiate process:', error),
      });
  }

  // Save userData to localStorage
  private saveToStorage(key: string, data: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  // Load userData from localStorage
  private loadFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('userData');
      return data ? (JSON.parse(data) as User) : null;
    }
    return null;
  }
}
