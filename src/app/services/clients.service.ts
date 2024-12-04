import { Injectable } from "@angular/core";
import { environment } from "../enviroments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class ClientsService {
    private apiUrl = `${environment.apiUrl}/clients`;


    constructor(private http: HttpClient) { }

  
    createClient(data: { name: string; email?: string; phone?: string; address?: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create-new`, data);
    }




}
