/* Transition vers le chapitre 2 — 1er novembre 2026.
 * Même série Maddison et mêmes calculs que la vue logarithmique de deux-siecles.
 * Module indépendant : aucun changement de la diapositive d’ouverture ni de Charts. */
(function () {
  'use strict';
  const Charts = window.Charts;
  const maddison = window.DATA && window.DATA.maddison;
  const us = window.MADDISON_US_DATA && window.MADDISON_US_DATA.rows;
  if (!maddison || !us || !Charts) throw new Error('Données Maddison absentes pour la transition croissance.');
  const ID = 'transition-croissance';
  const pair = column => maddison.filter(row => row[column] != null).map(row => [row[0], row[column]]);
  const series = [
    {name:'France',color:'blue',dash:false,data:pair(1)},
    {name:'Monde',color:'slate',dash:true,data:pair(2)},
    {name:'États-Unis',color:'#B45309',dash:false,data:us.map(row => [row[0],row[1]])}
  ];
  const stats = series.map(item => {
    const rows = item.data.filter(([year,value]) => year >= 1820 && year <= 2022 && Number.isFinite(value) && value > 0);
    const n = rows.length;
    const meanX = rows.reduce((sum,[year]) => sum + year - 1820,0) / n;
    const meanY = rows.reduce((sum,[,value]) => sum + Math.log(value),0) / n;
    const b = rows.reduce((sum,[year,value]) => sum + (year-1820-meanX)*(Math.log(value)-meanY),0)
      / rows.reduce((sum,[year]) => sum + (year-1820-meanX)**2,0);
    const a = meanY - b * meanX;
    const cagr = 100 * (Math.pow(rows.at(-1)[1]/rows[0][1],1/(rows.at(-1)[0]-rows[0][0]))-1);
    return {name:item.name,color:Charts.PAL[item.color] || item.color,a,b,n,cagr};
  });
  const statFor = name => stats.find(item => item.name === name);

  window.SLIDES.push({
    id:ID,part:'Conclusion',title:'Au prochain chapitre : d’où vient la croissance ?',cls:'tc-slide',prov:'obs',
    html:`<div class="tc-layout">
      <div class="tc-left">
        <div class="tc-formula" aria-label="Y divisé par N"><span class="tc-numerator"><var>Y</var></span><span class="tc-slash" aria-hidden="true">/</span><var>N</var></div>
        <aside class="tc-bubble" data-step="1"><p>Qu’est-ce qui contribue à la croissance de <var>Y</var> sur le long terme ?</p><p>Et comment croître à l’infini dans un monde de ressources finies ?</p><p class="tc-next">Réponses au prochain chapitre.</p></aside>
        <p class="tc-definitions"><var>Y</var> : production réelle<br><var>N</var> : population</p>
      </div>
      <figure class="tc-figure">
        <div class="tc-chart-heading"><h3>Moore’s law of Economics</h3><p>PIB réel par habitant · 1820–2022<br>Dollars internationaux de 2011 (PPA) · échelle logarithmique</p></div>
        <div class="tc-chart" data-tc-chart></div>
        <figcaption><p class="tc-growth-heading">Croissance annuelle moyenne, 1820–2022</p><div class="tc-growth-rates">${['France','États-Unis','Monde'].map(name => {
          const item = statFor(name);
          return `<span style="color:${item.color}"><strong>${name}</strong> ${Charts.fmt(item.cagr,2)} %</span>`;
        }).join('')}</div><p class="tc-fit-caption">Traits fins en tirets : tendances ajustées sur les observations.</p></figcaption>
      </figure>
    </div>`,
    source:'<a href="https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023" target="_blank" rel="noopener noreferrer">Maddison Project Database 2023 (Bolt et van Zanden, 2024)</a> · Monde : moyenne pondérée, années disponibles seulement.'
  });
  window.NOTES[ID] = '<p>Ajout du 1er novembre 2026, à la demande d’Arnaud. Transition vers le chapitre suivant : Y/N est repris à gauche, Y est mis en évidence, puis la bulle apparaît au clic et pointe précisément vers Y. Le graphique de droite reprend indépendamment la vue logarithmique de deux-siecles : mêmes observations France, États-Unis et moyenne mondiale, même période 1820–2022, mêmes dollars internationaux de 2011 en PPA, mêmes tendances et mêmes taux annuels moyens. La diapositive d’ouverture et son gestionnaire restent inchangés.</p><p>Y désigne ici la production réelle, N la population. Le graphique représente Y/N, alors que la question de la bulle invite à étudier la croissance de Y et les ressources au chapitre suivant ; le rôle de la population doit donc rester distinct. Les questions ne supposent ni que la croissance future est acquise, ni que les ressources finies empêchent nécessairement toute croissance de la valeur produite.</p><p>Les trois tendances sont des régressions MCO de ln(PIB par habitant) sur l’année centrée en 1820, appliquées aux seules observations positives disponibles. France et États-Unis : 203 observations annuelles chacun ; monde : 21 dates irrégulières, poids identique de chaque observation dans sa régression. Aucune interpolation des données et aucune extrapolation au-delà de 2022. Les lignes reliant les points mondiaux sont un tracé graphique, pas des observations annuelles ajoutées. Les taux affichés sont les croissances annuelles composées entre 1820 et 2022 (202 ans), pas exp(pente MCO) − 1 : France 1,532655 %, États-Unis 1,539060 %, monde 1,342388 %. Les ajustements ne passent pas nécessairement par les deux extrémités observées.</p><p>Source : les données Maddison déjà embarquées dans le chapitre et data/maddison_us_data.js, documentées dans data/maddison_us_data.json. Tracé natif animé avec consultation au survol et au clavier ; lecture et impression montrent toute la bulle et le graphique complet. Aucun emprunt supplémentaire au master.</p>';

  let serial = 0;
  function positionPointer(element) {
    const symbol = element.querySelector('.tc-numerator');
    const bubble = element.querySelector('.tc-bubble');
    if (!symbol || !bubble) return;
    const symbolBox = symbol.getBoundingClientRect(), bubbleBox = bubble.getBoundingClientRect();
    const scale = bubble.offsetWidth ? bubbleBox.width / bubble.offsetWidth : 1;
    if (!(scale > 0)) return;
    bubble.style.setProperty('--tc-pointer-x',`${(symbolBox.left+symbolBox.width/2-bubbleBox.left)/scale}px`);
  }

  function draw(element, ctx = {}) {
    const host = element.querySelector('[data-tc-chart]');
    const box = window.PJ.zoom(host,1.12);
    const animate = !(ctx.reading || ctx.print || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const chart = Charts.line(box,{
      height:box.clientHeight,animate,duration:2,ends:true,starts:false,legend:false,hover:!ctx.print,
      aria:'PIB réel par habitant en dollars internationaux de 2011, France, États-Unis et monde, 1820–2022 ; échelle logarithmique.',
      x:{min:1820,max:2022,ticks:[1820,1870,1920,1970,2022]},
      y:{log:true,min:500,max:100000,ticks:[500,1000,2000,5000,10000,20000,50000,100000]},
      // Réserver la place aux graduations et aux noms agrandis, dans le SVG.
      margin:{l:82,r:188,t:28,b:49},labelGap:30,
      series:series.map(item => ({...item,endLabel:item.name,format:value => Charts.fmt(value,0)}))
    });
    const firstLine = chart.svg.querySelector('.ch-line');
    const trends = Charts.el('g',{class:'tc-trends','aria-label':'Tendances ajustées en logarithmes'},firstLine.parentNode);
    firstLine.parentNode.insertBefore(trends,firstLine);
    if (animate) {
      const clipId = 'tc-trend-reveal-' + (++serial);
      const clip = Charts.el('clipPath',{id:clipId,clipPathUnits:'userSpaceOnUse'},chart.svg.querySelector('defs'));
      Charts.el('rect',{x:0,y:0,width:chart.svg.getAttribute('width'),height:chart.svg.getAttribute('height'),class:'ch-dash-reveal',style:'animation-duration:2s'},clip);
      trends.setAttribute('clip-path',`url(#${clipId})`);
    }
    stats.forEach(item => Charts.el('path',{
      d:`M${chart.S.X(1820)},${chart.S.Y(Math.exp(item.a))} L${chart.S.X(2022)},${chart.S.Y(Math.exp(item.a+item.b*202))}`,
      class:'tc-trend',stroke:item.color,'stroke-dasharray':'8 6','stroke-width':2.5,opacity:.48,fill:'none',
      'aria-label':`Tendance de ${item.name}`,'data-series':item.name,'data-slope':item.b
    },trends));
    box.dataset.growthRates = JSON.stringify(stats);
    box.setAttribute('aria-label','France, États-Unis et monde, 1820–2022. Flèches gauche et droite : consulter les observations.');
    positionPointer(element);
  }

  window.Deck.on(ID,{enter:draw,step:positionPointer});
  window.addEventListener('resize',()=>{
    const element = window.Deck.slideEl(ID); if (element) positionPointer(element);
  });
  window.addEventListener('beforeprint',()=>{
    const element = window.Deck.slideEl(ID); if (element) draw(element,{print:true});
  });
  window.addEventListener('afterprint',()=>{
    const element = window.Deck.slideEl(ID);
    if (element && element.getBoundingClientRect().width > 0) draw(element,{reading:document.body.classList.contains('reading')});
  });
})();
