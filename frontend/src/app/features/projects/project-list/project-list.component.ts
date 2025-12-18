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
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Projets</h1>
        <div class="header-actions">
            <a routerLink="/projects/archived" class="btn btn-secondary mr-2">📦 Archives</a>
            <button *ngIf="canManageProjects" class="btn btn-primary" (click)="createProject()">
            + Nouveau Projet
            </button>
        </div>
      </div>

      <div class="card mb-4 filter-glass">
        <div class="filter-row-unified">
           <!-- Search -->
           <div class="filter-item search-item">
            <span class="filter-icon">🔍</span>
            <input type="text" [(ngModel)]="searchTerm" (input)="onSearchChange()" placeholder="Chercher un projet..." class="glass-input-clean">
          </div>

           <div class="filter-separator"></div>

            <div class="filter-item">
             <select [(ngModel)]="statusFilter" (change)="loadProjects()" class="glass-select-clean">
               <option [ngValue]="null">📊 Tous Statuts</option>
               <option value="ACTIVE">🟢 Actif</option>
               <option value="COMPLETED">🔵 Terminé</option>
             </select>
           </div>
        
          <div class="filter-item">
             <select [(ngModel)]="priorityFilter" (change)="loadProjects()" class="glass-select-clean">
              <option [ngValue]="null">🚩 Toutes Priorités</option>
              <option value="HIGH">🔴 Haute</option>
              <option value="MEDIUM">🟠 Moyenne</option>
              <option value="LOW">🟢 Basse</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card p-0">
        <table *ngIf="filteredProjects.length > 0">
          <thead>
             <tr>
               <th (click)="sortBy('name')" class="sortable">Nom <span class="sort-indicator" *ngIf="sortField === 'name'">{{ sortAsc ? '↑' : '↓' }}</span></th>
               <th>Tâches</th>
               <th>Progression</th>
               <th>Statut</th>
               <th>Priorité</th>
               <th (click)="sortBy('startDate')" class="sortable">Début <span class="sort-indicator" *ngIf="sortField === 'startDate'">{{ sortAsc ? '↑' : '↓' }}</span></th>
               <th (click)="sortBy('endDate')" class="sortable">Fin <span class="sort-indicator" *ngIf="sortField === 'endDate'">{{ sortAsc ? '↑' : '↓' }}</span></th>
               <th *ngIf="canManageProjects">Actions</th>
             </tr>
          </thead>
          <tbody>
            <tr *ngFor="let project of projects" [class.hover-row]="true">
               <td>
                 <div class="project-name text-wrap-responsive" [title]="project.name">{{ project.name }}</div>
               </td>
               <td>
                 <span class="task-count">{{ project.taskCount || 0 }}</span>
               </td>
               <td class="progress-cell">
                 <div class="progress-bar">
                   <div class="progress-fill" [style.width.%]="projectProgress[project.id!] || 0"></div>
                 </div>
                 <span class="progress-text">{{ projectProgress[project.id!] || 0 | number:'1.0-0' }}%</span>
               </td>
               <td>
                 <span class="badge" 
                   [class.badge-active]="project.status === 'ACTIVE'"
                   [class.badge-completed]="project.status === 'COMPLETED'"
                   [class.badge-archived]="project.status === 'ARCHIVED'">
                   {{ project.status }}
                 </span>
               </td>
               <td>
                 <span class="badge" 
                       [class.badge-high]="project.priority === 'HIGH'"
                       [class.badge-medium]="project.priority === 'MEDIUM'"
                       [class.badge-low]="project.priority === 'LOW'">
                   {{ project.priority }}
                 </span>
               </td>
               <td>{{ project.startDate | date:'dd/MM/yyyy' }}</td>
               <td>{{ project.endDate | date:'dd/MM/yyyy' }}</td>
               <td *ngIf="canManageProjects" class="actions-cell">
                 <button class="btn-icon view" title="Voir les tâches" (click)="viewTasks(project)">👁</button>
                 <button class="btn-icon edit" title="Modifier" (click)="editProject(project)">✎</button>
                 <button class="btn-icon delete" title="Supprimer" (click)="deleteProject(project)">🗑</button>
               </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="loading" class="spinner"></div>
        <div *ngIf="!loading && filteredProjects.length === 0" class="empty-state">
          Aucun projet trouvé avec ces critères.
        </div>
      </div>

      <div class="modal-backdrop" *ngIf="showDeleteModal">
        <div class="modal-content card">
          <h3>Confirmer la suppression</h3>
          <p>Cette action supprimera le projet <strong>{{ projectToDelete?.name }}</strong> et toutes ses tâches.</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="cancelDelete()">Annuler</button>
            <button class="btn btn-danger" (click)="confirmDelete()">Confirmer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      text-shadow: 0 0 15px rgba(255,255,255,0.1);
      margin: 0;
    }

    .project-name-cont { max-width: 200px; }
    
    .header-actions { display: flex; gap: 16px; align-items: center; }

    .btn-secondary {
        background: rgba(255,255,255,0.1);
        color: var(--text-primary);
        padding: 8px 16px;
        border-radius: 8px;
        text-decoration: none;
        border: 1px solid var(--glass-border);
        transition: all 0.2s;
        font-weight: 600;
        font-size: 0.9rem;
    }
    .btn-secondary:hover {
        background: rgba(255,255,255,0.2);
        color: var(--text-primary);
    }

    .filter-glass {
      background: var(--glass-surface);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      padding: 16px 24px;
      border-radius: 100px;
      display: flex;
      align-items: center;
      margin-bottom: 48px;
      position: relative;
      z-index: 20;
    }
    
    .filter-row-unified {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 16px;
      flex-wrap: nowrap;
    }

    .filter-item {
      display: flex;
      align-items: center;
    }
    
    .search-item {
      flex: 1;
      position: relative;
      background: rgba(0,0,0,0.1);
      border-radius: 50px;
      padding: 0 16px;
      transition: all 0.3s;
      border: 1px solid transparent;
    }
    .search-item:focus-within {
      background: rgba(0,0,0,0.2);
      border-color: var(--primary-glow);
      box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
    }

    .filter-icon { margin-right: 8px; opacity: 0.5; }
    
    .glass-input-clean {
      background: transparent;
      border: none;
      color: var(--text-primary);
      padding: 12px 0;
      width: 100%;
      outline: none;
      font-weight: 500;
      height: 100%;
    }

    .filter-separator {
      width: 1px;
      height: 32px;
      background: var(--glass-border);
    }

    .glass-select-clean {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-weight: 600;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 0.9rem;
      border-radius: 8px;
      transition: all 0.2s;
    }
    .glass-select-clean:hover {
      background: rgba(255,255,255,0.05);
      color: var(--text-primary);
    }
    .glass-select-clean:focus { outline: none; }
    .glass-select-clean option { background: #0F172A; color: white; }

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

    th.sortable { cursor: pointer; transition: color 0.2s; }
    th.sortable:hover { color: var(--text-primary); }
    .sort-indicator { color: var(--primary-glow); margin-left: 4px; }

    tbody tr {
      background: var(--glass-surface);
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
      position: relative;
      z-index: 1;
    }
    
    tbody tr td:first-child { border-top-left-radius: 16px; border-bottom-left-radius: 16px; }
    tbody tr td:last-child { border-top-right-radius: 16px; border-bottom-right-radius: 16px; }

    tbody tr:hover {
      /* transform: scale(1.01); REMOVED */
      background: rgba(255,255,255,0.08); /* Matches Task List hover */
      border: 1px solid var(--primary-glow);
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 2;
    }

    td { padding: 16px; border: none; color: var(--text-secondary); vertical-align: middle; text-align: center; }
    td:first-child { text-align: left; }

    .project-name { font-weight: 700; color: var(--text-primary); font-size: 1rem; }
    
    .task-count { 
      font-weight: 700; 
      color: #fff; 
      background: var(--primary-glow); 
      padding: 4px 12px; 
      border-radius: 50px; 
      font-size: 0.8rem;
      box-shadow: 0 0 10px var(--primary-glow);
    }
    
    .progress-cell { display: flex; align-items: center; gap: 8px; }
    .progress-bar { 
      width: 100px; 
      height: 6px; 
      background: rgba(255,255,255,0.1); 
      border-radius: 3px; 
      overflow: hidden; 
    }
    .progress-fill { height: 100%; background: var(--primary-glow); transition: width 0.5s ease; border-radius: 3px; box-shadow: 0 0 10px var(--primary-glow); }
    .progress-text { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; min-width: 35px; }
    
    /* Project Status Badges */
    .badge { padding: 4px 12px; border-radius: 50px; font-weight: 700; font-size: 0.7rem; text-transform: uppercase; border: 1px solid transparent; }
    .badge-active { background: rgba(52, 211, 153, 0.2); color: var(--success-glow); border-color: var(--success-glow); }
    .badge-completed { background: rgba(34, 211, 238, 0.2); color: var(--primary-glow); border-color: var(--primary-glow); }
    .badge-archived { background: rgba(148, 163, 184, 0.2); color: var(--text-muted); border-color: var(--text-muted); }

    /* Priority Badges */
    .badge-high { background: rgba(244, 63, 94, 0.2); color: var(--danger-glow); border-color: var(--danger-glow); }
    .badge-medium { background: rgba(251, 191, 36, 0.2); color: var(--warning-glow); border-color: var(--warning-glow); }
    .badge-low { background: rgba(52, 211, 153, 0.2); color: var(--success-glow); border-color: var(--success-glow); }

    .actions-cell { display: flex; gap: 8px; justify-content: center; }
    .btn-icon { 
      background: rgba(255,255,255,0.05); 
      border: 1px solid transparent; 
      cursor: pointer; 
      font-size: 1.1rem; 
      padding: 8px; 
      border-radius: 8px; 
      transition: all 0.2s; 
      color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .btn-icon:hover { background: var(--primary-glow); color: #000; box-shadow: 0 0 10px var(--primary-glow); }
    .btn-icon.delete:hover { background: var(--danger-glow); color: #fff; box-shadow: 0 0 10px var(--danger-glow); }
    
    .empty-state { padding: 40px; text-align: center; color: var(--text-muted); font-style: italic; background: rgba(0,0,0,0.2); border-radius: 20px; }

    .modal-backdrop { 
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; z-index: 1000; 
    }
    .modal-content { 
      max-width: 500px; width: 90%; 
      animation: fadeIn 0.3s ease-out;
      background: var(--bg-deep); /* Use deep background for modal too */
      border: 1px solid var(--primary-glow);
      box-shadow: 0 0 50px rgba(34, 211, 238, 0.2);
    }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
  `]
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  projectProgress: { [key: number]: number } = {};
  loading = true;
  canManageProjects = false;

  statusFilter: string | null = null;
  priorityFilter: string | null = null;
  searchTerm = '';

  sortField = 'startDate';
  sortAsc = true;

  private projectsSub?: Subscription;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {
    this.canManageProjects = this.authService.canManageProjects();
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
        // Filter out ARCHIVED projects from this view (they have their own page)
        this.projects = data.filter(p => p.status !== 'ARCHIVED');
        this.applyFilters();
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

  applyFilters(): void {
    let temp = [...this.projects];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(p => p.name.toLowerCase().includes(term));
    }

    temp.sort((a: any, b: any) => {
      let valA = a[this.sortField];
      let valB = b[this.sortField];

      // Handle nulls
      if (!valA) valA = '';
      if (!valB) valB = '';

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.filteredProjects = temp;
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
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
