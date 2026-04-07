# Templates Cold Email — Klevano
## Séquence de 3 emails pour prospecter les commerces locaux

---

## CONTEXTE D'UTILISATION

**Cible :** Gérants de commerces locaux (restaurants, coiffeurs, artisans, médecins, commerces de proximité)
**Outil d'envoi :** Brevo (gratuit jusqu'à 300 emails/jour) — brevo.com
**Délai entre emails :** J0 → J3 → J7
**Objet à tester en A/B :** Varie l'objet du mail 1 pour optimiser le taux d'ouverture

---

## EMAIL 1 — Premier contact (J0)

**Objet A :** Votre fiche Google, {{Prénom}} — j'ai remarqué quelque chose
**Objet B :** {{NomEtablissement}} : votre note Google peut faire mieux
**Objet C :** Une question rapide sur votre visibilité Google

---

Bonjour {{Prénom}},

J'ai regardé la fiche Google de {{NomEtablissement}} et j'ai remarqué que vous avez {{NombreAvis}} avis — c'est un bon départ, mais vos concurrents directs dans {{Ville}} en ont souvent 2 à 3 fois plus.

En pratique, ça veut dire que quand quelqu'un cherche "{{TypeEtablissement}} {{Ville}}" sur Google, vous apparaissez peut-être en 4e ou 5e position — derrière des établissements qui ne sont pas forcément meilleurs que vous.

Klevano automatise exactement ça : collecte d'avis, optimisation de la fiche, suivi de votre classement. Nos clients gagnent en moyenne 2 positions sur Google Maps en 60 jours.

Est-ce que ça vous intéresse de voir ce que ça donnerait pour {{NomEtablissement}} ? Je peux vous montrer un audit gratuit en 15 minutes cette semaine.

Bonne journée,
Thomas
Klevano — klevano.com

PS : Si vous n'êtes pas la bonne personne pour ça, pas de problème — dites-moi vers qui m'orienter !

---

## EMAIL 2 — Relance valeur (J3)

**Objet :** (suite) {{NomEtablissement}} + une ressource utile

---

Bonjour {{Prénom}},

Je me permets de revenir vers vous — je comprends que vous êtes occupé.

En attendant, j'ai fait un audit rapide de votre fiche Google My Business. Voilà ce que j'ai trouvé :

✓ Fiche vérifiée : OK
⚠ Nombre d'avis : {{NombreAvis}} (la moyenne dans votre secteur à {{Ville}} est de ~{{MoyenneAvisSecteur}})
⚠ Dernière publication Google Post : il y a plus de 30 jours (Google pénalise les fiches inactives)
⚠ Réponses aux avis : {{PourcentageReponses}}% de taux de réponse

Ces 3 points expliquent probablement pourquoi vous n'apparaissez pas systématiquement en tête sur Google Maps.

Klevano corrige tout ça automatiquement. 14 jours d'essai gratuit, sans carte bancaire.

→ Voir l'offre : klevano.com/#pricing

À votre disposition si vous avez des questions,
Thomas

---

## EMAIL 3 — Dernière relance + urgence douce (J7)

**Objet :** Dernière nouvelle de ma part, {{Prénom}}

---

Bonjour {{Prénom}},

C'est mon dernier email — je ne veux pas encombrer votre boîte mail.

Je voulais juste vous laisser une ressource utile avant de partir : un guide gratuit sur les 5 erreurs les plus courantes sur Google My Business dans le secteur {{TypeEtablissement}}.

→ klevano.com/blog/erreurs-referencement-local-google

Si un jour vous cherchez à améliorer votre visibilité locale sur Google, Klevano peut vous aider. On a des offres à partir de 99€/mois et un essai gratuit de 14 jours.

Bonne continuation à vous et à {{NomEtablissement}},
Thomas — Klevano

PS : Si ce n'est pas le bon moment, pas de problème. Gardez ce mail de côté — il sera toujours là quand vous en aurez besoin.

---

## GUIDE DE PERSONNALISATION

### Variables à remplir
| Variable | Comment trouver |
|----------|----------------|
| {{Prénom}} | LinkedIn, site web, Google |
| {{NomEtablissement}} | Fiche Google |
| {{Ville}} | Fiche Google |
| {{TypeEtablissement}} | Catégorie Google (restaurant, coiffeur...) |
| {{NombreAvis}} | Fiche Google publique |
| {{MoyenneAvisSecteur}} | Regarder les 5 premiers concurrents sur Maps |
| {{PourcentageReponses}} | Compter manuellement sur la fiche (ou estimer) |

### Paramétrage Brevo
1. Créer un compte sur brevo.com (gratuit jusqu'à 300 emails/jour)
2. Importer votre CSV de prospects (exporté par le script scraper)
3. Créer une "Campaign" de type "Automation"
4. Configurer la séquence J0 → J3 → J7
5. Stop automatique si le contact répond

### Taux de réponse attendus
- Email 1 : 3-8% de taux de réponse directe
- Email 2 : +2-4% supplémentaires
- Email 3 : +1-2% supplémentaires
- **Total séquence : 6-14% de taux de réponse** (très bon pour du cold email B2B local)

### Segments prioritaires (ordre d'envoi)
1. Restaurants / cafés (fort besoin, souvent peu réactifs sur GMB)
2. Coiffeurs / instituts de beauté (très concurrentiel localement)
3. Artisans (plombiers, électriciens) — urgence = moteur de recherche local
4. Commerces de proximité (boulangeries, épiceries)
5. Professionnels libéraux (médecins, kinés, dentistes)
