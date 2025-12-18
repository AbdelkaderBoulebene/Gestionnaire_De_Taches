import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Project, Priority } from '../../../core/models/project.model';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-archived-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Projets Archivés</h1>
        <a routerLink="/projects" class="btn btn-secondary">← Retour aux Projets</a>
      </div>

      <!-- Project List -->
      <div class="card p-0 mb-5">
        <table *ngIf="projects.length > 0">
          <thead>
            <tr>
              <th style="width: 30%">Nom</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Date de Fin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let project of projects" (click)="selectProject(project)" [class.selected]="selectedProject?.id === project.id">
              <td>
                <div class="project-name text-wrap-responsive" [title]="project.name">{{ project.name }}</div>
              </td>
              <td>
                 <span class="badge" 
                    [class.badge-todo]="project.status === 'TODO'"
                    [class.badge-inprogress]="project.status === 'IN_PROGRESS'"
                    [class.badge-done]="project.status === 'DONE'"
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
              <td>{{ project.endDate | date:'dd/MM/yyyy' }}</td>
              <td class="actions-cell" (click)="$event.stopPropagation()">
                <button class="btn-icon restore" title="Désarchiver" (click)="restoreProject(project, $event)">↩️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="projects.length === 0" class="empty-state">
          Aucun projet archivé.
        </div>
      </div>

      <!-- Selected Project Tasks -->
      <div *ngIf="selectedProject" class="task-preview-section fade-in">
        <h2 class="section-title">
          Tâches du projet : <span class="highlight">{{ selectedProject.name }}</span>
        </h2>
        
        <div class="card p-0">
          <table *ngIf="projectTasks.length > 0">
            <thead>
              <tr>
                <th>Tâche</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th>Assigné à</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let task of projectTasks">
                <td>{{ task.title }}</td>
                <td>
                  <span class="badge" 
                    [class.badge-todo]="task.status === 'TODO'"
                    [class.badge-inprogress]="task.status === 'IN_PROGRESS'"
                    [class.badge-done]="task.status === 'DONE'">
                    {{ task.status }}
                  </span>
                </td>
                <td>
                  <span class="badge" 
                    [class.badge-high]="task.priority === 'HIGH'"
                    [class.badge-medium]="task.priority === 'MEDIUM'"
                    [class.badge-low]="task.priority === 'LOW'">
                    {{ task.priority }}
                  </span>
                </td>
                <td>
                   <div class="avatars">
                    <div *ngFor="let user of task.assignedUsers" class="avatar-circle" [title]="user.name">
                        {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <span *ngIf="!task.assignedUsers || task.assignedUsers.length === 0" class="no-assignee">--</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="projectTasks.length === 0" class="empty-state">
            Aucune tâche dans ce projet.
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
    .btn-secondary {
        background: rgba(255,255,255,0.1);
        color: var(--text-primary);
        padding: 8px 16px;
        border-radius: 8px;
        text-decoration: none;
        border: 1px solid var(--glass-border);
        transition: all 0.2s;
    }
    .btn-secondary:hover {
        background: rgba(255,255,255,0.2);
    }

    table { width: 100%; border-collapse: separate; border-spacing: 0 12px; }
    th { padding: 16px; color: var(--text-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; border: none; text-align: left; }
    
    tbody tr {
        background: var(--glass-surface);
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        transition: all 0.2s ease;
        cursor: pointer;
    }
    tbody tr td:first-child { border-top-left-radius: 16px; border-bottom-left-radius: 16px; }
    tbody tr td:last-child { border-top-right-radius: 16px; border-bottom-right-radius: 16px; }
    
    tbody tr:hover, tbody tr.selected {
        background: rgba(255,255,255,0.08); /* Matches Task List hover */
        border: 1px solid var(--primary-glow);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 2;
    }
    
    tbody tr.selected {
        border-color: var(--accent-glow);
        box-shadow: 0 0 15px var(--accent-glow);
    }

    td { padding: 16px; border: none; color: var(--text-secondary); vertical-align: middle; text-align: center; }
    td:first-child { text-align: left; }
    .project-name { font-weight: 700; color: var(--text-primary); }
    .desc-cell { color: var(--text-muted); font-size: 0.9rem; }
    
    .empty-state { padding: 40px; text-align: center; color: var(--text-muted); }

    /* Task Preview Section */
    .task-preview-section { margin-top: 48px; border-top: 1px solid var(--glass-border); padding-top: 24px; }
    .section-title { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 24px; }
    .highlight { color: var(--primary-glow); }
    .fade-in { animation: fadeIn 0.5s ease-out; }

    /* Badges */
    .badge { padding: 4px 12px; border-radius: 50px; font-weight: 700; font-size: 0.7rem; text-transform: uppercase; border: 1px solid transparent; }
    .badge-todo { background: rgba(148, 163, 184, 0.2); color: var(--text-muted); border-color: var(--text-muted); }
    .badge-inprogress { background: rgba(251, 191, 36, 0.2); color: var(--warning-glow); border-color: var(--warning-glow); }
    .badge-done { background: rgba(52, 211, 153, 0.2); color: var(--success-glow); border-color: var(--success-glow); }
    
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
      display: flex; 
      align-items: center; 
      justify-content: center;
    }
    .btn-icon:hover { background: var(--primary-glow); color: #000; box-shadow: 0 0 10px var(--primary-glow); }
    .btn-icon.restore:hover { background: var(--success-glow); color: #fff; box-shadow: 0 0 10px var(--success-glow); }

    .avatars { display: flex; -webkit-box-align: center; align-items: center; }
    .avatar-circle { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-glow), var(--accent-glow)); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; border: 2px solid var(--bg-deep); margin-left: -8px; position: relative; }
    .avatar-circle:first-child { margin-left: 0; }
  `]
})
export class ArchivedProjectsComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  projectTasks: Task[] = [];

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadArchivedProjects();
  }

  loadArchivedProjects(): void {
    // We fetch ALL projects then filter, or fetch by status if service supports it.
    // Assuming service supports status filter.
    this.projectService.getProjects('ARCHIVED').subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => console.error('Error loading archived projects', err)
    });
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
    if (project.id) {
      this.loadTasks(project.id);
    }
  }

  loadTasks(projectId: number): void {
    this.taskService.getTasksByProject(projectId).subscribe({
      next: (data) => {
        this.projectTasks = data;
      },
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  restoreProject(project: Project, event: Event): void {
    event.stopPropagation(); // Prevent row selection

    // Send only the fields needed for update
    const updatedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      priority: project.priority,
      status: 'ACTIVE'
    };

    this.projectService.updateProject(project.id!, updatedProject).subscribe({
      next: () => {
        this.loadArchivedProjects(); // Reload list
        this.selectedProject = null;
        this.projectTasks = [];
      },
      error: (err) => {
        console.error('Error restoring project:', err);
        alert('Erreur lors du désarchivage du projet');
      }
    });
  }
}
