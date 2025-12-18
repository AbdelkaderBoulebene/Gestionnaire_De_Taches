-- ============================================
-- Script de réinitialisation de la base de données
-- Gestionnaire de Tâches
-- ============================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = 'replica';

-- Supprimer toutes les données existantes
TRUNCATE TABLE tasks_users CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE users CASCADE;

-- Réactiver les contraintes de clés étrangères
SET session_replication_role = 'origin';

-- Réinitialiser les séquences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE projects_id_seq RESTART WITH 1;
ALTER SEQUENCE tasks_id_seq RESTART WITH 1;

-- ============================================
-- INSERTION DES UTILISATEURS
-- ============================================
-- Mot de passe hashé pour "motdepasse" : $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO users (id, name, email, password, role, created_at) VALUES
(1, 'Admin Principal', 'admin@gestionnaire.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NOW()),
(2, 'Sophie Martin', 'sophie.martin@gestionnaire.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MANAGER', NOW()),
(3, 'Thomas Dubois', 'thomas.dubois@gestionnaire.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MANAGER', NOW()),
(4, 'Julie Bernard', 'julie.bernard@gestionnaire.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NOW()),
(5, 'Marc Petit', 'marc.petit@gestionnaire.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NOW()),
(6, 'Emma Leroy', 'emma.leroy@gestionnaire.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NOW()),
(7, 'Lucas Moreau', 'lucas.moreau@gestionnaire.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NOW()),
(8, 'Camille Roux', 'camille.roux@gestionnaire.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NOW());

-- ============================================
-- INSERTION DES PROJETS
-- ============================================

INSERT INTO projects (id, name, description, status, start_date, end_date, priority, created_at) VALUES
-- Projets actifs
(1, 'Refonte Site Web', 'Modernisation complète du site web de l''entreprise avec nouveau design et fonctionnalités', 'ACTIVE', '2025-01-15', '2025-06-30', 'HIGH', NOW()),
(2, 'Application Mobile', 'Développement d''une application mobile iOS et Android pour la gestion des tâches', 'ACTIVE', '2025-02-01', '2025-08-31', 'HIGH', NOW()),
(3, 'Migration Cloud', 'Migration de l''infrastructure vers le cloud AWS', 'ACTIVE', '2025-01-20', '2025-05-15', 'HIGH', NOW()),
(4, 'Système CRM', 'Mise en place d''un nouveau système de gestion de la relation client', 'ACTIVE', '2025-03-01', '2025-09-30', 'MEDIUM', NOW()),
(5, 'Formation Équipe', 'Programme de formation continue pour l''équipe de développement', 'ACTIVE', '2025-01-10', '2025-12-31', 'MEDIUM', NOW()),

-- Projets archivés
(6, 'Audit Sécurité 2024', 'Audit complet de la sécurité des systèmes informatiques', 'ARCHIVED', '2024-09-01', '2024-12-15', 'HIGH', NOW()),
(7, 'Optimisation BDD', 'Optimisation des performances de la base de données', 'ARCHIVED', '2024-10-01', '2024-11-30', 'MEDIUM', NOW());

-- ============================================
-- INSERTION DES TÂCHES
-- ============================================

-- Tâches pour "Refonte Site Web" (Projet 1)
INSERT INTO tasks (id, title, description, status, priority, start_date, end_date, project_id, created_at, updated_at) VALUES
(1, 'Analyse des besoins', 'Recueillir et analyser les besoins des utilisateurs pour la refonte du site', 'DONE', 'HIGH', '2025-01-15', '2025-01-25', 1, NOW(), NOW()),
(2, 'Création des maquettes', 'Concevoir les maquettes UI/UX pour toutes les pages du site', 'DONE', 'HIGH', '2025-01-26', '2025-02-10', 1, NOW(), NOW()),
(3, 'Développement Frontend', 'Développer l''interface utilisateur avec React et TailwindCSS', 'IN_PROGRESS', 'HIGH', '2025-02-11', '2025-04-15', 1, NOW(), NOW()),
(4, 'Développement Backend', 'Créer les APIs REST avec Spring Boot', 'IN_PROGRESS', 'HIGH', '2025-02-20', '2025-04-30', 1, NOW(), NOW()),
(5, 'Intégration paiement', 'Intégrer le système de paiement en ligne Stripe', 'TODO', 'MEDIUM', '2025-04-01', '2025-04-20', 1, NOW(), NOW()),
(6, 'Tests utilisateurs', 'Effectuer des tests utilisateurs et recueillir les retours', 'TODO', 'MEDIUM', '2025-05-01', '2025-05-15', 1, NOW(), NOW()),
(7, 'Déploiement production', 'Déployer le site en production et configurer le monitoring', 'TODO', 'HIGH', '2025-06-15', '2025-06-30', 1, NOW(), NOW()),

-- Tâches pour "Application Mobile" (Projet 2)
(8, 'Étude de marché', 'Analyser les applications concurrentes et définir les fonctionnalités clés', 'DONE', 'HIGH', '2025-02-01', '2025-02-15', 2, NOW(), NOW()),
(9, 'Architecture technique', 'Définir l''architecture technique de l''application (React Native)', 'IN_PROGRESS', 'HIGH', '2025-02-16', '2025-03-01', 2, NOW(), NOW()),
(10, 'Design interface mobile', 'Créer le design adapté aux plateformes iOS et Android', 'IN_PROGRESS', 'HIGH', '2025-02-20', '2025-03-15', 2, NOW(), NOW()),
(11, 'Développement authentification', 'Implémenter le système d''authentification et de sécurité', 'TODO', 'HIGH', '2025-03-16', '2025-04-10', 2, NOW(), NOW()),
(12, 'Synchronisation offline', 'Développer la fonctionnalité de synchronisation hors ligne', 'TODO', 'MEDIUM', '2025-04-15', '2025-05-30', 2, NOW(), NOW()),
(13, 'Tests beta', 'Lancer une version beta et recueillir les feedbacks', 'TODO', 'MEDIUM', '2025-07-01', '2025-07-31', 2, NOW(), NOW()),

-- Tâches pour "Migration Cloud" (Projet 3)
(14, 'Audit infrastructure actuelle', 'Analyser l''infrastructure existante et identifier les points critiques', 'DONE', 'HIGH', '2025-01-20', '2025-02-05', 3, NOW(), NOW()),
(15, 'Planification migration', 'Créer un plan détaillé de migration avec timeline et ressources', 'DONE', 'HIGH', '2025-02-06', '2025-02-20', 3, NOW(), NOW()),
(16, 'Configuration AWS', 'Configurer les services AWS (EC2, RDS, S3, CloudFront)', 'IN_PROGRESS', 'HIGH', '2025-02-21', '2025-03-20', 3, NOW(), NOW()),
(17, 'Migration base de données', 'Migrer les bases de données vers AWS RDS', 'TODO', 'HIGH', '2025-03-21', '2025-04-10', 3, NOW(), NOW()),
(18, 'Tests de charge', 'Effectuer des tests de performance et de charge', 'TODO', 'MEDIUM', '2025-04-15', '2025-04-30', 3, NOW(), NOW()),
(19, 'Formation équipe DevOps', 'Former l''équipe aux outils et pratiques AWS', 'TODO', 'LOW', '2025-05-01', '2025-05-15', 3, NOW(), NOW()),

-- Tâches pour "Système CRM" (Projet 4)
(20, 'Sélection solution CRM', 'Comparer et sélectionner la meilleure solution CRM pour nos besoins', 'TODO', 'HIGH', '2025-03-01', '2025-03-20', 4, NOW(), NOW()),
(21, 'Configuration initiale', 'Configurer le CRM selon nos processus métier', 'TODO', 'HIGH', '2025-03-21', '2025-04-15', 4, NOW(), NOW()),
(22, 'Import données clients', 'Importer et nettoyer les données clients existantes', 'TODO', 'MEDIUM', '2025-04-16', '2025-05-10', 4, NOW(), NOW()),
(23, 'Personnalisation workflows', 'Créer des workflows automatisés pour les processus de vente', 'TODO', 'MEDIUM', '2025-05-15', '2025-06-30', 4, NOW(), NOW()),

-- Tâches pour "Formation Équipe" (Projet 5)
(24, 'Formation Angular avancé', 'Session de formation sur les concepts avancés d''Angular', 'DONE', 'MEDIUM', '2025-01-10', '2025-01-12', 5, NOW(), NOW()),
(25, 'Workshop Spring Boot', 'Atelier pratique sur Spring Boot et microservices', 'DONE', 'MEDIUM', '2025-02-05', '2025-02-07', 5, NOW(), NOW()),
(26, 'Formation DevOps', 'Formation sur les pratiques DevOps et CI/CD', 'IN_PROGRESS', 'MEDIUM', '2025-03-10', '2025-03-12', 5, NOW(), NOW()),
(27, 'Certification AWS', 'Préparation à la certification AWS Solutions Architect', 'TODO', 'LOW', '2025-06-01', '2025-07-31', 5, NOW(), NOW()),

-- Tâches urgentes / en retard
(28, 'Correction bug critique', 'Corriger le bug de sécurité identifié dans le module d''authentification', 'TODO', 'HIGH', '2025-02-10', '2025-02-15', 1, NOW(), NOW()),
(29, 'Mise à jour documentation', 'Mettre à jour la documentation technique suite aux derniers changements', 'TODO', 'LOW', '2025-02-01', '2025-02-14', 3, NOW(), NOW()),

-- Tâches pour "Audit Sécurité 2024" (Projet 6 - Archivé)
(30, 'Analyse des vulnérabilités', 'Effectuer un scan complet des vulnérabilités du système', 'DONE', 'HIGH', '2024-09-01', '2024-09-15', 6, NOW(), NOW()),
(31, 'Tests de pénétration', 'Réaliser des tests de pénétration sur les applications critiques', 'DONE', 'HIGH', '2024-09-16', '2024-10-10', 6, NOW(), NOW()),
(32, 'Mise à jour politiques sécurité', 'Réviser et mettre à jour les politiques de sécurité', 'DONE', 'MEDIUM', '2024-10-11', '2024-11-05', 6, NOW(), NOW()),
(33, 'Formation sécurité équipe', 'Former l''équipe aux bonnes pratiques de sécurité', 'DONE', 'MEDIUM', '2024-11-06', '2024-11-20', 6, NOW(), NOW()),
(34, 'Rapport final audit', 'Rédiger et présenter le rapport final d''audit', 'DONE', 'HIGH', '2024-11-21', '2024-12-15', 6, NOW(), NOW()),

-- Tâches pour "Optimisation BDD" (Projet 7 - Archivé)
(35, 'Analyse performances actuelles', 'Analyser les performances actuelles de la base de données', 'DONE', 'HIGH', '2024-10-01', '2024-10-10', 7, NOW(), NOW()),
(36, 'Optimisation index', 'Créer et optimiser les index pour améliorer les performances', 'DONE', 'HIGH', '2024-10-11', '2024-10-20', 7, NOW(), NOW()),
(37, 'Refactoring requêtes lentes', 'Optimiser les requêtes SQL identifiées comme lentes', 'DONE', 'MEDIUM', '2024-10-21', '2024-11-05', 7, NOW(), NOW()),
(38, 'Tests de charge', 'Effectuer des tests de charge pour valider les optimisations', 'DONE', 'MEDIUM', '2024-11-06', '2024-11-20', 7, NOW(), NOW()),
(39, 'Documentation optimisations', 'Documenter toutes les optimisations effectuées', 'DONE', 'LOW', '2024-11-21', '2024-11-30', 7, NOW(), NOW());

-- ============================================
-- ASSIGNATION DES TÂCHES AUX UTILISATEURS
-- ============================================

-- Projet 1: Refonte Site Web
INSERT INTO tasks_users (task_id, user_id) VALUES
(1, 2), (1, 4),  -- Analyse: Sophie + Julie
(2, 6),          -- Maquettes: Emma
(3, 4), (3, 7),  -- Frontend: Julie + Lucas
(4, 5), (4, 7),  -- Backend: Marc + Lucas
(5, 5),          -- Paiement: Marc
(6, 2), (6, 6),  -- Tests: Sophie + Emma
(7, 3), (7, 5),  -- Déploiement: Thomas + Marc
(28, 5), (28, 7); -- Bug critique: Marc + Lucas

-- Projet 2: Application Mobile
INSERT INTO tasks_users (task_id, user_id) VALUES
(8, 2),          -- Étude: Sophie
(9, 3), (9, 5),  -- Architecture: Thomas + Marc
(10, 6), (10, 8), -- Design: Emma + Camille
(11, 5),         -- Auth: Marc
(12, 7),         -- Sync: Lucas
(13, 2), (13, 8); -- Tests beta: Sophie + Camille

-- Projet 3: Migration Cloud
INSERT INTO tasks_users (task_id, user_id) VALUES
(14, 3),         -- Audit: Thomas
(15, 3), (15, 2), -- Planification: Thomas + Sophie
(16, 3), (16, 5), -- Config AWS: Thomas + Marc
(17, 5),         -- Migration BDD: Marc
(18, 7),         -- Tests: Lucas
(19, 3), (19, 4), (19, 5), -- Formation: Thomas + Julie + Marc
(29, 3);         -- Documentation: Thomas

-- Projet 4: Système CRM
INSERT INTO tasks_users (task_id, user_id) VALUES
(20, 2), (20, 3), -- Sélection: Sophie + Thomas
(21, 2),         -- Configuration: Sophie
(22, 4), (22, 8), -- Import: Julie + Camille
(23, 2), (23, 4); -- Workflows: Sophie + Julie

-- Projet 5: Formation
INSERT INTO tasks_users (task_id, user_id) VALUES
(24, 4), (24, 6), (24, 7), (24, 8), -- Formation Angular: tous les devs
(25, 5), (25, 7),                    -- Workshop Spring: Marc + Lucas
(26, 3), (26, 5),                    -- DevOps: Thomas + Marc
(27, 3);                             -- Certification: Thomas

-- Projet 6: Audit Sécurité 2024 (Archivé)
INSERT INTO tasks_users (task_id, user_id) VALUES
(30, 3), (30, 5), -- Analyse vulnérabilités: Thomas + Marc
(31, 3),          -- Tests pénétration: Thomas
(32, 2), (32, 3), -- Politiques sécurité: Sophie + Thomas
(33, 2), (33, 3), (33, 4), (33, 5), -- Formation sécurité: Sophie + Thomas + Julie + Marc
(34, 3);          -- Rapport final: Thomas

-- Projet 7: Optimisation BDD (Archivé)
INSERT INTO tasks_users (task_id, user_id) VALUES
(35, 5),          -- Analyse performances: Marc
(36, 5), (36, 7), -- Optimisation index: Marc + Lucas
(37, 5), (37, 7), -- Refactoring requêtes: Marc + Lucas
(38, 7),          -- Tests de charge: Lucas
(39, 5);          -- Documentation: Marc

-- ============================================
-- VÉRIFICATION DES DONNÉES
-- ============================================

-- Afficher le résumé
SELECT 'Utilisateurs créés:' as info, COUNT(*) as total FROM users
UNION ALL
SELECT 'Projets actifs:', COUNT(*) FROM projects WHERE status = 'ACTIVE'
UNION ALL
SELECT 'Projets archivés:', COUNT(*) FROM projects WHERE status = 'ARCHIVED'
UNION ALL
SELECT 'Tâches créées:', COUNT(*) FROM tasks
UNION ALL
SELECT 'Tâches terminées:', COUNT(*) FROM tasks WHERE status = 'DONE'
UNION ALL
SELECT 'Tâches en cours:', COUNT(*) FROM tasks WHERE status = 'IN_PROGRESS'
UNION ALL
SELECT 'Tâches à faire:', COUNT(*) FROM tasks WHERE status = 'TODO'
UNION ALL
SELECT 'Assignations:', COUNT(*) FROM tasks_users;

-- ============================================
-- INFORMATIONS DE CONNEXION
-- ============================================
-- Email: admin@gestionnaire.com | Mot de passe: motdepasse | Rôle: ADMIN
-- Email: sophie.martin@gestionnaire.com | Mot de passe: motdepasse | Rôle: MANAGER
-- Email: thomas.dubois@gestionnaire.com | Mot de passe: motdepasse | Rôle: MANAGER
-- Email: julie.bernard@gestionnaire.com | Mot de passe: motdepasse | Rôle: USER
-- Email: marc.petit@gestionnaire.com | Mot de passe: motdepasse | Rôle: USER
-- Email: emma.leroy@gestionnaire.com | Mot de passe: motdepasse | Rôle: USER
-- Email: lucas.moreau@gestionnaire.com | Mot de passe: motdepasse | Rôle: USER
-- Email: camille.roux@gestionnaire.com | Mot de passe: motdepasse | Rôle: USER
-- ============================================
