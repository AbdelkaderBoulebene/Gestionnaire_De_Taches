export interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'MANAGER';
    createdAt?: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'MANAGER';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER' | 'MANAGER';
}
