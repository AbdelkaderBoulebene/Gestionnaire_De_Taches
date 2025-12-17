package com.gestionnaire.service;

import com.gestionnaire.entity.Project;
import com.gestionnaire.entity.Task;
import com.gestionnaire.enums.Priority;
import com.gestionnaire.enums.TaskStatus;
import com.gestionnaire.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (projectDetails.getName() != null)
            project.setName(projectDetails.getName());
        if (projectDetails.getDescription() != null)
            project.setDescription(projectDetails.getDescription());
        if (projectDetails.getStartDate() != null)
            project.setStartDate(projectDetails.getStartDate());
        if (projectDetails.getEndDate() != null)
            project.setEndDate(projectDetails.getEndDate());
        if (projectDetails.getStatus() != null)
            project.setStatus(projectDetails.getStatus());
        if (projectDetails.getPriority() != null)
            project.setPriority(projectDetails.getPriority());

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found");
        }
        projectRepository.deleteById(id);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByStatus(String status) {
        return projectRepository.findByStatusIgnoreCase(status);
    }

    public List<Project> getProjectsByPriority(Priority priority) {
        return projectRepository.findByPriority(priority);
    }

    public List<Project> getProjects(String status, Priority priority) {
        if (status != null && !status.isEmpty() && priority != null) {
            return projectRepository.findByStatusIgnoreCaseAndPriority(status, priority);
        } else if (status != null && !status.isEmpty()) {
            return projectRepository.findByStatusIgnoreCase(status);
        } else if (priority != null) {
            return projectRepository.findByPriority(priority);
        } else {
            return projectRepository.findAll();
        }
    }

    public double calculateProjectProgress(Long projectId) {
        Project project = getProjectById(projectId);
        List<Task> tasks = project.getTasks();

        if (tasks.isEmpty())
            return 0.0;

        long completedTasks = tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .count();

        return (double) completedTasks / tasks.size() * 100;
    }
}
