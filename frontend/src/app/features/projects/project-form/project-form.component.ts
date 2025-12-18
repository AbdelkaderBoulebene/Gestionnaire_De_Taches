import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project, Priority } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container form-page">
      <div class="card">
        <div class="card-header">
          <h2>{{ isEditing ? 'Modifier le Projet' : 'Nouveau Projet' }}</h2>
        </div>
        
        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
          <!-- Nom -->
          <div class="form-group">
            <label for="name">Nom du projet</label>
            <input type="text" id="name" formControlName="name" class="form-control" 
                   maxlength="50"
                   [class.is-invalid]="submitted && f['name'].errors">
            <div class="invalid-feedback" *ngIf="submitted && f['name'].errors">
              <span *ngIf="f['name'].errors['required']">Le nom est requis</span>
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" formControlName="description" class="form-control" rows="3"></textarea>
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
                <label for="endDate">Date de fin</label>
                <input type="date" id="endDate" formControlName="endDate" class="form-control">
              </div>
            </div>
          </div>

          <div class="row">
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

            <!-- Statut (Seulement en édition) -->
            <div class="col" *ngIf="isEditing">
              <div class="form-group">
                <label for="status">Statut</label>
                <select id="status" formControlName="status" class="form-control">
                  <option value="ACTIVE">Actif</option>
                  <option value="COMPLETED">Terminé</option>
                  <option value="ARCHIVED">Archivé</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/projects" class="btn btn-secondary">Annuler</a>
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
    .card { 
      background: var(--glass-surface); 
      border-radius: 12px; 
      box-shadow: var(--glass-shadow); 
      overflow: hidden;
      border: 1px solid var(--glass-border);
    }
    .card-header { 
      background: rgba(0,0,0,0.05); 
      padding: 20px 30px; 
      border-bottom: 1px solid var(--glass-border); 
    }
    .card-header h2 { margin: 0; color: var(--text-primary); font-size: 24px; }
    
    form { padding: 30px; }
    
    .form-group { margin-bottom: 20px; }
    .form-group label { 
      display: block; 
      margin-bottom: 8px; 
      font-weight: 600; 
      color: var(--text-primary); 
    }
    .form-control { 
      width: 100%; 
      padding: 10px; 
      border: 1px solid var(--glass-border); 
      border-radius: 6px; 
      font-size: 16px; 
      transition: border-color 0.2s;
      background: var(--glass-surface);
      color: var(--text-primary);
    }
    .form-control:focus { 
      outline: none; 
      border-color: var(--primary-glow); 
      box-shadow: 0 0 0 3px rgba(102,126,234,0.1); 
    }
    .is-invalid { border-color: var(--danger-glow); }
    .invalid-feedback { color: var(--danger-glow); font-size: 14px; margin-top: 5px; }
    
    .row { display: flex; gap: 20px; }
    .col { flex: 1; }
    
    .form-actions { 
      display: flex; 
      justify-content: flex-end; 
      gap: 15px; 
      margin-top: 30px; 
      padding-top: 16px; 
      border-top: 1px solid var(--glass-border); 
    }
    
    .btn { 
      padding: 10px 24px; 
      border-radius: 6px; 
      font-weight: 600; 
      cursor: pointer; 
      text-decoration: none; 
      border: none; 
      font-size: 16px; 
    }
    .btn-primary { background: var(--primary-glow); color: white; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-secondary { 
      background: rgba(255,255,255,0.1); 
      color: var(--text-primary); 
      border: 1px solid var(--glass-border);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.15); }
    
    .alert-danger { 
      margin-top: 20px; 
      padding: 12px; 
      background: rgba(244, 63, 94, 0.1); 
      color: var(--danger-glow); 
      border-radius: 6px;
      border: 1px solid var(--danger-glow);
    }
  `]
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditing = false;
  loading = false;
  submitted = false;
  error = '';
  projectId?: number;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: [''],
      endDate: [''],
      priority: ['MEDIUM', Validators.required],
      status: ['ACTIVE']
    });
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.projectId) {
      this.isEditing = true;
      this.loadProject(this.projectId);
    }
  }

  get f() { return this.projectForm.controls; }

  loadProject(id: number): void {
    this.loading = true;
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          priority: project.priority,
          status: project.status
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du projet';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.projectForm.invalid) return;

    this.loading = true;
    this.error = '';

    const projectData: Project = {
      ...this.projectForm.value,
      id: this.projectId
    };

    const request = this.isEditing
      ? this.projectService.updateProject(this.projectId!, projectData)
      : this.projectService.createProject(projectData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.error = 'Une erreur est survenue lors de l\'enregistrement';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
