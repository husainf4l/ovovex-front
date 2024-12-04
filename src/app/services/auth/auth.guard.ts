import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    async canActivate(): Promise<boolean> {
        try {
            // Await token verification first
            const isValidToken = await this.authService.verifyToken().toPromise();

            if (isValidToken) {
                return true; // Token is valid, grant access
            }

            // Token invalid, check localStorage for userData
            const userData = localStorage.getItem('userData');
            if (!userData) {
                this.router.navigate(['/login']);
                return false; // Redirect to login if no userData
            }

            return true; // Allow if userData exists even if token is invalid
        } catch (error) {
            // Handle errors (e.g., network issues) gracefully
            this.router.navigate(['/login']);
            return false;
        }
    }
}
