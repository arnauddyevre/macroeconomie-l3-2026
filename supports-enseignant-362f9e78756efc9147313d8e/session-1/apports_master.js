/* Apports du cours de master 2025 d’Arnaud Dyèvre, adaptés pour la L3 2026.
 * À charger après revision.js, puis appeler integrerApportsMaster() avant Deck.build.
 * Source intégrale et concordance : master_correspondance.md. */
(function () {
  'use strict';
  window.integrerApportsMaster = function () {
    if (window.MASTER_INTEGRE) throw new Error('Les apports du master sont déjà intégrés.');
    window.MASTER_INTEGRE = true;
    const P1='Partie 1 · Que mesure-t-on ?', P2='Partie 2 · Après les prix';
    const ANN='Annexes · Approfondir la mesure';
    const file='../../references/sources/master_2025/MEF_Macroeconomics_Lecture_1(1).pdf';
    const provenance = (pages, extra='') => extra ? `${extra}.` : '';
    const list = (...items) => `<div class="rev-body"><ul class="master-list">${items.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
    const formula = text => `<div class="pj-fbox"><p class="pj-f">${text}</p></div>`;
    const table = (headers,rows) => `<table class="t pj-tab master-table"><thead><tr>${headers.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    const stack = (...x) => `<div class="p-col master-stack">${x.join('')}</div>`;
    const fig = (name,alt,caption) => `<figure class="rev-figure master-figure"><img src="assets/master_2025/${name}" alt="${alt}"><figcaption>${caption}</figcaption></figure>`;
    const answer = html => `<div data-step="1" class="master-answer">${html}</div>`;
    const notes = (id,pages,text) => {window.NOTES[id]=`<p>23 octobre 2026 — apport du cours de master d’Arnaud, pages PDF <a href="${file}#page=${parseInt(pages,10)}">${pages}</a>. ${text}</p>`;};
    const make = (id,title,part,html,pages,note='',extra='') => {
      notes(id,pages,note);
      return {id,title,part,html,source:provenance(pages,extra),masterPages:pages,appendix:part===ANN};
    };
    const added=[];
    const insert=(anchor,slides)=>{const i=window.SLIDES.findIndex(x=>x.id===anchor);if(i<0)throw new Error(`Ancrage master absent : ${anchor}`);window.SLIDES.splice(i+1,0,...slides);added.push(...slides);};
    const edit=(id,fn)=>{const s=window.SLIDES.find(x=>x.id===id);if(!s)throw new Error(`Écran master absent : ${id}`);fn(s);};

    const wealthSource = figure => `<a href="https://gabriel-zucman.eu/files/PikettyZucman2014QJE.pdf" target="_blank" rel="noopener noreferrer">T. Piketty et G. Zucman, QJE, 2014, figure ${figure}</a>`;
    const wealthChart = (id, subtitle, note) => `<div class="p-col master-wealth"><p class="p-sub">${subtitle}</p><div id="master-wealth-${id}-chart" class="chart master-wealth-chart" style="width:100%;height:470px"></div><p class="master-wealth-note">${note}</p></div>`;
    insert('patrimoine',[
      make('master-patrimoine-monde','Le patrimoine privé rapporté au revenu national',P1,
        wealthChart('world','Patrimoine privé net, 1970–2010 · huit économies',
          'Ici, revenu national net = PIB − usure du capital + revenus nets reçus de l’étranger.<br>600 % = six années de revenu national.'),
        '71','Remplace la reproduction historique en annexe par les données des auteurs, figure I de Capital is Back (QJE, 2014). Huit séries annuelles 1970–2010, 41 points chacune ; AppendixTables.xls, Table A5!A105:I145, identiques au cache du graphique Figure1. Ratios multipliés par 100, sans actualisation. Le patrimoine privé net comprend les ménages et les institutions sans but lucratif au service des ménages, actifs non financiers et financiers moins passifs. Le dénominateur est le revenu national net, pas le PIB du calcul précédent. La valorisation des actifs peut varier sans production correspondante.',wealthSource('I')),
      make('master-patrimoine-france','Le patrimoine en France : composition et évolution',P1,
        wealthChart('france','Patrimoine national, 1700–2010 · en % du revenu national net',
          'Dates repères : années ou moyennes décennales, espacées régulièrement comme dans l’original.<br>Les actifs extérieurs nets négatifs sont représentés sous zéro.'),
        '72','Remplace la figure d’annexe par les 13 repères de Figures.xls, DataFig9!A9:F21, figure IX de l’article. Patrimoine national = privé + public = terres agricoles + logements + autre capital intérieur + actifs extérieurs nets. Les ratios sont multipliés par 100 ; aucune nouvelle observation annuelle interpolée. Les dates sont les étiquettes des auteurs, mêlant observations ponctuelles et moyennes de décennies ; voir la note de source. Pour rendre les valeurs négatives visibles, les actifs extérieurs nets négatifs sont sous zéro, et la ligne de total conserve leur soustraction. Distinguer changements de composition, prix des actifs et accumulation.',wealthSource('IX')),
      make('master-patrimoine-us','Le patrimoine aux États-Unis : une autre trajectoire',P1,
        wealthChart('us','États-Unis, 1770–2010 · en % du revenu national net',
          '* Valorisation historique des personnes réduites en esclavage dans les comptes des propriétaires.<br>Dates repères espacées régulièrement ; actifs extérieurs nets négatifs sous zéro.'),
        '73','Remplace la figure d’annexe par les 11 repères nationaux de Figures.xls, DataFig10!A11:I21, figure X publiée (Figure11 dans le classeur). Les lignes séparées Nord/Sud 1770 ne sont pas reprises. Le total historique, colonne H, ajoute la colonne I « Slaves » au patrimoine national de la colonne B. Cette composante documente les valorisations des sociétés esclavagistes, pas une valeur légitime des personnes. Les observations regroupent années et moyennes de décennies ; les segments relient les repères d’origine et ne créent pas de données annuelles. Actifs extérieurs nets négatifs conservés sous zéro et soustraits du total. Période et valeurs historiques inchangées.',wealthSource('X'))
    ]);

    insert('pib-mots',[
      make('master-brut-net','Brut ou net : faut-il retrancher l’usure du capital ?',P1,stack(
        formula('Produit intérieur net = PIB − consommation de capital fixe'),
        table(['Exemple fictif, sur un an','Montant'],[['Valeur ajoutée de l’économie','100 €'],['Usure et obsolescence du capital','10 €'],['Produit intérieur net','90 €']]),
        '<p class="p-sub">L’investissement remplace une partie du capital usé. Il ne faut pas le compter deux fois.</p>'
      ),'18','Exemple simplifié sans impôts sur les produits. Le master ajoutait 10 de dépenses de remplacement à une VA de 60, sans préciser si cette VA était celle de l’usine ou de toute l’économie. Cet exemple ambigu n’est pas repris. La CCF est une mesure économique, pas l’amortissement fiscal. Le produit net ne mesure pas à lui seul un revenu soutenable au sens environnemental.')
    ]);
    insert('trois-approches',[
      make('master-revenus','La production devient des revenus',P1,stack(
        formula('PIB = rémunération des salariés + EBE<br>+ revenu mixte + impôts − subventions'),
        list('<b>Salariés :</b> salaires et cotisations sociales employeurs.','<b>Entreprises :</b> excédent brut d’exploitation (EBE).','<b>Indépendants :</b> revenu mixte, mêlant travail et capital.','<b>Administrations :</b> impôts nets de subventions sur la production et les importations.'),
        '<p class="p-sub">La valeur ajoutée ne se confond pas avec le profit.</p>'
      ),'12–17','Corrige « net transfers » du master : il s’agit ici des impôts moins subventions sur la production et les importations. Les revenus de la propriété (intérêts, dividendes, loyers de terrains) redistribuent ensuite les revenus primaires ; ils ne s’ajoutent pas une deuxième fois à l’EBE. Un loyer d’immeuble est un service produit.','<a href="https://www.insee.fr/fr/metadonnees/definition/c1365" target="_blank" rel="noopener noreferrer">Insee, définition du PIB</a>'),
      make('master-revenus-ue','Comment le revenu se répartit-il en Europe ?',P1,
        fig('p16_revenus_ue_2024.png','Part des composantes du revenu dans le PIB des économies européennes en 2024','Pays européens, 2024 : salaires, cotisations employeurs, excédent brut et revenu mixte, impôts nets.'),
        '16','Figure Eurostat conservée telle qu’intégrée au PDF du master. L’image inclut l’agrégat UE et des pays européens, dont certains hors UE. Millésime historique 2024 ; ne pas la présenter comme une actualisation 2026. Données brutes non fournies, pas de valeurs reconstituées à partir de pixels.','Eurostat'),
      make('master-consommation','C : la consommation des ménages',P1,list(
        '<b>Biens durables :</b> voiture, mobilier, électroménager.','<b>Biens non durables :</b> alimentation, vêtements.','<b>Services :</b> transport, santé, logement.','Un logement neuf relève de l’investissement ; son service de logement relève de la consommation.'
      ),'23','Convention de la série française du cours : C inclut les ménages et les ISBLSM. Le seuil de durabilité américain de trois ans n’est pas transformé en définition française universelle. Les services ne sont pas tous produits et consommés au même endroit : cette formulation du master est omise.'),
      make('master-investissement','I : produire aujourd’hui pour demain',P1,list(
        '<b>Capital fixe :</b> bâtiments, machines, logiciels, recherche-développement.','<b>Stocks :</b> biens produits mais pas encore vendus.','<b>Logements neufs :</b> investissement résidentiel.','Acheter une action ou un logement ancien transfère un actif existant. Cela ne crée pas le même montant de production.'
      ),'24,27','Convention française : I comprend la FBCF de tous les secteurs, les variations de stocks et les acquisitions nettes d’objets de valeur. Les frais de transaction et services d’intermédiation peuvent constituer une production. Ne pas confondre investissement au sens comptable et placement financier.'),
      make('master-administrations','G : des services publics, pas tous les transferts',P1,list(
        '<b>G :</b> consommation finale des administrations.','École, justice, défense : une production souvent évaluée par ses coûts.','Allocations et pensions : des transferts de revenu, pas une nouvelle production.','Dans notre convention, l’investissement public est déjà dans <b>I</b>.'
      ),'25','Le master suit la convention américaine G = consommation et investissement publics, I = investissement privé. Pour conserver les comptes français du chapitre, la convention retenue ici est G = consommation publique, I = investissement de tous les secteurs. Ne pas mélanger ces deux décompositions.'),
      make('master-composantes-france','De quoi se compose la dépense en France ?',P1,
        fig('p29_composantes_pib_france.png','Composantes du PIB français','France, parts du PIB depuis 1949. Consommation, investissement et échanges suivent des trajectoires différentes.'),
        '29','Figure Insee du master conservée comme document historique. Parts du PIB depuis 1949 ; dernier repère d’axe 2017, courbes jusqu’à environ 2018–2019. Le point terminal exact et les séries brutes ne sont pas fournis. Elle complète la photographie 2025 de trois-approches, sans la remplacer.','Insee')
    ]);
    insert('importations',[
      make('master-stocks-production','Produire sans vendre : le rôle des stocks',P1,stack(
        '<p class="p-txt">200 voitures produites ; 100 vendues à 700 €. Aucun intrant.</p>',
        table(['Dépense comptabilisée','Montant'],[['Consommation : 100 × 700 €','70 000 €'],['Entrée en stocks : 100 × 700 €','70 000 €'],['Production de la période','140 000 €']]),
        '<p class="p-sub">Les biens invendus sont une production. L’entreprise les ajoute à ses stocks.</p>'
      ),'31','Exemple fictif du master. Prix volontairement stylisé de 700 € ; ce n’est pas le prix observé d’une Twingo. Hypothèses : pas d’intrants, d’impôts, de marge commerciale ou de coûts de stockage.'),
      make('master-stocks-vente','Vendre un stock ne produit pas une seconde fois',P1,stack(
        '<p class="p-txt">Période suivante : aucune production. Les 100 voitures sont vendues à 600 €.</p>',
        table(['Dépense comptabilisée','Montant'],[['Consommation','+60 000 €'],['Sortie de stocks au prix courant','−60 000 €'],['Production de la période','0 €']]),
        '<p class="p-sub">La baisse de valeur de 10 000 € est une perte de détention. Elle ne réduit pas la production de la période.</p>'
      ),'32','La sortie de stocks est évaluée au prix courant, 100 × 600 €, et non au coût historique de 70 000 €. La différence de 10 000 € est une perte de détention, distincte de la variation de stocks comptabilisée dans le PIB.')
    ]);
    insert('loyers-imputes',[
      make('master-mesure','Le PIB est une estimation, révisée ensuite',P1,list(
        'Enquêtes, déclarations administratives, comptabilité des entreprises.','Des données manquent au premier calcul : il faut estimer.','De nouvelles informations conduisent à réviser les résultats.','Un changement de méthode peut modifier le niveau mesuré, sans nouvelle production.'
      ),'38–43','La phrase « le PIB ne capture pas les activités informelles et illégales » n’est pas reprise : certaines entrent conceptuellement dans la frontière de production, même si leur mesure est difficile. Annexes sur R&D, informel et lumières nocturnes. Une méthode stable ne garantit pas à elle seule l’absence de biais dans la croissance.'),
      make('master-rnb','PIB et revenu national : territoire ou résidence ?',P1,stack(
        formula('RNB = PIB + revenus primaires reçus de l’étranger<br>− revenus primaires versés à l’étranger'),
        list('<b>PIB :</b> production des unités résidentes.','<b>RNB :</b> revenus primaires des résidents.','La résidence économique compte ; le passeport ne suffit pas.')
      ),'44','Le revenu national brut (RNB) est le terme actuel correspondant à l’ancien PNB. Les revenus primaires comprennent notamment rémunérations du travail et revenus de la propriété ; les transferts personnels ne sont pas des revenus primaires. Résidence = centre d’intérêt économique, pas simple nationalité.'),
      make('master-rnb-quiz','Disneyland Paris : quel revenu national ?',P1,stack(
        '<p class="p-txt">L’activité se déroule en France. Le bénéficiaire réside…</p>',
        table(['Revenu lié à cette activité','Entre dans le RNB français ?'],[['Salaire d’un salarié résidant en France','<span data-step="1">Oui, quelle que soit sa nationalité.</span>'],['Salaire d’un travailleur frontalier non résident','<span data-step="1">Non : revenu primaire versé à l’étranger.</span>'],['Dividende versé à un actionnaire non résident','<span data-step="1">Non : revenu primaire versé à l’étranger.</span>']]),
        answer('<p class="p-sub">L’activité contribue au PIB français. Envoyer ensuite de l’argent à sa famille ne produit rien de plus.</p>')
      ),'45–46','Fusion des deux vues question/réponse du master. Les transferts personnels envoyés à l’étranger ne constituent pas une production supplémentaire et ne modifient pas le RNB ; ils interviennent dans le passage au revenu disponible. Les profits distribués aux non-résidents sont exclus du RNB par déduction des revenus primaires versés. Le tableau est volontairement simplifié, sans bénéfices réinvestis ni autres revenus transfrontaliers.')
    ]);
    insert('ipc-deflateur',[
      make('master-inflation-mesures','Inflation totale et inflation sous-jacente',P2,stack(
        list('<b>Inflation totale :</b> ensemble du panier de consommation.','<b>Sous-jacente :</b> atténuer les composantes les plus volatiles.','Aux États-Unis, le « core CPI » exclut alimentation et énergie.'),
        '<p class="p-sub">Le périmètre dépend de l’indice et du pays. Le core CPI américain n’est pas l’IPC sous-jacent français.</p>'
      ),'56','Le master généralise « core = sans alimentation et énergie ». Limiter explicitement cette définition au core CPI des États-Unis. Le PPI (prix à la production) reste cité en notes comme indicateur distinct. Le chapitre monétaire reviendra sur les indices utilisés par les banques centrales ; aucune règle de ciblage non vérifiée n’est ajoutée.'),
      make('master-cpi-core','Inflation totale et hors alimentation-énergie',P2,
        '<div class="p-col master-cpi"><p class="p-sub">États-Unis, janvier 2005–décembre 2025 · indices non désaisonnalisés</p><div id="master-cpi-chart" class="chart" style="width:100%;height:500px"></div><p class="master-cpi-note">Octobre 2025 : données manquantes, courbes interrompues.</p></div>',
        '57','Reconstruction à partir des séries officielles BLS CUUR0000SA0 et CUUR0000SA0L1E, collectées ensemble le 23 octobre 2026 : 100 × (indice du mois / indice du même mois un an plus tôt − 1). 251 glissements par série. Octobre 2025, absent chez BLS, reste vide ; aucune interpolation. La transformation de l’image FRED du master étant inconnue, cette nouvelle figure ne prétend pas la reproduire à l’identique. L’image originale reste archivée. Données, calculs et script : assets/master_2025/bls_cpi_provenance.json et reproduire_cpi_bls.py.','<a href="https://data.bls.gov/timeseries/CUUR0000SA0" target="_blank" rel="noopener noreferrer">BLS, CPI-U ensemble</a> et <a href="https://data.bls.gov/timeseries/CUUR0000SA0L1E" target="_blank" rel="noopener noreferrer">hors alimentation et énergie</a>'),
      make('master-ipc-formule','Construire un indice de prix',P2,stack(
        formula('IPC<sub>t</sub> = 100 × Σ<sub>i</sub> w<sub>i,0</sub> × (p<sub>i,t</sub> / p<sub>i,0</sub>)'),
        list('<b>Panier :</b> quantités fixées pour la comparaison.','<b>Poids :</b> part de chaque bien dans la dépense de départ.','<b>Prix :</b> comparer le même produit, à qualité constante.'),
        '<p class="p-sub">Les poids totalisent 1. Ici, un exemple à panier fixe ; les indices officiels renouvellent leurs pondérations.</p>'
      ),'58','Formule pédagogique de Laspeyres : w_i0=p_i0 q_i0 / Σp_j0 q_j0. Dans le vrai IPC, calculs élémentaires, renouvellements, chaînage, qualité et champs statistiques ajoutent des conventions. La définition « consommateur urbain moyen » du master correspond au CPI-U américain, pas à tous les IPC.'),
      make('master-ipc-panier','Même panier, nouveaux prix',P2,stack(
        '<p class="p-sub">Panier fixe : 4 pommes et 16 oranges. Données fictives.</p>',
        table(['Année','Prix pomme','Prix orange','Coût du panier','IPC'],[['2015','1 €','0,20 €','7,20 €','100'],['2016','0,50 €','0,50 €','10 €','138,89'],['2017','0,60 €','0,40 €','8,80 €','122,22']]),
        formula('Inflation 2017 = 8,80 / 10 − 1 = −12 %')
      ),'53,59','Correction importante du master p59 : la formule utilisait les rapports des quantités, alors que l’IPC doit utiliser les rapports de prix. Valeurs recalculées : poids pomme 5/9, orange 4/9 ; IPC2016 1250/9=138,8889 ; IPC2017 1100/9=122,2222 ; variation −12 %. L’exemple nominal/réel correspondant est conservé en annexe ; la croissance réelle y est −10 %, elle diffère de cette inflation.'),
      make('master-ipc-limites','Mesurer les prix exige des choix',P2,list(
        '<b>Substitution :</b> les achats changent quand les prix changent.','<b>Nouveaux produits :</b> quand les faire entrer dans le panier ?','<b>Qualité :</b> un prix plus élevé peut acheter un meilleur produit.','<b>Points de vente :</b> magasins, promotions, achats en ligne.'
      ),'60–62','L’IPC sert notamment à comparer le pouvoir d’achat et à négocier les salaires, mais n’est pas une mesure complète du coût de la vie de chaque ménage. Ajustements hédoniques = méthodes possibles de correction de qualité, pas recette universelle. Les poids sont régulièrement actualisés.'),
      make('master-ipc-poids','Le panier de consommation évolue',P2,
        fig('p64_ponderations_ipc_1970_2021.png','Pondérations de l’IPC français de 1970 à 2021','Les poids suivent la structure des dépenses. Ils ne sont pas des taux d’inflation.'),
        '64','Tableau Insee historique 1970–2021 repris du master. Les valeurs lisibles sont archivées avec la figure. Somme des catégories visibles : 99,3 % en 1970 et 99,9 % en 2021 ; la première divergence ne s’explique pas par les seuls arrondis affichés. Cohérence de la transcription/source d’origine à confirmer, ne pas présenter cet extrait comme un panier exhaustif prêt à recalculer l’IPC. Ne pas le présenter comme le panier de 2026.','Insee, pondérations de l’IPC, 1970–2021'),
      make('master-ipc-heterogeneite','Même pays, paniers différents',P2,
        fig('p65_jaravel_inflation.png','Inflation et revenu des ménages dans la figure de Jaravel (2019)','Inflation annuelle moyenne, 2004–2015, par quintile de revenu. Des paniers différents exposent à des prix différents.'),
        '63,65','Figure historique attribuée à Jaravel (2019) dans le master. Axe de la figure : « Tornqvist Annual Inflation Rate, Avg. 2004–2015, % ». Quintiles de revenu de 1 à 5. Le marché couvert n’est pas précisé dans l’image ; ne pas en tirer une mesure de l’inflation française actuelle. Les données brutes et le texte intégral de l’article n’ont pas été fournis avec ce PDF.','Jaravel (2019)'),
      make('master-prix-en-ligne','Mesurer les prix à partir des magasins en ligne',P2,list(
        '<b>Idée :</b> relever automatiquement de nombreux prix, chaque jour.','Comparer les évolutions en ligne aux indices officiels.','<b>Atout :</b> suivre rapidement les changements.','<b>Limite :</b> les achats en ligne ne représentent pas toute la consommation.'
      ),'66–67','Billion Prices Project, Alberto Cavallo et Roberto Rigobon ; le master indique une création en 2008. Figure historique Cavallo (2013) en annexe, sans prétendre qu’elle valide toutes les mesures actuelles. La collecte de prix ne résout pas seule le problème des poids ou de qualité.')
    ]);

    // Même moteur, axes et étiquettes que « Mais les émissions mondiales augmentent encore ».
    window.Deck.on('master-cpi-core', {enter(el, ctx) {
      const rows = window.MASTER_CPI_DATA.rows;
      const box = window.PJ.zoom('master-cpi-chart', 1.2);
      const animate = !(ctx.reading || ctx.print || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      const percent = value => window.Charts.fmt(value, 1) + ' %';
      const month = i => new Date(rows[Math.round(i)][0] + '-01T00:00:00Z').toLocaleDateString('fr-FR', {month:'long', year:'numeric', timeZone:'UTC'});
      const chart = window.Charts.line(box, {
        height:box.clientHeight, animate, duration:2, stagger:0.3, ends:true, legend:false, hover:true,
        aria:'Inflation américaine totale et hors alimentation et énergie, en glissement annuel de 2005 à 2025',
        x:{min:0, max:rows.length-1, ticks:[0,60,120,180,240], format:i=>rows[i][0].slice(0,4), hoverFormat:month},
        y:{min:-3, max:10, ticks:[-2,0,2,4,6,8,10]}, yTitle:'Variation sur douze mois (%)',
        series:[
          {name:'Inflation totale', endLabel:'Totale', color:'blue', dash:false, data:rows.map((r,i)=>[i,r[1]]), gaps:1.5, format:percent},
          {name:'Hors alimentation et énergie', endLabel:'Hors alimentation-énergie', color:'red', dash:'9 6', data:rows.map((r,i)=>[i,r[2]]), gaps:1.5, format:percent}
        ]
      });
      // Révéler aussi la courbe en tirets sans modifier son motif ni combler les mois absents.
      if (animate) chart.svg.querySelectorAll('.ch-line').forEach((path, i) => {
        path.classList.remove('ch-anim');
        const clip = window.Charts.el('clipPath', {id:`master-cpi-reveal-${i}`, clipPathUnits:'userSpaceOnUse'}, chart.svg.querySelector('defs'));
        window.Charts.el('rect', {x:0, y:0, width:chart.svg.getAttribute('width'), height:chart.svg.getAttribute('height'), class:'master-cpi-reveal', style:`animation-delay:${i * 0.3}s`}, clip);
        path.setAttribute('clip-path', `url(#master-cpi-reveal-${i})`);
      });
    }});

    const annexes=[
      {id:'master-annexes',title:'Annexes',part:ANN,layout:'section',html:'<h1 class="rev-divider-title">Approfondir la mesure</h1>',source:provenance('70'),appendix:true},
      make('master-pain-frontiere','Une chaîne de production à cheval sur deux pays',ANN,stack(
        '<p class="p-txt">Blé français : 1 € → farine italienne : 2 € → pain français : 10 €.</p>',
        table(['Pays','Valeur ajoutée'],[['France','1 + (10 − 2) = 9 €'],['Italie','2 − 1 = 1 €'],['Ensemble','10 €']]),
        '<p class="p-sub">Les exportations peuvent être des biens intermédiaires. Les importations évitent de compter la production étrangère.</p>'
      ),'8–9,13,20–22','Variante ouverte de la chaîne du pain déjà présente dans pain/pain-va. L’exemple fermé 1–2–10 et sa ventilation particulière en salaires et locations ne sont pas dupliqués. Hypothèses sans taxes, stocks ni autres intrants. Le mot « heat » du master p8 est interprété comme une coquille pour wheat (blé), conformément au reste de son exemple.'),
      make('master-auto-chaine','Une voiture : additionner les valeurs ajoutées',ANN,stack(
        table(['Étape','Vente','Intrants','Valeur ajoutée'],[['Acier','2 000 €','0 €','2 000 €'],['Autres pièces','5 000 €','0 €','5 000 €'],['Constructeur','15 000 €','7 000 €','8 000 €'],['Concessionnaire','18 000 €','15 000 €','3 000 €']]),
        formula('PIB = 2 000 + 5 000 + 8 000 + 3 000 = 18 000 €')
      ),'34','Exemple fictif du master, sans intrants des fournisseurs, impôts, subventions ni stocks. Variante de pain-va placée en annexe pour éviter un doublon dans le corps.'),
      make('master-va-profit','Valeur ajoutée positive, profit négatif ?',ANN,stack(
        '<p class="p-txt">Ventes : 1 200 €. Intrants : 500 €. Salaires : 1 000 €.</p>',
        '<p class="p-sub">Quelle est la valeur ajoutée ? A. −300 € &nbsp; B. 700 € &nbsp; C. 1 200 €</p>',
        answer(stack(formula('Valeur ajoutée = 1 200 − 500 = 700 €'),'<p class="p-sub">Après salaires, il reste −300 €. Une VA positive ne garantit pas un profit positif.</p>'))
      ),'34–35','QCM adapté du master. Avec ces seules charges, l’excédent brut est −300 ; le profit net demanderait d’autres éléments (amortissements, intérêts, impôts…). Une VA peut être négative si la production vaut moins que les consommations intermédiaires. Salaire d’un résident travaillant dans une unité américaine : pas une production française ; voir RNB/résidence dans le corps.'),
      make('master-prix-volumes','Les mêmes données : séparer prix et quantités',ANN,stack(
        table(['Année','Prix pomme','Quantité','Prix orange','Quantité'],[['2015','1 €','4','0,20 €','16'],['2016','0,50 €','10','0,50 €','10'],['2017','0,60 €','8','0,40 €','14']]),
        table(['PIB aux prix de 2015','2016','2017'],[['Calcul','1 × 10 + 0,2 × 10','1 × 8 + 0,2 × 14'],['Résultat','12 €','10,80 €']]),
        '<p class="p-sub">Croissance réelle : 10,8 / 12 − 1 = −10 %. Le panier de l’IPC fixe les quantités ; le PIB réel fixe les prix.</p>'
      ),'53–54,59','Données fictives et calculs du master. PIB nominal 2015=7,2 ; 2016=10 ; 2017=10,4. PIB réel aux prix de 2015=7,2 ;12 ;10,8. Déflateurs du PIB base100=100 ;83,3333 ;96,2963. L’IPC correspondant n’est pas le déflateur du PIB. Le cours principal conserve son exemple cafés/coiffure, évitant deux exercices presque identiques consécutifs.'),
      make('master-rd-revision','La frontière de l’investissement peut changer',ANN,
        fig('p39_revision_rd_2013.png','Article historique sur la révision des comptes américains en juillet 2013','2013 : la R&D est traitée comme investissement. Une révision comptable change le niveau mesuré.'),
        '39','Coupure historique du 28 juillet 2013. Les environ 3 % annoncés se rapportent à l’ensemble de la révision américaine, pas à la seule R&D. Les actifs artistiques et d’autres changements interviennent également. Ne pas décrire cet effet de niveau comme une croissance produite le jour de la révision.'),
      make('master-informel','Activité informelle : difficile à mesurer, pas toujours exclue',ANN,stack(
        fig('p40_economie_informelle.png','Document historique sur l’économie informelle','Informel ne signifie pas automatiquement « hors PIB ». Le problème est aussi l’observation.'),
        '<p class="p-sub">Les transactions illégales consenties peuvent entrer dans les comptes. Le vol n’est pas une production.</p>'
      ),'38,40','Corrige le titre général « excluded illegal activities » du master. Le graphique concerne l’économie informelle au sens de sa source, pas uniquement les activités illégales. Le fait de dépenser un revenu illégal dans le secteur formel ne permet pas de conclure que la production initiale a déjà été comptée. Données brutes non fournies.'),
      make('master-nightlights','Comparer le PIB à une mesure indépendante',ANN,
        fig('p42_nightlights_martinez.png','Figure sur les lumières nocturnes et le PIB, attribuée à Martinez (2022)','Les lumières nocturnes offrent un contrôle externe. Elles ne mesurent pas directement tout le PIB.'),
        '42','Le master attribue la figure à Luis R. Martinez (2022), « How Much Should We Trust the Dictator’s GDP Growth Estimates? ». L’affirmation spécifique à la Chine « surévaluation d’un tiers sur vingt ans » n’est pas reprise comme fait vérifié. Le PDF fourni contient le graphique, pas le texte intégral de l’étude ; toute interprétation quantitative exige ce dernier.','Martinez (2022)'),
      make('master-hyperinflation','Quand la monnaie perd son unité de mesure',ANN,
        fig('p49_billet_zimbabwe.png','Billet de cent mille milliards de dollars zimbabwéens','Zimbabwe : un billet à très grande valeur faciale. Davantage de zéros ne signifie pas davantage de biens.'),
        '49–50','Illustration historique. Les valeurs « 80 milliards % par mois » et « 9 × 10^22 % de croissance nominale » du master ne sont pas reprises faute de documentation primaire jointe pour leurs périodes et méthodes. La distinction nominal/réel est conservée.'),
      make('master-bpp-comparaison','Prix en ligne et indices officiels',ANN,
        fig('p67_billion_prices.png','Comparaison historique des indices de prix en ligne et officiels, Cavallo (2013)','Colombie et Venezuela, 2007–2011 : prix en ligne et indices officiels peuvent suivre des trajectoires différentes.'),
        '67','Figure attribuée à Cavallo (2013), « Online and official price indexes », reprise du master. Pas de données sous-jacentes fournies ni de lecture du papier intégral à ce stade. Éviter toute extrapolation aux systèmes statistiques actuels.','Cavallo (2013)')
    ];
    notes('master-annexes','70','Annexes autorisées par Arnaud dans cette nouvelle phase. Les 119 écrans préexistants restent dans le corps, sans suppression supplémentaire.');
    window.SLIDES.push(...annexes);
    window.harmoniserPlanChapitre();
    // Préciser la convention française et les prix utilisés, sans changer les interactions existantes.
    edit('trois-approches',s=>s.source+=' Dans cette convention, G exclut l’investissement public, inclus dans I.');
    edit('formule-reel',s=>s.source=(s.source||'')+' Pour le PIB, π désigne la variation du déflateur du PIB, pas nécessairement celle de l’IPC.');
    window.NOTES['formule-reel']=(window.NOTES['formule-reel']||'')+'<p>23 octobre 2026 : précision apportée après lecture du master p54. Seul le déflateur du PIB permet ce passage du PIB nominal au PIB réel.</p>';
    window.MASTER_INTEGRATION={date:'2026-10-23',mainAdded:added.map(x=>x.id),appendixIds:annexes.map(x=>x.id),mainCount:window.SLIDES.filter(x=>!x.appendix).length,totalCount:window.SLIDES.length};
    if(window.MASTER_INTEGRATION.mainCount>150)throw new Error('Le corps du chapitre dépasse 150 diapositives.');
  };
})();
