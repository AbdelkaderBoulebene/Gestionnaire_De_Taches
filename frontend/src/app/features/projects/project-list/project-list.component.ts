import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { Project, Priority } from '../../../core/models/project.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container project-page">
      <div class="header">
        <h1>Projets</h1>
        <button *ngIf="isAdmin" class="btn btn-primary" (click)="createProject()">
          + Nouveau Projet
        </button>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Statut:</label>
          <select [(ngModel)]="statusFilter" (change)="loadProjects()">
            <option [ngValue]="null">Tous</option>
            <option value="ACTIVE">Actif</option>
            <option value="COMPLETED">Terminé</option>
            <option value="ARCHIVED">Archivé</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Priorité:</label>
          <select [(ngModel)]="priorityFilter" (change)="loadProjects()">
            <option [ngValue]="null">Toutes</option>
            <option value="HIGH">Haute</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Basse</option>
          </select>
        </div>
      </div>

      <div class="card">
        <table *ngIf="projects.length > 0">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Progression</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Dates</th>
              <th *ngIf="isAdmin">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let project of projects">
              <td>
                <div class="project-name">{{ project.name }}</div>
              </td>
              <td class="desc-cell">{{ project.description }}</td>
              <td class="progress-cell">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="projectProgress[project.id!] || 0"></div>
                </div>
                <span class="progress-text">{{ projectProgress[project.id!] || 0 | number:'1.0-0' }}%</span>
              </td>
              <td><span class="badge" [class.badge-active]="project.status === 'ACTIVE'">{{ project.status }}</span></td>
              <td>
                <span class="badge" 
                      [class.badge-high]="project.priority === 'HIGH'"
                      [class.badge-medium]="project.priority === 'MEDIUM'"
                      [class.badge-low]="project.priority === 'LOW'">
                  {{ project.priority }}
                </span>
              </td>
              <td>
                <div class="date-range">
                  <span>{{ project.startDate | date:'dd/MM/yyyy' }}</span>
                  <span class="date-arrow">→</span>
                  <span>{{ project.endDate | date:'dd/MM/yyyy' }}</span>
                </div>
              </td>
              <td *ngIf="isAdmin" class="actions-cell">
                <button class="btn-icon view" title="Voir les tâches" (click)="viewTasks(project)">👁</button>
                <button class="btn-icon edit" title="Modifier" (click)="editProject(project)">✎</button>
                <button class="btn-icon delete" title="Supprimer" (click)="deleteProject(project)">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="loading" class="spinner"></div>
        <p *ngIf="!loading && projects.length === 0" class="empty-state">Aucun projet trouvé avec ces critères.</p>
      </div>

      <div class="modal-backdrop" *ngIf="showDeleteModal">
        <div class="modal-content">
          <h3>Confirmer la suppression</h3>
          <p>Cette action supprimera le projet <strong>{{ projectToDelete?.name }}</strong> et toutes ses tâches.</p>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="cancelDelete()">Annuler</button>
            <button class="btn-danger" (click)="confirmDelete()">Confirmer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-page { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .btn-primary { background: #667eea; color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
    .btn-primary:hover { background: #5a67d8; }
    
    .filters { display: flex; gap: 20px; margin-bottom: 24px; background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .filter-group { display: flex; align-items: center; gap: 10px; }
    .filter-group select { padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; }
    
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 16px; border-bottom: 2px solid #e2e8f0; color: #718096; font-weight: 600; }
    td { padding: 16px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
    
    .project-name { font-weight: 600; color: #2d3748; }
    .desc-cell { max-width: 250px; color: #718096; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .progress-bar { width: 100px; height: 8px; background: #edf2f7; border-radius: 4px; overflow: hidden; display: inline-block; vertical-align: middle; margin-right: 8px; }
    .progress-fill { height: 100%; background: #48bb78; transition: width 0.3s ease; }
    .progress-text { font-size: 12px; color: #718096; }
    
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #e2e8f0; color: #718096; }
    .badge-active { background: #c6f6d5; color: #22543d; }
    .badge-high { background: #fed7d7; color: #9b2c2c; }
    .badge-medium { background: #feebc8; color: #9c4221; }
    .badge-low { background: #bee3f8; color: #2c5282; }
    
    .date-range { display: flex; flex-direction: column; font-size: 13px; color: #718096; }
    .date-arrow { color: #cbd5e0; transform: rotate(90deg); display: none; }
    
    .actions-cell { display: flex; gap: 8px; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 18px; padding: 4px; border-radius: 4px; transition: background 0.2s; }
    .btn-icon:hover { background: #edf2f7; }
    .btn-icon.delete:hover { color: #e53e3e; background: #fff5f5; }
    .btn-icon.edit:hover { color: #3182ce; background: #ebf8ff; }
    .btn-icon.view:hover { color: #667eea; background: #ebf4ff; }
    
    .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; padding: 24px; border-radius: 12px; min-width: 320px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    .modal-content h3 { margin-top: 0; color: #2d3748; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
    .btn-secondary { background: #e2e8f0; color: #4a5568; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
    .btn-secondary:hover { background: #cbd5e0; }
    .btn-danger { background: #e53e3e; color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
    .btn-danger:hover { background: #c53030; }
  `]
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  projectProgress: { [key: number]: number } = {};
  loading = true;
  isAdmin = false;

  statusFilter: string | null = null;
  priorityFilter: string | null = null;

  private projectsSub?: Subscription;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }
  }

  loadProjects(): void {
    if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }

    this.loading = true;
    const priority = this.priorityFilter ? this.priorityFilter as Priority : undefined;

    this.projectsSub = this.projectService.getProjects(this.statusFilter || undefined, priority).subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
        // Charger la progression pour chaque projet
        this.projects.forEach(p => {
          if (p.id) this.loadProgress(p.id);
        });
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  loadProgress(projectId: number): void {
    this.projectService.getProjectProgress(projectId).subscribe(
      progress => this.projectProgress[projectId] = progress
    );
  }

  createProject(): void {
    this.router.navigate(['/projects/new']);
  }

  viewTasks(project: Project): void {
    this.router.navigate(['/tasks'], { queryParams: { projectId: project.id } });
  }

  editProject(project: Project): void {
    this.router.navigate(['/projects/edit', project.id]);
  }

  // Modal state
  showDeleteModal = false;
  projectToDelete: Project | null = null;

  deleteProject(project: Project): void {
    this.projectToDelete = project;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.projectToDelete = null;
  }

  confirmDelete(): void {
    if (this.projectToDelete && this.projectToDelete.id) {
      this.loading = true; // Show loading spinner
      this.projectService.deleteProject(this.projectToDelete.id).subscribe({
        next: () => {
          this.loadProjects(); // Will clear loading
          this.showDeleteModal = false;
          this.projectToDelete = null;
          // alert('Projet supprimé.'); // Feedback discret via l'UI refresh
        },
        error: (error) => {
          console.error('Erreur DELETE:', error);
          this.loading = false;
          alert('Erreur: ' + (error.error?.message || error.message || 'Inconnue'));
          this.showDeleteModal = false;
        }
      });
    }
  }
}
