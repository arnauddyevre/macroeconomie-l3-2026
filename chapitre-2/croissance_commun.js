
(function () {
  'use strict';
  const esc = x => String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const frac = (a,b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const titles = ['Modéliser la croissance de long terme : le modèle de Solow', 'Applications empiriques du modèle de Solow : comptabilité de la croissance', 'Qu’y a-t-il dans la PGF ?', 'L’impact de l’IA sur la croissance'];
  const renderers = new Map(), choices = new Map(), chartCache = new WeakMap();
  let renderContext=null, revealSerial=0;
  function chartMotion(box,record,options,restart) {
    const staticMode=renderContext?.static || G.printing || document.body.classList.contains('reading') || matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(staticMode){record.finish?.();record.pending=false;return;}
    const visible=box.getClientRects().length>0 && getComputedStyle(box).visibility!=='hidden';
    if(!visible){record.pending=true;return;}
    if(!(restart||record.pending) || options.animate===false)return;
    record.finish?.();record.pending=false;
    const {svg,S}=record.chart;
    const xs=options.series.flatMap(series=>series.data.filter(row=>row[1]!=null).map(row=>row[0]));
    const start=options.x?.min??Math.min(...xs),end=options.x?.max??Math.max(...xs);
    const left=S.X(start)-3,width=Math.max(6,S.X(end)-left+3);
    const clip=Charts.el('clipPath',{id:'g-chart-reveal-'+(++revealSerial),clipPathUnits:'userSpaceOnUse'},svg.querySelector('defs'));
    const rect=Charts.el('rect',{x:left,y:0,width:6,height:svg.getAttribute('height')},clip);
    let animation=null,paths=[],labels=[];
    const attach=()=>{
      paths=[...svg.querySelectorAll('.ch-line,.g-intro-trend')];
      labels=[...svg.querySelectorAll('.ch-lab')];
      paths.forEach(path=>path.setAttribute('clip-path',`url(#${clip.id})`));
      labels.forEach(label=>label.style.opacity='0');
    };
    attach();

    const frame=requestAnimationFrame(()=>{
      attach();
      animation=rect.animate([{width:'6px'},{width:width+'px'}],{duration:(options.duration||2.4)*1000,easing:'linear',fill:'forwards'});
      animation.onfinish=finish;
    });
    const finish=()=>{cancelAnimationFrame(frame);paths.forEach(path=>path.removeAttribute('clip-path'));labels.forEach(label=>label.style.removeProperty('opacity'));animation?.cancel();clip.remove();record.finish=null;};
    record.finish=finish;
  }


  const mathLabel=/(?<![\p{L}\p{N}])(?:(?:[AKLYNICHEswrbnxy]+[̃̇*]*|[αδγπ])(?:\s*[=×÷/+−<>→]\s*(?:[AKLYNICHEswrbnxy]+[̃̇*]*|[αδγπ]|\d+(?:[,.]\d+)?)(?:\s*%)?)*|\d+(?:[,.]\d+)?(?:\s*[×÷/+−→]\s*\d+(?:[,.]\d+)?)+(?:\s*%)?)(?![\p{L}\p{N}])/gu;
  function styleMathLabels(root) {
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
    for(let node=walker.nextNode();node;node=walker.nextNode())if(!node.parentElement.closest('.g-math,i,var'))nodes.push(node);
    nodes.forEach(node=>{
      const text=node.nodeValue,matches=[...text.matchAll(mathLabel)];if(!matches.length)return;
      const fragment=document.createDocumentFragment();let end=0;
      matches.forEach(match=>{fragment.append(document.createTextNode(text.slice(end,match.index)));const span=node.parentElement.namespaceURI==='http://www.w3.org/2000/svg'?document.createElementNS('http://www.w3.org/2000/svg','tspan'):document.createElement('span');span.setAttribute('class','g-math');span.textContent=match[0];fragment.append(span);end=match.index+match[0].length;});
      fragment.append(document.createTextNode(text.slice(end)));node.replaceWith(fragment);
    });
  }
  const G = window.G2 = {
    slides: [], DATA: window.CH02_DATA, titles, partTitles: titles, esc,
    add(s) { if (this.slides.some(x=>x.id===s.id)) throw new Error('Identifiant dupliqué : '+s.id); this.slides.push({part:titles[0],...s,cls:[s.cls||'', s.cls?.includes('g-exercise')?'exercise':''].join(' ')}); },
    f:frac, dot:x=>`<span class="g-dot">${x}</span>`,
    fmt:(x,d=1)=>Number(x).toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d}),
    eq:(html,step=0,cls='')=>`<div class="g-eq ${cls}"${step?` data-step="${step}"`:''}>${html}</div>`,
    list:items=>`<ul class="g-bullets">${items.map(it=>{const [html,step]=Array.isArray(it)?it:[it,0];return `<li${step?` data-step="${step}"`:''}>${html}</li>`;}).join('')}</ul>`,
    cols:(left,right)=>`<div class="g-two"><div class="g-col">${left}</div><div class="g-col">${right}</div></div>`,
    chart:(id,height=440)=>`<div id="${id}" class="g-chart chart" style="height:${height}px"></div>`,
    buttons:(id,items)=>`<div id="${id}" class="g-controls" role="group">${items.map(([v,label])=>`<button type="button" data-value="${esc(v)}">${label}</button>`).join('')}</div>`,
    bindChoices(el,id,defaultValue,callback) {
      const group=el.querySelector('#'+id); if(!group)return defaultValue;
      const selected=()=>choices.has(id)?choices.get(id):defaultValue;
      const sync=()=>group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===String(selected()))));
      group.querySelectorAll('button').forEach(b=>{b.onclick=()=>{choices.set(id,b.dataset.value);sync();callback(b.dataset.value);};});sync();return selected();
    },
    line(id,options) {
      const box=typeof id==='string'?document.getElementById(id):id;if(!box)return null;



      const {animate,duration,stagger,...content}=options;
      const key=JSON.stringify({width:box.clientWidth,height:box.clientHeight,content},
        (name,value)=>typeof value==='function'?value.toString():value);
      const previous=chartCache.get(box);
      if(previous?.key===key && box.contains(previous.chart.svg)){chartMotion(box,previous,options,!!renderContext?.entry);return previous.chart;}
      previous?.finish?.();
      previous?.observer.disconnect();
      box.replaceChildren();const inner=document.createElement('div');inner.className='chart g-chart-inner';
      inner.style.width='100%';inner.style.height='100%';box.append(inner);
      const res=Charts.line(inner,{height:box.clientHeight||440,legend:false,hover:true,...options,animate:false});
      styleMathLabels(inner);
      const observer=new MutationObserver(()=>{const readout=inner.querySelector('.ch-readout');if(readout&&!readout.querySelector('.g-math'))styleMathLabels(readout);});
      observer.observe(inner,{subtree:true,childList:true});
      const record={key,chart:res,observer,pending:false,finish:null};
      chartCache.set(box,record);
      chartMotion(box,record,options,true);
      inner.setAttribute('aria-label',options.yTitle||'Graphique interactif. Flèches pour consulter les valeurs.');
      return res;
    },
    on(id,draw) {
      renderers.set(id,draw);
      let entering=false;
      const run=(el,step,stat,animate,entry=false)=>{const previous=renderContext;renderContext={entry,static:stat};try{draw(el,{step:stat?99:step,static:stat,entry,animate:animate&&!stat&&!matchMedia('(prefers-reduced-motion: reduce)').matches});}finally{renderContext=previous;}};
      Deck.on(id,{
        enter(el,ctx){entering=true;run(el,ctx.step||0,!!(ctx.reading||ctx.print||document.body.classList.contains('reading')),!(ctx.reading||ctx.print),true);},
        step(el,n,o){if(entering&&o?.jump){entering=false;return;}entering=false;run(el,n,document.body.classList.contains('reading')||G.printing,!o?.jump);}
      });
    },
    renderStatic() {renderers.forEach((draw,id)=>{const el=Deck.slideEl(id);if(el)draw(el,{step:99,static:true,animate:false});});},
    renderCurrent() {const s=G.slides[Deck.index],el=s&&Deck.slideEl(s.id),draw=s&&renderers.get(s.id);if(el&&draw)draw(el,{step:Deck.step,static:false,animate:false});},
    plan:(active=-1)=>`<div class="plan g-plan">${titles.map((t,i)=>`<div class="plan-row ${i===active?'is-current':''}"><span class="n">${i+1}</span><span class="q">${t}</span></div>`).join('')}</div>`,
    printing:false
  };
  window.C={frac,n:G.fmt,def:(term,text,o={})=>`<div class="def ${o.cls||''}" data-term="${esc(term)}"><div class="def-label">Définition</div><div class="def-term">${term}</div><p class="def-text">${text}</p></div>`,s:(n,html)=>`<div data-step="${n}">${html}</div>`,link:(url,text)=>`<a href="${url}" target="_blank" rel="noopener">${text}</a>`};


  let wasReading=false;
  new MutationObserver(()=>{const reading=document.body.classList.contains('reading');if(reading===wasReading)return;wasReading=reading;requestAnimationFrame(()=>reading?G.renderStatic():G.renderCurrent());}).observe(document.body,{attributes:true,attributeFilter:['class']});
  window.addEventListener('beforeprint',()=>{G.printing=true;G.renderStatic();});
  window.addEventListener('afterprint',()=>{G.printing=false;document.body.classList.contains('reading')?G.renderStatic():G.renderCurrent();});
  document.addEventListener('deck:enter',e=>e.detail.el.querySelectorAll('.g-controls').forEach(styleMathLabels));
})();
