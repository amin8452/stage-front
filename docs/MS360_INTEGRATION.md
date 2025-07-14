# Intégration MS360 - Guide de Configuration

## Vue d'ensemble

Ce projet a été configuré pour utiliser les informations de la société **MS360** (ms360.fr) dans tous les composants, services et fonctionnalités.

## Fichiers de Configuration

### 1. Configuration de la Société (`src/config/companyConfig.ts`)

Centralise toutes les informations de MS360 :
- Nom de la société
- Coordonnées (email, téléphone, adresse)
- Liens sociaux
- Informations de branding
- Données légales

### 2. Configuration du Site (`src/config/siteConfig.ts`)

Gère les métadonnées SEO et les informations du site :
- Titre et description
- Mots-clés
- Configuration Open Graph
- Données structurées JSON-LD

### 3. Configuration API (`src/config/apiConfig.ts`)

Intègre les informations MS360 dans la configuration des APIs.

## Composants Mis à Jour

### Logo MS360 (`src/components/ui/MS360Logo.tsx`)

Composant réutilisable pour afficher le logo MS360 :
```tsx
<MS360Logo variant="full" size="md" />
<MS360Logo variant="simple" size="lg" />
<MS360Logo variant="icon" size="sm" />
```

### Header et Footer

- **Header** : Utilise le logo MS360 et les informations de la société
- **Footer** : Affiche les coordonnées MS360 et les liens

### Métadonnées SEO (`src/components/SEO/MetaTags.tsx`)

Composant pour gérer les métadonnées avec les informations MS360.

## Services Mis à Jour

### Service Email (`src/services/EmailService.ts`)

- Utilise l'email MS360 comme expéditeur
- Intègre les informations de contact MS360
- Personnalise les templates avec les données de la société

### Générateur PDF (`src/services/PdfGeneratorOptimized.ts`)

- Page de couverture avec logo MS360
- Pieds de page avec informations MS360
- Conclusion avec coordonnées de contact
- Branding cohérent dans tout le PDF

## Assets

### Logos
- `/public/logo-ms360.svg` - Logo principal
- `/public/logo-ms360-simple.svg` - Version simplifiée
- `/public/og-image-ms360.svg` - Image Open Graph

### Fichiers de Configuration
- `/public/robots.txt` - Configuré pour MS360
- Favicon par défaut (à remplacer par le favicon MS360)

## Utilisation

### Récupérer les Informations de la Société

```tsx
import { getCompanyConfig } from '../config/companyConfig';

const companyConfig = getCompanyConfig();
console.log(companyConfig.name); // "MS360"
console.log(companyConfig.email); // "contact@ms360.fr"
```

### Générer les Métadonnées

```tsx
import { generatePageMetadata } from '../config/siteConfig';

const metadata = generatePageMetadata('Titre de la Page', 'Description');
```

### Utiliser le Logo

```tsx
import MS360Logo from '../components/ui/MS360Logo';

// Logo complet
<MS360Logo variant="full" size="lg" />

// Logo simple
<MS360Logo variant="simple" size="md" />

// Icône seulement
<MS360Logo variant="icon" size="sm" />
```

## Personnalisation

### Modifier les Informations de la Société

Éditez le fichier `src/config/companyConfig.ts` :

```typescript
export const MS360_CONFIG: CompanyInfo = {
  name: 'MS360',
  email: 'contact@ms360.fr',
  phone: '+33 (0)1 XX XX XX XX',
  // ... autres informations
};
```

### Ajouter un Nouveau Logo

1. Placez le fichier logo dans `/public/`
2. Mettez à jour `companyConfig.ts` :

```typescript
logo: '/nouveau-logo-ms360.png',
```

### Personnaliser les Couleurs

Modifiez la section `branding` dans `companyConfig.ts` :

```typescript
branding: {
  primaryColor: '#1e40af',
  secondaryColor: '#0ea5e9',
  accentColor: '#22c55e',
  // ...
}
```

## Fonctionnalités Intégrées

### Emails
- Expéditeur : MS360
- Signature avec coordonnées MS360
- Templates personnalisés

### PDF
- En-tête avec logo MS360
- Pieds de page avec informations de contact
- Branding cohérent

### SEO
- Métadonnées optimisées pour MS360
- Données structurées JSON-LD
- Open Graph configuré

### Interface
- Logo MS360 dans header/footer
- Coordonnées de contact
- Liens vers le site ms360.fr

## Prochaines Étapes

1. **Logo Définitif** : Remplacer les logos placeholder par les vrais logos MS360
2. **Coordonnées** : Mettre à jour avec les vraies coordonnées (téléphone, adresse)
3. **Informations Légales** : Ajouter SIRET, TVA, RCS
4. **Favicon** : Créer et ajouter le favicon MS360
5. **Images** : Créer les images Open Graph définitives

## Support

Pour toute question sur l'intégration MS360, consultez les fichiers de configuration ou contactez l'équipe de développement.
