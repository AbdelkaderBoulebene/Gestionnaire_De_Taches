import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service'; // Added UserService
import { Project } from '../../../core/models/project.model';
import { Task } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container form-page">
      <div class="card">
        <div class="card-header">
          <h2>{{ isEditing ? 'Modifier la Tâche' : 'Nouvelle Tâche' }}</h2>
        </div>
        
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
          <!-- Titre -->
          <div class="form-group">
            <label for="title">Titre</label>
            <input type="text" id="title" formControlName="title" class="form-control" 
                   [class.is-invalid]="submitted && f['title'].errors">
            <div class="invalid-feedback" *ngIf="submitted && f['title'].errors">
              <span *ngIf="f['title'].errors['required']">Le titre est requis</span>
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" formControlName="description" class="form-control" rows="3"></textarea>
          </div>

          <div class="row">
            <!-- Projet -->
            <div class="col">
              <div class="form-group">
                <label for="projectId">Projet</label>
                <select id="projectId" formControlName="projectId" class="form-control">
                  <option [ngValue]="null">-- Aucun projet --</option>
                  <option *ngFor="let project of projects" [value]="project.id">{{ project.name }}</option>
                </select>
              </div>
            </div>

            <!-- Priorité -->
            <div class="col">
              <div class="form-group">
                <label for="priority">Priorité</label>
                <select id="priority" formControlName="priority" class="form-control">
                  <option value="LOW">Basse</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Haute</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Assignation (Cartes) -->
          <div class="form-group">
            <label>Assigné à</label>
            <div class="user-selection-container">
              <div 
                *ngFor="let user of users" 
                class="user-card" 
                [class.selected]="isUserSelected(user.id)"
                (click)="toggleUser(user.id)">
                {{ user.name }}
              </div>
            </div>
          </div>

          <div class="row">
            <!-- Date de début -->
            <div class="col">
              <div class="form-group">
                <label for="startDate">Date de début</label>
                <input type="date" id="startDate" formControlName="startDate" class="form-control">
              </div>
            </div>

            <!-- Date de fin -->
            <div class="col">
              <div class="form-group">
                <label for="endDate">Date d'échéance</label>
                <input type="date" id="endDate" formControlName="endDate" class="form-control">
              </div>
            </div>
          </div>
          
          <!-- Statut (Seulement en édition) -->
          <div class="form-group" *ngIf="isEditing">
            <label for="status">Statut</label>
            <select id="status" formControlName="status" class="form-control">
              <option value="TODO">À Faire</option>
              <option value="IN_PROGRESS">En Cours</option>
              <option value="DONE">Terminé</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="cancel()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              {{ loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
          
          <div class="alert alert-danger" *ngIf="error">{{ error }}</div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-page { max-width: 800px; margin: 40px auto; padding: 0 20px; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
    .card-header { background: #f7fafc; padding: 20px 30px; border-bottom: 1px solid #e2e8f0; }
    .card-header h2 { margin: 0; color: #2d3748; font-size: 24px; }
    
    form { padding: 30px; }
    
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #4a5568; }
    .form-control { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 16px; transition: border-color 0.2s; }
    .form-control:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
    .is-invalid { border-color: #e53e3e; }
    .invalid-feedback { color: #e53e3e; font-size: 14px; margin-top: 5px; }
    
    .row { display: flex; gap: 20px; }
    .col { flex: 1; }
    
    .form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; pt-4; border-top: 1px solid #e2e8f0; }
    
    .btn { padding: 10px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; text-decoration: none; border: none; font-size: 16px; }
    .btn-primary { background: #667eea; color: white; }
    .btn-primary:hover { background: #5a67d8; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-secondary { background: #edf2f7; color: #4a5568; }
    .btn-secondary:hover { background: #e2e8f0; }
    
    .alert-danger { margin-top: 20px; padding: 12px; background: #fff5f5; color: #c53030; border-radius: 6px; }
    .user-selection-container { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 5px; }
    .user-card { 
      padding: 8px 16px; 
      border: 1px solid #e2e8f0; 
      border-radius: 20px; 
      background: #f7fafc; 
      cursor: pointer; 
      transition: all 0.2s;
      font-size: 14px;
      user-select: none;
    }
    .user-card:hover { background: #edf2f7; border-color: #cbd5e0; }
    .user-card.selected { 
      background: #667eea; 
      color: white; 
      border-color: #667eea;
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditing = false;
  loading = false;
  submitted = false;
  error = '';
  taskId?: number;
  projects: Project[] = [];
  users: User[] = []; // List of available users

  // Pour la navigation retour
  returnProjectId?: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService, // Inject UserService
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      projectId: [null],
      priority: ['MEDIUM', Validators.required],
      status: ['TODO'],
      assignedUsers: [[]], // Array for multiple selection
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    // Charger les projets pour la liste déroulante
    this.loadProjects();
    this.loadUsers(); // Load users

    // Vérifier si un projet est pré-sélectionné via query params
    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.returnProjectId = +params['projectId'];
        this.taskForm.patchValue({ projectId: this.returnProjectId });
      }
    });

    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEditing = true;
      this.loadTask(this.taskId);
    }
  }

  get f() { return this.taskForm.controls; }

  loadProjects(): void {
    // Charger tous les projets actifs pour le select (sans filtre pour l'instant)
    this.projectService.getProjects().subscribe({
      next: (data) => this.projects = data,
      error: (err) => console.error('Erreur chargement projets', err)
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Erreur chargement users', err)
    });
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          projectId: task.project?.id || null,
          priority: task.priority,
          status: task.status,
          assignedUsers: task.assignedUsers ? task.assignedUsers.map(u => u.id) : [], // Map users to IDs
          startDate: task.startDate,
          endDate: task.endDate
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la tâche';
        this.loading = false;
        console.error(err);
      }
    });
  }

  isUserSelected(userId: number): boolean {
    const currentValues = this.taskForm.get('assignedUsers')?.value as number[];
    return currentValues ? currentValues.includes(userId) : false;
  }

  toggleUser(userId: number): void {
    const control = this.taskForm.get('assignedUsers');
    const currentValues = (control?.value as number[]) || [];

    let newValues: number[];
    if (currentValues.includes(userId)) {
      newValues = currentValues.filter(id => id !== userId);
    } else {
      newValues = [...currentValues, userId];
    }

    control?.setValue(newValues);
    control?.markAsDirty();
  }

  cancel(): void {
    if (this.returnProjectId) {
      this.router.navigate(['/tasks'], { queryParams: { projectId: this.returnProjectId } });
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.taskForm.invalid) return;

    this.loading = true;
    this.error = '';

    const formValue = this.taskForm.value;

    // Préparer l'objet tâche. Si projectId est sélectionné, il faut l'envoyer correctement au backend.
    // Le backend attend probablement un objet Project complet ou juste l'ID selon l'implémentation.
    // Vérifions le backend : TaskController -> TaskService -> map to Entity.
    // Souvent on envoie { project: { id: X } }

    const taskData: any = {
      ...formValue,
      id: this.taskId
    };

    if (formValue.projectId) {
      taskData.project = { id: formValue.projectId };
    } else {
      taskData.project = null;
    }

    if (formValue.assignedUsers && formValue.assignedUsers.length > 0) {
      // Convert IDs to User objects
      taskData.assignedUsers = formValue.assignedUsers.map((id: number) => ({ id }));
    } else {
      taskData.assignedUsers = [];
    }

    // Nettoyer les champs vides
    delete taskData.projectId;

    const request = this.isEditing
      ? this.taskService.updateTask(this.taskId!, taskData)
      : this.taskService.createTask(taskData);

    request.subscribe({
      next: () => {
        this.cancel(); // Retour à la liste
      },
      error: (err) => {
        this.error = 'Une erreur est survenue lors de l\'enregistrement';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
