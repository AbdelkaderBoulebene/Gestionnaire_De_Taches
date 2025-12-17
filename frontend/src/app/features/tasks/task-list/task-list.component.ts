import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task, TaskStatus, Priority } from '../../../core/models/task.model';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container task-page">
      <div class="header">
        <h1>Tâches</h1>
        <button class="btn btn-primary" (click)="createTask()">
          + Nouvelle Tâche
        </button>
      </div>

      <div class="filters">
        <div class="filter-row">
           <div class="filter-group">
            <label>Recherche:</label>
            <input type="text" [(ngModel)]="searchTerm" (input)="onSearchOrSortChange()" placeholder="Titres..." class="search-input">
          </div>

           <div class="filter-group">
            <label>Projet:</label>
            <select [(ngModel)]="projectFilter" (change)="onFilterChange()">
              <option [ngValue]="null">Tous</option>
              <option *ngFor="let p of projects" [ngValue]="p.id">{{ p.name }}</option>
            </select>
          </div>
        </div>

        <div class="filter-row second">
            <div class="filter-group">
              <label>Vue:</label>
              <div class="toggle-group">
                <button [class.active]="typeFilter === 'ALL'" (click)="toggleView('ALL')">Toutes</button>
                <button [class.active]="typeFilter === 'MY_TASKS'" (click)="toggleView('MY_TASKS')">Mes Tâches</button>
                <button [class.active]="typeFilter === 'OVERDUE'" (click)="toggleView('OVERDUE')">Retard</button>
              </div>
            </div>

            <div class="filter-group">
              <label>Statut:</label>
              <select [(ngModel)]="statusFilter" (change)="onFilterChange()">
                <option value="">Tous</option>
                <option value="TODO">À Faire</option>
                <option value="IN_PROGRESS">En Cours</option>
                <option value="DONE">Terminé</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Priorité:</label>
              <select [(ngModel)]="priorityFilter" (change)="onFilterChange()">
                <option value="">Toutes</option>
                <option value="HIGH">Haute</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="LOW">Basse</option>
              </select>
            </div>
        </div>
      </div>

      <div class="card">
        <table *ngIf="filteredTasks.length > 0">
          <thead>
            <tr>
              <th (click)="sortBy('title')" class="sortable">Tâche <span *ngIf="sortField === 'title'">{{ sortAsc ? '↑' : '↓' }}</span></th>
              <th (click)="sortBy('project')" class="sortable">Projet <span *ngIf="sortField === 'project'">{{ sortAsc ? '↑' : '↓' }}</span></th>
              <th>Statut</th>
              <th>Priorité</th>
              <th (click)="sortBy('date')" class="sortable">Échéance <span *ngIf="sortField === 'date'">{{ sortAsc ? '↑' : '↓' }}</span></th>
              <th>Assigné à</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let task of filteredTasks">
              <td>
                <div class="task-title">{{ task.title }}</div>
                <div class="task-desc" *ngIf="task.description">{{ task.description }}</div>
              </td>
              <td>
                <span class="project-tag" *ngIf="task.projectName">{{ task.projectName }}</span>
              </td>
              <td>
                <select [ngModel]="task.status" 
                        (ngModelChange)="updateStatus(task, $event)"
                        class="status-select"
                        [class.status-todo]="task.status === 'TODO'"
                        [class.status-progress]="task.status === 'IN_PROGRESS'"
                        [class.status-done]="task.status === 'DONE'">
                  <option value="TODO">À FAIRE</option>
                  <option value="IN_PROGRESS">EN COURS</option>
                  <option value="DONE">TERMINÉ</option>
                </select>
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
                <span [ngClass]="getDateColor(task)">
                  {{ task.endDate | date:'dd/MM/yyyy' }}
                </span>
              </td>
              <td>
                <div class="assignees-container">
                  <ng-container *ngIf="task.assignedUsers && task.assignedUsers.length > 0; else noAssignee">
                    <div class="user-badge" *ngFor="let user of task.assignedUsers">
                      {{ user.name }}
                    </div>
                  </ng-container>
                  <ng-template #noAssignee>
                    <span class="text-muted">Non assigné</span>
                  </ng-template>
                </div>
              </td>
              <td class="actions-cell">
                <button class="btn-icon edit" (click)="editTask(task)">✎</button>
                <button class="btn-icon delete" (click)="deleteTask(task)">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="loading" class="spinner"></div>
        <p *ngIf="!loading && filteredTasks.length === 0" class="empty-state">Aucune tâche trouvée.</p>
      </div>
    </div>
  `,
  styles: [`
    .task-page { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .btn-primary { background: #667eea; color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
    
    .filters { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .filter-row { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; }
    .filter-group { display: flex; align-items: center; gap: 10px; }
    
    .search-input { padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0; min-width: 200px; }
    select { padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; }

    .toggle-group { display: flex; background: #edf2f7; padding: 4px; border-radius: 6px; }
    .toggle-group button { border: none; background: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; color: #718096; }
    .toggle-group button.active { background: white; color: #4a5568; shadow: 0 1px 2px rgba(0,0,0,0.1); }
    
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 16px; border-bottom: 2px solid #e2e8f0; color: #718096; font-weight: 600; }
    th.sortable { cursor: pointer; user-select: none; }
    th.sortable:hover { color: #4a5568; background: #f7fafc; }

    td { padding: 16px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
    
    .project-tag { background: #edf2f7; color: #4a5568; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }

    .task-title { font-weight: 600; color: #2d3748; }
    .task-desc { font-size: 12px; color: #718096; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .status-select { padding: 6px 10px; border-radius: 20px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; appearance: none; text-align: center; }
    .status-todo { background: #bee3f8; color: #2c5282; }
    .status-progress { background: #feebc8; color: #9c4221; }
    .status-done { background: #c6f6d5; color: #22543d; }

    .text-danger { color: #e53e3e; font-weight: 700; }
    .text-warning { color: #dd6b20; font-weight: 700; }
    .text-dark { color: #2d3748; }

    
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #e2e8f0; color: #718096; }
    .badge-high { background: #fed7d7; color: #9b2c2c; }
    .badge-medium { background: #feebc8; color: #9c4221; }
    .badge-low { background: #bee3f8; color: #2c5282; }
    
    .assignees-container { display: flex; flex-wrap: wrap; gap: 4px; }
    .user-badge { 
      background: #ebf4ff; 
      color: #4c51bf; 
      padding: 2px 8px; 
      border-radius: 12px; 
      font-size: 11px; 
      font-weight: 600;
      white-space: nowrap;
      border: 1px solid #c3dafe;
    }
    .text-danger { color: #e53e3e; font-weight: 600; }
    .text-muted { color: #a0aec0; font-style: italic; font-size: 14px; }
    
    .actions-cell { display: flex; gap: 8px; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 18px; padding: 4px; border-radius: 4px; transition: background 0.2s; }
    .btn-icon:hover { background: #edf2f7; }
    .btn-icon.delete:hover { color: #e53e3e; background: #fff5f5; }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  projects: Project[] = [];
  loading = true;

  statusFilter = '';
  priorityFilter = '';
  typeFilter = 'ALL'; // ALL, MY_TASKS, OVERDUE
  projectFilter: number | null = null;
  searchTerm = '';

  projectId?: number;

  sortField = 'date';
  sortAsc = true;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.projectId = +params['projectId'];
        this.projectFilter = this.projectId;
      } else {
        this.projectId = undefined;
        this.projectFilter = null;
      }

      if (params['status']) {
        this.statusFilter = params['status'];
      }

      if (params['filter'] === 'overdue') {
        this.typeFilter = 'OVERDUE';
      }

      this.loadTasks();
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(projects => this.projects = projects);
  }

  loadTasks(): void {
    this.loading = true;

    // Load all tasks then filter client side for better UX with search/sort
    // Or if we stick to server side for main filters:
    const status = this.statusFilter ? this.statusFilter as TaskStatus : undefined;
    const priority = this.priorityFilter ? this.priorityFilter as Priority : undefined;

    // Note: If typeFilter is MY_TASKS, we call getMyTasks, else getTasks
    let obs$;
    if (this.typeFilter === 'MY_TASKS') {
      obs$ = this.taskService.getMyTasks();
    } else {
      // If projectId is set via route, use it. Pass undefined for status/priority if we want to filter client side or pass them.
      // Current implementation of getTasks(status, priority, projectId)
      obs$ = this.taskService.getTasks(status, priority, this.projectId || (this.projectFilter ? this.projectFilter : undefined));
    }

    obs$.subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let temp = [...this.tasks];

    // Search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(t =>
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
      );
    }

    // Overdue filter specific
    if (this.typeFilter === 'OVERDUE') {
      temp = temp.filter(t => this.isOverdue(t));
    }

    // Client-side status/priority/project if needed (though API handled some)
    // If we changed filters without reloading API, we would filter here.
    // For now we reload API on dropdown change, so this just handles Search and Sort.

    // Sort
    temp.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      switch (this.sortField) {
        case 'date':
          valA = a.endDate ? new Date(a.endDate).getTime() : 0;
          valB = b.endDate ? new Date(b.endDate).getTime() : 0;
          break;
        case 'title':
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
          break;
        case 'project':
          valA = a.projectName?.toLowerCase() || '';
          valB = b.projectName?.toLowerCase() || '';
          break;
      }

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.filteredTasks = temp;
  }

  onFilterChange(): void {
    // For Status/Priority/Project that tap into API
    this.loadTasks();
  }

  onSearchOrSortChange(): void {
    // Client side only
    this.applyFilters();
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


  getDateColor(task: Task): string {
    if (!task.endDate || task.status === 'DONE') return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(task.endDate);
    date.setHours(0, 0, 0, 0);

    if (date < today) return 'text-danger'; // Passé -> Rouge
    if (date.getTime() === today.getTime()) return 'text-warning'; // Aujourd'hui -> Orange
    return 'text-dark'; // Futur -> Noir
  }

  toggleView(view: string): void {
    this.typeFilter = view;
    this.loadTasks();
  }

  updateStatus(task: Task, newStatus: string): void {
    if (task.id) {
      this.taskService.updateTaskStatus(task.id, newStatus as TaskStatus).subscribe(() => {
        task.status = newStatus as TaskStatus;
      });
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.endDate || task.status === 'DONE') return false;
    return new Date(task.endDate) < new Date();
  }

  createTask(): void {
    const queryParams: any = {};
    if (this.projectId) {
      queryParams.projectId = this.projectId;
    }
    this.router.navigate(['/tasks/new'], { queryParams });
  }

  editTask(task: Task): void {
    const queryParams: any = {};
    if (this.projectId) {
      queryParams.projectId = this.projectId;
    }
    this.router.navigate(['/tasks/edit', task.id], { queryParams });
  }

  deleteTask(task: Task): void {
    if (confirm('Supprimer cette tâche ?')) {
      this.taskService.deleteTask(task.id!).subscribe(() => {
        this.loadTasks();
      });
    }
  }
}
