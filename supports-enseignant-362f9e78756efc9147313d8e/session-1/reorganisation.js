/* Réorganisation du chapitre 1 — Arnaud Dyèvre, 23 octobre 2026.
 * Plan et suivi : plan_reorganisation_2026-10-23.md ; historique : historique_modifications.md.
 * Dernière couche qui modifie l’ordre : exécutée après le script de sélection intégré et avant
 * exercices.js. L’ordre est déclaratif. Un identifiant déclaré mais absent est ignoré avec un
 * avertissement ; une diapositive non déclarée reste après son prédécesseur d’origine.
 * Support enseignant de relecture : ne pas distribuer directement. */
(function () {
  'use strict';
  const DATE = '23 octobre 2026';
  const ORIGINE = 'Réorganisation demandée par Arnaud le 23 octobre 2026 ; voir plan_reorganisation_2026-10-23.md.';
  const avertissements = [];
  const warn = message => { avertissements.push(message); console.warn('[réorganisation] ' + message); };
  const byId = id => window.SLIDES.find(s => s.id === id);
  const edit = (id, fn) => { const s = byId(id); if (s) fn(s); else warn(`diapositive absente : ${id}`); };
  const note = (id, html) => { window.NOTES[id] = (window.NOTES[id] || '') + html; };
  const remplacerNote = (id, avant, apres) => {
    const texte = window.NOTES[id] || '';
    if (!texte.includes(avant)) { warn(`note de ${id} : passage introuvable « ${avant} »`); return; }
    window.NOTES[id] = texte.replace(avant, apres);
  };

  const MOTIVATIONS = {
    'preston': 'espérance de vie',
    'correlation-infant': 'mortalité infantile',
    'correlation-learning': 'éducation',
    'correlation-consumption': 'consommation',
    'correlation-aic': 'consommation individuelle',
    'correlation-manufacturing': 'industrie',
    'correlation-freedom': 'liberté humaine',
    'correlation-happiness': 'satisfaction de vie'
  };
  const OUVERTURE = ['pib-melenchon', ...Object.keys(MOTIVATIONS), 'q-1820', 'deux-siecles', 'moore-cpu-gpu', 'plan'];
  const ANNEXES_DEPLACEES = ['correlation-life', 'pib-q', 'pib-combien', 'ons-productivite'];
  const RETRAITS = ['bastiat', 'bastiat-citation', 'va-def', 'importations', 'ai-croissance', 'master-mesure', 'pause-repartition',
    'master-brut-net', 'flux-stock', 'master-stocks-vente',
    'us-2022', 'labo-q', 'labo-scen', 'deux-biens', 'deux-biens-reel', 'us-2022-reponse',
    'master-ipc-panier', 'ipc-defl-fr',
    'salaire-q', 'salaire-scen', 'pouvoir-achat', 'p2-verif', 'pause',
    'fr-us-q', 'fr-us', 'par-habitant', 'ph-verif', 'ralentissement',
    'decomp-q', 'decomp', 'keynes', 'keynes-bilan', 'long-terme-verif']; // Retraits et fusion demandés le 27 octobre.
  const PARTIES = [
    {id: 'p1', title: 'Que mesure-t-on ?', ids: [
      'histoire-pib', 'pib-mots', 'pib-def', 'pain', 'pain-revenus', 'va-revenus-schema', 'pain-depenses', 'va-depenses-schema',
      'pib-depenses', 'ai-investissement', 'master-composantes-france', 'trois-approches',
      'four', 'master-stocks-production',
      'ca-compte-1', 'ca-compte-2', 'loyers-imputes',
      'patrimoine', 'master-patrimoine-monde', 'master-patrimoine-france',
      'master-patrimoine-us', 'notre-dame',
      'limites-1', 'limites-2', 'stiglitz-sen-fitoussi']},
    {id: 'p2', title: 'Comment prendre en compte les changements de prix ?', ids: [
      'nominal-reel', 'formule-reel',
      'france-1950', 'ipc-deflateur', 'master-ipc-formule', 'prix-americains', 'master-ipc-poids',
      'master-ipc-limites', 'master-ipc-heterogeneite', 'master-inflation-mesures',
      'master-cpi-core', 'courses', 'ppa-change', 'chine-etats-unis']},
    {id: 'p3', title: 'Par personne et par heure ?', ids: [
      'identite', 'identite-defs', 'r70-q', 'regle-70',
      'exercice-niveau-vie-1', 'exercice-niveau-vie-2', 'exercice-niveau-vie-3', 'exercice-niveau-vie-4',
      'exercice-niveau-vie-5',
      'long-terme', 'heures-choix']},
    {id: 'p4', title: 'Pour qui ?', ids: [
      'master-rnb', 'master-rnb-quiz', 'rdb-q', 'pib-revenu', 'niveau-vie', 'us-mediane', 'redistribution',
      'comptes-distribues', 'redistribution-elargie', 'transferts-nature']},
    {id: 'p5', title: 'À quel coût ?', ids: [
      'emissions-monde', 'kaya', 'decouplage-def', 'kaya-q', 'fr-decouplage', 'decouplage-verif', 'empreinte',
      'empreinte-verif', 'decouplage-monde', 'decouplage-habitant']}
  ];
  const CONCLUSION = ['deux-camps', 'reponse', 'debattu', 'retenir-definitions', 'formules-1', 'reperes-fin', 'lectures'];

  // 27 octobre 2026 : titre autonome après le retrait de l’exemple américain de 2022.
  edit('ipc-deflateur', s => { s.title = "Deux indices d'inflation importants à connaître"; });
  note('ipc-deflateur', '<p>27 octobre 2026 : titre renommé à la demande d’Arnaud. La comparaison IPC / déflateur est conservée après le retrait des exemples américains de 2022.</p>');
  ['ppa-change', 'chine-etats-unis'].forEach(id =>
    note(id, '<p>27 octobre 2026 : déplacée à la fin de la partie 2, renommée « Comment prendre en compte les changements de prix ? », à la demande d’Arnaud. Contenu et sources conservés.</p>'));

  // 1. Motivation dans l’introduction ; l’ancienne séparation p-importance est supprimée.
  Object.entries(MOTIVATIONS).forEach(([id, sujet]) => edit(id, s => {
    const avant = s.title;
    s.title = `Pourquoi s’intéresser au PIB ? PIB et ${sujet}`;
    note(id, `<p>${DATE} : « ${avant} » rejoint l’introduction après Mélenchon–Kennedy, avant les données sur la croissance française. Titre descriptif harmonisé : « ${s.title} ». ${ORIGINE}</p>`);
  }));
  ANNEXES_DEPLACEES.forEach(id => edit(id, s => {
    s.appendix = true;
    s.part = 'Annexes';
    note(id, id === 'ons-productivite'
      ? '<p>27 octobre 2026 : passage en annexe demandé par Arnaud. Contenu et sources conservés.</p>'
      : `<p>${DATE} : passage en annexe demandé par Arnaud ; contenu conservé. Pour l’espérance de vie, la courbe de Preston reste dans l’introduction. ${ORIGINE}</p>`);
  }));
  ['limites-1', 'limites-2', 'stiglitz-sen-fitoussi'].forEach(id =>
    note(id, `<p>${DATE} : déplacée à la fin de la partie 1, « Que mesure-t-on ? », après la définition et la frontière de production. ${ORIGINE}</p>`));

  // 2. Fiche « Ce qu’il faut retenir : les définitions », reprise du libellé des diapositives.
  const DEFINITIONS = [
    ['Valeur ajoutée', 'Production − consommations intermédiaires : la richesse créée par l’unité elle-même.'],
    ['Produit intérieur brut (PIB)', 'Valeur de la production finale réalisée pendant une période par les unités résidentes d’un territoire.'],
    ['Investissement (FBCF)', 'Achat de biens durables, utilisés plus d’un an pour produire : four, machine, logiciel, logement.'],
    ['Flux et stock', 'Un flux se mesure sur une période (production, revenu) ; un stock, à une date (patrimoine, capital, dette).'],
    ['PIB réel (en volume)', 'Évalué aux prix d’une année de référence : il ne varie qu’avec les quantités (et la qualité).'],
    ['Déflateur du PIB', 'Indice de prix de la production intérieure : 100 × PIB nominal / PIB réel.'],
    ['Indice des prix à la consommation', 'Prix des biens et services consommés par les ménages, importés ou non, à qualité constante.'],
    ['Pouvoir d’achat', 'Quantité de biens et de services qu’un revenu permet d’acheter.'],
    ['Parité de pouvoir d’achat (PPA)', 'Taux de conversion qui égalise le pouvoir d’achat des monnaies : on compare des quantités de biens.'],
    ['Productivité horaire', 'PIB réel / heures travaillées : ce que produit, en moyenne, une heure de travail.'],
    ['Niveau de vie', 'Revenu disponible du ménage divisé par son nombre d’unités de consommation.'],
    ['Intensité en émissions', 'Émissions par unité de PIB réel. Elle baisse avec l’efficacité énergétique et l’électricité décarbonée.']
  ];
  window.SLIDES.push({
    id: 'retenir-definitions', part: 'Conclusion', title: 'Ce qu’il faut retenir : les définitions', cls: 'rev-retenir',
    html: `<div class="p-center"><div class="rev-retenir-grid">${DEFINITIONS.map(([terme, texte]) =>
      `<div class="rev-retenir-item"><div class="rev-retenir-term">${terme}</div><p>${texte}</p></div>`).join('')}</div></div>`,
    source: 'Définitions reprises des diapositives du chapitre : Insee pour les comptes nationaux, les prix et le niveau de vie ; OCDE pour la productivité.'
  });
  note('retenir-definitions', `<p>${DATE} : fiche demandée par Arnaud. Texte proposé à partir des définitions des diapositives (va-def, pib-def, four, flux-stock, nominal-reel, ipc-deflateur, salaire-scen, fr-us, identite-defs, niveau-vie, kaya), à valider. Pas de cases à cocher : les bilans de savoir-faire restent retirés. ${ORIGINE}</p>`);

  // 3. Fiche « Ce qu’il faut retenir : les formules » : fusion de formules-1 et formules-2,
  //    plus l’IPC à panier fixe, le RNB et la décomposition des émissions, déjà présents dans le cours.
  const FORMULES = [
    ['Valeur ajoutée', '<span class="k-vol">VA</span> = <span class="k-nom">production</span> − <span class="k-moins">consommations intermédiaires</span>'],
    ['PIB par les dépenses', '<var>Y</var> = <var>C</var> + <var>I</var> + <var>G</var> + <var>X</var> − <span class="k-moins"><var>M</var></span>'],
    ['Revenu national brut', 'RNB = PIB + revenus primaires reçus de l’étranger − revenus primaires versés'],
    ['Du nominal au réel', '<span class="k-vol">PIB réel</span> = <span class="k-nom">PIB nominal</span> / (<span class="k-prix">déflateur</span> / 100)'],
    ['Croissance réelle', '1 + <span class="k-vol"><var>g</var><sub>réel</sub></span> = (1 + <span class="k-nom"><var>g</var><sub>nominal</sub></span>) / (1 + <span class="k-prix">π</span>)'],
    ['Indice des prix à panier fixe', 'IPC<sub><var>t</var></sub> = 100 × Σ<sub><var>i</var></sub> <var>w</var><sub><var>i</var>,0</sub> × <span class="k-prix"><var>p</var><sub><var>i</var>,<var>t</var></sub></span> / <span class="k-prix"><var>p</var><sub><var>i</var>,0</sub></span>'],
    ['Pouvoir d’achat', '(1 + <span class="k-nom">hausse du revenu</span>) / (1 + <span class="k-prix">inflation</span>) − 1'],
    ['Par habitant', '<var>g</var><sub>Y/N</sub> ≈ <span class="k-vol"><var>g</var><sub>Y</sub></span> − <span class="k-pop"><var>g</var><sub>N</sub></span>'],
    ['Production par habitant', '<var>Y</var>/<var>N</var> = <span class="k-vol"><var>Y</var>/<var>H</var></span> × <span class="k-h"><var>H</var>/<var>L</var></span> × <span class="k-pop"><var>L</var>/<var>N</var></span>'],
    ['Temps de doublement', '<var>T</var> ≈ 70 / <var>g</var> (<var>g</var> en %)'],
    ['Niveau de vie', 'revenu disponible / <span class="k-pop">unités de consommation</span> (<span class="k-pop">1</span> ; <span class="k-pop">0,5</span> ; <span class="k-pop">0,3</span>)'],
    ['Émissions', '<span class="k-em"><var>E</var></span> = <var>N</var> × <var>Y</var>/<var>N</var> × <span class="k-int"><var>E</var>/<var>Y</var></span> ; <span class="k-em"><var>g</var><sub>E</sub></span> ≈ <span class="k-vol"><var>g</var><sub>Y</sub></span> + <span class="k-int"><var>g</var><sub>E/Y</sub></span>']
  ];
  edit('formules-1', s => {
    s.title = 'Ce qu’il faut retenir : les formules';
    s.cls = [s.cls, 'rev-retenir'].filter(Boolean).join(' ');
    s.html = `<div class="p-center"><div class="p-grid3 rev-formules">${FORMULES.map(([titre, expression]) =>
      `<div class="pj-fm"><div class="t">${titre}</div><div class="e">${expression}</div></div>`).join('')}</div></div>`;
    window.NOTES[s.id] = `<p>Les outils de tout le chapitre. L’examen demande de les appliquer à des valeurs nouvelles, pas de les réciter. Conseil : refaire chaque calcul du cours sans regarder, puis changer une valeur.</p><p>${DATE} : fusion de « Savez-vous mesurer la production et les prix ? » (formules-1) et de « Savez-vous décomposer la croissance ? » (formules-2), avec trois formules déjà vues : RNB (master-rnb), IPC à panier fixe (master-ipc-formule), décomposition des émissions (kaya). ${ORIGINE}</p>`;
  });
  if (byId('formules-2')) {
    window.SLIDES = window.SLIDES.filter(s => s.id !== 'formules-2');
    delete window.NOTES['formules-2'];
  } else warn('formules-2 absente : fusion déjà faite ?');

  // 4. Fiche « Ce qu’il faut retenir : les ordres de grandeur » : « 70 / g » rejoint les formules.
  edit('reperes-fin', s => {
    s.title = 'Ce qu’il faut retenir : les ordres de grandeur';
    s.cls = [s.cls, 'rev-retenir'].filter(Boolean).join(' ');
    const modele = document.createElement('template');
    modele.innerHTML = s.html;
    const carte = [...modele.content.querySelectorAll('.rep-card')].find(c => c.textContent.includes('doubler'));
    if (!carte) { warn('reperes-fin : case « 70 / g » introuvable'); return; }
    carte.setAttribute('data-rep', 'PIB par habitant de la France, de 1820 à 2022');
    carte.setAttribute('data-rep-value', '× 22');
    carte.querySelector('.rep-value').textContent = '× 22';
    carte.querySelector('.rep-label').textContent = 'PIB par habitant de la France, de 1820 à 2022';
    s.html = modele.innerHTML;
    note(s.id, `<p>${DATE} : titre harmonisé avec les fiches « Ce qu’il faut retenir ». La case « 70 / g », désormais dans les formules, est remplacée par « × 22 » (deux-siecles, Maddison Project Database 2023). ${ORIGINE}</p>`);
  });

  // 5. Plan d’ouverture.
  edit('plan', s => { s.title = 'Cinq questions sur le PIB et la croissance'; });

  // 6. Corrections locales.
  edit('pouvoir-achat', s => {
    const avant = s.html;
    s.html = s.html
      .replace('<div class="p-w60">', '<div class="p-w50">')
      .replace('style="width:100%;height:600px"', 'style="width:100%;height:540px"')
      .replace('<div class="p-grow p-col" style="gap:26px">', '<div class="p-grow p-col" style="gap:18px">')
      .replace(/<p class="p-sub">Le pouvoir d.achat suit[\s\S]*?<\/p>/,
        '<p class="p-sub">Le pouvoir d’achat suit le RDB, déflaté par le prix de la dépense de consommation des ménages. L’écart avec le PIB tient à la répartition, aux prix et à la taille des ménages (partie 4).</p>');
    if (s.html === avant || s.html.includes('(partie 5)')) warn('pouvoir-achat : correction non appliquée');
    note(s.id, `<p>${DATE} : graphique ramené à la moitié de la largeur et à 540 px de haut, texte de droite raccourci, pour supprimer le débordement sur le titre et le badge ; renvoi vers la partie 4, « Pour qui ? ».</p>`);
  });
  edit('nominal-reel', s => {
    const modele = document.createElement('template');
    modele.innerHTML = s.html;
    const paires = modele.content.querySelectorAll('.p-grid2');
    if (paires.length !== 2) { warn('nominal-reel : structure inattendue'); return; }
    s.html = `<div class="p-center"><div class="p-col" style="gap:26px;width:100%">${paires[0].outerHTML}<div data-step="1">${paires[1].outerHTML}</div></div></div>`;
  });
  remplacerNote('nominal-reel', 'Deux définitions, puis (clic) les deux suivantes, qui les remplacent.',
    `Deux définitions, puis (clic) les deux suivantes, qui s’ajoutent en dessous. Depuis le ${DATE}, les quatre restent visibles ensemble, PDF compris ; le PDF n’affichait que les deux dernières.`);

  // 7. Renvois aux numéros de partie dans les notes enseignantes.
  remplacerNote('emissions-monde', 'Ne pas développer : on y revient en partie 5.',
    'Ce graphique ouvre la partie 5, « À quel coût ? » : le budget carbone peut être développé ici.');
  note('preston', `<p>${DATE} : motivation dans l’introduction. Annoncer que le PIB, la PPA et l’échelle logarithmique seront définis dans les parties 1 à 3. ${ORIGINE}</p>`);
  note('deux-camps', `<p>${DATE} : placée en conclusion pour introduire « Alors, faut-il encore de la croissance ? ». ${ORIGINE}</p>`);

  // 8. Nouvel ordre du corps et diapositives déplacées au début des annexes.
  // Retraits demandés : exclure aussi les écrans de la reprise des identifiants non déclarés.
  window.SLIDES = window.SLIDES.filter(s => !RETRAITS.includes(s.id));
  RETRAITS.forEach(id => { delete window.NOTES[id]; });
  const declares = ['couverture', ...OUVERTURE, ...PARTIES.flatMap(p => [p.id, ...p.ids]), ...CONCLUSION];
  const doublons = declares.filter((id, i) => declares.indexOf(id) !== i);
  if (doublons.length) throw new Error('Réorganisation : identifiants déclarés deux fois : ' + doublons.join(', '));
  const corps = window.SLIDES.filter(s => !s.appendix);
  const anciennesAnnexes = window.SLIDES.filter(s => s.appendix && !ANNEXES_DEPLACEES.includes(s.id));
  const annexes = [byId('master-annexes'), ...ANNEXES_DEPLACEES.map(byId),
    ...anciennesAnnexes.filter(s => s.id !== 'master-annexes')].filter(Boolean);
  const parId = new Map(corps.map(s => [s.id, s]));
  const ordre = [];
  declares.forEach(id => { if (parId.has(id)) ordre.push(parId.get(id)); else warn(`identifiant déclaré absent : ${id}`); });
  const places = new Set(ordre.map(s => s.id));
  corps.forEach((s, i) => {
    if (places.has(s.id)) return;
    let j = i - 1;
    while (j >= 0 && !places.has(corps[j].id)) j--;
    const k = j >= 0 ? ordre.findIndex(x => x.id === corps[j].id) + 1 : 0;
    ordre.splice(k, 0, s);
    places.add(s.id);
    warn(`diapositive non déclarée, conservée après ${j >= 0 ? corps[j].id : 'le début'} : ${s.id}`);
  });
  window.SLIDES = [...ordre, ...annexes];

  // 9. Libellés de partie fixés par appartenance.
  OUVERTURE.forEach(id => edit(id, s => { s.part = 'Ouverture'; }));
  PARTIES.forEach((partie, i) => [partie.id, ...partie.ids].forEach(id => {
    const s = byId(id);
    if (s) s.part = `Partie ${i + 1} · ${partie.title}`;
  }));
  CONCLUSION.forEach(id => edit(id, s => { s.part = 'Conclusion'; }));

  // 10. Plan et séparations reconstruits pour les cinq parties.
  window.harmoniserPlanChapitre(PARTIES.map(({id, title}) => ({id, title})));
  // Les compteurs généraux sont exposés aussi par la couche du master.
  if (window.MASTER_INTEGRATION) {
    window.MASTER_INTEGRATION.mainAdded = window.MASTER_INTEGRATION.mainAdded.filter(id => !RETRAITS.includes(id));
    window.MASTER_INTEGRATION.mainCount = window.SLIDES.filter(s => !s.appendix).length;
    window.MASTER_INTEGRATION.totalCount = window.SLIDES.length;
  }

  // 11. Même pastille de provenance que les données empiriques d’Antonin.
  // Liste explicite : un SVG ou une source bibliographique ne suffit pas à qualifier une slide.
  // Les mentions d’estimation et de reconstruction historique restent dans les légendes.
  const OBSERVATIONS_A_ETIQUETER = [
    'correlation-infant', 'correlation-learning', 'correlation-consumption',
    'correlation-aic', 'correlation-manufacturing', 'correlation-freedom',
    'correlation-happiness', 'correlation-life',
    'decouplage-def', 'ai-investissement',
    'prix-americains', 'chine-etats-unis', 'ons-productivite',
    'redistribution-elargie', 'transferts-nature', 'decouplage-monde',
    'decouplage-habitant', 'master-patrimoine-monde', 'master-patrimoine-france',
    'master-patrimoine-us', 'master-composantes-france', 'master-cpi-core',
    'master-ipc-poids', 'master-ipc-heterogeneite', 'master-informel',
    'master-nightlights', 'master-bpp-comparaison',
  ];
  OBSERVATIONS_A_ETIQUETER.forEach(id => edit(id, s => { s.prov = 'obs'; }));

  window.REORGANISATION = {
    date: '2026-10-23', plan: 'plan_reorganisation_2026-10-23.md',
    parties: PARTIES.map(({id, title, ids}) => ({id, title, ids})), ouverture: OUVERTURE, conclusion: CONCLUSION,
    ordre: declares, ajouts: ['retenir-definitions'], retraits: ['p-importance', ...RETRAITS],
    annexesDeplacees: ANNEXES_DEPLACEES, fusions: {'formules-1': ['formules-2']},
    pagesNumerotees: window.SLIDES.filter(s => s.layout !== 'cover' && !s.appendix).length,
    donneesObserveesEtiquetees: OBSERVATIONS_A_ETIQUETER,
    avertissements
  };
})();
