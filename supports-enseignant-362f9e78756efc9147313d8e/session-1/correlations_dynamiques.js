/* Huit corrélations : affichage natif des observations et coefficients archivés.
 * Charger après revision.js, avant integrerApportsMaster(). Aucune réestimation. */
(function () {
  'use strict';
  const CH = window.Charts;
  const keys = ['consumption','manufacturing','infant','life','aic','learning','happiness','freedom'];
  const highlighted = new Set(['FRA','CHN','USA','IND']);
  const names = {FRA:'France',CHN:'Chine',USA:'États-Unis',IND:'Inde'};
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = (value, digits=0) => CH.fmt(value,digits);
  let clipSerial = 0;

  function period(key,item) {
    if (key === 'learning') return 'Édition HCI 2020 · dates des tests variables';
    if (key === 'freedom') return '2021 · HFI, édition 2023';
    if (key === 'happiness') return 'Moyennes 2021–2023 · WHR 2024';
    return String(item.year);
  }
  function sample(key,item) {
    if (key === 'life') return 'Échantillon hors CAF, exclue du nuage et de la régression.';
    if (key === 'aic') return 'Pays européens rapportés par Eurostat, y compris hors UE ; agrégats exclus.';
    if (key === 'learning') return 'Ensemble des sexes ; tests à des dates différentes, PIB par habitant de 2020.';
    if (key === 'happiness') return '140 économies appariées sur 143 ; moyenne des trois PIB annuels 2021–2023, sans interpolation.';
    if (key === 'freedom') return '162 juridictions appariées sur 165 ; scores et PIB de 2021, sans année de remplacement.';
    return 'Une économie = un point.';
  }
  function bounds(item,key) {
    const xs = item.rows.map(row => row.x), ys = item.rows.map(row => row.y);
    const lo = Math.min(...xs), hi = Math.max(...xs);
    const fit = value => {const y = item.intercept + item.slope * Math.log(value); return item.logY ? Math.exp(y) : y;};
    const allY = ys.concat(fit(lo),fit(hi));
    const minY = Math.min(...allY), maxY = Math.max(...allY);
    const x = {log:item.logX,min:lo * 0.85,max:hi * 1.17,format:value => fmt(value)};
    if (key === 'aic') x.ticks = [20000,40000,60000,100000,150000];
    let y;
    if (key === 'freedom') y = {min:2,max:10,ticks:[2,4,6,8,10]};
    else if (key === 'happiness') y = {min:0,max:10,ticks:[0,2,4,6,8,10]};
    else if (item.logY) y = {log:true,min:minY * 0.85,max:maxY * 1.17};
    else {
      const pad = (maxY-minY) * 0.05;
      const ticks = CH.niceTicks(minY-pad,maxY+pad,6);
      y = {min:ticks[0],max:ticks.at(-1),ticks};
    }
    y.format = value => fmt(value);
    return {x,y,fit,lo,hi};
  }

  function draw(key,ctx) {
    const item = window.REVISION_DATA.correlations[key];
    const box = window.PJ.zoom(`correlation-${key}-chart`,1.2);
    if (!box) return;
    box.classList.add('rev-correlation-native');
    const animated = !(ctx.reading || ctx.print || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const scale = bounds(item,key);
    const rows = item.rows.slice().sort((a,b) => a.x-b.x);
    const chart = CH.scatter(box,{
      height:box.clientHeight,animate:animated,
      aria:`PIB et ${item.title.toLocaleLowerCase('fr')}, ${period(key,item)}. ${item.n} économies, R carré ${fmt(item.r2,3)}.`,
      x:scale.x,y:scale.y,yTitle:key === 'consumption' ? 'Consommation par habitant · corrélation avec le PIB' : key === 'manufacturing' ? 'Valeur ajoutée manufacturière par habitant · corrélation avec le PIB' : item.yUnit,
      xTitle:key === 'happiness' ? 'PIB moyen par habitant, 2021–2023 · PPA constantes de 2021' : 'PIB par habitant en PPA courantes (dollars internationaux)',
      radius:() => 4.5,opacity:0.58,
      points:rows.map(row => ({...row,key:row.code,label:row.code,hl:highlighted.has(row.code),color:highlighted.has(row.code) ? '#B45309' : '#001F5F',dx:9,dy:row.code === 'USA' ? 20 : -11})),
      tip:() => ''
    });
    // La droite utilise exactement slope/intercept du fichier de données ; aucun ajustement dans le navigateur.
    const fitPath = CH.el('path',{
      d:`M${chart.S.X(scale.lo)},${chart.S.Y(scale.fit(scale.lo))}L${chart.S.X(scale.hi)},${chart.S.Y(scale.fit(scale.hi))}`,
      class:'ch-line rev-correlation-fit',stroke:'#B45309','aria-label':'Droite de régression MCO, coefficients archivés'
    });
    const pointGroup = chart.svg.querySelector('circle[data-k]').parentNode;
    chart.svg.insertBefore(fitPath,pointGroup);
    if (animated) {
      const id = `rev-correlation-reveal-${++clipSerial}`;
      const clip = CH.el('clipPath',{id,clipPathUnits:'userSpaceOnUse'},chart.svg.querySelector('defs'));
      CH.el('rect',{x:0,y:0,width:chart.svg.getAttribute('width'),height:chart.svg.getAttribute('height'),class:'rev-correlation-reveal'},clip);
      fitPath.setAttribute('clip-path',`url(#${id})`);
      chart.svg.querySelectorAll('text[data-k]').forEach(label => label.classList.add('rev-correlation-label-enter'));
    }
    chart.svg.querySelectorAll('text[data-k]').forEach(label => label.classList.add('rev-correlation-country-label'));
    addReadout(box,chart,rows,item,key);
  }

  function addReadout(box,chart,rows,item,key) {
    const readout = document.createElement('div');
    readout.className = 'ch-readout rev-correlation-readout';
    readout.setAttribute('aria-live','polite');
    box.appendChild(readout);
    const marker = CH.el('circle',{r:9,fill:'none',stroke:'#B45309','stroke-width':2.5,opacity:0,'pointer-events':'none','aria-hidden':'true'},chart.svg);
    let current = Math.max(0,rows.findIndex(row => row.code === 'FRA'));
    function show(index) {
      current = Math.max(0,Math.min(rows.length-1,index));
      const row = rows[current], xUnit = key === 'happiness' ? 'dollars internationaux, PPA constantes 2021' : 'dollars internationaux, PPA courantes';
      marker.setAttribute('cx',chart.S.X(row.x));marker.setAttribute('cy',chart.S.Y(row.y));marker.setAttribute('opacity',1);
      readout.innerHTML = `<b>${esc(names[row.code] || row.entity)} (${esc(row.code)})</b><div>PIB${key === 'happiness' ? ' moyen' : ''} par habitant : <b>${fmt(row.x)}</b><br><span>${xUnit}</span></div><div>${esc(item.title)} : <b>${fmt(row.y,['freedom','happiness','life'].includes(key) ? 2 : 1)}</b><br><span>${esc(item.yUnit)}</span></div>`;
      readout.classList.add('on');
    }
    function hide() {marker.setAttribute('opacity',0);readout.classList.remove('on');}
    chart.svg.querySelectorAll('circle[data-k]').forEach(circle => {
      const index = rows.findIndex(row => row.code === circle.dataset.k);
      circle.addEventListener('pointerenter',() => show(index));
      circle.addEventListener('pointerleave',() => {if (document.activeElement !== box) hide();});
    });
    box.tabIndex = 0;box.setAttribute('data-keys','');
    box.setAttribute('aria-label',`${item.title}. Survolez un pays ou utilisez les flèches pour parcourir les pays par PIB croissant.`);
    box.addEventListener('focus',() => show(current));
    box.addEventListener('blur',hide);
    box.addEventListener('keydown',event => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Escape'].includes(event.key)) return;
      event.preventDefault();event.stopPropagation();
      if (event.key === 'Home') show(0);
      else if (event.key === 'End') show(rows.length-1);
      else if (event.key === 'Escape') {hide();box.blur();}
      else show(current + (['ArrowRight','ArrowUp'].includes(event.key) ? 1 : -1));
    });
  }

  keys.forEach(key => {
    const id = `correlation-${key}`, slide = window.SLIDES.find(s => s.id === id);
    if (!slide) throw new Error(`Diapositive de corrélation absente : ${id}`);
    const item = window.REVISION_DATA.correlations[key];
    const caption = slide.html.match(/<figcaption>([\s\S]*?)<\/figcaption>/);
    if (!caption) throw new Error(`Légende de corrélation absente : ${id}`);
    const logNote = item.logY ? 'Deux axes logarithmiques' : 'Axe du PIB logarithmique';
    slide.html = `<figure class="rev-correlation"><div class="rev-correlation-meta"><span>${esc(period(key,item))} · ${logNote}</span><span>n = ${item.n} · R² = ${fmt(item.r2,3)}</span></div><div id="${id}-chart" class="chart rev-correlation-chart"></div>${caption[1].trim() ? `<figcaption>${caption[1]}</figcaption>` : ''}<p class="rev-correlation-sample">${esc(sample(key,item))}</p></figure>`;
    window.Deck.on(id,{enter(el,ctx){draw(key,ctx);}});
  });
})();
