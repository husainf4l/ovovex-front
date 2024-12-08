import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Toggle the password visibility.
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handle the login form submission.
   */
  async onSubmit() {
    if (this.loginForm.invalid) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true; // Show loader
    const { userName, password } = this.loginForm.value;

    try {
      // Perform login via AuthService
      await this.authService.login(userName, password);

      // Verify the token
      const isValidToken = await this.authService.verifyToken().toPromise();
      if (isValidToken) {
        this.router.navigate(['/app']); // Navigate to the dashboard
      } else {
        this.error = 'Invalid token. Please try again.';
      }
    } catch (err) {
      // Check if the error is an HTTP error
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.error = 'Invalid credentials. Please check your username and password.';
        } else {
          this.error = `An unexpected error occurred: ${err.message}`;
        }
      } else {
        this.error = 'An unexpected error occurred. Please try again later.';
      }
    } finally {
      this.isLoading = false; // Hide loader
    }
  }
}
