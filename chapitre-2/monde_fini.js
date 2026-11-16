
(function(){
  'use strict';
  const G=window.G2;
  if(!G)throw new Error('Composants du chapitre 2 absents');
  const m=html=>`<span class="g-math">${html}</span>`;
  const link=(url,label)=>`<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
  const terme=(famille,symbole,nom)=>`<span class="mf-terme ${famille}"><span class="mf-symbole">${symbole}</span><span class="mf-nom">${nom}</span></span>`;
  G.add({
    id:'s3-monde-fini',part:G.titles[2],cls:'pgf-slide mf-slide',title:'Alors, peut-on croître à l’infini dans un monde fini ?',
    html:`
      <p class="mf-intro">Introduisons les matières premières (${m('P')}) dans la fonction de production, pour répondre à cette question.</p>
      <div class="mf-formule" role="img" aria-label="Y égale A, fois K puissance alpha, fois P puissance bêta, fois h L puissance un moins alpha moins bêta. P désigne les matières premières.">
        ${terme('','Y','production')}
        <span class="mf-egal">=</span>
        ${terme('mf-savoir','A','PGF')}
        ${terme('mf-matiere','K<sup>α</sup>','capital')}
        ${terme('mf-matiere','P<sup>β</sup>','matières premières')}
        ${terme('','(<span class="mf-h">h</span>L)<sup>1−α−β</sup>','<span class="mf-h-nom">capital humain</span> et travail')}
      </div>
      <p class="mf-cle"><span class="mf-cle-matiere">${m('K')}, ${m('P')} : de la matière, des atomes</span><span class="mf-cle-savoir">${m('h')}, ${m('A')} : du savoir, des octets</span></p>
      <div class="mf-reponses">
        <div class="pgf-card" data-step="1">
          <h3><span class="mf-mot">Non</span>, si la croissance vient de la matière</h3>
          <p>Plus de machines&nbsp;(${m('K')}), plus de matières premières&nbsp;(${m('P')}).</p>
          <p class="mf-fait">Monde, 2000–2022 : de 9,0 à 13,8 tonnes de matières premières par habitant.</p>
        </div>
        <div class="pgf-card pgf-card-accent" data-step="2">
          <h3><span class="mf-mot">Oui</span>, si elle vient du savoir</h3>
          <p>Des travailleurs mieux formés&nbsp;(${m('h')}), de meilleures recettes&nbsp;(${m('A')}).</p>
          <p class="mf-fait">France, 1950–2023 : deux tiers de la croissance de la production par travailleur viennent de ${m('h')} et de ${m('A')}.</p>
        </div>
      </div>
      <p class="mf-aphorisme" data-step="3">La croissance par la PGF mobilise plus d’<strong class="mf-octets">octets</strong>, pas nécessairement plus d’<strong class="mf-atomes">atomes</strong>.</p>`,
    source:`Matières premières : Programme des Nations unies pour l’environnement, via ${link('https://ourworldindata.org/grapher/material-footprint-per-capita','Our World in Data')}, indicateur 12.2.1 des objectifs de développement durable. Croissance : calculs d’après ${link('https://www.rug.nl/ggdc/productivity/pwt/','Penn World Table 11.0')}, α = 1/3.`
  });
})();
