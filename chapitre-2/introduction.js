
(function(){
  'use strict';
  const G=G2,D=G.DATA,f=G.f,eq=G.eq,fmt=G.fmt,part='Introduction';
  const maddison='<a href="https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023" target="_blank" rel="noopener">Maddison Project Database 2023</a>';
  const anthropic='<a href="https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf" target="_blank" rel="noopener">Korinek, Jones, Sacher, Cotter et McCrory (2026), Economic Scenarios for Transformative AI, tableau 3</a>';
  G.add({id:'croissance-couverture',part,layout:'cover',cls:'g-cover',title:'2. Croître à l’infini dans un monde fini ?',html:`<div class="slide-body"><p class="cover-label">Macroéconomie L3</p><div class="g-cover-heading"><h1>2. Croître à l’infini dans un monde fini ?</h1><p class="g-cover-subtitle">Comprendre la croissance économique de long terme</p></div><p class="cover-author">Arnaud Dyèvre, HEC Paris</p><p class="cover-term">Automne 2026</p></div>`});
  G.add({    id: 'croissance-monde-fini', part, title: 'Une croissance infinie dans un monde fini ?',
    html: `<div class="citations-grid">
      <article class="citation-col" aria-label="Kenneth E. Boulding">
        <figure>
          <img src="assets/215be236d2dba359.jpg" width="227" height="300" alt="Portrait de Kenneth E. Boulding">
          <figcaption><a href="https://en.wikipedia.org/wiki/File:Kenneth_E._Boulding.jpg" target="_blank" rel="noopener">University of Michigan, via Wikipédia : photographe inconnu</a></figcaption>
        </figure>
        <blockquote>« Celui qui croit qu’une croissance exponentielle peut continuer indéfiniment dans un monde fini est soit un fou, soit un économiste. »</blockquote>
        <p class="citation-attribution"><strong>Kenneth E. Boulding (1910–1993)</strong><span class="citation-role">Économiste et philosophe</span><span class="citation-context">Cité dans <em>Jump the Curve</em>, Jack Uldrich, 2008</span></p>
      </article>
      <article class="citation-col rapport-col" aria-label="The Limits to Growth, rapport au Club de Rome, 1972">
        <figure>
          <img src="assets/6b0c909097e1c57f.png" alt="Couverture de The Limits to Growth, capture du rapport de 1972 fournie par Arnaud">
          <figcaption><a href="https://www.library.dartmouth.edu/digital/digital-collections/limits-growth" target="_blank" rel="noopener">Dartmouth Libraries : capture du rapport</a></figcaption>
        </figure>
        <p class="rapport-these"><b>Thèse :</b> à tendances inchangées, la croissance de la population et de la production matérielle se heurte aux ressources limitées et à la pollution. Une stabilisation peut éviter le dépassement suivi d’un déclin.</p>
        <p class="citation-attribution"><strong><em>The Limits to Growth</em> (1972)</strong><span class="citation-role">Rapport au Club de Rome</span></p>
      </article>
      <article class="citation-col" aria-label="Camille Étienne">
        <figure>
          <img src="assets/9f6383a706023be4.png" alt="Camille Étienne au micro de France Inter, capture de l’entretien fournie par Arnaud">
          <figcaption>France Inter : capture d’écran YouTube</figcaption>
        </figure>
        <blockquote>« Les chiffres parlent ; l’accumulation de ressources illimitées dans un monde aux ressources limitées, qui viennent de plus en plus à manquer, un enfant de quatre ans comprendrait qu’on ne peut pas rentrer un carré dans un cercle. »</blockquote>
        <p class="citation-attribution"><strong>Camille Étienne</strong><span class="citation-role">Militante écologiste</span><span class="citation-context">Matinale de France Inter, 14 février 2025</span></p>
      </article>
    </div>`,
    prov: null});
  const longRun=window.CH02_MADDISON_LONG_TERME.series;
  const orangeY='<span class="g-accent">Y</span>';
  G.add({id:'croissance-origines',part,title:'D’où vient la croissance du niveau de vie ?',prov:'obs',
    html:G.cols(`<p class="g-intro-rappel">Rappel : notre décomposition du PIB par habitant du chapitre précédent</p><div class="g-intro-identite">${f(orangeY,'N')} = ${f(orangeY,'H')} × ${f('H','L')} × ${f('L','N')}</div><div class="g-intro-labels"><div><b class="g-math">${orangeY}/H</b> Productivité horaire</div><div><b>H/L</b> Heures par personne en emploi</div><div><b>L/N</b> Emploi rapporté à la population</div></div><div class="g-intro-rates" data-step="2"><p>Croissance annuelle moyenne, 1820–2022</p>${longRun.map(item=>`<div><span style="color:${item.color}">${item.name}</span><strong>${fmt(item.growthPercent,2)} %</strong><span>doublement ≈ ${fmt(item.doublingYears,0)} ans</span></div>`).join('')}</div>`,
      `<div class="g-live-only" data-step="1"><h2>« Moore’s Law of Economics »</h2>${G.buttons('intro-vues',[['level','Niveaux'],['log','Échelle logarithmique']])}${G.chart('intro-us',400)}</div><div class="g-static-only"><h3>Niveaux</h3>${G.chart('intro-us-niveaux-statique',200)}<h3>Échelle logarithmique</h3>${G.chart('intro-us-log-statique',200)}</div>`)+`<aside class="g-panel orange g-intro-purpose" data-step="2">Le but de ce chapitre : expliquer d'où vient la croissance de <i>Y</i> et si elle peut continuer</aside>`,
    source:`Dollars internationaux de 2011 (PPA). Source : ${maddison}. Monde : années disponibles.`});
  function longRunChart(id,log,animate){
    const chart=G.line(id,{animate,duration:1.4,ends:false,labelGap:24,margin:{l:78,r:145,t:44,b:42},x:{min:1820,max:2022,ticks:[1820,1870,1920,1970,2022]},y:log?{log:true,min:500,max:100000,ticks:[1000,5000,20000,100000],format:v=>fmt(v,0)}:{min:0,max:65000,ticks:[0,20000,40000,60000],format:v=>fmt(v,0)},yTitle:'Dollars de 2011 par habitant',series:longRun.map(item=>({name:item.name,endLabel:item.name,color:item.color,data:item.data,format:v=>fmt(v,0)+' $'}))});
    if(!chart)return;
    if(chart.svg.querySelector('.g-axis-help'))return;
    const axisTitle=chart.svg.querySelector('.ch-ytitle');
    const tip=document.createElement('div');
    tip.id=id+'-axis-tip';tip.className='g-intro-axis-tip';tip.setAttribute('role','tooltip');tip.hidden=true;
    tip.innerHTML='PIB réel par habitant : 1820–2022<br>En logarithmes : tirets fins = droites d’ajustement.';
    chart.svg.parentNode.append(tip);
    axisTitle.setAttribute('tabindex','0');axisTitle.setAttribute('aria-describedby',tip.id);
    axisTitle.classList.add('g-axis-help');
    const showTip=()=>{tip.hidden=false;};
    const hideTip=()=>{tip.hidden=true;};
    axisTitle.addEventListener('pointerenter',showTip);
    axisTitle.addEventListener('pointerleave',()=>{if(document.activeElement!==axisTitle)hideTip();});
    axisTitle.addEventListener('focus',showTip);axisTitle.addEventListener('blur',hideTip);
    axisTitle.addEventListener('keydown',event=>{if(event.key==='Escape'&&!tip.hidden){hideTip();event.stopPropagation();}});
    if(!log)return;
    const firstLine=chart.svg.querySelector('.ch-line');
    const trends=Charts.el('g',{class:'g-intro-trends','aria-label':'Ajustements logarithmiques'},firstLine.parentNode);
    firstLine.parentNode.insertBefore(trends,firstLine);
    longRun.forEach(item=>Charts.el('path',{
      d:`M${chart.S.X(1820)},${chart.S.Y(Math.exp(item.fit.a))} L${chart.S.X(2022)},${chart.S.Y(Math.exp(item.fit.a+item.fit.b*202))}`,
      class:'g-intro-trend',stroke:item.color,'stroke-dasharray':'8 6','stroke-width':2.5,opacity:.6,fill:'none',
      'aria-label':`Ajustement de ${item.name}`,'data-slope':item.fit.b
    },trends));
  }
  G.on('croissance-origines',(el,ctx)=>{if(ctx.static){longRunChart('intro-us-niveaux-statique',false,false);longRunChart('intro-us-log-statique',true,false);return;}const mode=G.bindChoices(el,'intro-vues',ctx.step>=2?'log':'level',value=>longRunChart('intro-us',value==='log',false));longRunChart('intro-us',mode==='log',ctx.animate);});
  const growthCountries=window.CH02_CROISSANCE_PAYS.series;
  G.add({id:'croissance-rythmes',part,title:'Des rythmes de croissance très différents',prov:'obs',
    html:G.cols(`<h2>1960–2022</h2><p>Une différence de rythme se cumule au fil des décennies.</p><table class="g-table g-growth-countries"><thead><tr><th>Pays</th><th>Multiplication<br>du PIB par habitant</th><th data-step="1">Croissance<br>annuelle moyenne</th></tr></thead><tbody>${growthCountries.map(item=>`<tr style="color:${item.color}"><td>${item.name}</td><td><span class="g-math">× ${fmt(item.statistics.multiple,1)}</span></td><td data-step="1"><span class="g-math">${fmt(item.statistics.growthPercent,2)} %</span></td></tr>`).join('')}</tbody></table><p class="g-note" data-step="2">Repère : <span class="g-math">durée de doublement ≈ 70 ÷ taux annuel en %</span>.</p>`,G.chart('intro-coree-ghana',535)),
    source:`Dollars internationaux de 2011 (PPA), échelle logarithmique. Source : ${maddison}.`});
  G.on('croissance-rythmes',(el,ctx)=>{
    G.line('intro-coree-ghana',{animate:ctx.animate,ends:false,labelGap:27,margin:{l:76,r:155,t:62,b:48},x:{min:1960,max:2022,ticks:[1960,1980,2000,2022]},y:{log:true,min:500,max:50000,ticks:[500,1000,2000,5000,10000,20000,40000],format:v=>fmt(v,0)},yTitle:'PIB réel par habitant',series:growthCountries.map(item=>({name:item.name,endLabel:item.name,color:item.color,dash:item.dash,data:item.data,format:v=>fmt(v,0)+' $'}))});
  });
  G.add({id:'croissance-corees-espace',part,title:"La croissance de long terme, vue de l'espace",
    html:`<figure class="g-corees-espace"><img src="assets/265befe08124ba29.jpg" alt="Vue nocturne de la péninsule coréenne : éclairage dense en Corée du Sud et beaucoup plus rare en Corée du Nord, avec Pyongyang visible."><figcaption><a href="https://www.flickr.com/photos/gsfc/8249377151/in/photostream/" target="_blank" rel="noopener">NASA Earth Observatory : Jesse Allen et Robert Simmon, 24 septembre 2012</a>. <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a></figcaption></figure>`});
  G.add({id:'croissance-ia-intro',part,title:'L’IA pourrait-elle changer la pente ?',prov:'sim',
    html:`<p class="g-ia-heading">États-Unis : quatre scénarios, 2025–2030, modélisations des économistes d’Anthropic</p>${G.chart('intro-ia-croissance',590)}`,
    source:`<a href="https://www.anthropic.com/institute/econ-scenarios" target="_blank" rel="noopener">Anthropic : explorateur de scénarios</a>. ${anthropic.replace('tableau 3','figure 2')}.`});
  const iaDate=v=>Number.isInteger(v)?String(v):`${String(Math.round((v-Math.floor(v))*12)+1).padStart(2,'0')}/${Math.floor(v)}`;
  G.on('croissance-ia-intro',(el,ctx)=>{
    const chart=G.line('intro-ia-croissance',{
    animate:ctx.animate,duration:2.4,ends:false,labelGap:56,margin:{l:90,r:245,t:64,b:65},
    x:{min:2025,max:2030,ticks:[2025,2026,2027,2028,2029,2030],format:iaDate,hoverFormat:v=>`${iaDate(v)}<br>PIB en milliards de dollars de ${CH02_ANTHROPIC.monetary.priceYear}`},
    y:{min:100,max:150,ticks:[100,110,120,130,140,150],format:v=>fmt(v,0)},
    xTitle:'Année',yTitle:'Niveau du PIB (base 100 : status quo en 2025)',
    series:CH02_ANTHROPIC.series.map(item=>({name:item.name,endLabel:`${item.name} : ${fmt(item.data.at(-1)[1],1)}`,color:item.color,dash:item.dash,data:item.data,format:v=>`${fmt(v/100*CH02_ANTHROPIC.monetary.billionsPer100,0)} (indice ${fmt(v,2)})`}))
    });

    chart.svg.querySelectorAll('.ch-lab').forEach(label=>{
      if(label.querySelector('.g-ia-rate'))return;
      const item=CH02_ANTHROPIC.series.find(s=>label.textContent===`${s.name} : ${fmt(s.data.at(-1)[1],1)}`);
      if(!item)return;
      const rate=Charts.el('tspan',{x:label.getAttribute('x'),dy:25,class:'g-ia-rate'},label);
      rate.textContent=`${fmt(item.annualGrowth2030,1)} %/an en 2030`;
      const detail=Charts.el('title',{},label);
      detail.textContent=CH02_ANTHROPIC.annualGrowth.definition;
    });
  });
  G.add({id:'croissance-plan',part,title:'Les quatre questions du chapitre',html:G.plan()});
})();
