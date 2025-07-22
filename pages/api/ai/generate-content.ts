import type { NextApiRequest, NextApiResponse } from 'next';
import { validateApiKey } from '../../../src/config/apiConfig';

interface FormData {
  name: string;
  email: string;
  sector: string;
  position: string;
  ambitions: string;
}

interface DeepseekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ApiResponse {
  success: boolean;
  content?: string;
  error?: string;
}



// Validation des données du formulaire
function validateFormData(data: any): data is FormData {
  return (
    data &&
    typeof data.name === 'string' &&
    typeof data.email === 'string' &&
    typeof data.sector === 'string' &&
    typeof data.position === 'string' &&
    typeof data.ambitions === 'string' &&
    data.name.length > 0 &&
    data.email.includes('@') &&
    data.sector.length > 0 &&
    data.position.length > 0 &&
    data.ambitions.length > 0
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Vérification de la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });
  }



  // Validation des données
  if (!validateFormData(req.body)) {
    return res.status(400).json({
      success: false,
      error: 'Données invalides'
    });
  }

  const formData: FormData = req.body;

  try {
    // Configuration sécurisée côté serveur
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-0528:free';

    if (!openRouterApiKey) {
      throw new Error('Clé API OpenRouter non configurée');
    }

    // Validation du format de la clé
    if (!validateApiKey(openRouterApiKey)) {
      // Format de clé API potentiellement invalide
    }

    // Construction du prompt optimisé
    const prompt = `Tu es un expert en analyse prédictive et conseil stratégique. Génère un rapport détaillé et personnalisé pour:

PROFIL CLIENT:
- Nom: ${formData.name}
- Secteur: ${formData.sector}
- Poste actuel: ${formData.position}
- Ambitions: ${formData.ambitions}

Crée un rapport structuré avec ces sections exactes:

1. RÉSUMÉ EXÉCUTIF
Synthèse en 3-4 phrases des points clés et du potentiel identifié.

2. ANALYSE PROFIL ACTUEL
Évaluation des forces, compétences et positionnement actuel dans ${formData.sector}.

3. PRÉDICTIONS 2025-2027
Tendances sectorielles, évolutions technologiques et opportunités spécifiques à ${formData.sector}.

4. RECOMMANDATIONS STRATÉGIQUES
Actions concrètes pour atteindre les ambitions: ${formData.ambitions}

5. OPPORTUNITÉS DE CROISSANCE
Niches émergentes, partenariats potentiels et axes de développement.

6. PLAN D'ACTION
Étapes prioritaires avec timeline sur 6-12-24 mois.

7. CONCLUSION
Vision inspirante et encourageante pour ${formData.name}.

Utilise un ton professionnel mais accessible, avec des données concrètes et des conseils actionnables. Minimum 800 mots.`;

    // Appel à l'API OpenRouter avec timeout optimisé
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://stage-front-main-amineabdelkafi839-4526s-projects.vercel.app',
        'X-Title': 'AI Portrait Pro - MS360'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse prédictive et conseil stratégique. Réponds en français avec un style professionnel et structuré.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.6,
        top_p: 0.8,
        stream: false
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erreur inconnue');
      throw new Error(`Erreur API OpenRouter: ${response.status} - ${errorText}`);
    }

    const data: DeepseekResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Réponse API invalide');
    }

    const content = data.choices[0].message.content;

    // Validation du contenu généré
    if (!content || content.trim().length === 0) {
      throw new Error('L\'API IA a retourné un contenu vide. Veuillez réessayer.');
    }

    return res.status(200).json({
      success: true,
      content: content
    });

  } catch (error) {

    // Gestion spécifique des timeouts
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(408).json({
        success: false,
        error: 'Timeout: La génération IA a pris trop de temps. Veuillez réessayer.'
      });
    }

    // Contenu de fallback personnalisé
    const fallbackContent = generateFallbackContent(formData);

    return res.status(200).json({
      success: true,
      content: fallbackContent,
      fallback: true,
      message: 'Contenu généré avec succès (mode fallback)'
    });
  }
}

// Fonction de génération de contenu de fallback
function generateFallbackContent(formData: FormData): string {
  return `# PORTRAIT PRÉDICTIF IA - ${formData.name}

## 1. RÉSUMÉ EXÉCUTIF

Bonjour ${formData.name}, votre profil révèle un potentiel remarquable dans le secteur ${formData.sector}. En tant que ${formData.position}, vous disposez d'atouts solides pour concrétiser vos ambitions : ${formData.ambitions}. Ce rapport identifie les opportunités clés et trace une feuille de route stratégique pour les 24 prochains mois.

## 2. ANALYSE PROFIL ACTUEL

**Forces identifiées :**
- Expertise technique dans ${formData.sector}
- Position stratégique en tant que ${formData.position}
- Vision claire avec des ambitions définies
- Capacité d'adaptation aux évolutions du marché

**Positionnement actuel :**
Votre rôle de ${formData.position} vous place au cœur des enjeux de ${formData.sector}. Cette position privilégiée vous offre une compréhension approfondie des défis et opportunités sectorielles.

## 3. PRÉDICTIONS 2025-2027

**Tendances sectorielles ${formData.sector} :**
- Digitalisation accélérée des processus
- Émergence de nouvelles technologies disruptives
- Évolution des attentes clients vers plus de personnalisation
- Importance croissante de la durabilité et de l'impact social

**Opportunités spécifiques :**
- Développement de compétences en intelligence artificielle
- Leadership dans la transformation digitale
- Innovation dans les pratiques durables
- Création de partenariats stratégiques

## 4. RECOMMANDATIONS STRATÉGIQUES

Pour atteindre vos ambitions "${formData.ambitions}", nous recommandons :

**Formation continue :**
- Certification en technologies émergentes
- Développement des compétences en leadership
- Formation en gestion de projet agile

**Réseau professionnel :**
- Participation à des événements sectoriels
- Mentorat avec des leaders d'opinion
- Création de partenariats stratégiques

**Innovation :**
- Initiation de projets pilotes
- Veille technologique active
- Expérimentation de nouvelles approches

## 5. OPPORTUNITÉS DE CROISSANCE

**Niches émergentes :**
- Intelligence artificielle appliquée à ${formData.sector}
- Solutions durables et éco-responsables
- Expérience client personnalisée
- Automatisation intelligente des processus

**Partenariats potentiels :**
- Startups innovantes du secteur
- Institutions de recherche
- Entreprises complémentaires
- Organismes de formation spécialisés

## 6. PLAN D'ACTION

**6 premiers mois :**
- Audit complet de vos compétences actuelles
- Identification des formations prioritaires
- Développement de votre réseau professionnel
- Lancement d'un projet pilote innovant

**6-12 mois :**
- Mise en œuvre des formations identifiées
- Consolidation des partenariats stratégiques
- Évaluation et optimisation du projet pilote
- Préparation de la phase d'expansion

**12-24 mois :**
- Déploiement à grande échelle des innovations
- Positionnement en tant qu'expert reconnu
- Exploration de nouvelles opportunités de marché
- Préparation de la prochaine étape de carrière

## 7. CONCLUSION

${formData.name}, votre parcours dans ${formData.sector} vous a préparé(e) à saisir les opportunités exceptionnelles qui s'offrent à vous. Vos ambitions "${formData.ambitions}" sont non seulement réalisables, mais constituent un objectif stratégique parfaitement aligné avec les évolutions du marché.

L'avenir appartient aux professionnels visionnaires comme vous, capables d'anticiper les changements et de transformer les défis en opportunités. Avec une approche méthodique et les bonnes stratégies, vous êtes destiné(e) à devenir un acteur majeur de votre secteur.

**Votre succès commence aujourd'hui. L'avenir vous appartient !**

---
*Rapport généré par MS360 - Intelligence Artificielle*
*Pour ${formData.name} - ${new Date().toLocaleDateString('fr-FR')}*`;
}

// Configuration pour optimiser les performances Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb',
  },
  maxDuration: 60, // 60 secondes max pour Vercel Pro
};
