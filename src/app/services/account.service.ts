import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AccountAdd } from '../models/interfaces.model';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private apiUrl = `${environment.apiUrl}/accounts`;

    constructor(private http: HttpClient) { }

    getAccountStatement(accountId: string, page: number = 1, limit: number = 10, filters?: any): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (filters) {
            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    params = params.set(key, filters[key]);
                }
            });
        }

        return this.http.get<any>(`${this.apiUrl}/${accountId}/statement`, { params });
    }


    createAccount(account: AccountAdd): Observable<AccountAdd> {
        return this.http.post<AccountAdd>(`${this.apiUrl}`, account);
    }


    getAccounts(): Observable<AccountAdd[]> {
        return this.http.get<AccountAdd[]>(`${this.apiUrl}`);
    }

    getMainAccounts(): Observable<AccountAdd[]> {
        return this.http.get<AccountAdd[]>(`${this.apiUrl}/main`);
    }

  
    

}
