import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';
    private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data)
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'ADMIN';
    }

    isManager(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'MANAGER';
    }

    // RBAC Helpers
    canManageProjects(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'ADMIN' || user?.role === 'MANAGER';
    }

    canManageUsers(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'ADMIN';
    }

    private handleAuthResponse(response: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        const user: User = {
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}
