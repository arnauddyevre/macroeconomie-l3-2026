/* Patrimoine : séries Piketty embarquées, graphiques SVG natifs du moteur Charts.
 * Charger après apports_master.js ; données et provenance gérées séparément. */
(function () {
  'use strict';
  const CH = window.Charts;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const percent = value => CH.fmt(value, 1) + ' %';
  const animate = ctx => !(ctx.reading || ctx.print || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const countryStyles = {
    USA:['#001F5F',false], DEU:['#B45309','10 6'], GBR:['#536078','2 6'], CAN:['#001F5F','3 5'],
    JPN:['#B45309',false], FRA:['#001F5F','12 5'], ITA:['#536078',false], AUS:['#B45309','12 4 2 4']
  };
  const fills = {agricultural_land:'#C8CDD5', housing:'#001F5F', other_domestic:'#71839C', net_foreign:'#B45309', slaves:'#D9B18D'};
  let clipSerial = 0;

  // Un seul masque révèle toutes les séries simultanément, y compris les tirets.
  function reveal(chart, paths, active) {
    if (!active) return;
    const id = `master-wealth-reveal-${++clipSerial}`;
    const clip = CH.el('clipPath', {id, clipPathUnits:'userSpaceOnUse'}, chart.svg.querySelector('defs'));
    CH.el('rect', {x:0, y:0, width:chart.svg.getAttribute('width'), height:chart.svg.getAttribute('height'), class:'master-wealth-reveal'}, clip);
    paths.forEach(path => path.setAttribute('clip-path', `url(#${id})`));
  }

  function drawWorld(ctx) {
    const data = window.MASTER_WEALTH_DATA.private;
    const box = window.PJ.zoom('master-wealth-world-chart', 1.2);
    if (!box) return;
    box.classList.add('master-wealth-native');
    const all = data.series.flatMap(s => s.values).filter(v => v != null);
    const top = Math.max(800, Math.ceil(Math.max(...all) / 100) * 100);
    const chart = CH.line(box, {
      height:box.clientHeight, animate:false, ends:false, legend:false, hover:true, labelGap:25,
      aria:'Patrimoine privé de huit économies, en pourcentage du revenu national',
      x:{min:data.years[0], max:data.years.at(-1), ticks:data.years.filter(year => year % 10 === 0)},
      y:{min:0, max:top, ticks:Array.from({length:top / 100 + 1}, (_, i) => i * 100), hoverFormat:percent},
      yTitle:'En % du revenu national',
      series:data.series.map(s => ({
        name:s.name, endLabel:s.name, color:countryStyles[s.key][0], dash:countryStyles[s.key][1],
        data:data.years.map((year, i) => [year, s.values[i]]), gaps:1.5, format:percent
      }))
    });
    reveal(chart, [...chart.svg.querySelectorAll('.ch-line')], animate(ctx));
    box.setAttribute('aria-label', 'Patrimoine privé. Survolez les courbes ou utilisez les flèches gauche et droite pour lire une année.');
  }

  // Intercaler les passages par zéro évite de relier une aire positive à la pile négative.
  // Les dates sources sont espacées régulièrement ; les coupes ajoutées ne sont pas des observations.
  function stackSegments(data) {
    const groups = [];
    let run = [];
    data.years.forEach((year, i) => {
      const values = data.components.map(s => s.values[i]);
      if (values.some(v => v == null)) { if (run.length) groups.push(run); run = []; return; }
      run.push({x:i, values});
    });
    if (run.length) groups.push(run);
    return groups.map(group => group.flatMap((point, i) => {
      if (!i) return [point];
      const before = group[i - 1];
      const cuts = [...new Set(point.values.map((value, k) => before.values[k] * value < 0 ? -before.values[k] / (value - before.values[k]) : null).filter(t => t != null))].sort((a,b) => a-b);
      return cuts.map(t => ({x:before.x + t, values:point.values.map((value,k) => before.values[k] + t * (value - before.values[k]))})).concat(point);
    }));
  }

  function drawAreas(key, ctx) {
    const data = window.MASTER_WEALTH_DATA[key];
    const box = window.PJ.zoom(`master-wealth-${key === 'usa' ? 'us' : key}-chart`, 1.2);
    if (!box) return;
    box.classList.add('master-wealth-native', 'master-wealth-sided');
    const isUS = key === 'usa', totalName = isUS ? 'Total historique' : 'Patrimoine national';
    const height = box.clientHeight;
    const width = box.clientWidth - 260; // Légende à droite, sans réduire la hauteur du tracé.
    const chart = CH.line(box, {
      width, height, animate:false, ends:false, legend:false, hover:false,
      aria:`Composition du patrimoine ${isUS ? 'aux États-Unis' : 'en France'}, en pourcentage du revenu national`,
      x:{min:0, max:data.years.length - 1, ticks:data.years.map((_,i) => i), format:i => String(data.years[i])},
      y:{min:-50, max:isUS ? 700 : 800, ticks:isUS ? [0,200,400,600,700] : [0,200,400,600,800]},
      yTitle:'En % du revenu national', margin:{l:72,r:34,t:62,b:48},
      series:[{name:totalName, color:'#111111', dash:'6 4', width:2.8, data:data.years.map((_,i) => [i,data.total[i]]), gaps:1.5}]
    });
    const areas = CH.el('g', {'aria-hidden':'true'}, chart.svg);
    chart.svg.insertBefore(areas, chart.svg.querySelector(':scope > g'));
    stackSegments(data).forEach(group => {
      const bands = data.components.map(() => ({positive:[],negative:[]}));
      group.forEach(point => {
        let positive = 0, negative = 0;
        point.values.forEach((value, k) => {
          bands[k].positive.push([point.x, positive, positive + Math.max(0,value)]);
          bands[k].negative.push([point.x, negative, negative + Math.min(0,value)]);
          positive += Math.max(0,value); negative += Math.min(0,value);
        });
      });
      bands.forEach((band,k) => ['positive','negative'].forEach(sign => {
        const points = band[sign];
        if (!points.some(p => Math.abs(p[2] - p[1]) > 1e-8)) return;
        const xy = (p,side) => `${chart.S.X(p[0]).toFixed(2)},${chart.S.Y(p[side]).toFixed(2)}`;
        const d = 'M' + points.map(p => xy(p,2)).join('L') + 'L' + points.slice().reverse().map(p => xy(p,1)).join('L') + 'Z';
        CH.el('path', {d, fill:fills[data.components[k].key], stroke:'#fff', 'stroke-width':0.8, 'stroke-linejoin':'round'}, areas);
      }));
    });
    reveal(chart, [...areas.querySelectorAll('path'), ...chart.svg.querySelectorAll('.ch-line')], animate(ctx));
    const legend = document.createElement('div');
    legend.className = 'ch-legend master-wealth-legend';
    legend.innerHTML = data.components.map(s => `<span><i class="master-wealth-swatch" style="background:${fills[s.key]}"></i><span>${esc(s.name)}</span></span>`).join('') + `<span><i class="master-wealth-total"></i><span>${totalName}</span></span>`;
    box.appendChild(legend);
    areaReadout(box, chart, data, height, totalName);
  }

  function areaReadout(box, chart, data, height, totalName) {
    const {svg,S,m} = chart, width = Number(svg.getAttribute('width'));
    const guide = CH.el('line', {y1:m.t - 10,y2:height - m.b,class:'ch-guide',opacity:0}, svg);
    const dot = CH.el('circle', {r:5.5,fill:'#111',stroke:'#fff','stroke-width':2,opacity:0}, svg);
    const hit = CH.el('rect', {x:m.l,y:m.t - 10,width:width-m.l-m.r,height:height-m.t-m.b+10,class:'ch-hit'}, svg);
    const readout = document.createElement('div');
    readout.className = 'ch-readout'; readout.setAttribute('aria-live','polite');
    box.appendChild(readout);
    let current = data.years.length - 1;
    function show(index) {
      current = Math.max(0,Math.min(data.years.length-1,index));
      guide.setAttribute('x1',S.X(current)); guide.setAttribute('x2',S.X(current)); guide.setAttribute('opacity',1);
      if (data.total[current] != null) {dot.setAttribute('cx',S.X(current));dot.setAttribute('cy',S.Y(data.total[current]));dot.setAttribute('opacity',1);}
      else dot.setAttribute('opacity',0);
      readout.innerHTML = `<div class="master-wealth-readout-year">${data.years[current]}</div>` + data.components.map(s => `<div><b>${esc(s.name)}</b> ${s.values[current] == null ? 'Non disponible' : percent(s.values[current])}</div>`).join('') + `<div class="master-wealth-readout-total"><b>${totalName}</b> ${data.total[current] == null ? 'Non disponible' : percent(data.total[current])}</div>`;
      readout.classList.add('on');
    }
    function hide() { guide.setAttribute('opacity',0);dot.setAttribute('opacity',0);readout.classList.remove('on'); }
    hit.addEventListener('pointermove', event => {
      const bounds = svg.getBoundingClientRect(), x = (event.clientX - bounds.left) / bounds.width * width;
      show(Math.round((x-m.l) / (width-m.l-m.r) * (data.years.length-1)));
    });
    hit.addEventListener('pointerleave',hide);
    box.tabIndex = 0; box.setAttribute('data-keys','');
    box.setAttribute('aria-label','Composition du patrimoine. Survolez les aires ou utilisez les flèches gauche et droite pour lire les dates.');
    box.addEventListener('focus',() => show(current));
    box.addEventListener('keydown',event => {
      if (['ArrowLeft','ArrowRight','Home','End','Escape'].includes(event.key)) {event.preventDefault();event.stopPropagation();}
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') show(current + (event.key === 'ArrowRight' ? 1 : -1));
      if (event.key === 'Home') show(0);
      if (event.key === 'End') show(data.years.length-1);
      if (event.key === 'Escape') {hide();box.blur();}
    });
    box.addEventListener('blur',hide);
  }

  window.Deck.on('master-patrimoine-monde',{enter(el,ctx){drawWorld(ctx);}});
  window.Deck.on('master-patrimoine-france',{enter(el,ctx){drawAreas('france',ctx);}});
  window.Deck.on('master-patrimoine-us',{enter(el,ctx){drawAreas('usa',ctx);}});
})();
