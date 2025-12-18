import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, TaskStatus } from '../models/task.model';
import { Priority } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = `${environment.apiUrl}/tasks`;

    constructor(private http: HttpClient) { }

    getTasks(status?: TaskStatus, priority?: Priority, projectId?: number): Observable<Task[]> {
        let params = new HttpParams();
        if (status) params = params.set('status', status);
        if (priority) params = params.set('priority', priority);
        if (projectId) params = params.set('projectId', projectId.toString());
        return this.http.get<Task[]>(this.apiUrl, { params });
    }

    getTasksOfProject(projectId: number): Observable<Task[]> {
        return this.getTasks(undefined, undefined, projectId);
    }

    getTasksByProject(projectId: number): Observable<Task[]> {
        return this.getTasks(undefined, undefined, projectId);
    }

    getTask(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/${id}`);
    }

    getMyTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/my-tasks`);
    }

    getOverdueTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/overdue`);
    }

    createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task);
    }

    updateTask(id: number, task: Task): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
    }

    updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
        return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, { status });
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
