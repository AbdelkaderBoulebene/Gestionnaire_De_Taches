import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h2>📋 Gestionnaire de Tâches</h2>
        </div>
        
        <div class="nav-links" *ngIf="currentUser">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/projects" routerLinkActive="active">Projets</a>
          <a routerLink="/tasks" routerLinkActive="active">Tâches</a>
          <a routerLink="/users" routerLinkActive="active" *ngIf="isAdmin">Utilisateurs</a>
        </div>
        
        <div class="nav-user" *ngIf="currentUser">
          <span class="user-name">{{ currentUser.name }}</span>
          <span class="user-role badge" [class.badge-admin]="isAdmin">{{ currentUser.role }}</span>
          <button (click)="logout()" class="btn-logout">Déconnexion</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
    }

    .nav-brand h2 {
      margin: 0;
      font-size: 20px;
      color: #667eea;
      font-weight: 700;
    }

    .nav-links {
      display: flex;
      gap: 24px;
      flex: 1;
    }

    .nav-links a {
      text-decoration: none;
      color: #4a5568;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .nav-links a:hover {
      background: #f7fafc;
      color: #667eea;
    }

    .nav-links a.active {
      background: #667eea;
      color: white;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-name {
      font-weight: 600;
      color: #2d3748;
    }

    .user-role {
      font-size: 12px;
      padding: 4px 12px;
    }

    .badge-admin {
      background: #9f7aea;
      color: white;
    }

    .btn-logout {
      padding: 8px 16px;
      background: #fc8181;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-logout:hover {
      background: #f56565;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 16px;
      }

      .nav-links {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class NavbarComponent {
  currentUser: User | null = null;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
