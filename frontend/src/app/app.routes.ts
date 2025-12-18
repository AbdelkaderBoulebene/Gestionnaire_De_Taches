import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'projects',
        loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'projects/archived',
        loadComponent: () => import('./features/projects/archived-projects/archived-projects.component').then(m => m.ArchivedProjectsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'projects/new',
        loadComponent: () => import('./features/projects/project-form/project-form.component').then(m => m.ProjectFormComponent),
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'projects/edit/:id',
        loadComponent: () => import('./features/projects/project-form/project-form.component').then(m => m.ProjectFormComponent),
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'tasks/new',
        loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'tasks/edit/:id',
        loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'users',
        loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent),
        canActivate: [authGuard, adminGuard]
    },
    { path: '**', redirectTo: '/dashboard' }
];
