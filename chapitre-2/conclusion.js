
(function(){
  'use strict';
  const G=window.G2,m=html=>'<span class="g-math">'+html+'</span>',dot=G.dot,frac=G.f;
  G.add({
    id:'conclusion',part:'Conclusion',title:'Conclusion',layout:'section',cls:'gc-divider',
    html:'<h1>Conclusion</h1>'
  });

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
    source:'Adapté de <a href="https://web.stanford.edu/~chadj/GrowthandIdeas.pdf" target="_blank" rel="noopener">Chad Jones, Growth and Ideas (2015), p. 4–5 et 10–11</a>.'
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
    source:''
  });
})();
