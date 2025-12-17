export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Project {
    id?: number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status: string;
    priority: Priority;
    createdAt?: string;
    tasks?: any[];
}
