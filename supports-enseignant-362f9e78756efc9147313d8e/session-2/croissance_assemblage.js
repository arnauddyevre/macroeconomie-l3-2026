/* Assemblage du parcours réalisé. Les sections 2 et 4 restent dans le plan de travail. */
(function(){
  'use strict';
  window.COURSE={title:'2. Croître à l’infini dans un monde fini ?',chapter:'Croissance',author:'Arnaud Dyèvre'};
  window.SLIDES=G2.slides;
  window.SLIDES_ENSEIGNANT=[];
  window.NOTES=Object.fromEntries(SLIDES.map(s=>[s.id,s.notes||'']));
  window.CH02_REALISATION={date:'2026-11-09',sections:['Introduction','Solow','Qu’y a-t-il dans la PGF ?'],planned:81,implemented:52};
  if(SLIDES.length!==52)throw new Error(`Le parcours doit contenir 52 écrans, reçu : ${SLIDES.length}`);
})();
