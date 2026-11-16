/* Conclusion d'après Chad Jones, ajout local du 15 novembre 2026.
 * Sources et conventions : sources/chad_jones_conclusion_2026-11-15/. */
(function(){
  'use strict';
  const G=window.G2,m=html=>'<span class="g-math">'+html+'</span>',dot=G.dot,frac=G.f;
  G.add({
    id:'conclusion',part:'Conclusion',title:'Conclusion',layout:'section',cls:'gc-divider',
    html:'<h1>Conclusion</h1>',
    notes:'<p>Séparation indépendante demandée par Arnaud le 15 novembre 2026. Elle suit la section IA et introduit deux écrans : les moteurs des modèles de croissance, puis les cinq conclusions du chapitre.</p>'
  });
  // Une formule par modèle : le moteur, sa loi, une phrase. Les formules secondaires restent dans les notes.
  const models=[
    ['Solow, capital seul','Rendements décroissants : la croissance s’arrête.','K',m(dot('k')+' = sk<sup>α</sup>'),'gc-contre-exemple'],
    ['Solow, progrès technique','La PGF croît à un rythme donné.','A',m(dot('A')+' = γA'),''],
    ['AK','Le capital entretient son accumulation.','K',m(dot('K')+' = sAK'),''],
    ['Lucas','La formation accroît le capital humain.','h',m(dot('h')+' = uh'),''],
    ['Romer, Aghion–Howitt','Les chercheurs produisent de nouvelles idées.','A',m(dot('A')+' = zL<sub>R</sub>A'),''],
    ['Jones, croissance semi-endogène','Davantage de chercheurs, car la population croît.','L',m(dot('L')+' = nL'),'']
  ];
  G.add({
    id:'conclusion-modeles',part:'Conclusion',title:'Les modèles de croissance : quel moteur ?',cls:'gc-slide',
    html:'<div class="gc-layout">'+
      '<div class="gc-principles">'+
        '<p class="gc-lead">Une croissance durable demande un <strong>moteur qui croît à taux constant</strong>.</p>'+
        '<div class="gc-mechanism"><h2>Un mécanisme proportionnel</h2>'+
          '<div class="gc-main-equation">'+m(dot('X')+' = <span class="gc-coefficient">c</span>X')+'</div>'+
          '<p>Si '+m('c')+' est constant, '+m('X')+' croît au taux '+m('c')+'.</p></div>'+
      '</div>'+
      '<div class="gc-catalogue" data-step="1">'+
        '<table class="gc-models" aria-label="Six modèles de croissance : moteur et loi d’évolution"><thead><tr><th scope="col">Modèle</th><th scope="col">Moteur</th><th scope="col">Loi</th></tr></thead><tbody>'+
          models.map(([name,explanation,engine,equation,cls])=>'<tr class="'+cls+'"><th scope="row"><strong>'+name+'</strong><span class="gc-model-description">'+explanation+'</span></th><td class="gc-engine">'+m(engine)+'</td><td>'+equation+'</td></tr>').join('')+
        '</tbody></table>'+
        '<p class="gc-conventions">Formes simplifiées, sans dépréciation. '+m('u')+' : effort de formation ; '+m('z')+' : efficacité de la recherche.</p>'+
      '</div></div>',
    source:'Adapté de <a href="https://web.stanford.edu/~chadj/GrowthandIdeas.pdf" target="_blank" rel="noopener">Chad Jones, Growth and Ideas (2015), p. 4–5 et 10–11</a>.',
    notes:'<p>Simplification demandée par Arnaud le 16 novembre 2026 : nouveau titre, six modèles conservés, une seule formule par modèle et une colonne « moteur ». Retirés de l’écran et gardés ci-dessous : ẏ/y = g, g = γ/(1−α), R = zL_R, la loi de recherche de Jones et ses conditions, la phrase finale et les conventions A = 1, n = 0. Romer est écrit comme sur l’écran des idées, Ȧ = zL_R A. Jones garde la loi de population de la capture, L̇ = nL : le moteur est la croissance du nombre de chercheurs. Solow avec capital seul est le contre-exemple, grisé : sa loi n’est pas proportionnelle et la croissance s’arrête. Lien avec l’écran précédent : K est de la matière, h et A du savoir. Les paragraphes suivants décrivent la version du 15 novembre et restent valables pour les démonstrations.</p><p>Demande confirmée du 15 novembre : réunir les deux diapositives de Jones en une conclusion. Le principe apparaît à gauche dès l’entrée ; le catalogue entier au premier clic. Lecture et impression : état complet. La présentation reprend les encadrés et la typographie des écrans PGF révisés par Claude. Captures, empreintes, proposition et démonstrations : sources/chad_jones_conclusion_2026-11-15/README.md. La version exacte des captures reste inconnue ; Growth and Ideas (14 octobre 2015), p. 4–5, présente les mêmes équations avec le libellé Extension of Romer pour la dernière ligne. γ remplace le g barré de Jones et les indices temporels sont retirés.</p>'+
      '<p>Principe : y = Y/L est la production par travailleur. Le taux g concerne le sentier équilibré, pas toute transition. Avec c constant, X croît exponentiellement ; la croissance est positive seulement si c est positif. c n’est pas nécessairement le taux g de y. Les six lignes sont des modèles distincts, pas un système commun.</p>'+
      '<p>Solow, capital seul : A = 1, n = δ = 0, s positif, 0 &lt; α &lt; 1. k̇/k = sk^(α−1) tend vers zéro, mais k peut croître sans borne sans dépréciation. Ne pas confondre limite du taux et niveau stationnaire fini. Le modèle du cours avec δ positif et A,L fixes converge vers k*. Solow avec progrès technique : sous Y = AK^αL^(1−α), A est la PGF multiplicative et g = γ/(1−α) à long terme. Ce rappel ajouté est celui du cours.</p>'+
      '<p>AK : Y = AK, dépréciation omise, A et s constants ; g_K = sA. Le taux par travailleur exige de préciser la croissance de L. Lucas : u est l’effort de formation, efficacité normalisée ; la seule loi de h ne détermine pas le taux de y.</p>'+
      '<p>Romer / Aghion–Howitt : R représente ici la recherche efficace. R = z L_R relie la formule de Jones à Ȧ/A = z L_R, introduite sur s3-croissance-endogene dans la révision de Claude. Cette forme réduite ne remplace pas le modèle stochastique complet d’Aghion–Howitt : variété et qualité restent deux mécanismes distincts.</p>'+
      '<p>Jones : Ȧ = η R A^φ, η positif, φ &lt; 1. Dans cette ligne R est le nombre de chercheurs, proportionnel à L à part de recherche constante ; η est leur efficacité (notée z dans les notes PGF). Les normalisations de R diffèrent entre ces deux modèles. φ mesure l’effet du stock de connaissances sur la production de nouvelles idées ; les gains proportionnels deviennent plus difficiles quand A augmente. Avec n positif, g_A = n/(1−φ) sur le sentier équilibré. Sous la fonction de production du cours et une part d’emploi en production constante, g_y = n/[(1−φ)(1−α)]. La loi de recherche complète la seule équation de population de la capture ; les résultats de taux restent dans les notes pour alléger la projection. Vérification : Growth and Ideas, p. 10–11, adapté aux notations du cours.</p>'+
      '<p>Lien oral avec le chapitre : identifier un moteur de croissance ne prouve pas sa compatibilité avec toutes les contraintes matérielles et environnementales. L’exemple de l’insuline précède cette synthèse.</p>'
  });
  G.add({
    id:'conclusion-synthese',part:'Conclusion',title:'Croître dans un monde fini ? Les conclusions',cls:'gc-summary',
    html:'<ol class="gc-summary-list">'+
      '<li><strong>Oui, en principe :</strong> les idées permettent de créer davantage de valeur sans utiliser toujours plus de matière.</li>'+
      '<li data-step="1"><strong>Un cadre théorique simple et puissant, le modèle de Solow :</strong> accumuler du capital ne suffit pas ; le progrès technique soutient la croissance durable du niveau de vie.</li>'+
      '<li data-step="2"><strong>Décomposer la croissance, l’importance de la PGF :</strong> capital physique, capital humain et PGF décomposent les écarts de richesse ; la PGF reste un résidu.</li>'+
      '<li data-step="3"><strong>Ce qu’il y a dans la PGF :</strong> idées, éducation, recherche et développement, automatisation, qualité des institutions, management et allocation des facteurs.</li>'+
      '<li data-step="4"><strong>IA :</strong> elle peut accélérer production et innovation ; les rendements décroissants et les maillons faibles limitent les gains.</li>'+
      '</ol>',
    source:'',
    notes:'<p>Conclusion en cinq points proposée puis validée par Arnaud le 16 novembre 2026. Elle suit immédiatement la synthèse des moteurs et clôt le parcours principal avant les annexes. La réponse à la question du chapitre est visible dès l’entrée ; les quatre parties apparaissent ensuite une par clic. Lecture et impression : les cinq points sont visibles.</p><p>« Oui, en principe » exprime une possibilité conditionnelle, pas la preuve d’un découplage matériel global observé ni l’absence de contraintes physiques. Dans Solow, la croissance durable du niveau de vie dépend du progrès technique. La comptabilité décompose les écarts sans identifier à elle seule leurs causes ; la PGF résiduelle ne mesure pas uniquement les idées. Les sept sujets du quatrième point reprennent la liste de la section 3 : les compétences mesurées appartiennent à h, l’éducation peut aussi faciliter l’adoption ; la R&amp;D crée des idées, ses dépenses ne sont pas la PGF ; davantage de robots ne prouve pas à lui seul une hausse de A. L’effet de l’IA dépend des rendements et des complémentarités étudiés dans la section 4.</p>'
  });
})();
