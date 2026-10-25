/* Graphiques natifs de la révision 2026.
 * Charger après revision.js et avant la construction du Deck.
 * Données et calculs : data/revision_data.js et scripts/graphiques.py ; aucune collecte.
 * Les légendes éditoriales, sources et notes des sept diapositives sont conservées.
 */
(function () {
  'use strict';
  const C = window.Charts, D = window.REVISION_DATA;
  const navy = '#001F5F', orange = '#B45309', grey = '#77818D';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = (v, n = 1) => C.fmt(v, n);
  const pct = v => num(v) + ' %';
  const activeAnimation = ctx => !(ctx.print || ctx.reading || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let serial = 0;

  function reveal(chart, ctx) {
    if (!activeAnimation(ctx)) return;
    chart.svg.querySelectorAll('.ch-line').forEach(path => {
      path.classList.remove('ch-anim');
      const id = 'macro-reveal-' + (++serial);
      const clip = C.el('clipPath', {id, clipPathUnits:'userSpaceOnUse'}, chart.svg.querySelector('defs'));
      C.el('rect', {x:0, y:0, width:chart.svg.getAttribute('width'), height:chart.svg.getAttribute('height'), class:'macro-reveal'}, clip);
      path.setAttribute('clip-path', `url(#${id})`);
    });
    chart.svg.querySelectorAll('.ch-bar').forEach(bar => {
      bar.classList.remove('anim-y', 'neg');
      bar.style.animationDelay = '0s';
      bar.style.transformOrigin = '50% ' + (bar.dataset.negative === 'true' ? '0%' : '100%');
      bar.classList.add('macro-grow');
    });
  }

  function legend(host, items) {
    const node = document.createElement('div');
    node.className = 'macro-legend';
    node.innerHTML = items.map(s => `<span><i class="${s.hatch ? 'hatched' : s.dash ? 'dashed' : ''}" style="--series:${s.color}"></i>${esc(s.name)}</span>`).join('');
    host.appendChild(node);
  }

  // Barres et groupes : mêmes infobulles et touches que Charts.line.
  function inspectGroups(host, chart, rows, fields, title, format, ctx) {
    if (ctx.print) return;
    const {svg, S, m} = chart;
    const W = Number(svg.getAttribute('width')), H = Number(svg.getAttribute('height'));
    const guide = C.el('line', {y1:m.t, y2:H-m.b, class:'ch-guide', opacity:0}, svg);
    const hit = C.el('rect', {x:m.l, y:m.t, width:W-m.l-m.r, height:H-m.t-m.b, class:'ch-hit'}, svg);
    const output = document.createElement('div');
    output.className = 'ch-readout'; output.setAttribute('aria-live', 'polite'); host.appendChild(output);
    let index = rows.length - 1;
    const show = i => {
      index = Math.max(0, Math.min(rows.length - 1, i));
      const r = rows[index], x = S.X(index + .5);
      guide.setAttribute('x1', x); guide.setAttribute('x2', x); guide.setAttribute('opacity', 1);
      output.innerHTML = `<b>${esc(title(r, index))}</b>` + fields.map(f => `<div><b style="color:${f.color}">${esc(f.name)}</b> ${esc(format(r[f.key]))}</div>`).join('');
      output.classList.add('on');
    };
    const hide = () => { output.classList.remove('on'); guide.setAttribute('opacity', 0); };
    hit.addEventListener('pointermove', e => {
      const rect = svg.getBoundingClientRect(), x = (e.clientX - rect.left) / rect.width * W;
      show(Math.floor((x - m.l) / (W - m.l - m.r) * rows.length));
    });
    hit.addEventListener('pointerleave', hide);
    host.tabIndex = 0; host.setAttribute('data-keys', '');
    host.setAttribute('aria-label', svg.getAttribute('aria-label') + '. Flèches gauche et droite : consulter les valeurs.');
    host.addEventListener('keydown', e => {
      if (['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
        e.preventDefault(); e.stopPropagation();
        show(e.key === 'Home' ? 0 : e.key === 'End' ? rows.length - 1 : index + (e.key === 'ArrowRight' ? 1 : -1));
      }
      if (e.key === 'Escape') { e.stopPropagation(); hide(); host.blur(); }
    });
    host.addEventListener('blur', hide);
  }

  function install(id, metadata, render, options = {}) {
    const slide = window.SLIDES.find(s => s.id === id);
    if (!slide) throw new Error('Diapositive absente : ' + id);
    const caption = (slide.html.match(/<figcaption>([\s\S]*?)<\/figcaption>/) || [,''])[1];
    slide.cls = [slide.cls, 'macro-dynamic-slide', options.cls || ''].filter(Boolean).join(' ');
    slide.html = `<figure class="macro-figure"><p class="macro-metadata">${metadata}</p><div class="macro-chart-area"></div><figcaption>${caption}</figcaption></figure>`;
    const draw = (element, ctx = {}) => {
      const target = element.querySelector('.macro-chart-area');
      if (!target) return;
      target.innerHTML = '';
      render(target, ctx);
    };
    window.Deck.on(id, {enter(el, ctx) { draw(el, ctx || {}); }});
    window.addEventListener('beforeprint', () => { const el = window.Deck.slideEl(id); if (el) draw(el, {print:true}); });
    window.addEventListener('afterprint', () => { const el = window.Deck.slideEl(id); if (el) draw(el, {reading:document.body.classList.contains('reading')}); });
  }

  function chartBox(host, height = 442, zoom = 1.2) {
    const outer = document.createElement('div'); outer.className = 'macro-native'; outer.style.height = height + 'px'; host.appendChild(outer);
    return window.PJ.zoom(outer, zoom);
  }

  function lines(host, ctx, config, height = 476, zoom = 1.2) {
    const box = chartBox(host, height, zoom);
    const chart = C.line(box, {height:box.clientHeight, animate:activeAnimation(ctx), duration:2, stagger:0, hover:!ctx.print, legend:false, ends:true, ...config});
    reveal(chart, ctx);
    return {box, chart};
  }

  install('ai-investissement', 'États-Unis · 2015 T1–2026 T1 · dépenses annualisées · Epoch AI, 5 juin 2026', (host, ctx) => {
    const rows = D.epoch.rows;
    lines(host, ctx, {
      aria:'Dépenses d’infrastructure informatique et estimation de la composante IA, en pourcentage du PIB nominal américain',
      yTitle:'Part du PIB nominal américain (%)', y:{min:0, digits:1},
      x:{min:0, max:rows.length-1, ticks:[0,8,16,24,32,40,44], format:i=>rows[i].date.slice(0,4), hoverFormat:i=>rows[i].date.slice(0,4)+' T'+(Math.floor((Number(rows[i].date.slice(5,7))-1)/3)+1)},
      series:[
        {name:'Matériel, centres de données et réseaux', endLabel:'Infrastructure informatique', color:navy, dash:false, data:rows.map((r,i)=>[i,r.total]), gaps:1.5, format:v=>num(v,2)+' %'},
        {name:'Part attribuée à l’IA par Epoch (estimation)', endLabel:'Part attribuée à l’IA', color:orange, dash:'9 6', data:rows.map((r,i)=>[i,r.aiProxy]), gaps:1.5, format:v=>num(v,2)+' %'}
      ]
    });
  });

  install('ons-productivite', 'Royaume-Uni · 1997–2024 · productivité horaire · ONS, septembre 2026', (host, ctx) => {
    const rows = D.ons.rows;
    lines(host, ctx, {
      aria:'Productivité horaire britannique, ancienne approche et approche par composantes, de 1997 à 2024',
      yTitle:'Indice, moyenne 1997–2007 = 100', y:{min:85, max:140, ticks:[90,100,110,120,130,140]},
      x:{min:1997, max:2024, ticks:[1997,2002,2007,2012,2017,2024]},
      series:[
        {name:'Ancienne approche', endLabel:'Ancienne approche', color:navy, dash:false, data:rows.map(r=>[r.year,r.old]), gaps:1.5, format:v=>num(v)},
        {name:'Approche par composantes', endLabel:'Par composantes', color:orange, dash:'9 6', data:rows.map(r=>[r.year,r.component]), gaps:1.5, format:v=>num(v)}
      ]
    });
  });

  install('chine-etats-unis', 'PIB total, 2025 · WDI, données collectées le 22 octobre 2026', (host, ctx) => {
    host.classList.add('macro-panels');
    const rows = D.wdi.comparison, max = Math.max(...rows.flatMap(r=>[r.market,r.ppp])) / 1e12 * 1.2;
    [['market','Au taux de change du marché','Milliers de milliards de dollars US courants'],['ppp','En parité de pouvoir d’achat','Milliers de milliards de dollars internationaux courants']].forEach(([key,title,unit]) => {
      const panel = document.createElement('div'); panel.className = 'macro-panel'; host.appendChild(panel);
      const heading = document.createElement('h3'); heading.textContent = title; panel.appendChild(heading);
      const box = chartBox(panel, 397, 1.15);
      const data = rows.map(r=>({label:r.code==='CHN'?'Chine':'États-Unis', value:r[key]/1e12, color:r.code==='CHN'?orange:navy}));
      const chart = C.bars(box, {height:box.clientHeight, animate:activeAnimation(ctx), aria:`${title}, PIB de la Chine et des États-Unis en 2025`, y:{min:0,max,ticks:[0,10,20,30,40]}, yTitle:'Milliers de milliards', data, digits:1, gap:.52});
      reveal(chart, ctx);
      inspectGroups(box, chart, rows, [{key,name:'PIB total',color:navy}], r=>r.code==='CHN'?'Chine · 2025':'États-Unis · 2025', v=>num(v/1e12,2)+' milliers de milliards', ctx);
      const note = document.createElement('p'); note.className = 'macro-unit'; note.textContent = unit; panel.appendChild(note);
    });
  });

  install('redistribution-elargie', 'France · 2023 · moyennes par dixième de niveau de vie usuel · Insee, IA118, figure 1c, avril 2026', (host, ctx) => {
    const rows = D.insee.rows;
    const fields = [{key:'before',name:'Avant transferts publics',color:navy},{key:'after',name:'Après transferts publics',color:orange}];
    const box = chartBox(host, 430);
    const chart = C.grouped(box, {height:box.clientHeight, animate:activeAnimation(ctx), legend:false, aria:'Revenu moyen avant et après transferts publics par dixième, France 2023',
      categories:rows.map(r=>r.decile), yTitle:'Milliers d’euros par unité de consommation', y:{min:0,max:170,ticks:[0,40,80,120,160]}, digits:1,
      series:fields.map(f=>({name:f.name,color:f.color,values:rows.map(r=>r[f.key]/1000)}))});
    reveal(chart, ctx);
    inspectGroups(box, chart, rows, fields, r=>r.decile+' · France, 2023', v=>num(v,0)+' € par UC', ctx);
    legend(host, fields);
    const note = document.createElement('p'); note.className = 'macro-axis-note'; note.textContent = 'Dixièmes de niveau de vie usuel, du plus modeste au plus aisé · avant imputation du déficit public'; host.appendChild(note);
  });

  install('ai-croissance', 'États-Unis · 2022 T1–2026 T1 · Federal Reserve, figure 7, juillet 2026', (host, ctx) => {
    const rows = D.fed.rows;
    const fields = [{key:'investment',name:'Investissement des catégories retenues',color:navy},{key:'netExports',name:'Échanges de matériel',color:orange},{key:'net',name:'Somme des deux contributions',color:'#000000'}];
    const values = rows.flatMap(r=>[r.investment,r.netExports,r.net]), ticks = C.niceTicks(Math.min(0,...values),Math.max(...values)*1.15);
    const box = chartBox(host, 436);
    const chart = C.grouped(box, {height:box.clientHeight, animate:activeAnimation(ctx), legend:false, valueLabels:false,
      aria:'Contributions de catégories associées au développement de l’IA à la croissance réelle américaine',
      categories:rows.map((r,i)=>i%2===0?r.period.replace(':Q',' T'):''), yTitle:'Points de croissance trimestrielle annualisée', y:{min:ticks[0],max:ticks[ticks.length-1],ticks,digits:1},
      series:fields.slice(0,2).map(f=>({name:f.name,color:f.color,values:rows.map(r=>r[f.key])}))});
    chart.svg.querySelectorAll('.ch-bar').forEach((bar,i)=>{ bar.dataset.negative = String(rows[Math.floor(i/2)][i%2?'netExports':'investment']<0); });
    const points = rows.map((r,i)=>[chart.S.X(i+.5),chart.S.Y(r.net)]);
    C.el('path', {d:points.map((p,i)=>(i?'L':'M')+p.join(',')).join(' '), class:'ch-line', stroke:'#000000', 'stroke-width':2.5}, chart.svg);
    points.forEach(p=>C.el('circle',{cx:p[0],cy:p[1],r:3.5,fill:'#000000'},chart.svg));
    reveal(chart, ctx);
    inspectGroups(box, chart, rows, fields, r=>r.period.replace(':Q',' T'), v=>num(v,2)+' point', ctx);
    legend(host, fields);
    const note = document.createElement('p'); note.className = 'macro-axis-note'; note.textContent = 'Catégories : logiciels, centres de données, installations électriques et matériel informatique.'; host.appendChild(note);
  });

  install('transferts-nature', 'France · 2023 · mêmes dixièmes de niveau de vie usuel · Insee, IA118, figure 1c', (host, ctx) => {
    const rows = D.insee.rows;
    const fields = [{key:'taxes',name:'Prélèvements',color:navy},{key:'cash',name:'Prestations en espèces',color:orange},{key:'inKind',name:'Transferts non monétaires',color:grey,hatch:true}];
    const box = chartBox(host, 430), {svg,Wd,Ht,arrow} = C.frame(box, {height:box.clientHeight,aria:'Prélèvements, prestations en espèces et transferts non monétaires par dixième, France 2023'});
    const min = Math.floor(Math.min(...rows.map(r=>r.taxes))/20000)*20;
    const max = Math.ceil(Math.max(...rows.map(r=>r.cash+r.inKind))/20000)*20;
    const m = {l:70,r:30,t:62,b:45}, X = v=>m.l+v/rows.length*(Wd-m.l-m.r), Y = v=>Ht-m.b-(v-min)/(max-min)*(Ht-m.t-m.b);
    const zero = Y(0);
    C.el('line',{x1:m.l,y1:zero,x2:Wd-m.r+20,y2:zero,class:'ch-axis','marker-end':arrow},svg);
    C.el('line',{x1:m.l,y1:Ht-m.b,x2:m.l,y2:m.t-22,class:'ch-axis','marker-end':arrow},svg);
    C.niceTicks(min,max,6).filter(v=>v>=min&&v<=max).forEach(v=>{
      C.el('line',{x1:m.l-7,x2:m.l,y1:Y(v),y2:Y(v),class:'ch-tickmark'},svg);
      C.txt(svg,m.l-13,Y(v)+6.5,num(v,0),'ch-tick ch-num',{'text-anchor':'end'});
    });
    C.txt(svg,m.l-10,m.t-34,'Milliers d’euros par unité de consommation','ch-ytitle');
    const patternId = 'macro-hatch-' + (++serial);
    const pattern = C.el('pattern',{id:patternId,width:8,height:8,patternUnits:'userSpaceOnUse'},svg.querySelector('defs'));
    C.el('rect',{width:8,height:8,fill:'#E1E5EA'},pattern);
    C.el('path',{d:'M-2,2 L2,-2 M0,8 L8,0 M6,10 L10,6',stroke:grey,'stroke-width':1.2},pattern);
    rows.forEach((r,i)=>{
      const width = (Wd-m.l-m.r)/rows.length*.56, x = X(i+.5)-width/2;
      [[0,r.taxes/1000,navy],[0,r.cash/1000,orange],[r.cash/1000,(r.cash+r.inKind)/1000,`url(#${patternId})`]].forEach(([a,b,fill])=>{
        C.el('rect',{x,y:Math.min(Y(a),Y(b)),width,height:Math.abs(Y(b)-Y(a)),fill,class:'ch-bar','data-negative':b<a},svg);
      });
      C.txt(svg,X(i+.5),Ht-m.b+30,r.decile,'ch-tick',{'text-anchor':'middle'});
    });
    const chart = {svg,S:{X,Y},m}; reveal(chart,ctx);
    inspectGroups(box, chart, rows, fields, r=>r.decile+' · France, 2023', v=>num(v,0)+' € par UC',ctx);
    legend(host, fields);
    const note = document.createElement('p'); note.className = 'macro-axis-note'; note.textContent = 'Les retraites sont des prestations en espèces ; les services publics ne sont pas du cash.'; host.appendChild(note);
  });

  install('prix-americains', 'États-Unis · janvier 2002–septembre 2026 · CPI-U non désaisonnalisé · BLS, extraction du 22 octobre 2026', (host, ctx) => {
    const series = D.bls.series, rows = series[0].rows;
    const short = ['Ensemble','Hôpitaux','Frais universitaires','Manuels universitaires','Services médicaux','Garderie / préscolaire','Alimentation','Logement','Voitures neuves','Équipement domestique','Habillement','Téléphonie mobile','Logiciels et accessoires','Jouets','Téléviseurs'];
    const {box,chart} = lines(host, ctx, {
      aria:'Évolution de quinze indices de prix américains, variation cumulée depuis janvier 2002, données mensuelles jusqu’à septembre 2026',
      yTitle:'Variation cumulée depuis janvier 2002 (%)', y:{min:-100,max:300,ticks:[-100,0,100,200,300]},
      x:{min:0,max:rows.length-1,ticks:[0,60,120,180,240,rows.length-1],format:i=>rows[i].date.slice(0,4),hoverFormat:i=>new Date(rows[i].date+'-01T00:00:00Z').toLocaleDateString('fr-FR',{month:'long',year:'numeric',timeZone:'UTC'})},
      labelGap:22, margin:{t:55,b:42}, refLines:[{y:0,color:'#AAAAAA',dash:'3 6'}],
      series:series.map((s,i)=>({name:s.label,endLabel:short[i],color:i===0?'#000000':[1,2,3,4,5,7].includes(i)?orange:navy,dash:[false,'9 5','2 4','10 4 2 4'][i%4],
        data:s.rows.map((r,j)=>[j,r.change]),gaps:1.5,format:pct,width:i===0?3.2:1.8}))
    }, 476, 1.1);
    box.classList.add('macro-bls-native');
    chart.svg.querySelectorAll('.ch-line').forEach((path,i)=>{ if(i!==0)path.setAttribute('opacity','.72'); });
    const note = document.createElement('p'); note.className = 'macro-axis-note'; note.textContent = 'Quinze séries intégrales ; mois manquants non interpolés. Manuels : historique discontinu ; qualité ajustée par le BLS.'; host.appendChild(note);
  }, {cls:'macro-prices'});
})();
