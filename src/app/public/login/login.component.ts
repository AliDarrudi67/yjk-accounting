import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiEndpoints } from '../../core/config/apiEndpoints';
import { AuthService } from '../../core/services/auth.service';
import { MainService } from '../../core/services/main.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private mainService: MainService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // اگر کاربر قبلا لاگین کرده باشد، به دشبرد هدایت شود
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.isLoading = true;

    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.mainService
        .post(
          ApiEndpoints.admin.login,
          this.mainService.getFormData(this.loginForm),
        )
        .subscribe({
          next: (response: any) => {
            this.isLoading = false;
            if (response?.error) {
              this.mainService.error(response?.error);
              return;
            }
            localStorage.setItem('token', response?.token);
            window.location.href = '/private/dashboard';
          },
        });
    }
  }

  // برای نمایش بهتر validation
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
