import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // Inject Router
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { userName, password } = this.loginForm.value;

    try {
        // Perform login and ensure initiation is complete
        await this.authService.login(userName, password);

        // Verify the token
        const isValidToken = await this.authService.verifyToken().toPromise();
        if (isValidToken) {
            // Redirect to the dashboard or home page
            this.router.navigate(['/app']);
        } else {
            this.error = 'Invalid token';
        }
    } catch (error) {
        this.error = 'Login failed';
    }
}


}
