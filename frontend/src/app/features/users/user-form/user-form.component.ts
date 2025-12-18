
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, RegisterRequest } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content glass-panel" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ user ? 'Modifier l\\'Utilisateur' : 'Nouvel Utilisateur' }}</h2>
        
        <form (ngSubmit)="onSubmit()" #userForm="ngForm">
          <div class="form-group">
            <label>Nom</label>
            <input type="text" [(ngModel)]="formData.name" name="name" required class="form-control">
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="formData.email" name="email" required class="form-control">
          </div>

          <div class="form-group" *ngIf="!user">
            <label>Mot de passe</label>
            <input type="password" [(ngModel)]="password" name="password" required class="form-control">
          </div>

          <div class="form-group">
            <label>Rôle</label>
            <select [(ngModel)]="formData.role" name="role" required class="form-control">
              <option value="USER">Utilisateur</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="close()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="!userForm.form.valid">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex; justify-content: center; align-items: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-content {
      width: 100%; max-width: 500px;
      padding: 32px;
      border-radius: 24px;
      position: relative;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-title { margin-bottom: 24px; font-size: 1.5rem; text-align: center; }

    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary); }
    
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }
    
    .btn-secondary { background: rgba(255,255,255,0.1); color: var(--text-primary); border: 1px solid var(--glass-border); }
    .btn-secondary:hover { background: rgba(255,255,255,0.2); }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class UserFormComponent {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  formData: any = { role: 'USER' };
  password = '';

  constructor(private userService: UserService) { }

  ngOnChanges(): void {
    if (this.user) {
      this.formData = { ...this.user };
    } else {
      this.formData = { role: 'USER' };
      this.password = '';
    }
  }

  close(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    if (this.user) {
      this.userService.updateUser(this.user.id, this.formData).subscribe({
        next: () => this.save.emit(),
        error: (err) => console.error('Update failed', err)
      });
    } else {
      const newUser = { ...this.formData, password: this.password };
      this.userService.createUser(newUser).subscribe({
        next: () => this.save.emit(),
        error: (err) => console.error('Create failed', err)
      });
    }
  }
}
