import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';
import { InitiateService } from '../inisiate/initiate.service';

interface AuthResponse {
    access_token: string;
    user_id: string;
    companyId: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private tokenSubject = new BehaviorSubject<string | null>(null);
    public token$ = this.tokenSubject.asObservable();

    constructor(private http: HttpClient, private router: Router, private initiateService:InitiateService) { }
   
    public getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
      }
    
      async login(userName: string, password: string): Promise<void> {
        try {
            const response = await this.http.post<AuthResponse>(`${this.apiUrl}/login`, { userName, password }).toPromise();
    
            if (!response || !response.access_token) {
                throw new Error('Invalid response from server');
            }
    
            localStorage.setItem('token', response.access_token);
            this.tokenSubject.next(response.access_token);
            await this.initiateService.initiate(response.access_token); // Ensure initiation is completed
        } catch (error) {
            throw new Error( 'Login failed');
        }
    }
    
    

    verifyToken(): Observable<boolean> {
        const token = localStorage.getItem('token');
        if (!token) return of(false);

        return this.http.get<boolean>(`${this.apiUrl}/verify-token`, {
            headers: { Authorization: `Bearer ${token}` }
        }).pipe(
            tap(isValid => {
                if (!isValid) {
                    this.logout();
                }
            }),
            catchError(() => {
                this.logout();
                return of(false);
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        this.tokenSubject.next(null);
        this.router.navigate(['/login']); 
    }

    signup(name: string, phoneNumber: string, userName:string,email:string, companyId:string, password: string, role: 'USER' | 'ADMIN'): Observable<any> {
        return this.http.post(`${this.apiUrl}/signup`, { name, phoneNumber,userName,email ,companyId,password, role }).pipe(
            tap((response: any) => {
                const { access_token, user_id } = response;
                localStorage.setItem('token', access_token);

                this.tokenSubject.next(access_token);

                this.router.navigate(['/app']);
                this.initiateService.initiate(response.access_token);

                
            }),
            catchError((error) => {
                const errorMessage = error?.error?.message || 'An error occurred while processing your request.';
                return throwError(() => new Error(errorMessage));  
            })
        );
    }

    private handleError(error: any) {
        console.error('An error occurred:', error);
        return throwError(() => new Error('An error occurred while processing your request.'));
    }
}
