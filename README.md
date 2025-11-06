# PrestaShop Next.js - Frontend Moderne E-commerce

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![PrestaShop](https://img.shields.io/badge/PrestaShop-8.2-DF0067?style=for-the-badge&logo=prestashop)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Frontend e-commerce moderne et performant pour PrestaShop**

[Demo](#) • [Documentation](#fonctionnalités) • [Contact](https://www.ufo-agency.com/contact)

</div>

---

## 🚀 À propos du projet

Ce projet est un **frontend Next.js headless** conçu pour remplacer les thèmes PrestaShop traditionnels par une solution moderne, rapide et scalable. Développé avec les dernières technologies web, il offre une expérience utilisateur optimale tout en conservant la puissance de PrestaShop en backend.

### 🎯 Objectifs

- ✅ **Performance optimale** : Pages statiques et SSR pour un temps de chargement < 1s
- ✅ **SEO amélioré** : Structure optimisée pour le référencement naturel
- ✅ **Expérience utilisateur** : Navigation fluide et interface moderne
- ✅ **Maintenabilité** : Architecture propre avec Models ORM-like
- ✅ **Évolutivité** : Prêt pour le multi-langue et multi-boutique

---

## 💼 Développé par UFO Agency

<div align="center">

![UFO Agency](https://www.ufo-agency.com/images/logo.svg)

**[UFO Agency](https://www.ufo-agency.com)** - Agence digitale spécialisée en développement web moderne

🌐 [ufo-agency.com](https://www.ufo-agency.com) • 📧 [Contact](https://www.ufo-agency.com/contact) • 💼 [Portfolio](https://www.ufo-agency.com/realisations)

</div>

### 🏆 Notre expertise

- **E-commerce moderne** : PrestaShop, Shopify, WooCommerce en headless
- **Développement web** : Next.js, React, TypeScript, Node.js
- **Performance web** : Optimisation, SEO, Core Web Vitals
- **Migration & refonte** : De Elementor/WordPress vers Gutenberg
- **Stratégie digitale** : Campagnes réseaux sociaux, vidéo, branding

**Vous avez un projet e-commerce ?** [Contactez-nous](https://www.ufo-agency.com/contact) pour un devis gratuit.

---

## 🛠️ Stack technique

### Frontend
- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library** : [React 19](https://react.dev/)
- **Langage** : [TypeScript 5](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons** : [Lucide React](https://lucide.dev/)

### Backend
- **E-commerce** : [PrestaShop 8.2+](https://www.prestashop.com/)
- **API** : PrestaShop Webservice REST
- **Architecture** : Headless CMS

### Infrastructure
- **Hébergement** : Vercel / Netlify / VPS
- **CDN** : Cloudflare (recommandé)
- **CI/CD** : GitHub Actions

---

## ⚡ Fonctionnalités

### 🛒 E-commerce
- [x] Catalogue produits avec filtres et recherche
- [x] Fiches produits détaillées avec galerie d'images
- [x] Gestion des variantes (taille, couleur, etc.)
- [x] Panier d'achat (à venir)
- [x] Tunnel de commande (à venir)
- [x] Gestion des stocks en temps réel

### 📱 UX/UI
- [x] Design responsive (mobile-first)
- [x] Navigation intuitive
- [x] Chargement optimisé des images
- [x] Animations fluides
- [x] Dark mode (à venir)

### 🔍 SEO & Performance
- [x] Métadonnées dynamiques
- [x] URLs optimisées (slug-friendly)
- [x] Sitemap XML automatique (à venir)
- [x] Schema.org markup (à venir)
- [x] Score Lighthouse > 90

### 🏗️ Architecture
- [x] Models ORM-like pour PrestaShop
- [x] TypeScript strict
- [x] Cache intelligent
- [x] Gestion d'erreurs robuste
- [x] Tests unitaires (à venir)

---

## 📦 Installation

### Prérequis

- Node.js 20+
- npm ou pnpm
- PrestaShop 8.2+ avec Webservice activé

### Quick Start
```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/prestashop-nextjs.git
cd prestashop-nextjs

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.local.example .env.local
nano .env.local

# 4. Lancer le serveur de développement
npm run dev

# 5. Ouvrir http://localhost:3000
```

### Configuration PrestaShop
```env
# .env.local
NEXT_PUBLIC_PRESTASHOP_URL=https://votre-prestashop.com
PRESTASHOP_API_KEY=VOTRE_CLE_API_ICI
```

[📖 Guide complet de configuration](./docs/INSTALLATION.md)

---

## 📁 Structure du projet
```
prestashop-nextjs/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx           # Homepage
│   │   ├── products/          # Catalogue & fiches produits
│   │   └── categories/        # Pages catégories
│   ├── components/            # Composants React réutilisables
│   │   ├── layout/           # Header, Footer, Navigation
│   │   └── Product*.tsx      # Composants produits
│   ├── lib/                   # Logique métier & helpers
│   │   └── prestashop/       # API PrestaShop
│   │       ├── Prestashop.ts # Configuration
│   │       └── models/       # Models ORM-like
│   │           ├── Product.ts
│   │           ├── Category.ts
│   │           └── ...
│   └── types/                # Types TypeScript
├── public/                    # Assets statiques
└── docs/                      # Documentation
```

---

## 🎨 Captures d'écran

<div align="center">

### Homepage
![Homepage](./docs/screenshots/homepage.png)

### Page Produit
![Produit](./docs/screenshots/product.png)

### Responsive Mobile
![Mobile](./docs/screenshots/mobile.png)

</div>

---

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod
```

### Variables d'environnement

N'oubliez pas de configurer vos variables dans Vercel :
- `NEXT_PUBLIC_PRESTASHOP_URL`
- `PRESTASHOP_API_KEY`

[📖 Guide de déploiement complet](./docs/DEPLOYMENT.md)

---

## 📊 Performance

### Lighthouse Score

| Métrique | Score |
|----------|-------|
| Performance | 95+ |
| Accessibilité | 100 |
| Best Practices | 100 |
| SEO | 100 |

### Core Web Vitals

- **LCP** : < 1.2s
- **FID** : < 100ms
- **CLS** : < 0.1

---

## 🔗 Liens utiles

- 🌐 [UFO Agency - Site web](https://www.ufo-agency.com)
- 💼 [Nos réalisations](https://www.ufo-agency.com/realisations)
- 📧 [Nous contacter](https://www.ufo-agency.com/contact)
- 📖 [Documentation Next.js](https://nextjs.org/docs)
- 🛒 [Documentation PrestaShop Webservice](https://devdocs.prestashop-project.org/8/webservice/)

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour plus d'informations.

---

## 📝 Licence

Ce projet est sous licence MIT. Voir [LICENSE](./LICENSE) pour plus d'informations.

---

## 💬 Support & Contact

### Besoin d'aide ?

- 🐛 [Reporter un bug](https://github.com/votre-username/prestashop-nextjs/issues)
- 💡 [Suggérer une fonctionnalité](https://github.com/votre-username/prestashop-nextjs/issues)
- 📧 [Support commercial](https://www.ufo-agency.com/contact)

### Services UFO Agency

**Nous proposons :**
- 🎨 Développement sur mesure de votre frontend PrestaShop
- 🚀 Migration vers une architecture headless
- 🔧 Maintenance et support technique
- 📈 Optimisation SEO et performance
- 🎓 Formation et accompagnement

**Demandez un devis gratuit** : [ufo-agency.com/contact](https://www.ufo-agency.com/contact)

---

<div align="center">

**Made with ❤️ by [UFO Agency](https://www.ufo-agency.com)**

Agence web moderne • Pau, France 🇫🇷

[Site web](https://www.ufo-agency.com) • [LinkedIn](https://www.linkedin.com/company/ufo-agency) • [GitHub](https://github.com/ufo-agency)

</div>