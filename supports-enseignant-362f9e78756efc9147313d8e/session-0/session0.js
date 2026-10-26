/* Session d'introduction, Arnaud Dyèvre, HEC L3, 2026.
   Adaptation de MEF_Macroeconomics_Lecture_0.pdf. Notes réservées à la relecture.
   Mise en page alignée sur la charte du chapitre 1 le 23 octobre 2026 (plan_charte_2026-10-23.md). */

/* Progression du syllabus 2026 (tableau « Organisation et progression proposée »).
   Dates et quiz contrôlés contre organisation/calendrier.md le 23 octobre 2026 : aucun écart. */
const CALENDRIER = [
  [1, '26 oct.', '27 oct.', '1', 'Mesurer l’activité : PIB, valeur ajoutée, nominal et réel.', 0],
  [2, '28 oct.', '29 oct.', '1', 'Niveau de vie, productivité, limites du PIB et environnement.', 0],
  [3, '2 nov.', '5 nov.', '2', 'Richesse des nations : capital, travail et productivité.', 0],
  [4, '4 nov.', '10 nov.', '2', 'Accumulation, rendements décroissants et convergence.', 1],
  [5, '9 nov.', '12 nov.', '2', 'Innovation, investissement et gains de productivité liés à l’IA.', 0],
  [6, '16 nov.', '17 nov.', '3', 'Emploi, chômage et effets de la productivité sur la demande de travail.', 0],
  [7, '18 nov.', '19 nov.', '3', 'Tâches, automatisation et IA : scénarios et exercices.', 0],
  [8, '23 nov.', '24 nov.', '4', 'Demande globale et multiplicateur budgétaire.', 2],
  [9, '25 nov.', '26 nov.', '4', 'Stabilisateurs, austérité et dynamique de la dette.', 0],
  [10, '30 nov.', '1<sup>er</sup> déc.', '5', 'Banques, bilans et création monétaire.', 0],
  [11, '2 déc.', '3 déc.', '5', 'Inflation et transmission de la politique monétaire.', 3],
  [12, '7 déc.', '8 déc.', '1 à 5', 'Synthèse, exercices transversaux et préparation à l’examen.', 0]
];

function calendrierHtml() {
  const span = chapter => CALENDRIER.filter(r => r[3] === chapter).length;
  const rows = CALENDRIER.map((r, i) => {
    const first = i === 0 || CALENDRIER[i - 1][3] !== r[3];
    const cls = [first && i > 0 ? 'group-start' : '', r[5] ? 'quiz' : ''].filter(Boolean).join(' ');
    return `<tr${cls ? ` class="${cls}"` : ''}><td class="n">${r[0]}</td><td class="date">${r[1]}</td><td class="date">${r[2]}</td>${first ? `<td class="ch" rowspan="${span(r[3])}">${r[3]}</td>` : ''}<td>${r[4]}</td><td class="q">${r[5] ? `<span class="quiz-tag">Quiz ${r[5]}</span>` : ''}</td></tr>`;
  }).join('');
  return `<p class="cal-groups"><span><b>FR05</b>13 h–14 h 30</span><span><b>FR01</b>14 h 40–16 h 10</span><span><b>FR02</b>9 h 40–11 h 10</span></p>`
    + `<table class="cal"><thead><tr><th class="n">Séance</th><th>FR05 · FR01</th><th>FR02</th><th class="ch">Chapitre</th><th>Thème</th><th class="q">Quiz</th></tr></thead><tbody>${rows}</tbody></table>`;
}


const INTRO_SLIDES = [
  {
    id: 'accueil', title: '0. Introduction à la macroéconomie', kind: 'cover', part: 'Bienvenue', sourcePages: [1],
    html: `<div class="cover-label">Macroéconomie L3</div><h1>0. Introduction à la macroéconomie</h1><p class="cover-author">Arnaud Dyèvre · HEC Paris</p><p class="cover-term">Automne 2026</p>`,
    notes: 'Couverture sans graphique, conformément à la préférence générale d’Arnaud. La session 0 constitue l’accueil de la première séance ; elle ne crée pas une séance supplémentaire.'
  },
  {
    id: 'arnaud', title: 'Quelques mots sur moi', part: 'Bienvenue', sourcePages: [2],
    html: `<div class="intro-name"><p class="lead">Arnaud Dyèvre</p><p class="sub"><a href="mailto:dyevre@hec.fr">dyevre@hec.fr</a></p><p class="sub"><a href="https://www.arnauddyevre.com/" target="_blank" rel="noopener noreferrer">arnauddyevre.com</a> · Pour prendre rendez-vous avec moi.</p><p>Appelez-moi Arnaud.</p></div><div class="cards c2"><div class="card blue"><p><strong>Professeur à HEC Paris depuis septembre 2025.</strong></p><p>Doctorat à la LSE ; postdoctorat au MIT.</p><p>Macroéconomie et économie publique.<br>Innovation et croissance.</p></div><div class="card blue"><h2>Mes projets actuels</h2><ul><li>L’IA et son impact sur l’innovation.</li><li>Le rôle du financement public de la R&amp;D.</li><li>L’impact des acquisitions d’entreprises sur l’innovation.</li></ul></div></div>`,
    notes: 'Biographie issue du support de master fourni par Arnaud, page 2, complétée sur sa demande le 25 octobre 2026 : professeur à HEC Paris depuis septembre 2025 ; projets actuels sur l’IA et l’innovation, le financement public de la R&D et les acquisitions d’entreprises et l’innovation. Le site personnel permet aux étudiants de prendre rendez-vous, via le lien de réservation sur son accueil. Le numéro de bureau V-103 n’est pas repris sans confirmation actuelle. La consigne de s’adresser à Arnaud par son prénom est conservée.'
  },
  {
    id: 'vous', title: 'Quelques mots sur vous', part: 'Bienvenue', sourcePages: [3],
    html: `<ol class="questions"><li>Votre prénom</li><li>Votre formation jusqu’à présent</li><li>Votre projet professionnel après HEC</li></ol>`,
    notes: 'Tour de présentation, sans durée imposée. Trois points fixés par Arnaud le 25 octobre 2026 : prénom, formation jusqu’à présent et projet professionnel après HEC. Fond blanc, sans label Exercice.'
  },
  {
    id: 'organisation', title: 'Notre cours cet automne', part: 'Le cours', sourcePages: [4],
    html: `<div class="key-numbers"><div><strong>12</strong><span>séances de 1 h 30</span></div><div><strong>18 h</strong><span>par groupe</span></div><div><strong>5</strong><span>chapitres</span></div><div><strong>6</strong><span>semaines</span></div></div><p class="center lead-small">Du 26 octobre au 8 décembre 2026 · En français</p><p class="center">FR05 · FR01 · FR02</p><p class="sub center">Le calendrier du syllabus fait référence pour les dates de votre groupe.</p><p class="sub center">Supports HTML et PDF :<br><a href="https://arnauddyevre.github.io/macroeconomie-l3-2026/" target="_blank" rel="noopener noreferrer">arnauddyevre.github.io/macroeconomie-l3-2026</a></p>`,
    notes: 'Le calendrier du master 2025 est remplacé par celui du syllabus L3 validé. Il y a 12 séances par groupe, en général deux par semaine ; ne pas présenter cette introduction comme une 13e séance. Pas de minutage ajouté.'
  },
  {
    id: 'programme', title: 'Cinq questions pour le semestre', part: 'Le cours', sourcePages: [4],
    html: `<div class="plan"><div class="plan-row"><span class="n">1</span><span class="q">Mesurer la richesse nationale<small>Que produit-on ? À quels prix ? Pour qui ?</small></span></div><div class="plan-row"><span class="n">2</span><span class="q">Comprendre la richesse des nations<small>Pourquoi certains pays sont-ils plus riches ?</small></span></div><div class="plan-row"><span class="n">3</span><span class="q">Emploi, tâches et intelligence artificielle<small>Comment l’IA transforme-t-elle le travail ?</small></span></div><div class="plan-row"><span class="n">4</span><span class="q">Politique budgétaire et dette publique<small>Que peuvent faire les pouvoirs publics ?</small></span></div><div class="plan-row"><span class="n">5</span><span class="q">Monnaie, inflation et politique monétaire<small>Comment la monnaie et les taux agissent-ils ?</small></span></div></div>`,
    notes: 'Les cinq thèmes suivent le syllabus L3. Le chapitre 1 porte le nouveau titre demandé par Arnaud. L’innovation et la productivité liées à l’IA sont également traitées dans le chapitre 2. Mise en page au gabarit du plan du chapitre 1 (23 octobre 2026).'
  },
  {
    id: 'calendrier', title: 'Calendrier des séances et des quiz', part: 'Le cours', sourcePages: [],
    html: calendrierHtml(),
    notes: 'Créée le 23 octobre 2026 à la demande d’Arnaud. Reprend le tableau « Organisation et progression proposée » du syllabus 2026 : séances, dates FR05/FR01 et FR02, chapitres, thèmes et quiz. Dates et quiz contrôlés contre organisation/calendrier.md : 36 créneaux, aucun écart. Les salles et la date de l’examen final ne sont pas affichées : les premières figurent dans l’emploi du temps HEC, la seconde n’est pas fixée. Le syllabus présente le découpage thématique comme une proposition ajustable.'
  },
  {
    id: 'evaluation', title: 'Comment serez-vous évalués ?', part: 'Le cours', sourcePages: [4],
    html: `<div class="cards c2"><div class="card blue"><p class="label">Au fil du cours</p><p class="big">3 quiz</p><ul><li>Sur papier · 15 minutes chacun.</li><li>Séances 4, 8 et 11.</li><li>10 % chacun : <em>30 % au total.</em></li><li>Les quiz manqués sont notés zéro.</li></ul></div><div class="card blue"><p class="label">Examen final</p><p class="big">2 heures</p><ul><li>Sur papier.</li><li><em>70 % de la note finale.</em></li><li>L’utilisation de feuilles de rappel (<i>cheat sheet</i>) n’est pas autorisée.</li></ul></div></div><p class="sub"><strong>Questions présentes dans les quiz :</strong> QCM, calculs et raisonnements sur graphiques.</p><p class="sub"><strong>Questions présentes dans l’examen final :</strong> QCM, calculs, raisonnements sur graphiques, questions de synthèse et questions sur document.</p>`,
    notes: 'Modalités confirmées dans le syllabus 2026. Précision demandée par Arnaud le 25 octobre 2026 : les quiz comportent QCM, calculs et raisonnements sur graphiques ; l’examen final comprend aussi des questions de synthèse et des questions sur document. Les quiz manqués sont notés zéro. Ne pas reprendre l’examen d’une heure en dernière séance du master. La date du final, les autres matériels autorisés et le périmètre des quiz ne sont pas encore annoncés.'
  },
  {
    id: 'en-classe', title: 'Déroulement des séances', part: 'Le cours', sourcePages: [5],
    html: `<ul class="list"><li>Arrivez à l’heure.</li><li>Posez des questions et participez.</li><li>Pas d’ordinateurs en classe.</li><li>Prenez des notes, notamment pendant les calculs au tableau.</li><li>Les supports HTML et PDF serviront à préparer, annoter et réviser le cours.<ul class="sub"><li>Pas besoin d’autre support (manuel, polycopié de cours, etc.)</li></ul></li><li>Deux absences tolérées.<ul class="sub"><li>Émargement par SoWeSign</li></ul></li></ul>`,
    notes: 'La ponctualité, les questions et la participation reprennent la page 5. L’absence d’interrogation nominative surprise est conservée comme pratique suggérée dans les notes, sans ajout au règlement. Les dérivations au tableau et l’absence d’ordinateurs viennent du syllabus. La pause de 10–15 minutes des longues séances de master n’est pas importée comme règle fixe pour les séances L3 de 90 minutes.'
  },
  {
    id: 'demarche', title: 'Comment aborder ce cours ?', part: 'La macroéconomie', sourcePages: [6],
    html: `<ul class="list"><li><strong>La curiosité est essentielle !</strong> Acceptez d’être bousculés dans vos idées et de découvrir des faits contre-intuitifs.</li><li><strong>Les concepts fondamentaux.</strong> Vous les utiliserez encore et encore. Autant y prêter attention et vous familiariser avec eux dès maintenant.</li><li><strong>La diversité en économie.</strong> Comme beaucoup de sciences, l’économie manque de diversité. Ne soyez ni surpris ni découragés si les personnes citées dans ce cours se ressemblent toutes et viennent de milieux similaires.</li></ul>`,
    notes: 'Demande d’Arnaud du 25 octobre 2026 : traduction fidèle de « How to approach the class », page 6 du master, en trois puces avec les mêmes amorces en gras. Remplace l’ancienne reformulation en cartes, retirée auparavant. Aucune illustration dans la page source.'
  },
  {
    id: 'macro-definition', title: 'Qu’est-ce que la macroéconomie ?', part: 'La macroéconomie', sourcePages: [7],
    html: `<ul class="list"><li><strong class="master-emphasis">L’étude du fonctionnement de l’économie <em>dans son ensemble</em>.</strong><ul class="sub"><li>« L’économie dans son ensemble » = une région, un pays ou le monde.</li><li>L’essentiel : plus d’une entreprise et d’un ménage.</li></ul></li><li>La macroéconomie se distingue de la microéconomie de deux façons principales :<ol class="sub"><li><strong class="master-emphasis">Les outils :</strong> optimisation dynamique et équilibre général.</li><li><strong class="master-emphasis">Les questions :</strong> croissance économique, cycles économiques, ajustements des prix (inflation, taux d’intérêt, taux de change), chômage, banques centrales.</li></ol></li><li>La macroéconomie moderne utilise à la fois des <strong class="master-emphasis">modèles</strong> et des <strong class="master-emphasis">données</strong>.<ul class="sub"><li>Il est utile de renforcer vos compétences en mathématiques (par des exercices) et en programmation (par des projets utilisant beaucoup de données).</li></ul></li></ul>`,
    notes: 'Traduction presque verbatim de « What is Macroeconomics? », page 7 du master, demandée le 25 octobre 2026 : trois puces, sous-puces et deux outils/questions numérotés. La recommandation générale sur la programmation ne crée pas de projet obligatoire ni de nouvelle modalité d’évaluation du cours L3.'
  },
  {
    id: 'equilibre-general', title: 'Qu’est-ce que l’équilibre général ?', part: 'La macroéconomie', sourcePages: [8],
    html: `<div class="master-equilibrium"><p class="master-definition"><strong class="master-emphasis">Équilibre général :</strong> l’équilibre simultané de nombreux marchés.</p><p class="master-feedback"><span class="master-emphasis">Il faut comprendre toutes les boucles de rétroaction dans l’économie !</span> Par exemple : salaires plus élevés → prix plus élevés → la banque centrale relève les taux d’intérêt → la demande diminue → les salaires baissent.</p><blockquote class="master-arrow-quote" lang="en">“From the time of Adam Smith’s <em>The Wealth of Nations</em> in 1776, one recurrent theme of economic analysis has been the remarkable degree of coherence among the <mark>vast numbers of individual and seemingly separate decisions</mark> about the buying and selling of commodities. In everyday, normal experience, there is something of a balance between the amounts of goods and services that some individuals want to supply and the amounts that other, different individuals want to buy. Would-be buyers ordinarily count correctly on being able to carry out their intentions, and would-be sellers do not ordinarily find themselves producing great amounts of goods that they cannot sell. This experience of balance is indeed so widespread that it raises no intellectual disquiet among laymen; they take it so much for granted that they are not disposed to understand the mechanism by which it occurs.”</blockquote><p class="master-attribution">Kenneth Arrow (1974), « General Economic Equilibrium: Purpose, Analytic Techniques, Collective Choice ».</p></div>`,
    notes: 'Reprise de la page 8 du master : définition encadrée centrée, chaîne de rétroaction, citation complète d’Arrow et titre de l’ouvrage conservés en anglais, conformément à la précision d’Arnaud du 25 octobre 2026, puis attribution. Le passage sur les décisions individuelles reste mis en évidence. Coquille interne corrigée : le support écrit « want to supply » puis « want to sell » ; le second devient « want to buy », pour rétablir l’opposition offre/demande. La publication originale n’a pas été vérifiée dans cette reprise. L’exemple de rétroaction est celui du support source, pas un résultat universel sans hypothèses.'
  },
  {
    id: 'pour-vous', title: 'À quoi sert la macroéconomie pour vous ?', part: 'La macroéconomie', sourcePages: [9], prov:'obs',
    html: `<div class="master-personal"><ul class="list"><li>Dois-je acheter un logement ou continuer à louer ?</li><li>Dois-je dépenser ou épargner ?</li><li>Comment investir si j’ai de l’épargne ?</li><li>Quels sont les déterminants des inégalités ?</li><li>Comment l’IA va-t-elle affecter mes perspectives sur le marché du travail ?</li></ul><figure class="canaries-figure"><img src="assets/canaries_coal_mine_emploi_age_2026.png" width="1286" height="705" alt="Emploi par tranche d’âge dans l’échantillon ADP, de janvier 2021 à juin 2026 ; indice 1 en novembre 2022. Les trajectoires des jeunes et des travailleurs plus âgés divergent après 2022."><figcaption>Erik Brynjolfsson, Bharat Chandar et Ruyu Chen, <a href="https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf#page=9" target="_blank" rel="noopener noreferrer"><em>Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence</em></a>, Stanford Digital Economy Lab, août 2026, fig. 2, p. 9.</figcaption></figure></div>`,
    notes: 'Cinq questions traduites de la page 9 du master, avec la capture fournie par Arnaud le 25 octobre 2026. La nouvelle image correspond à la figure 2, page 9, de la révision du 12 août 2026 de Brynjolfsson, Chandar et Chen, vérifiée dans le PDF primaire Stanford. Elle porte sur l’ensemble de l’échantillon ADP, tous métiers, par âge ; données janvier 2021–juin 2026, indice 1 en novembre 2022. Ne pas la présenter comme le seul emploi des développeurs : ce dernier était le graphique du master, remplacé ici. Image conservée telle que fournie à la demande expresse d’Arnaud, exception locale au principe de reconstruction dynamique des graphiques. Questions de motivation du cours, pas un exercice : fond blanc.'
  },
  {
    id: 'finance', title: 'À quoi sert la macroéconomie pour un investisseur ?', part: 'La macroéconomie', sourcePages: [10],
    html: `<p class="center lead-small"><strong>Facteurs macroéconomiques → rendements des actifs</strong></p><ul class="list"><li>Six facteurs macroéconomiques expliquent plus de 90 % des rendements agrégés.</li><li>Selon les recherches de BlackRock, plus de 90 % des rendements des différentes classes d’actifs peuvent être expliqués par six grands déterminants, ou facteurs.</li><li><span class="master-emphasis">La croissance économique, les taux d’intérêt et l’inflation</span> sont les principaux déterminants des rendements des différentes classes d’actifs. <span class="master-emphasis">Le crédit, les marchés émergents et la liquidité</span> sont également importants à comprendre et à gérer, en particulier en période de crise.</li></ul><div class="master-investor-quote"><p>(Et pour les futurs banquiers d’affaires parmi vous : « Une personne qui obtient son diplôme dans un marché haussier et entre immédiatement dans la banque d’affaires gagne entre 1,5 et 5 millions de dollars de plus que ce qu’aurait gagné cette même personne si elle avait obtenu son diplôme dans un marché baissier. »)</p><p class="master-attribution">Oyer (2008), « The Making of an Investment Banker ».</p></div>`,
    notes: 'Traduction presque verbatim de la page 10 du master, conservant l’accroche centrée, les trois puces (y compris la répétition du chiffre de 90 %) et la citation d’Oyer en bas. Chiffres attribués à BlackRock et Oyer tels qu’ils figurent dans le support source, sans actualisation ni validation indépendante ajoutée. La citation n’indique pas un supplément annuel de revenu. Aucun visuel dans la page source.'
  },
  {
    id: 'politiques', title: 'À quoi sert la macroéconomie pour un décideur public ?', part: 'La macroéconomie', sourcePages: [11], prov:'obs',
    html: `<div class="oat-figure"><p class="oat-period">OAT française à 10 ans · moyennes hebdomadaires · 2025–2026</p><div id="oat10-chart" style="height:590px;width:100%" aria-label="Rendement des OAT françaises à dix ans, en pourcentage, moyennes hebdomadaires"></div></div>`,
    source: `Source : <a href="https://www.banque-france.fr/fr/statistiques/taux-et-cours/indices-obligataires-2026-10-23" target="_blank" rel="noopener noreferrer">Banque de France / Euronext, TEC10</a> · moyennes hebdomadaires calculées jusqu’au 23 octobre 2026.`,
    notes: 'Dernière demande d’Arnaud du 25 octobre 2026 : limiter le graphique à 2025 et 2026 et afficher des moyennes hebdomadaires. Remplace la précédente série mensuelle BCE par des moyennes calculées sur les données quotidiennes TEC10 (Banque de France / Euronext, FM.D.FR.EUR.FR2.BB.FRMOYTEC10.HSTA). Moyenne arithmétique des jours publiés de chaque semaine du lundi au vendredi, sans interpolation ni report : 462 valeurs quotidiennes donnent 95 semaines du 2 janvier 2025 au 23 octobre 2026. Première semaine partielle, 2 et 3 janvier seulement. Dernière moyenne : 4,988 %, affichée 4,99 %, pour les 19–23 octobre ; ce n’est pas la cotation quotidienne du vendredi (5,048 %). Les dates d’observation et les effectifs sont accessibles au survol. Le TEC10 mesure le rendement d’une OAT fictive à maturité constante de dix ans ; ce n’est pas un coupon contractuel ni le coût moyen de la dette. Seuls les agrégats hebdomadaires sont embarqués dans le support public ; les données quotidiennes et leur provenance restent dans la préparation. Moteur SVG du chapitre 1, tracé de deux secondes, valeurs au survol et au clavier ; courbe complète en lecture, impression et réduction des animations.'
  },
  {
    id: 'carrieres', title: 'À quoi sert la macroéconomie pour votre carrière ?', part: 'La macroéconomie', sourcePages: [12],
    html: `<ul class="list"><li><em class="master-emphasis">Tous</em> les métiers bénéficient d’une culture économique (quantitative).</li><li>Institutions internationales (FMI, Banque mondiale, BRI, BCE, etc.) : un master ou un doctorat en économie ou en politiques publiques peut être requis.</li><li>Elle est essentielle en finance (les certifications comme le CFA sont, pour l’essentiel, des examens d’économie).</li><li>De solides bases en microéconomie et en macroéconomie sont essentielles si vous souhaitez faire de la recherche en économie ou préparer un doctorat (venez m’en parler !).</li></ul>`,
    notes: 'Traduction presque verbatim de « Why is macro useful – for your career? », page 12 du master, en quatre puces pleine largeur. Les sigles IMF, BIS et ECB deviennent FMI, BRI et BCE. L’appréciation du CFA est celle du support source, sans vérification de son programme actuel. Aucun visuel dans la page source. Dernière diapositive de la session 0 après la reprise demandée le 25 octobre 2026.'
  }
];
