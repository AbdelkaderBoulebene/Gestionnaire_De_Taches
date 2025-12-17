import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container">
      <h1>Gestion des Utilisateurs</h1>
      <div class="card">
        <table *ngIf="users.length > 0">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date de création</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td><span class="badge">{{ user.role }}</span></td>
              <td>{{ user.createdAt | date }}</td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="loading" class="spinner"></div>
        <p *ngIf="!loading && users.length === 0">Aucun utilisateur trouvé.</p>
      </div>
    </div>
  `,
    styles: []
})
export class UserListComponent implements OnInit {
    users: User[] = [];
    loading = true;

    constructor(private userService: UserService) { }

    ngOnInit(): void {
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
