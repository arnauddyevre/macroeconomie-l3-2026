/* Conclusion du chapitre 1 — réécriture demandée par Arnaud, 1er novembre 2026.
 * Chargée après les ajouts de contenu, avant reorganisation.js.
 * Ce module ne touche ni l’ouverture, ni les parties 1 à 3, ni l’ordre final. */
(function () {
  'use strict';
  const slides = window.SLIDES;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const byId = id => slides.find(slide => slide.id === id);
  const edit = (id, patch) => {
    const slide = byId(id);
    if (!slide) throw new Error(`Conclusion : diapositive absente (${id}).`);
    Object.assign(slide, patch);
  };
  const note = (id, text) => { window.NOTES[id] = `<p>1er novembre 2026 : ${text}</p>`; };
  const points = (items, cls = '', offset = 0) => `<ul class="conclusion-points ${cls}">${items.map((text, i) => `<li${i + offset ? ` data-step="${i + offset}"` : ''}>${text}</li>`).join('')}</ul>`;

  // Séparation autonome : ne pas ajouter Conclusion au plan commun, ce qui
  // changerait aussi les séparations des parties 1 à 3.
  const parts = [
    'Que mesure-t-on ?',
    'Comment prendre en compte les changements de prix ?',
    'Par personne et par heure ?',
    'Pour qui ?',
    'À quel coût ?'
  ];
  slides.push({
    id: 'conclusion-divider', part: 'Conclusion', title: 'Conclusion',
    layout: 'section', cls: 'rev-section-overview conclusion-divider',
    html: `<div class="p-center rev-chapter-plan" style="gap:18px">${parts.map((title, i) => `<div class="pj-plan-row"><span class="n">${i + 1}</span><span class="q">${esc(title)}</span></div>`).join('')}<div class="pj-plan-row is-current" aria-current="step"><span class="n"></span><span class="q">Conclusion</span></div></div>`,
    source: '', prov: null
  });
  note('conclusion-divider', 'séparation explicite de la conclusion, demandée par Arnaud. Les cinq questions du chapitre restent grisées ; Conclusion apparaît en blanc, sans devenir une sixième partie. La séparation est autonome : le plan initial et les parties 1 à 3 ne sont pas modifiés.');

  // Reprendre réellement le gabarit d’ouverture, plutôt que le reconstituer :
  // proportions, photographies, crédits et noms restent identiques.
  const opening = byId('pib-melenchon');
  if (!opening) throw new Error('Conclusion : le gabarit Mélenchon–Kennedy est absent.');
  const mirror = document.createElement('template');
  mirror.innerHTML = opening.html;
  mirror.content.querySelectorAll('.rev-meeting-date').forEach(detail => detail.remove());
  const responses = [
    [
      '<strong>Réparer une voiture ou restaurer Notre-Dame</strong> crée une valeur ajoutée utile ; l’accident détruit du patrimoine.',
      'L’argument repose sur la définition factuelle du PIB. Mais réduire la croissance à « creuser des trous ou casser des voitures sans but » est un <strong>sophisme de l’épouvantail</strong>.'
    ],
    [
      '<strong>Il faut rémunérer</strong> médecins, enseignants, gardes forestiers et poètes.',
      '<strong>Payer un bien ou un service</strong> traduit un besoin de l’acheteur ; la valeur ajoutée produite entre dans le PIB.',
      '<strong>Produire davantage</strong> élargit les moyens consacrés à la santé, à l’instruction et à la culture.'
    ]
  ];
  mirror.content.querySelectorAll('blockquote').forEach((quote, i) => {
    const answer = document.createElement('div');
    answer.className = 'conclusion-response';
    answer.setAttribute('aria-label', 'Réponse du cours');
    answer.innerHTML = `<p class="conclusion-response-label">Réponse du cours</p>${points(responses[i], 'conclusion-response-points', i ? 2 : 0)}`;
    quote.replaceWith(answer);
  });
  mirror.content.querySelector('.rev-kennedy-text').insertAdjacentHTML('beforeend', points([
    '<strong>Le PIB n’a pas été conçu</strong> pour mesurer la stabilité des mariages ni tous les aspects du bien-être.'
  ], 'conclusion-kennedy-scope', 5));
  edit('deux-camps', {
    part: 'Conclusion', title: 'Le PIB mesure aussi ce qui nous aide à bien vivre',
    cls: 'rev-meeting conclusion-mirror', html: mirror.innerHTML, source: '', prov: null
  });
  note('deux-camps', 'réponse aux deux interventions de l’ouverture, selon la demande d’Arnaud. Les photographies, leur géométrie, leurs crédits et les noms sont repris sans modification de pib-melenchon. À la demande d’Arnaud, les précisions de date et de contexte sous les deux noms sont retirées de la conclusion ; elles restent dans l’ouverture. Les listes sont des explications du cours, pas de nouvelles citations attribuées aux deux intervenants. Réparer une voiture ou restaurer Notre-Dame produit un service utile et une valeur ajoutée. La destruction du patrimoine est une perte de stock : une production de réparation ne prouve donc pas un gain net de richesse ou de bien-être par rapport à l’absence d’accident. La rémunération des personnes qui fournissent santé, instruction, protection de la nature ou culture mobilise des ressources réelles ; la production en élargit les moyens, sans garantir à elle seule qualité, accès ou bien-être. Complément demandé par Arnaud : le paiement traduit un besoin ou une utilité attendue pour l’acheteur, sans garantir un bénéfice collectif ni une utilité effectivement réalisée. Tout paiement ne constitue pas une production nouvelle : c’est la valeur ajoutée des activités du périmètre comptable qui contribue au PIB, pas par exemple la totalité d’une revente d’occasion. L’épouvantail consiste à présenter la recherche de croissance comme une recommandation de creuser des trous ou de détruire des voitures sans but. Une prestation rémunérée peut effectivement être comptabilisée sans produire un bénéfice social : reconnaître ce fait ne revient pas à recommander cette prestation. Cette distinction ne disqualifie pas les critiques sur les externalités ou le bien-être. Les services peuvent être payés individuellement ou collectivement. Les activités non rémunérées ne sont pas toutes incluses dans le PIB. Ajout demandé pour Kennedy : le PIB est un indicateur de production, non un indicateur conçu pour mesurer la stabilité des mariages ou l’ensemble des dimensions du bien-être. La nouvelle puce conclut la réponse à l’étape 5 ; ces autres dimensions peuvent faire l’objet d’indicateurs complémentaires. Les images et leurs sources restent celles de l’ouverture.');

  slides.push({
    id: 'croissance-possibilites', part: 'Conclusion',
    title: 'Ce qu’un PIB réel par habitant plus élevé rend possible', cls: 'conclusion-possibilities',
    html: `<div class="conclusion-options-layout">
      <div class="conclusion-options-copy">
        <p class="conclusion-lead">Une production réelle par habitant plus élevée donne davantage de moyens.</p>
        <div class="conclusion-productivity"><span>Un levier essentiel</span><div><var>Y</var>/<var>H</var> <span aria-label="augmente">↑</span></div><p>Produire davantage<br>par heure travaillée</p></div>
        <p class="conclusion-option-takeaway" data-step="3"><strong>La productivité ouvre des choix.</strong><br>Leur répartition et leur usage nous appartiennent.</p>
      </div>
      <figure class="conclusion-options-diagram" aria-label="Trois usages possibles des gains de productivité">
        <div class="conclusion-option-source">Gains de productivité</div>
        <div class="conclusion-option-branches">
          <div class="conclusion-option"><h3>Consommation et services publics</h3><p>Davantage de biens, de santé, d’éducation et de culture.</p></div>
          <div class="conclusion-option" data-step="1"><h3>Investissement et transition</h3><p>Renouveler les équipements, innover et décarboner la production.</p></div>
          <div class="conclusion-option" data-step="2"><h3>Temps libre</h3><p>Produire autant en moins d’heures, si l’on choisit de travailler moins.</p></div>
        </div>
        <figcaption>Plusieurs usages possibles des gains ; leur combinaison relève de nos choix.</figcaption>
      </figure>
    </div>`, source: '', prov: null
  });
  note('croissance-possibilites', 'ajout validé par Arnaud : rendre explicites les avantages de la croissance et les usages des gains de productivité. Le schéma se construit progressivement : consommation et services publics, investissement et transition, puis temps libre. Il ne donne ni une répartition statistique ni une causalité automatique. À heures travaillées et emploi inchangés, une productivité plus élevée accroît la production par habitant. Un gain de productivité peut aussi être utilisé pour réduire la durée du travail à production donnée ; cette possibilité ne doit pas être présentée comme une hausse nécessaire du PIB. Financer la transition mobilise des ressources ; la croissance ne garantit pas à elle seule la baisse des émissions.');

  const recap = [
    ['Le PIB mesure un flux de production, pas un stock de richesse.', [
      '<strong>Production, revenus ou dépenses :</strong> trois approches équivalentes pour calculer le PIB.',
      '<strong>Détruire un stock</strong> réduit le patrimoine sans être déduit du PIB. La valeur ajoutée de sa réparation y entre.'
    ]],
    ['Plus d’euros ne signifie pas forcément plus de biens et de services.', [
      '<strong>À prix constants :</strong> mesurer les volumes produits en retirant l’effet de l’inflation.',
      '<strong>En PPA :</strong> comparer les pays en corrigeant les différences de prix, plutôt qu’au seul taux de change.'
    ]],
    ['Produire davantage par heure permet de produire plus ou de travailler moins.', [
      '<span class="conclusion-summary-equation"><var>Y/N</var> = <var>Y/H</var> × <var>H/L</var> × <var>L/N</var></span> : productivité horaire × heures par emploi × part de la population en emploi.',
      '<strong>La croissance se cumule :</strong> à 2 % par an, le niveau double en environ 35 ans (règle de 70).'
    ]],
    ['Une hausse du PIB par habitant ne bénéficie pas à tous de la même façon.', [
      '<strong>En France,</strong> prélèvements, prestations et services publics réduisent fortement les écarts de ressources.',
      '<strong>Courbe anonyme :</strong> mêmes rangs de revenu. <strong>Courbe non anonyme :</strong> mêmes personnes.'
    ]],
    ['Réduire les émissions tout en croissant est possible. Mais la trajectoire mondiale actuelle ne permet pas d’atteindre les objectifs de l’Accord de Paris.', [
      '<strong>Découplage relatif :</strong> moins de CO₂ par unité produite. <strong>Absolu :</strong> le PIB augmente et le CO₂ diminue.',
      '<strong>L’empreinte de consommation</strong> inclut aussi les émissions associées aux importations.'
    ]]
  ];
  edit('reponse', {
    part: 'Conclusion', title: 'Cinq enseignements sur le PIB et la croissance', cls: 'conclusion-summary',
    html: `<div class="conclusion-summary-wrap"><ol class="conclusion-summary-list">${recap.map(([message, details], i) => `<li${i ? ` data-step="${i}"` : ''}><span class="conclusion-summary-number" aria-label="Partie ${i + 1}">${i + 1}</span><div class="conclusion-summary-content"><p class="conclusion-summary-message">${message}</p><ul class="conclusion-summary-details">${details.map(detail => `<li>${detail}</li>`).join('')}</ul></div></li>`).join('')}</ol></div>`,
    source: `Trajectoire climatique : ${link('https://www.unep.org/en/news-and-stories/press-release/new-unep-report-lays-out-emission-cuts-needed-return-15degc', 'PNUE, Emissions Gap Report 2026, communiqué du 21 octobre 2026')}.`, prov: null
  });
  note('reponse', 'Synthèse précisée à la demande d’Arnaud : cinq messages directs, chacun accompagné de deux rappels, révélés ensemble par partie. Pas de nouvel exercice. Production, revenus et dépenses sont les trois approches du même PIB. Dans l’approche production, ajouter aux valeurs ajoutées les impôts nets de subventions sur les produits. Les destructions accidentelles de patrimoine sont des autres changements de volume des actifs, non une production négative ; distinguer la variation ordinaire des stocks de biens produits, qui entre dans le PIB. La réparation crée de la valeur ajoutée sans annuler nécessairement la perte patrimoniale. Les prix constants et les PPA corrigent respectivement les comparaisons temporelles et spatiales. La règle de 70 est approximative. Dans la décomposition, H désigne les heures travaillées, L les personnes en emploi et N la population totale. La productivité permet des choix entre production et temps libre, sans les déterminer automatiquement. En partie 4, les comptes distribués et les courbes individuelles répondent à des questions distinctes. Les courbes PSID portent sur les revenus du travail d’une population définie, pas sur toute la croissance du PIB. Le découplage absolu présenté en partie 5 concerne des pays et périodes précis : il ne prouve pas un découplage mondial. L’empreinte ajoute les émissions importées et retranche les émissions exportées. Le diagnostic climatique s’appuie sur le communiqué PNUE du 21 octobre 2026, lu intégralement : les politiques actuelles et les contributions nationales annoncées restent insuffisantes pour les objectifs de température de Paris. L’Accord vise nettement moins de 2 °C et la poursuite des efforts vers 1,5 °C. Ne pas confondre ces objectifs avec les engagements nationaux (NDC), ni le diagnostic mondial en gaz à effet de serre avec les séries internationales en CO₂ fossile et industriel du cours. Les trois fiches techniques restent en annexe.');

  edit('debattu', {
    part: 'Conclusion', title: 'Ce que l’économiste établit, ce que la société choisit', cls: 'conclusion-choices',
    html: `<div class="conclusion-choices-wrap"><div class="conclusion-choices-grid">
      <section><h2>L’économiste établit</h2>${points([
        'Les <strong>ressources disponibles</strong> et leur répartition.',
        'Les mécanismes qui font progresser la <strong>productivité</strong>.',
        'Les effets des politiques et les <strong>arbitrages</strong> entre leurs usages.'
      ], 'conclusion-choices-points')}</section>
      <section data-step="3"><h2>La société choisit</h2><ul class="conclusion-points conclusion-choices-points"><li>Comment employer les ressources : <strong>consommation, services publics, investissement</strong>.</li><li>Comment les partager et quel poids donner à <strong>l’égalité, au climat et au temps libre</strong>.</li></ul></section>
      </div><p class="conclusion-final-phrase" data-step="4"><strong>Accroître durablement le PIB réel par habitant, surtout grâce à la productivité, élargit nos possibilités.</strong><br>À nous de décider comment les utiliser.</p></div>`,
    source: '', prov: null
  });
  note('debattu', 'conclusion positive demandée par Arnaud. La hausse durable du PIB réel par habitant, surtout par la productivité, élargit l’ensemble des possibilités : c’est un objectif économique utile. Cette affirmation ne transforme pas le PIB en indicateur exhaustif du bien-être et ne prescrit pas de maximiser la production indépendamment du coût du travail, de la répartition ou des contraintes environnementales. Les arbitrages normatifs sont explicités dans la colonne de droite ; les mécanismes et les effets mesurables figurent à gauche.');

  // Garder les identifiants des deux boutons : le handler Deck.on('lectures')
  // existant ouvre les panneaux de crédits et de sources sans réinstallation.
  edit('lectures', {
    part: 'Conclusion', title: 'Pour aller plus loin', cls: 'conclusion-reading',
    html: `<div class="conclusion-reading-grid"><section><h2>Lire</h2><ul>
      <li><strong>C. I. Jones, <i>Macroeconomics</i></strong><span>Chapitres 2 et 3 : mesure et vue d’ensemble de la croissance.</span></li>
      <li><strong>${link('https://books.core-econ.org/the-economy/', 'CORE Econ, <i>The Economy 2.0</i>')}</strong><span>Unités 1 et 2.</span></li>
      <li><strong>${link('https://www.insee.fr/fr/statistiques/1377417', 'Stiglitz, Sen et Fitoussi (2009)')}</strong><span>Mesure des performances économiques et du progrès social.</span></li>
      <li><strong>${link('https://doi.org/10.1111/roiw.12681', 'Berman et Bourguignon (2024)')}</strong><span>La distinction entre croissance anonyme et non anonyme.</span></li>
    </ul></section><section><h2>Explorer les données</h2><ul>
      <li><strong>${link('https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023', 'Maddison Project Database 2023')}</strong><span>Deux siècles de PIB réel par habitant.</span></li>
      <li><strong>${link('https://www.insee.fr/fr/statistiques/8974371', 'Insee, comptes nationaux distribués')}</strong><span>Revenus, prélèvements et transferts publics.</span></li>
      <li><strong>${link('https://psidonline.isr.umich.edu/', 'Panel Study of Income Dynamics')}</strong><span>Trajectoires individuelles de revenus aux États-Unis.</span></li>
      <li><strong>${link('https://ourworldindata.org/co2-gdp-decoupling', 'Our World in Data, PIB et CO₂')}</strong><span>Production, émissions et découplage.</span></li>
    </ul><div class="btn-row"><button class="btn sm" id="btn-credits">Crédits des images</button><button class="btn sm" id="btn-donnees">Sources et millésimes</button></div></section></div>`,
    source: '', prov: null
  });
  note('lectures', 'références finales actualisées autour des mesures, des trajectoires de revenus et du découplage. Cet écran reste le dernier du corps principal, après la transition vers le chapitre suivant. Les boutons conservent leurs identifiants et le comportement natif de la présentation. Berman et Bourguignon fournissent le cadre conceptuel ; les courbes PSID du cours sont des calculs distincts, avec population, périodes et méthode documentées dans leurs notes.');
})();
