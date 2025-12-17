package com.gestionnaire.service;

import com.gestionnaire.dto.DashboardStats;
import com.gestionnaire.entity.User;
import com.gestionnaire.enums.TaskStatus;
import com.gestionnaire.repository.ProjectRepository;
import com.gestionnaire.repository.TaskRepository;
import com.gestionnaire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        // Task counts by status
        stats.setTotalTasks(taskRepository.count());
        stats.setTodoTasks(taskRepository.countByStatus(TaskStatus.TODO));
        stats.setInProgressTasks(taskRepository.countByStatus(TaskStatus.IN_PROGRESS));
        stats.setDoneTasks(taskRepository.countByStatus(TaskStatus.DONE));

        // Overdue tasks
        stats.setOverdueTasks(taskRepository.findOverdueTasks(LocalDate.now()).size());

        // Active projects
        stats.setActiveProjects(projectRepository.findByStatusIgnoreCase("ACTIVE").size());

        // Tasks by user
        Map<String, Long> tasksByUser = new HashMap<>();
        List<User> users = userRepository.findAll();
        for (User user : users) {
            long taskCount = taskRepository.countTasksByAssignedUser(user);
            tasksByUser.put(user.getName(), taskCount);
        }
        stats.setTasksByUser(tasksByUser);

        return stats;
    }

    public Map<String, Long> getTasksByStatus() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("TODO", taskRepository.countByStatus(TaskStatus.TODO));
        stats.put("IN_PROGRESS", taskRepository.countByStatus(TaskStatus.IN_PROGRESS));
        stats.put("DONE", taskRepository.countByStatus(TaskStatus.DONE));
        return stats;
    }

    public Map<String, Long> getTasksByUser() {
        Map<String, Long> stats = new HashMap<>();
        List<User> users = userRepository.findAll();
        for (User user : users) {
            long taskCount = taskRepository.countTasksByAssignedUser(user);
            stats.put(user.getName(), taskCount);
        }
        return stats;
    }
}
