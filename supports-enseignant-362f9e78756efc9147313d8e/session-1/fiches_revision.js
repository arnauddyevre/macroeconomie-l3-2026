/* Fiches de référence du chapitre 1 — révision demandée par Arnaud, 1er novembre 2026.
 * Contenu : cours actuel et données déjà projetées. Ordre final : reorganisation.js.
 * Les fiches restent en annexe. Aucun export n’est généré par ce module. */
(function () {
  'use strict';
  const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const attr = text => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const lines = (...items) => items.map(item => `<span class="fiche-equation-line">${item}</span>`).join('');
  const v = name => `<var>${name}</var>`;
  const rate = (name, continuous = false) => `<var>${continuous ? 'g' : 'r'}</var><sub>${name}</sub>`;
  const defs = (title, text) => ({title, text});
  const formula = (title, equation, detail) => ({title, equation, detail});
  const sources = {
    pib: link('https://www.insee.fr/fr/metadonnees/definition/c1365', 'Insee, produit intérieur brut'),
    volume: link('https://www.insee.fr/fr/metadonnees/definition/c1952', 'Insee, mesure en volume'),
    fbcf: link('https://www.oecd.org/fr/data/indicators/investment-gfcf.html', 'OCDE, formation brute de capital fixe'),
    rnb: link('https://www.insee.fr/fr/metadonnees/definition/c2271', 'Insee, revenu national brut'),
    rdba: link('https://www.insee.fr/fr/metadonnees/definition/c1049', 'Insee, revenu disponible ajusté'),
    dina: link('https://wid.world/methodology/', 'WID, comptes distribués'),
    climat: link('https://ourworldindata.org/co2-gdp-decoupling', 'Our World in Data, PIB et CO₂'),
    redistribution: link('https://www.insee.fr/fr/statistiques/8974371', 'Insee Analyses 118, figure 1c')
  };

  const definitions = [
    {
      id: 'retenir-definitions', theme: 'Production et frontière du PIB',
      cards: [
        defs('Produit intérieur brut (PIB)', 'Valeur de la production finale des unités résidentes pendant une période, avant déduction de l’usure du capital.'),
        defs('Valeur ajoutée et consommations intermédiaires', 'La valeur ajoutée est la production moins les biens et services consommés ou transformés pour produire. Elle mesure ce que le producteur ajoute.'),
        defs('Formation brute de capital fixe (FBCF)', 'Valeur des actifs produits acquis ou créés, moins les cessions, utilisés pour produire pendant plus d’un an : machines, logiciels, logements.'),
        defs('Flux et stock', 'Un flux se mesure sur une période : production, revenu. Un stock se mesure à une date : patrimoine, capital, dette.'),
        defs('Frontière de production', 'Convention délimitant ce qui est compté. Services publics et loyers imputés inclus. Services domestiques non rémunérés généralement exclus.'),
        defs('PIB réel par habitant', 'Production réelle divisée par la population totale. C’est une moyenne par personne, pas le revenu effectivement reçu par chacune.')
      ],
      source: `${sources.pib} · ${sources.fbcf}.`,
      refs: ['pib-mots', 'pib-def', 'pain', 'four', 'ca-compte-1', 'loyers-imputes', 'patrimoine', 'identite'],
      notes: 'Brut signifie avant consommation de capital fixe, et non avant impôts. La FBCF porte sur les actifs produits, nets des cessions : un achat de terrain ou de titre financier n’est pas de la FBCF. Les services publics non marchands sont évalués principalement à leurs coûts. Les destructions accidentelles de patrimoine sont distinctes des variations de stocks de biens produits comptabilisées dans le PIB.'
    },
    {
      id: 'retenir-definitions-prix', theme: 'Prix, comparaisons et travail',
      cards: [
        defs('PIB nominal et PIB réel', 'Le nominal mesure la production aux prix courants. Le réel retire l’effet des variations de prix pour suivre les volumes produits.'),
        defs('IPC et déflateur du PIB', 'L’indice des prix à la consommation (IPC) suit les prix de la consommation des ménages, importations comprises. Le déflateur suit la production intérieure, exportations comprises.'),
        defs('Inflation et pouvoir d’achat', 'L’inflation est une hausse générale des prix. Le pouvoir d’achat est la quantité de biens et services qu’un revenu permet d’acquérir.'),
        defs('Parité de pouvoir d’achat (PPA)', 'Taux de conversion corrigeant les différences de prix entre pays, pour comparer des volumes de biens et de services.'),
        defs('Productivité horaire', 'Production réelle moyenne par heure effectivement travaillée : PIB réel divisé par le total des heures travaillées.'),
        defs('Durée du travail et emplois par habitant', 'Durée : heures annuelles par personne en emploi. Emplois par habitant : personnes en emploi divisées par la population totale.')
      ],
      source: `${sources.volume} · Définitions des indices et de la productivité présentées dans le chapitre.`,
      refs: ['nominal-reel', 'formule-reel', 'ipc-deflateur', 'master-ipc-poids', 'ppa-change', 'identite-defs', 'long-terme'],
      notes: 'Les comptes publiés utilisent des volumes aux prix de l’année précédente chaînés : ne pas les définir comme une somme calculée pour toujours avec les prix d’une seule année. Le panier et les pondérations de l’IPC sont actualisés. L/N utilise la population totale : ne pas l’appeler taux d’emploi des 15–64 ans. Une PPA n’est pas un taux de change de marché.'
    },
    {
      id: 'retenir-definitions-revenus', theme: 'Revenus et répartition',
      cards: [
        defs('Revenu national brut (RNB)', 'Revenus primaires reçus par les résidents, y compris ceux provenant de l’étranger. Résidence économique ne signifie pas nationalité.'),
        defs('Revenus primaires', 'Revenus issus de la participation à la production ou de la détention d’actifs, avant redistribution par impôts sur le revenu et prestations sociales.'),
        defs('Revenu disponible brut des ménages (RDB)', 'Revenu dont les ménages disposent pour consommer ou épargner après impôts directs, cotisations et prestations sociales en espèces.'),
        defs('Revenu disponible brut ajusté', 'RDB complété par les services individualisables reçus en nature, notamment la santé et l’éducation financées collectivement.'),
        defs('Comptes nationaux distribués', 'Répartition des agrégats de revenus entre groupes de personnes, cohérente avec les totaux de la comptabilité nationale.'),
        defs('Croissance anonyme et non anonyme', 'Anonyme : revenus aux mêmes rangs dans la distribution. Non anonyme : revenus des mêmes personnes, classées selon leur rang initial.')
      ],
      source: `${sources.rnb} · ${sources.rdba} · ${sources.dina}.`,
      refs: ['master-rnb', 'rdb-q', 'pib-revenu', 'comptes-distribues', 'transferts-nature', 'croissance-rangs-exemple', 'croissance-psid'],
      notes: 'DINA signifie Distributional National Accounts. La méthode WID porte sur le revenu national net, pas simplement le PIB brut. Les comptes distribués élargis de l’Insee présentés en cours incluent aussi des services publics collectifs : ils dépassent le seul RDB ajusté. Primaire ne signifie pas avant toute fiscalité. Les courbes PSID utilisent les mêmes personnes et poids dans les deux méthodes, avec des revenus du travail positifs et une sélection d’âge. Elles ne distribuent pas tout le PIB. La moyenne des douze taux annualisés n’est pas une croissance cumulée.'
    },
    {
      id: 'retenir-definitions-climat', theme: 'Production et climat',
      cards: [
        defs('CO₂ et gaz à effet de serre (GES)', 'Le CO₂ est un gaz à effet de serre parmi d’autres. Le CO₂ équivalent exprime les effets des différents gaz dans une unité commune.'),
        defs('Intensité en émissions', 'Émissions par unité de PIB réel. Une intensité plus faible signifie produire avec moins d’émissions par unité produite.'),
        defs('Émissions territoriales', 'Émissions produites à l’intérieur des frontières d’un pays, quel que soit le lieu de consommation des biens et services.'),
        defs('Empreinte carbone', 'Émissions associées à la demande finale d’un pays : émissions intérieures, plus celles des importations, moins celles des exportations.'),
        defs('Découplage relatif', 'Le PIB augmente plus vite que les émissions. L’intensité diminue, mais les émissions totales augmentent encore.'),
        defs('Découplage absolu', 'Le PIB augmente tandis que les émissions totales diminuent, pour une période et un périmètre donnés.')
      ],
      source: `${sources.climat} · Insee–SDES et Citepa, périmètres des comptes carbone présentés dans le chapitre.`,
      refs: ['kaya', 'decouplage-def', 'fr-decouplage', 'empreinte', 'decouplage-monde', 'decouplage-emergents'],
      notes: 'Garder le même périmètre dans une comparaison : les graphiques français portent sur les GES en CO₂e, les comparaisons internationales sur le CO₂ fossile et industriel, hors changement d’usage des terres. Les émissions des unités résidentes ne sont pas exactement les émissions territoriales : l’activité des résidents à l’étranger et celle des non-résidents sur le territoire diffèrent. Le CO₂e repose sur une convention de potentiel de réchauffement et un horizon temporel. La définition du découplage relatif reprend ici le cas pédagogique d’émissions totales encore croissantes.'
    }
  ];

  const formulas = [
    {
      id: 'formules-1', theme: 'Calculer la production et les revenus',
      cards: [
        formula('Valeur ajoutée', lines('VA = production', '− consommations intermédiaires'), 'Éviter de compter plusieurs fois les biens utilisés pour produire.'),
        formula('PIB par la production', lines('PIB = Σ VA', '+ impôts nets sur les produits'), 'VA aux prix de base. PIB aux prix du marché. « Nets » : impôts moins subventions.'),
        formula('PIB par les revenus', lines('PIB = rémunérations', '+ EBE + revenu mixte', '+ impôts nets'), 'Salaires et cotisations. EBE : excédent brut d’exploitation. Impôts nets sur production et importations.'),
        formula('PIB par les dépenses', `${v('Y')} = ${v('C')} + ${v('G')} + ${v('I')} + ${v('X')} − ${v('M')}`, 'C et G : consommation privée et publique. I : investissement de tous les secteurs, stocks compris. X − M : exportations moins importations.'),
        formula('Revenu national brut', lines('RNB = PIB', '+ revenus primaires reçus', '− revenus primaires versés'), 'Revenus reçus de l’étranger et versés à l’étranger.'),
        formula('Revenu disponible ajusté', lines('RDB ajusté = RDB', '+ transferts sociaux en nature'), 'Pour les ménages : notamment les services de santé et d’éducation financés collectivement.')
      ],
      source: `${sources.pib} · ${sources.rnb} · ${sources.rdba}.`,
      refs: ['pain', 'pib-def', 'trois-approches', 'va-revenus-schema', 'pib-depenses', 'master-rnb', 'pib-revenu'],
      notes: 'Les trois approches donnent le même PIB. L’approche production ajoute les impôts nets sur les produits ; l’approche revenus les impôts nets sur la production et les importations. Ne pas ajouter intérêts et dividendes une seconde fois à l’excédent d’exploitation. C comprend ici la consommation des ménages et des ISBLSM. I comprend la FBCF, les variations de stocks et les acquisitions nettes d’objets de valeur. RDB = consommation + épargne exige de traiter l’ajustement des droits à pension D8 : cette égalité non qualifiée n’est pas retenue comme rappel général.'
    },
    {
      id: 'retenir-formules-prix', theme: 'Corriger les prix et calculer le pouvoir d’achat', hint: 'Taux en décimal. Indices en base 100.',
      cards: [
        formula('Du nominal au réel', lines(`${v('Y')} = ${v('Y')}<sup>nom</sup> / (${v('D')}/100)`, `${v('D')} = 100 × ${v('Y')}<sup>nom</sup> / ${v('Y')}`), 'Y : PIB réel. D : déflateur du PIB, base 100.'),
        formula('Croissance réelle', lines(`1 + ${rate('Y')} = (1 + ${rate('nom')}) / (1 + π<sub>D</sub>)`, `${rate('Y')} ≈ ${rate('nom')} − π<sub>D</sub>`), 'La soustraction est une approximation pour de petits taux. Utiliser la variation du déflateur du PIB.'),
        formula('Indice à panier fixe', `IPC<sub>t</sub> = 100 × Σ<sub>i</sub> ${v('w')}<sub>i,0</sub> × (${v('p')}<sub>i,t</sub> / ${v('p')}<sub>i,0</sub>)`, 'w : parts de dépense initiales, dont la somme vaut 1. p : prix des biens et services.'),
        formula('Variation d’un indice', `π<sub>t</sub> = IPC<sub>t</sub> / IPC<sub>t−1</sub> − 1`, 'Exemple : de 100 à 105, la hausse est de 5 %. De 105 à 100, la baisse est de 4,76 %.'),
        formula('Chaîner les variations', `IPC<sub>T</sub> = IPC<sub>0</sub> × ∏<sub>t=1…T</sub> (1 + π<sub>t</sub>)`, 'Multiplier les facteurs de variation. Les pondérations officielles peuvent changer d’une année à l’autre.'),
        formula('Pouvoir d’achat', lines(`${rate('PA')} = (1 + ${rate('revenu nominal')})`, '/ (1 + inflation) − 1'), 'Employer l’indice des prix correspondant à la consommation considérée, et non automatiquement le déflateur du PIB.')
      ],
      source: `${sources.volume} · Calculs sur les indices des prix présentés dans le chapitre.`,
      refs: ['nominal-reel', 'formule-reel', 'ipc-deflateur', 'master-ipc-formule', 'master-ipc-poids', 'courses', 'exercice-niveau-vie-3'],
      notes: 'r est le taux discret, en décimal. Le panier fixe est un cas pédagogique par comparaison, pas un panier nécessairement immuable pendant toute la série. Les parts de consommation des comptes nationaux projetées dans le chapitre ne sont pas exactement les pondérations de l’IPC. La croissance du PIB réel utilise son déflateur. Le pouvoir d’achat du RDB utilise l’indice de prix de la dépense de consommation des ménages. La PPA reste dans les définitions : aucun nouvel exercice de conversion n’est introduit.'
    },
    {
      id: 'retenir-formules-croissance', theme: 'Calculer et décomposer la croissance', hint: 'r : taux discret. g : taux instantané. T : durée en années. Taux en décimal, sauf mention « % ».',
      cards: [
        formula('Variation et logarithme', lines(`${rate('x,t')} = ${v('x')}<sub>t+1</sub> / ${v('x')}<sub>t</sub> − 1`, `Δ ln ${v('x')} = ln(1 + ${rate('x,t')}) ≈ ${rate('x,t')}`), 'x doit être positif. L’approximation logarithmique vaut pour de petits taux.'),
        formula('Composer et annualiser', lines(`${v('x')}<sub>T</sub> = ${v('x')}<sub>0</sub>(1 + ${v('r')})<sup>T</sup>`, `${rate('ann')} = (${v('x')}<sub>T</sub> / ${v('x')}<sub>0</sub>)<sup>1/T</sup> − 1`), 'Première formule : taux constant. Seconde : taux annuel moyen, y compris entre deux vagues PSID.'),
        formula('Croissance instantanée', lines(`${rate('x', true)} = ${v('ẋ')}/${v('x')} = d ln ${v('x')} / dt`, `${v('x')}(t) = ${v('x')}<sub>0</sub>e<sup>gt</sup>`, `${v('g')} = ln(1 + ${v('r')})`), 'Trajectoire exponentielle si g est constant. g et r ne sont pas exactement le même taux.'),
        formula('Temps de doublement', lines(`${v('T')} = ln 2 / ${v('g')}`, `= ln 2 / ln(1 + ${v('r')})`, `${v('T')} ≈ 70 / ${rate('%')}`), 'Taux positif et constant. La règle de 70 suppose un petit taux annuel, en % : 2, et non 0,02.'),
        formula('Production par habitant', lines(`${v('Y/N')} = ${v('Y/H')} × ${v('H/L')} × ${v('L/N')}`, `${rate('Y/N', true)} = ${rate('Y/H', true)} + ${rate('H/L', true)} + ${rate('L/N', true)}`, `= ${rate('Y', true)} − ${rate('N', true)}`), 'Y : PIB réel. H : heures. L : personnes en emploi. N : population totale. Addition exacte des taux instantanés.'),
        formula('Émissions et croissance', lines(`${v('E')} = ${v('N')} × ${v('Y/N')} × ${v('E/Y')} = ${v('Y')} × ${v('I')}<sub>E</sub>`, `1 + ${rate('E')} = (1 + ${rate('Y')})(1 + ${rate('I<sub>E</sub>')})`, `${rate('E')} ≈ ${rate('Y')} + ${rate('I<sub>E</sub>')}`), 'I<sub>E</sub> = E/Y : intensité. Approximation pour petits taux. Même périmètre pour E.')
      ],
      source: 'Identités et calculs du chapitre. Les formules exactes et leurs approximations sont distinguées.',
      refs: ['regle-70', 'identite', 'exercice-niveau-vie-1', 'exercice-niveau-vie-2', 'exercice-niveau-vie-4', 'croissance-psid', 'kaya', 'kaya-q'],
      notes: 'Dans l’exercice France–États-Unis, le taux logarithmique moyen est 100 ln(xT/x0)/T. Il diffère du taux annualisé géométrique 100[(xT/x0)^(1/T)−1] utilisé pour le PSID. Les décompositions additives sont exactes pour les taux instantanés ou les différences de logarithmes, approchées pour les variations discrètes usuelles. À croissance du PIB de 2 %, la stabilisation exacte des émissions exige une intensité multipliée par 1/1,02, soit −1,9608 %, et non exactement −2 %. CO₂ et CO₂e ne sont pas interchangeables. La moyenne PSID est une moyenne de taux individuels ou de rang, puis une moyenne des douze intervalles, pas la croissance du revenu agrégé.'
    }
  ];

  const benchmarks = [
    {
      id: 'reperes-fin', theme: 'Production, croissance et travail',
      cards: [
        {title:'Deux siècles de croissance', value:'× 22 / × 15', text:'France et États-Unis / monde. PIB réel par habitant, 1820–2022.', detail:'Dollars internationaux de 2011. Maddison Project Database 2023.', raw:[21.59535655,21.87225729,14.78457447]},
        {title:'PIB de la France', value:'≈ 3 000 Md€', text:'Production annuelle en 2025, en euros courants.', detail:'Insee, comptes 2025 provisoires, base 2020.', raw:2991.056},
        {title:'Consommation des ménages', value:'≈ 52 % du PIB', text:'France, 2025. Dépense de consommation finale des ménages.', detail:'Hors ISBLSM. Insee, comptes 2025 provisoires.', raw:51.68539138},
        {title:'PIB réel par habitant', value:'52 000 / 73 000 $', text:'France / États-Unis, en 2023. La France atteint environ 71 % du niveau américain.', detail:'Dollars internationaux de 2021, PPA. PWT 11.0.', raw:[51698.77810914328,72718.48665065484]},
        {title:'Production par heure', value:'78 / 83 $', text:'France / États-Unis, en 2023, par heure travaillée.', detail:'Dollars internationaux de 2021, PPA. PWT 11.0.', raw:[78.02001640094932,83.33814844207255]},
        {title:'Durée annuelle du travail', value:'1 500 / 1 800 h', text:'France / États-Unis, en 2023, par personne en emploi.', detail:'Heures annuelles moyennes. PWT 11.0.', raw:[1487.10,1788.88]}
      ],
      source:'Maddison Project Database 2023 · Insee, comptes nationaux 2025 · Penn World Table 11.0.',
      refs:['deux-siecles','trois-approches','pib-revenu','exercice-niveau-vie-5','long-terme'],
      notes:'Repères issus des séries déjà utilisées en cours, sans actualisation externe. Maddison : 39 066/1 809 en France, 58 487,46586089506/2 674,048 aux États-Unis, 16 677/1 128 dans le monde. PIB France 2025 : 2 991,056 Md€. Consommation des ménages : 1 545,939 Md€, soit 51,6854 %. Le C du graphique des composantes inclut les ISBLSM et représente 54,0082 % : ne pas confondre les deux périmètres. Les trois comparaisons France–États-Unis reprennent les lignes 2023 de data/long_terme_data.js, PWT 11.0, comme l’exercice. Elles ne sont pas en euros courants ni en dollars au taux de change. Le rapport des PIB réels par habitant vaut 71,0944 %. Les conventions nationales sur les heures doivent rester à l’esprit.'
    },
    {
      id: 'retenir-reperes-repartition-climat', theme: 'Patrimoine, partage et climat',
      cards: [
        {title:'Patrimoine national net', value:'≈ 6,8 années de PIB', text:'France, fin 2025. Un stock comparé à un flux annuel.', detail:'Nation entière, pas seulement les ménages. Insee.', raw:6.765296604},
        {title:'Ressources des ménages', value:'1 877 → 2 413 Md€', text:'France, 2025 : du RDB au RDB ajusté en ajoutant les services reçus en nature.', detail:'Euros courants. Insee, comptes 2025 provisoires.', raw:[1876.863,2413.480]},
        {title:'Redistribution élargie', value:'26,3 → 3,5', text:'France, 2023 : rapport des revenus moyens des dixièmes extrêmes, avant / après transferts.', detail:'Mêmes groupes. Ce n’est pas le rapport des seuils D9/D1.', raw:[26.29310345,3.537593985]},
        {title:'Découplage mondial relatif', value:'PIB × 2,7 / CO₂ × 1,7', text:'1990–2024. Intensité en CO₂ réduite d’environ 38 %.', detail:'PIB réel WDI. CO₂ fossile, GCB 2025, net du puits de carbonatation du ciment.', raw:[2.685991678,1.677619893,-37.54188045]},
        {title:'Découplage français absolu', value:'PIB +69 % / GES −34 %', text:'1990–2025. Croissance réelle et baisse des émissions territoriales.', detail:'GES en CO₂e, hors usage des terres. 2025 provisoire. Insee–Citepa.', raw:[68.98751149,-34.28414701]},
        {title:'Empreinte et émissions', value:'8,2 / 5,9 tCO₂e', text:'France, 2024, par habitant. Empreinte de consommation / émissions des résidents.', detail:'Résidents ≠ territoire. Insee–SDES, 2024 provisoire.', raw:[8.210,5.899]}
      ],
      source:`Insee, comptes nationaux et patrimoine · ${sources.redistribution} · WDI–GCB · Citepa · Insee–SDES.`,
      refs:['patrimoine','pib-revenu','comptes-distribues','emissions-monde','fr-decouplage','empreinte'],
      notes:'Patrimoine national net : 20 235,381 Md€ fin 2025, rapporté au PIB de 2 991,056 Md€/an. RDB : 1 876,863 Md€ ; transferts sociaux en nature : 536,617 Md€ ; RDB ajusté : 2 413,480 Md€. Les arrondis des cartes ne constituent pas une égalité comptable exacte. Insee Analyses 118 : 152 500/5 800 avant transferts et 94 100/26 600 après, mêmes dixièmes de niveau de vie usuel, euros par unité de consommation, avant imputation du déficit public. Monde : PIB 36,05→96,83 milliers de milliards de dollars constants de 2015 ; CO₂ 22,52→37,78 Gt. France : PIB réel 1 566,24→2 646,75 Md€ de 2020 ; GES territoriaux 546,9→359,4 MtCO₂e, hors UTCATF. Empreinte 2024 : 8,210 tCO₂e/hab ; émissions des résidents : 5,899, un périmètre différent du territoire. Les anciens repères −5 %/an, cible BCE, revenu médian et productivité en euros courants ne figurent plus dans cette sélection. Aucun taux PSID unique ne résume toute sa distribution.'
    }
  ];

  const definitionCard = c => `<div class="def fiche-card"><div class="def-label">Définition</div><div class="def-term">${c.title}</div><p class="def-text">${c.text}</p></div>`;
  const formulaCard = c => `<div class="def fiche-card"><div class="def-label">Définition</div><div class="def-term">${c.title}</div><div class="fiche-equation">${c.equation}</div><p class="fiche-detail">${c.detail}</p></div>`;
  const benchmarkCard = c => `<div class="fiche-card fiche-benchmark" data-rep="${attr(c.title + ' — ' + c.text)}" data-rep-value="${attr(c.value)}" data-rep-sub="${attr(c.detail)}"><div class="fiche-card-label">Repère</div><div class="fiche-benchmark-title">${c.title}</div><div class="fiche-value">${c.value}</div><p class="fiche-benchmark-text">${c.text}</p><p class="fiche-detail">${c.detail}</p></div>`;
  const install = (group, category, type, card) => group.forEach((fiche, i) => {
    const slide = {
      id:fiche.id, part:'Annexes', appendix:true, exercise:false, prov:null,
      title:`Ce qu’il faut retenir : ${category} (${i + 1}/${group.length})`,
      cls:`fiche-revision fiche-${type}`,
      html:`<div class="fiche-layout"><div class="fiche-heading"><p class="fiche-theme">${fiche.theme}</p>${fiche.hint ? `<p class="fiche-hint">${fiche.hint}</p>` : ''}</div><div class="fiche-grid">${fiche.cards.map(card).join('')}</div></div>`,
      source:fiche.source
    };
    const previous = window.SLIDES.find(s => s.id === fiche.id);
    if (previous) Object.assign(previous, slide); else window.SLIDES.push(slide);
    window.NOTES[fiche.id] = `<p>1er novembre 2026 : révision des fiches de référence demandée par Arnaud. ${fiche.theme}. Diapositives de référence : ${fiche.refs.join(', ')}. Six bulles au maximum, visibles ensemble pour la consultation et l’impression.</p><p>${fiche.notes}</p>`;
  });
  install(definitions, 'les définitions', 'definitions', definitionCard);
  install(formulas, 'les formules', 'formules', formulaCard);
  install(benchmarks, 'les ordres de grandeur', 'reperes', benchmarkCard);
  window.FICHES_REVISION = {
    date:'2026-11-01', ids:[...definitions, ...formulas, ...benchmarks].map(f => f.id),
    definitions, formulas, benchmarks
  };
})();
