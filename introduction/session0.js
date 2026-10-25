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
    "title": "Déroulement des séances",
    "part": "Le cours",
    "html": "<ul class=\"list\"><li>Arrivez à l’heure.</li><li>Posez des questions et participez.</li><li>Pas d’ordinateurs en classe.</li><li>Prenez des notes, notamment pendant les calculs au tableau.</li><li>Les supports HTML et PDF serviront à préparer, annoter et réviser le cours.<ul class=\"sub\"><li>Pas besoin d’autre support (manuel, polycopié de cours, etc.)</li></ul></li><li>Deux absences tolérées.<ul class=\"sub\"><li>Émargement par SoWeSign</li></ul></li></ul>"
  },
  {
    "id": "demarche",
    "title": "Comment aborder ce cours ?",
    "part": "La macroéconomie",
    "html": "<ul class=\"list\"><li><strong>La curiosité est essentielle !</strong> Acceptez d’être bousculés dans vos idées et de découvrir des faits contre-intuitifs.</li><li><strong>Les concepts fondamentaux.</strong> Vous les utiliserez encore et encore. Autant y prêter attention et vous familiariser avec eux dès maintenant.</li><li><strong>La diversité en économie.</strong> Comme beaucoup de sciences, l’économie manque de diversité. Ne soyez ni surpris ni découragés si les personnes citées dans ce cours se ressemblent toutes et viennent de milieux similaires.</li></ul>"
  },
  {
    "id": "macro-definition",
    "title": "Qu’est-ce que la macroéconomie ?",
    "part": "La macroéconomie",
    "html": "<ul class=\"list\"><li><strong class=\"master-emphasis\">L’étude du fonctionnement de l’économie <em>dans son ensemble</em>.</strong><ul class=\"sub\"><li>« L’économie dans son ensemble » = une région, un pays ou le monde.</li><li>L’essentiel : plus d’une entreprise et d’un ménage.</li></ul></li><li>La macroéconomie se distingue de la microéconomie de deux façons principales :<ol class=\"sub\"><li><strong class=\"master-emphasis\">Les outils :</strong> optimisation dynamique et équilibre général.</li><li><strong class=\"master-emphasis\">Les questions :</strong> croissance économique, cycles économiques, ajustements des prix (inflation, taux d’intérêt, taux de change), chômage, banques centrales.</li></ol></li><li>La macroéconomie moderne utilise à la fois des <strong class=\"master-emphasis\">modèles</strong> et des <strong class=\"master-emphasis\">données</strong>.<ul class=\"sub\"><li>Il est utile de renforcer vos compétences en mathématiques (par des exercices) et en programmation (par des projets utilisant beaucoup de données).</li></ul></li></ul>"
  },
  {
    "id": "equilibre-general",
    "title": "Qu’est-ce que l’équilibre général ?",
    "part": "La macroéconomie",
    "html": "<div class=\"master-equilibrium\"><p class=\"master-definition\"><strong class=\"master-emphasis\">Équilibre général :</strong> l’équilibre simultané de nombreux marchés.</p><p class=\"master-feedback\"><span class=\"master-emphasis\">Il faut comprendre toutes les boucles de rétroaction dans l’économie !</span> Par exemple : salaires plus élevés → prix plus élevés → la banque centrale relève les taux d’intérêt → la demande diminue → les salaires baissent.</p><blockquote class=\"master-arrow-quote\" lang=\"en\">“From the time of Adam Smith’s <em>The Wealth of Nations</em> in 1776, one recurrent theme of economic analysis has been the remarkable degree of coherence among the <mark>vast numbers of individual and seemingly separate decisions</mark> about the buying and selling of commodities. In everyday, normal experience, there is something of a balance between the amounts of goods and services that some individuals want to supply and the amounts that other, different individuals want to buy. Would-be buyers ordinarily count correctly on being able to carry out their intentions, and would-be sellers do not ordinarily find themselves producing great amounts of goods that they cannot sell. This experience of balance is indeed so widespread that it raises no intellectual disquiet among laymen; they take it so much for granted that they are not disposed to understand the mechanism by which it occurs.”</blockquote><p class=\"master-attribution\">Kenneth Arrow (1974), « General Economic Equilibrium: Purpose, Analytic Techniques, Collective Choice ».</p></div>"
  },
  {
    "id": "pour-vous",
    "title": "À quoi sert la macroéconomie pour vous ?",
    "part": "La macroéconomie",
    "html": "<div class=\"master-personal\"><ul class=\"list\"><li>Dois-je acheter un logement ou continuer à louer ?</li><li>Dois-je dépenser ou épargner ?</li><li>Comment investir si j’ai de l’épargne ?</li><li>Quels sont les déterminants des inégalités ?</li><li>Comment l’IA va-t-elle affecter mes perspectives sur le marché du travail ?</li></ul><div class=\"master-photo-slot\" data-photo-slot=\"pour-vous-droite\" role=\"img\" aria-label=\"Emplacement réservé à l’illustration qui sera fournie par l’enseignant\"><span>Illustration à venir</span></div></div>"
  },
  {
    "id": "finance",
    "title": "À quoi sert la macroéconomie pour un investisseur ?",
    "part": "La macroéconomie",
    "html": "<p class=\"center lead-small\"><strong>Facteurs macroéconomiques → rendements des actifs</strong></p><ul class=\"list\"><li>Six facteurs macroéconomiques expliquent plus de 90 % des rendements agrégés.</li><li>Selon les recherches de BlackRock, plus de 90 % des rendements des différentes classes d’actifs peuvent être expliqués par six grands déterminants, ou facteurs.</li><li><span class=\"master-emphasis\">La croissance économique, les taux d’intérêt et l’inflation</span> sont les principaux déterminants des rendements des différentes classes d’actifs. <span class=\"master-emphasis\">Le crédit, les marchés émergents et la liquidité</span> sont également importants à comprendre et à gérer, en particulier en période de crise.</li></ul><div class=\"master-investor-quote\"><p>(Et pour les futurs banquiers d’affaires parmi vous : « Une personne qui obtient son diplôme dans un marché haussier et entre immédiatement dans la banque d’affaires gagne entre 1,5 et 5 millions de dollars de plus que ce qu’aurait gagné cette même personne si elle avait obtenu son diplôme dans un marché baissier. »)</p><p class=\"master-attribution\">Oyer (2008), « The Making of an Investment Banker ».</p></div>"
  },
  {
    "id": "politiques",
    "title": "À quoi sert la macroéconomie pour un décideur public ?",
    "part": "La macroéconomie",
    "html": "<div class=\"master-policy\"><p>C’est assez évident en ce moment…</p><div class=\"master-media-pair\"><div class=\"master-photo-slot\" data-photo-slot=\"politiques-gauche\" role=\"img\" aria-label=\"Emplacement réservé à la photo qui sera fournie par l’enseignant\"><span>Photo à venir</span></div><div class=\"master-photo-slot\" data-photo-slot=\"politiques-droite\" role=\"img\" aria-label=\"Emplacement réservé à la seconde illustration qui sera fournie par l’enseignant\"><span>Illustration à venir</span></div></div></div>"
  },
  {
    "id": "carrieres",
    "title": "À quoi sert la macroéconomie pour votre carrière ?",
    "part": "La macroéconomie",
    "html": "<ul class=\"list\"><li><em class=\"master-emphasis\">Tous</em> les métiers bénéficient d’une culture économique (quantitative).</li><li>Institutions internationales (FMI, Banque mondiale, BRI, BCE, etc.) : un master ou un doctorat en économie ou en politiques publiques peut être requis.</li><li>Elle est essentielle en finance (les certifications comme le CFA sont, pour l’essentiel, des examens d’économie).</li><li>De solides bases en microéconomie et en macroéconomie sont essentielles si vous souhaitez faire de la recherche en économie ou préparer un doctorat (venez m’en parler !).</li></ul>"
  }
];
