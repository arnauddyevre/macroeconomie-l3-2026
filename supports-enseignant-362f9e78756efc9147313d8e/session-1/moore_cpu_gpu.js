/* Loi de Moore : tous les CPU/GPU renseignés dans la page Wikipédia fournie par Arnaud.
 * Source, extraction et MCO archivées dans sources/moore_wikipedia_2026-10-27/.
 * Ce module ne modifie ni les données ni la présentation de deux-siecles. */
(function () {
  'use strict';
  const CH=window.Charts, data=window.MOORE_CPU_GPU_DATA, id='moore-cpu-gpu';
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const count=value=>value>=1e12?`${CH.fmt(value/1e12,0)} billion`:value>=1e9?`${CH.fmt(value/1e9,0)} Md`:value>=1e6?`${CH.fmt(value/1e6,0)} M`:CH.fmt(value,0);
  const cpu=data.points.filter(p=>p.type==='CPU').length, gpu=data.points.filter(p=>p.type==='GPU').length;
  const years=data.points.map(p=>p.year), lo=Math.min(...years),hi=Math.max(...years);
  const fit=data.fit, fitted=year=>Math.exp(fit.a+fit.b*(year-fit.origin));
  const statement=`Ajustement commun : un doublement tous les ${CH.fmt(fit.doublingYears,2)} ans`;
  window.SLIDES.push({
    id,part:'Ouverture',title:'(Aparté) La loi de Moore : CPU et GPU',prov:'obs',exercise:true,
    html:`<figure class="rev-moore-full"><div class="rev-moore-meta"><span class="rev-moore-series"><i class="cpu"></i>CPU (${cpu})<i class="gpu"></i>GPU (${gpu})<i class="fit"></i>Droite d’ajustement commune</span><span>${lo}–${hi}</span></div><div id="moore-cpu-gpu-chart"></div><figcaption><strong>${statement}.</strong> Ajustement du logarithme du nombre de transistors sur l’année.</figcaption><p class="rev-moore-sample">CPU : tableau « Microprocessors », SoC et modules compris. Bornes et fourchettes représentées, hors ajustement ; valeurs manquantes exclues.</p></figure>`,
    source:`<a href="${esc(data.sourceUrl)}" target="_blank" rel="noopener noreferrer">Wikipédia, « Transistor count », tableaux Microprocessors et GPUs</a> · Relevé du 27 octobre 2026.`,
  });
  window.NOTES[id]=`<p>27 octobre 2026 : ajout demandé par Arnaud après deux-siecles. Source explicitement fournie : Wikipédia, Transistor count, révision ${esc(data.revision)}. Tous les processeurs des deux tableaux disposant d’une année et d’un nombre exploitable sont représentés, sans sélection de records ni moyenne annuelle. Les SoC, microcontrôleurs et modules restent classés dans le tableau d’origine. Les processeurs distincts aux mêmes coordonnées restent des observations distinctes ; les flèches du clavier permettent de les consulter. Apple A9 et ses deux variantes de fabrication constituent une seule observation.</p><p>Une seule droite commune est ajustée par MCO : ln(N) = a + b × (année − ${fit.origin}), poids identique par observation, n = ${fit.n}, a = ${fit.a}, b = ${fit.b}, R² = ${fit.r2}. Délai de doublement = ln(2)/b. Les bornes inférieures (+) sont représentées avec une flèche vers le haut ; les intervalles avec une barre verticale et leur centre géométrique. Ces valeurs non ponctuelles sont exclues de l’ajustement, comme les nombres manquants ou les sommes sans total connu. La droite est descriptive de ce catalogue hétérogène, pas une prévision ni une preuve d’une loi universelle. Le nombre de transistors n’est pas une mesure directe de performance ou de densité. La source Wikipédia n’a pas été vérifiée processeur par processeur ; ne pas présenter l’ensemble comme des mesures primaires certifiées. Provenance, exclusions et coefficients : sources/moore_wikipedia_2026-10-27/README.md.</p>`;
  window.NOTES[id]+='<p>28 octobre 2026 : Arnaud rattache cette illustration à l’exercice d’ouverture, après q-1820 et deux-siecles. Fond orange clair et label Exercice communs au bloc. Graphique, données et contenu conservés.</p>';
  let serial=0;
  function draw(ctx) {
    const box=window.PJ.zoom('moore-cpu-gpu-chart',1.2);
    box.classList.add('rev-moore-native');
    const animated=!(ctx.reading||ctx.print||window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const rows=data.points.slice().sort((a,b)=>a.year-b.year||a.type.localeCompare(b.type)||a.name.localeCompare(b.name));
    const top=Math.max(...rows.map(p=>p.high||p.count),fitted(hi));
    const ymax=10**Math.ceil(Math.log10(top*1.15));
    const ticks=[1e3,1e5,1e7,1e9,1e11,1e13].filter(x=>x<=ymax);
    const chart=CH.scatter(box,{
      height:box.clientHeight,animate:animated,
      aria:`Nombre de transistors par processeur, ${cpu} CPU et ${gpu} GPU, ${lo}–${hi}. Axe vertical logarithmique. ${statement}.`,
      x:{min:lo-1,max:hi+1,ticks:[1970,1980,1990,2000,2010,2020,hi]},
      y:{log:true,min:1000,max:ymax,ticks,format:count},
      yTitle:'Nombre de transistors · échelle logarithmique',xTitle:'Année d’introduction',
      margin:{l:115,r:35,t:52,b:66},radius:()=>4.5,opacity:.72,
      points:rows.map(p=>({...p,x:p.year,y:p.count,color:p.type==='CPU'?'#001F5F':'#B45309'})),tip:()=>''
    });
    const pointGroup=chart.svg.querySelector('circle[data-k]').parentNode;
    const fitLine=CH.el('path',{
      d:`M${chart.S.X(lo)},${chart.S.Y(fitted(lo))}L${chart.S.X(hi)},${chart.S.Y(fitted(hi))}`,
      class:'ch-line rev-moore-fit',stroke:'#536078','stroke-width':3,'stroke-dasharray':'9 6',fill:'none',
      'aria-label':'Droite MCO commune, ajustée sur les valeurs ponctuelles CPU et GPU'
    });
    chart.svg.insertBefore(fitLine,pointGroup);
    if(animated){
      const clipId=`moore-fit-${++serial}`;
      const clip=CH.el('clipPath',{id:clipId,clipPathUnits:'userSpaceOnUse'},chart.svg.querySelector('defs'));
      CH.el('rect',{x:0,y:0,width:chart.svg.getAttribute('width'),height:chart.svg.getAttribute('height'),class:'rev-correlation-reveal'},clip);
      fitLine.setAttribute('clip-path',`url(#${clipId})`);
    }
    const byKey=new Map(rows.map((p,i)=>[p.key,i]));
    chart.svg.querySelectorAll('circle[data-k]').forEach(circle=>{
      const p=rows[byKey.get(circle.dataset.k)];
      circle.classList.add(p.type==='GPU'?'rev-moore-gpu':'rev-moore-cpu');
      if(p.qualifier==='exact')return;
      const x=chart.S.X(p.year), color=p.type==='CPU'?'#001F5F':'#B45309';
      const g=CH.el('g',{'pointer-events':'none',class:'rev-moore-uncertain',stroke:color,'stroke-width':1.8,fill:'none'},pointGroup);
      if(p.qualifier==='range'){
        const y0=chart.S.Y(p.low),y1=chart.S.Y(p.high);
        CH.el('path',{d:`M${x},${y0}V${y1}M${x-5},${y0}H${x+5}M${x-5},${y1}H${x+5}`},g);
      }else{
        const y=chart.S.Y(p.count);
        CH.el('path',{d:`M${x},${y-5}V${y-19}M${x-4},${y-15}L${x},${y-19}L${x+4},${y-15}`},g);
      }
    });
    const readout=document.createElement('div');readout.className='ch-readout rev-moore-readout';readout.setAttribute('aria-live','polite');box.appendChild(readout);
    const marker=CH.el('circle',{r:9,fill:'none',stroke:'#000','stroke-width':2,opacity:0,'pointer-events':'none','aria-hidden':'true'},chart.svg);
    let current=0;
    function show(index){
      current=Math.max(0,Math.min(rows.length-1,index));const p=rows[current];
      marker.setAttribute('cx',chart.S.X(p.year));marker.setAttribute('cy',chart.S.Y(p.count));marker.setAttribute('opacity',1);
      const note=p.qualifier==='range'?'Fourchette : point au centre géométrique ; hors ajustement.':p.qualifier==='lower-bound'?'Borne inférieure ; hors ajustement.':'';
      readout.innerHTML=`<strong>${esc(p.name)}</strong><div>${esc(p.type)} · ${p.year} · ${esc(p.designer||'')}</div><div>${esc(p.countText)} transistors</div>${note?`<div class="rev-moore-detail">${note}</div>`:''}`;
      readout.classList.add('on');
    }
    function hide(){marker.setAttribute('opacity',0);readout.classList.remove('on');}
    chart.svg.querySelectorAll('circle[data-k]').forEach(circle=>{
      circle.addEventListener('pointerenter',()=>show(byKey.get(circle.dataset.k)));
      circle.addEventListener('pointerleave',()=>{if(document.activeElement!==box)hide();});
    });
    box.tabIndex=0;box.setAttribute('data-keys','');box.setAttribute('aria-label','CPU et GPU : survol ou flèches pour parcourir tous les processeurs, y compris les points superposés.');
    box.addEventListener('focus',()=>show(current));box.addEventListener('blur',hide);
    box.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Escape'].includes(event.key))return;
      event.preventDefault();event.stopPropagation();
      if(event.key==='Escape'){hide();box.blur();}
      else if(event.key==='Home')show(0);
      else if(event.key==='End')show(rows.length-1);
      else show(current+(['ArrowRight','ArrowUp'].includes(event.key)?1:-1));
    });
  }
  window.Deck.on(id,{enter(el,ctx){draw(ctx);}});
})();
