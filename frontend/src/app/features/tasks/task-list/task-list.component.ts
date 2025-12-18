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
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Tâches</h1>
        <button class="btn btn-primary" (click)="createTask()">
          + Nouvelle Tâche
        </button>
      </div>

      <div class="card mb-4 filter-glass">
        <div class="filter-row-unified">
           <!-- Search -->
           <div class="filter-item search-item">
            <span class="filter-icon">🔍</span>
            <input type="text" [(ngModel)]="searchTerm" (input)="onSearchOrSortChange()" placeholder="Rechercher..." class="glass-input-clean">
          </div>

           <!-- Vue Toggle -->
           <div class="filter-item view-item">
            <div class="glass-toggle-pill">
              <button [class.active]="typeFilter === 'ALL'" (click)="toggleView('ALL')">Toutes</button>
              <button [class.active]="typeFilter === 'MY_TASKS'" (click)="toggleView('MY_TASKS')">Mes Tâches</button>
              <button [class.active]="typeFilter === 'OVERDUE'" (click)="toggleView('OVERDUE')">Retard</button>
            </div>
           </div>

           <!-- Filters Group -->
           <div class="filter-separator"></div>

           <div class="filter-item">
            <select [(ngModel)]="projectFilter" (change)="onFilterChange()" class="glass-select-clean">
              <option [ngValue]="null">📂 Tous les Projets</option>
              <option *ngFor="let p of projects" [ngValue]="p.id">📂 {{ p.name }}</option>
            </select>
          </div>

           <div class="filter-item">
            <select [(ngModel)]="statusFilter" (change)="onFilterChange()" class="glass-select-clean">
              <option value="">📊 Tous les Statuts</option>
              <option value="TODO">⚪ À Faire</option>
              <option value="IN_PROGRESS">🟡 En Cours</option>
              <option value="DONE">🟢 Terminé</option>
            </select>
          </div>
            
          <div class="filter-item">
             <select [(ngModel)]="priorityFilter" (change)="onFilterChange()" class="glass-select-clean">
              <option value="">🚩 Toutes Priorités</option>
              <option value="HIGH">🔴 Haute</option>
              <option value="MEDIUM">🟠 Moyenne</option>
              <option value="LOW">🟢 Basse</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card p-0">
        <table *ngIf="filteredTasks.length > 0">
          <thead>
            <tr>
            <tr>
              <th (click)="sortBy('title')" class="sortable">Tâche <span class="sort-indicator" *ngIf="sortField === 'title'">{{ sortAsc ? '↑' : '↓' }}</span></th>
              <th (click)="sortBy('project')" class="sortable">Projet <span class="sort-indicator" *ngIf="sortField === 'project'">{{ sortAsc ? '↑' : '↓' }}</span></th>
              <th (click)="sortBy('status')" class="sortable">Statut <span class="sort-indicator" *ngIf="sortField === 'status'">{{ sortAsc ? '↑' : '↓' }}</span></th>
              <th (click)="sortBy('priority')" class="sortable">Priorité <span class="sort-indicator" *ngIf="sortField === 'priority'">{{ sortAsc ? '↑' : '↓' }}</span></th>
              <th (click)="sortBy('date')" class="sortable">Échéance <span class="sort-indicator" *ngIf="sortField === 'date'">{{ sortAsc ? '↑' : '↓' }}</span></th>
              <th>Assigné à</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let task of filteredTasks">
              <tr (click)="toggleTaskDetails(task.id!)" [class.selected-row]="selectedTaskId === task.id" style="cursor: pointer;">
                <td>
                  <div class="task-title text-wrap-responsive">{{ task.title }}</div>
                </td>
              <td>
                <div class="project-tag text-wrap-responsive" *ngIf="task.projectName">
                  <span class="project-dot"></span>
                  {{ task.projectName }}
                </div>
              </td>
              <td>
                <select [ngModel]="task.status" 
                        (ngModelChange)="updateStatus(task, $event)"
                        (click)="$event.stopPropagation()"
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
                <span [ngClass]="getDateColor(task)" class="date-badge">
                  {{ task.endDate | date:'dd/MM/yyyy' }}
                </span>
              </td>
              <td>
                <div class="assignees-container">
                  <ng-container *ngIf="task.assignedUsers && task.assignedUsers.length > 0; else noAssignee">
                    <div class="user-badge" *ngFor="let user of task.assignedUsers" [title]="user.name">
                      {{ user.name | slice:0:1 }}
                    </div>
                  </ng-container>
                  <ng-template #noAssignee>
                    <span class="text-muted small">--</span>
                  </ng-template>
                </div>
              </td>
              <td class="actions-cell">
                <button class="btn-icon edit" (click)="$event.stopPropagation(); editTask(task)">✎</button>
                <button class="btn-icon delete" (click)="$event.stopPropagation(); deleteTask(task)">🗑</button>
              </td>
              </tr>
              <tr *ngIf="selectedTaskId === task.id && task.description" class="description-row">
                <td colspan="7" class="description-cell">
                  <div class="task-description-expanded">
                    <strong>Description:</strong> {{ task.description }}
                  </div>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>

        <div *ngIf="loading" class="spinner"></div>
        <div *ngIf="!loading && filteredTasks.length === 0" class="empty-state">
          Aucune tâche trouvée.
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
      margin: 0; /* Margin handled by header container */
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
      z-index: 20; /* Ensure filters are above list */
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

    .glass-toggle-pill { 
      display: flex; 
      background: rgba(0,0,0,0.2); 
      padding: 4px; 
      border-radius: 50px; 
      border: 1px solid var(--glass-border);
    }
    .glass-toggle-pill button { 
      border: none; 
      background: none; 
      padding: 8px 16px; 
      border-radius: 40px; 
      cursor: pointer; 
      font-size: 0.85rem; 
      font-weight: 600; 
      color: var(--text-muted); 
      transition: all 0.3s;
    }
    .glass-toggle-pill button.active { 
      background: var(--primary-glow); 
      color: #000; 
      box-shadow: 0 0 10px rgba(34, 211, 238, 0.3); 
    }
    
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
      /* transform: scale(1.01); REMOVED to prevent overflow issues */
      background: rgba(255,255,255,0.08); 
      border: 1px solid var(--primary-glow);
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 2; /* Slight bump only within table context */
    }

    td { padding: 16px; border: none; color: var(--text-secondary); vertical-align: middle; text-align: center; }
    td:first-child { text-align: left; }

    .task-title { font-weight: 700; color: var(--text-primary); font-size: 1rem; margin-bottom: 4px; }
    .task-desc { font-size: 0.85rem; color: var(--text-muted); }
    
    .project-tag { 
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.05); 
      border: 1px solid var(--glass-border);
      color: var(--text-secondary); 
      padding: 6px 12px; 
      border-radius: 50px; 
      font-size: 0.8rem; 
      font-weight: 600; 
    }
    .project-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-glow); box-shadow: 0 0 5px var(--accent-glow); }

    .status-select { 
      padding: 6px 16px; 
      border-radius: 50px; 
      border: 1px solid transparent; 
      font-size: 0.7rem; 
      font-weight: 800; 
      cursor: pointer; 
      text-align: center; 
      letter-spacing: 0.05em;
      transition: all 0.3s;
      background: transparent;
    }
    .status-select:focus { outline: none; }
    
    .status-select option { background: #0F172A; color: white; }

    .status-todo { color: var(--text-muted); border-color: var(--text-muted); background: rgba(148, 163, 184, 0.1); }
    .status-progress { color: var(--warning-glow); border-color: var(--warning-glow); background: rgba(251, 191, 36, 0.1); box-shadow: 0 0 10px rgba(251, 191, 36, 0.1); }
    .status-done { color: var(--success-glow); border-color: var(--success-glow); background: rgba(52, 211, 153, 0.1); box-shadow: 0 0 10px rgba(52, 211, 153, 0.1); }

    /* Date Colors */
    .text-danger { color: #fff; font-weight: 700; background: var(--danger-glow); padding: 4px 8px; border-radius: 4px; box-shadow: 0 0 10px var(--danger-glow); }
    .text-warning { color: var(--warning-glow); font-weight: 700; text-shadow: 0 0 5px var(--warning-glow); }
    .text-dark { color: var(--text-muted); }
    .date-badge { font-family: 'Space Grotesk', monospace; font-size: 0.9rem; }
    
    /* Priority Badges */
    .badge { padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 0.7rem; text-transform: uppercase; }
    .badge-high { background: rgba(244, 63, 94, 0.2); color: var(--danger-glow); border: 1px solid var(--danger-glow); }
    .badge-medium { background: rgba(251, 191, 36, 0.2); color: var(--warning-glow); border: 1px solid var(--warning-glow); }
    .badge-low { background: rgba(52, 211, 153, 0.2); color: var(--success-glow); border: 1px solid var(--success-glow); }
    
    .assignees-container { display: flex; flex-wrap: wrap; gap: -8px; }
    .user-badge { 
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-deep); 
      color: white; 
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem; 
      font-weight: 700;
      border: 2px solid var(--primary-glow);
      margin-left: -10px;
      box-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
    }
    .user-badge:first-child { margin-left: 0; }
    
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
    
    .selected-row {
      background: rgba(34, 211, 238, 0.1) !important;
      border: 1px solid var(--primary-glow) !important;
    }
    
    .description-row {
      background: var(--glass-surface);
      backdrop-filter: blur(8px);
    }
    
    .description-row td {
      padding: 0 !important;
    }
    
    .description-cell {
      border-top: 1px solid var(--glass-border) !important;
    }
    
    .task-description-expanded {
      padding: 16px 24px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
      background: rgba(0,0,0,0.2);
      border-radius: 0 0 16px 16px;
      margin: 0 16px 12px 16px;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: pre-wrap;
      max-width: 100%;
      overflow: hidden;
    }
    
    .task-description-expanded strong {
      color: var(--primary-glow);
      margin-right: 8px;
    }
    
    .empty-state { padding: 40px; text-align: center; color: var(--text-muted); font-style: italic; background: rgba(0,0,0,0.2); border-radius: 20px; }
    .spinner { margin: 40px auto; }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  projects: Project[] = [];
  archivedProjectIds: Set<number> = new Set();
  loading = true;

  statusFilter = '';
  priorityFilter = '';
  typeFilter = 'ALL';
  projectFilter: number | null = null;
  searchTerm = '';

  projectId?: number;

  sortField = 'date';
  sortAsc = true;
  selectedTaskId: number | null = null;

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
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      // Identify archived projects
      this.archivedProjectIds = new Set(
        projects.filter(p => p.status === 'ARCHIVED').map(p => p.id!)
      );
      // Reload tasks to apply filter if projects loaded after tasks
      if (!this.loading && this.tasks.length > 0) {
        this.applyFilters();
      }
    });
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

    // Client-side status/priority/project if needed

    // EXCLUDE TASKS FROM ARCHIVED PROJECTS
    if (this.archivedProjectIds.size > 0) {
      temp = temp.filter(t => !t.projectId || !this.archivedProjectIds.has(t.projectId));
    }

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
        case 'status':
          // Custom order: TODO, IN_PROGRESS, DONE
          const statusOrder = { 'TODO': 1, 'IN_PROGRESS': 2, 'DONE': 3 };
          valA = a.status ? statusOrder[a.status] : 0;
          valB = b.status ? statusOrder[b.status] : 0;
          break;
        case 'priority':
          // HIGH > MEDIUM > LOW
          const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
          valA = a.priority ? priorityOrder[a.priority] : 0;
          valB = b.priority ? priorityOrder[b.priority] : 0;
          break;
      }

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.filteredTasks = temp;
  }

  onFilterChange(): void {
    // Clear route-based projectId when manually changing filter
    this.projectId = undefined;

    // Update URL to remove projectId query param if it exists
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { projectId: null },
      queryParamsHandling: 'merge'
    });

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

  toggleTaskDetails(taskId: number): void {
    if (this.selectedTaskId === taskId) {
      this.selectedTaskId = null;
    } else {
      this.selectedTaskId = taskId;
    }
  }
}
