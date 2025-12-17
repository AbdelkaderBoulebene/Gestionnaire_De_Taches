package com.gestionnaire.controller;

import com.gestionnaire.dto.DashboardStats;
import com.gestionnaire.entity.Task;
import com.gestionnaire.service.DashboardService;
import com.gestionnaire.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:54117" })
public class DashboardController {

    private final DashboardService dashboardService;
    private final TaskService taskService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/tasks-by-status")
    public ResponseEntity<Map<String, Long>> getTasksByStatus() {
        return ResponseEntity.ok(dashboardService.getTasksByStatus());
    }

    @GetMapping("/tasks-by-user")
    public ResponseEntity<Map<String, Long>> getTasksByUser() {
        return ResponseEntity.ok(dashboardService.getTasksByUser());
    }

    @GetMapping("/overdue-tasks")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        return ResponseEntity.ok(taskService.getOverdueTasks());
    }

    @GetMapping("/approaching-deadline")
    public ResponseEntity<List<Task>> getTasksApproachingDeadline(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(taskService.getTasksApproachingDeadline(days));
    }
}
