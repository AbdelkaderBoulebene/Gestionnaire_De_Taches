-- Database Schema for Gestionnaire de Tâches
-- PostgreSQL

-- Create database (run this separately as superuser)
-- CREATE DATABASE gestionnaire_taches;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    start_date DATE,
    end_date DATE,
    project_id BIGINT,
    assigned_user_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    task_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_user_id ON tasks(assigned_user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_end_date ON tasks(end_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_projects_status ON projects(status);

-- Sample data (optional)
-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@example.com', '$2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa35gJdCr2v2QbVFzu', 'ADMIN');

-- Regular user (password: user123)
INSERT INTO users (name, email, password, role) VALUES 
('User Test', 'user@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER');

-- Sample project
INSERT INTO projects (name, description, start_date, end_date, status, priority) VALUES 
('Projet Exemple', 'Un projet de démonstration', '2025-01-01', '2025-12-31', 'ACTIVE', 'HIGH');

-- Sample tasks
INSERT INTO tasks (title, description, status, priority, start_date, end_date, project_id, assigned_user_id) VALUES 
('Tâche 1', 'Description de la tâche 1', 'TODO', 'HIGH', '2025-01-01', '2025-01-15', 1, 2),
('Tâche 2', 'Description de la tâche 2', 'IN_PROGRESS', 'MEDIUM', '2025-01-05', '2025-01-20', 1, 2),
('Tâche 3', 'Description de la tâche 3', 'DONE', 'LOW', '2025-01-01', '2025-01-10', 1, 2);
