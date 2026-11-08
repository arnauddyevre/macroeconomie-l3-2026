
(function(){
  'use strict';
  const G=window.G2,part=G.titles[2],base="assets/pgf/";
  const link=(url,label)=>`<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
  const credits={
    'solow.jpg':['https://commons.wikimedia.org/wiki/File:Robert_Solow_by_Olaf_Storbeck.jpg','Olaf Storbeck, 2008. CC BY-SA 2.0'],
    'romer.jpg':['https://commons.wikimedia.org/wiki/File:Paul_Romer_EM1B6039_(46234134401).jpg','Bengt Nyman, 2018. CC BY 2.0'],
    'education.jpg':['https://commons.wikimedia.org/wiki/File:Students_in_a_classroom.jpg','Ente75, 2008. Domaine public'],
    'recherche.jpg':['https://commons.wikimedia.org/wiki/File:Researchers_in_laboratory.jpg','Rhoda Baer, NCI/NIH, 2008. Domaine public'],
    'institutions.jpg':['https://commons.wikimedia.org/wiki/File:Assemblée_Nationale_-_Hémicycle.JPG','Sunala, 2013. CC BY-SA 3.0'],
    'pesticides.jpg':['https://commons.wikimedia.org/wiki/File:Tractor_spraying_pesticides_IMG_5235.jpg','Stefan Thiesen, 2009. CC BY-SA 3.0']
  };
  const photo=(file,alt,caption,cls='')=>`<figure class="pgf-photo ${cls}"><img src="${base}images/${file}" alt="${alt}"><figcaption>${caption}${credits[file]?`<span class="pgf-credit">${link(...credits[file])}</span>`:''}</figcaption></figure>`;
  const figure=(file,alt,caption,cls='')=>`<figure class="pgf-figure ${cls}"><a href="${base}figures/${file}" target="_blank" rel="noopener" aria-label="Agrandir la figure : ${alt}"><img src="${base}figures/${file}" alt="${alt}"></a><figcaption>${caption}</figcaption></figure>`;
  const split=(text,visual,cls='')=>`<div class="pgf-columns ${cls}"><div class="pgf-text">${text}</div>${visual}</div>`;
  const bullets=items=>G.list(items);
  const add=(n,obj)=>G.add({part,cls:'pgf-slide',source:'',prov:[77,78,82,83].includes(n)?'obs':null,...obj});

  add(73,{id:'s3',layout:'section',title:part,html:G.plan(2)});

  add(74,{id:'s3-solow-exogene',title:'Manna from heaven ?',html:split(bullets([
    'Robert Solow présente son modèle de croissance en <strong>1956</strong>, dans le contexte de la reconstruction et de la généralisation des comptes nationaux.',
    'L’accumulation du capital ne suffit pas à entretenir la croissance par tête : <strong>la progression de la PGF joue un rôle central</strong>.',
    'Dans Solow, le progrès technique est <strong>exogène</strong> : sa trajectoire est donnée au modèle, qui n’explique pas son origine.',
    '<strong>Exogène ne signifie pas constant.</strong> Dans notre modèle, <span class="g-math">A</span> progresse au taux <span class="g-math">γ</span>.'
  ]),photo('solow.jpg','Robert Solow','Robert Solow (1924–2023)<br>Prix Nobel d’économie 1987','pgf-portrait')),
  source:link('https://doi.org/10.2307/1884513','Solow (1956), A Contribution to the Theory of Economic Growth')});

  add(75,{id:'s3-croissance-endogene',title:'Ou le résultat de décisions endogènes ?',html:split(bullets([
    'Les théories de la <strong>croissance endogène</strong> relient l’innovation aux décisions des entreprises, des individus et des pouvoirs publics.',
    '<strong>Romer (1990)</strong> et <strong>Aghion–Howitt (1992)</strong> en proposent deux modèles majeurs : nouveaux produits, amélioration de leur qualité et destruction créatrice.',
    'La recherche et l’innovation répondent aux <strong>incitations économiques, politiques et institutionnelles</strong>.',
    'Pour transformer la production, les innovations doivent aussi être <strong>diffusées et adoptées</strong>.',
    'Ces modèles aident à comprendre les mécanismes et à confronter leurs prédictions aux données.'
  ]),photo('romer.jpg','Paul Romer','Paul Romer : Nobel 2018<br>Aghion et Howitt : Nobel 2025'),'pgf-dense'),
  source:`${link('https://doi.org/10.1086/261725','Romer (1990)')} ; ${link('https://doi.org/10.2307/2951599','Aghion et Howitt (1992)')}`});

  add(76,{id:'s3-education',title:'Éducation',html:split(bullets([
    'L’adoption d’une technologie nécessite souvent de <strong>nouvelles compétences</strong>. Leur absence peut ralentir sa diffusion.',
    'Cette course entre <strong>éducation et technologie</strong> modifie la demande de compétences et les salaires : informatique, apprentissage automatique, ingénierie…',
    'Les connaissances et compétences acquises constituent le <strong>capital humain</strong>. Elles contribuent aux écarts de productivité entre pays.',
    'Si le capital humain est mesuré séparément, sa contribution ne doit pas être comptée une seconde fois dans la PGF.'
  ]),photo('education.jpg','Salle de classe et élèves au travail','Éducation et acquisition de compétences'))});

  add(77,{id:'s3-education-historique',title:'Éducation',html:`<p class="pgf-chart-intro">Durée moyenne de scolarité des personnes de plus de 15 ans</p>${figure('education_niveau.png','Années moyennes de scolarité dans dix-sept pays et dans la zone euro en 1900, 1950 et 2010. Hausse générale entre ces trois dates.','1900, 1950 et 2010 : trois niveaux successifs, en années d’études.','pgf-education-figure')}`,
  source:'Van Leeuwen et van Leeuwen-Li (2014), figure reprise dans le support de 2025.'});

  add(78,{id:'s3-recherche',title:'Recherche et développement',html:split(bullets([
    'Les dépenses de <strong>recherche et développement (R&D)</strong> financent les personnes, équipements et expériences nécessaires à l’innovation.',
    'Les pouvoirs publics soutiennent cet effort par des <strong>crédits d’impôt, subventions et financements directs</strong>.',
    'L’objectif européen est de consacrer <strong>3 % du PIB de l’Union européenne</strong> à la R&D.',
    'En France : <strong>61,5 milliards d’euros en 2023</strong>, soit <strong>2,18 % du PIB</strong>. En Corée du Sud : <strong>5,13 % du PIB en 2024</strong>.',
    'Les programmes de relance après la pandémie, dont France Relance et NextGenerationEU, comportent un soutien à la recherche et à l’innovation.'
  ]),photo('recherche.jpg','Travail de recherche dans un laboratoire','La recherche mobilise du travail et des équipements'),'pgf-dense'),
  source:`${link('https://www.enseignementsup-recherche.gouv.fr/fr/depenses-de-recherche-et-developpement-experimental-en-france-resultats-detailles-pour-2023-et-100291','SIES (2025), résultats 2023')} ; ${link('https://eiec.kdi.re.kr/policy/materialView.do?num=275403&pg=&pp=&topic=L','Ministère coréen de la Science / KDI (2025), résultats 2024')}`});

  add(79,{id:'s3-automatisation',title:'Automatisation',html:split(bullets([
    '<strong>L’automatisation</strong> consiste à confier à une machine une tâche auparavant réalisée par une personne.',
    'À production inchangée, utiliser moins de travail augmente <strong>la productivité du travail</strong>, <span class="g-math">Y/L</span>. Cela peut demander davantage de capital.',
    'Les machines peuvent réaliser un nombre croissant de tâches. Cela implique-t-il une <strong>disparition du travail humain</strong> ?',
    'Que devient alors la complémentarité entre <span class="g-math">K</span> et <span class="g-math">L</span> dans la fonction de Cobb–Douglas ?'
  ]),photo('automatisation.png','Illustration de robots réalisant des tâches dans un atelier','Illustration du support de 2025')),
  source:'Pour aller plus loin : Aghion, Antonin et Bunel (2019), Intelligence artificielle, croissance et emploi : le rôle des politiques.'});

  add(80,{id:'s3-automatisation-travail',title:'Automatisation',html:split(bullets([
    'L’approche par les <strong>tâches</strong> distingue ce qu’une machine remplace et ce qui reste complémentaire au travail humain. Un métier réunit plusieurs tâches.',
    'Dans Cobb–Douglas, à travail et PGF donnés, <strong>le produit marginal du capital diminue</strong> quand le capital augmente. C’est une hypothèse du modèle.',
    'Une entreprise plus productive peut baisser ses prix, gagner des marchés et produire davantage : cet <strong>effet d’expansion</strong> peut soutenir son emploi.',
    'L’effet total dépend aussi des tâches supprimées, des nouvelles tâches et des pertes chez les concurrents. <strong>Les gains ne bénéficient pas nécessairement à tous.</strong>'
  ]),photo('automatisation_travail.png','Illustration d’une personne et d’un robot se serrant la main','Illustration du support de 2025'),'pgf-dense'),
  source:'Aghion, Antonin, Bunel et Jaravel (2022), référence du support de 2025.'});

  add(81,{id:'s3-institutions',title:'Institutions',html:split(bullets([
    'Les <strong>institutions</strong> sont les règles qui organisent les interactions économiques et politiques.',
    'Droits de propriété, protection des contrats, lutte contre la corruption, liberté d’entreprendre et réglementation modifient les <strong>incitations à investir et à innover</strong>.',
    'Même lorsque les technologies et les compétences existent, ces règles peuvent favoriser ou freiner leur <strong>développement et leur adoption</strong>.',
    'Acemoglu, Johnson et Robinson étudient le rôle des institutions dans les écarts de prospérité : <strong>prix Nobel d’économie 2024</strong>.'
  ]),photo('institutions.jpg','Hémicycle de l’Assemblée nationale française','Les règles collectives encadrent les décisions économiques'),'pgf-dense'),
  source:'Pour aller plus loin : Acemoglu et Robinson (2012), Why Nations Fail.'});

  add(82,{id:'s3-institutions-correlations',title:'Institutions',html:`<p class="pgf-chart-intro">De meilleures institutions sont associées à un revenu par habitant plus élevé.</p><div class="pgf-figures-pair">${figure('institutions_propriete.png','Nuage de points : protection contre le risque d’expropriation en 1985–1995 et logarithme du PIB par habitant en PPA en 1995. Relation positive.','Protection contre l’expropriation')}${figure('institutions_corruption.png','Nuage de points : contrôle de la corruption et logarithme du PIB par habitant en PPA en 1995. Relation positive.','Contrôle de la corruption')}</div><p class="pgf-caution">Ces corrélations ne suffisent pas à établir une causalité.</p>`,
  source:'Acemoglu, Johnson et Robinson (2005), figure 1 à gauche ; figure de droite reprise du support de 2025.'});

  add(83,{id:'s3-management',title:'Management',html:split(bullets([
    'Les pratiques de <strong>management</strong> sont associées à d’importants écarts de productivité entre entreprises (Bloom, Sadun et Van Reenen, 2016).',
    'Pellegrino et Zingales étudient le rôle du <strong>manque de méritocratie</strong> dans le ralentissement italien : sélection des dirigeants et adoption des technologies.',
    'En Italie, les leaders de marché ont davantage de <strong>liens politiques</strong>, tandis que leur intensité de brevets est plus faible dans cette comparaison.'
  ]),figure('management_liens.png','En Italie, du premier au vingtième rang du marché, l’intensité de brevets augmente et celle des élus salariés diminue.','Italie : rang sur le marché, brevets et élus locaux salariés.','pgf-management-figure'),'pgf-management'),
  source:link('https://www.bancaditalia.it/pubblicazioni/temi-discussione/2022/2022-1376/en_tema_1376.pdf?language_id=1','Akcigit, Baslandze et Lotti (2022), figure 3')});

  add(84,{id:'s3-limites-pgf',title:'Qu’est-ce qui n’est pas dans la PGF ?',html:split(bullets([
    'La PGF est un <strong>résidu de la décomposition de la production mesurée</strong>. Elle hérite des limites du PIB et de la mesure du capital et du travail.',
    'Le prêt gratuit d’un outil entre voisins peut rendre un service sans créer de transaction enregistrée. <strong>Valeur d’usage et production mesurée diffèrent.</strong>',
    'À capital mesuré inchangé, une utilisation plus intense des machines peut au contraire <strong>apparaître dans le résidu de PGF</strong>.',
    'Les dommages environnementaux ne sont pas automatiquement déduits : des pesticides peuvent accroître la production tout en dégradant la biodiversité.',
    'Les modèles de croissance peuvent intégrer ces mécanismes et ces contraintes, à condition de les expliciter.'
  ]),photo('pesticides.jpg','Pulvérisation de produits sur une parcelle agricole','Production agricole et effets sur l’environnement'),'pgf-dense')});
})();
