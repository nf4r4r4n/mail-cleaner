# Mail Cleaner

Outil local (web) pour nettoyer une boite Gmail des notifications inutiles et perimees.

## Fonctionnalites (MVP)

- Connexion Google via OAuth2 (scope `gmail.modify`)
- Scan heuristique (expediteur, categorie Gmail, sujet, anciennete, statut lu)
- Liste des candidats avec score, filtres, pagination
- Actions groupes : mise a la corbeille / archivage
- Historique avec restauration (undo)
- Whitelist d'expediteurs/sujets a ne jamais toucher
- Regles et seuils configurables (fichiers JSON dans `data/`)

## Prerequis

- Node.js 22+
- Un projet Google Cloud avec l'API Gmail activee et des identifiants OAuth2 (type "Application de bureau" ou "Web").

## Installation

```bash
npm install
cp .env.example .env
# Renseigner GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans .env
```

### Creer les identifiants Google

1. https://console.cloud.google.com → Nouveau projet
2. Activer "Gmail API"
3. Identifiants → Creer des identifiants → ID client OAuth 2.0 → Application Web
4. URI de redirection autorisee : `http://localhost:3000/auth/google/callback`
5. Copier Client ID / Secret dans `.env`

## Lancement

Mode developpement (hot reload) :
```bash
npm run dev
```
- API : http://localhost:3000
- UI : http://localhost:5173

Mode production :
```bash
npm run build
npm start
```
Puis ouvrir http://localhost:3000

## Configuration

- `MIN_SCORE` (defaut 4) et `STALE_DAYS` (defaut 90) dans `.env`
- Ajustements fins : `data/config.json` (minScore, staleDays, notificationSenders, notificationSubjects, protectedLabels)
- Regles personnalisees : `data/rules.json`
- Whitelist : via l'UI ou `data/mail-cleaner.db` (table whitelist)

## Securite

- Tokens OAuth chiffres au repos (AES-256-GCM, cle dans `data/.key` mode 0600)
- Aucun corps de mail stocke, uniquement metadonnees
- Aucune suppression definitive dans le MVP (corbeille uniquement, reversible 30 j)

## Performance

- Pre-filtrage cote serveur via requetes Gmail (`q`)
- Pagination + batching (`batchModify`)
- Concurrence limitee (p-limit) + backoff
- Cache SQLite avec sync incrementale prevue (v2)
