import { Priority } from './project.model';
import { User } from './user.model';
export { Priority };

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    startDate?: string;
    endDate?: string;
    projectId?: number;
    projectName?: string;
    project?: any;
    assignedUsers?: User[];
    createdAt?: string;
    updatedAt?: string;
}
