import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginRequest, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-modal" *ngIf="isOpen">
      <div class="modal-overlay" (click)="close()"></div>
      <div class="modal-content">
        <button class="close-btn" (click)="close()">&times;</button>

        <div class="auth-tabs">
          <button
            [class.active]="activeTab === 'login'"
            (click)="activeTab = 'login'">
            Login
          </button>
          <button
            [class.active]="activeTab === 'register'"
            (click)="activeTab = 'register'">
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <form *ngIf="activeTab === 'login'" (ngSubmit)="onLogin()" class="auth-form">
          <h2>Welcome Back</h2>
          <p class="subtitle">Login to access your saved patterns</p>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="loginData.email"
              name="email"
              placeholder="you@example.com"
              required>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              [(ngModel)]="loginData.password"
              name="password"
              placeholder="••••••••"
              required>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
            <span *ngIf="!loading">Login</span>
            <span *ngIf="loading">Logging in...</span>
          </button>
        </form>

        <!-- Register Form -->
        <form *ngIf="activeTab === 'register'" (ngSubmit)="onRegister()" class="auth-form">
          <h2>Create Account</h2>
          <p class="subtitle">Start testing and saving regex patterns</p>

          <div class="form-group">
            <label>Full Name</label>
            <input
              type="text"
              [(ngModel)]="registerData.fullName"
              name="fullName"
              placeholder="John Doe"
              required>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="registerData.email"
              name="email"
              placeholder="you@example.com"
              required>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              [(ngModel)]="registerData.password"
              name="password"
              placeholder="••••••••"
              required>
          </div>

          <div class="info-message">
            <strong>Free tier includes:</strong>
            <ul>
              <li>✅ Unlimited regex testing</li>
              <li>✅ Save up to 5 patterns</li>
              <li>✅ Public pattern library</li>
            </ul>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading">Creating account...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
      position: relative;
      background-color: var(--bg-primary);
      border-radius: 0.75rem;
      padding: 2rem;
      max-width: 450px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 2rem;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: var(--text-primary);
    }

    .auth-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid var(--border-color);
    }

    .auth-tabs button {
      flex: 1;
      padding: 0.75rem;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .auth-tabs button.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .subtitle {
      color: var(--text-secondary);
      margin: 0 0 1.5rem 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .form-group input {
      width: 100%;
    }

    .error-message {
      padding: 0.75rem;
      background-color: #FEE2E2;
      border: 1px solid var(--error-color);
      border-radius: 0.375rem;
      color: #991B1B;
      font-size: 0.875rem;
    }

    .info-message {
      padding: 1rem;
      background-color: #DBEAFE;
      border: 1px solid var(--primary-light);
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    .info-message strong {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--primary-dark);
    }

    .info-message ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .info-message li {
      padding: 0.25rem 0;
    }
  `]
})
export class AuthComponent {
  isOpen = false;
  activeTab: 'login' | 'register' = 'login';
  loading = false;
  errorMessage = '';

  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  registerData: RegisterRequest = {
    email: '',
    password: '',
    fullName: ''
  };

  constructor(private authService: AuthService) {}

  open(tab: 'login' | 'register' = 'login'): void {
    this.activeTab = tab;
    this.isOpen = true;
    this.errorMessage = '';
  }

  close(): void {
    this.isOpen = false;
    this.errorMessage = '';
    this.loginData = { email: '', password: '' };
    this.registerData = { email: '', password: '', fullName: '' };
  }

  onLogin(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loading = false;
        this.close();
        window.location.reload(); // Refresh to update UI
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  onRegister(): void {
    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.loading = false;
        this.close();
        window.location.reload(); // Refresh to update UI
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Email may already be in use.';
      }
    });
  }
}
