/* Adaptation 2026 — Arnaud Dyèvre. Originaux et historique conservés séparément.
 * Ce fichier est exécuté avant la construction du diaporama d’Antonin.
 * Support enseignant de relecture : ne pas distribuer directement. */
(function () {
  'use strict';
  const date = '22 octobre 2026';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const byId = id => window.SLIDES.find(s => s.id === id);
  const edit = (id, fn) => { const s = byId(id); if (!s) throw new Error(`Slide absente : ${id}`); fn(s); };
  const addAfter = (id, slides) => {
    const i = window.SLIDES.findIndex(s => s.id === id);
    if (i < 0) throw new Error(`Point d’insertion absent : ${id}`);
    window.SLIDES.splice(i + 1, 0, ...slides);
  };
  const body = (...paras) => `<div class="rev-body">${paras.map(p=>`<p>${p}</p>`).join('')}</div>`;
  const figure = (name, alt, caption) => `<figure class="rev-figure"><img src="figures/${name}.svg" alt="${esc(alt)}"><figcaption>${caption}</figcaption></figure>`;
  const slide = (id, title, part, html, source, note='', contentDate=date) => {
    window.NOTES[id] = contentDate===date ? `<p>Ajout 2026, ${date}. ${note}</p>` : `<p>Emplacement créé le ${date} ; contenu intégré le ${contentDate}. ${note}</p>`;
    return {id,title,part,html,source};
  };
  const pending = (id,title,lot,missing,part) => slide(id,title,part,
    `<div class="rev-body"><div class="rev-pending"><div class="rev-pending-label">EMPLACEMENT RÉSERVÉ · ${lot}</div><p>${missing}</p><p class="rev-small">La figure ou le texte sera intégré après lecture de la source complète. Aucun résultat n’est estimé pour remplir cet emplacement.</p></div></div>`,
    'Collecte et références : donnees_a_reunir.md.', 'Élément incomplet, à résoudre avant diffusion.');
  const P1='Partie 1 · Que mesure-t-on ?', P2='Partie 2 · Après les prix', P3='Partie 3 · Par personne et par heure', P4='Partie 4 · Qui reçoit les revenus ?', P5='Partie 5 · Croissance et bien-être';
  const originalLine=window.Charts.line;
  window.Charts.line=function(container,options){
    const chart = originalLine(container,{...options,series:options.series.map((s,i)=>({...s,dash:s.dash===undefined?i%2===1:s.dash}))});
    if (container.closest('#pj-ds')) {
      const slide = container.closest('.slide');
      slide.classList.toggle('rev-longrun-log', !!options.y.log);
      slide.querySelector('.rev-moore-card')?.remove();
      if (options.y.log) addLongRunTrends(container, chart, options);
    }
    return chart;
  };
  // Ajustements en logarithmes : uniquement dans la seconde vue de deux-siecles.
  function addLongRunTrends(container, chart, options) {
    const CH = window.Charts;
    const stats = options.series.map(series => {
      const rows = series.data.filter(([year,value]) => year >= 1820 && year <= 2022 && Number.isFinite(value) && value > 0);
      const n = rows.length;
      const meanX = rows.reduce((sum,[year]) => sum + year - 1820,0) / n;
      const meanY = rows.reduce((sum,[,value]) => sum + Math.log(value),0) / n;
      const b = rows.reduce((sum,[year,value]) => sum + (year-1820-meanX) * (Math.log(value)-meanY),0)
        / rows.reduce((sum,[year]) => sum + (year-1820-meanX)**2,0);
      const a = meanY - b * meanX;
      const cagr = 100 * (Math.pow(rows.at(-1)[1] / rows[0][1], 1 / (rows.at(-1)[0] - rows[0][0])) - 1);
      return {name:series.name,color:CH.PAL[series.color] || series.color,a,b,n,cagr};
    });
    const firstLine = chart.svg.querySelector('.ch-line');
    const trends = CH.el('g', {class:'rev-longrun-trends','aria-label':'Tendances ajustées en logarithmes'}, firstLine.parentNode);
    firstLine.parentNode.insertBefore(trends, firstLine);
    const animated = options.animate !== false && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (animated) {
      const id = 'longrun-fit-' + (++addLongRunTrends.serial);
      const clip = CH.el('clipPath',{id,clipPathUnits:'userSpaceOnUse'},chart.svg.querySelector('defs'));
      CH.el('rect',{x:0,y:0,width:chart.svg.getAttribute('width'),height:chart.svg.getAttribute('height'),class:'ch-dash-reveal',style:'animation-duration:2s'},clip);
      trends.setAttribute('clip-path',`url(#${id})`);
    }
    stats.forEach(item => {
      CH.el('path',{
        d:`M${chart.S.X(1820)},${chart.S.Y(Math.exp(item.a))} L${chart.S.X(2022)},${chart.S.Y(Math.exp(item.a+item.b*202))}`,
        class:'rev-longrun-fit',stroke:item.color,'stroke-dasharray':'8 6','stroke-width':2.5,opacity:.48,fill:'none',
        'aria-label':`Tendance de ${item.name}`,'data-series':item.name,'data-slope':item.b
      },trends);
    });
    const card = document.createElement('aside');
    card.className = 'rev-moore-card';
    card.innerHTML = `<h3>“Moore's law of Economics”</h3><p>Croissance annuelle moyenne<br>du PIB par habitant, 1820–2022</p><dl>${['France','États-Unis','Monde'].map(name => {
      const item = stats.find(s => s.name === name);
      return `<div style="color:${item.color}"><dt>${name}</dt><dd>${CH.fmt(item.cagr,2)} %</dd></div>`;
    }).join('')}</dl>`;
    const panel = container.closest('.slide').querySelector('.p-grow');
    panel.insertBefore(card, panel.children[1]);
    container.dataset.growthRates = JSON.stringify(stats);
  }
  addLongRunTrends.serial = 0;
  const insee = link('https://www.insee.fr/fr/statistiques/8974371','Insee Analyses n° 118, comptes distribués, édition 2026');
  const wdi = link('https://data.worldbank.org','Banque mondiale, World Development Indicators');
  const owid = link('https://ourworldindata.org/co2-gdp-decoupling','Our World in Data, CO₂–GDP decoupling');

  window.COURSE.author = 'Arnaud Dyèvre';
  window.COURSE.title = 'Mesurer la richesse nationale';
  window.COURSE.description = 'Chapitre 1 de macroéconomie L3 : production, revenus, prix, niveaux de vie et limites du PIB.';
  edit('couverture',s=>{
    s.title = `1. ${window.COURSE.title}`;
    s.html = `<div class="rev-cover"><div class="rev-cover-kicker">Macroéconomie L3</div><h1>1. Mesurer la richesse nationale</h1><p>Arnaud Dyèvre · HEC Paris</p><p class="rev-cover-term">Automne 2026</p></div>`;
  });
  // La couverture est volontairement sans graphique ; désactiver son ancien tracé.
  window.Deck.on('couverture', {enter(){}});
  // Même source, unité et période que les courbes France/Monde déjà présentes.
  edit('deux-siecles', s => {
    s.title = 'En 200 ans, la production par habitant a 22x';
    const us = window.MADDISON_US_DATA.rows;
    const ratio = us.find(r=>r[0]===2022)[1] / us.find(r=>r[0]===1820)[1];
    const template = document.createElement('template'); template.innerHTML = s.html;
    const comparison = document.createElement('div'); comparison.className = 's';
    comparison.textContent = `× ${window.Charts.fmt(ratio, 0)} aux États-Unis`;
    template.content.querySelector('.p-kpi').appendChild(comparison);
    s.html = template.innerHTML;
    window.NOTES[s.id] += '<p>23 octobre 2026 : titre raccourci selon la demande d’Arnaud. En vue logarithmique seulement, encadré « Moore’s law of Economics » et trois tendances MCO de ln(PIB par habitant) sur l’année centrée en 1820, sans interpolation. L’encadré présente les taux annuels moyens géométriques entre 1820 et 2022 (202 ans), distincts des pentes des ajustements : France 1,532655 %, États-Unis 1,539060 %, Monde 1,342388 %. France et États-Unis : 203 observations annuelles ; Monde : 21 dates disponibles, chaque observation de la régression de sa série ayant le même poids. Les droites ne passent pas nécessairement par les extrémités observées. L’intitulé est une analogie pédagogique de croissance composée, pas une loi empirique établie. Vue linéaire : aucune tendance ni encadré.</p>';
    window.NOTES[s.id] += '<p>23 octobre 2026 : ajout demandé par Arnaud de la série américaine, Maddison Project Database 2023, dollars internationaux de 2011 en PPA, 1820–2022. Courbe orange animée, même bascule linéaire/logarithmique et consultation des valeurs. Le facteur 22 du titre concerne toujours la France.</p>';
  });
  addAfter('couverture', [{
    id: 'pib-melenchon', title: 'Mesurer la richesse : au cœur des débats depuis toujours', part: 'Ouverture', cls: 'rev-meeting',
    html: `<div class="rev-meeting-grid"><figure class="rev-meeting-column"><div class="rev-meeting-visual"><img class="rev-meeting-photo" src="sources/fournis/melenchon_meeting_clermont_ferrand_2026-10-11.png" alt="Jean-Luc Mélenchon au pupitre pendant un meeting"><p class="rev-photo-credit">Capture d’écran</p></div><blockquote>« Je creuse un trou, le PIB augmente. Je le rebouche, le PIB augmente. Je monte dans ma voiture, je rentre dans un mur, le PIB augmente. Pour refaire le mur, pour refaire la bagnole. [...] Le PIB, c’est rien. C’est une évaluation en valeur. »</blockquote><figcaption><p class="rev-meeting-speaker">Jean-Luc Mélenchon</p><p class="rev-meeting-date">Dimanche 11 octobre 2026, Clermont-Ferrand</p></figcaption></figure><figure class="rev-meeting-column rev-kennedy" aria-label="Robert Kennedy, mars 1968"><div class="rev-kennedy-text"><div class="rev-meeting-visual"><img class="rev-meeting-photo" src="sources/fournis/robert_kennedy_convention_democrate_1964.jpg" alt="Robert Kennedy interviewé à la Convention démocrate de 1964, photographié par Warren K. Leffler"><p class="rev-photo-credit"><a href="https://commons.wikimedia.org/wiki/File:Robert_Kennedy_at_the_1964_Democratic_National_Convention_(cropped).jpg" target="_blank" rel="noopener noreferrer">Warren K. Leffler / Library of Congress, 1964 · Domaine public</a></p></div><blockquote>« Le PIB ne tient pas compte de la santé de nos enfants, de la qualité de leur instruction, ni de la gaieté de leurs jeux. Il ne mesure pas la beauté de notre poésie ou la solidité de nos mariages. Il ne songe pas à évaluer la qualité de nos débats politiques ou l’intégrité de nos représentants. Il ne prend pas en considération notre courage, notre sagesse ou notre culture. (…) En un mot, le PIB mesure tout, sauf ce qui fait que la vie vaut la peine d’être vécue. »</blockquote></div><figcaption><p class="rev-meeting-speaker">Robert Kennedy</p><p class="rev-meeting-date">Candidat à l’investiture démocrate pour l’élection présidentielle américaine, 1968</p></figcaption></figure></div>`,
    source: ''
  }]);
  window.NOTES['pib-melenchon'] = '<p>Ajout demandé par Arnaud le 23 octobre 2026, après la couverture. Photo, citation, date et lieu fournis par Arnaud ; attribution non vérifiée indépendamment. Corrections limitées à « augment » → « augmente », à la majuscule de « Je monte » et à la typographie française. Source originale et empreinte : sources/note_melenchon_2026-10-23.md. Complément demandé le 23 octobre : citation de Robert Kennedy et contexte de mars 1968 sur la moitié droite. Le texte français fourni par Arnaud est conservé, y compris le terme « PIB » et l’omission (…), sans vérification indépendante de la traduction. Aucun rapprochement avec les pages du master.</p>';
  // Exercice validé le 23 octobre 2026 : énoncé seul en projection, correction dans les notes.
  addAfter('regle-70', [{
    id: 'exercice-rattrapage',
    title: 'Combien de temps pour rattraper un pays plus riche ?',
    part: P3, cls: 'rev-rattrapage', exercise: true,
    html: `<div class="rev-rattrapage-content">
      <div class="rev-rattrapage-data">
        <div class="rev-rattrapage-intro"><p>Deux pays fictifs A et B ont des PIB réels par habitant comparables. Leurs taux de croissance annuels restent constants.</p>
        <p class="rev-rattrapage-notation">On note <var>y</var><sub>A,0</sub> &lt; <var>y</var><sub>B,0</sub> les niveaux initiaux, <var>g</var><sub>A</sub> et <var>g</var><sub>B</sub> les taux, et <var>n</var> le nombre d’années écoulées.</p></div>
        <table class="rev-rattrapage-table"><thead><tr><th scope="col">À la date initiale</th><th scope="col">Pays A</th><th scope="col">Pays B</th></tr></thead>
        <tbody><tr><th scope="row">PIB réel par habitant</th><td>20 000 €</td><td>40 000 €</td></tr><tr><th scope="row">Croissance annuelle</th><td>4 %</td><td>2 %</td></tr></tbody></table>
      </div>
      <ol class="rev-rattrapage-questions">
        <li><strong>Trajectoires.</strong> Exprimer <var>y</var><sub>A,<var>n</var></sub>, <var>y</var><sub>B,<var>n</var></sub>, puis leur rapport, en fonction des niveaux initiaux et des taux.</li>
        <li><strong>Rattrapage.</strong> À quelle condition A peut-il rattraper B ? Déterminer le délai à l’aide des logarithmes, puis la première année entière où A atteint ou dépasse B.</li>
        <li><strong>Approximation.</strong> Utiliser ln(1 + <var>g</var>) ≈ <var>g</var> pour obtenir une formule approchée. Comparer les deux résultats numériques.</li>
        <li><strong>Interprétation.</strong> Après le rattrapage, le rapport des PIB par habitant converge-t-il vers 1 ? Expliquer.</li>
      </ol>
      <p class="rev-rattrapage-logs"><strong>Valeurs fournies</strong> · ln 2 ≈ 0,69315 &nbsp;; &nbsp;ln 1,04 ≈ 0,03922 &nbsp;; &nbsp;ln 1,02 ≈ 0,01980</p>
    </div>`,
    source: 'Données fictives. Niveaux initiaux positifs ; taux g en écriture décimale, supérieurs à −1.'
  }]);
  window.NOTES['exercice-rattrapage'] = `
    <p><strong>Correction enseignant — exercice validé le 23 octobre 2026.</strong>
    <a href="exercices/rattrapage_correction_enseignant.pdf" target="_blank" rel="noopener noreferrer">Fiche PDF détaillée (2 pages)</a> ·
    <a href="exercices/rattrapage_correction_enseignant.tex">Source LaTeX modifiable</a>.</p>
    <p><strong>Déroulement indicatif :</strong> 7–8 minutes de recherche, puis 8–12 minutes de correction au tableau (15–20 minutes au total). Aucun minuteur affiché. Les valeurs des logarithmes sont fournies : calculatrice inutile.</p>
    <h3>1. Trajectoires et rapport</h3>
    <p>Par croissance composée, y<sub>i,n+1</sub> = (1 + g<sub>i</sub>)y<sub>i,n</sub>, donc
    y<sub>i,n</sub> = y<sub>i,0</sub>(1 + g<sub>i</sub>)<sup>n</sup>.
    Poser R<sub>n</sub> = y<sub>A,n</sub>/y<sub>B,n</sub> = (y<sub>A,0</sub>/y<sub>B,0</sub>) × [(1 + g<sub>A</sub>)/(1 + g<sub>B</sub>)]<sup>n</sup>.
    Ici R<sub>n</sub> = ½ × (1,04/1,02)<sup>n</sup>.</p>
    <h3>2. Condition et délai exact</h3>
    <p>Les niveaux initiaux sont positifs, y<sub>A,0</sub> &lt; y<sub>B,0</sub>, et les taux sont supérieurs à −1.
    La prise de logarithmes donne ln R<sub>n</sub> = ln(y<sub>A,0</sub>/y<sub>B,0</sub>) + n[ln(1 + g<sub>A</sub>) − ln(1 + g<sub>B</sub>)].
    A atteint B si R<sub>n</sub> ≥ 1. Comme ln est croissant, cette condition équivaut à
    n[ln(1 + g<sub>A</sub>) − ln(1 + g<sub>B</sub>)] ≥ ln(y<sub>B,0</sub>/y<sub>A,0</sub>).</p>
    <p>Si g<sub>A</sub> &gt; g<sub>B</sub>, le coefficient de n est positif :
    T = ln(y<sub>B,0</sub>/y<sub>A,0</sub>) / [ln(1 + g<sub>A</sub>) − ln(1 + g<sub>B</sub>)] et n<sub>min</sub> = ⌈T⌉.
    Si les taux sont égaux, R<sub>n</sub> reste inférieur à 1 ; si g<sub>A</sub> &lt; g<sub>B</sub>, il diminue : aucun rattrapage.</p>
    <p>Application : T ≈ 0,69315/(0,03922 − 0,01980) ≈ <strong>35,7 ans</strong>.
    Avec les logarithmes non arrondis, T ≈ 35,695958. Le seuil de 35,7 ans est une interpolation entre dates annuelles ; la première année entière où A dépasse B est <strong>36</strong>.
    Calcul à la main avec les valeurs fournies : 35 × 0,01942 = 0,67970 &lt; 0,69315 &lt; 0,69912 = 36 × 0,01942.
    Vérification : R<sub>35</sub> ≈ 0,9866 et R<sub>36</sub> ≈ 1,0059.</p>
    <h3>3. Approximation logarithmique</h3>
    <p>Au voisinage de zéro, ln(1 + g) ≈ g : la fonction vaut 0 en g = 0 et sa dérivée y vaut 1.
    Ainsi T ≈ ln(y<sub>B,0</sub>/y<sub>A,0</sub>)/(g<sub>A</sub> − g<sub>B</sub>) = ln 2/0,02 ≈ <strong>34,7 ans</strong>.
    L’approximation sous-estime le délai d’environ 1,04 an et donnerait 35 années entières, contre 36 avec le calcul exact.</p>
    <p>Les 2 points d’écart entre taux ne sont pas le taux exact de croissance du rapport : 1,04/1,02 − 1 ≈ 1,9608 %.
    Pour la règle des 70, l’objectif est un doublement face à un seuil fixe ; ici B continue de croître.</p>
    <h3>4. Rattrapage et convergence</h3>
    <p>Avec g<sub>A</sub> &gt; g<sub>B</sub> constants, R<sub>n</sub> tend vers +∞, pas vers 1. A rattrape puis dépasse B.
    Ce modèle ne décrit donc pas une convergence durable des niveaux relatifs.
    À taux égaux, le rapport resterait ½. Un taux initialement plus élevé ne suffit pas à établir une convergence vers 1.</p>
    <h3>Erreurs fréquentes</h3>
    <ul><li>Calculer le doublement de A en oubliant que B croît aussi.</li>
    <li>Insérer 4 et 2 dans les formules au lieu de 0,04 et 0,02.</li>
    <li>Confondre l’écart de taux avec la croissance exacte du rapport.</li>
    <li>Arrondir à l’entier le plus proche au lieu de prendre le premier entier supérieur ou égal au seuil.</li></ul>`;

  // Une seule liste fournit les intitulés du plan, des séparations et du sommaire.
  // À appliquer après l'intégration du master pour inclure aussi les annexes.
  // Sans argument : les cinq parties d’origine, réétiquetées d’après leur numéro.
  // Avec une liste de parties (reorganisation.js, 23 octobre 2026) : les libellés sont déjà
  // fixés par appartenance ; seuls le plan et les séparations sont reconstruits. Un second
  // appel ne duplique ni les notes ni les classes.
  window.harmoniserPlanChapitre = function (customParts) {
    const parts = customParts || [
      {id:'p1', title:'Que mesure-t-on ?'},
      {id:'p2', title:'Combien reste-t-il après les prix ?'},
      {id:'p3', title:'Par personne et par heure ?'},
      {id:'p4', title:'Pour qui ?'},
      {id:'p5', title:'À quel coût ?'}
    ];
    const outline = [...parts, {id:'master-annexes', title:'Annexes'}];
    // Le sommaire et les séparations partagent le même gabarit de cinq questions.
    // Le repère des annexes n’apparaît que sur leur propre écran d’ouverture.
    const renderPlan = currentId => `<div class="p-center rev-chapter-plan" style="gap:18px">${(currentId === 'master-annexes' ? outline : parts).map((part, i) => {
      const active = part.id === currentId;
      return `<div class="pj-plan-row${active ? ' is-current' : ''}"${active ? ' aria-current="step"' : ''}><span class="n">${i < parts.length ? i + 1 : ''}</span><span class="q">${esc(part.title)}</span></div>`;
    }).join('')}</div>`;
    edit('plan', s => { s.html = renderPlan(); });
    window.SLIDES.forEach(s => {
      const match = customParts ? null : (s.part || '').match(/^Partie ([1-5])\b/);
      if (match) s.part = `Partie ${match[1]} · ${parts[Number(match[1]) - 1].title}`;
      if (s.appendix) s.part = 'Annexes';
    });
    outline.forEach(current => edit(current.id, s => {
      const first = !s.planHarmonise;
      if (s.source) window.NOTES[s.id] = (window.NOTES[s.id] || '') + `<p>Source de l’ancienne séparation : ${s.source}</p>`;
      s.title = current.title;
      if (!(s.cls || '').split(' ').includes('rev-section-overview')) s.cls = [s.cls, 'rev-section-overview'].filter(Boolean).join(' ');
      s.source = '';
      s.layout = 'section';
      s.html = renderPlan(current.id);
      if (first) window.NOTES[s.id] = (window.NOTES[s.id] || '') + '<p>23 octobre 2026 : séparation harmonisée avec le plan : mêmes chiffres, typographie et espacements, sans titre ni « Plan du chapitre ». La partie en cours est en blanc, les autres parties sont grisées. Le repère « Annexes » est réservé à l’ouverture des annexes.</p>';
      s.planHarmonise = true;
    }));
  };
  edit('pouvoir-achat',s=>s.html=s.html.replace("le RDB déflaté par l'IPC", "le RDB déflaté par l’indice des prix de la dépense de consommation finale des ménages"));
  edit('identite-defs',s=>s.html=s.html.replace('≈ 65 € par heure','≈ 57,6 € de 2020 par heure'));
  edit('reperes-fin',s=>s.html=s.html.replaceAll('Production par heure travaillée en France (2025)','Production par heure travaillée en France (2025, euros courants)'));
  edit('pib-revenu',s=>s.html=s.html.replace(/Usure du capital \([^)]*\), profits/,'Profits'));
  edit('redistribution',s=>s.html=s.html.replace('Niveau de vie des 10 % les plus modestes (premier décile)', 'Seuil du premier décile (D1) de niveau de vie'));
  edit('p5-verif',s=>s.html=s.html.replace('ses émissions territoriales','les émissions des unités résidentes'));
  edit('trois-approches',s=>s.source=s.source.replace('<var>C</var> : consommation des ménages','<var>C</var> : consommation des ménages et des ISBLSM').replace('<var>I</var> : investissement et stocks','<var>I</var> : FBCF, variations de stocks et acquisitions nettes d’objets de valeur'));
  edit('notre-dame',s=>{
    s.html=s.html.replace('Les 845 M€ de dons ont financé la sécurisation et la restauration : une production nouvelle, comptée dans le PIB.', 'La valeur ajoutée créée en France par les travaux entre dans le PIB.');
    s.source += ' Montant de 845 M€ du support initial : confirmation documentaire en attente ; ne pas le confondre avec une dépense exécutée ou une valeur ajoutée.';
  });
  edit('limites-1',s=>{
    const content = document.createElement('template');
    content.innerHTML = s.html;
    content.content.querySelector('.pj-limits').classList.add('rev-health-limits');
    content.content.querySelector('.pj-limits').insertAdjacentHTML('beforeend', '<p class="rev-domestic-note">Équivalent de <strong>15 %</strong> (bas), <strong>33 %</strong> (intermédiaire) ou <strong>71 %</strong> (haut) du PIB, selon le périmètre et la valorisation.<br>France, 2010 — <a href="https://www.insee.fr/fr/statistiques/2123967" target="_blank" rel="noopener noreferrer">Insee, 2012</a>.</p>');
    const card = [...content.content.querySelectorAll('.pj-limit')].find(el => el.querySelector('.t').textContent === 'Santé, longévité');
    card.classList.add('rev-health-card');
    card.insertAdjacentHTML('afterbegin', '<svg class="rev-health-parenthesis left" viewBox="0 0 24 100" preserveAspectRatio="none" aria-hidden="true"><path d="M22 2 Q2 50 22 98"/></svg><svg class="rev-health-parenthesis right" viewBox="0 0 24 100" preserveAspectRatio="none" aria-hidden="true"><path d="M2 2 Q22 50 2 98"/></svg>');
    content.content.querySelector('.p-center').insertAdjacentHTML('beforeend', '<p class="rev-health-note" data-step="2"><strong>Santé, longévité :</strong> Une vie plus longue peut accroître le PIB futur. Les dépenses de santé sont déjà comptabilisées dans le PIB.</p>');
    s.html = content.innerHTML;
  });
  edit('limites-2',s=>{
    const content = document.createElement('template');
    content.innerHTML = s.html;
    const grid = content.content.querySelector('.pj-limits');
    const card = [...grid.querySelectorAll('.pj-limit')].find(el => el.querySelector('.t').textContent === 'Inégalités');
    card.parentElement.remove();
    grid.classList.add('rev-limits-three');
    content.content.querySelector('[data-step="4"]').dataset.step = '3';
    s.html = content.innerHTML;
    window.NOTES['limites-2'] = window.NOTES['limites-2'].replace(', puis les inégalités, sur lesquelles une moyenne ne dit rien', '').replace('Clic 4 :', 'Clic 3 :');
  });
  edit('preston',s=>s.source += ' Réserve : valeur CAF 2022 atypique (18,8 ans), également présente dans WDI ; à confronter au fichier démographique primaire avant diffusion.');
  edit('decarb-scen',s=>s.source += ' Le repère 2050 utilisé dans cette simulation (1990 ÷ 6) reste à documenter ; il ne vaut pas vérification de l’objectif légal en vigueur.');
  edit('courses',s=>s.source=s.source.replace("Septembre 2026 provisoire, sans le détail de l'alimentation.", 'Ensemble : septembre 2026 définitif ; produits alimentaires (COICOP 01.1) : jusqu’à août 2026.'));
  edit('salaire-scen',s=>s.source=s.source.replace('septembre 2026 sur un an, provisoire','septembre 2026 sur un an, définitif'));
  // Les indications historiques de durée ne fixent pas le déroulé 2026.
  Object.keys(window.NOTES).forEach(id=>{
    window.NOTES[id]=window.NOTES[id].replace(/<[^>]*class="[^"]*timing[^\"]*"[^>]*>[\s\S]*?<\/[^>]+>/g,'');
  });
  window.NOTES.couverture='<p>Support enseignant de relecture 2026. Adaptation par Arnaud Dyèvre du cours d’Antonin Bergeaud ; originaux conservés. Aucun minutage de séance arrêté. Les modifications et les réserves scientifiques sont documentées dans historique_modifications.md et verification/audit_chiffres.md.</p>';
  window.NOTES.p1='<p>Relecture du 23 octobre 2026 : l’ancienne accroche chiffrée a été retirée. La séparation reprend désormais le plan, avec « Que mesure-t-on ? » en blanc.</p>';
  window.NOTES['pouvoir-achat'] += '<p>Correction 2026 : le déflateur du pouvoir d’achat du RDB est le prix de la dépense de consommation finale des ménages, pas l’IPC.</p>';
  window.NOTES['pib-revenu'] += '<p>Correction 2026 : PIB et RDB sont bruts ; ne pas retrancher l’usure du capital dans ce passage entre deux agrégats bruts. Le RDB des ménages n’est pas une simple part fixe du PIB.</p>';
  window.NOTES['redistribution'] += '<p>Correction 2026 : les variations −6,7 % et +2,9 % portent sur le seuil D1, pas sur la moyenne du premier dixième de ménages.</p>';
  window.NOTES['ipc-defl-fr']=window.NOTES['ipc-defl-fr'].replace('3,0 % sur un an (provisoire)','3,1 % sur un an (définitif)').replace('Vérifier le chiffre définitif publié le 15 octobre 2026.','Chiffre définitif vérifié dans la publication Insee du 15 octobre 2026.');
  window.NOTES['salaire-scen']=window.NOTES['salaire-scen'].replace('septembre 2026 (3,0 %), maintenu','septembre 2026 (3,1 %), environ −0,1 %').replace('Clic 3 : la définition.','Clic 3 : la définition ; g réel et g nominal désignent des taux de croissance.');
  window.NOTES['decarb-scen'] += '<p>Réserve de vérification 2026 : les références au décret et au statut de la SNBC 3 ci-dessus proviennent des notes originales ; le texte juridique intégral n’a pas pu être vérifié. Le repère 2050 (1990 ÷ 6) reste à documenter. Ne pas présenter cette simulation comme une vérification du droit en vigueur.</p>';
  window.NOTES['p5-verif'] += '<p>Périmètre corrigé : l’identité utilise les émissions des unités résidentes ; le passage aux émissions du territoire requiert notamment un ajustement des transports internationaux.</p>';

  addAfter('pib-def',[slide('histoire-pib','Le PIB a une histoire',P1,
  '<div class="rev-history"><div class="rev-history-text"><ul class="rev-history-points">'+[
    '<span class="rev-lead">1934 · Mesurer la Grande Dépression</span>',
    '<b>Simon Kuznets</b> (NBER) dirige l’étude du Department of Commerce. Il prépare les estimations finales et rédige <i>National Income, 1929–32</i>, transmis au Sénat.',
    'Ce rapport lance la série régulière des estimations du <b>revenu national américain</b>. Des estimations existaient déjà ; les comptes modernes se structurent ensuite.'
  ].map(text=>'<li>'+text+'</li>').join('')+'</ul><figure class="rev-history-quote"><blockquote>« On ne peut guère déduire le bien-être d’une nation d’une mesure du revenu national. »</blockquote><figcaption><strong>Simon Kuznets</strong><br><i>National Income, 1929–32</i>, 1934, p. 7</figcaption></figure></div>'+
  '<div class="rev-history-images"><figure><img src="sources/kuznets_1934/simon_kuznets_1971.jpg" alt="Portrait de Simon Kuznets en 1971"><figcaption><strong>Simon Kuznets, 1971</strong><span>'+link('https://www.nobelprize.org/prizes/economic-sciences/1971/summary/','Prix Nobel d’économie 1971')+'</span><span>'+link('https://commons.wikimedia.org/wiki/File:Simon_Kuznets_1971b.jpg','Associated Press, photographe non identifié · Wikimedia Commons · domaine public aux États-Unis')+'</span></figcaption></figure><figure><img src="sources/kuznets_1934/national_income_1929_32.png" alt="Page de titre du rapport National Income, 1929–32, Senate Document no 124, 1934"><figcaption><strong>Le rapport de 1934</strong><span>'+link('sources/kuznets_1934/19340104_nationalinc.pdf#page=2','Department of Commerce · Senate Doc. 124 · FRASER · domaine public aux États-Unis')+'</span></figcaption></figure></div></div>',
  link('https://fraser.stlouisfed.org/title/national-income-1929-1932-971','Department of Commerce, National Income, 1929–32 (1934), pp. ix, xi et 7')+' ; '+link('https://apps.bea.gov/scb/issues/2007/0207_history_article.pdf','Marcuss et Kane, BEA (2007), pp. 32–34')+'.',
  '23 octobre 2026 : lecture ciblée du rapport intégral fourni par Arnaud : lettre p. ix (PDF 10), remerciements p. xi (PDF 12), mise en garde sur le bien-être p. 7 (PDF 19). Kuznets, du NBER, dirige l’étude, prépare les estimations finales, organise et rédige le rapport ; travail collectif du Department of Commerce avec le NBER. Le secrétaire au Commerce par intérim transmet le rapport au Sénat : ne pas dire que Kuznets le remet personnellement. Ce rapport inaugure la série continue du Department of Commerce, non la toute première estimation du revenu national ni un système complet de comptes modernes. Antécédents : Petty au XVIIe siècle, NBER dans les années 1920, FTC en 1926. Suite américaine : PNB officiel en 1942, comptes en partie double en 1947 ; cadre international : premier SCN de l’ONU en 1953. Voir la note de sources/kuznets_1934/README.md. La traduction française de la citation fournie antérieurement est conservée ; l’anglais précise « as defined above ». Le portrait date de 1971, et non de la rédaction du rapport. Statut indiqué par Commons : domaine public aux États-Unis, publication sans mention de copyright ; aucune affirmation de domaine public universel. Le portrait et la capture sont placés côte à côte, en format vertical à droite. Lecture ciblée, pas intégrale.')]);
  addAfter('trois-approches',[
    slide('ai-investissement','Investissement lié à l’IA et PIB aux États-Unis',P1,
      figure('epoch_investissement','Dépenses d’infrastructure informatique et estimation de la composante IA, en pourcentage du PIB américain',
      'Dépenses nominales rapportées au PIB nominal. La composante « IA » est une estimation d’Epoch, pas une catégorie directement observée des comptes nationaux.'),
      link('https://epoch.ai/data-insights/ai-datacenter-share-gdp','Epoch AI, AI datacenter investment as a share of GDP'), 'D02. Cette part du PIB ne mesure pas une contribution à la croissance réelle. Voir sources/fournis et data/README.md.'),
    slide('ai-croissance','Investissement et importations : quel apport à la croissance ?',P1,
      figure('fed_contribution','Contributions de catégories associées au développement de l’IA à la croissance réelle américaine',
      'Les importations d’équipements réduisent l’apport à la production intérieure. Ces catégories comprennent aussi des usages hors IA : elles ne mesurent pas son effet causal.'),
      link('https://www.federalreserve.gov/econres/notes/feds-notes/the-ai-buildout-and-the-economy-publicly-available-data-to-assess-ais-impact-20260717.html','Federal Reserve, FEDS Note du 17 juillet 2026, figure 7'), 'D02. Points de croissance trimestrielle annualisée ; conserver le traitement des exportations nettes du classeur Fed.')
  ]);
  addAfter('bastiat',[slide('bastiat-citation','Ce qu’on voit… et ce qu’il faut prévoir',P1,
    `<div class="rev-body"><blockquote class="rev-quote">« Entre un mauvais et un bon Économiste, voici toute la différence : l’un s’en tient à l’effet visible ; l’autre tient compte et de l’effet qu’on voit et de ceux qu’il faut prévoir. »</blockquote><p class="rev-small">Frédéric Bastiat, <i>Ce qu’on voit et ce qu’on ne voit pas</i>, introduction, 1850.</p><p>Après une destruction, regarder les travaux de reconstruction ne suffit pas : il faut aussi considérer ce qui a été perdu et les autres usages possibles des ressources.</p></div>`,
    link('https://fr.wikisource.org/wiki/Ce_qu%E2%80%99on_voit_et_ce_qu%E2%80%99on_ne_voit_pas/Introduction','Bastiat, texte français de l’introduction (1850)'))]);
  addAfter('ca-compte-2',[slide('loyers-imputes','Pourquoi compter mon logement, mais pas ma cuisine ?',P1,body(
    '<b>Propriétaire occupant :</b> les comptes enregistrent un service de logement, évalué par un loyer imputé comparable à celui du marché.',
    '<b>Une estimation relativement simple :</b> les loyers observés au m² de logements comparables, en tenant compte du quartier, fournissent un prix de référence. Cette possibilité de valorisation facilite leur prise en compte dans le PIB.',
    'Ainsi, deux logements identiques produisent un service mesuré de façon comparable, que leur occupant soit propriétaire ou locataire.',
    '<b>Repas préparé chez soi :</b> les ingrédients achetés sont comptés ; le service de cuisine effectué pour soi-même ne l’est pas. Le même service acheté à un professionnel entre dans la production.',
    '<span class="rev-small"><strong class="c-red">C’est une frontière conventionnelle de la production, pas un jugement sur l’utilité de ces activités.</strong> Les comptes satellites peuvent élargir cette frontière.</span>'
  ),link('https://www.insee.fr/fr/statistiques/fichier/1372376/conso09c.pdf#page=16','Insee, estimation des loyers imputés')+' ; '+link('https://www.ons.gov.uk/economy/grossdomesticproductgdp/methodologies/improvementstoprivateactualandimputedrentalsinhouseholdexpenditureinuknationalaccountsbluebook2026','ONS, méthode des loyers effectifs et imputés (2026)')+'.',
  'Un prix du logement est un prix d’actif ; le loyer est un flux de service. Ne pas imputer une valeur arbitraire au travail domestique. Précision du 23 octobre 2026 : les loyers imputés sont estimés par comparaison avec les loyers observés selon la localisation, la surface, le nombre de pièces et le confort (Insee, La consommation des ménages depuis cinquante ans, encadré 4, p. 28). Le quartier est un critère de comparaison, sans garantie de précision uniforme sur tous les territoires. La possibilité de valorisation facilite la mesure ; la comparabilité entre propriétaires et locataires reste une justification distincte. Notes locales de dina-squared consultées.')]);
  addAfter('ipc-deflateur',[slide('prix-americains','Un même taux d’inflation masque des prix très différents',P2,
    figure('bls_prix_categories','Évolution des indices de prix américains par catégorie depuis janvier 2002',
    'CPI-U non désaisonnalisé, janvier 2002 = 0 % de variation. Les catégories peuvent se recouper : leurs variations ne s’additionnent pas. Les ruptures de série restent visibles.'),
    link('https://data.bls.gov/series-report','BLS, CPI-U, 15 séries officielles, extraction du 22 octobre 2026'),
    'D04. Nouvelle figure inspirée de l’image fournie, pas reproduction exacte de son millésime. La base commune 2002 inclut les manuels universitaires. La correspondance « household furnishings » avec SAH3 reste à confirmer. Ne pas confondre variation d’un indice à qualité constante et simple variation d’un prix affiché.')]);
  addAfter('p3',[
    slide('ppa-change','Comparer deux pays : change ou pouvoir d’achat ?',P3,body(
      '<b>Au taux de change :</b> on convertit la valeur de la production dans une même monnaie aux taux observés. Cette mesure importe pour acheter des biens, des actifs ou des services sur les marchés internationaux.',
      '<b>En parité de pouvoir d’achat (PPA) :</b> on corrige les différences de prix entre pays pour comparer des volumes de biens et de services.',
      'Un service local peut être moins cher en Chine qu’aux États-Unis. La conversion au taux de change et la conversion en PPA répondent donc à deux questions différentes.',
      '<span class="rev-small">La PPA n’est pas un taux auquel on peut échanger sa monnaie. Et le PIB total ne décrit pas le niveau de vie par habitant.</span>'
    ), link('https://www.noahpinion.blog/p/how-do-we-measure-whether-chinas','Noah Smith, comparaison du PIB chinois')+' ; '+wdi+' et définitions des indicateurs NY.GDP.MKTP.CD / PP.CD.'),
    slide('chine-etats-unis','Chine–États-Unis : le classement dépend de la mesure',P3,
      figure('chine_usa_ppa','PIB total de la Chine et des États-Unis au taux de change et en PPA, 2025',
      'Même année et même agrégat : le PIB total de 2025. Les deux panneaux utilisent des unités différentes ; leurs niveaux ne sont pas à additionner.'),
      wdi+' : NY.GDP.MKTP.CD et NY.GDP.MKTP.PP.CD, millésime téléchargé le 22 octobre 2026.')
  ]);
  addAfter('identite-defs',[slide('ons-productivite','La productivité change… quand on mesure mieux les heures',P3,
    figure('ons_productivite','Comparaison de la productivité horaire britannique selon la mesure antérieure et l’approche par composantes',
    'Le PIB n’a pas changé ici : la révision concerne la mesure du travail, en combinant emplois et heures par emploi. La productivité révisée est plus élevée ; le ralentissement demeure.'),
    link('https://blog.ons.gov.uk/2026/09/17/measuring-labour-productivity-our-new-approach/','ONS, Measuring labour productivity: our new approach, 17 septembre 2026')+' ; 1997–2024.',
    'Données réelles du classeur, sans lecture de points sur image. Ne pas présenter la révision comme un surcroît de production effectivement réalisé.')]);
  addAfter('redistribution',[
    slide('comptes-distribues','Des comptes nationaux aux revenus de chaque groupe',P4,body(
      'Le <b>PIB</b> mesure la production réalisée sur le territoire. Le <b>revenu national</b> tient compte des revenus primaires reçus du reste du monde et versés à celui-ci.',
      'Les comptes distribués de l’Insee ventilent un <b>revenu élargi des ménages</b> et les opérations de redistribution : prélèvements, prestations monétaires et services publics.',
      'Ils incluent des ressources absentes du seul revenu disponible monétaire, par exemple les services de santé et d’éducation financés collectivement.',
      '<span class="rev-small">On ne distribue donc pas simplement « le PIB » entre les ménages. Avant et après redistribution, les groupes de comparaison restent les mêmes.</span>'
    ),insee+' ; note méthodologique et glossaire 2026.'),
    slide('redistribution-elargie','Avant et après redistribution élargie',P4,
      figure('insee_redistribution','Revenu avant et après transferts, par dixième de niveau de vie, France 2023',
      'Revenus moyens par unité de consommation, à groupes constants. Le rapport entre les moyennes des dixièmes extrêmes passe d’environ 26,3 à 3,5 ; ce n’est pas un rapport de seuils D9/D1.'),
      insee+', figure 1c.'),
    slide('transferts-nature','La redistribution ne se limite pas aux chèques reçus',P4,
      figure('insee_transferts','Décomposition des transferts reçus et versés, par dixième de niveau de vie',
      'Prélèvements, prestations monétaires et transferts en nature : la valorisation des services publics élargit fortement la mesure des ressources redistribuées.'),
      insee+' : mêmes groupes et même édition que la figure précédente. Montants arrondis par la source.')
  ]);
  addAfter('limites-2',[slide('stiglitz-sen-fitoussi','Stiglitz–Sen–Fitoussi (2009) : compléter le PIB',P5,body(
    '<span class="rev-lead">Le PIB mesure la production ; il ne résume pas le bien-être.</span>',
    '<b>Du côté des ménages :</b> examiner revenus, consommation, patrimoine et répartition, en tenant compte des services publics reçus en nature.',
    '<b>La qualité de vie :</b> suivre aussi la santé, l’éducation, les conditions de vie et l’évaluation que chacun fait de sa vie.',
    '<b>La soutenabilité :</b> évaluer séparément les ressources et le patrimoine transmis aux générations futures, avec des indicateurs physiques de l’environnement.'
  ),link('sources/fournis/094000427.pdf#page=13','Stiglitz, Sen et Fitoussi, Rapport de la Commission sur la mesure des performances économiques et du progrès social (2009), synthèse, p. 13–20'),
  'D07. Rapport français intégral fourni par Arnaud le 23 octobre 2026. Lecture ciblée documentée dans sources/note_stiglitz_sen_fitoussi_2026-10-23.md. Relier aux comptes distribués et à la frontière de production. Cadre de mesure : ces recommandations ne sont pas une estimation causale. Aucun chiffre ancien repris.', '23 octobre 2026')]);
  const corr=[
    ['consumption','Consommation finale par habitant','2022','Dollars constants de 2015 ; consommation totale, y compris administrations.'],
    ['manufacturing','Valeur ajoutée manufacturière par habitant','2023','Dollars courants ; valeur ajoutée, pas chiffre d’affaires industriel.'],
    ['aic','Consommation individuelle effective','2023','Volume par habitant en standards de pouvoir d’achat, UE27 = 100.'],
    ['infant','Mortalité infantile','2022',''],
    ['life','Espérance de vie','2022','Années.'],
    ['learning','Apprentissages','édition 2020','Harmonized Test Scores, ensemble des sexes ; les dates des tests diffèrent selon les pays.']
  ];
  addAfter('preston',[
    ...corr.map(([key,title,year,note])=>slide(`correlation-${key}`,`PIB et ${title.toLocaleLowerCase('fr')}`,P5,
      figure(`correlation_${key}`,`${title} et PIB par habitant, ${year}`,
      note),
      `${key==='aic'?'Eurostat prc_ppp_ind (A01, VI_PPS_EU27_2020_HAB) + WDI':key==='learning'?'Banque mondiale, HCI Data 2020 + WDI':'Banque mondiale, WDI'} ; ${year}.`,
      'D06. Réinterprétation d’un graphique identifié dans les bookmarks de Crémieux. Échelle du PIB logarithmique ; R² recalculé sur les seules observations disponibles. Millésime actuel, pas copie des coefficients du tweet.')),
    slide('correlation-happiness','PIB et satisfaction de vie',P5,
      figure('correlation_happiness','Satisfaction de vie et PIB par habitant moyen, 2021–2023',
      'Évaluation de la vie sur une échelle de 0 à 10, moyenne 2021–2023.'),
      link('https://www.worldhappiness.report/ed/2024/','World Happiness Report 2024, données de la figure 2.1')+' ; '+link('https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.KD','Banque mondiale, WDI')+'. PIB par habitant moyen 2021–2023, PPA constantes de 2021.',
      'D06. Le 23 octobre 2026, Arnaud valide les moyennes 2021–2023 à la place de la coupe annuelle 2022. Ordonnée : Ladder score fourni dans WHR24_Data_Figure_2.1.xls. Abscisse logarithmique : moyenne arithmétique des trois PIB par habitant WDI 2021, 2022 et 2023, en dollars internationaux constants de 2021. Trois valeurs de PIB sont requises ; pas d’interpolation. Les pays n’ont pas nécessairement une enquête dans chacune des trois années. La colonne « Explained by: Log GDP per capita » n’est pas un niveau de PIB et n’est pas utilisée. R² recalculé sur les paires appariées ; méthode et exclusions dans data/whr_integration_2026-10-23.json. Nouvelle comparaison descriptive, pas reproduction de la coupe 2022 du tweet ni du modèle multivarié du WHR.', '23 octobre 2026'),
    slide('correlation-freedom','PIB et liberté humaine',P5,
      figure('correlation_freedom','Score de liberté humaine et PIB par habitant en PPA, 2021',
      'Score global de liberté personnelle et économique, de 0 à 10.'),
      link('https://www.cato.org/human-freedom-index/2023','Human Freedom Index 2023, données 2021')+' ; '+wdi+', PIB par habitant en PPA courantes de 2021.',
      'D06. Classeur fourni par Arnaud le 23 octobre 2026. Score HUMAN FREEDOM de 2021, apparié au WDI NY.GDP.PCAP.PP.CD de la même année. PIB en logarithme, score en niveau. Coefficient recalculé sur les observations appariées ; aucune substitution d’année.', '23 octobre 2026')
  ]);

  function timerHtml(text) {
    return `<div class="rev-body"><p class="rev-small">${text}</p><div class="rev-timer-controls"><label>Durée de la pause <input type="number" min="1" max="60" value="10" aria-label="Durée de la pause en minutes"></label><span>minutes</span></div><div class="rev-time" aria-live="off">10:00</div><div class="rev-timer-actions"><button data-action="start">Démarrer</button><button data-action="pause">Suspendre</button><button data-action="reset">Réinitialiser</button></div><div class="rev-timer-status" role="status">Le minuteur attend votre départ.</div></div>`;
  }
  edit('pause',s=>{s.title='Pause';s.html=timerHtml('Au retour : comparer la production par personne et par heure.');});
  addAfter('p3-verif',[slide('pause-repartition','Pause','Pause',timerHtml('Au retour : qui reçoit les revenus issus de la production ?'),'','Pause facultative, durée réglable, départ manuel. Aucun minutage de séance imposé.')]);
  ['pause','pause-repartition'].forEach(id=>{
    let interval=null,remaining=600,initialized=false,root;
    const stop=()=>{if(interval!==null)clearInterval(interval);interval=null;};
    const display=()=>root.querySelector('.rev-time').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
    Deck.on(id,{enter(){
      root=Deck.slideEl(id);
      if(initialized)return;initialized=true;
      const input=root.querySelector('input'),status=root.querySelector('[role="status"]');
      const reset=()=>{stop();const value=Math.min(60,Math.max(1,Number(input.value)||10));input.value=value;remaining=Math.round(value*60);display();status.textContent='Le minuteur attend votre départ.';};
      input.addEventListener('change',reset);
      input.addEventListener('input',reset);
      root.querySelector('[data-action="reset"]').onclick=reset;
      root.querySelector('[data-action="pause"]').onclick=()=>{stop();status.textContent='Minuteur suspendu.';};
      root.querySelector('[data-action="start"]').onclick=()=>{if(interval!==null||remaining<=0)return;status.textContent='Pause en cours.';interval=setInterval(()=>{remaining--;display();if(remaining<=0){stop();status.textContent='Fin de la pause.';}},1000);};
    },leave(){stop();if(root)root.querySelector('[role="status"]').textContent='Minuteur suspendu.';}});
  });

  // Exemples tirés de la capture OWID fournie ; un seul pays affiché à la fois.
  const decouplingExamples = [
    {code:'DEU', name:'Allemagne'}, {code:'USA', name:'États-Unis'},
    {code:'SWE', name:'Suède'}, {code:'FIN', name:'Finlande'},
    {code:'DNK', name:'Danemark'}, {code:'JPN', name:'Japon'}
  ];
  function chartSlide(id,title,perCapita){
    return {...slide(id,title,P5,
      `<p class="rev-decoupling-intro">Pays sélectionnés : exemples de croissance avec baisse des émissions de CO₂, 2005–2020.</p><div class="rev-chart-controls"><label>Pays <select aria-label="Choisir un pays parmi les six exemples">${decouplingExamples.map(c=>`<option value="${c.code}">${c.name}</option>`).join('')}</select></label><span>Un pays à la fois · six exemples</span></div><p class="rev-decoupling-country"></p><div class="rev-interactive chart"></div><p class="rev-chart-note">Sélection : Allemagne, États-Unis, Suède, Finlande, Danemark, Japon.</p>`,
      owid+' ; PIB réel en PPA, CO₂ fossile et industriel hors changement d’usage des terres. '+(perCapita?'Grandeurs par habitant. ':'Grandeurs totales. ')+'Base 2005 = 100. Sélection inspirée de la capture OWID fournie.',
      '23 octobre 2026 : sélection de six exemples parmi les trente économies de la capture OWID (sources/note_decouplage_selection_2026-10-23.md). Sur 2005–2020, les données locales confirment une hausse du PIB et une baisse du CO₂ ajusté des échanges pour chacun de ces six pays, en total comme par habitant. Aucun résultat généralisé aux autres pays. Valeurs issues des séries locales, pas des pourcentages de la capture. PDF : Allemagne ; HTML : un pays parmi les six, sans courbes de fond.'),cls:'rev-decoupling'};
  }
  addAfter('empreinte-verif',[
    chartSlide('decouplage-monde','PIB et CO₂ : les trajectoires des économies',false),
    chartSlide('decouplage-habitant','PIB et CO₂ par habitant',true)
  ]);
  function installDecoupling(id,key){
    let current='DEU',initialized=false;
    const groups=decouplingExamples.map(country=>{
      const rows=window.REVISION_DATA[key].rows.filter(r=>r.code===country.code&&r.year>=2005&&r.year<=2020).sort((a,b)=>a.year-b.year);
      const base=rows.find(r=>r.year===2005);
      if(!base)throw new Error(`Base 2005 absente : ${country.code}`);
      return {...country,values:rows.map(r=>({year:r.year,...Object.fromEntries(['gdp','production','consumption'].map(k=>[k,base[k]>0&&Number.isFinite(r[k])?100*r[k]/base[k]:null]))}))};
    });
    function draw(ctx={}){
      const root=Deck.slideEl(id);
      const selected=groups.find(g=>g.code===(ctx.print?'DEU':current));
      root.querySelector('.rev-decoupling-country').textContent=`${selected.name} · ${key==='decouplingPerCapita'?'par habitant':'grandeurs totales'}`;
      const box=window.PJ.zoom(root.querySelector('.rev-interactive'),1.2);
      const animate=!(ctx.print||ctx.reading||window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      const max=Math.max(120,...selected.values.flatMap(r=>[r.gdp,r.production,r.consumption].filter(Number.isFinite)));
      const labels=[['gdp','PIB réel','blue',false],['production','CO₂ territorial','red',false],['consumption','CO₂ ajusté des échanges','red','9 6']];
      const chart=window.Charts.line(box,{
        height:box.clientHeight,animate,duration:2,stagger:0.2,ends:true,legend:false,hover:!ctx.print,
        aria:`${selected.name}, PIB réel et émissions de CO₂ ${key==='decouplingPerCapita'?'par habitant':'totales'}, de 2005 à 2020`,
        x:{min:2005,max:2020,ticks:[2005,2010,2015,2020]},
        y:{min:0,max:Math.ceil(max/20)*20},yTitle:'Indice, 2005 = 100',
        refLines:[{y:100,color:'grey',dash:'3 6'}],
        series:labels.map(([column,name,color,dash])=>({name,endLabel:name,color,dash,gaps:1.5,data:selected.values.map(r=>[r.year,r[column]]),format:v=>window.Charts.fmt(v,1)}))
      });
      if(animate)chart.svg.querySelectorAll('.ch-line').forEach((path,i)=>{
        path.classList.remove('ch-anim');
        const clip=window.Charts.el('clipPath',{id:`${id}-reveal-${i}`,clipPathUnits:'userSpaceOnUse'},chart.svg.querySelector('defs'));
        window.Charts.el('rect',{x:0,y:0,width:chart.svg.getAttribute('width'),height:chart.svg.getAttribute('height'),class:'rev-decoupling-reveal',style:`animation-delay:${i*0.2}s`},clip);
        path.setAttribute('clip-path',`url(#${id}-reveal-${i})`);
      });
    }
    Deck.on(id,{enter(el,ctx){
      if(!initialized){
        initialized=true;
        el.querySelector('select').addEventListener('change',e=>{current=e.target.value;draw();});
      }
      draw(ctx);
    }});
    // Le PDF reprend le même SVG natif, avec l’Allemagne comme exemple stable.
    window.addEventListener('beforeprint',()=>draw({print:true}));
    window.addEventListener('afterprint',()=>draw({reading:document.body.classList.contains('reading')}));
  }
  installDecoupling('decouplage-monde','decouplingTotal');
  installDecoupling('decouplage-habitant','decouplingPerCapita');
  window.SOURCES_HTML = window.SOURCES_HTML.replace(/<p class="xsmall">Chaque chiffre du cours[\s\S]*?<\/p>/,'').replace('séries téléchargées le 5 octobre 2026 (septembre 2026 provisoire)','séries initiales du 5 octobre 2026 ; ensemble septembre actualisé au résultat définitif du 15 octobre, produits alimentaires jusqu’à août');
})();
