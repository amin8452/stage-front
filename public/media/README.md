# Dossier Media - MS360

Ce dossier contient les fichiers média pour le site MS360.

## Vidéos

### Vidéo de démonstration
- **Nom du fichier**: `demo-video.mp4`
- **Description**: Vidéo principale de démonstration de la solution MS360
- **Formats supportés**: MP4, WebM, MOV
- **Résolution recommandée**: 1920x1080 (16:9)
- **Durée recommandée**: 2-5 minutes

### Poster de la vidéo
- **Nom du fichier**: `video-poster.jpg`
- **Description**: Image d'aperçu affichée avant le lancement de la vidéo
- **Format**: JPG ou PNG
- **Résolution**: 1920x1080 (16:9)

## Comment ajouter une vidéo

1. Placez votre fichier vidéo dans ce dossier avec le nom `demo-video.mp4`
2. Ajoutez une image d'aperçu avec le nom `video-poster.jpg`
3. La vidéo sera automatiquement affichée dans la section vidéo du site

## Notes techniques

- Les fichiers dans le dossier `public/media/` sont accessibles via l'URL `/media/`
- La vidéo est configurée pour être muette par défaut (autoplay policy)
- Les contrôles vidéo apparaissent au survol
- La vidéo supporte le mode plein écran

## Exemple de structure

```
public/media/
├── demo-video.mp4      (votre vidéo de démonstration)
├── video-poster.jpg    (image d'aperçu)
└── README.md          (ce fichier)
```
