import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats } from '../models/dashboard.model';
import { Task } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
    }

    getTasksByStatus(): Observable<{ [key: string]: number }> {
        return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/tasks-by-status`);
    }

    getTasksByUser(): Observable<{ [key: string]: number }> {
        return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/tasks-by-user`);
    }

    getOverdueTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/overdue-tasks`);
    }

    getTasksApproachingDeadline(days: number = 7): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/approaching-deadline?days=${days}`);
    }
}
