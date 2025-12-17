import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Créer un compte</h1>
          <p>Rejoignez le gestionnaire de tâches</p>
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="name">Nom complet</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="userData.name"
              required
              placeholder="Jean Dupont"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="userData.email"
              required
              email
              placeholder="jean.dupont@example.com"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="userData.password"
              required
              minlength="6"
              placeholder="••••••••"
              class="form-control"
            />
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="!registerForm.valid || loading"
            class="btn-primary"
          >
            {{ loading ? 'Création...' : "S'inscrire" }}
          </button>
        </form>

        <div class="register-link">
          <p>Déjà un compte? <a routerLink="/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 8px 0;
    }

    .login-header p {
      color: #718096;
      margin: 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #2d3748;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn-primary {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      margin-top: 8px;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      background: #fed7d7;
      color: #c53030;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .register-link {
      text-align: center;
      margin-top: 24px;
      color: #718096;
    }

    .register-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
    userData: RegisterRequest = {
        name: '',
        email: '',
        password: '',
        role: 'USER'
    };
    loading = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        this.loading = true;
        this.errorMessage = '';

        this.authService.register(this.userData).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (error: any) => {
                this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
                this.loading = false;
            }
        });
    }
}
