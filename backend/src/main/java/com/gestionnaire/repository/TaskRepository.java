package com.gestionnaire.repository;

import com.gestionnaire.entity.Task;
import com.gestionnaire.entity.User;
import com.gestionnaire.enums.Priority;
import com.gestionnaire.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);

    List<Task> findByPriority(Priority priority);

    @Query("SELECT t FROM Task t JOIN t.assignedUsers u WHERE u = :user")
    List<Task> findTasksByAssignedUser(@org.springframework.data.repository.query.Param("user") User user);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId")
    List<Task> findByProjectId(@org.springframework.data.repository.query.Param("projectId") Long projectId);

    @Query("SELECT t FROM Task t WHERE t.endDate < :date AND t.status != 'DONE'")
    List<Task> findOverdueTasks(LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.endDate BETWEEN :start AND :end AND t.status != 'DONE'")
    List<Task> findTasksApproachingDeadline(LocalDate start, LocalDate end);

    long countByStatus(TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t JOIN t.assignedUsers u WHERE u = :user")
    long countTasksByAssignedUser(@org.springframework.data.repository.query.Param("user") User user);
}
