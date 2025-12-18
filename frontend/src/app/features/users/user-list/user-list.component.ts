import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Utilisateurs</h1>
        <button class="btn btn-primary" (click)="openCreate()">
          + Nouvel Utilisateur
        </button>
      </div>
      
      <div class="card p-0">
        <table *ngIf="users.length > 0">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>
                 <div class="user-info">
                    <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                    <span class="user-name text-wrap-responsive">{{ user.name }}</span>
                 </div>
              </td>
              <td class="text-wrap-responsive">{{ user.email }}</td>
              <td>
                <span class="badge" [class.badge-admin]="user.role === 'ADMIN'" [class.badge-manager]="user.role === 'MANAGER'" [class.badge-user]="user.role === 'USER'">
                    {{ user.role }}
                </span>
              </td>
              <td>{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
              <td class="actions-cell">
                <button class="btn-icon edit" title="Modifier" (click)="openEdit(user)">✎</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="loading" class="spinner"></div>
        <div *ngIf="!loading && users.length === 0" class="empty-state">
          Aucun utilisateur trouvé.
        </div>
      </div>
      
      <app-user-form 
        *ngIf="showModal" 
        [user]="selectedUser" 
        (save)="onSave()" 
        (cancel)="onCancel()">
      </app-user-form>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      text-shadow: 0 0 15px rgba(255,255,255,0.1);
      margin: 0;
    }
    
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }

    .p-0 { padding: 0 !important; overflow: hidden; background: transparent; border: none; box-shadow: none; }

    table { width: 100%; border-collapse: separate; border-spacing: 0 12px; }

    th {
      padding: 16px;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border: none;
    }

    tbody tr {
      background: var(--glass-surface);
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    tbody tr td:first-child { border-top-left-radius: 16px; border-bottom-left-radius: 16px; }
    tbody tr td:last-child { border-top-right-radius: 16px; border-bottom-right-radius: 16px; }

    tbody tr:hover {
      transform: scale(1.01);
      background: rgba(255,255,255,0.08);
      border: 1px solid var(--primary-glow);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }

    td { padding: 16px; border: none; color: var(--text-secondary); vertical-align: middle; }

    .user-info { display: flex; align-items: center; gap: 12px; }
    .user-avatar { 
        width: 32px; height: 32px; border-radius: 50%; background: var(--accent-glow); 
        color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;
        box-shadow: 0 0 10px var(--accent-glow);
    }
    .user-name { font-weight: 700; color: var(--text-primary); }

    .badge { padding: 4px 12px; border-radius: 50px; font-weight: 700; font-size: 0.7rem; text-transform: uppercase; border: 1px solid transparent; }
    .badge-admin { background: rgba(34, 211, 238, 0.2); color: var(--primary-glow); border-color: var(--primary-glow); }
    .badge-manager { background: rgba(251, 191, 36, 0.2); color: var(--warning-glow); border-color: var(--warning-glow); }
    .badge-user { background: rgba(148, 163, 184, 0.2); color: var(--text-muted); border-color: var(--text-muted); }
    
    .actions-cell { text-align: right; white-space: nowrap; }
    .btn-icon { background: none; border: none; font-size: 1.2rem; cursor: pointer; transition: transform 0.2s; padding: 4px 8px; border-radius: 8px; }
    .btn-icon:hover { background: rgba(255,255,255,0.1); transform: scale(1.1); }
    .btn-icon.edit { color: var(--primary-glow); }
    
    .empty-state { padding: 40px; text-align: center; color: var(--text-muted); font-style: italic; background: rgba(0,0,0,0.2); border-radius: 20px; }
    .spinner { margin: 40px auto; }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;
  showModal = false;
  selectedUser: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  openCreate(): void {
    this.selectedUser = null;
    this.showModal = true;
  }

  openEdit(user: User): void {
    this.selectedUser = user;
    this.showModal = true;
  }

  onCancel(): void {
    this.showModal = false;
    this.selectedUser = null;
  }

  onSave(): void {
    this.showModal = false;
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }
}
