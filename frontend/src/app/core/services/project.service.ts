import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, Priority } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = `${environment.apiUrl}/projects`;

    constructor(private http: HttpClient) { }

    getProjects(status?: string, priority?: Priority): Observable<Project[]> {
        let params = new HttpParams();
        if (status) params = params.set('status', status);
        if (priority) params = params.set('priority', priority);
        return this.http.get<Project[]>(this.apiUrl, { params });
    }

    getProject(id: number): Observable<Project> {
        return this.http.get<Project>(`${this.apiUrl}/${id}`);
    }

    createProject(project: Project): Observable<Project> {
        return this.http.post<Project>(this.apiUrl, project);
    }

    updateProject(id: number, project: Project): Observable<Project> {
        return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
    }

    deleteProject(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getProjectProgress(id: number): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/${id}/progress`);
    }
}
