# Mail Cleaner

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-339933.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg)](https://www.typescriptlang.org)

> Nettoyez votre boîte Gmail des notifications inutiles et périmées — en local, sans envoyer vos données à un tiers.

Mail Cleaner est un outil web local (Node.js + React) qui scanne votre boîte Gmail, détecte les notifications inutiles et périmées via une heuristique configurable, et vous permet de les mettre à la corbeille ou de les archiver par lot. Aucun corps de mail n'est stocké : uniquement des métadonnées.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration Google Cloud](#configuration-google-cloud)
- [Lancement](#lancement)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Sécurité & confidentialité](#sécurité--confidentialité)
- [Performance](#performance)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## Fonctionnalités

- Connexion Google via OAuth2 (scope `gmail.modify` uniquement)
- Scan heuristique : expéditeur, catégorie Gmail, sujet, ancienneté, statut lu/non lu
- Liste des candidats avec score, filtres, pagination, sélection groupée
- Actions par lot : mise à la corbeille / archivage
- Historique des actions avec restauration (undo)
- Whitelist d'expéditeurs / sujets à ne jamais toucher
- Règles et seuils configurables (fichiers JSON dans `data/`)
- Mode clair / sombre
- Interface responsive (desktop & mobile)

## Prérequis

- **Node.js** ≥ 22
- Un projet Google Cloud avec l'API Gmail activée et des identifiants OAuth2

## Installation

```bash
git clone https://github.com/nf4r4r4n/mail-cleaner.git
cd mail-cleaner
npm install
cp .env.example .env
```

Renseignez ensuite `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` dans `.env` (voir ci-dessous).

## Configuration Google Cloud

1. Ouvrez [Google Cloud Console](https://console.cloud.google.com) et créez un projet.
2. Activez l'API **Gmail API**.
3. Allez dans **Identifiants** → **Créer des identifiants** → **ID client OAuth 2.0** → type **Application Web**.
4. Ajoutez l'URI de redirection autorisée : `http://localhost:3000/auth/google/callback`
5. Copiez le **Client ID** et le **Secret** dans votre fichier `.env`.

## Lancement

**Développement** (hot reload) :

```bash
npm run dev
```

- API : http://localhost:3000
- UI : http://localhost:5173

**Production** :

```bash
npm run build
npm start
```

Puis ouvrez http://localhost:3000.

## Configuration

| Variable     | Défaut      | Description                                                 |
| ------------ | ----------- | ----------------------------------------------------------- |
| `MIN_SCORE`  | `4`         | Score minimum pour qu'un mail soit candidat                 |
| `STALE_DAYS` | `90`        | Âge (jours) au-delà duquel une notification est « périmée » |
| `PORT`       | `3000`      | Port du serveur                                             |
| `HOST`       | `127.0.0.1` | Hôte du serveur                                             |
| `DATA_DIR`   | `./data`    | Dossier des données (SQLite, tokens, config)                |

Ajustements fins dans `data/` :

- `config.json` — `minScore`, `staleDays`, `notificationSenders`, `notificationSubjects`, `protectedLabels`
- `rules.json` — règles personnalisées
- Whitelist — via l'interface ou la table `whitelist` de la base SQLite

## Architecture

```
mail-cleaner/
├── src/
│   ├── server/          # Fastify + TypeScript (API, Gmail, SQLite)
│   │   ├── index.ts
│   │   ├── routes/      # auth, scan, messages, actions, rules
│   │   ├── services/    # gmail, scanner, crypto
│   │   └── db/          # schéma + repo (better-sqlite3)
│   ├── client/          # React + Vite + Tailwind (UI)
│   │   ├── api/         # client HTTP typé
│   │   ├── hooks/       # React Query hooks
│   │   ├── components/  # ui (primitives) + features
│   │   └── pages/       # ConnectPage, DashboardPage
│   └── shared/          # types partagés
├── data/                # SQLite, tokens chiffrés, config (gitignored)
└── dist/                # build (gitignored)
```

## Sécurité & confidentialité

- Tokens OAuth chiffrés au repos (AES-256-GCM, clé dans `data/.key`, mode `0600`)
- Aucun corps de mail stocké — uniquement des métadonnées
- Aucune suppression définitive dans le MVP (corbeille uniquement, réversible 30 j)
- Aucune télémétrie, aucun compte cloud — tout reste en local

## Performance

- Pré-filtrage côté serveur via les requêtes Gmail (`q`)
- Pagination + batching (`batchModify`)
- Concurrence maîtrisée (`p-limit`) avec backoff exponentiel
- Cache SQLite local

## Contribuer

Les contributions sont les bienvenues !

1. Forkez le dépôt
2. Créez une branche (`git checkout -b feat/ma-fonctionnalite`)
3. Committez vos changements (`git commit -m "feat: description"`)
4. Poussez la branche (`git push origin feat/ma-fonctionnalite`)
5. Ouvrez une Pull Request

Merci de respecter le style de code existant (TypeScript strict, Tailwind, composants sharp pour le design suisse).

## Licence

[MIT](LICENSE)
