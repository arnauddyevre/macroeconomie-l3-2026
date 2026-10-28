/* Généré par scripts/synchroniser_navigation.cjs depuis le chapitre 1.
   Ne pas modifier directement ; empreinte des sources : 231adab8a688215ec6545f63472842ce93c3e41d5f79dd6f77662cda5f56ac37. */
/* ==========================================================================
   Graphiques SVG au « style maison » (graph_style_guide) :
   axes = flèches noires épaisses (l'axe des x sert de ligne zéro), aucune grille,
   titre de l'axe vertical horizontal, en gras, en haut à gauche, avec l'unité ;
   pas de titre ni de texte dans la zone de tracé ; étiquettes de valeur en gras
   dans la couleur de la série assombrie (×0,66) ; deux séries au plus par panneau ;
   légende sous le graphique, sur une ligne, seulement s'il y a au moins deux séries.
   Toutes les dimensions sont en pixels de la scène (1600×900).
   ========================================================================== */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const PAL = { blue: '#001F5F', red: '#B45309', teal: '#526780', amber: '#B45309', violet: '#526780', slate: '#8A9BA8', grey: '#CFC7BA', ink: '#000000', nom: '#5F707D',
    olive: '#526780', prune: '#001F5F' };   // nom : valeurs nominales ; olive : capital physique ; prune : productivité globale des facteurs (code couleur des calculs)
  const col = c => PAL[c] || c || PAL.blue;
  function darken(c, f = 0.66) {
    c = col(c).replace('#', '');
    const n = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
    const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return `rgb(${r},${g},${b})`;
  }
  const NB = ' ';
  function fmt(v, d = 0) {
    if (v == null || !isFinite(v)) return '–';
    const s = Math.abs(v).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/ |\s/g, NB);
    return (v < 0 && Math.abs(v) >= Math.pow(10, -d) / 2 ? '−' : '') + s;
  }
  const pct = (v, d = 1, sign = false) => (sign && v > 0 ? '+' : '') + fmt(v, d) + NB + '%';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const textW = (s, size = 19) => String(s).length * size * 0.56;

  function niceTicks(lo, hi, n = 5) {
    const span = hi - lo || Math.abs(hi) || 1;
    const raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), base = raw / mag;
    const step = (base <= 1 ? 1 : base <= 2 ? 2 : base <= 2.5 ? 2.5 : base <= 5 ? 5 : 10) * mag;
    const a = Math.floor(lo / step + 1e-9) * step, b = Math.ceil(hi / step - 1e-9) * step;
    const t = []; for (let v = a; v <= b + step / 2; v += step) t.push(+v.toFixed(10));
    return t;
  }
  function logTicks(lo, hi) {
    const t = []; const a = Math.floor(Math.log10(lo)), b = Math.ceil(Math.log10(hi));
    for (let e = a; e <= b; e++) [1, 2, 5].forEach(m => { const v = m * Math.pow(10, e); if (v >= lo * 0.999 && v <= hi * 1.001) t.push(v); });
    return t;
  }
  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(parent, x, y, s, cls, attrs = {}) { const t = el('text', Object.assign({ x, y, class: cls }, attrs), parent); t.textContent = s; return t; }

  /* --------------------------------------------------------------- repère commun */
  function frame(container, o) {
    container.classList.add('chart');
    container.innerHTML = '';
    const Wd = o.width || container.clientWidth || 900, Ht = o.height || container.clientHeight || 480;
    const svg = el('svg', { width: Wd, height: Ht, viewBox: `0 0 ${Wd} ${Ht}`, role: 'img', 'aria-label': o.aria || o.yTitle || 'Graphique' }, container);
    const defs = el('defs', {}, svg);
    const mk = el('marker', { id: 'arr' + (frame.n = (frame.n || 0) + 1), viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6.5, markerHeight: 6.5, orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#111' }, mk);
    return { svg, Wd, Ht, arrow: `url(#arr${frame.n})` };
  }
  function scales(o, Wd, Ht, m) {
    const x = o.x || {}, y = o.y || {};
    const X = x.log ? v => m.l + (Math.log(v) - Math.log(x.min)) / (Math.log(x.max) - Math.log(x.min)) * (Wd - m.l - m.r)
      : v => m.l + (v - x.min) / (x.max - x.min) * (Wd - m.l - m.r);
    const Y = y.log ? v => Ht - m.b - (Math.log(v) - Math.log(y.min)) / (Math.log(y.max) - Math.log(y.min)) * (Ht - m.t - m.b)
      : v => Ht - m.b - (v - y.min) / (y.max - y.min) * (Ht - m.t - m.b);
    return { X, Y };
  }
  function axes(g, o, S, m, Wd, Ht, arrow, opts = {}) {
    const x = o.x, y = o.y;
    const y0 = !y.log && y.min < 0 && y.max > 0 ? S.Y(0) : S.Y(y.min);
    const xa = el('line', { x1: m.l, y1: y0, x2: Wd - m.r + 22, y2: y0, class: 'ch-axis', 'marker-end': arrow }, g);
    const ya = el('line', { x1: m.l, y1: Ht - m.b, x2: m.l, y2: m.t - 22, class: 'ch-axis', 'marker-end': arrow }, g);
    const yt = y.ticks || (y.log ? logTicks(y.min, y.max) : niceTicks(y.min, y.max));
    yt.forEach(v => { const yy = S.Y(v); if (yy < m.t - 2 || yy > Ht - m.b + 2) return; el('line', { x1: m.l - 7, x2: m.l, y1: yy, y2: yy, class: 'ch-tickmark' }, g); txt(g, m.l - 13, yy + 6.5, (y.format || (v => fmt(v, y.digits || 0)))(v), 'ch-tick ch-num', { 'text-anchor': 'end' }); });
    if (!opts.noXTicks) {
      const xt = x.ticks || (x.log ? logTicks(x.min, x.max) : niceTicks(x.min, x.max, x.n || 6));
      xt.forEach(v => { const xx = S.X(v); if (xx < m.l - 2 || xx > Wd - m.r + 2) return; el('line', { x1: xx, x2: xx, y1: y0, y2: y0 + 7, class: 'ch-tickmark' }, g); txt(g, xx, Math.max(y0, S.Y(y.min)) + 30, (x.format || (v => String(v)))(v), 'ch-tick', { 'text-anchor': 'middle' }); });
    }
    if (o.yTitle) txt(g, m.l - (opts.yTitleIndent || 10), m.t - 34, o.yTitle, 'ch-ytitle', { 'text-anchor': 'start' });
    if (o.xTitle) txt(g, Wd - m.r, Ht - 6, o.xTitle, 'ch-xtitle', { 'text-anchor': 'end' });
    return y0;
  }
  function legend(container, series) {
    if (series.length < 2) return;
    const d = document.createElement('div'); d.className = 'ch-legend';
    d.innerHTML = series.filter(s => s.name && s.legend !== false).map(s => `<span style="color:${col(s.color)}"><i class="${s.dash ? 'dash' : ''}" style="background:${col(s.color)}"></i><span style="color:#000000">${esc(s.name)}</span></span>`).join('');
    container.appendChild(d);
  }
  function animateLine(path, dur = 1.6, delay = 0) {
    try {
      const len = path.getTotalLength();
      path.style.setProperty('--len', len); path.style.setProperty('--dur', dur + 's'); path.style.animationDelay = delay + 's';
      path.classList.add('ch-anim');
    } catch (e) { }
  }

  /* --------------------------------------------------------------- étiquettes des courbes
     Règle maison : les valeurs de début (o.starts) et de fin (o.ends) figurent sur toutes les séries ou sur aucune.
     Étiquettes de fin à droite du dernier point, écartées verticalement si elles se chevauchent ; une flèche
     relie alors l'étiquette au point. Étiquettes de début (et valueLabels intermédiaires) placées autour du
     point, à droite de l'axe vertical, à l'endroit qui gêne le moins les courbes et les autres étiquettes. */
  function spread(items, gap, lo, hi) {
    items.sort((a, b) => a.y0 - b.y0);
    items.forEach(it => { it.y = Math.max(lo, Math.min(hi, it.y0)); });
    for (let iter = 0; iter < 80; iter++) {
      let moved = false;
      for (let i = 1; i < items.length; i++) {
        const d = items[i].y - items[i - 1].y;
        if (d < gap - 0.01) { const push = (gap - d) / 2; items[i - 1].y -= push; items[i].y += push; moved = true; }
      }
      items.forEach(it => { it.y = Math.max(lo, Math.min(hi, it.y)); });
      if (!moved) break;
    }
  }
  // Flèche fine de l'étiquette (x1, y1) vers le point (x2, y2), arrêtée à « stop » pixels du point
  function leader(g, x1, y1, x2, y2, stop, color) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L < stop + 9) return;
    const ux = dx / L, uy = dy / L, tx = x2 - ux * stop, ty = y2 - uy * stop, bx = tx - ux * 7, by = ty - uy * 7;
    el('line', { x1, y1, x2: bx, y2: by, stroke: color, 'stroke-width': 1.6 }, g);
    el('path', { d: `M${tx.toFixed(1)},${ty.toFixed(1)}L${(bx - uy * 3.8).toFixed(1)},${(by + ux * 3.8).toFixed(1)}L${(bx + uy * 3.8).toFixed(1)},${(by - ux * 3.8).toFixed(1)}Z`, fill: color }, g);
  }
  // Boîte d'un texte de 19 px dont la ligne de base est en y
  const tbox = (x, y, w, anchor) => { const x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x; return { x0, x1: x0 + w, y0: y - 15, y1: y + 5 }; };
  function placeCost(b, polys, boxes, lim) {
    let c = 0;
    if (b.x0 < lim.l + 3 || b.x1 > lim.W - 2 || b.y0 < lim.t - 34 || b.y1 > lim.b - 3) c += 1e5;
    boxes.forEach(q => { c += 4 * Math.max(0, Math.min(b.x1, q.x1) - Math.max(b.x0, q.x0)) * Math.max(0, Math.min(b.y1, q.y1) - Math.max(b.y0, q.y0)); });
    polys.forEach(pl => { for (let i = 1; i < pl.length; i++) {
      const [ax, ay] = pl[i - 1], [bx, by] = pl[i];
      if (Math.max(ax, bx) < b.x0 - 3 || Math.min(ax, bx) > b.x1 + 3 || Math.max(ay, by) < b.y0 - 3 || Math.min(ay, by) > b.y1 + 3) continue;
      const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 3));
      for (let j = 0; j <= n; j++) { const x = ax + (bx - ax) * j / n, y = ay + (by - ay) * j / n; if (x > b.x0 - 3 && x < b.x1 + 3 && y > b.y0 - 3 && y < b.y1 + 3) c += 40; }
    } });
    return c;
  }
  function placeLabel(px, py, w, cands, polys, boxes, lim) {
    let best = null;
    cands.forEach((cd, i) => { const b = tbox(px + cd[0], py + cd[1], w, cd[2]); const c = placeCost(b, polys, boxes, lim) + i * 0.5; if (!best || c < best.c) best = { c, cd, b }; });
    boxes.push(best.b);
    return { x: px + best.cd[0], y: py + best.cd[1], anchor: best.cd[2] };
  }

  /* --------------------------------------------------------------- courbes */
  function line(container, o) {
    if (o.legend !== false && o.series.length > 1 && !o.series.some(s => s.endLabel)) o = Object.assign({}, o, { height: (o.height || container.clientHeight) - 40 });
    const { svg, Wd, Ht, arrow } = frame(container, o);
    const all = o.series.flatMap(s => s.data.filter(d => d[1] != null));
    const x = o.x = Object.assign({}, o.x); const y = o.y = Object.assign({}, o.y);
    if (x.min == null) x.min = Math.min(...all.map(d => d[0])); if (x.max == null) x.max = Math.max(...all.map(d => d[0]));
    if (y.min == null || y.max == null) {
      const lo = Math.min(...all.map(d => d[1])), hi = Math.max(...all.map(d => d[1]));
      if (y.log) { y.min = y.min ?? lo * 0.9; y.max = y.max ?? hi * 1.1; }
      else { const t = niceTicks(Math.min(lo, y.zero === false ? lo : Math.min(0, lo)), hi); y.min = y.min ?? t[0]; y.max = y.max ?? t[t.length - 1]; y.ticks = y.ticks || t; }
    }
    const F = s => s.format || (v => fmt(v, s.digits || 0));
    const PTS = o.series.map(s => s.data.filter(d => d[1] != null && d[0] >= x.min && d[0] <= x.max));
    const anim = o.animate !== false, dur = o.duration || 1.6, stag = o.stagger || 0;
    const mb0 = o.xTitle ? 74 : 48;    // un titre d'axe horizontal se place sous les graduations
    const mt = (o.margin && o.margin.t) ?? 62, mb = (o.margin && o.margin.b) ?? mb0;
    const Ypre = scales(o, Wd, Ht, { l: 0, r: 0, t: mt, b: mb }).Y;
    // Étiquettes de fin : nom (endLabel) et/ou valeur (o.ends). Celles des séries qui s'arrêtent avant le bord droit
    // sont placées autour de leur dernier point ; les autres sont alignées à droite et écartées si besoin.
    const lastX = Math.max(...PTS.filter(p => p.length).map(p => p[p.length - 1][0])), edge = (x.max - x.min) * 0.04, ends = [], inner = [];
    o.series.forEach((s, k) => {
      const pts = PTS[k]; if (!pts.length) return;
      const name = s.endLabel === true ? s.name : s.endLabel, hasName = name != null && String(name).trim() !== '';
      const val = o.ends && s.ends !== false ? F(s)(pts[pts.length - 1][1]) : null;
      if (!hasName && !val) return;
      const it = { k, s, last: pts[pts.length - 1], name: hasName ? String(name) : '', val, dot: !!val };
      it.w = (hasName ? textW(it.name) : 0) + (val ? textW(val) * 1.06 + (hasName ? 8 : 0) : 0);
      it.y0 = Ypre(it.last[1]) + (s.endDy || 0);
      (it.last[0] >= lastX - edge ? ends : inner).push(it);
    });
    spread(ends, o.labelGap || 25, mt - 26, Ht - mb + 6);
    // Une flèche relie chaque étiquette à son point dès qu'une étiquette a dû être déplacée, ou qu'une série
    // s'arrête nettement avant les autres ; les étiquettes restent alors alignées, toutes avec leur flèche.
    const mL = 24 + Math.max(...(y.ticks || [y.min, y.max]).map(v => textW((y.format || (z => fmt(z, y.digits || 0)))(v))));
    const r0 = Math.max(0, ...ends.map(e => e.w + (e.dot ? 16 : 12) + 6)), plotW = Wd - ((o.margin && o.margin.l) ?? mL) - Math.max(34, r0);
    ends.forEach(e => { e.moved = Math.abs(e.y - e.y0) > 3.5 || (lastX - e.last[0]) / (x.max - x.min || 1) * plotW > 12; });
    const arrows = ends.some(e => e.moved) && ends.length > 0;
    const endW = ends.length ? r0 + (arrows ? 22 : 0) : 0;
    const m = Object.assign({ l: mL, r: Math.max(34, endW), t: 62, b: mb0 }, o.margin || {});
    const S = scales(o, Wd, Ht, m);
    const g = el('g', {}, svg);
    (o.bands || []).forEach(b => el('rect', { x: S.X(b.x0), y: m.t, width: S.X(b.x1) - S.X(b.x0), height: Ht - m.t - m.b, fill: b.color || '#EDEAE3' }, g));
    const y0 = axes(g, o, S, m, Wd, Ht, arrow);
    (o.refLines || []).forEach(r => {
      el('line', { x1: m.l, x2: Wd - m.r, y1: S.Y(r.y), y2: S.Y(r.y), stroke: col(r.color || 'red'), 'stroke-width': 2.4, 'stroke-dasharray': r.dash || '8 7' }, g);
      if (r.label) txt(g, Wd - m.r + 8, S.Y(r.y) + 6, r.label, 'ch-lab', { fill: darken(r.color || 'red') });
    });
    const polys = [];
    o.series.forEach((s, k) => {
      const pts = PTS[k];
      if (!pts.length) return;
      if (s.area) { const a = `M${S.X(pts[0][0])},${y0} ` + pts.map(d => `L${S.X(d[0]).toFixed(1)},${S.Y(d[1]).toFixed(1)}`).join(' ') + ` L${S.X(pts[pts.length - 1][0])},${y0} Z`; el('path', { d: a, fill: col(s.color), opacity: s.area }, g); }
      // s.gaps (nombre) : la courbe s'interrompt quand deux points successifs sont séparés de plus de s.gaps (série sans données sur une période)
      const segs = s.gaps ? pts.reduce((a, p, i) => { if (i && p[0] - pts[i - 1][0] > s.gaps) a.push([]); a[a.length - 1].push(p); return a; }, [[]]) : [pts];
      segs.forEach(sg => polys.push(sg.map(p => [S.X(p[0]), S.Y(p[1])])));
      const d = segs.map(sg => sg.map((p, i) => (i ? 'L' : 'M') + S.X(p[0]).toFixed(1) + ',' + S.Y(p[1]).toFixed(1)).join(' ')).join(' ');
      const p = el('path', { d, class: 'ch-line', stroke: col(s.color), 'stroke-width': s.width || 4, 'stroke-dasharray': s.dash || null }, g);
      if (anim && !s.dash) animateLine(p, dur, stag * k);
      if (anim && s.dash) {
        const id = 'dash-reveal-' + frame.n + '-' + k;
        const clip = el('clipPath', {id, clipPathUnits:'userSpaceOnUse'}, svg.querySelector('defs'));
        el('rect', {x:0, y:0, width:Wd, height:Ht, class:'ch-dash-reveal',
          style:`animation-duration:${dur}s;animation-delay:${stag * k}s`}, clip);
        p.setAttribute('clip-path', `url(#${id})`);
      }
      if (s.points) pts.forEach(q => el('circle', { cx: S.X(q[0]), cy: S.Y(q[1]), r: 5.5, fill: col(s.color), class: anim ? 'ch-pop' : '' }, g));
    });
    // Les étiquettes apparaissent quand la courbe arrive à leur point
    const lay = (k, at) => { const gg = el('g', anim ? { class: 'ch-fade', style: `animation-delay:${(stag * k + at).toFixed(2)}s` } : {}, g); return gg; };
    const dot = (gg, px, py, c) => el('circle', { cx: px, cy: py, r: 6.5, fill: col(c), stroke: '#fff', 'stroke-width': 2 }, gg);
    const boxes = [], lim = { l: m.l, W: Wd, t: m.t, b: Ht - m.b };
    (o.markers || []).forEach(mk => { if (mk.label) boxes.push(tbox(S.X(mk.x) + (mk.dx || 0), S.Y(mk.y) + (mk.dy ?? -16), textW(mk.label), mk.anchor || 'middle')); });
    const label = (gg, xx, yy, it, anchor) => {
      const t = el('text', { x: xx, y: yy, class: 'ch-lab', fill: darken(it.s.color), 'text-anchor': anchor || 'start' }, gg);
      if (it.name) { const a = el('tspan', {}, t); a.textContent = it.name; }
      if (it.val) { const b = el('tspan', { 'font-weight': 700, dx: it.name ? 8 : null, class: 'ch-num' }, t); b.textContent = it.val; }
    };
    // Étiquettes de fin alignées sur une même verticale, à droite du point le plus à droite
    const maxPx = Math.max(0, ...ends.map(e => S.X(e.last[0])));
    ends.forEach(e => {
      const px = S.X(e.last[0]), py = S.Y(e.last[1]), gg = lay(e.k, dur * 0.92);
      if (e.dot) dot(gg, px, py, e.s.color);
      const lx = maxPx + (ends.some(q => q.dot) ? 14 : 12) + (arrows ? 22 : 0);
      if (arrows) leader(gg, lx - 5, e.y, px, py, e.dot ? 10 : 5, darken(e.s.color));
      label(gg, lx, e.y + 7, e);
      boxes.push(tbox(lx, e.y + 7, e.w, 'start'));
    });
    const around = [[0, -16, 'middle'], [12, -14, 'start'], [-12, -14, 'end'], [0, 31, 'middle'], [12, 30, 'start'], [-12, 30, 'end'], [14, 7, 'start'], [-14, 7, 'end']];
    inner.forEach(e => {
      const px = S.X(e.last[0]), py = S.Y(e.last[1]), gg = lay(e.k, dur * 0.92);
      if (e.dot) dot(gg, px, py, e.s.color);
      const p = placeLabel(px, py, e.w, around, polys, boxes, lim);
      label(gg, p.x, p.y, e, p.anchor);
    });
    // Valeurs de début : toujours à droite de l'axe vertical
    const right = [[14, 7, 'start'], [12, 30, 'start'], [12, -14, 'start'], [16, 44, 'start'], [16, -28, 'start']];
    if (o.starts) o.series.forEach((s, k) => {
      const pts = PTS[k]; if (!pts.length || s.starts === false) return;
      const q = pts[0], px = S.X(q[0]), py = S.Y(q[1]), v = F(s)(q[1]), gg = lay(k, 0.15);
      dot(gg, px, py, s.color);
      const p = placeLabel(px, py, textW(v) * 1.06, right, polys, boxes, lim);
      label(gg, p.x, p.y, { s, name: '', val: v }, p.anchor);
    });
    // Valeurs à une date donnée (sur toutes les séries concernées)
    o.series.forEach((s, k) => (s.valueLabels || []).forEach(vx => {
      const pts = PTS[k], q = vx === 'last' ? pts[pts.length - 1] : vx === 'first' ? pts[0] : pts.find(z => z[0] === vx); if (!q) return;
      const px = S.X(q[0]), py = S.Y(q[1]), v = F(s)(q[1]), gg = lay(k, dur * Math.max(0.1, (q[0] - x.min) / (x.max - x.min || 1)));
      dot(gg, px, py, s.color);
      const p = placeLabel(px, py, textW(v) * 1.06, around, polys, boxes, lim);
      label(gg, p.x, p.y, { s, name: '', val: v }, p.anchor);
    }));
    (o.markers || []).forEach(mk => {
      el('circle', { cx: S.X(mk.x), cy: S.Y(mk.y), r: mk.r || 7, fill: col(mk.color || 'red'), stroke: '#fff', 'stroke-width': 2.5 }, g);
      if (mk.label) txt(g, S.X(mk.x) + (mk.dx || 0), S.Y(mk.y) + (mk.dy ?? -16), mk.label, 'ch-val', { fill: darken(mk.color || 'red'), 'text-anchor': mk.anchor || 'middle' });
    });
    if (o.legend !== false && !o.series.some(s => s.endLabel)) legend(container, o.series);
    if (o.hover !== false) hoverLine(container, svg, o, S, m, Wd, Ht);
    return { svg, S, m };
  }
  function hoverLine(container, svg, o, S, m, Wd, Ht) {
    const xs = [...new Set(o.series.flatMap(s => s.data.map(d => d[0])))].filter(v => v >= o.x.min && v <= o.x.max).sort((a, b) => a - b);
    if (!xs.length) return;
    const guide = el('line', { y1: m.t - 10, y2: Ht - m.b, class: 'ch-guide', opacity: 0 }, svg);
    const dots = o.series.map(s => el('circle', { r: 6, fill: col(s.color), stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg));
    const hit = el('rect', { x: m.l, y: m.t - 10, width: Wd - m.l - m.r, height: Ht - m.t - m.b + 10, class: 'ch-hit' }, svg);
    const ro = document.createElement('div'); ro.className = 'ch-readout'; container.appendChild(ro);
    const fx = o.x.hoverFormat || o.x.format || (v => String(v));
    let cur = xs.length - 1;
    function show(i) {
      cur = Math.max(0, Math.min(xs.length - 1, i)); const xv = xs[cur];
      guide.setAttribute('x1', S.X(xv)); guide.setAttribute('x2', S.X(xv)); guide.setAttribute('opacity', 1);
      const rows = o.series.map((s, k) => { const d = s.data.find(z => z[0] === xv); if (!d || d[1] == null) { dots[k].setAttribute('opacity', 0); return ''; } dots[k].setAttribute('cx', S.X(xv)); dots[k].setAttribute('cy', S.Y(d[1])); dots[k].setAttribute('opacity', 1); return `<div><b style="color:${darken(s.color)}">${esc(s.name || '')}</b> ${(s.format || o.y.hoverFormat || (v => fmt(v, o.y.digits || 0)))(d[1])}</div>`; }).join('');
      ro.innerHTML = `<div style="font-weight:700;margin-bottom:2px">${fx(xv)}</div>${rows}`; ro.classList.add('on');
    }
    function hide() { guide.setAttribute('opacity', 0); dots.forEach(d => d.setAttribute('opacity', 0)); ro.classList.remove('on'); }
    const toX = e => { const r = svg.getBoundingClientRect(); return (e.clientX - r.left) / r.width * Wd; };
    hit.addEventListener('pointermove', e => { const px = toX(e); let best = 0; xs.forEach((v, i) => { if (Math.abs(S.X(v) - px) < Math.abs(S.X(xs[best]) - px)) best = i; }); show(best); });
    hit.addEventListener('pointerleave', hide);
    container.tabIndex = 0; container.setAttribute('data-keys', '');
    container.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); show(cur + (e.key === 'ArrowRight' ? 1 : -1)); } if (e.key === 'Escape') { hide(); container.blur(); } });
    container.addEventListener('blur', hide);
  }

  /* --------------------------------------------------------------- barres verticales */
  function bars(container, o) {
    const { svg, Wd, Ht, arrow } = frame(container, o);
    const data = o.data, vals = data.map(d => d.value).concat(o.y && o.y.extra || []);
    const y = o.y = Object.assign({}, o.y);
    if (y.min == null || y.max == null) { const t = niceTicks(Math.min(0, ...vals), Math.max(0, ...vals) * 1.12); y.min = y.min ?? t[0]; y.max = y.max ?? t[t.length - 1]; y.ticks = y.ticks || t; }
    o.x = { min: 0, max: data.length };
    const m = Object.assign({ l: 24 + Math.max(...(y.ticks || [y.min, y.max]).map(v => textW((y.format || (z => fmt(z, y.digits || 0)))(v)))), r: 30, t: 62, b: o.labelLines === 2 ? 70 : 46 }, o.margin || {});
    const S = scales(o, Wd, Ht, m);
    const g = el('g', {}, svg);
    const y0 = axes(g, o, S, m, Wd, Ht, arrow, { noXTicks: true });
    const bw = (Wd - m.l - m.r) / data.length;
    const gap = o.gap ?? 0.34;
    data.forEach((d, i) => {
      if (d.value == null) return;
      const x0 = m.l + bw * i + bw * gap / 2, w = bw * (1 - gap);
      const yy = S.Y(d.value), h = Math.abs(yy - y0);
      el('rect', { x: x0, y: Math.min(yy, y0), width: w, height: Math.max(1, h), fill: col(d.color || o.color), class: 'ch-bar ' + (o.animate !== false ? 'anim-y' + (d.value < 0 ? ' neg' : '') : ''), style: `animation-delay:${(o.stagger ?? 0.06) * i}s` }, g);
      if (o.valueLabels !== false) txt(g, x0 + w / 2, d.value >= 0 ? yy - 12 : yy + 28, d.valueLabel ?? (o.format || (v => fmt(v, o.digits || 0)))(d.value), 'ch-val', { fill: darken(d.color || o.color), 'text-anchor': 'middle', class: 'ch-val' + (o.animate !== false ? ' ch-fade' : ''), style: `animation-delay:${(o.stagger ?? 0.06) * i + 0.4}s` });
      const lines = String(d.label).split('|');
      const below = Math.max(y0, S.Y(y.min));
      lines.forEach((ln, j) => txt(g, x0 + w / 2, (d.value < 0 && !o.labelsBottom ? y0 - 12 - (lines.length - 1 - j) * 22 : below + 30 + j * 22), ln, 'ch-tick', { 'text-anchor': 'middle' }));
    });
    return { svg, S, m };
  }

  /* --------------------------------------------------------------- barres groupées (2 séries) */
  function grouped(container, o) {
    if (o.legend !== false && o.series.length > 1) o = Object.assign({}, o, { height: (o.height || container.clientHeight) - 40 });
    const { svg, Wd, Ht, arrow } = frame(container, o);
    const cats = o.categories, ser = o.series;
    const vals = ser.flatMap(s => s.values).filter(v => v != null);
    const y = o.y = Object.assign({}, o.y);
    if (y.min == null || y.max == null) { const t = niceTicks(Math.min(0, ...vals), Math.max(0, ...vals)); y.min = y.min ?? t[0]; y.max = y.max ?? t[t.length - 1]; y.ticks = y.ticks || t; }
    o.x = { min: 0, max: cats.length };
    const m = Object.assign({ l: 24 + Math.max(...(y.ticks || [y.min, y.max]).map(v => textW((y.format || (z => fmt(z, y.digits || 0)))(v)))), r: 30, t: 62, b: 46 }, o.margin || {});
    const S = scales(o, Wd, Ht, m);
    const g = el('g', {}, svg);
    const y0 = axes(g, o, S, m, Wd, Ht, arrow, { noXTicks: true });
    const bw = (Wd - m.l - m.r) / cats.length, inner = bw * 0.72, w = inner / ser.length;
    cats.forEach((c, i) => {
      ser.forEach((s, k) => {
        const v = s.values[i]; if (v == null) return;
        const x0 = m.l + bw * i + (bw - inner) / 2 + k * w, yy = S.Y(v);
        el('rect', { x: x0 + 2, y: Math.min(yy, y0), width: w - 4, height: Math.max(1, Math.abs(yy - y0)), fill: col(s.color), class: 'ch-bar ' + (o.animate !== false ? 'anim-y' + (v < 0 ? ' neg' : '') : ''), style: `animation-delay:${0.05 * i + 0.15 * k}s` }, g);
        if (o.valueLabels !== false) txt(g, x0 + w / 2, v >= 0 ? yy - 10 : yy + 26, (o.format || (z => fmt(z, o.digits || 1)))(v), 'ch-val', { fill: darken(s.color), 'text-anchor': 'middle', style: 'font-size:16px' });
      });
      txt(g, m.l + bw * i + bw / 2, Math.max(y0, S.Y(y.min)) + 30, c, 'ch-tick', { 'text-anchor': 'middle' });
    });
    if (o.legend !== false) legend(container, ser);
    return { svg, S, m };
  }

  /* --------------------------------------------------------------- nuage de points */
  function scatter(container, o) {
    const { svg, Wd, Ht, arrow } = frame(container, o);
    const x = o.x = Object.assign({}, o.x), y = o.y = Object.assign({}, o.y);
    const m = Object.assign({ l: 24 + Math.max(...(y.ticks || [y.min, y.max]).map(v => textW((y.format || (z => fmt(z, y.digits || 0)))(v)))), r: 40, t: 62, b: 74 }, o.margin || {});
    const S = scales(o, Wd, Ht, m);
    const g = el('g', {}, svg);
    axes(g, o, S, m, Wd, Ht, arrow);
    // Texte d'arrière-plan (par exemple l'année d'une animation), sous les points
    const bgT = o.bg != null ? txt(g, Wd - m.r - 6, Ht - m.b - 16, String(o.bg), 'ch-bg', { 'text-anchor': 'end' }) : null;
    const gp = el('g', {}, svg), gl = el('g', {}, svg);
    const tip = document.createElement('div'); tip.className = 'ch-tip'; container.appendChild(tip);
    const rr = o.radius || (p => 6);
    const items = new Map();       // clé → { c (cercle), lab (étiquette), p (point courant) }
    function make(it, first, i) {
      const c = el('circle', { class: first && o.animate !== false ? 'ch-pop' : '', style: first && o.animate !== false ? `animation-delay:${Math.min(1.2, i * 0.006)}s` : null }, gp);
      c.addEventListener('pointerenter', () => { const p = it.p, r = svg.getBoundingClientRect(), k = r.width / Wd; tip.innerHTML = (o.tip || (q => esc(q.label)))(p); tip.style.left = (S.X(p.x) * k) + 'px'; tip.style.top = ((S.Y(p.y) - rr(p)) * k) + 'px'; tip.classList.add('on'); c.setAttribute('stroke', '#000000'); });
      c.addEventListener('pointerleave', () => { tip.classList.remove('on'); c.setAttribute('stroke', it.p.hl ? '#fff' : 'none'); });
      it.c = c;
    }
    function draw(pts, first) {
      const seen = new Set();
      pts.slice().sort((a, b) => rr(b) - rr(a)).forEach((p, i) => {
        const key = p.key ?? i; seen.add(key);
        let it = items.get(key);
        if (!it) { it = {}; items.set(key, it); make(it, first, i); it.c.dataset.k = key; }
        it.p = p;
        const vis = p.x != null && p.y != null && p.x >= x.min && p.x <= x.max && p.y >= y.min && p.y <= y.max;
        it.c.style.display = vis ? '' : 'none';
        if (vis) {
          it.c.setAttribute('cx', S.X(p.x)); it.c.setAttribute('cy', S.Y(p.y)); it.c.setAttribute('r', rr(p));
          it.c.setAttribute('fill', col(p.color || o.color || 'blue')); it.c.setAttribute('fill-opacity', p.hl ? 0.95 : (o.opacity ?? 0.55));
          it.c.setAttribute('stroke', p.hl ? '#fff' : 'none'); it.c.setAttribute('stroke-width', 1.5);
        }
        if (p.hl && p.label) {
          if (!it.lab) { it.lab = txt(gl, 0, 0, p.label, 'ch-lab', { fill: darken(p.color || o.color || 'blue'), style: 'font-size:17px;font-weight:700' }); it.lab.dataset.k = key; }
          it.lab.style.display = vis ? '' : 'none';
          if (vis) { it.lab.setAttribute('x', S.X(p.x) + (p.dx ?? 12)); it.lab.setAttribute('y', S.Y(p.y) + (p.dy ?? -12)); it.lab.setAttribute('text-anchor', p.anchor || 'start'); }
        } else if (it.lab) it.lab.style.display = 'none';
      });
      items.forEach((it, key) => { if (!seen.has(key)) { it.c.style.display = 'none'; if (it.lab) it.lab.style.display = 'none'; } });
    }
    draw(o.points, true);
    // update(points) : redessine les mêmes points (repérés par p.key) à de nouvelles positions, pour les animations
    return { svg, S, m, update: pts => draw(pts, false), bg: t => { if (bgT) bgT.textContent = t; } };
  }

  /* --------------------------------------------------------------- barres horizontales */
  function hbars(container, o) {
    const { svg, Wd, Ht, arrow } = frame(container, o);
    const data = o.data;
    const labW = Math.max(...data.map(d => textW(d.label, 19))) + 24;
    const valW = Math.max(...data.map(d => textW(d.valueLabel ?? (o.format || (v => fmt(v, o.digits || 0)))(d.value), 19))) + 18;
    const m = Object.assign({ l: labW, r: valW + 10, t: o.yTitle ? 44 : 8, b: 8 }, o.margin || {});
    const max = o.max ?? Math.max(...data.map(d => d.value));
    const X = v => m.l + v / max * (Wd - m.l - m.r);
    const rowH = (Ht - m.t - m.b) / data.length, h = rowH * (o.barRatio || 0.62);
    const g = el('g', {}, svg);
    if (o.yTitle) txt(g, m.l, 22, o.yTitle, 'ch-ytitle', { 'text-anchor': 'start' });
    el('line', { x1: m.l, x2: m.l, y1: m.t - 4, y2: Ht - m.b + 2, class: 'ch-axis' }, g);
    data.forEach((d, i) => {
      const y = m.t + rowH * i + (rowH - h) / 2;
      txt(g, m.l - 14, y + h / 2 + 7, d.label, 'ch-tick', { 'text-anchor': 'end', style: d.bold ? 'font-weight:700' : null });
      el('rect', { x: m.l + 1.2, y, width: Math.max(1, X(d.value) - m.l - 1.2), height: h, fill: col(d.color || o.color), class: o.animate !== false ? 'ch-bar anim-x' : '', style: `animation-delay:${0.08 * i}s` }, g);
      txt(g, X(d.value) + 10, y + h / 2 + 7, d.valueLabel ?? (o.format || (v => fmt(v, o.digits || 0)))(d.value), 'ch-val', { fill: darken(d.color || o.color), class: 'ch-val' + (o.animate !== false ? ' ch-fade' : ''), style: `animation-delay:${0.08 * i + 0.4}s` });
    });
    return { svg };
  }

  /* --------------------------------------------------------------- barres horizontales empilées */
  function stack(container, o) {
    const { svg, Wd, Ht } = frame(container, o);
    const m = Object.assign({ l: 210, r: 30, t: 20, b: 20 }, o.margin || {});
    const rowH = (Ht - m.t - m.b) / o.rows.length;
    const max = o.max, X = v => m.l + v / max * (Wd - m.l - m.r);
    o.rows.forEach((row, i) => {
      const g = el('g', { 'data-row': i }, svg);
      const y = m.t + rowH * i + rowH * 0.18, h = rowH * (o.barRatio || 0.42);
      txt(g, m.l - 18, y + h / 2 + 7, row.label, 'ch-lab', { 'text-anchor': 'end', fill: '#000000' });
      let acc = 0;
      row.parts.forEach((p, j) => {
        const x0 = X(acc), w = X(acc + Math.abs(p.value)) - x0;
        const r = el('rect', { x: x0, y: y + (p.neg ? h + 6 : 0), width: Math.max(0, w - 2), height: p.neg ? h * 0.45 : h, fill: col(p.color), class: o.animate !== false ? 'ch-bar anim-x' : '', style: `animation-delay:${0.12 * j}s` }, g);
        r.addEventListener('pointerenter', () => r.setAttribute('opacity', .8)); r.addEventListener('pointerleave', () => r.setAttribute('opacity', 1));
        const lab = p.short ?? p.label;
        if (w > textW(lab, 16) + 12) txt(g, x0 + 10, y + (p.neg ? h + 6 + h * 0.45 / 2 + 6 : h / 2 - 3), lab, 'ch-small', { fill: '#fff', style: 'font-size:16px;font-weight:600' });
        if (w > textW(fmt(p.value), 16) + 12 && !p.neg) txt(g, x0 + 10, y + h / 2 + 19, fmt(p.value), 'ch-small', { fill: '#fff', style: 'font-size:16px;opacity:.9' });
        if (p.neg) { acc -= 0; }
        acc += p.neg ? 0 : Math.abs(p.value);
        if (p.neg) { const xm = X(acc - Math.abs(p.value)); r.setAttribute('x', xm); }
      });
    });
    return { svg };
  }

  /** Mélange une couleur avec du blanc : tint('blue', .5) */
  function tint(c, t) {
    c = col(c).replace('#', '');
    const n = parseInt(c, 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.round(v + (255 - v) * t);
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }
  window.Charts = { line, bars, hbars, grouped, scatter, stack, fmt, pct, darken, tint, col, PAL, niceTicks, logTicks, NB, el, txt, frame };
})();

;
