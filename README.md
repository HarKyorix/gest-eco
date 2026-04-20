# 📊 Family-Eco

**Family-Eco** est une application web pour gérer les **budgets et l'économie familiale**. Elle permet de suivre les revenus, les dépenses, les économies et les budgets organisés par "boards" (plannings).

## 🎯 Objectif

Fournir une interface simple et intuitive pour que les familles gèrent leurs finances personnelles. Tous les données sont stockées localement dans le navigateur (localStorage) - **aucun serveur backend requis**.

## ✨ Fonctionnalités

- ✅ **Multi-Planning**: Organiser les budgets par boards/périodes
- ✅ **Suivi des Budgets**: Allouer les budgets par source de revenu
- ✅ **Gestion des Dépenses**: Catégoriser et suivre les dépenses
- ✅ **Économies**: Répartir les économies dans des "caisses"
- ✅ **Catégories Personnalisées**: Sources, types de dépenses, caisses
- ✅ **Thème**: Mode sombre/clair/système
- ✅ **Devises**: EUR, USD, GBP, JPY, CNY, FCFA
- ✅ **Stockage Persistant**: Données sauvegardées en localStorage
- ✅ **Édition en Ligne**: Modification directe des titres et montants
- ✅ **Responsive**: Interface mobile-friendly

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
│   │   ├── BudgetSection.tsx     # Suivi des budgets
│   │   ├── DepenseSection.tsx    # Gestion des dépenses
│   │   ├── EpargneSection.tsx    # Suivi des économies
│   │   ├── CaissesSection.tsx    # Gestion des caisses
│   │   ├── SourcesSection.tsx    # Gestion des sources
│   │   └── DiversSection.tsx     # Catégories diverses
│   ├── ui/                       # Composants UI réutilisables
│   ├── BoardLayout.tsx           # Layout avec sidebar
│   ├── DialogForm.tsx            # Modal form générique
│   └── TextEditable.tsx          # Édition en ligne
│
├── store/
│   ├── app.store.ts              # État UI (modals, forms)
│   ├── setting.store.ts          # Préférences utilisateur
│   └── db/                       # Stores de données persistantes
│       ├── board.ts              # Boards
│       ├── planning.ts           # Plannings (core)
│       ├── caisse.ts             # Caisses
│       ├── divers.ts             # Catégories dépenses
│       └── source.ts             # Sources revenus
│
├── hooks/                        # Custom hooks
├── helper/                       # Utilitaires
└── lib/                          # Fonctions utilitaires
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

## 📝 Notes Développement

- **React Compiler** est activé pour optimiser les performances
- Tous les formulaires utilisent le composant générique `DialogForm`
- L'état persiste automatiquement via Zustand middleware
- Mobile-first design avec Tailwind CSS
- Type-safe avec TypeScript strict

## 📄 Licence

MIT
