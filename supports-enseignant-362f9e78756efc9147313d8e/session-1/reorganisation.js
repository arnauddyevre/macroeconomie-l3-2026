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
  const ANNEXES_FIN_CHAPITRE = ['heures-choix', 'master-rnb-quiz', 'niveau-vie', 'us-mediane'];
  const FICHES_ANNEXES = [
    'retenir-definitions', 'retenir-definitions-prix', 'retenir-definitions-revenus', 'retenir-definitions-climat',
    'formules-1', 'retenir-formules-prix', 'retenir-formules-croissance',
    'reperes-fin', 'retenir-reperes-repartition-climat'
  ];
  if (JSON.stringify(window.FICHES_REVISION?.ids) !== JSON.stringify(FICHES_ANNEXES)) {
    throw new Error('Fiches de référence absentes ou ordre non déclaré.');
  }
  const ANNEXES_DEPLACEES = ['correlation-life', 'pib-q', 'pib-combien', 'ons-productivite', ...ANNEXES_FIN_CHAPITRE];
  const RETRAITS = ['bastiat', 'bastiat-citation', 'va-def', 'importations', 'ai-croissance', 'master-mesure', 'pause-repartition',
    'master-brut-net', 'flux-stock', 'master-stocks-vente',
    'us-2022', 'labo-q', 'labo-scen', 'deux-biens', 'deux-biens-reel', 'us-2022-reponse',
    'master-ipc-panier', 'ipc-defl-fr',
    'salaire-q', 'salaire-scen', 'pouvoir-achat', 'p2-verif', 'pause',
    'fr-us-q', 'fr-us', 'par-habitant', 'ph-verif', 'ralentissement',
    'decomp-q', 'decomp', 'keynes', 'keynes-bilan', 'long-terme-verif',
    'redistribution', 'redistribution-elargie', 'decouplage-verif', 'empreinte-verif', 'croissance-possibilites']; // Derniers retraits demandés le 1er novembre 2026.
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
      'long-terme']},
    {id: 'p4', title: 'Pour qui ?', ids: [
      'master-rnb', 'rdb-q', 'pib-revenu',
      'comptes-distribues', 'transferts-nature',
      'croissance-rangs-exemple', 'croissance-psid']},
    {id: 'p5', title: 'À quel coût ?', ids: [
      'kaya', 'decouplage-def', 'nordhaus', 'emissions-monde', 'kaya-q', 'fr-decouplage', 'empreinte',
      'decouplage-monde', 'decouplage-habitant', 'decouplage-emergents']}
  ];
  const CONCLUSION = ['conclusion-divider', 'deux-camps', 'reponse', 'debattu', 'transition-croissance', 'lectures'];

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
    note(id, ANNEXES_FIN_CHAPITRE.includes(id)
      ? '<p>1er novembre 2026 : passage en annexe demandé par Arnaud pour alléger la fin du chapitre. Contenu et sources conservés.</p>'
      : id === 'ons-productivite'
        ? '<p>27 octobre 2026 : passage en annexe demandé par Arnaud. Contenu et sources conservés.</p>'
        : `<p>${DATE} : passage en annexe demandé par Arnaud ; contenu conservé. Pour l’espérance de vie, la courbe de Preston reste dans l’introduction. ${ORIGINE}</p>`);
  }));
  ['limites-1', 'limites-2', 'stiglitz-sen-fitoussi'].forEach(id =>
    note(id, `<p>${DATE} : déplacée à la fin de la partie 1, « Que mesure-t-on ? », après la définition et la frontière de production. ${ORIGINE}</p>`));

  // 2–4. Les neuf fiches sont préparées par fiches_revision.js.
  // Conserver le retrait de l’ancienne seconde fiche de formules historique.
  if (byId('formules-2')) {
    window.SLIDES = window.SLIDES.filter(s => s.id !== 'formules-2');
    delete window.NOTES['formules-2'];
  } else warn('formules-2 absente : fusion déjà faite ?');

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
  note('deux-camps', '<p>1er novembre 2026 : réponse aux deux interventions de l’ouverture, dans la même disposition photographique. Les puces sont des réponses du cours, pas des citations attribuées aux intervenants.</p>');

  // 1er novembre 2026 : les neuf fiches révisées restent ensemble en tête des annexes.
  // Leur contenu est créé par fiches_revision.js ; leur ordre reste déclaré ici.
  FICHES_ANNEXES.forEach(id => edit(id, s => {
    s.appendix = true;
    s.part = 'Annexes';
    note(id, '<p>1er novembre 2026 : fiches de référence actualisées à la demande d’Arnaud et regroupées au début des annexes. Les cinq enseignements restent dans la conclusion.</p>');
  }));

  // 8. Nouvel ordre du corps et diapositives déplacées au début des annexes.
  // Retraits demandés : exclure aussi les écrans de la reprise des identifiants non déclarés.
  window.SLIDES = window.SLIDES.filter(s => !RETRAITS.includes(s.id));
  RETRAITS.forEach(id => { delete window.NOTES[id]; });
  const declares = ['couverture', ...OUVERTURE, ...PARTIES.flatMap(p => [p.id, ...p.ids]), ...CONCLUSION];
  const doublons = declares.filter((id, i) => declares.indexOf(id) !== i);
  if (doublons.length) throw new Error('Réorganisation : identifiants déclarés deux fois : ' + doublons.join(', '));
  const corps = window.SLIDES.filter(s => !s.appendix);
  const anciennesAnnexes = window.SLIDES.filter(s => s.appendix && !ANNEXES_DEPLACEES.includes(s.id) && !FICHES_ANNEXES.includes(s.id));
  const annexes = [byId('master-annexes'), ...FICHES_ANNEXES.map(byId), ...ANNEXES_DEPLACEES.map(byId),
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
    'croissance-psid', 'comptes-distribues', 'transferts-nature', 'decouplage-monde',
    'decouplage-habitant', 'decouplage-emergents', 'transition-croissance', 'master-patrimoine-monde', 'master-patrimoine-france',
    'master-patrimoine-us', 'master-composantes-france', 'master-cpi-core',
    'master-ipc-poids', 'master-ipc-heterogeneite', 'master-informel',
    'master-nightlights', 'master-bpp-comparaison',
  ];
  OBSERVATIONS_A_ETIQUETER.forEach(id => edit(id, s => { s.prov = 'obs'; }));

  window.REORGANISATION = {
    date: '2026-10-23', plan: 'plan_reorganisation_2026-10-23.md',
    parties: PARTIES.map(({id, title, ids}) => ({id, title, ids})), ouverture: OUVERTURE, conclusion: CONCLUSION,
    ordre: declares, ajouts: [...FICHES_ANNEXES.filter(id => !['formules-1', 'reperes-fin'].includes(id)), 'croissance-rangs-exemple', 'croissance-psid', 'decouplage-emergents', 'conclusion-divider', 'transition-croissance'], retraits: ['p-importance', ...RETRAITS],
    fichesAnnexes: FICHES_ANNEXES, annexesDeplacees: [...FICHES_ANNEXES, ...ANNEXES_DEPLACEES], fusions: {'formules-1': ['formules-2'], 'comptes-distribues': ['redistribution-elargie']},
    pagesNumerotees: window.SLIDES.filter(s => s.layout !== 'cover' && !s.appendix).length,
    donneesObserveesEtiquetees: OBSERVATIONS_A_ETIQUETER,
    avertissements
  };
})();
