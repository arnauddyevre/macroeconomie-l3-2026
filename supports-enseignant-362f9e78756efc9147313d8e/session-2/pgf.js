/* Section 3 : « Qu’y a-t-il dans la PGF ? ». Révision du 15 novembre 2026, à la demande d’Arnaud :
   titres en forme d’affirmation, deux ou trois lignes par écran, graphiques natifs à la place
   des images, écran sur la mauvaise allocation d’après Chad Jones.
   Données : data/pgf.js, préparé par scripts/preparer_pgf.py. Provenance : sources/pgf_2026-11-15/. */
(function(){
  'use strict';
  const G=window.G2,P=window.CH02_PGF,CD=window.CH02_COMPTA_DATA,C=window.Charts;
  if(!G||!P||!CD)throw new Error('Composants ou données de la section PGF absents');
  const part=G.titles[2],navy='#001F5F',orange='#B45309',slate='#526780',grey='#8A9BA8';
  const fmt=(x,d=1)=>C.fmt(x,d);
  const m=html=>`<span class="g-math">${html}</span>`;
  const link=(url,label)=>`<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
  const points=items=>G.list(items);
  const visual=(id,height,title,after='')=>`<div class="pgf-visual"><p class="pgf-chart-title">${title}</p>${G.chart(id,height)}${after}</div>`;
  const split=(text,right,cls='')=>`<div class="pgf-split ${cls}"><div class="pgf-text">${text}</div>${right}</div>`;
  const add=(n,obj,detail='')=>G.add({part,cls:'pgf-slide',source:'',planPosition:n,...obj,
    notes:`<p>Section 3, révision du 15 novembre 2026 : texte réduit, titre en affirmation et graphique natif, à la demande d’Arnaud. Version du 9 novembre, texte du PowerPoint de 2025 et vérifications : sources/pgf_2026-11-09/ (extraction_pptx.json, verification_sources.md). Données et provenance de cette révision : sources/pgf_2026-11-15/.</p>${detail}`});
  // Sept sujets à retenir comme une liste simple, dans l'ordre des écrans : le titre de leur premier écran porte leur numéro.
  const sujets=['idées','éducation','recherche et développement','automatisation','qualité des institutions','management','allocation des facteurs'];
  const sujet=i=>`Ce qu’il y a dans la PGF (${i}) : ${sujets[i-1]}`;
  const sources={
    pwt:link('https://www.rug.nl/ggdc/productivity/pwt/','Penn World Table 11.0'),
    owid:(slug,label)=>link('https://ourworldindata.org/grapher/'+slug,label)
  };

  /* ------------------------------------------------------------------ écrans */

  add(57,{id:'s3',sourceSlide2025:73,layout:'section',title:part,html:G.plan(2)},'<p>La séparation reprend le plan commun, sur fond marine, avec la troisième section active. La section répond à la fin de la comptabilité : la PGF pèse 50 à 61 % des écarts dans les quatre groupes de pays. Fil conducteur possible à l’oral : inventer, adopter, allouer, puis mesurer.</p>');

  const residu=CD.countries.map(c=>({name:c.name,sans:c.aRatio*c.hFactor,avec:c.aRatio}));
  add(58,{id:'s3-solow-exogene',sourceSlide2025:74,title:'Manna from heaven ?',prov:'obs',html:split(points([
    `Chez Solow, ${m('A')} tombe du ciel : le modèle décrit ses effets, pas son origine.`,
    `Or ${m('A')} pèse <strong>50 à 61 %</strong> des écarts de production par travailleur.`,
    ['Abramovitz (1956) : la PGF est une <strong>« mesure de notre ignorance »</strong>. Elle dépend de ce que l’on sait mesurer.',1]
  ]),visual('pgf-residu-chart',500,'PGF résiduelle en 2023, États-Unis = 100',
    `<div class="pgf-legend"><span><i style="background:${grey}"></i>Sans compter le capital humain</span><span data-step="1"><i style="background:${navy}"></i>En comptant le capital humain</span></div>`)),
  source:`${link('https://doi.org/10.2307/1884513','Solow (1956)')} ; Abramovitz (1956), Resource and Output Trends in the United States since 1870. Calculs : ${sources.pwt}, 2023, α = 1/3.`},
  '<p>Le portrait de Solow, déjà projeté en section 1, laisse la place au résidu calculé avec les données de la section 2. Barres grises : y/k^(1/3), c’est-à-dire le résidu lorsque le capital humain n’est pas compté. Barres marine, au clic : y/(k^(1/3) h^(2/3)), la PGF de la section 2. Chine : 35 % puis 44 % du niveau américain. En Corée du Sud, h est proche du niveau américain et le résidu ne change presque pas. Le graphique porte le message du second écran « Éducation » de la version précédente : ce qui est mesuré comme facteur ne doit pas être compté une seconde fois dans la PGF.</p><p>Rappel utile à l’oral, retiré de l’écran : exogène ne signifie pas constant. Dans notre modèle, A progresse au taux γ et la croissance équilibrée par tête vaut γ/(1−α). « 50 à 61 % » renvoie aux quatre groupes de pays de la section 2, pas à chaque pays. La formule d’Abramovitz est rapportée d’après Jones (2016), The Facts of Economic Growth, section 2 ; l’article de 1956 n’a pas été relu.</p>');

  add(59,{id:'s3-croissance-endogene',sourceSlide2025:75,title:sujet(1),html:split(`
    <p class="pgf-lead">La <strong>croissance par les idées</strong>, ou croissance endogène : la PGF augmente quand des chercheurs trouvent de nouvelles idées.</p>
    <p class="pgf-list-title">Une idée est :</p>
    ${points([
      '<strong>non rivale</strong> : elle sert à tous en même temps ;',
      '<strong>coûteuse à trouver</strong>, presque gratuite à reproduire ;',
      '<strong>cumulative</strong> : elle s’appuie sur les précédentes ;',
      '<strong>partiellement exclusive</strong> : un brevet ou le secret en réserve l’usage.'
    ])}`,
  `<div class="pgf-visual pgf-usines">
    <div class="pgf-card"><h3>Recopier l’usine</h3><p>${m('K')} et ${m('L × 2 &nbsp;⇒&nbsp; Y × 2')}</p><small>L’idée n’a pas besoin d’être recopiée : la seconde usine l’utilise aussi.</small></div>
    <div class="pgf-card pgf-card-accent" data-step="1"><h3>Recopier l’usine et doubler ${m('A')}</h3><p>${m('A')}, ${m('K')} et ${m('L × 2 &nbsp;⇒&nbsp; Y × 4')}</p><small>Les rendements d’échelle deviennent croissants.</small></div>
    <div class="pgf-idees" data-step="2">
      <div class="pgf-model">
        <div><span>Idées</span>${m(`${G.f(G.dot('A'),'A')} = z L<sub>chercheurs</sub>`)}</div>
        <div><span>Ressources</span>${m('L<sub>chercheurs</sub> + L<sub>production</sub> = L')}</div>
      </div>
      <p class="pgf-model-note">${m('z')} : efficacité de la recherche. Chez Solow, ce taux était donné, ${m('γ')}. Ici, il dépend du nombre de chercheurs.</p>
    </div>
  </div>`,'pgf-idees-slide'),
  source:`${link('https://doi.org/10.1086/261725','Romer (1990)')}, prix Nobel 2018 ; ${link('https://doi.org/10.2307/2951599','Aghion et Howitt (1992)')}, prix Nobel 2025.`},
  '<p>Écran retitré et complété le 15 novembre 2026 à la demande d’Arnaud : titre numéroté, mention de la croissance par les idées, propriétés des idées, production d’idées et contrainte de ressources. Les deux encadrés reprennent les écrans idees-def et idees-usine d’Antonin, que la sélection du 3 novembre avait retenus. Doubler K et L double Y pour tout α, puisque les rendements d’échelle des facteurs rivaux sont constants.</p><p>Propriétés. « Non rivale » et « partiellement exclusive » reprennent le résumé de Romer (1990), qui décrit la technologie comme « a nonrival, partially excludable good ». Le coût fixe de l’invention et le caractère cumulatif appartiennent au même modèle : la recherche utilise le stock d’idées existant. L’exclusion partielle, par le brevet ou le secret, fonde l’incitation à inventer ; la non-rivalité empêche une concurrence parfaite de rémunérer l’invention.</p><p>Équations. Forme simplifiée de Romer (1990), sans indices temporels : le taux de croissance de A est proportionnel au nombre de chercheurs, et les travailleurs se partagent entre recherche et production. Elle correspond à la ligne « Romer/AH : Ȧ = RA » du catalogue de Chad Jones, archivé dans sources/chad_jones_conclusion_2026-11-15/. Le paramètre z et les indices écrits en toutes lettres sont des choix de notation de cette adaptation. Chez Solow, Ȧ/A = γ est donné ; ici γ = z L_chercheurs. L’arbitrage à dire à l’oral : un chercheur de plus accélère la croissance de A, mais ne produit pas de biens aujourd’hui.</p><p>Limites à signaler. Cette forme implique que doubler le nombre de chercheurs double le taux de croissance : Jones (1995) juge cette prédiction contraire aux données et propose une version semi-endogène, Ȧ = z L_chercheurs A^φ avec φ < 1. Doubler A ne signifie pas doubler un nombre d’idées. Les modèles de Romer (variété de biens intermédiaires) et d’Aghion–Howitt (amélioration de la qualité et destruction créatrice) ont des mécanismes distincts. Romer partage le prix 2018 avec Nordhaus ; Aghion et Howitt partagent celui de 2025 avec Mokyr.</p>');

  const ecole=P.scolarite.stats;
  add(60,{id:'s3-education',sourceSlide2025:76,title:sujet(2),prov:'obs',html:split(points([
    `Les compétences mesurées sont dans ${m('h')}, pas dans ${m('A')}.`,
    `Ce qui reste dans ${m('A')} : la capacité à <strong>adopter</strong> les nouvelles technologies.`,
    [`En France : <strong>${fmt(ecole.france1900,1)} années</strong> d’études en moyenne en 1900, <strong>${fmt(ecole.france2010,1)}</strong> en 2010.`,1]
  ]),visual('pgf-scolarite-chart',540,'Années d’études moyennes, population de 15 à 64 ans')),
  source:`Lee et Lee (2016), Human Capital in the Long Run, via ${sources.owid('mean-years-of-schooling-long-run','Our World in Data')}. Estimations tous les cinq ans, 1870–2010.`},
  '<p>Cet écran réunit les deux écrans « Éducation » de la version précédente (sources 2025 : 76 et 77). La figure historique de 1900, 1950 et 2010 en dix-sept pays laisse la place à cinq trajectoires natives : États-Unis, France, Corée du Sud, Chine et Inde, sélection annoncée comme telle. La source change : Lee et Lee (2016) à la place de van Leeuwen et van Leeuwen-Li (2014), et la population de 15 à 64 ans à la place des plus de 15 ans. Les valeurs postérieures à 2010 du fichier sont des projections ; elles ne sont pas tracées.</p><p>Avec Y = AK^α(hL)^(1−α), h porte les compétences mesurées et A devient le résidu après prise en compte de h. L’idée que l’éducation facilite l’adoption des technologies est une hypothèse de mécanisme (Nelson et Phelps, 1966), pas un résultat établi par ce graphique. Les années d’études ne mesurent pas la qualité des apprentissages. Ne pas présenter l’éducation comme « le facteur le plus important ».</p>');

  const rd=P.rd.stats;
  add(62,{id:'s3-recherche',sourceSlide2025:78,title:sujet(3),prov:'obs',html:split(points([
    'Les dépenses de recherche et développement sont un <strong>intrant</strong> : elles paient des chercheurs, des équipements, des expériences.',
    'Ce qui est dans la PGF, ce n’est pas la dépense : c’est le <strong>capital d’idées</strong> qu’elle crée.',
    [`Objectif de l’Union européenne : <strong>3 % du PIB</strong>. Elle en est à ${fmt(rd.unionEuropeenne,1)} % en ${P.rd.lastYear}.`,1]
  ]),visual('pgf-rd-chart',540,'Dépenses de recherche et développement, en % du PIB')),
  source:`${link('https://data.worldbank.org/indicator/GB.XPD.RSDV.GD.ZS','Banque mondiale')}, source Institut de statistique de l’UNESCO, 1996–${P.rd.lastYear}.`},
  `<p>La photographie de laboratoire laisse la place aux séries de la Banque mondiale, mises à jour le ${P.rd.updated}. Le titre reprend les valeurs de ${P.rd.lastYear} de la série tracée : France ${fmt(rd.france,2)} %, Corée du Sud ${fmt(rd.coree,2)} %, Allemagne ${fmt(rd.allemagne,2)} %, Union européenne ${fmt(rd.unionEuropeenne,2)} %. La valeur française coïncide avec le résultat détaillé du SIES pour 2023 (61,5 Md€, 2,18 %). Le ministère coréen de la Science annonce 5,13 % pour 2024 : année et source différentes, non tracées.</p><p>Le seuil de 3 % est un objectif pour l’Union dans son ensemble, pas une obligation uniforme pour chaque État. Une dépense est un intrant : elle ne garantit pas un résultat d’innovation proportionnel. Retirés de l’écran et disponibles à l’oral : crédits d’impôt, subventions et financements directs ; France Relance et NextGenerationEU.</p><p>Précision demandée par Arnaud le 15 novembre 2026 : la PGF ne contient pas les dépenses de R&D, mais le capital d’idées qu’elles créent. Lien avec l’écran (1) : les dépenses paient les chercheurs, qui font croître A. Nuance comptable, à garder pour une question : dans les comptes nationaux, la R&D est enregistrée en investissement. Insee, définition c1371 : la formation brute de capital fixe comprend « la R&D, y compris la production de R&D accessible gratuitement ». Une partie du capital de connaissances peut donc figurer dans le capital mesuré ; ce qui reste dans la PGF est ce que ce capital mesuré ne capte pas, notamment les idées utilisées par d’autres que ceux qui les ont financées.</p>`);

  const robots=P.robots.stats;
  add(63,{id:'s3-automatisation',sourceSlide2025:79,title:sujet(4),prov:'obs',html:split(points([
    '<strong>Automatiser</strong> : confier à une machine une tâche réalisée par une personne.',
    `Même production avec moins de travail : la productivité du travail, ${m('Y/L')}, augmente.`,
    ['Le travail humain va-t-il <strong>disparaître</strong> ?',1]
  ]),visual('pgf-robots-chart',510,'Robots industriels installés par an, en milliers',
    `<p class="pgf-caption">Monde : ${fmt(1000*robots.monde2012,0)} installations en 2012, ${fmt(1000*robots.monde2024,0)} en 2024, soit ${fmt(robots.multiple,1)} fois plus.</p>`)),
  source:`Fédération internationale de robotique, via AI Index Report (2026) et ${sources.owid('annual-industrial-robots-installed','Our World in Data')}. Valeurs arrondies au millier.`},
  `<p>L’illustration sans auteur du support de 2025 laisse la place au nombre de robots industriels installés chaque année : ${fmt(robots.monde2012,0)} milliers dans le monde en 2012, ${fmt(robots.monde2024,0)} milliers en 2024, dont ${fmt(100*robots.partChine2024,0)} % en Chine. Il s’agit d’un flux d’installations, pas du parc en service. Un robot industriel est, pour la source, une machine reprogrammable à trois axes ou plus : la définition exclut les logiciels et l’IA.</p><p>« Même production avec moins de travail » implique une hausse de Y/L à production donnée. Ce raisonnement n’établit ni une hausse de A, ni une baisse de l’emploi total : l’automatisation peut demander davantage de capital, tandis que production et demande se modifient. Question retirée de l’écran, utile à l’oral : que devient la complémentarité entre K et L dans la fonction de Cobb–Douglas ? Lecture citée en 2025 : Aghion, Antonin et Bunel (2019), Intelligence artificielle, croissance et emploi : le rôle des politiques.</p>`);

  const emploi=P.emploi.stats;
  add(64,{id:'s3-automatisation-travail',sourceSlide2025:80,title:'Les tâches changent, l’emploi se déplace',prov:'obs',html:split(points([
    'Un métier réunit plusieurs <strong>tâches</strong> : certaines sont remplacées, d’autres complétées.',
    ['Produire moins cher permet de vendre plus : cet <strong>effet d’expansion</strong> peut soutenir l’emploi.',1],
    ['Les gains ne profitent pas à tous : salariés remplacés, entreprises concurrentes.',2]
  ]),visual('pgf-emploi-chart',510,'France : répartition de l’emploi par secteur, en %',
    `<p class="pgf-caption">Emploi total : ${fmt(emploi.totalDebut/1e6,0)} millions en ${emploi.debut}, ${fmt(emploi.totalFin/1e6,0)} millions en ${emploi.fin}.</p>`)),
  source:`Herrendorf, Rogerson et Valentinyi, via ${sources.owid('employment-by-economic-sector','Our World in Data')}. France, ${emploi.debut}–${emploi.fin} ; observations espacées avant 1970.`},
  `<p>L’illustration du support de 2025 laisse la place à la répartition de l’emploi français par secteur : l’agriculture passe de ${fmt(emploi.agricultureDebut,0)} % de l’emploi en ${emploi.debut} à ${fmt(emploi.agricultureFin,0)} % en ${emploi.fin}, les services atteignent ${fmt(emploi.servicesFin,0)} %, et l’emploi total passe de ${fmt(emploi.totalDebut/1e6,1)} à ${fmt(emploi.totalFin/1e6,1)} millions. Les points sont reliés sans interpolation ; ils sont espacés de cinq à vingt ans avant 1970. Entre 1968 et 1970, au passage aux séries annuelles, l’industrie perd 4,5 points et les services en gagnent 6,6 : cette marche tient probablement à un changement de source ou de nomenclature, pas à l’économie.</p><p>Ce graphique illustre un déplacement de l’emploi sur un siècle et demi. Il ne prouve pas que l’automatisation crée toujours autant d’emplois qu’elle en remplace : la mécanisation agricole, la demande et le commerce ont joué ensemble, et les travailleurs déplacés ne sont pas ceux qui occupent les nouveaux emplois. Une entreprise qui automatise peut gagner des parts de marché et embaucher sans que l’emploi augmente dans son secteur. Retiré de l’écran : dans Cobb–Douglas, le produit marginal du capital diminue quand le capital augmente à travail et PGF donnés ; c’est une propriété du modèle, pas une preuve empirique. L’effet positif attribué en 2025 à Aghion, Antonin, Bunel et Jaravel (2022) n’a pas été vérifié dans l’article.</p>`);

  const corees=P.corees.stats;
  add(65,{id:'s3-institutions',sourceSlide2025:81,title:sujet(5),prov:'obs',html:split(points([
    'Les <strong>institutions</strong> : les règles qui organisent la vie économique et politique.',
    'Droits de propriété, contrats, concurrence : elles orientent les <strong>incitations</strong> à investir et à innover.',
    [`En 1940, le Nord est plus riche que le Sud. En 2022, le Sud est <strong>${fmt(corees.rapport2022,0)} fois</strong> plus riche.`,1]
  ]),visual('pgf-corees-chart',540,'PIB par habitant, en dollars de 2011')),
  source:`${link('https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023','Maddison Project Database 2023')}, dollars internationaux de 2011 (PPA). Acemoglu, Johnson et Robinson : prix Nobel 2024.`},
  `<p>La photographie de l’Assemblée nationale laisse la place aux deux Corées, déjà vues de nuit dans l’introduction. Maddison donne ${fmt(corees.nord1940,0)} dollars par habitant au Nord et ${fmt(corees.sud1940,0)} au Sud en 1940, puis ${fmt(corees.nord2022,0)} et ${fmt(corees.sud2022,0)} en 2022. Limite à signaler : la base ne contient aucune valeur pour le Nord de 1944 à 1989, ni pour le Sud en 1944 et 1945 ; les courbes s’interrompent. Les valeurs nord-coréennes récentes sont des estimations fragiles. Les séries d’avant 1945 portent sur les territoires actuels des deux États.</p><p>La comparaison rapproche d’une expérience naturelle : même péninsule, même histoire jusqu’à la partition de 1945, puis des règles opposées. Elle ne suffit pas à isoler l’effet des institutions : aide extérieure, guerre et sanctions diffèrent aussi. Les institutions comprennent des règles formelles et des normes informelles. Le prix 2024 récompense un programme de recherche ; il n’est pas une preuve statistique supplémentaire. Pour aller plus loin : Acemoglu et Robinson (2012), Why Nations Fail, sans Johnson.</p>`);

  const inst=P.institutions;
  const instText=`<p class="pgf-scope"><strong>${inst.points.length} pays</strong> en ${inst.year}. Chaque point est un pays.</p>`;
  const caution='<div class="g-panel orange pgf-caution"><h3>Une corrélation n’est pas une causalité</h3><p>Un pays riche peut aussi financer de meilleures institutions.</p></div>';
  add(66,{id:'s3-institutions-correlations',sourceSlide2025:82,title:'De meilleures institutions vont avec un revenu plus élevé',prov:'obs',html:`
    <div class="g-live-only">${split(`${instText}${G.buttons('pgf-inst-choix',[['rl','État de droit'],['cc','Contrôle de la corruption']])}<div data-step="2">${caution}</div>`,
      visual('pgf-inst-chart',560,'<span id="pgf-inst-titre">État de droit</span> et PIB par habitant'),'pgf-inst')}<span data-step="1"></span></div>
    <div class="g-static-only pgf-inst-static">${instText}<div class="pgf-inst-pair"><div><p class="pgf-chart-title">État de droit et PIB par habitant</p>${G.chart('pgf-inst-chart-rl',400)}</div><div><p class="pgf-chart-title">Contrôle de la corruption et PIB par habitant</p>${G.chart('pgf-inst-chart-cc',400)}</div></div>${caution}</div>`,
  source:`${link('https://www.worldbank.org/en/publication/worldwide-governance-indicators','Banque mondiale, Worldwide Governance Indicators')} et PIB par habitant en parité de pouvoir d’achat, ${inst.year}.`},
  `<p>Les deux nuages d’origine, dont celui de droite n’avait pas d’attribution confirmée, laissent la place à un nuage natif et actuel : ${inst.points.length} pays en ${inst.year}. Abscisse : indice de gouvernance de la Banque mondiale, de −2,5 à +2,5. Ordonnée : PIB par habitant en dollars internationaux de 2021, échelle logarithmique. Premier clic : passage de l’état de droit au contrôle de la corruption, les points se déplacent. Second clic : mise en garde. Corrélation avec le logarithme du revenu : ${fmt(inst.stats.correlationEtatDeDroit,2)} pour l’état de droit, ${fmt(inst.stats.correlationCorruption,2)} pour le contrôle de la corruption. Survol : nom et valeurs de chaque pays.</p><p>Ces indices agrègent des enquêtes de perception et comportent une marge d’erreur ; l’ordonnée est un revenu, pas une PGF. Ni la pente ni une association entre pays n’identifient un effet causal : causalité inverse et variables omises sont possibles. L’écran précédent, avec les deux Corées, montre comment s’approcher d’une comparaison causale. La version en lecture et à l’impression réunit les deux nuages. Figures de 2025 : Acemoglu, Johnson et Robinson (2005), figure 1, pour la protection contre l’expropriation.</p>`);

  const scores=P.management.countries;
  add(67,{id:'s3-management',sourceSlide2025:83,title:sujet(6),prov:'obs',html:split(points([
    'Des usines textiles indiennes, <strong>tirées au sort</strong>, reçoivent un conseil gratuit en management. Leur productivité augmente de <strong>17 %</strong> la première année.',
    ['Le management s’adopte comme une technologie, et toutes les entreprises ne l’adoptent pas.',1]
  ]),visual('pgf-management-chart',540,'Score moyen de management des entreprises industrielles, de 1 à 5')),
  source:`${link('https://doi.org/10.1093/qje/qjs044','Bloom, Eifert, Mahajan, McKenzie et Roberts (2013)')}. Scores : ${link('https://worldmanagementsurvey.org/','World Management Survey')}, ${P.management.period}, jeu de données de Békés et Kézdi (2021).`},
  `<p>La figure italienne d’Akcigit, Baslandze et Lotti (2022) quitte cet écran : elle décrit des liens politiques, pas un score de management. Le chiffre de 17 % est lu dans le résumé de Bloom et al. (2013), Does Management Matter? Evidence from India, Quarterly Journal of Economics : conseil gratuit fourni à des usines textiles tirées au sort, productivité accrue de 17 % la première année par la qualité, l’efficacité et la réduction des stocks. Les auteurs expliquent la non-adoption antérieure par un manque d’information.</p><p>Graphique : moyenne simple des scores de ${fmt(P.management.firms,0)} entreprises industrielles interrogées entre 2004 et 2015, dans la version publique à usage pédagogique du World Management Survey. Dix pays sur vingt-quatre sont affichés. Les moyennes ne sont pas pondérées par la taille des entreprises et les échantillons diffèrent selon les pays (${scores.map(c=>c.country+' : '+c.n).join(', ')}). Un écart de score moyen décrit des pratiques déclarées lors d’entretiens ; il ne mesure pas directement la PGF. Non vérifiés et non projetés : le chiffre de 30 % attribué à Bloom, Sadun et Van Reenen (2016) et le résultat de Pellegrino et Zingales sur la méritocratie en Italie.</p>`);

  add('67 bis',{id:'s3-allocation',title:sujet(7),prov:'fictif',html:split(`
    <div class="pgf-model">
      <div><span>Production</span>${m('X<sub>acier</sub> = L<sub>acier</sub> , &nbsp; X<sub>latte</sub> = L<sub>latte</sub>')}</div>
      <div><span>Ressources</span>${m('L<sub>acier</sub> + L<sub>latte</sub> = L')}</div>
      <div><span>PIB</span>${m('Y = X<sub>acier</sub><sup>1/2</sup> X<sub>latte</sub><sup>1/2</sup>')}</div>
      <div><span>Allocation</span><span class="pgf-model-text">${m('x = L<sub>acier</sub> / L')} : part du travail dans l’acier</span></div>
    </div>
    <div class="pgf-model-result" data-step="1">${m('Y = A(x) L')} &nbsp;avec&nbsp; ${m('A(x) = √<span class="pgf-root">x (1 − x)</span>')}</div>
    <span data-step="2"></span><p class="pgf-evidence" data-step="3">En Chine et en Inde, une allocation aussi efficace qu’aux États-Unis augmenterait la PGF industrielle de <strong>30 à 60 %</strong>.</p>`,
    visual('pgf-allocation-chart',480,'La PGF dépend de l’allocation du travail',
      `<div class="pgf-slider g-live-only" data-step="1"><label for="pgf-allocation-x">Déplacer ${m('x')}</label><input id="pgf-allocation-x" type="range" min="0" max="1" step="0.01" value="0.2"><output id="pgf-allocation-sortie" for="pgf-allocation-x"></output></div>`),'pgf-allocation'),
  source:`Exemple de ${link('https://web.stanford.edu/~chadj/facts.pdf','C. I. Jones (2016), The Facts of Economic Growth')}, section 4.7. Ordre de grandeur : ${link('https://doi.org/10.1162/qjec.2009.124.4.1403','Hsieh et Klenow (2009)')}.`},
  '<p>Écran ajouté le 15 novembre 2026 à la demande d’Arnaud, à partir de deux captures de Chad Jones : « Misallocation and TFP: A Simple Example » et « Misallocation Reduces TFP ». Les captures sont archivées dans sources/pgf_2026-11-15/chad_jones_misallocation/ ; leur support d’origine n’est pas identifié. Le même exemple figure, avec un exposant α général, dans Jones (2016), The Facts of Economic Growth, section 4.7, équation 7.</p><p>Déroulé : le modèle, puis au premier clic Y = √(xL × (1−x)L) = √(x(1−x)) L et la courbe ; au deuxième clic l’optimum x = 1/2, où A = 1/2 ; au troisième clic un exemple de mauvaise allocation, x = 0,9, où A = 0,3, soit 40 % de moins qu’à l’optimum, avec les mêmes travailleurs et les mêmes techniques. Autre valeur ronde : x = 0,8 donne A = 0,4, soit 20 % de moins. Le curseur permet de déplacer x. L’allocation x peut résulter des marchés, de distorsions (taxes, subventions, crédit dirigé) ou d’une planification. L’exemple ne contient pas de capital : A(x) joue le rôle de la PGF dans Y = A(x)L.</p><p>Ordre de grandeur : Hsieh et Klenow (2009), résumé : gains de PGF manufacturière de 30 à 50 % en Chine et de 40 à 60 % en Inde si le capital et le travail étaient réalloués pour égaliser les produits marginaux autant qu’aux États-Unis. C’est un calcul contrefactuel sur l’industrie manufacturière (Chine 1998–2005, Inde 1987–1994), pas une mesure de l’économie entière.</p>');

  const smithsonian='https://americanhistory.si.edu/explore/stories/two-tons-pig-parts-making-insulin-1920s';
  add('67 ter',{id:'s3-insuline',title:'Un exemple : l’insuline, des abattoirs aux bactéries',prov:'obs',html:split(`
    <div class="pgf-usines">
      <div class="pgf-card"><h3>Avant 1982 : extraire</h3><p>Pancréas de porcs et de bœufs, sous-produits des abattoirs.</p><p><strong>23 500 animaux</strong> pour 454 g d’insuline.</p></div>
      <div class="pgf-card pgf-card-accent" data-step="1"><h3>Depuis 1982 : faire fabriquer</h3><p>Un gène humain inséré dans des bactéries, cultivées en cuve.</p><p><strong>Aucun animal</strong> : l’offre ne dépend plus des abattoirs.</p></div>
    </div>
    <p class="pgf-lecture" data-step="2">Ce qui a changé, c’est la recette : <strong>une idée a levé une contrainte de ressources</strong>.</p>
    <p class="pgf-question" data-step="3">Quels sujets de notre liste retrouvez-vous ?</p>`,
    `<figure class="pgf-photo"><img src="sources/insuline_2026-11-15/pancreas_broyeurs_eli_lilly.jpg" alt="Deux photographies d’atelier chez Eli Lilly : un employé examine des pancréas dans un bac, un autre alimente un broyeur."><figcaption>À gauche, les pancréas sont examinés à leur arrivée de l’abattoir. À droite, ils passent dans des broyeurs avant l’extraction de l’insuline.<span class="pgf-credit">Fabrication de l’insuline chez Eli Lilly. Photographies publiées par Diane Wendt, ${link(smithsonian,'« Two tons of pig parts: Making insulin in the 1920s »')}, National Museum of American History, Smithsonian Institution, 2013.</span></figcaption></figure>`,'pgf-insuline'),
  source:`Chiffres : ${link('https://www.gene.com/40th/cloning-insulin','Genentech, Cloning insulin')} ; ${link(smithsonian,'National Museum of American History (2013)')}. Dates : ${link('https://www.nsf.gov/impacts/rdna-insulin','National Science Foundation')}.`},
  '<p>Écran ajouté le 15 novembre 2026 à la demande d’Arnaud : un exemple concret de croissance par la PGF, placé à la fin de la section. Arnaud choisit la photographie dans l’article de Diane Wendt, conservatrice au National Museum of American History, « Two tons of pig parts: Making insulin in the 1920s », 1er novembre 2013. Copie de la page et provenance : sources/insuline_2026-11-15/. La page ne donne ni crédit ni mention de droits sous la photographie : vérifier les conditions d’utilisation du Smithsonian avant toute publication. La version archivée fait 500 pixels de large. L’article situe ces photographies dans la série réunie avec Eli Lilly pour une exposition du Smithsonian au début des années 1920 ; la date exacte de chaque cliché n’est pas indiquée.</p><p>Faits et sources. Avant la biotechnologie, l’insuline est extraite de pancréas de porcs et de bœufs, « a waste product of the meatpacking industry » (Wendt) : les animaux ne sont pas abattus pour l’insuline. Selon Genentech, il faut alors 8 000 livres de pancréas, soit 23 500 animaux, pour une livre d’insuline, et Eli Lilly a besoin de 56 millions d’animaux par an pour la demande américaine. Wendt, d’après Diabetes Forecast, donne le même rapport : plus de deux tonnes de morceaux de porc pour huit onces d’insuline purifiée. Selon la National Science Foundation, l’insuline animale est limitée en quantité et provoque des réactions chez certains patients ; l’ADN recombinant est mis au point en 1973 par des chercheurs financés en partie sur fonds publics ; Genentech et City of Hope produisent de l’insuline humaine dans des bactéries en 1978 ; la FDA autorise Humulin en octobre 1982, premier médicament issu de l’ADN recombinant. Les chiffres de Genentech viennent du récit de l’entreprise elle-même.</p><p>À ne pas affirmer : que le nouveau procédé coûte moins cher ou demande moins de capital et de travail. Ces points ne sont pas vérifiés, et l’insuline animale est restée en vente après 1982. Ce que l’exemple montre : une recette nouvelle lève une contrainte de ressources, puisque la production ne dépend plus du nombre d’animaux abattus pour la viande. C’est une illustration du mécanisme, pas une mesure de PGF.</p><p>Réponses attendues à la question finale. (1) Idées : une recette non rivale, issue de découvertes cumulées de 1973 à 1978. (3) Recherche et développement : recherche publique, puis contrats de recherche d’Eli Lilly dès 1977 et travaux de Genentech. (2) Éducation : des chercheurs formés. (5) Qualité des institutions : autorisation de mise sur le marché par la FDA ; le rôle des brevets peut être discuté, il n’est pas documenté ici. Lien avec le chapitre 1 : le PIB compte les doses vendues ; il mesure mal la qualité du produit et ne compte ni le bien-être animal ni l’environnement.</p>');

  add('67 quater',{id:'s3-valeur-matiere',title:'La croissance se mesure en valeur, pas en tonnes',html:split(`<div class="pgf-jancovici-col"><figure class="pgf-photo pgf-jancovici-photo"><img src="sources/jancovici_valeur_2026-11-15/jancovici_quotidien_capture.png" alt="Jean-Marc Jancovici sur le plateau de Quotidien, dans la capture de la vidéo fournie."><figcaption><span class="pgf-credit">Capture d'écran, Youtube</span></figcaption></figure>
    <blockquote class="pgf-jancovici-quote" cite="https://www.youtube.com/watch?v=ahk6fsUn7Mc">« Je regarde un indicateur pour savoir comment va l'économie, c'est la <em>quantité de marchandise qui circule dans les camions</em>. [...] Tout ce que vous avez chez vous sera passé par la caisse d'un camion. Cet indicateur diminue depuis 2007 en Europe. En termes physiques, je considère que l'Europe est déjà entrée en décroissance depuis une petite vingtaine d'années. [...] La décroissance est déjà là. »</blockquote>
    <p class="pgf-jancovici-attribution"><strong>Jean-Marc Jancovici</strong>, <cite>Quotidien</cite>, 25 juin 2026.<br>${link('https://www.youtube.com/watch?v=ahk6fsUn7Mc','Voir l’intervention sur YouTube')}.</p></div>`,
    `<div class="pgf-valeur-points">
    ${points([
      'Le PIB réel mesure la <strong>valeur ajoutée à prix constants</strong>, pas des tonnes (chapitre&nbsp;1).',
      ['Une meilleure recette crée de la valeur <strong>sans matière en plus</strong> : l’insuline.',1],
      ['Moins de fret n’implique donc pas moins de PIB : les <strong>services</strong> font 75 % du PIB des pays riches.',2]
    ])}
    <aside class="pgf-mcafee-book" data-step="2" aria-label="Pour aller plus loin : More from Less et Ordinary Abundance">
      <img src="sources/mcafee_more_from_less_2026-11-15/more_from_less_couverture.jpg" alt="Première de couverture de More from Less, Andrew McAfee, Scribner, 2019.">
      <div><p class="pgf-book-label">Pour aller plus loin</p>
        <p class="pgf-book-title"><cite>More from Less</cite></p>
        <p class="pgf-book-author">Andrew McAfee, 2019</p>
        <p class="pgf-book-thesis">Sa thèse : prospérer en utilisant moins de ressources.</p>
        <p class="pgf-book-links">${link('https://inquisitivebiologist.com/2020/04/27/book-review-more-from-less-the-surprising-story-of-how-we-learned-to-prosper-using-fewer-resources-and-what-happens-next/','Compte rendu critique')}.<br>Couverture : ${link('https://www.simonandschuster.com/books/More-from-Less/Andrew-McAfee/9781982103576','Scribner')}.</p>
      </div>
      <p class="pgf-site"><cite>${link('https://ordinaryabundance.com/','Ordinary Abundance')}</cite>, Jordan Dworkin. Une visite d’appartement : ce que la croissance a mis dans nos objets ordinaires.</p>
    </aside>
    </div>`, 'pgf-valeur-matiere'),
    source:`Services : ${link('https://documents1.worldbank.org/curated/en/099258110092319807/pdf/IDU0be37875e0bee10474f0907a043151e283794.pdf','Banque mondiale et OMC (2023), Trade in Services for Development')}, p. 14–16.`},
  '<p>Ajout du 16 novembre 2026, à la demande d’Arnaud : l’encadré s’intitule « Pour aller plus loin » et recommande aussi le site Ordinary Abundance (ordinaryabundance.com), signé Jordan Dworkin, en anglais, sans date ni licence visibles. C’est un essai d’une page : la visite d’un appartement moderne, où des objets ordinaires (lumière électrique, eau du robinet, réfrigération, machine à coudre) sont présentés comme autrefois hors de portée, avec une vingtaine de sources historiques. Il illustre la croissance comme gain de qualité de vie ; il ne traite pas de dématérialisation et ne prouve pas la thèse de McAfee. Aucune image du site n’est reprise. Exemple possible à l’oral, cité par le site d’après Godey’s Lady’s Book (1860) : une chemise neuve demandait environ quatorze heures de couture à la main. Page d’accueil lue le 16 novembre ; citations et sources du site non vérifiées.</p><p>Dernière retouche du 15 novembre 2026, à la demande d’Arnaud : trois puces au lieu de quatre, capture et citation dans la colonne gauche (62 %), puces et lecture recommandée à droite. Première puce à l’entrée, deuxième au premier clic, troisième et More from Less au second. Cette description remplace les indications de disposition et de nombre de puces qui suivent. La première puce rappelle le chapitre 1 ; la deuxième renvoie à l’insuline, sans affirmer que le nouveau procédé coûte moins cher ; la troisième cite les 75 % de services dans le PIB des pays à haut revenu en 2021 (Banque mondiale et OMC, 2023). Le mot « dématérialisation » quitte l’écran : l’écran suivant montre que la matière utilisée par habitant augmente encore dans le monde.</p><p>Ajout demandé par Arnaud le 15 novembre 2026, après l’exemple de l’insuline et avant la conclusion. Quatre puces et une lecture recommandée à gauche ; colonne de droite élargie à 62 %, avec la capture, la légende « Capture d’écran, Youtube », puis la citation intégrale et son attribution. Disposition corrigée à la demande d’Arnaud le 15 novembre 2026. La citation, la capture et la première puce sont visibles dès l’entrée ; les puces suivantes apparaissent aux clics successifs. Le troisième clic révèle le point sur la dématérialisation et les services, ainsi que More from Less. Lecture et impression : état complet.</p><p>La citation, sa date (25 juin 2026) et le lien YouTube sont fournis par Arnaud. Le texte est reproduit sans changement de mots, avec ses omissions [...] et l’italique fourni. La vidéo et les statistiques alléguées (fret depuis 2007) n’ont pas été vérifiées indépendamment. Ne pas présenter ces chiffres comme des résultats établis par le cours. Sources et provenance : sources/jancovici_valeur_2026-11-15/README.md.</p><p>Distinction pédagogique : le PIB réel agrège la valeur ajoutée de biens et de services en neutralisant la variation des prix. Le volume des comptes nationaux n’est pas un volume physique en tonnes ; il peut intégrer des variations de qualité, avec des difficultés de mesure. La valeur économique n’est pas une mesure exhaustive du bien-être. Une innovation peut créer plus de valeur à masse identique ; elle ne rend pas les services immatériels ni sans consommation d’énergie ou de ressources. Une baisse du fret routier ne suffit pas à déduire une baisse du PIB réel : composition de la production, qualité, services et modes de transport peuvent différer. Aucune évolution chiffrée du PIB ou du fret n’est affirmée sur cet écran.</p><p>Ajout demandé le 15 novembre : dématérialisation et essor des services, avec recommandation de More from Less (Andrew McAfee, Scribner, 2019, ISBN 9781982103576) et couverture officielle. La formule « peut refléter » est une interprétation possible du recul du fret, pas une identification de ses causes. Tertiarisation : hausse de la place des services ; dématérialisation relative : moins de matière par unité de production ; dématérialisation absolue : recul de la quantité totale de matière. Ces concepts sont distincts. Banque mondiale et OMC (2023), Trade in Services for Development, p. 14–16 : les services passent de 59 % à 75 % du PIB des pays à haut revenu entre 1970 et 2021, contre 36 % à 42 % dans les pays à faible revenu. Cette comparaison confirme la place dominante des services dans les pays riches, sans établir la cause de la baisse du fret européen.</p><p>Lecture recommandée, thèse attribuée : McAfee défend la possibilité de prospérer en utilisant moins de ressources, en combinant innovation, incitations économiques, attention du public et action des pouvoirs publics. Le livre ne réduit donc pas la dématérialisation au déplacement vers les services. La fiche officielle de Scribner et trois comptes rendus sont consultés ; le livre intégral n’a pas été lu. The Inquisitive Biologist (27 avril 2020) apprécie la présentation mais discute les ressources incorporées aux importations, les effets de rebond et la généralisation mondiale. Kirkus (17 août 2019) juge le raisonnement stimulant mais son optimisme discutable. Wernick, Journal of Industrial Ecology (2020), DOI 10.1111/jiec.13068, reconnaît les tendances technologiques documentées tout en contestant la généralisation à la résolution des problèmes écologiques mondiaux. Sources, liens et distinction entre arguments et résultats établis : sources/mcafee_more_from_less_2026-11-15/README.md.</p><p>Portée de la critique : Arnaud souhaite critiquer les arguments de décroissance qui assimilent croissance économique et flux matériels. L’extrait parle explicitement de décroissance en termes physiques : prendre cet indicateur physique comme un indicateur suffisant de la croissance économique est la confusion discutée. Ce seul extrait ne démontre pas que tous les arguments de décroissance commettent cette erreur. La distinction valeur/matière ne démontre ni un découplage absolu global ni la possibilité d’une croissance infinie ; ces questions nécessitent des données et des hypothèses supplémentaires.</p>');

  /* --------------------------------------------------------------- graphiques */

  // Lecture des valeurs au survol et au clavier, comme dans la comptabilité.
  function inspect(box,items){
    const readout=document.createElement('div');readout.className='ch-readout pgf-readout';readout.setAttribute('role','status');readout.setAttribute('aria-live','polite');box.append(readout);
    let current=0;
    const hide=()=>{readout.classList.remove('on');items.forEach(item=>item.node.classList.remove('pgf-inspected'));};
    const show=i=>{current=(i+items.length)%items.length;hide();items[current].node.classList.add('pgf-inspected');readout.textContent=items[current].text;readout.classList.add('on');};
    box.tabIndex=0;box.setAttribute('role','group');box.setAttribute('aria-label','Graphique interactif. Flèches pour consulter les valeurs, Échap pour revenir aux diapositives.');
    box.onkeydown=e=>{if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();e.stopPropagation();show(current+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1));}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();hide();box.blur();}};
    box.onfocus=()=>show(0);box.onblur=hide;box.onpointerleave=hide;
    items.forEach((item,i)=>{item.node.setAttribute('aria-label',item.text);C.el('title',{},item.node).textContent=item.text;item.node.addEventListener('pointerenter',()=>show(i));});
  }
  const svgText=(svg,x,y,value,attrs={})=>C.txt(svg,x,y,value,'pgf-svg-text',attrs);

  // Barres horizontales : une ou deux barres par ligne, axe gradué, repère vertical facultatif.
  function barRows(box,o,ctx){
    const key=[box.clientWidth,o.key||''].join('|');
    if(box.dataset.render===key&&!ctx.entry)return;
    box.dataset.render=key;
    const {svg,Wd,Ht,arrow}=C.frame(box,{height:o.height,aria:o.aria}),left=o.left,right=o.right??86,top=8,bottom=46;
    const X=v=>left+(v-o.min)/(o.max-o.min)*(Wd-left-right),rowH=(Ht-top-bottom)/o.rows.length,items=[];
    if(o.reference!=null)C.el('line',{x1:X(o.reference),x2:X(o.reference),y1:top,y2:Ht-bottom,stroke:'#697386','stroke-dasharray':'6 6','stroke-width':2},svg);
    o.rows.forEach((row,i)=>{
      const count=row.bars.length,barH=Math.min(o.barHeight||34,(rowH-10)/Math.max(count,o.slots||count)),slots=o.slots||count;
      const y0=top+i*rowH+(rowH-slots*barH-(slots-1)*4)/2;
      svgText(svg,left-16,top+i*rowH+rowH/2+8,row.label,{'text-anchor':'end','font-size':24,'font-weight':row.bold?700:500});
      row.bars.forEach((bar,j)=>{
        const y=y0+j*(barH+4),animated=ctx.animate&&bar.animate!==false;
        const node=C.el('rect',{x:left,y,width:Math.max(1,X(bar.value)-left),height:barH,fill:bar.color,class:animated?'ch-bar anim-x':'ch-bar',style:`animation-delay:${i*.07}s`},svg);
        svgText(svg,X(bar.value)+10,y+barH/2+8,bar.label,{'font-size':23,'font-weight':700,fill:C.darken(bar.color,.8)});
        items.push({node,text:bar.readout});
      });
    });
    C.el('line',{x1:left,y1:Ht-bottom,x2:Wd-right+24,y2:Ht-bottom,class:'ch-axis','marker-end':arrow},svg);
    o.ticks.forEach(v=>{C.el('line',{x1:X(v),x2:X(v),y1:Ht-bottom,y2:Ht-bottom+7,class:'ch-tickmark'},svg);svgText(svg,X(v),Ht-13,(o.tickFormat||(t=>fmt(t,0)))(v),{'text-anchor':'middle','font-size':21});});
    inspect(box,items);
  }

  G.on('s3-solow-exogene',(el,ctx)=>{
    const second=ctx.static||ctx.step>=1;
    barRows(el.querySelector('#pgf-residu-chart'),{key:String(second),height:500,left:200,min:0,max:1.08,reference:1,ticks:[0,.25,.5,.75,1],tickFormat:v=>fmt(100*v,0),slots:2,barHeight:36,
      aria:'PGF résiduelle de quatre pays, en % du niveau américain, sans puis avec le capital humain',
      rows:residu.map(c=>({label:c.name,bars:[
        {value:c.sans,color:grey,label:fmt(100*c.sans,0)+' %',animate:ctx.entry,readout:`${c.name} — résidu sans compter le capital humain : ${fmt(100*c.sans,1)} % du niveau américain.`},
        ...(second?[{value:c.avec,color:navy,label:fmt(100*c.avec,0)+' %',readout:`${c.name} — PGF en comptant le capital humain : ${fmt(100*c.avec,1)} % du niveau américain.`}]:[])
      ]}))},ctx);
  });

  const line=(id,ctx,options)=>G.line(id,{animate:ctx.entry?ctx.animate:false,duration:1.8,labelGap:27,legend:false,...options});
  const annotate=(chart,cls,draw)=>{if(chart&&!chart.svg.querySelector('.'+cls))draw(C.el('g',{class:cls},chart.svg),chart.S,chart.m);};

  G.on('s3-education',(el,ctx)=>{
    const styles={USA:[navy,null],FRA:[orange,null],KOR:[slate,null],CHN:[grey,null],IND:[grey,'8 6']};
    line('pgf-scolarite-chart',ctx,{margin:{r:150,t:30,b:46},x:{min:1870,max:2010,ticks:[1870,1900,1950,1980,2010]},y:{min:0,max:14,ticks:[0,2,4,6,8,10,12,14]},
      series:P.scolarite.series.map(s=>({name:s.name,endLabel:s.name,color:styles[s.code][0],dash:styles[s.code][1],data:s.data,format:v=>fmt(v,1)+' ans'}))});
  });

  G.on('s3-recherche',(el,ctx)=>{
    const styles={KOR:[navy,null],USA:[slate,null],DEU:[grey,null],CHN:[grey,'8 6'],FRA:[orange,null]},target=ctx.static||ctx.step>=1;
    const chart=line('pgf-rd-chart',ctx,{ends:true,margin:{r:200,t:30,b:46},x:{min:1996,max:P.rd.lastYear,ticks:[1996,2005,2014,P.rd.lastYear]},y:{min:0,max:5.5,ticks:[0,1,2,3,4,5]},
      refLines:target?[{y:3,color:orange,dash:'7 6'}]:[],
      series:P.rd.series.map(s=>({name:s.name,endLabel:s.name,color:styles[s.code][0],dash:styles[s.code][1],data:s.data,format:v=>fmt(v,1)+' %'}))});
    if(target)annotate(chart,'pgf-target',(g,S)=>C.txt(g,S.X(1996.6),S.Y(3)-12,'Objectif européen : 3 %','ch-lab',{fill:C.darken(orange,.85)}));
  });

  G.on('s3-automatisation',(el,ctx)=>{
    line('pgf-robots-chart',ctx,{ends:true,margin:{r:140,t:30,b:46},x:{min:2012,max:2024,ticks:[2012,2016,2020,2024]},y:{min:0,max:600,ticks:[0,100,200,300,400,500,600]},
      series:P.robots.series.map((s,i)=>({name:s.name,endLabel:s.name,color:i?orange:navy,data:s.data,format:v=>fmt(v,0)}))});
  });

  G.on('s3-automatisation-travail',(el,ctx)=>{
    const styles={agriculture:orange,industrie:slate,services:navy};
    line('pgf-emploi-chart',ctx,{ends:true,margin:{r:175,t:30,b:46},x:{min:1856,max:2007,ticks:[1856,1900,1950,2007]},y:{min:0,max:80,ticks:[0,20,40,60,80]},
      series:P.emploi.series.map(s=>({name:s.name,endLabel:s.name,color:styles[s.key],data:s.data,format:v=>fmt(v,0)+' %'}))});
  });

  G.on('s3-institutions',(el,ctx)=>{
    const chart=line('pgf-corees-chart',ctx,{margin:{r:160,t:30,b:46},x:{min:1911,max:2022,ticks:[1911,1945,1990,2022]},y:{min:0,max:45000,ticks:[0,10000,20000,30000,40000],format:v=>fmt(v,0)},
      series:P.corees.series.map((s,i)=>({name:s.name,endLabel:s.name,color:i?orange:navy,gaps:1.5,data:s.data,format:v=>fmt(v,0)+' $'}))});
    annotate(chart,'pgf-partition',(g,S,margin)=>{
      C.el('line',{x1:S.X(1945),x2:S.X(1945),y1:margin.t,y2:S.Y(0),stroke:'#697386','stroke-width':2,'stroke-dasharray':'6 6'},g);
      C.txt(g,S.X(1945)+10,margin.t+18,'1945 : partition','ch-lab',{fill:'#536078'});
      [['Corée du Nord :',orange],['pas de données',orange],['de 1944 à 1989',orange]].forEach(([label,color],i)=>C.txt(g,S.X(1950),S.Y(21000)+24*i,label,'ch-lab',{fill:C.darken(color,.85)}));
      [['En 1940',slate],[`Nord : ${fmt(corees.nord1940,0)} $`,orange],[`Sud : ${fmt(corees.sud1940,0)} $`,navy]].forEach(([label,color],i)=>C.txt(g,S.X(1912.5),S.Y(11000)+24*i,label,'ch-lab',{fill:C.darken(color,.85)}));
    });
  });

  // Nuage institutions–revenu : un seul graphique vivant, dont les points se déplacent d’un indicateur à l’autre.
  const instLabels={
    USA:{name:'États-Unis',rl:{dx:10,dy:-12,anchor:'start'},cc:{dx:10,dy:-12,anchor:'start'}},
    FRA:{name:'France',rl:{dx:-12,dy:26,anchor:'end'},cc:{dx:12,dy:26,anchor:'start'}},
    KOR:{name:'Corée du Sud',rl:{dx:12,dy:26,anchor:'start'},cc:{dx:-10,dy:-12,anchor:'end'}},
    CHN:{name:'Chine',rl:{dx:-12,dy:-10,anchor:'end'},cc:{dx:-12,dy:-10,anchor:'end'}},
    IND:{name:'Inde',rl:{dx:12,dy:24,anchor:'start'},cc:{dx:12,dy:24,anchor:'start'}},
    NGA:{name:'Nigeria',rl:{dx:-12,dy:24,anchor:'end'},cc:{dx:-12,dy:24,anchor:'end'}}
  };
  const instNames={rl:'État de droit',cc:'Contrôle de la corruption'};
  const instPoints=key=>inst.points.map(p=>{const hl=instLabels[p.iso];return {key:p.iso,x:p[key],y:p.gdp,name:p.name,indicator:instNames[key],hl:!!hl,label:hl?hl.name:null,color:hl?orange:navy,...(hl?hl[key]:{})};});
  function instChart(box,key,animate,height){
    return C.scatter(box,{height,width:box.clientWidth||680,animate,opacity:.42,radius:p=>p.hl?8.5:5.5,
      x:{min:-2.5,max:2.5,ticks:[-2,-1,0,1,2],format:v=>fmt(v,0)},y:{log:true,min:800,max:200000,ticks:[1000,3000,10000,30000,100000],format:v=>fmt(v,0)},
      xTitle:'Indice de gouvernance, de −2,5 (faible) à +2,5 (élevé)',yTitle:'PIB par habitant, dollars de 2021, échelle logarithmique',
      points:instPoints(key),tip:p=>`<b>${G.esc(p.name)}</b><br>${p.indicator} : ${fmt(p.x,2)}<br>PIB par habitant : ${fmt(p.y,0)} $`});
  }
  let instLive=null;
  const instState={step:null,key:'rl'};
  G.on('s3-institutions-correlations',(el,ctx)=>{
    if(ctx.static){
      ['rl','cc'].forEach(key=>{const box=el.querySelector('#pgf-inst-chart-'+key),mark=key+'|'+box.clientWidth;if(box.dataset.render!==mark){box.dataset.render=mark;instChart(box,key,false,400);}});
      return;
    }
    const box=el.querySelector('#pgf-inst-chart'),title=el.querySelector('#pgf-inst-titre'),group=el.querySelector('#pgf-inst-choix');
    const show=key=>{
      instState.key=key;title.textContent=instNames[key];
      group.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.value===key)));
      if(!instLive||instLive.width!==box.clientWidth||!box.contains(instLive.chart.svg))instLive={width:box.clientWidth,chart:instChart(box,key,ctx.animate&&ctx.entry,560)};
      else instLive.chart.update(instPoints(key));
    };
    // Le premier clic passe au second indicateur ; un choix fait avec les boutons est ensuite conservé.
    if(ctx.entry||(instState.step!==ctx.step&&ctx.step<=1))instState.key=ctx.step>=1?'cc':'rl';
    instState.step=ctx.step;
    group.querySelectorAll('button').forEach(button=>{button.onclick=()=>show(button.dataset.value);});
    show(instState.key);
  });

  G.on('s3-management',(el,ctx)=>{
    barRows(el.querySelector('#pgf-management-chart'),{height:540,left:205,right:70,min:1,max:4,ticks:[1,2,3,4],barHeight:30,
      aria:'Score moyen de management dans dix pays, sur une échelle de 1 à 5',
      rows:scores.map(c=>({label:c.country,bold:c.country==='France',bars:[{value:c.mean,color:c.country==='France'?orange:navy,label:fmt(c.mean,2),
        readout:`${c.country} — score moyen de management : ${fmt(c.mean,2)} sur 5, ${fmt(c.n,0)} entreprises.`}]}))},ctx);
  });

  // Exemple de Jones : A(x) = √(x(1−x)), maximal en x = 1/2.
  const A=x=>Math.sqrt(x*(1-x)),courbe=Array.from({length:201},(_,i)=>[i/200,A(i/200)]);
  G.on('s3-allocation',(el,ctx)=>{
    const step=ctx.static?99:ctx.step,shown=step>=1;
    const fraction=v=>v===.5?'1/2':v===.25?'1/4':String(v);
    const chart=G.line('pgf-allocation-chart',{animate:shown&&step===1&&ctx.animate,duration:1.6,legend:false,hover:false,margin:{l:74,r:46,t:62,b:74},yTitle:'PGF, A(x)',
      x:{min:0,max:1,ticks:[0,.5,1],format:fraction},y:{min:0,max:.6,ticks:[0,.25,.5],format:fraction},xTitle:'Part du travail dans l’acier, x',
      series:[{name:'A(x)',color:shown?navy:'transparent',data:courbe}],
      markers:[...(step>=2?[{x:.5,y:.5,color:navy,label:'Optimum : x = 1/2, A = 1/2',dy:-18}]:[]),...(step>=3?[{x:.9,y:.3,color:orange}]:[])]});
    if(!chart)return;
    if(step>=2)annotate(chart,'pgf-guides',(g,S)=>{
      [[.5,.5,navy],...(step>=3?[[.9,.3,orange]]:[])].forEach(([x,y,color])=>{
        C.el('line',{x1:S.X(0),x2:S.X(x),y1:S.Y(y),y2:S.Y(y),stroke:color,'stroke-width':2,'stroke-dasharray':'6 6'},g);
        C.el('line',{x1:S.X(x),x2:S.X(x),y1:S.Y(0),y2:S.Y(y),stroke:color,'stroke-width':2,'stroke-dasharray':'6 6'},g);
      });
      // Libellé de l'exemple en deux lignes, de part et d'autre du repère, sans croiser celui de l'optimum.
      if(step>=3)['x = 0,9 : A = 0,3','soit 40 % de moins'].forEach((label,i)=>C.txt(g,S.X(.86),S.Y(.3)+(i?27:-12),label,'ch-val',{fill:C.darken(orange,.85),'text-anchor':'end','font-style':i?null:'italic'}));
    });
    const input=el.querySelector('#pgf-allocation-x'),output=el.querySelector('#pgf-allocation-sortie');
    let cursor=chart.svg.querySelector('.pgf-cursor');
    if(!cursor)cursor=C.el('circle',{class:'pgf-cursor',r:10,fill:'#fff',stroke:orange,'stroke-width':4},chart.svg);
    const move=()=>{
      const x=Number(input.value),value=A(x),loss=100*(1-value/.5);
      cursor.setAttribute('cx',chart.S.X(x));cursor.setAttribute('cy',chart.S.Y(value));cursor.style.display=shown&&!ctx.static?'':'none';
      output.innerHTML=`${m('x = '+fmt(x,2))} &nbsp;→&nbsp; ${m('A(x) = '+fmt(value,2))}${step<2?'':loss>=.5?`, soit ${fmt(loss,0)} % de moins qu’à l’optimum`:', l’optimum'}`;
    };
    input.oninput=move;input.onpointerup=()=>input.blur();input.onkeydown=e=>{if(e.key==='Escape')input.blur();};
    move();
  });
})();
