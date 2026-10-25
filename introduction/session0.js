/* Version étudiante : contenu projeté uniquement. */
const INTRO_SLIDES = [
  {
    "id": "accueil",
    "title": "0. Introduction à la macroéconomie",
    "kind": "cover",
    "part": "Bienvenue",
    "html": "<div class=\"cover-label\">Macroéconomie L3</div><h1>0. Introduction à la macroéconomie</h1><p class=\"cover-author\">Arnaud Dyèvre · HEC Paris</p><p class=\"cover-term\">Automne 2026</p>"
  },
  {
    "id": "arnaud",
    "title": "Quelques mots sur moi",
    "part": "Bienvenue",
    "html": "<div class=\"intro-name\"><p class=\"lead\">Arnaud Dyèvre</p><p class=\"sub\"><a href=\"mailto:dyevre@hec.fr\">dyevre@hec.fr</a></p><p class=\"sub\"><a href=\"https://www.arnauddyevre.com/\" target=\"_blank\" rel=\"noopener noreferrer\">arnauddyevre.com</a> · Pour prendre rendez-vous avec moi.</p><p>Appelez-moi Arnaud.</p></div><div class=\"cards c2\"><div class=\"card blue\"><p><strong>Professeur à HEC Paris depuis septembre 2025.</strong></p><p>Doctorat à la LSE ; postdoctorat au MIT.</p><p>Macroéconomie et économie publique.<br>Innovation et croissance.</p></div><div class=\"card blue\"><h2>Mes projets actuels</h2><ul><li>L’IA et son impact sur l’innovation.</li><li>Le rôle du financement public de la R&amp;D.</li><li>L’impact des acquisitions d’entreprises sur l’innovation.</li></ul></div></div>"
  },
  {
    "id": "vous",
    "title": "Quelques mots sur vous",
    "part": "Bienvenue",
    "html": "<ol class=\"questions\"><li>Votre prénom</li><li>Votre formation jusqu’à présent</li><li>Votre projet professionnel après HEC</li></ol>"
  },
  {
    "id": "organisation",
    "title": "Notre cours cet automne",
    "part": "Le cours",
    "html": "<div class=\"key-numbers\"><div><strong>12</strong><span>séances de 1 h 30</span></div><div><strong>18 h</strong><span>par groupe</span></div><div><strong>5</strong><span>chapitres</span></div><div><strong>6</strong><span>semaines</span></div></div><p class=\"center lead-small\">Du 26 octobre au 8 décembre 2026 · En français</p><p class=\"center\">FR05 · FR01 · FR02</p><p class=\"sub center\">Le calendrier du syllabus fait référence pour les dates de votre groupe.</p>"
  },
  {
    "id": "calendrier",
    "title": "Calendrier des séances et des quiz",
    "part": "Le cours",
    "html": "<p class=\"cal-groups\"><span><b>FR05</b>13 h–14 h 30</span><span><b>FR01</b>14 h 40–16 h 10</span><span><b>FR02</b>9 h 40–11 h 10</span></p><table class=\"cal\"><thead><tr><th class=\"n\">Séance</th><th>FR05 · FR01</th><th>FR02</th><th class=\"ch\">Chapitre</th><th>Thème</th><th class=\"q\">Quiz</th></tr></thead><tbody><tr><td class=\"n\">1</td><td class=\"date\">26 oct.</td><td class=\"date\">27 oct.</td><td class=\"ch\" rowspan=\"2\">1</td><td>Mesurer l’activité : PIB, valeur ajoutée, nominal et réel.</td><td class=\"q\"></td></tr><tr><td class=\"n\">2</td><td class=\"date\">28 oct.</td><td class=\"date\">29 oct.</td><td>Niveau de vie, productivité, limites du PIB et environnement.</td><td class=\"q\"></td></tr><tr class=\"group-start\"><td class=\"n\">3</td><td class=\"date\">2 nov.</td><td class=\"date\">5 nov.</td><td class=\"ch\" rowspan=\"3\">2</td><td>Richesse des nations : capital, travail et productivité.</td><td class=\"q\"></td></tr><tr class=\"quiz\"><td class=\"n\">4</td><td class=\"date\">4 nov.</td><td class=\"date\">10 nov.</td><td>Accumulation, rendements décroissants et convergence.</td><td class=\"q\"><span class=\"quiz-tag\">Quiz 1</span></td></tr><tr><td class=\"n\">5</td><td class=\"date\">9 nov.</td><td class=\"date\">12 nov.</td><td>Innovation, investissement et gains de productivité liés à l’IA.</td><td class=\"q\"></td></tr><tr class=\"group-start\"><td class=\"n\">6</td><td class=\"date\">16 nov.</td><td class=\"date\">17 nov.</td><td class=\"ch\" rowspan=\"2\">3</td><td>Emploi, chômage et effets de la productivité sur la demande de travail.</td><td class=\"q\"></td></tr><tr><td class=\"n\">7</td><td class=\"date\">18 nov.</td><td class=\"date\">19 nov.</td><td>Tâches, automatisation et IA : scénarios et exercices.</td><td class=\"q\"></td></tr><tr class=\"group-start quiz\"><td class=\"n\">8</td><td class=\"date\">23 nov.</td><td class=\"date\">24 nov.</td><td class=\"ch\" rowspan=\"2\">4</td><td>Demande globale et multiplicateur budgétaire.</td><td class=\"q\"><span class=\"quiz-tag\">Quiz 2</span></td></tr><tr><td class=\"n\">9</td><td class=\"date\">25 nov.</td><td class=\"date\">26 nov.</td><td>Stabilisateurs, austérité et dynamique de la dette.</td><td class=\"q\"></td></tr><tr class=\"group-start\"><td class=\"n\">10</td><td class=\"date\">30 nov.</td><td class=\"date\">1<sup>er</sup> déc.</td><td class=\"ch\" rowspan=\"2\">5</td><td>Banques, bilans et création monétaire.</td><td class=\"q\"></td></tr><tr class=\"quiz\"><td class=\"n\">11</td><td class=\"date\">2 déc.</td><td class=\"date\">3 déc.</td><td>Inflation et transmission de la politique monétaire.</td><td class=\"q\"><span class=\"quiz-tag\">Quiz 3</span></td></tr><tr class=\"group-start\"><td class=\"n\">12</td><td class=\"date\">7 déc.</td><td class=\"date\">8 déc.</td><td class=\"ch\" rowspan=\"1\">1 à 5</td><td>Synthèse, exercices transversaux et préparation à l’examen.</td><td class=\"q\"></td></tr></tbody></table><p class=\"sub small\"><span class=\"nw\">Quiz sur papier de 15 minutes, pendant la séance.</span> <span class=\"nw\">Thèmes ajustables au rythme des groupes.</span> <span class=\"nw\">Salles : emploi du temps HEC.</span> <span class=\"nw\">Examen final : date à préciser.</span></p>"
  },
  {
    "id": "programme",
    "title": "Cinq questions pour le semestre",
    "part": "Le cours",
    "html": "<div class=\"plan\"><div class=\"plan-row\"><span class=\"n\">1</span><span class=\"q\">Mesurer la richesse nationale<small>Que produit-on ? À quels prix ? Pour qui ?</small></span></div><div class=\"plan-row\"><span class=\"n\">2</span><span class=\"q\">Comprendre la richesse des nations<small>Pourquoi certains pays sont-ils plus riches ?</small></span></div><div class=\"plan-row\"><span class=\"n\">3</span><span class=\"q\">Emploi, tâches et intelligence artificielle<small>Comment l’IA transforme-t-elle le travail ?</small></span></div><div class=\"plan-row\"><span class=\"n\">4</span><span class=\"q\">Politique budgétaire et dette publique<small>Que peuvent faire les pouvoirs publics ?</small></span></div><div class=\"plan-row\"><span class=\"n\">5</span><span class=\"q\">Monnaie, inflation et politique monétaire<small>Comment la monnaie et les taux agissent-ils ?</small></span></div></div>"
  },
  {
    "id": "evaluation",
    "title": "Comment serez-vous évalués ?",
    "part": "Le cours",
    "html": "<div class=\"cards c2\"><div class=\"card blue\"><p class=\"label\">Au fil du cours</p><p class=\"big\">3 quiz</p><ul><li>Sur papier · 15 minutes chacun.</li><li>Séances 4, 8 et 11.</li><li>10 % chacun : <em>30 % au total.</em></li><li>Les quiz manqués sont notés zéro.</li></ul></div><div class=\"card blue\"><p class=\"label\">Examen final</p><p class=\"big\">2 heures</p><ul><li>Sur papier.</li><li><em>70 % de la note finale.</em></li><li>L’utilisation de feuilles de rappel (<i>cheat sheet</i>) n’est pas autorisée.</li></ul></div></div><p class=\"sub\"><strong>Questions présentes dans les quiz :</strong> QCM, calculs et raisonnements sur graphiques.</p><p class=\"sub\"><strong>Questions présentes dans l’examen final :</strong> QCM, calculs, raisonnements sur graphiques, questions de synthèse et questions sur document.</p>"
  },
  {
    "id": "en-classe",
    "title": "Pour bien travailler ensemble",
    "part": "Le cours",
    "html": "<ul class=\"list\"><li>Arrivez à l’heure.</li><li>Posez des questions et participez.</li><li>Pas d’ordinateurs en classe.</li><li>Prenez des notes, notamment pendant les calculs au tableau.</li></ul><p class=\"note\">Les supports HTML et PDF serviront à préparer, annoter et réviser le cours.</p>"
  },
  {
    "id": "presence",
    "title": "Présence et émargement",
    "part": "Le cours",
    "html": "<div class=\"cards c2\"><div class=\"card blue\"><p class=\"lead-small\">Deux absences au maximum sur l’ensemble du cours.</p><p>Ce quota inclut les raisons médicales, personnelles et autres.</p><p>La troisième absence entraîne l’abandon du cours.</p></div><div class=\"card\"><p class=\"label\">SoWeSign</p><ol><li>Ouvrez l’application SWS.</li><li>Connectez-vous avec votre compte HEC.</li><li>Scannez le QR code affiché en classe.</li><li>Signez votre présence.</li></ol></div></div><p class=\"sub\">En cas de difficulté technique, signalez-le pendant la séance.</p>"
  },
  {
    "id": "demarche",
    "title": "Comment aborder ce cours ?",
    "part": "Le cours",
    "html": "<div class=\"cards c3\"><div class=\"card\"><h2>Curiosité</h2><p>Accepter les résultats qui surprennent.<br>Demander d’où ils viennent.</p></div><div class=\"card\"><h2>Fondations</h2><p>Soigner les définitions.<br>Refaire les raisonnements et les calculs.</p></div><div class=\"card\"><h2>Esprit critique</h2><p>Examiner les hypothèses et les données.<br>Ne pas confondre autorité et démonstration.</p></div></div><p class=\"note\">Votre parcours et votre point de vue ont leur place dans la discussion.</p>"
  },
  {
    "id": "macro-definition",
    "title": "Qu’est-ce que la macroéconomie ?",
    "part": "La macroéconomie",
    "html": "<p class=\"lead\">L’étude de l’économie dans son ensemble.</p><p>Une région, un pays, le monde.</p><div class=\"tags\"><span>Production</span><span>Emploi</span><span>Prix</span><span>Croissance</span><span>Politiques publiques</span></div><p class=\"note\">Les décisions des ménages, des entreprises et des pouvoirs publics interagissent.</p>"
  },
  {
    "id": "modeles-donnees",
    "title": "Des données et des modèles",
    "part": "La macroéconomie",
    "html": "<div class=\"cards c2\"><div class=\"card blue\"><p class=\"label\">Les données</p><p class=\"lead-small\">Que se passe-t-il ?</p><ul><li>Mesurer et comparer.</li><li>Repérer les évolutions.</li><li>Évaluer les explications.</li></ul></div><div class=\"card blue\"><p class=\"label\">Les modèles</p><p class=\"lead-small\">Par quels mécanismes ?</p><ul><li>Préciser les hypothèses.</li><li>Relier des variables.</li><li>En déduire des conséquences.</li></ul></div></div><p class=\"note\">Un modèle simplifie la réalité pour rendre un raisonnement explicite.</p>"
  },
  {
    "id": "equilibre-general",
    "title": "Des marchés reliés entre eux",
    "part": "La macroéconomie",
    "html": "<p class=\"lead-small\">Équilibre général : l’équilibre simultané de plusieurs marchés.</p><p>Une décision peut avoir des effets ailleurs dans l’économie.</p><div class=\"flow\" aria-label=\"Exemple de mécanisme : demande, prix, taux, crédit et demande\"><div>Demande<br>plus forte</div><b>→</b><div>Pressions<br>sur les prix</div><b>→</b><div>Réaction possible<br>des taux</div><b>→</b><div>Crédit<br>et demande</div></div><p class=\"sub\">Un mécanisme possible, dont le sens et l’ampleur dépendent des hypothèses.</p>"
  },
  {
    "id": "pour-vous",
    "title": "Pourquoi la macroéconomie vous concerne",
    "part": "À quoi cela sert-il ?",
    "html": "<ul class=\"list\"><li>Acheter ou louer un logement ?</li><li>Dépenser aujourd’hui ou épargner ?</li><li>Comprendre l’évolution des inégalités ?</li><li>Entrer sur quel marché du travail ?</li><li>Comment l’IA transformera-t-elle les tâches et les métiers ?</li></ul>"
  },
  {
    "id": "finance",
    "title": "Comprendre les marchés financiers",
    "part": "À quoi cela sert-il ?",
    "html": "<div class=\"cards c3\"><div class=\"card\"><h2>Croissance</h2><p>Ventes attendues.<br>Profits et risques.</p></div><div class=\"card\"><h2>Inflation</h2><p>Pouvoir d’achat des revenus.<br>Rendements réels.</p></div><div class=\"card\"><h2>Taux d’intérêt</h2><p>Coût du financement.<br>Valeur des revenus futurs.</p></div></div><p class=\"note\">Lire un prix de marché suppose de comprendre des anticipations.</p><p class=\"sub\">Crédit, liquidité et risques internationaux comptent aussi.</p>"
  },
  {
    "id": "politiques",
    "title": "Comprendre les choix publics",
    "part": "À quoi cela sert-il ?",
    "html": "<ol class=\"questions\"><li>Comment réagir à une récession ?</li><li>Comment financer les dépenses publiques ?</li><li>Comment réduire l’inflation ?</li></ol><p class=\"note\">Comparer les effets attendus, les coûts et les arbitrages.</p>"
  },
  {
    "id": "carrieres",
    "title": "Des outils pour vos projets professionnels",
    "part": "À quoi cela sert-il ?",
    "html": "<div class=\"cards c2\"><div class=\"card\"><h2>Conseil et entreprise</h2><p>Construire un scénario.<br>Tester une hypothèse de demande ou de coût.</p></div><div class=\"card\"><h2>Finance</h2><p>Interpréter la conjoncture.<br>Analyser les risques et le financement.</p></div><div class=\"card\"><h2>Institutions publiques</h2><p>Comparer des politiques.<br>En mesurer les effets.</p></div><div class=\"card\"><h2>Recherche</h2><p>Poser une question.<br>La confronter aux modèles et aux données.</p></div></div>"
  },
  {
    "id": "suite",
    "title": "Mesurer la richesse nationale",
    "kind": "divider",
    "part": "La suite",
    "html": "<div class=\"plan\"><div class=\"plan-row is-current\" aria-current=\"step\"><span class=\"n\">1</span><span class=\"q\">Mesurer la richesse nationale</span></div><div class=\"plan-row\"><span class=\"n\">2</span><span class=\"q\">Comprendre la richesse des nations</span></div><div class=\"plan-row\"><span class=\"n\">3</span><span class=\"q\">Emploi, tâches et intelligence artificielle</span></div><div class=\"plan-row\"><span class=\"n\">4</span><span class=\"q\">Politique budgétaire et dette publique</span></div><div class=\"plan-row\"><span class=\"n\">5</span><span class=\"q\">Monnaie, inflation et politique monétaire</span></div></div>"
  }
];
