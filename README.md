# PrestaShop Next.js Frontend

Frontend moderne pour PrestaShop utilisant Next.js 16 et l'architecture de Models.

## 🚀 Démarrage rapide

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer les variables d'environnement**
```bash
cp .env.local.example .env.local
# Éditer .env.local avec vos vraies informations
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir** [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx
│   ├── page.tsx           # Page d'accueil
│   ├── products/          # Liste et détails produits
│   └── categories/        # Catégories
├── components/            # Composants React
│   ├── layout/           # Header, Footer
│   └── Product*.tsx      # Composants produits
├── lib/                   # Logique métier
│   ├── prestashop/       # API PrestaShop
│   │   ├── Prestashop.ts
│   │   └── models/       # Models (Product, Category, etc.)
│   └── image-helper.ts
└── types/                # Types TypeScript
```

## 🔧 Technologies

- **Next.js 16** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript 5** - Typage statique
- **Tailwind CSS 4** - Styles
- **Lucide React** - Icônes
- **PrestaShop API** - Backend e-commerce

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [PrestaShop Webservice](https://devdocs.prestashop-project.org/8/webservice/)
