# Guide de Démarrage Rapide

## Étape 1 : Installation de PostgreSQL

1. Téléchargez et installez PostgreSQL depuis https://www.postgresql.org/download/
2. Créez la base de données :
   ```bash
   psql -U postgres
   CREATE DATABASE gestionnaire_taches;
   \q
   ```

## Étape 2 : Lancement du Backend

1. Ouvrez un terminal dans le dossier `backend`
2. Exécutez :
   ```bash
   mvn spring-boot:run
   ```
3. Attendez que le message "Started GestionnaireApplication" apparaisse
4. Le backend est maintenant accessible sur http://localhost:8080

## Étape 3 : Lancement du Frontend

1. Ouvrez un nouveau terminal dans le dossier `frontend`
2. Exécutez :
   ```bash
   npm start
   ```
3. Attendez que le message "Compiled successfully" apparaisse
4. Ouvrez votre navigateur sur http://localhost:4200

## Étape 4 : Première Connexion

1. Créez un compte administrateur via l'API :
   ```bash
   curl -X POST http://localhost:8080/api/auth/register ^
     -H "Content-Type: application/json" ^
     -d "{\"name\":\"Admin\",\"email\":\"admin@test.com\",\"password\":\"admin123\",\"role\":\"ADMIN\"}"
   ```

2. Connectez-vous avec :
   - Email: admin@test.com
   - Mot de passe: admin123

## Fonctionnalités Disponibles

### En tant qu'ADMIN :
- ✅ Créer, modifier, supprimer des projets
- ✅ Créer, modifier, supprimer des tâches
- ✅ Gérer les utilisateurs
- ✅ Voir le tableau de bord
- ✅ Recevoir des notifications

### En tant qu'USER :
- ✅ Voir les projets
- ✅ Créer et modifier ses tâches
- ✅ Voir le tableau de bord
- ✅ Recevoir des notifications

## Dépannage

### Le backend ne démarre pas
- Vérifiez que PostgreSQL est bien démarré
- Vérifiez les paramètres de connexion dans `backend/src/main/resources/application.properties`
- Vérifiez que le port 8080 n'est pas déjà utilisé

### Le frontend ne démarre pas
- Vérifiez que Node.js est installé : `node --version`
- Supprimez `node_modules` et réinstallez : `npm install`
- Vérifiez que le port 4200 n'est pas déjà utilisé

### Erreur de connexion
- Vérifiez que le backend est bien démarré
- Vérifiez l'URL de l'API dans `frontend/src/environments/environment.ts`
- Ouvrez la console du navigateur pour voir les erreurs

## Prochaines Étapes

1. Créez des projets depuis l'interface admin
2. Créez des tâches et assignez-les aux utilisateurs
3. Explorez le tableau de bord pour voir les statistiques
4. Testez les notifications en assignant des tâches

## Support

Pour toute question, consultez le README.md principal ou créez une issue.
