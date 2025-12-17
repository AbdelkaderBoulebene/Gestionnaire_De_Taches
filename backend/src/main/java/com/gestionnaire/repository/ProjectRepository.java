package com.gestionnaire.repository;

import com.gestionnaire.entity.Project;
import com.gestionnaire.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatusIgnoreCase(String status);

    List<Project> findByPriority(Priority priority);

    List<Project> findByStatusIgnoreCaseAndPriority(String status, Priority priority);

    List<Project> findByStartDateBetween(LocalDate start, LocalDate end);

    List<Project> findByEndDateBetween(LocalDate start, LocalDate end);
}
