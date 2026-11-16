/* Section 4, demandée le 16 novembre 2026. Dix écrans, quatre graphiques natifs.
 * Sources intégralement lues : sources/litterature_ia/. Modèle : ia_modele.js. */
(function(){
  'use strict';
  const G=window.G2,M=window.IACroissance,C=window.Charts,D=window.CH02_IA,part=G.titles[3];
  if(!M)throw new Error('Modèle de croissance IA absent');
  if(!D)throw new Error('Données de la section IA absentes');
  const navy='#001F5F',orange='#B45309',slate='#65758B';
  const m=x=>`<span class="g-math ia-inline-math">${x}</span>`,f=G.f,dot=G.dot,ul=G.list;
  const researchers='L<sub>R</sub>';
  const eq=x=>`<span class="ia-eq g-math">${x}</span>`;
  const split=(left,right)=>`<div class="ia-split"><div>${left}</div><div>${right}</div></div>`;
  const card=(title,body,{orange=false,step=0}={})=>`<div class="ia-card${orange?' ia-orange':''}"${step?` data-step="${step}"`:''}><h2>${title}</h2>${body}</div>`;
  const context=(items,step=0)=>`<div class="ia-context"${step?` data-step="${step}"`:''}>${ul(items).replace('g-bullets','g-bullets ia-small')}</div>`;
  const link=(url,text)=>`<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  const ajj=link('https://web.stanford.edu/~chadj/AJJ-AIandGrowth.pdf','Aghion, Jones et Jones (2019)'),
    proof=link('https://web.stanford.edu/~chadj/explosivegrowthChatGPT5.2.pdf','preuve diffusée par C. Jones (2026)'),
    jep=link('https://doi.org/10.1257/jep.20261505','C. Jones (2026)'),
    ben=link('https://www.kellogg.northwestern.edu/faculty/jones-ben/htm/Artificial_Intelligence_in_Research_and_Development.pdf','B. Jones (2025)'),
    bloom=link('https://doi.org/10.1257/aer.20180338','Bloom et al. (2020)'),
    acemoglu=link('https://doi.org/10.1093/epolic/eiae042','Acemoglu (2025)'),
    blr=link('https://doi.org/10.1093/qje/qjae044','Brynjolfsson, Li et Raymond (2025)');
  const source=`Adapté d’${ajj}, §9.2–9.4.`;
  function add(obj,notes){G.add({part,cls:'ia-slide',source,...obj,notes});}
  const chart=(id,title,{height=430,note='',controls='',math=false}={})=>`<div class="ia-visual${math?' ia-chart-math':''}"><div class="ia-chart-title">${ul([title])}</div>${controls}${G.chart(id,height)}${note?`<div class="ia-chart-note">${ul([note])}</div>`:''}</div>`;
  const modelNotes='<p>Spécialisation pédagogique de l’exemple 3 d’AJJ, p. 256–257 : σ = 1 pour conserver A comme PGF multiplicative, β renommé η car β désigne les matières premières en section 3, λ = 1−η. K_Y = (1−κ)K, K_R = κK, L_Y = (1−ℓ)L, L_R = ℓL, avec parts κ,ℓ constantes entre zéro et un, L constant et stocks initiaux positifs. Le capital rival est réparti, pas compté deux fois. C = (1−s)Y. Aucune optimisation des allocations ou du financement de la recherche. Les ressources naturelles et h ne sont pas explicités : cette omission ne réfute pas les contraintes de l’écran s3-monde-fini.</p>';

  add({id:'s4',title:part,layout:'section',html:G.plan(3),source:''},
    '<p>La quatrième section suit s3-monde-fini et précède la conclusion. Elle reprend le plan commun sur fond marine. Deux canaux : production et innovation. Le modèle est une spécialisation pédagogique, pas une prévision quantitative.</p>');

  add({id:'s4-deux-canaux',title:'L’IA peut produire et aider à inventer',html:split(
    card('Produire',ul(['Confier des tâches à des machines.','Hier : le métier à tisser, le tracteur, l’ordinateur.',`Accroître la production avec le capital.${eq('K → Y')}`])),
    card('Inventer',ul(['Aider les chercheurs à trouver des idées.','<strong>AlphaFold</strong> : la structure de plus de 200 millions de protéines. Nobel de chimie 2024.',`Améliorer les façons de produire.${eq(`K → ${dot('A')} → Y`)}`]),{orange:true,step:1})),source:`Adapté d’${ajj}, §9.2–9.4. Exemples : ${jep}, p. 6 et 8.`},
    '<p>Exemples ajoutés le 16 novembre 2026, d’après C. Jones (2026). Produire, p. 8 : le métier à tisser mécanique remplace le tissage à la main au XIXe siècle ; au XXe, voitures et camions remplacent chevaux et porteurs, les tracteurs une partie du travail agricole, les ordinateurs électroniques les « calculateurs humains ». L’automatisation dure depuis plus de deux siècles (Zeira, 1998). Inventer, p. 6 : AlphaFold détermine la structure en trois dimensions de plus de 200 millions de protéines à partir de leur séquence d’acides aminés ; prix Nobel de chimie 2024 pour Demis Hassabis et John Jumper, de Google DeepMind. À vérifier avant de le dire : le prix est partagé avec David Baker, que l’article ne cite pas.</p><p>AJJ, §9.2–9.3. Dans le premier canal, le capital réalise des tâches de production. Dans le second, il contribue à la production de connaissances. Le capital comprend ici les équipements informatiques mobilisés par les systèmes d’IA. Les capacités de calcul et le temps des chercheurs sont rivaux ; une idée peut servir simultanément à plusieurs producteurs. Les flèches indiquent des canaux, pas deux contributions mesurées à additionner.</p>');

  add({id:'s4-modele',title:'Solow, avec une production d’idées',html:split(
    `<div class="ia-system">${card('Le modèle',ul([
      `Produire${eq('Y = A K<sub>Y</sub><sup>α</sup>L<sub>Y</sub><sup>1−α</sup>')}`,
      `Investir${eq(`${dot('K')} = sY − δK`)}`,
      `<strong>Inventer</strong>${eq(`${dot('A')} = zK<sub>R</sub><sup>η</sup>${researchers}<sup>1−η</sup>A<sup>φ</sup>`)}`
    ]))}</div>`,
    `<div class="ia-definitions">${ul([
      `${m('A')} : productivité globale des facteurs.`,
      [`${m('K<sub>Y</sub>, L<sub>Y</sub>')} : capital et travail pour produire.`,1],
      [`${m('K<sub>R</sub>')} : capital de recherche ; ${m(researchers)} : nombre de chercheurs.`,1],
      [`${m('z')} : efficacité de la recherche.`,1]
    ])}<div class="ia-context" data-step="2">${ul([
      `Parts fixes : ${m('K = K<sub>Y</sub> + K<sub>R</sub>')}.`,
      `Travail total constant : ${m(`L = L<sub>Y</sub> + ${researchers}`)}.`,
      `Chez Solow, ${m(`${dot('A')} = γA`)} était donné.`
    ])}</div></div>`)},modelNotes+
    '<p>Le modèle complet est visible dès l’entrée. Les notations apparaissent ensuite à droite. 0 &lt; α &lt; 1, 0 ≤ η &lt; 1, φ &lt; 1, s et z positifs. η et φ sont expliqués à l’écran sur la recherche. Par rapport à Solow, la loi exogène Ȧ = γA est remplacée : le rythme de la PGF dépend maintenant de moyens de recherche.</p>');

  add({id:'s4-production',title:'Automatiser renforce le rôle du capital',prov:'obs',html:split(
    ul([
      `Une tâche automatisée est réalisée avec du <strong>capital</strong>.${eq('Y = A K<sub>Y</sub><sup>α</sup>L<sub>Y</sub><sup>1−α</sup>')}`,
      ['Les tâches confiées à l’IA s’allongent : 9 secondes en 2020, 12 heures mi-2026.',1],
      [`Plus de tâches automatisées : un poids ${m('α')} plus élevé. Rendements décroissants si ${m('α &lt; 1')}.`,2]
    ])+context(['Assistance clientèle : <strong>+15 %</strong> de dossiers résolus par heure avec un assistant IA.'],3),chart('ia-production-chart','Tâches de programmation réussies par une IA',{height:430,note:'Réussite une fois sur deux. Trois repères cités par Jones.'})),source:`Modèle : ${ajj}. METR, cité par ${jep}, p. 5. Assistance : ${blr}.`},
    '<p>Exemple microéconomique : Brynjolfsson, Li et Raymond, QJE 2025, p. 907, tableau II, colonne 3. Version publiée lue intégralement : 5 172 agents au total ; accès à un assistant de messagerie fondé sur GPT-3, déployé surtout en 2020–2021. +0,301 dossier résolu par heure, soit +15,2 % du niveau antérieur, arrondi à 15 %. La version 2023 citait 14 %. Déploiement échelonné analysé en différence de différences, sous hypothèse de tendances parallèles ; l’échantillon principal n’est pas randomisé. Gains plus élevés chez les agents moins expérimentés ou moins performants ; environ +36 % dans le quintile de performance initiale le plus bas. Ce chiffre concerne une productivité horaire locale, pas la PGF ; l’outil assiste les agents sans remplacer intégralement leur emploi.</p>'+
    '<p>Le graphique remplace les courbes simulées selon α. Trois repères transcrits de C. Jones (2026), p. 5, d’après METR : neuf secondes en 2020, onze minutes en juin 2024, douze heures mi-2026. Il mesure la durée que prend la tâche chez un humain, pour un taux de réussite de l’IA de 50 %, pas le temps de calcul de l’IA ni une durée d’autonomie universelle. La date exacte en 2020 n’est pas donnée ; les positions 2020, 2024,42 et 2026,5 sont conventionnelles. Les segments guident la lecture entre trois repères : pas de série complète ni de mesure des dates intermédiaires.</p><p>AJJ, §9.2.1, p. 239–241 : α est le poids des tâches automatisées dans cette spécification. Le graphique ne permet pas d’estimer α. À PGF exogène croissant au taux γ, la croissance équilibrée par travailleur vaut γ/(1−α). La constante de l’agrégateur dépend aussi de l’automatisation ; changer α ne donne pas gratuitement le gain de niveau des anciennes courbes normalisées.</p><p>Contrepoint mesuré, dans les notes seulement : METR, 10 juillet 2025, essai randomisé de 246 tâches auprès de 16 développeurs expérimentés sur leurs propres dépôts. Les outils du début 2025 allongent le temps d’exécution de 19 %. Ce résultat n’est pas représentatif de tous les développeurs. La mise à jour du 24 février 2026 indique que sélection des participants et des tâches, ainsi que travail avec plusieurs agents, rendent les nouvelles mesures peu fiables pour quantifier les gains actuels. Pages officielles lues le 16 novembre 2026 : https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ et https://metr.org/blog/2026-02-24-uplift-update/.</p>');

  add({id:'s4-innovation',title:'Le capital peut aussi produire des idées',prov:'obs',html:split(
    ul([
      `Le capital aide les chercheurs : ${m('η > 0')}.${eq(`${dot('A')} = zK<sub>R</sub><sup>η</sup>${researchers}<sup>1−η</sup>A<sup>φ</sup>`)}`,
      [`Les idées deviennent plus dures à trouver : ${m('φ &lt; 1')}.`,1],
      ['Maintenir la loi de Moore : <strong>effort de recherche ×18</strong> entre 1971 et 2014.',2]
    ]),chart('ia-innovation-chart','Transistors par processeur',{height:440,note:`Doublement tous les ${G.fmt(D.moore.fit.doublingYears,1)} ans. ${D.moore.fit.n} processeurs, 1970–2026.`})),source:`Transistors : ${link(D.moore.permanentUrl,'Wikipédia, d’après le chapitre 1')}. Recherche : ${bloom}. Modèle : ${ajj}, §9.3.`},modelNotes+
    '<p>Bloom, Jones, Van Reenen et Webb (2020), AER, p. 1116–1119, figures 3–4 et tableau 1 : maintenir le doublement du nombre de transistors tous les deux ans s’accompagne d’un effort de recherche multiplié par environ 18 entre 1971 et 2014. Les « chercheurs effectifs » sont les dépenses de R&D déflatées par le salaire de travailleurs qualifiés, pas un effectif brut. La productivité de cet effort diminue de 6,8 % par an. La période et les données diffèrent du catalogue de processeurs tracé ici, qui va jusqu’en 2026. Cette comptabilité historique illustre la difficulté de maintenir une croissance technique ; elle n’identifie pas causalement φ et ne fixe pas l’efficacité future de l’IA.</p>'+
    '<p>Le graphique reprend les 413 valeurs ponctuelles CPU/GPU du catalogue du chapitre 1, Wikipédia « Transistor count », relevé du 27 octobre 2026. Bornes et fourchettes exclues. Ajustement descriptif commun de ln(nombre de transistors) sur l’année : doublement en 2,0999 ans, avec poids égal par processeur. Les SoC et modules restent dans le catalogue. Le nombre de transistors n’est pas la densité, ni la performance, ni la PGF. Aucune identification causale du rôle de l’IA dans cette évolution historique ; les données n’estiment ni η ni φ.</p><p>η mesure le rôle du capital dans la recherche : à autres facteurs constants, +1 % de K_R donne environ +η % de production d’idées. L’IA peut aussi accroître z. Le cours avait présenté Ȧ/A = z L_R, cas η = 0 et φ = 1. Ici, φ &lt; 1 : garder le même taux de progrès demande davantage de moyens quand A augmente. Cela ne demande pas φ &lt; 0. Code, exploration de molécules, analyse de données : les expériences et la validation clinique ne deviennent pas automatiquement plus rapides.</p>');

  add({id:'s4-boucle',title:'Produire et inventer se renforcent',html:split(
    ul([
      'De meilleures idées permettent de <strong>produire plus</strong>.',
      ['Une partie de ce surplus finance le <strong>capital de recherche</strong>.',1],
      ['Ce capital aide à trouver de nouvelles idées.',2]
    ])+context(['États-Unis : dépenses liées à l’IA, de 0,05 % du PIB début 2015 à 0,83 % début 2026, selon Epoch AI.','Calcul effectif consacré à l’entraînement des modèles : × 10 par an.'],3),card('La boucle capital–idées',ul([
      `Produire${eq('A ↑ &nbsp;→&nbsp; Y ↑')}`,
      [`Investir${eq('sY ↑ &nbsp;→&nbsp; K<sub>R</sub> ↑')}`,1],
      [`Inventer${eq(`${dot('A')} ↑ &nbsp;→&nbsp; A ↑`)}`,2]
    ]))),source:`Adapté d’${ajj}, §9.2–9.4. Dépenses : ${link('https://epoch.ai/data-insights/ai-datacenter-share-gdp','Epoch AI')}. Calcul : ${jep}, p. 5.`},modelNotes+
    '<p>Faits ajoutés le 16 novembre 2026, au troisième clic. Dépenses liées à l’IA : estimation d’Epoch AI, en % du PIB nominal américain, dépenses annualisées : matériel informatique au-dessus de sa tendance, centres de données et réseaux. 0,048 % au premier trimestre 2015, 0,832 % au premier trimestre 2026. Ce n’est ni une valeur ajoutée américaine ni une contribution à la croissance ; la série est celle du chapitre 1. Calcul effectif : puissance de calcul corrigée de la qualité des algorithmes ; × 10 par an, dont × 4 pour les puces et × 2,5 pour les algorithmes, selon Epoch AI cité par C. Jones (2026), p. 5. Ces deux faits illustrent la flèche de l’investissement vers le capital de recherche ; ils ne mesurent ni η ni Γ.</p>'+
    '<p>Ces flèches sont des effets toutes choses égales par ailleurs. Y augmente le flux d’investissement, puis le stock K ; la part de recherche constante transmet ce mouvement à K_R. Il n’y a pas de saut instantané de capital. La boucle positive ne suffit pas à prouver que le taux de croissance augmente : il faut tenir compte des rendements décroissants dans les deux équations.</p>');

  add({id:'s4-seuil',title:'Trois régimes de croissance',prov:'sim',html:split(
    ul([
      `Une fois le modèle résolu, on obtient une relation nous donnant la force de cette boucle entre production et innovation : l’élan ${m('η')} face aux freins${eq(`Γ = ${f('η','(1−α)(1−φ)')}`)}<span class="ia-retention-note">(pas besoin de retenir)</span>`,
      `<span class="ia-regime" style="color:${slate}">Γ &lt; 1</span> : le taux tend vers zéro.`,
      [`<span class="ia-regime">Γ = 1</span> : un taux constant à long terme.`,1],
      [`<span class="ia-regime" style="color:${orange}">Γ &gt; 1</span> : divergence en temps fini dans le modèle.`,2]
    ])+context([`${m('L')} et parts d’allocation constants ; ${m('δ = 0')}.`,`Avec ${m('α = 1/3')} et ${m('φ = 1/2')} : ${m('Γ = 3η')}.`,['Fin 2025, une IA rédige une démonstration de ce seuil, à la demande de C. Jones.',3]]),
    chart('ia-regimes-chart','Trois trajectoires du même système',{height:350,math:true,
      controls:`<div class="g-controls ia-controls" role="group" aria-label="Représentation des trajectoires"><button type="button" data-ia-view="growth" aria-pressed="true">Taux de croissance</button><button type="button" data-ia-view="level" aria-pressed="false">Niveau · échelle log</button></div>`,
      note:`Exemple illustratif, pas une prévision. ${m('η = 1/6, 1/3, 1/2')}.`
    })+`<div class="ia-card ia-orange ia-fixed-parameters">${ul([
      `Dans ce modèle, l’importance de l’IA ou de l’automatisation (qui est du capital) ne change pas au cours du temps : <strong>${m('η')} et ${m('α')} sont fixes.</strong>`,
      `Ce qui change, c’est la vitesse à laquelle ${m('A')} et ${m('K')} s’accumulent face aux rendements décroissants.`
    ])}</div>`),source:`${ajj}, exemple 3 ; ${proof}.`},modelNotes+
    '<p>Retouche du 16 novembre 2026, à la demande d’Arnaud : l’ancien exercice de calcul de Γ est fondu ici. Avec α = 1/3 et φ = 1/2, Γ = η/((2/3) × (1/2)) = 3η ; le seuil est η* = (1−α)(1−φ) = 1/3. Lecture en mots : η est l’élan que le capital donne à la recherche ; les freins sont les rendements décroissants du capital, (1−α), et des idées plus dures à trouver, (1−φ). Ces nombres ne sont ni une calibration ni une mesure de notre proximité d’une singularité.</p><p>Dernière puce : la démonstration vient d’une conversation de C. Jones avec ChatGPT 5.2 Pro, le 13 décembre 2025, diffusée le 2 janvier 2026. L’IA n’a pas trouvé l’erreur de 2019 : P. Trammell l’avait signalée. Elle en donne une démonstration plus simple, à la demande de l’auteur. C’est un exemple du canal « inventer », pas une preuve que l’IA accélère la recherche en général.</p>'+
    '<p>La preuve initiale p. 257 d’AJJ est erronée. La correction intermédiaire de Trammell est retirée. La note diffusée par Charles Jones le 2 janvier 2026, issue de ChatGPT 5.2 Pro, donne une preuve détaillée pour δ = 0 ; son extension avec dépréciation est seulement évoquée. Le seuil projeté conserve donc δ = 0. Γ &lt; 1 : les niveaux peuvent augmenter sans borne alors que les taux tendent vers zéro. Γ = 1 : régime asymptotiquement exponentiel. Γ &gt; 1 : divergence mathématique en temps fini, distincte d’une simple accélération et d’une prévision économique.</p>'+
    '<p>Graphique : système réduit K̇ = cAK^α, Ȧ = dK^ηA^φ, c = 1, d = 2/3, K₀ = A₀ = 1, α = 1/3, φ = 1/2. Les trois trajectoires ne diffèrent que par η. Y/Y₀ = AK^α. Même croissance initiale de Y, égale à un par unité de temps du modèle. L’axe du taux est normalisé par ce taux initial, et n’exprime pas des pourcentages annuels. Horizon 0–6 unités abstraites ; aucune date de singularité réelle. Pour η = 1/3, K = exp(t), A = exp(2t/3), Y = exp(t), exactement. Les autres trajectoires sont intégrées en logarithmes par RK4. La vue niveau est logarithmique pour rendre comparables les trois trajectoires ; lecture et impression reviennent à la vue des taux.</p>'+
    '<p>Vérification indépendante pour δ = 0 : A^(2−φ)/(2−φ) − (d/c)K^(1+η−α)/(1+η−α) est constant. Asymptotiquement K̇ est proportionnel à K^p, avec p−1 = [η−(1−α)(1−φ)]/(2−φ). L’intégrale du temps converge à l’infini si et seulement si Γ &gt; 1. Démonstration complète : plan_section_4_ia.md.</p>'+
    '<p>Contrepoint empirique : Nordhaus (2021), AEJ: Macroeconomics, p. 320–321 et 326–327, DOI 10.1257/mac.20170105. Quatre de ses six diagnostics de singularité sont négatifs ou ambigus ; deux faiblement positifs évoluent lentement. Avec les données américaines disponibles à l’époque, il ne trouve pas de singularité économique proche. Ce diagnostic historique ne teste pas les capacités des IA de 2026. Son concept de singularité, incluant croissance non bornée et seuil illustratif de 20 % par an, diffère de notre divergence stricte en temps fini. Une possibilité théorique ne constitue pas une observation.</p>');

  add({id:'s4-chaine',title:'L’importance des maillons faibles : les limites de l’automatisation',html:split(
    ul([
      '<strong>Exemple :</strong> Trouver une molécule (aidé par l’IA) ne suffit pas à fabriquer un médicament.',
      ['Il faut encore la <strong>fabriquer et la tester</strong>.',1],
      ['Si les tests n’accélèrent pas, ils peuvent limiter le résultat.',2]
    ])+`<div class="ia-card ia-orange ia-chain-message" data-step="3">${ul(['Le gain d’ensemble dépend aussi des étapes que l’IA n’accélère pas.'])}</div>`,
    `<div class="ia-task-chain" role="group" aria-label="De la découverte aux tests">
      <div class="ia-task ia-discovery"><h2>Découvrir une molécule</h2>${ul([['L’IA accélère cette étape.',1]])}</div>
      <div class="ia-task-arrow" aria-hidden="true">↓</div>
      <div class="ia-task"><h2>La fabriquer</h2>${ul([['Capacité inchangée.',2]])}</div>
      <div class="ia-task-arrow" aria-hidden="true">↓</div>
      <div class="ia-task ia-testing"><h2>La tester</h2>${ul([['Capacité inchangée.',2]])}</div>
    </div>`),source:`Illustration adaptée de ${ben}, §5 ; ${jep}, p. 9–12.`},
    '<p>Ajout du 16 novembre 2026, demandé par Arnaud : expliquer les maillons faibles en mots avant de reprendre l’exemple numérique. Lien avec l’insuline : une découverte doit encore devenir un produit utilisable. Schéma pédagogique, pas description exhaustive du développement d’un médicament. On suppose ici les capacités de fabrication et de test inchangées ; cela ne signifie ni que les tests sont impossibles à améliorer ni que l’IA ne peut jamais y contribuer. Les autorisations et autres étapes restent implicites.</p><p>Au premier clic, la découverte est mise en orange ; au deuxième, les tests sont encadrés ; au troisième, la bulle résume le mécanisme. L’écran suivant regroupe fabrication et tests dans une seule capacité x₂, face à la découverte x₁. Les capacités et le résultat y sont des indices fictifs, pas des nombres observés de médicaments. Une fonction harmonique illustre une complémentarité plus forte que la Cobb–Douglas du modèle précédent.</p>');

  add({id:'s4-goulots',title:'Une tâche peut limiter l’ensemble',prov:'sim',html:split(
    ul([
      `${m('x₁')} : découvrir ; ${m('x₂')} : fabriquer et tester.${eq(`Q = ${f('2','1/x₁ + 1/x₂')}`)}`,
      [`Découverte ${m('× 10')}, fabrication et tests inchangés : résultat ${m('× 1,82')}.`,1],
      [`Avec ${m('x₂ = 1')}, le résultat reste inférieur à ${m('2')}.`,2]
    ])+`<div class="ia-card ia-orange ia-chain-message" data-step="2">${ul(['La même chaîne : accélérer la découverte ne suffit pas.'])}</div>`,chart('ia-goulots-chart','Résultat de la chaîne, indice initial = 1',{height:420,
      controls:'',note:`Fabrication et tests inchangés : ${m('x₂ = 1')}.`
    })+`<div class="ia-slider"><label for="ia-capacite">Découverte ${m('x₁')} = <output id="ia-capacite-val" for="ia-capacite">1</output></label><input id="ia-capacite" type="range" min="1" max="20" step="0.5" value="1" aria-label="Capacité de découverte, indice initial 1"></div>`),source:`Exemple harmonique adapté de ${jep}, p. 9–12 ; complément : ${ben}.`},
    '<p>Révision du 16 novembre 2026 : cet exemple suit maintenant la chaîne du médicament, expliquée sans formule. x₁ représente la découverte ; x₂ regroupe fabrication et tests, dont la capacité reste fixe. Challenger et la comparaison informatique sont retirés de cet écran pour conserver le même exemple.</p><p>Q = 2/(1/x₁ + 1/x₂), normalisé pour Q = 1 lorsque x₁ = x₂ = 1. Avec x₂ = 1, Q = 2x₁/(x₁+1), donc Q(10) = 20/11 ≈ 1,82 et Q tend vers deux lorsque x₁ tend vers l’infini. Le second intrant reste fixe. Cet exemple n’est pas le calcul à budget fixe avec réallocation optimale de Benjamin Jones (2025). Q est un indice illustratif, pas une nouvelle équation de PIB ajoutée au système précédent.</p><p>Les molécules et les essais sont une analogie pédagogique, pas une estimation du processus clinique. Les contraintes humaines et physiques, l’adoption et les complémentarités peuvent limiter les gains. La Cobb–Douglas précédente suppose davantage de possibilités de substitution. Des goulots freinent une accélération ; ils ne prouvent pas qu’elle est impossible. Le curseur déplace un point sur la courbe sans modifier le tracé ; la lecture et l’impression montrent le calcul x₁ = 10. Les références et leurs versions sont détaillées dans sources/litterature_ia/revue_et_corrections.md.</p>');

  add({id:'s4-message',title:'L’IA peut accélérer la croissance, sous conditions',html:split(
    card('Deux canaux',ul([
      '<strong>Produire :</strong> confier plus de tâches au capital.',
      ['<strong>Inventer :</strong> utiliser ce capital pour améliorer la productivité.',1]
    ])+context(['<strong>Acemoglu (2025)</strong> : +0,5 à +0,7 % de PGF en dix ans, en cumul.','Tâches existantes, sans révolution de la recherche.'],3)),
    card('Deux conditions',ul([
      ['Des rendements suffisants pour entretenir la boucle.',1],
      ['Des tâches complémentaires qui ne bloquent pas les gains.',2]
    ])+context(['<strong>C. Jones (2026)</strong> : croissance du PIB par personne au-delà de 5 % par an, à terme.','Si presque tous les maillons faibles sont automatisés.'],3),{orange:true})),source:`${ajj} ; ${ben} ; ${acemoglu} ; ${jep}, p. 4.`},
    '<p>Deux exercices aux unités et périmètres différents, pas deux bornes d’un même intervalle. Acemoglu (Economic Policy, 2025), version publiée lue intégralement : +0,66 % de niveau de PGF en dix ans dans le calcul principal, +0,53 % en tenant compte des tâches difficiles, arrondis ici à 0,7 % et 0,5 %. Économies de coûts pondérées par les tâches affectées ; pas de transformation du processus scientifique ni de nouveaux produits dans cette calibration. Certaines variantes favorables montent autour de 0,9 %. Ce sont des projections conditionnelles, pas des gains déjà observés.</p><p>C. Jones (2026), p. 4, cite Jones et Tonetti : la croissance annuelle du PIB par personne pourrait dépasser 5 % si presque tous les maillons faibles sont automatisés. Horizon de plusieurs décennies, pas une prévision datée ni +5 points attribuables à l’IA. Ce scénario ne mesure pas le même objet que le gain cumulé de PGF d’Acemoglu. Lecture conseillée : C. Jones (2026), « AI and Our Economic Future », vingt pages.</p><p>Les repères du lot 1 restent disponibles à l’oral, d’après C. Jones (2026), p. 6–8 : Solow (1987), « You can see the computer age everywhere but in the productivity statistics » ; essais d’Edison dans les années 1870 puis usines transformées cinquante ans plus tard. Innovations complémentaires et organisation expliquent les délais. Nordhaus (2021) rappelle aussi que les performances informatiques doivent se traduire dans les grandeurs économiques.</p><p>Conclusion de la section, avant la séparation bleue de conclusion générale. Le modèle explique un mécanisme ; les paramètres et contraintes décident du résultat. Les scénarios d’Anthropic figurent déjà dans l’introduction : leurs écarts de PIB en 2030 ne sont pas des estimations du seuil Γ. Leurs gains d’innovation à court horizon ne réfutent pas la boucle de long terme d’AJJ.</p><p>Transition orale vers la conclusion générale : le moteur proportionnel décrit les régimes exponentiels usuels. Le cas Γ &gt; 1 exploré ici est une exception à ce régime à taux constant. Les ressources naturelles omises du petit modèle d’IA restent des contraintes possibles ; la compatibilité environnementale n’est pas démontrée par les équations.</p>');

  /* Quatre graphiques : tous utilisent le moteur natif et son survol/clavier. */
  const curve=(fn,max=8,n=160,min=0)=>Array.from({length:n+1},(_,i)=>{const x=min+(max-min)*i/n;return [x,fn(x)];});
  function line(id,ctx,options){return G.line(id,{animate:ctx.entry?ctx.animate:false,duration:2,legend:false,margin:{l:65,r:132,t:20,b:74},labelGap:28,...options});}
  const duration=x=>x<1?G.fmt(x*60,0)+' s':x<60?G.fmt(x,0)+' min':G.fmt(x/60,0)+' h';
  G.on('s4-production',(el,ctx)=>line('ia-production-chart',ctx,{
    margin:{l:108,r:34,t:48,b:70},
    x:{min:2019.7,max:2027,ticks:[2020,2022,2024,2026],format:x=>String(x),hoverFormat:x=>D.metr.points.find(p=>p.year===x)?.dateLabel||String(x)},
    y:{min:.1,max:1000,log:true,ticks:[1/6,1,10,60,720],format:duration},
    xTitle:'Année',yTitle:'Durée humaine de la tâche (échelle log)',
    series:[{name:'Tâche réussie à 50 %',color:navy,dash:'7 5',data:D.metr.points.map(p=>[p.year,p.minutes]),format:duration}],
    markers:D.metr.points.map((p,i)=>({x:p.year,y:p.minutes,color:navy,label:p.label,dx:i===2?-16:16,dy:i===2?32:-16,anchor:i===2?'end':'start'}))
  }));
  const mooreCache=new WeakMap();
  let mooreSerial=0;
  G.on('s4-innovation',(el,ctx)=>{
    const box=el.querySelector('#ia-innovation-chart'),key=box.clientWidth+':'+box.clientHeight;
    let saved=mooreCache.get(box);
    if(saved?.key!==key||!box.contains(saved.graph.svg)){
      saved?.finish?.();box.replaceChildren();
      const inner=document.createElement('div');inner.className='chart g-chart-inner';inner.style.height='100%';box.append(inner);
      const rows=D.moore.points.slice().sort((a,b)=>a.year-b.year||a.key.localeCompare(b.key));
      const fit=D.moore.fit,fitted=year=>Math.exp(fit.a+fit.b*(year-fit.origin));
      const count=x=>x>=1e9?G.fmt(x/1e9,0)+' Md':x>=1e6?G.fmt(x/1e6,0)+' M':G.fmt(x,0);
      const describe=p=>`<strong>${G.esc(p.name)}</strong><div>${p.type}, ${p.year}</div><div>${G.fmt(p.count,0)} transistors</div>`;
      const graph=C.scatter(inner,{height:box.clientHeight,width:box.clientWidth,animate:false,
        x:{min:1968,max:2028,ticks:[1970,1980,1990,2000,2010,2020]},
        y:{min:1000,max:1e12,log:true,ticks:[1e3,1e6,1e9,1e12],format:count},
        yTitle:'Nombre de transistors (échelle log)',xTitle:'Année d’introduction',margin:{l:116,r:28,t:54,b:70},
        radius:p=>p.type==='CPU'?4:5,opacity:.62,
        points:rows.map(p=>({...p,x:p.year,y:p.count,color:p.type==='CPU'?navy:orange})),tip:describe
      });
      const points=graph.svg.querySelector('circle[data-k]').parentNode;
      const trend=C.el('path',{d:`M${graph.S.X(1970)},${graph.S.Y(fitted(1970))}L${graph.S.X(2026)},${graph.S.Y(fitted(2026))}`,
        stroke:slate,'stroke-width':2.5,'stroke-dasharray':'8 6',fill:'none',class:'ia-moore-fit'},graph.svg);
      graph.svg.insertBefore(trend,points);
      // Légende dans une zone vide au-dessus des premiers processeurs.
      const labels=C.el('g',{'pointer-events':'none'},graph.svg),lx=graph.S.X(1970)+15,ly=graph.S.Y(1e11);
      [ ['CPU',navy],['GPU',orange],['Ajustement',slate] ].forEach(([name,color],i)=>{
        const y=ly+i*30;
        if(i<2)C.el('circle',{cx:lx,cy:y-5,r:i?5:4,fill:color},labels);
        else C.el('path',{d:`M${lx-8},${y-5}h16`,stroke:color,'stroke-width':2.5,'stroke-dasharray':'5 3'},labels);
        C.txt(labels,lx+16,y,name,'ch-lab',{fill:color});
      });
      const readout=document.createElement('div');readout.className='ch-readout';readout.setAttribute('aria-live','polite');inner.append(readout);
      const marker=C.el('circle',{r:8,fill:'none',stroke:'#000','stroke-width':2,opacity:0,'pointer-events':'none'},graph.svg);
      let current=0;
      const show=()=>{const p=rows[current];marker.setAttribute('cx',graph.S.X(p.year));marker.setAttribute('cy',graph.S.Y(p.count));marker.setAttribute('opacity',1);readout.innerHTML=describe(p);readout.classList.add('on');};
      const hide=()=>{marker.setAttribute('opacity',0);readout.classList.remove('on');};
      inner.tabIndex=0;inner.setAttribute('data-keys','');inner.setAttribute('aria-label','Transistors par processeur. Flèches pour parcourir les 413 observations.');
      inner.addEventListener('focus',show);inner.addEventListener('blur',hide);
      inner.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Escape'].includes(event.key))return;
        event.preventDefault();event.stopPropagation();
        if(event.key==='Escape'){hide();inner.blur();return;}
        current=event.key==='Home'?0:event.key==='End'?rows.length-1:Math.max(0,Math.min(rows.length-1,current+(['ArrowRight','ArrowUp'].includes(event.key)?1:-1)));show();
      });
      saved={key,graph,points,trend,finish:null};mooreCache.set(box,saved);
    }
    if(ctx.static||matchMedia('(prefers-reduced-motion: reduce)').matches){saved.finish?.();return;}
    if(!ctx.entry||!ctx.animate)return;
    saved.finish?.();
    const {graph,points,trend}=saved,clip=C.el('clipPath',{id:'ia-moore-reveal-'+(++mooreSerial)},graph.svg.querySelector('defs'));
    const left=graph.S.X(1968),rect=C.el('rect',{x:left,y:0,width:0,height:box.clientHeight},clip);
    [points,trend].forEach(e=>e.setAttribute('clip-path',`url(#${clip.id})`));
    const animation=rect.animate([{width:'0px'},{width:(graph.S.X(2028)-left)+'px'}],{duration:2000,easing:'linear',fill:'forwards'});
    const finish=()=>{[points,trend].forEach(e=>e.removeAttribute('clip-path'));animation.cancel();clip.remove();saved.finish=null;};
    saved.finish=finish;animation.onfinish=finish;
  });
  const regimes=[{eta:1/6,name:'Γ = 0,5',color:slate,dash:'4 6'},
    {eta:1/3,name:'Γ = 1',color:navy},
    {eta:1/2,name:'Γ = 1,5',color:orange,dash:'9 5'}]
    .map(o=>({...o,rows:M.trajectory(o.eta)}));
  G.on('s4-seuil',(el,ctx)=>{
    const draw=()=>{
      const mode=ctx.static?'growth':el.dataset.iaView||'growth',levels=mode==='level';
      el.querySelectorAll('[data-ia-view]').forEach(button=>{
        button.setAttribute('aria-pressed',String(button.dataset.iaView===mode));
        button.onclick=event=>{event.stopPropagation();el.dataset.iaView=button.dataset.iaView;draw();button.blur();};
      });
      line('ia-regimes-chart',{...ctx,entry:false,animate:false},{margin:{l:80,r:140,t:58,b:74},
        x:{min:0,max:6,ticks:[0,2,4,6]},xTitle:'Temps (unités du modèle)',
        y:levels?{min:1,max:100000,log:true,ticks:[1,10,100,1000,10000,100000],format:x=>G.fmt(x,0)}:{min:0,max:3,ticks:[0,1,2,3]},
        yTitle:levels?'Production Y, indice initial = 1':'Taux de croissance, indice initial = 1',
        series:regimes.map(o=>({name:o.name,endLabel:true,color:o.color,dash:o.dash,data:o.rows.filter((_,i)=>i%10===0).map(r=>[r.t,levels?r.Y:r.gY]),format:x=>G.fmt(x,2)}))
      });
    };
    draw();
  });
  G.on('s4-chaine',(el,ctx)=>{
    el.querySelector('.ia-discovery').classList.toggle('ia-accelerated',ctx.static||ctx.step>=1);
    el.querySelector('.ia-testing').classList.toggle('ia-constrained',ctx.static||ctx.step>=2);
  });
  G.on('s4-goulots',(el,ctx)=>{
    const input=el.querySelector('#ia-capacite'),output=el.querySelector('#ia-capacite-val');
    if(ctx.static||ctx.entry||Number(el.dataset.iaStep)!==ctx.step)input.value=(ctx.static||ctx.step>=1)?10:1;
    el.dataset.iaStep=ctx.step;
    const graph=line('ia-goulots-chart',ctx,{margin:{l:60,r:142,t:20,b:74},
      x:{min:0,max:20,ticks:[0,5,10,15,20]},y:{min:0,max:2.25,ticks:[0,1,2]},xTitle:'Capacité de découverte, x₁',
      series:[{name:'Résultat Q',endLabel:true,color:navy,data:curve(x=>M.bottleneck(x),20),format:x=>G.fmt(x,2)}],
      refLines:[{y:2,color:slate,dash:'6 6'}]
    });
    if(!graph.svg.querySelector('.ia-limit-label'))C.txt(graph.svg,graph.S.X(20)+8,graph.S.Y(2)-14,'Plafond : 2','ch-lab ia-limit-label',{fill:slate});
    function point(){
      const x=ctx.static?10:Number(input.value),q=M.bottleneck(x);output.value=G.fmt(x,x%1?1:0);
      graph.svg.querySelector('.ia-cursor')?.remove();
      const g=C.el('g',{class:'ia-cursor'},graph.svg),X=graph.S.X(x),Y=graph.S.Y(q);
      C.el('line',{x1:X,x2:X,y1:graph.S.Y(0),y2:Y,stroke:orange,'stroke-width':2,'stroke-dasharray':'5 5'},g);
      C.el('circle',{cx:X,cy:Y,r:7,fill:orange,stroke:'#fff','stroke-width':2},g);
      C.txt(g,X,Y+35,'Q = '+G.fmt(q,2),'ch-val',{'text-anchor':'middle',fill:orange,'font-style':'italic'});
    }
    input.oninput=point;point();
  });
})();
