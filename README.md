# docker-soutenance

Installation et lancement du projet

1. Créer le fichier .env à la racine

   MYSQL_DATABASE=projetdb
   MYSQL_USER=projetuser

2. Créer le dossier secrets

   echo "motdepasse_user" > secrets/db_password.secret
   echo "brainproot67" > secrets/db_root_password.secret

3. Lancer le projet

   docker compose up -d --build

Accès aux services

Frontend : http://localhost:5173
Backend : http://localhost:5173

Test de fonctionnement

1. Vérifier la connexion base de données

   curl http://localhost:3000/api/status

Réponse attendue : {"success":true,"database":1}

2. Ajouter un utilisateur via API

   curl -X POST "http://localhost:3000/api/users" \
    -H "Content-Type: application/json" \
    -d '{"firstname":"Test"}'

3. Voir les utilisateurs enregistrés

   curl http://localhost:3000/api/users

Test de persistance

1. Ajouter un utilisateur
2. Arrêter les conteneurs : docker compose down
3. Relancer : docker compose up -d
4. Vérifier que les données sont toujours présentes : curl http://localhost:3000/api/users

Réinitialiser complètement la base

    docker compose down -v
    docker compose up -d --build

Architecture Docker

- frontend : Vue (port 5173)
- backend : Node + Express (port 3000)
- db : MariaDB 10.5
- Volume nommé db_data pour la persistance
- Réseau privé entre backend et db
- Secrets Docker pour les mots de passe
