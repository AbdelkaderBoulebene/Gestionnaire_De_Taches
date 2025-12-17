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
