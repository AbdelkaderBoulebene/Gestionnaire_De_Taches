package com.gestionnaire.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalTasks;
    private long todoTasks;
    private long inProgressTasks;
    private long doneTasks;
    private long overdueTasks;
    private long activeProjects;
    private Map<String, Long> tasksByUser;
}
