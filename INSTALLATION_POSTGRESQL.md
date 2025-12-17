# Guide d'Installation PostgreSQL pour Windows

## 📥 Étape 1 : Téléchargement de PostgreSQL

1. Allez sur le site officiel : https://www.postgresql.org/download/windows/
2. Cliquez sur **"Download the installer"**
3. Vous serez redirigé vers le site d'EnterpriseDB
4. Téléchargez la **dernière version** (PostgreSQL 16.x recommandé) pour Windows x86-64

## 💿 Étape 2 : Installation

1. **Lancez l'installateur** téléchargé (double-clic sur le fichier .exe)

2. **Écran de bienvenue** : Cliquez sur "Next"

3. **Répertoire d'installation** : 
   - Laissez le chemin par défaut : `C:\Program Files\PostgreSQL\16`
   - Cliquez sur "Next"

4. **Sélection des composants** :
   - ✅ PostgreSQL Server (obligatoire)
   - ✅ pgAdmin 4 (interface graphique - recommandé)
   - ✅ Stack Builder (optionnel)
   - ✅ Command Line Tools (obligatoire)
   - Cliquez sur "Next"

5. **Répertoire des données** :
   - Laissez le chemin par défaut : `C:\Program Files\PostgreSQL\16\data`
   - Cliquez sur "Next"

6. **Mot de passe du superutilisateur** :
   - ⚠️ **IMPORTANT** : Choisissez un mot de passe et **notez-le** !
   - Exemple : `postgres123` (pour le développement local)
   - Confirmez le mot de passe
   - Cliquez sur "Next"

7. **Port** :
   - Laissez le port par défaut : `5432`
   - Cliquez sur "Next"

8. **Locale** :
   - Sélectionnez "French, France" ou laissez "Default locale"
   - Cliquez sur "Next"

9. **Résumé** :
   - Vérifiez les paramètres
   - Cliquez sur "Next"

10. **Installation** :
    - Cliquez sur "Next" pour commencer l'installation
    - Attendez la fin de l'installation (2-3 minutes)

11. **Fin de l'installation** :
    - Décochez "Stack Builder" si vous ne voulez pas installer d'extensions
    - Cliquez sur "Finish"

## ✅ Étape 3 : Vérification de l'installation

### Option A : Via l'invite de commande (CMD)

1. Ouvrez **PowerShell** ou **CMD**
2. Tapez :
   ```bash
   psql --version
   ```
3. Vous devriez voir : `psql (PostgreSQL) 16.x`

### Option B : Via pgAdmin 4

1. Cherchez **pgAdmin 4** dans le menu Démarrer
2. Lancez l'application
3. Un navigateur s'ouvrira avec l'interface pgAdmin
4. Cliquez sur **"Servers"** dans le panneau de gauche
5. Cliquez sur **"PostgreSQL 16"**
6. Entrez le mot de passe que vous avez défini lors de l'installation
7. Si vous voyez les bases de données (postgres, template0, template1), c'est bon ! ✅

## 🗄️ Étape 4 : Création de la base de données pour le projet

### Méthode 1 : Via pgAdmin 4 (Interface Graphique - RECOMMANDÉ)

1. **Ouvrez pgAdmin 4**

2. **Connectez-vous au serveur** :
   - Cliquez sur "Servers" → "PostgreSQL 16"
   - Entrez votre mot de passe

3. **Créer la base de données** :
   - Faites un clic droit sur **"Databases"**
   - Sélectionnez **"Create" → "Database..."**
   - Dans "Database", tapez : `gestionnaire_taches`
   - Cliquez sur **"Save"**

4. **Créer un utilisateur** (optionnel mais recommandé) :
   - Faites un clic droit sur **"Login/Group Roles"**
   - Sélectionnez **"Create" → "Login/Group Role..."**
   - **Onglet "General"** :
     - Name : `gestionnaire_user`
   - **Onglet "Definition"** :
     - Password : `gestionnaire123` (notez-le !)
   - **Onglet "Privileges"** :
     - ✅ Can login?
   - Cliquez sur **"Save"**

5. **Donner les permissions** :
   - Cliquez sur la base de données `gestionnaire_taches`
   - Clic droit → **"Properties"**
   - Onglet **"Security"**
   - Cliquez sur **"+"** pour ajouter
   - Grantee : `gestionnaire_user`
   - Privileges : Cochez **ALL**
   - Cliquez sur **"Save"**

6. **Importer le schéma** :
   - Cliquez sur la base de données `gestionnaire_taches`
   - Cliquez sur **"Tools"** → **"Query Tool"**
   - Ouvrez le fichier `database/schema.sql` de votre projet
   - Copiez tout le contenu
   - Collez-le dans la fenêtre de requête
   - Cliquez sur le bouton **"Execute"** (▶️) ou appuyez sur **F5**
   - Vous devriez voir : "Query returned successfully"

### Méthode 2 : Via la ligne de commande (PowerShell)

1. **Ouvrez PowerShell**

2. **Connectez-vous à PostgreSQL** :
   ```powershell
   psql -U postgres
   ```
   - Entrez le mot de passe du superutilisateur

3. **Créez la base de données** :
   ```sql
   CREATE DATABASE gestionnaire_taches;
   ```

4. **Créez l'utilisateur** :
   ```sql
   CREATE USER gestionnaire_user WITH PASSWORD 'gestionnaire123';
   ```

5. **Donnez les permissions** :
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE gestionnaire_taches TO gestionnaire_user;
   ```

6. **Quittez psql** :
   ```sql
   \q
   ```

7. **Connectez-vous à la nouvelle base** :
   ```powershell
   psql -U postgres -d gestionnaire_taches
   ```

8. **Importez le schéma** :
   ```powershell
   \i 'C:/Users/prime.DESKTOP-0EFJRJ5/Desktop/DEV/Projet/Gestionnaire_De_Taches/database/schema.sql'
   ```
   
   Ou copiez-collez le contenu du fichier `schema.sql` directement dans psql.

## ⚙️ Étape 5 : Configuration du projet Spring Boot

1. **Ouvrez le fichier** : `backend/src/main/resources/application.properties`

2. **Modifiez les paramètres de connexion** :

   ```properties
   # Si vous utilisez le superutilisateur postgres
   spring.datasource.url=jdbc:postgresql://localhost:5432/gestionnaire_taches
   spring.datasource.username=postgres
   spring.datasource.password=postgres123
   ```

   **OU**

   ```properties
   # Si vous avez créé l'utilisateur gestionnaire_user (RECOMMANDÉ)
   spring.datasource.url=jdbc:postgresql://localhost:5432/gestionnaire_taches
   spring.datasource.username=gestionnaire_user
   spring.datasource.password=gestionnaire123
   ```

3. **Sauvegardez le fichier**

## 🚀 Étape 6 : Test de la connexion

1. **Ouvrez un terminal dans le dossier backend** :
   ```powershell
   cd C:\Users\prime.DESKTOP-0EFJRJ5\Desktop\DEV\Projet\Gestionnaire_De_Taches\backend
   ```

2. **Lancez le backend** :
   ```powershell
   mvn spring-boot:run
   ```

3. **Vérifiez les logs** :
   - Vous devriez voir : `HikariPool-1 - Start completed.`
   - Et : `Started GestionnaireApplication in X seconds`
   - ✅ Si vous voyez ces messages, la connexion fonctionne !

4. **En cas d'erreur** :
   - Vérifiez que PostgreSQL est bien démarré (cherchez "Services" dans Windows, cherchez "postgresql-x64-16")
   - Vérifiez le nom de la base de données
   - Vérifiez le nom d'utilisateur et le mot de passe
   - Vérifiez que le port 5432 n'est pas bloqué

## 📊 Étape 7 : Vérification des données

### Via pgAdmin 4

1. Ouvrez pgAdmin 4
2. Naviguez vers : Servers → PostgreSQL 16 → Databases → gestionnaire_taches → Schemas → public → Tables
3. Vous devriez voir 4 tables :
   - `users`
   - `projects`
   - `tasks`
   - `notifications`

4. Pour voir les données d'exemple :
   - Clic droit sur `users` → "View/Edit Data" → "All Rows"
   - Vous devriez voir 2 utilisateurs (Admin et User Test)

### Via ligne de commande

```powershell
psql -U gestionnaire_user -d gestionnaire_taches
```

Puis :
```sql
-- Voir toutes les tables
\dt

-- Voir les utilisateurs
SELECT * FROM users;

-- Voir les projets
SELECT * FROM projects;

-- Voir les tâches
SELECT * FROM tasks;

-- Quitter
\q
```

## 🔧 Commandes PostgreSQL Utiles

### Gestion du service (Windows)

```powershell
# Vérifier le statut
Get-Service postgresql-x64-16

# Démarrer le service
Start-Service postgresql-x64-16

# Arrêter le service
Stop-Service postgresql-x64-16

# Redémarrer le service
Restart-Service postgresql-x64-16
```

### Commandes psql courantes

```sql
-- Lister toutes les bases de données
\l

-- Se connecter à une base
\c gestionnaire_taches

-- Lister les tables
\dt

-- Décrire une table
\d users

-- Voir les utilisateurs PostgreSQL
\du

-- Quitter
\q
```

## ❓ Dépannage

### Problème : "psql n'est pas reconnu"

**Solution** : Ajoutez PostgreSQL au PATH :
1. Cherchez "Variables d'environnement" dans Windows
2. Cliquez sur "Variables d'environnement"
3. Dans "Variables système", trouvez "Path"
4. Cliquez sur "Modifier"
5. Ajoutez : `C:\Program Files\PostgreSQL\16\bin`
6. Cliquez sur "OK" partout
7. Redémarrez PowerShell

### Problème : "password authentication failed"

**Solution** :
- Vérifiez le mot de passe dans `application.properties`
- Réinitialisez le mot de passe de l'utilisateur :
  ```sql
  ALTER USER gestionnaire_user WITH PASSWORD 'nouveau_mot_de_passe';
  ```

### Problème : "database does not exist"

**Solution** :
- Vérifiez que la base `gestionnaire_taches` existe :
  ```sql
  \l
  ```
- Si elle n'existe pas, créez-la :
  ```sql
  CREATE DATABASE gestionnaire_taches;
  ```

### Problème : Le service ne démarre pas

**Solution** :
1. Ouvrez "Services" (services.msc)
2. Cherchez "postgresql-x64-16"
3. Clic droit → "Démarrer"
4. Si erreur, vérifiez les logs dans : `C:\Program Files\PostgreSQL\16\data\log`

## 📚 Ressources Supplémentaires

- **Documentation officielle** : https://www.postgresql.org/docs/
- **pgAdmin 4 Documentation** : https://www.pgadmin.org/docs/
- **Tutoriels PostgreSQL** : https://www.postgresqltutorial.com/

## ✅ Checklist Finale

Avant de lancer votre application, vérifiez :

- [ ] PostgreSQL est installé
- [ ] Le service PostgreSQL est démarré
- [ ] La base de données `gestionnaire_taches` existe
- [ ] L'utilisateur `gestionnaire_user` existe (ou vous utilisez `postgres`)
- [ ] Le schéma SQL a été importé (4 tables créées)
- [ ] Le fichier `application.properties` est configuré avec les bons identifiants
- [ ] Le backend démarre sans erreur de connexion

Si tous ces points sont verts, vous êtes prêt à utiliser l'application ! 🎉
