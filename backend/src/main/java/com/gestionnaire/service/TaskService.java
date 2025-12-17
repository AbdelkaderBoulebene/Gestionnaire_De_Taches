package com.gestionnaire.service;

import com.gestionnaire.entity.Task;
import com.gestionnaire.entity.User;
import com.gestionnaire.enums.Priority;
import com.gestionnaire.enums.TaskStatus;
import com.gestionnaire.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    @Transactional
    public Task createTask(Task task) {
        Task savedTask = taskRepository.save(task);

        // Create notification if task is assigned to a user
        // Create notification if task is assigned to users
        if (savedTask.getAssignedUsers() != null && !savedTask.getAssignedUsers().isEmpty()) {
            for (User user : savedTask.getAssignedUsers()) {
                // Pour simplifier, on envoie une notif à chaque user (TODO: optimiser message)
                // notificationService.createTaskAssignedNotification(savedTask, user);
                // Note: La méthode existante createTaskAssignedNotification attend une Tâche
                // avec un seul assignee ?
                // On va devoir adapter NotificationService aussi ou boucler ici.
                // Supposons que NotificationService prend la tâche et notifie 'assignedUser'.
                // On doit changer NotificationService.
            }
            // Pour l'instant on commente la notif tant que NotificationService n'est pas
            // update
            // notificationService.createTaskAssignedNotification(savedTask);
        }

        return savedTask;
    }

    @Transactional
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        java.util.Set<User> previousUsers = new java.util.HashSet<>(task.getAssignedUsers());

        if (taskDetails.getTitle() != null)
            task.setTitle(taskDetails.getTitle());
        if (taskDetails.getDescription() != null)
            task.setDescription(taskDetails.getDescription());
        if (taskDetails.getStatus() != null)
            task.setStatus(taskDetails.getStatus());
        if (taskDetails.getPriority() != null)
            task.setPriority(taskDetails.getPriority());
        if (taskDetails.getStartDate() != null)
            task.setStartDate(taskDetails.getStartDate());
        if (taskDetails.getEndDate() != null)
            task.setEndDate(taskDetails.getEndDate());
        if (taskDetails.getProject() != null)
            task.setProject(taskDetails.getProject());
        if (taskDetails.getAssignedUsers() != null)
            task.setAssignedUsers(taskDetails.getAssignedUsers());

        Task savedTask = taskRepository.save(task);

        // Create notification logic would go here (compare previousUsers with new list)
        // if (taskDetails.getAssignedUsers() != null &&
        // !previousUsers.equals(taskDetails.getAssignedUsers())) { ... }

        return savedTask;
    }

    @Transactional
    public Task updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(status);
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }
        taskRepository.deleteById(id);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getTasksByPriority(Priority priority) {
        return taskRepository.findByPriority(priority);
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.findTasksByAssignedUser(user);
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getOverdueTasks() {
        return taskRepository.findOverdueTasks(LocalDate.now());
    }

    public List<Task> getTasksApproachingDeadline(int days) {
        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(days);
        return taskRepository.findTasksApproachingDeadline(start, end);
    }
}
