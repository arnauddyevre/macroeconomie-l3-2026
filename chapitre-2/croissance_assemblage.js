
(function(){
  'use strict';


  const debut=G2.slides.findIndex(s=>s.id==='s1-taux');
  const fin=G2.slides.findIndex(s=>s.id==='s1-bilan');
  if(debut<0||fin-debut!==16)throw new Error('Séquence de 17 annexes Solow introuvable');
  const annexes=G2.slides.splice(debut,fin-debut+1);
  annexes.forEach(s=>{s.appendix=true;s.part='Annexes';});
  G2.add({id:'annexes',title:'Annexes',part:'Annexes',layout:'section',appendix:true,
    html:'<div class="g-annexes-title"><h1>Annexes</h1></div>'});
  G2.slides.push(...annexes);
  window.COURSE={title:'2. Croître à l’infini dans un monde fini ?',chapter:'Croissance',author:'Arnaud Dyèvre'};
  window.SLIDES=G2.slides;



  if(SLIDES.length!==62)throw new Error(`Le parcours doit contenir 62 écrans, reçu : ${SLIDES.length}`);
})();
