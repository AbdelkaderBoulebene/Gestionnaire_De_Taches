# Gestionnaire de Tâches - Task Management System

Un système complet de gestion de tâches et projets pour PME, développé avec Java Spring Boot et Angular.

## 🚀 Fonctionnalités

### Gestion des Projets
- Créer, modifier et supprimer des projets
- Suivre l'avancement des projets
- Filtrer par statut, priorité et dates
- Visualiser les tâches associées

### Gestion des Tâches
- Créer et assigner des tâches
- Définir les priorités (Basse, Moyenne, Haute)
- Gérer les statuts (À faire, En cours, Terminé)
- Filtrer et rechercher les tâches
- Suivre les dates limites

### Gestion des Utilisateurs
- Système d'authentification sécurisé (JWT)
- Rôles ADMIN et USER
- Gestion des permissions

### Tableau de Bord
- Statistiques en temps réel
- Visualisation des tâches par statut
- Répartition des tâches par utilisateur
- Alertes pour tâches en retard

### Notifications
- Notification lors de l'assignation de tâches
- Alertes pour les échéances proches
- Système de notifications in-app

## 📋 Prérequis

### Backend
- Java 17 ou supérieur
- Maven 3.6+
- PostgreSQL 12+ (ou MySQL 8+)

### Frontend
- Node.js 18+ et npm
- Angular CLI 17+

## 🛠️ Installation

### 1. Configuration de la Base de Données

Créez une base de données PostgreSQL :

```sql
CREATE DATABASE gestionnaire_taches;
CREATE USER gestionnaire_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE gestionnaire_taches TO gestionnaire_user;
```

### 2. Configuration du Backend

1. Naviguez vers le dossier backend :
```bash
cd backend
```

2. Modifiez `src/main/resources/application.properties` avec vos paramètres de base de données :
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gestionnaire_taches
spring.datasource.username=gestionnaire_user
spring.datasource.password=votre_mot_de_passe
```

3. Compilez et lancez le backend :
```bash
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080`

### 3. Configuration du Frontend

1. Naviguez vers le dossier frontend :
```bash
cd frontend
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application :
```bash
npm start
```

Le frontend sera accessible sur `http://localhost:4200`

## 👤 Compte par Défaut

Pour créer un compte administrateur, utilisez l'endpoint de registration avec le rôle ADMIN :

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

## 📚 Structure du Projet

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/gestionnaire/
│   ├── config/          # Configuration Spring Security, CORS
│   ├── controller/      # REST API Controllers
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # Entités JPA
│   ├── enums/          # Énumérations
│   ├── repository/     # Repositories JPA
│   ├── security/       # JWT, Authentication
│   └── service/        # Business Logic
└── src/main/resources/
    └── application.properties
```

### Frontend (Angular)
```
frontend/src/app/
├── core/
│   ├── guards/         # Route Guards
│   ├── interceptors/   # HTTP Interceptors
│   ├── models/         # TypeScript Models
│   └── services/       # Services HTTP
└── features/
    ├── auth/           # Login, Register
    ├── dashboard/      # Tableau de bord
    ├── projects/       # Gestion projets
    ├── tasks/          # Gestion tâches
    └── users/          # Gestion utilisateurs
```

## 🔐 Sécurité

- Authentification JWT avec expiration de 24h
- Mots de passe chiffrés avec BCrypt
- Protection CORS configurée
- Contrôle d'accès basé sur les rôles (RBAC)

## 🌐 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Projets
- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Créer un projet (ADMIN)
- `PUT /api/projects/{id}` - Modifier un projet (ADMIN)
- `DELETE /api/projects/{id}` - Supprimer un projet (ADMIN)

### Tâches
- `GET /api/tasks` - Liste des tâches
- `POST /api/tasks` - Créer une tâche
- `PUT /api/tasks/{id}` - Modifier une tâche
- `PATCH /api/tasks/{id}/status` - Changer le statut
- `DELETE /api/tasks/{id}` - Supprimer une tâche

### Dashboard
- `GET /api/dashboard/stats` - Statistiques globales
- `GET /api/dashboard/tasks-by-status` - Tâches par statut
- `GET /api/dashboard/tasks-by-user` - Tâches par utilisateur

### Utilisateurs (ADMIN uniquement)
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/{id}` - Modifier un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

## 🧪 Tests

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Déploiement

### Backend
```bash
cd backend
mvn clean package
java -jar target/gestionnaire-taches-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Les fichiers de production seront dans dist/
```

## 🤝 Contribution

Ce projet a été développé selon le cahier des charges fourni pour un système de gestion de tâches pour PME.

## 📄 Licence

Projet académique - Tous droits réservés

## 🐛 Problèmes Connus

- Les notifications par email nécessitent une configuration SMTP supplémentaire
- Les graphiques du dashboard nécessitent Chart.js (à implémenter)

## 📞 Support

Pour toute question ou problème, veuillez créer une issue dans le repository.
