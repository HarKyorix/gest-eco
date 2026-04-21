# 📊 Family-Eco

**Family-Eco** est une application web pour gérer les **budgets et l'économie familiale**. Elle permet de suivre les revenus, les dépenses, les économies et les budgets organisés par "boards" (plannings).

> **✨ Nouvelles Améliorations UX**: Recherche en temps réel, notifications toast, undo/redo, alerte budgets, export/import JSON. Voir [Guide des Améliorations](#-guide-améliorations-récentes)

## 🎯 Objectif

Fournir une interface simple et intuitive pour que les familles gèrent leurs finances personnelles. Tous les données sont stockées localement dans le navigateur (localStorage) - **aucun serveur backend requis**.

## ✨ Fonctionnalités

### Core
- ✅ **Multi-Planning**: Organiser les budgets par boards/périodes
- ✅ **Suivi des Budgets**: Allouer les budgets par source de revenu
- ✅ **Gestion des Dépenses**: Catégoriser et suivre les dépenses
- ✅ **Économies**: Répartir les économies dans des "caisses"
- ✅ **Catégories Personnalisées**: Sources, types de dépenses, caisses
- ✅ **Édition en Ligne**: Modification directe des titres et montants
- ✅ **Stockage Persistant**: Données sauvegardées en localStorage

### Améliorations UX (Nouvelles)
- ✨ **Recherche & Filtrage**: SearchAndSort pour budgets, dépenses, épargnes
- 🔔 **Notifications Toast**: Feedback utilisateur pour chaque action
- ↩️ **Undo/Redo**: Annulation/rétablissement avec 50 niveaux d'historique
- 🎨 **Alerte Budgets**: Indicateurs visuels (rouge/orange/bleu/vert/ambré)
- 💾 **Export/Import**: Sauvegarde et restauration JSON avec validation

### Préférences
- 🎨 **Thème**: Mode sombre/clair/système
- 💱 **Devises**: EUR, USD, GBP, JPY, CNY, FCFA
- 📱 **Responsive**: Interface mobile-friendly

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|------------|
| **Framework** | React 19.2 + TypeScript 6.0 |
| **Build** | Vite 8.0 |
| **Styling** | Tailwind CSS 4.0 + PostCSS |
| **État** | Zustand 5.0 (avec persistence) |
| **Routing** | React Router 7.1 |
| **Icons** | Lucide React 1.8 |
| **Linting** | ESLint 9.3 + TypeScript ESLint 8.5 |

## 📦 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd family-eco

# Installer les dépendances
npm install
```

## 🚀 Commandes

```bash
# Démarrer le serveur de développement avec HMR
npm run dev

# Compiler TypeScript et construire pour la production
npm run build

# Prévisualiser la build production
npm run preview

# Linter le code
npm run lint
```

## 📁 Structure du Projet

```
src/
├── pages/
│   ├── HomePage.tsx              # Dashboard avec onglets
│   ├── BoardPage.tsx             # Lister les boards
│   └── BoardDetailPage.tsx       # Détail d'un planning
│
├── components/
│   ├── sections/                 # Modules métier
│   │   ├── BoardsSection.tsx     # Gestion des boards
│   │   ├── BudgetSection.tsx     # Suivi des budgets (avec SearchAndSort)
│   │   ├── DepenseSection.tsx    # Gestion des dépenses (avec SearchAndSort)
│   │   ├── EpargneSection.tsx    # Suivi des économies (avec SearchAndSort)
│   │   ├── CaissesSection.tsx    # Gestion des caisses
│   │   ├── SourcesSection.tsx    # Gestion des sources
│   │   └── DiversSection.tsx     # Catégories diverses
│   ├── ui/                       # Composants UI réutilisables
│   ├── BudgetAlert.tsx           # Alerte budgets (5 niveaux)
│   ├── SearchAndSort.tsx         # Composant filtrage/tri
│   ├── ExportImportButtons.tsx   # Boutons backup/restore
│   ├── Toast.tsx                 # Conteneur notifications
│   ├── BoardLayout.tsx           # Layout avec sidebar
│   ├── DialogForm.tsx            # Modal form générique
│   └── TextEditable.tsx          # Édition en ligne
│
├── store/
│   ├── app.store.ts              # État UI (modals, forms)
│   ├── setting.store.ts          # Préférences utilisateur
│   ├── toast.store.ts            # Notifications toast
│   ├── history.store.ts          # Historique Undo/Redo
│   └── db/                       # Stores de données persistantes
│       ├── board.ts              # Boards
│       ├── planning.ts           # Plannings (core)
│       ├── caisse.ts             # Caisses
│       ├── divers.ts             # Catégories dépenses
│       └── source.ts             # Sources revenus
│
├── hooks/
│   ├── useSearchAndSort.ts       # Filtrage/tri réutilisable
│   └── useHistory.ts             # Undo/Redo logic
│
├── lib/
│   ├── exportImport.ts           # Export/Import JSON
│   └── utils.ts                  # Utilitaires
│
├── helper/
│   └── formField.ts              # Aide formulaires
│
└── assets/
```

## 🔗 Modèle de Données

```
Board (1) ──→ (N) Planning
              ├─→ (N) Budget → Source
              ├─→ (N) Dépense → Divers
              └─→ (N) Épargne → Caisse
```

### Stores Zustand (Persistants)
- `useBoardStore` - Boards/Plannings
- `usePlanningStore` ⭐ - Budgets, dépenses, économies
- `useCaisseStore` - Caisses d'économies
- `useDiversStore` - Catégories de dépenses
- `useSourceStore` - Sources de revenus
- `useSettingStore` - Préférences utilisateur (thème, devise, etc.)

## 🎨 Configuration

- **Tailwind CSS**: Configuration dans `tailwind.config.js`
- **TypeScript**: Configuration dans `tsconfig.json` avec alias `@/` pour `src/`
- **ESLint**: Rules dans `eslint.config.js`
- **Vite**: Configuration dans `vite.config.ts`

## 🆕 Guide Améliorations Récentes

### 🔍 Recherche & Filtrage
Chaque section (Budgets, Dépenses, Épargnes) inclut une barre de recherche:
- Tape pour chercher par nom
- Clique sur l'icône tri pour changer le tri (nom/montant)
- Clique sur l'ordre (↑/↓) pour inverser l'ordre

### 🔔 Notifications Toast
Les notifications apparaissent automatiquement pour:
- ✅ Succès (export, import, actions complètes)
- ❌ Erreurs (validation, imports échoués)
- ℹ️ Info (undo/redo)
- ⚠️ Avertissements

Elles disparaissent automatiquement après 4 secondes.

### ↩️ Undo/Redo
Les boutons ↶ et ↷ (dans l'en-tête du planning) permettent:
- **Annuler** la dernière action (Undo)
- **Rétablir** l'action annulée (Redo)
- Historique de **50 actions** stocké

Snapshots capturés pour:
- Ajout/modification/suppression de budgets
- Ajout/modification/suppression de dépenses
- Ajout/modification/suppression d'épargnes

### 🎨 Alerte Budgets
Une barre colorée indique l'état du budget:
- 🔴 **Rouge** - Budget dépassé
- 🟠 **Orange** - Faible budget (< 20%)
- 🔵 **Bleu** - Aucun budget défini
- 🟢 **Vert** - Budget équilibré
- 🟡 **Ambré** - Budget exactement consommé

Affiche aussi % utilisé et montant restant.

### 💾 Export/Import
Boutons dans l'en-tête du planning:
- **Export** - Télécharge un fichier `backup-YYYY-MM-DD.json`
- **Import** - Charge un fichier de sauvegarde avec validation

Les données exportées incluent:
- Tous les boards
- Tous les plannings
- Toutes les caisses, sources, catégories
- Les préférences utilisateur

## 📝 Notes Développement

- **React Compiler** est activé pour optimiser les performances
- **Zustand** pour l'état global avec persistence localStorage
- **Toast System** - Notifications non-intrusive avec auto-fermeture
- **History Store** - Undo/Redo avec gestion d'état immuable
- **SearchAndSort Hook** - Générique et réutilisable pour filtrer/trier
- Tous les formulaires utilisent le composant générique `DialogForm`
- Mobile-first design avec Tailwind CSS
- Type-safe avec TypeScript strict
- Snapshots capturés manuellement après chaque action (évite boucles infinies)

## 📄 Licence

MIT
