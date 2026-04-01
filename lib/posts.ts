export type Section = {
  type: "h2" | "h3" | "p" | "ul" | "tip";
  content: string | string[];
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  sections: Section[];
};

export const posts: Post[] = [
  {
    slug: "optimiser-fiche-google-my-business-2026",
    title: "Comment optimiser sa fiche Google My Business en 2026 (guide complet)",
    description: "Découvrez toutes les étapes pour optimiser votre fiche Google My Business et dominer le référencement local en 2026. Photos, horaires, avis, catégories : tout ce qu'il faut savoir.",
    date: "2026-03-20",
    category: "Optimisation GMB",
    readTime: "9 min",
    sections: [
      { type: "p", content: "Google My Business (désormais appelé Google Business Profile) est l'outil le plus puissant pour attirer des clients locaux. Une fiche bien optimisée apparaît en tête des résultats sur Google Maps et dans le pack local — ces 3 résultats mis en avant avant même les résultats organiques. Voici comment l'optimiser au maximum en 2026." },
      { type: "h2", content: "Pourquoi optimiser votre fiche Google My Business ?" },
      { type: "p", content: "46% des recherches Google ont une intention locale. Quand un client cherche 'restaurant bordeaux' ou 'plombier près de chez moi', c'est votre fiche GMB qui décide si vous apparaissez ou non. Une fiche complète reçoit en moyenne 7 fois plus de clics qu'une fiche incomplète." },
      { type: "h2", content: "1. Complétez 100% des informations de base" },
      { type: "p", content: "La première étape est de remplir chaque champ disponible : nom exact de l'entreprise, adresse précise, numéro de téléphone, site web, horaires d'ouverture (y compris les jours fériés). Google privilégie les fiches complètes dans ses algorithmes de classement local." },
      { type: "ul", content: ["Nom de l'entreprise : utilisez votre nom commercial exact, sans mots clés artificiels", "Adresse : vérifiez qu'elle correspond exactement à votre adresse réelle", "Téléphone : utilisez un numéro local (pas un 0800 ou numéro surtaxé)", "Horaires : mettez-les à jour pour les jours fériés et vacances", "Site web : liez vers votre page d'accueil ou une page locale dédiée"] },
      { type: "h2", content: "2. Choisissez les bonnes catégories" },
      { type: "p", content: "La catégorie principale est le signal le plus fort envoyé à Google. Choisissez la catégorie la plus précise possible. Si vous êtes pizzeria, sélectionnez 'Pizzeria' plutôt que 'Restaurant'. Vous pouvez ajouter jusqu'à 9 catégories secondaires — utilisez-les pour couvrir toutes vos activités." },
      { type: "tip", content: "Astuce : regardez les catégories utilisées par vos concurrents qui apparaissent en premier sur Google Maps. C'est souvent une indication des catégories les plus efficaces dans votre secteur." },
      { type: "h2", content: "3. Optimisez votre description d'entreprise" },
      { type: "p", content: "La description (750 caractères max) est votre chance d'expliquer ce qui vous différencie. Intégrez naturellement vos mots clés principaux : votre activité, votre ville, vos spécialités. Évitez le bourrage de mots clés — écrivez pour vos clients, pas pour l'algorithme." },
      { type: "h2", content: "4. Publiez des photos de qualité régulièrement" },
      { type: "p", content: "Les fiches avec photos reçoivent 42% de demandes d'itinéraires en plus et 35% de clics vers le site web supplémentaires. Publiez des photos de votre devanture, intérieur, équipe, produits et services. L'idéal est d'ajouter au moins une nouvelle photo par semaine — la fraîcheur du contenu est un facteur de classement." },
      { type: "ul", content: ["Photo de couverture : choisissez une image représentative et attrayante", "Logo : utilisez votre logo officiel en haute résolution", "Photos de l'établissement : extérieur, intérieur, ambiance", "Photos de produits/services : montrez ce que vous proposez", "Photos d'équipe : humanisez votre entreprise"] },
      { type: "h2", content: "5. Collectez et répondez à tous vos avis" },
      { type: "p", content: "Les avis Google sont le facteur numéro 1 du référencement local. Une note élevée et un grand nombre d'avis récents propulsent votre fiche en tête. Mais attention : Google surveille aussi la régularité. Obtenir 50 avis en une semaine puis rien pendant 6 mois est suspect." },
      { type: "p", content: "Répondez à tous les avis, positifs comme négatifs. Une réponse professionnelle à un avis négatif montre que vous prenez soin de vos clients et peut retourner l'image négative en démonstration de sérieux." },
      { type: "h2", content: "6. Utilisez les Google Posts régulièrement" },
      { type: "p", content: "Les Google Posts sont des mini-publications visibles directement sur votre fiche. Utilisez-les pour annoncer des promotions, événements, nouveaux produits ou actualités. Publiez au minimum 2 fois par mois pour signaler à Google que votre fiche est active." },
      { type: "h2", content: "7. Activez les messages et questions/réponses" },
      { type: "p", content: "La fonctionnalité de messagerie permet aux clients de vous contacter directement depuis Google. Activez-la et répondez rapidement — Google affiche votre temps de réponse moyen. La section Q&R permet aussi de pré-remplir les questions fréquentes : prenez le contrôle en posant vous-même les questions importantes et en y répondant." },
      { type: "h2", content: "Conclusion : l'optimisation GMB est un travail continu" },
      { type: "p", content: "L'algorithme local de Google récompense la régularité et la complétude. Une fiche optimisée une fois puis abandonnée perdra progressivement sa position. Utilisez un outil comme Klevano pour suivre votre score d'optimisation, recevoir des alertes sur les nouveaux avis et maintenir votre fiche au top sans y passer des heures chaque semaine." },
    ],
  },
  {
    slug: "obtenir-plus-avis-google-entreprise",
    title: "Comment obtenir plus d'avis Google pour votre entreprise (méthodes qui marchent)",
    description: "Les meilleures stratégies pour collecter plus d'avis Google 5 étoiles légalement et efficacement. Augmentez votre note et boostez votre visibilité locale.",
    date: "2026-03-25",
    category: "Collecte d'avis",
    readTime: "7 min",
    sections: [
      { type: "p", content: "Les avis Google sont la monnaie du référencement local. Une entreprise avec 200 avis à 4,7 étoiles écrase systématiquement un concurrent avec 20 avis à 5 étoiles. Mais comment obtenir plus d'avis sans violer les conditions d'utilisation de Google ? Voici les méthodes qui fonctionnent vraiment." },
      { type: "h2", content: "Pourquoi les avis Google sont-ils si importants ?" },
      { type: "p", content: "Google utilise 3 facteurs principaux pour le classement local : la pertinence (votre activité correspond-elle à la recherche ?), la distance, et la notoriété. Les avis clients constituent la principale mesure de notoriété. Plus vous avez d'avis récents et positifs, plus Google vous pousse en avant." },
      { type: "ul", content: ["93% des consommateurs lisent les avis avant de choisir un commerce local", "Un passage de 3,5 à 3,7 étoiles augmente les conversions de 120%", "Les entreprises avec plus de 100 avis ont 5x plus de clics que celles avec moins de 10 avis", "Les avis récents comptent plus que les anciens"] },
      { type: "h2", content: "1. Demandez au bon moment" },
      { type: "p", content: "Le timing est crucial. La meilleure fenêtre pour demander un avis est immédiatement après une expérience positive : à la fin d'un repas, après la livraison d'un service, lors du paiement. Plus vous attendez, moins le client est susceptible de laisser un avis." },
      { type: "tip", content: "La règle d'or : demandez en personne d'abord ('Avez-vous été satisfait ?'), puis envoyez le lien par SMS ou email dans les 2 heures qui suivent." },
      { type: "h2", content: "2. Simplifiez au maximum le processus" },
      { type: "p", content: "Chaque étape supplémentaire entre votre demande et l'avis publié divise par 2 votre taux de conversion. Créez un lien direct vers votre page d'avis Google et raccourcissez-le. Mieux encore, utilisez un QR code que vous placez sur vos tables, comptoirs, tickets de caisse ou packaging." },
      { type: "h2", content: "3. Utilisez un système de collecte intelligent" },
      { type: "p", content: "Les outils de collecte d'avis modernes comme Klevano permettent de filtrer les expériences : les clients satisfaits (4-5 étoiles) sont redirigés vers Google, tandis que les insatisfaits (1-3 étoiles) laissent un feedback privé que vous pouvez traiter en interne. Résultat : votre note Google monte, et vous évitez les mauvais avis publics." },
      { type: "h2", content: "4. Formez votre équipe" },
      { type: "p", content: "Vos employés sont vos meilleurs ambassadeurs. Formez-les à mentionner naturellement les avis dans leurs échanges avec les clients : 'Si vous avez été satisfait, un petit avis Google nous aiderait beaucoup.' Une phrase simple, non intrusive, dite avec sincérité, convertit souvent mieux qu'un email automatique." },
      { type: "h2", content: "5. Répondez à tous vos avis existants" },
      { type: "p", content: "Répondre aux avis (positifs et négatifs) montre aux futurs clients que vous êtes attentif et professionnel. Cela encourage aussi les clients satisfaits à laisser leur avis en voyant que vous y accordez de l'importance. Google prend également en compte l'engagement du propriétaire dans ses algorithmes." },
      { type: "h2", content: "Ce qu'il ne faut JAMAIS faire" },
      { type: "ul", content: ["Acheter des faux avis : Google les détecte et peut supprimer votre fiche", "Offrir des avantages en échange d'avis positifs : interdit par les CGU Google", "Demander à vos employés de laisser des avis : Google peut les supprimer", "Envoyer des centaines de demandes d'un coup : la régularité est préférable"] },
      { type: "h2", content: "Conclusion : la régularité avant tout" },
      { type: "p", content: "Obtenir 5 avis par mois de façon régulière vaut mieux que 50 avis en un mois puis rien. Mettez en place un système simple et reproductible : lien QR code à la caisse, email automatique post-achat, formation de votre équipe. Avec Klevano, ce processus est entièrement automatisé et filtré pour maximiser votre note." },
    ],
  },
  {
    slug: "erreurs-referencement-local-google",
    title: "Les 8 erreurs qui tuent votre référencement local sur Google",
    description: "Évitez ces erreurs critiques qui empêchent votre entreprise d'apparaître dans Google Maps et les résultats locaux. Guide pratique pour les commerces et artisans.",
    date: "2026-03-28",
    category: "Référencement local",
    readTime: "8 min",
    sections: [
      { type: "p", content: "Vous avez une fiche Google My Business mais votre entreprise n'apparaît pas dans les résultats locaux ? Vous êtes probablement en train de commettre une ou plusieurs de ces erreurs fatales. Le référencement local est un domaine précis avec ses propres règles — voici les pièges à éviter absolument." },
      { type: "h2", content: "Erreur #1 : Informations incohérentes (NAP)" },
      { type: "p", content: "Le NAP (Name, Address, Phone) doit être exactement identique partout sur le web : votre fiche GMB, votre site web, les annuaires, les réseaux sociaux. Si votre adresse s'écrit '15 rue de la Paix' sur Google et '15, Rue de la Paix' sur votre site, Google considère que ce sont deux entités différentes et pénalise votre classement." },
      { type: "tip", content: "Vérifiez vos informations sur les principaux annuaires : Pages Jaunes, Yelp, TripAdvisor, Foursquare. La cohérence est un signal de confiance fort pour Google." },
      { type: "h2", content: "Erreur #2 : Fiche non vérifiée" },
      { type: "p", content: "Une fiche non vérifiée a très peu de chance d'apparaître dans le pack local. La vérification (par courrier, téléphone ou vidéo) prouve à Google que vous êtes bien le propriétaire de l'établissement. C'est la première chose à faire avant toute optimisation." },
      { type: "h2", content: "Erreur #3 : Catégorie principale mal choisie" },
      { type: "p", content: "La catégorie principale est le signal le plus fort que vous envoyez à Google. Choisir 'Commerce de détail' quand vous êtes 'Boulangerie artisanale' vous fait perdre des positions sur toutes les recherches spécifiques. Soyez précis." },
      { type: "h2", content: "Erreur #4 : Aucune photo ou photos de mauvaise qualité" },
      { type: "p", content: "Les fiches sans photos ou avec des photos floues et démodées inspirent peu confiance. Google favorise les fiches avec des photos récentes et nombreuses. Une photo de 2015 de votre devanture ne suffit pas — publiez du contenu visuel frais régulièrement." },
      { type: "h2", content: "Erreur #5 : Ignorer les avis négatifs" },
      { type: "p", content: "Ne pas répondre aux avis négatifs est une double erreur. D'abord, ça donne l'impression aux futurs clients que vous vous en fichez. Ensuite, une réponse professionnelle peut transformer un avis négatif en démonstration de votre sérieux. Répondez toujours dans les 48h." },
      { type: "h2", content: "Erreur #6 : Horaires incorrects ou non mis à jour" },
      { type: "p", content: "Si un client se déplace suite à vos horaires Google et trouve votre établissement fermé, c'est une expérience négative qui génère souvent un avis 1 étoile. Mettez à jour vos horaires pour chaque jour férié, congés annuels et événements spéciaux." },
      { type: "h2", content: "Erreur #7 : Pas de Google Posts" },
      { type: "p", content: "Les Google Posts signalent à l'algorithme que votre fiche est active et maintenue. Une fiche sans publication depuis 3 mois est considérée comme 'inactive'. Publiez au moins 2 fois par mois : promotions, actualités, nouveaux produits, événements." },
      { type: "h2", content: "Erreur #8 : Mots clés dans le nom d'entreprise" },
      { type: "p", content: "Ajouter des mots clés dans votre nom Google My Business ('Plombier Paris - Jean Dupont') est une violation des conditions d'utilisation de Google. Non seulement votre fiche risque d'être suspendue, mais Google le détecte de plus en plus facilement. Utilisez votre vrai nom commercial." },
      { type: "h2", content: "Comment éviter toutes ces erreurs d'un coup ?" },
      { type: "p", content: "Klevano analyse automatiquement votre fiche GMB et identifie toutes ces erreurs via son système de scoring en 8 points. Vous recevez une liste d'actions prioritaires avec des explications claires. Plus besoin de deviner — vous savez exactement quoi corriger pour progresser dans les classements locaux." },
    ],
  },
  {
    slug: "referencement-local-restaurant-commerce",
    title: "Référencement local pour restaurants et commerces : le guide 2026",
    description: "Guide complet du référencement local pour restaurants, cafés, boutiques et artisans. Comment apparaître en premier sur Google Maps et attirer plus de clients locaux.",
    date: "2026-04-01",
    category: "Référencement local",
    readTime: "10 min",
    sections: [
      { type: "p", content: "Le référencement local est devenu la priorité numéro 1 pour les commerces de proximité. Avec 76% des recherches mobiles 'près de chez moi' qui aboutissent à une visite en magasin dans les 24h, apparaître en tête de Google Maps peut littéralement transformer votre activité." },
      { type: "h2", content: "Qu'est-ce que le référencement local ?" },
      { type: "p", content: "Le référencement local (ou SEO local) désigne l'ensemble des techniques pour apparaître dans les résultats de recherche géolocalisés. Il comprend le pack local (les 3 établissements mis en avant avec carte), Google Maps, et les résultats organiques avec indication géographique." },
      { type: "h2", content: "Les 3 facteurs de classement local selon Google" },
      { type: "ul", content: ["Pertinence : votre activité correspond-elle à ce que l'utilisateur cherche ?", "Distance : êtes-vous géographiquement proche de l'utilisateur ?", "Notoriété : êtes-vous reconnu comme un acteur fiable dans votre secteur ?"] },
      { type: "p", content: "La pertinence et la notoriété sont les deux leviers sur lesquels vous pouvez agir. La distance dépend de votre localisation géographique — vous ne pouvez pas la changer, mais vous pouvez compenser en étant excellent sur les deux autres facteurs." },
      { type: "h2", content: "Stratégie pour les restaurants" },
      { type: "p", content: "Pour un restaurant, les recherches clés sont : '[type de cuisine] [ville]', 'restaurant pas cher [quartier]', 'restaurant ouvert maintenant [ville]'. Votre fiche GMB doit mentionner votre cuisine, votre quartier, vos spécialités dans la description et les catégories." },
      { type: "ul", content: ["Publiez des photos de vos plats chaque semaine", "Répondez à chaque avis, surtout les négatifs", "Utilisez l'attribut 'Menu' pour lister vos plats directement sur GMB", "Activez la réservation en ligne via Google (Reserve with Google)", "Publiez vos événements spéciaux (soirées, menus du jour) via Google Posts"] },
      { type: "h2", content: "Stratégie pour les commerces et boutiques" },
      { type: "p", content: "Pour un commerce, les recherches sont : '[produit] [ville]', '[type de boutique] près de moi', 'magasin [produit] ouvert dimanche'. Votre fiche doit clairement indiquer vos produits, vos marques et vos services." },
      { type: "ul", content: ["Ajoutez votre catalogue produits sur GMB (fonction Produits)", "Précisez si vous proposez click & collect, livraison ou retrait en magasin", "Utilisez les attributs : paiement CB, parking, accès PMR...", "Publiez des promotions via Google Posts", "Encouragez les avis avec mention de vos produits spécifiques"] },
      { type: "h2", content: "Stratégie pour les artisans et professions libérales" },
      { type: "p", content: "Pour un artisan (plombier, électricien, coiffeur...) ou professionnel libéral (médecin, avocat...), les recherches sont souvent urgentes : '[métier] [ville] urgent', '[métier] disponible maintenant'. La réactivité et les avis récents sont primordiaux." },
      { type: "ul", content: ["Activez la messagerie Google pour les demandes urgentes", "Mentionnez votre zone d'intervention dans la description", "Mettez en avant vos certifications et qualifications", "Répondez aux devis Google (disponible pour certains secteurs)", "Publiez des photos de vos réalisations récentes"] },
      { type: "h2", content: "L'importance des avis pour le référencement local" },
      { type: "p", content: "Les avis sont le carburant du référencement local. Google Mapsaffiche en premier les établissements avec le plus d'avis récents et la meilleure note. Un commerce avec 150 avis à 4,6 étoiles battra presque toujours un concurrent à 5 étoiles avec 8 avis." },
      { type: "tip", content: "Objectif minimum : 50 avis avec une note supérieure à 4,3/5 pour commencer à apparaître systématiquement dans le pack local de votre ville." },
      { type: "h2", content: "Mesurer et améliorer votre référencement local" },
      { type: "p", content: "Google My Business fournit des statistiques précieuses : nombre de recherches, d'appels, de demandes d'itinéraires, de clics vers votre site. Suivez ces métriques chaque mois pour mesurer l'impact de vos actions. Avec Klevano, vous disposez d'un tableau de bord qui centralise toutes ces données et vous suggère les actions prioritaires pour progresser." },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
