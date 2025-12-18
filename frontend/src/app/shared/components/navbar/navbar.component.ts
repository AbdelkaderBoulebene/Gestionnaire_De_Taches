import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h2>Flowify</h2>
        </div>
        
        <div class="nav-links" *ngIf="currentUser">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/projects" routerLinkActive="active">Projets</a>
          <a routerLink="/tasks" routerLinkActive="active">Tâches</a>
          <a routerLink="/users" routerLinkActive="active" *ngIf="isAdmin">Utilisateurs</a>
        </div>
        
        <div class="nav-actions" *ngIf="currentUser">
          <!-- Theme Toggle -->
          <button class="btn-icon theme-toggle" (click)="toggleTheme()" [title]="isDark() ? 'Passer en Mode Clair' : 'Passer en Mode Sombre'">
            <span *ngIf="isDark()">☀️</span>
            <span *ngIf="!isDark()">🌙</span>
          </button>

          <!-- User Profile -->
          <div class="nav-user">
            <div class="user-info">
              <span class="user-name">{{ currentUser.name }}</span>
              <span class="user-role badge" [class.badge-admin]="isAdmin">{{ currentUser.role }}</span>
            </div>
            <button (click)="logout()" class="btn btn-sm btn-logout">Déconnexion</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--surface-color);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 9999;
    }

    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
    }

    .nav-brand h2 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--text-heading);
      font-weight: 800;
    }

    .nav-links {
      display: flex;
      gap: 8px;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--text-muted);
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }

    .nav-links a:hover {
      color: var(--text-heading);
      background: var(--surface-hover);
    }

    .nav-links a.active {
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      font-weight: 600;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .theme-toggle {
      font-size: 1.2rem;
      cursor: pointer;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-left: 24px;
      border-left: 1px solid var(--border-color);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      line-height: 1.2;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-heading);
    }

    .user-role {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .btn-logout {
      padding: 6px 12px;
      font-size: 0.8rem;
      background: var(--bg-color);
      color: var(--text-body);
      border: 1px solid var(--border-color);
    }

    .btn-logout:hover {
      background: var(--surface-hover);
      color: #E11D48;
      border-color: #E11D48;
    }

    @media(max-width: 768px) {
      .nav-links { display: none; }
    }
  `]
})
export class NavbarComponent {
  currentUser: User | null = null;
  isAdmin = false;
  isDark = this.themeService.isDarkTheme;

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
