export interface DashboardStats {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    overdueTasks: number;
    activeProjects: number;
    tasksByUser: { [key: string]: number };
}
