/* Assemblage du parcours réalisé. La section 2 commence par les écarts de niveaux ; sa suite et la section 4 restent à discuter. */
(function(){
  'use strict';
  // Décision du 9 novembre : réserver le développement général de Solow aux annexes.
  // Conserver le tableau partagé avec les moteurs de graphiques, ainsi que tous les contenus.
  const debut=G2.slides.findIndex(s=>s.id==='s1-taux');
  const fin=G2.slides.findIndex(s=>s.id==='s1-bilan');
  if(debut<0||fin-debut!==16)throw new Error('Séquence de 17 annexes Solow introuvable');
  const annexes=G2.slides.splice(debut,fin-debut+1);
  annexes.forEach(s=>{s.appendix=true;s.part='Annexes';});
  G2.add({id:'annexes',title:'Annexes',part:'Annexes',layout:'section',appendix:true,
    html:'<div class="g-annexes-title"><h1>Annexes</h1></div>',
    notes:'<p>Développement général de Solow, convergence conditionnelle et bilan, déplacés hors du parcours enseigné à la demande d’Arnaud le 9 novembre 2026. Les dix-sept diapositives sont conservées dans leur ordre initial.</p>'});
  G2.slides.push(...annexes);
  window.COURSE={title:'2. Croître à l’infini dans un monde fini ?',chapter:'Croissance',author:'Arnaud Dyèvre'};
  window.SLIDES=G2.slides;
  window.SLIDES_ENSEIGNANT=[];
  window.NOTES=Object.fromEntries(SLIDES.map(s=>[s.id,s.notes||'']));
  window.CH02_REALISATION={date:'2026-11-09',sections:['Introduction','Solow','Applications empiriques du modèle de Solow : comptabilité de la croissance','Qu’y a-t-il dans la PGF ?','Annexes'],implemented:62,main:44,appendix:18};
  if(SLIDES.length!==62)throw new Error(`Le parcours doit contenir 62 écrans, reçu : ${SLIDES.length}`);
})();
