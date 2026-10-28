(function () {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const attr = s => esc(String(s == null ? '' : s).replace(/<[^>]+>/g, ''));
  const NB = ' ';
  const st = n => (n != null ? ` data-step="${n}"` : '');
  let uid = 0;
  const C = window.C = {
    NB,
    
    n(v, d = 0) { return Math.abs(v).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/ |\s/g, NB).replace(/^/, v < 0 ? '−' : ''); },
    pct(v, d = 1, sign = false) { return (sign && v > 0 ? '+' : '') + C.n(v, d) + NB + '%'; },
    link(url, text) { return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`; },
    
    s(step, html, tag = 'div', cls = '') { return `<${tag} class="${cls}" data-step="${step}">${html}</${tag}>`; },
    
    def(term, text, o = {}) {
      return `<div class="def ${o.cls || ''}" data-term="${attr(o.key || term)}"${st(o.step)}><div class="def-label">${o.label || 'Définition'}</div><div class="def-term">${term}</div><p class="def-text">${text}</p>${o.note ? `<p class="def-note">${o.note}</p>` : ''}</div>`;
    },
    
    rep(value, label, o = {}) {
      return `<span class="rep" data-rep="${attr(label)}" data-rep-value="${attr(o.value || value)}"${o.sub ? ` data-rep-sub="${attr(o.sub)}"` : ''} title="Repère : ${attr(label)}">${value}</span>`;
    },
    
    repCard(value, label, o = {}) {
      return `<div class="rep-card ${o.size || ''}" data-rep="${attr(label)}" data-rep-value="${attr(o.value || value)}"${o.sub ? ` data-rep-sub="${attr(o.sub)}"` : ''}${st(o.step)}><div class="rep-tag">Repère</div><div class="rep-value">${value}</div><div class="rep-label">${label}</div>${o.sub ? `<div class="rep-sub">${o.sub}</div>` : ''}</div>`;
    },
    callout(html, o = {}) { return `<div class="callout"${st(o.step)}>${o.label !== false ? `<span class="lbl">${o.label || 'À retenir'}</span>` : ''}${html}</div>`; },
    warn(html, o = {}) { return `<div class="warn"${st(o.step)}><span class="lbl">${o.label || 'Piège'}</span>${html}</div>`; },
    quote(text, src, o = {}) { return `<div${st(o.step)}><blockquote class="quote">${text}</blockquote><div class="quote-src">${src}</div></div>`; },
    frac(a, b) { return `<span class="frac"><span>${a}</span><span>${b}</span></span>`; },
    formula(html, o = {}) { return `<div class="formula ${o.cls || ''}"${st(o.step)}>${html}</div>`; },
    
    fiche(o = {}) {
      const p = (k, html) => (o.steps && o.steps[k] != null ? ` data-step="${o.steps[k]}"` : '');
      return `<div class="fiche ${o.cls || ''}"${st(o.step)}><div class="fiche-head"><span class="fiche-lbl">${o.label || 'À savoir utiliser'}</span>${o.name ? `<span class="fiche-name">${o.name}</span>` : ''}</div>`
        + `<div class="fiche-f">${o.formula}</div>`
        + (o.vars && o.vars.length ? `<div class="fiche-vars${o.varsInline ? ' inline' : ''}"${p('vars')}>${o.vars.map(([sym, mean]) => (o.varsInline
          ? `<span class="vp"><span class="sym">${sym}</span><span class="mean">${mean}</span></span>` : `<span class="sym">${sym}</span><span class="mean">${mean}</span>`)).join('')}</div>` : '')
        + (o.example ? `<div class="fiche-ex"${p('example')}><span class="lbl">Exemple</span>${o.example}</div>` : '')
        + (o.trap ? `<div class="fiche-trap"${p('trap')}><span class="lbl">Piège</span>${o.trap}</div>` : '')
        + `</div>`;
    },
    kpi(label, value, o = {}) { return `<div class="kpi ${o.color || ''}"${st(o.step)}><div class="k-label">${label}</div><div class="k-value"${o.id ? ` id="${o.id}"` : ''}>${value}</div>${o.sub ? `<div class="k-sub">${o.sub}</div>` : ''}</div>`; },
    
    photo(slug, o = {}) {
      const c = (window.CREDITS || {})[slug] || {};
      const src = (window.IMAGES || {})[slug] || '';
      return `<figure class="photo ${o.cls || ''}" tabindex="0" aria-expanded="false" title="Cliquer pour afficher la légende et le crédit" style="${o.h ? `height:${o.h}px;` : ''}${o.w ? `width:${o.w}px;` : ''}"${st(o.step)}><img src="${src}" alt="${attr(o.alt || c.caption_fr || '')}" style="object-position:${o.pos || 'center'}"><span class="illu-tag">Illustration <span class="i" aria-hidden="true">i</span></span><figcaption>${o.caption !== false ? `<b>${esc(o.caption || c.caption_fr || '')}</b><br>` : ''}${esc(c.credit_fr || '')}</figcaption></figure>`;
    },
    
    reveal(label, html, o = {}) {
      const id = 'rv' + (++uid);
      return `<div${st(o.step)}><button class="reveal-btn" aria-expanded="false" aria-controls="${id}">${label}</button><div class="reveal-body" id="${id}" hidden>${html}</div></div>`;
    },
    
    slider(id, label, min, max, step, value, o = {}) {
      return `<div class="ctrl ${o.color || ''}"><div class="ctrl-top"><label for="${id}">${label}</label><output id="${id}-out" for="${id}"></output></div><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}">${o.scale ? `<div class="scale"><span>${o.scale[0]}</span><span>${o.scale[1]}</span></div>` : ''}</div>`;
    },
    result(label, id, o = {}) { return `<div class="result"${st(o.step)}><div class="r-label">${label}</div><div class="r-value" id="${id}">–</div>${o.text !== false ? `<div class="r-text" id="${id}-txt">${o.text || ''}</div>` : ''}</div>`; },
    hyp(html) { return `<div class="hyp"><b>Hypothèses.</b> ${html}</div>`; },
    chart(id, h, o = {}) { return `<div class="chart" id="${id}" style="height:${h}px;${o.w ? `width:${o.w}px;` : ''}"${st(o.step)} aria-label="${attr(o.label || '')}"></div>`; },
    timer(seconds) {
      return `<div class="timer" data-timer="${seconds}"><div class="timer-display"></div><div class="btn-row"><button class="btn primary" data-t="start">Démarrer</button><button class="btn" data-t="pause">Pause</button><button class="btn" data-t="reset">Remettre à zéro</button></div></div>`;
    },
    
    
    check(items, o = {}) { return `<ul class="check"${st(o.step)}>${items.map(i => `<li><span>${i}</span></li>`).join('')}</ul>`; },
    table(head, rows, o = {}) {
      return `<table class="t ${o.cls || ''}"${st(o.step)}><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr class="${r.cls || ''}">${(r.cells || r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    },
    
    k(kind, html) { return `<span class="k-${kind}">${html}</span>`; },
    ext(label, title, html, after) { return { label, title, html, after }; }
  };
})();
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const PAL = { blue: '#001F5F', red: '#B45309', teal: '#526780', amber: '#B45309', violet: '#526780', slate: '#8A9BA8', grey: '#CFC7BA', ink: '#000000', nom: '#5F707D',
    olive: '#526780', prune: '#001F5F' };   
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
  
  function leader(g, x1, y1, x2, y2, stop, color) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L < stop + 9) return;
    const ux = dx / L, uy = dy / L, tx = x2 - ux * stop, ty = y2 - uy * stop, bx = tx - ux * 7, by = ty - uy * 7;
    el('line', { x1, y1, x2: bx, y2: by, stroke: color, 'stroke-width': 1.6 }, g);
    el('path', { d: `M${tx.toFixed(1)},${ty.toFixed(1)}L${(bx - uy * 3.8).toFixed(1)},${(by + ux * 3.8).toFixed(1)}L${(bx + uy * 3.8).toFixed(1)},${(by - ux * 3.8).toFixed(1)}Z`, fill: color }, g);
  }
  
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
    const mb0 = o.xTitle ? 74 : 48;    
    const mt = (o.margin && o.margin.t) ?? 62, mb = (o.margin && o.margin.b) ?? mb0;
    const Ypre = scales(o, Wd, Ht, { l: 0, r: 0, t: mt, b: mb }).Y;
    
    
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
    
    const lay = (k, at) => { const gg = el('g', anim ? { class: 'ch-fade', style: `animation-delay:${(stag * k + at).toFixed(2)}s` } : {}, g); return gg; };
    const dot = (gg, px, py, c) => el('circle', { cx: px, cy: py, r: 6.5, fill: col(c), stroke: '#fff', 'stroke-width': 2 }, gg);
    const boxes = [], lim = { l: m.l, W: Wd, t: m.t, b: Ht - m.b };
    (o.markers || []).forEach(mk => { if (mk.label) boxes.push(tbox(S.X(mk.x) + (mk.dx || 0), S.Y(mk.y) + (mk.dy ?? -16), textW(mk.label), mk.anchor || 'middle')); });
    const label = (gg, xx, yy, it, anchor) => {
      const t = el('text', { x: xx, y: yy, class: 'ch-lab', fill: darken(it.s.color), 'text-anchor': anchor || 'start' }, gg);
      if (it.name) { const a = el('tspan', {}, t); a.textContent = it.name; }
      if (it.val) { const b = el('tspan', { 'font-weight': 700, dx: it.name ? 8 : null, class: 'ch-num' }, t); b.textContent = it.val; }
    };
    
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
    
    const right = [[14, 7, 'start'], [12, 30, 'start'], [12, -14, 'start'], [16, 44, 'start'], [16, -28, 'start']];
    if (o.starts) o.series.forEach((s, k) => {
      const pts = PTS[k]; if (!pts.length || s.starts === false) return;
      const q = pts[0], px = S.X(q[0]), py = S.Y(q[1]), v = F(s)(q[1]), gg = lay(k, 0.15);
      dot(gg, px, py, s.color);
      const p = placeLabel(px, py, textW(v) * 1.06, right, polys, boxes, lim);
      label(gg, p.x, p.y, { s, name: '', val: v }, p.anchor);
    });
    
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

  
  function scatter(container, o) {
    const { svg, Wd, Ht, arrow } = frame(container, o);
    const x = o.x = Object.assign({}, o.x), y = o.y = Object.assign({}, o.y);
    const m = Object.assign({ l: 24 + Math.max(...(y.ticks || [y.min, y.max]).map(v => textW((y.format || (z => fmt(z, y.digits || 0)))(v)))), r: 40, t: 62, b: 74 }, o.margin || {});
    const S = scales(o, Wd, Ht, m);
    const g = el('g', {}, svg);
    axes(g, o, S, m, Wd, Ht, arrow);
    
    const bgT = o.bg != null ? txt(g, Wd - m.r - 6, Ht - m.b - 16, String(o.bg), 'ch-bg', { 'text-anchor': 'end' }) : null;
    const gp = el('g', {}, svg), gl = el('g', {}, svg);
    const tip = document.createElement('div'); tip.className = 'ch-tip'; container.appendChild(tip);
    const rr = o.radius || (p => 6);
    const items = new Map();       
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
    
    return { svg, S, m, update: pts => draw(pts, false), bg: t => { if (bgT) bgT.textContent = t; } };
  }

  
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

  
  function tint(c, t) {
    c = col(c).replace('#', '');
    const n = parseInt(c, 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.round(v + (255 - v) * t);
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }
  window.Charts = { line, bars, hbars, grouped, scatter, stack, fmt, pct, darken, tint, col, PAL, niceTicks, logTicks, NB, el, txt, frame };
})();
(function () {
  'use strict';
  const W = 1600, H = 900;
  const MODE = window.DECK_MODE || 'enseignant';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const st = { slides: [], els: [], steps: [], pages: [], pageTotal: 0, idx: 0, step: 0, handlers: {}, entered: new Set(), reading: false, panelReturn: null, idle: null };
  const D = window.Deck = {
    on(id, h) { st.handlers[id] = Object.assign(st.handlers[id] || {}, h); },
    goTo, next, prev, openPanel, closePanel, pageLabel,
    get index() { return st.idx; }, get step() { return st.step; }, get mode() { return MODE; },
    slideEl(id) { return st.els[st.slides.findIndex(s => s.id === id)]; },
    
    extHandlers: {}
  };

  const ICON = {
    prev: '<svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>',
    toc: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
    rep: '<svg viewBox="0 0 24 24"><path d="m12 3 9 9-9 9-9-9z"/></svg>',
    glo: '<svg viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>',
    notes: '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7"/></svg>',
    full: '<svg viewBox="0 0 24 24"><path d="M9 4H4v5M15 4h5v5M4 15v5h5M20 15v5h-5"/></svg>',
    help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/></svg>',
    read: '<svg viewBox="0 0 24 24"><path d="M4 5h7v14H4zM13 5h7v14h-7z"/></svg>'
  };

  
  function pageLabel(index = st.idx) {
    return st.pages[index] ? `${st.pages[index]} / ${st.pageTotal}`
      : st.slides[index].appendix ? 'Annexe' : 'Couverture';
  }
  function pageReference(index) {
    return st.pages[index] ? `la diapositive ${st.pages[index]}`
      : st.slides[index].appendix ? 'l’annexe' : 'la couverture';
  }

  
  function slideHTML(s, i) {
    const ext = (s.extensions || []).map((e, j) => `<button class="ext-btn" data-ext="${i}:${j}">${esc(e.label)}</button>`).join('');
    const prov = s.prov ? `<span class="prov prov-${s.prov}">${{ obs: 'Données observées', fictif: 'Exemple fictif', sim: 'Simulation', illu: 'Illustration', mixte: 'Données et exemple' }[s.prov] || esc(s.prov)}</span>` : '';
    if (s.layout === 'cover' || s.layout === 'raw') return s.html;
    const head = s.layout === 'section' ? '' :
      `<header class="slide-head"><h1>${s.title}</h1></header>`;
    const foot = `<footer class="slide-foot"><div class="source">${s.source || ''}</div><div class="foot-right">${ext}${prov}</div></footer>`;
    return `${head}<div class="slide-body">${s.html || ''}</div>${foot}`;
  }

  function build() {
    let slides = (window.SLIDES || []).slice();
    
    ([]).forEach(x => {
      const k = slides.findIndex(s => s.id === x.insertAfter);
      slides.splice(k < 0 ? slides.length : k + 1, 0, Object.assign({ teacherOnly: true }, x));
    });
    
    const N = {};
    slides = slides.map(s => Object.assign({}, s, { notes: N[s.id] || s.notes || null }));
    if (MODE === 'etudiant') slides = slides.filter(s => !s.teacherOnly).map(s => Object.assign({}, s, { notes: null }));
    st.slides = slides;
    let page = 0;
    st.pages = slides.map(s => s.layout === 'cover' || s.appendix ? null : ++page);
    st.pageTotal = page;
    document.title = (window.COURSE && window.COURSE.title) || document.title;
    document.body.insertAdjacentHTML('beforeend',
      `<div id="viewport"><div id="stage" role="region" aria-roledescription="présentation"></div></div>
       <nav id="toolbar" aria-label="Navigation">
         <button class="nav-only" id="tb-prev" title="Précédent (←)" aria-label="Précédent">${ICON.prev}</button>
         <span class="counter nav-only" id="tb-count"></span>
         <button class="nav-only" id="tb-next" title="Suivant (→ ou Espace)" aria-label="Suivant">${ICON.next}</button>
         <span class="sep"></span>
         <button id="tb-toc" title="Sommaire (S)">${ICON.toc}<span>Sommaire</span></button>
         <button id="tb-rep" title="Carnet de repères (R)">${ICON.rep}<span>Repères</span><span class="badge" id="tb-rep-n"></span></button>
         <button id="tb-glo" title="Glossaire (G)">${ICON.glo}<span>Définitions</span></button>
         ${MODE === 'enseignant' ? `<button id="tb-notes" title="Notes enseignant (N)">${ICON.notes}<span>Notes</span></button>` : ''}
         <span class="sep"></span>
         <button id="tb-read" title="Mode lecture : toutes les diapositives à la suite (L)">${ICON.read}</button>
         <button id="tb-full" title="Plein écran (F)">${ICON.full}</button>
         <button id="tb-help" title="Aide (?)">${ICON.help}</button>
         ${MODE === 'enseignant' ? '<span class="sep"></span><span class="badge" style="background:var(--violet);color:#fff" title="Ce fichier contient les notes et les corrigés : ne pas le distribuer aux étudiants.">Enseignant</span>' : ''}
       </nav>
       <div id="progress"><span></span></div>
       <div id="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title"><div class="box"><div class="box-head"><div><div class="kind" id="panel-kind"></div><h2 id="panel-title"></h2></div><button class="close" id="panel-close">Fermer · Échap</button></div><div class="box-body" id="panel-body"></div><div class="box-foot"><button class="back" id="panel-back">← Retour à la diapositive</button></div></div></div>
       <div id="blackout" title="Écran noir (B)"></div>
       `);
    const stage = $('#stage');
    stage.innerHTML = slides.map((s, i) => `<section class="slide ${s.layout === 'cover' ? 'cover' : ''} ${s.layout === 'section' ? 'section-open' : ''} ${s.cls || ''}" id="${esc(s.id)}" data-i="${i}" aria-label="${esc(plain(s.title || ''))}">${slideHTML(s, i)}${st.pages[i] ? `<span class="slide-page-number" aria-label="Page ${st.pages[i]} sur ${st.pageTotal}">${pageLabel(i)}</span>` : ''}</section>`).join('');
    st.els = $$('.slide', stage);
    if (MODE === 'etudiant') $$('.prof-only', stage).forEach(e => e.remove());
    frTypo(stage);
    st.steps = st.els.map(el => {
      const v = [...new Set($$('[data-step]', el).map(e => +e.dataset.step))].sort((a, b) => a - b);
      return v;
    });
    $('#tb-rep-n').textContent = collectReperes().length;
    bind();
    initWidgets(stage);
    fit();
    const [id, stp] = decodeURIComponent(location.hash.slice(1)).split('/');
    const start = Math.max(0, slides.findIndex(s => s.id === id));
    if (window.matchMedia('(max-width: 760px), (orientation: portrait) and (max-width: 1100px)').matches) setReading(true);
    goTo(start, stp ? +stp : 0, true);
  }
  const stripTags = s => String(s).replace(/<[^>]+>/g, '');
  
  const plain = s => { const d = document.createElement('div'); d.innerHTML = String(s); return d.textContent; };

  
  
  
  function frTypo(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest('script,style,code,kbd,pre') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = n.nodeValue.replace(/ ([;:?!»])/g, '\u202F$1').replace(/« /g, '«\u202F')
        .replace(/(\d) (?=\d{3}(?!\d))/g, '$1\u202F')                                   
        .replace(/(\d) (?=(%|€|k€|M€|Md€|Mt|Gt|°C|ans?\b|heures?\b|points?\b|h\b|t\b))/g, '$1\u00A0'); 
      if (t !== n.nodeValue) n.nodeValue = t;
    }
  }

  function fit() {
    if (st.reading) return fitReading();
    
    const vp = $('#viewport'), s = Math.min((vp.clientWidth || window.innerWidth) / W, (vp.clientHeight || window.innerHeight) / H);
    $('#stage').style.transform = `translate(${-W / 2 * s}px, ${-H / 2 * s}px) scale(${s})`;
    st.scale = s;
  }
  D.scale = () => st.scale || 1;

  
  function goTo(target, step = 0, instant) {
    let i = typeof target === 'string' ? st.slides.findIndex(s => s.id === target) : target;
    if (i < 0 || i >= st.slides.length) return;
    const prevI = st.idx;
    if (prevI !== i || instant) {
      const ph = st.handlers[st.slides[prevI].id];
      if (!instant && ph && ph.leave) try { ph.leave(st.els[prevI]); } catch (e) { console.error(e); }
      st.els.forEach((el, k) => el.classList.toggle('is-active', k === i));
    }
    st.idx = i;
    const steps = st.steps[i];
    st.step = step === 'end' ? steps.length : Math.max(0, Math.min(step, steps.length));
    applySteps(true);
    if (prevI !== i || instant || !st.entered.has(i)) enter(i);
    else {   
      const h = st.handlers[st.slides[i].id];
      if (h && h.step) try { h.step(st.els[i], st.step, { jump: true }); } catch (e) { console.error(e); }
    }
    paint();
  }
  function enter(i) {
    const s = st.slides[i], el = st.els[i], h = st.handlers[s.id];
    const first = !st.entered.has(i);
    st.entered.add(i);
    if (h && h.enter) try { h.enter(el, { first, step: st.step }); } catch (e) { console.error(e); }
    if (h && h.step) try { h.step(el, st.step, { jump: true }); } catch (e) { console.error(e); }
    document.dispatchEvent(new CustomEvent('deck:enter', { detail: { id: s.id, el, index: i } }));
  }
  function applySteps(jump) {
    const el = st.els[st.idx], vals = st.steps[st.idx];
    const lim = st.step > 0 ? vals[st.step - 1] : -Infinity;
    $$('[data-step]', el).forEach(e => {
      const on = +e.dataset.step <= lim;
      const was = e.classList.contains('on');
      e.classList.toggle('on', on);
      e.classList.toggle('past', on && +e.dataset.step < lim);
      if (on && !was) e.dispatchEvent(new CustomEvent('reveal', { bubbles: false }));
      if (on && e.dataset.revealChoices) revealChoices(e.dataset.revealChoices);
    });
    
    $$('[data-until]', el).forEach(e => e.classList.toggle('gone', lim > +e.dataset.until));
    const h = st.handlers[st.slides[st.idx].id];
    if (!jump && h && h.step) try { h.step(el, st.step, { jump: false }); } catch (e) { console.error(e); }
  }
  function next() {
    if (st.step < st.steps[st.idx].length) { st.step++; applySteps(false); paint(); }
    else if (st.idx < st.slides.length - 1) goTo(st.idx + 1, 0);
  }
  function prev() {
    if (st.step > 0) { st.step--; applySteps(false); paint(); }
    else if (st.idx > 0) goTo(st.idx - 1, 'end');
  }
  function paint() {
    const n = st.slides.length;
    $('#tb-count').textContent = pageLabel();
    $('#tb-prev').disabled = st.idx === 0 && st.step === 0;
    $('#tb-next').disabled = st.idx === n - 1 && st.step === st.steps[st.idx].length;
    $('#progress span').style.width = ((st.pages[st.idx] || (st.slides[st.idx].appendix ? st.pageTotal : 0)) / Math.max(1, st.pageTotal) * 100) + '%';
    const s = st.slides[st.idx];
    const hash = '#' + s.id + (st.step ? '/' + st.step : '');
    if (location.hash !== hash) history.replaceState(null, '', hash);
    const nb = $('#tb-notes'); if (nb) nb.disabled = !s.notes;
    document.dispatchEvent(new CustomEvent('deck:change', { detail: { index: st.idx, step: st.step, id: s.id, steps: st.steps[st.idx].length, count: n } }));
  }

  
  function openPanel(kind, title, html, opts = {}) {
    $('#panel-kind').textContent = kind || '';
    $('#panel-title').innerHTML = title || '';
    $('#panel-body').innerHTML = html || '';
    frTypo($('#panel-body'));
    $('#panel-body').scrollTop = 0;
    $('#panel').classList.add('on');
    st.panelReturn = document.activeElement;
    initWidgets($('#panel-body'));
    const after = typeof opts.after === 'string' ? D.extHandlers[opts.after] : opts.after;
    if (after) try { after($('#panel-body')); } catch (e) { console.error(e); }
    $('#panel-back').focus();
  }
  function closePanel() {
    if (!$('#panel').classList.contains('on')) return;
    $('#panel').classList.remove('on');
    if (st.panelReturn && st.panelReturn.focus) st.panelReturn.focus();
  }
  function toc() {
    let last = null, html = '';
    st.slides.forEach((s, i) => {
      const sec = s.part || 'Introduction';
      if (sec !== last) { html += `<div class="toc-sec">${esc(sec)}</div>`; last = sec; }
      html += `<button class="toc-item ${i === st.idx ? 'cur' : ''}" data-goto="${esc(s.id)}"><span class="n">${st.pages[i] || ''}</span><span>${stripTags(s.title || s.tocTitle || '')}</span></button>`;
    });
    openPanel('Sommaire', 'Parcourir le chapitre', html);
  }
  function collectReperes() {
    const out = [];
    st.els.forEach((el, i) => $$('[data-rep]', el).forEach(r => out.push({
      i, id: st.slides[i].id, part: st.slides[i].part || '', value: r.dataset.repValue || r.textContent.trim(),
      label: r.dataset.rep, sub: r.dataset.repSub || '', src: r.dataset.repSrc || ''
    })));
    const seen = new Set();
    return out.filter(r => { const k = r.value + '|' + r.label; if (seen.has(k)) return false; seen.add(k); return true; });
  }
  function reperes() {
    const list = collectReperes();
    let html = '<p class="xsmall">Les ordres de grandeur marqués ◆ dans le cours. Ils servent à repérer immédiatement un chiffre aberrant. Les valeurs sont arrondies ; la source exacte figure sur la diapositive.</p>';
    let last = null;
    list.forEach(r => {
      if (r.part !== last) { html += `${last !== null ? '</div>' : ''}<h3>${esc(r.part || 'Introduction')}</h3><div class="rep-list">`; last = r.part; }
      html += `<div class="rep-card sm"><div class="rep-tag">Repère</div><div class="rep-value">${esc(r.value)}</div><div class="rep-label">${esc(r.label)}</div>${r.sub ? `<div class="rep-sub">${esc(r.sub)}</div>` : ''}<button class="go" data-goto="${esc(r.id)}">Voir ${pageReference(r.i)} →</button></div>`;
    });
    if (last !== null) html += '</div>';
    openPanel('Carnet de repères', 'Les ordres de grandeur à connaître', html);
  }
  function glossary() {
    const defs = [];
    st.els.forEach((el, i) => $$('.def', el).forEach(d => {
      if (d.dataset.noglo !== undefined) return;
      defs.push({ i, id: st.slides[i].id, term: d.dataset.term || ($('.def-term', d) || {}).textContent || '', html: d.outerHTML });
    }));
    (window.GLOSSAIRE_EXTRA || []).forEach(g => defs.push({ i: -1, term: g.term, html: `<div class="def compact"><div class="def-term">${g.term}</div><p class="def-text">${g.text}</p></div>` }));
    const seen = new Set();
    const list = defs.filter(d => { const k = d.term.trim().toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' }));
    const html = '<p class="xsmall">Toutes les définitions encadrées du chapitre, par ordre alphabétique.</p>' + list.map(d =>
      `${d.html.replace('class="def', 'class="def compact')}${d.i >= 0 ? `<p class="xsmall" style="margin:-4px 0 18px"><button class="reveal-btn" style="font-size:15px" data-goto="${esc(d.id)}">Voir ${pageReference(d.i)}</button></p>` : ''}`).join('');
    openPanel('Glossaire', 'Définitions du chapitre', html);
  }
  function notes() {}
  function help() {
    openPanel('Aide', 'Utiliser le cours', `<div class="grid2">
      <div><h3>Avancer</h3><p><kbd>→</kbd> <kbd>Espace</kbd> étape ou diapositive suivante<br><kbd>←</kbd> revenir<br><kbd>Début</kbd> <kbd>Fin</kbd> première et dernière diapositive</p>
      <h3>Projeter</h3><p><kbd>F</kbd> plein écran · <kbd>B</kbd> écran noir<br>La barre d'outils disparaît quand la souris ne bouge pas.</p></div>
      <div><h3>Retrouver</h3><p><kbd>S</kbd> sommaire · <kbd>R</kbd> carnet de repères · <kbd>G</kbd> définitions${MODE === 'enseignant' ? ' · <kbd>N</kbd> notes' : ''}<br><kbd>L</kbd> mode lecture (toutes les diapositives à la suite)<br><kbd>Échap</kbd> fermer un panneau</p>
      <h3>Lire les codes</h3><p><span class="rep" data-x>◆ Repère</span> ordre de grandeur à retenir ; encadré bleu : définition ; bouton violet : approfondissement facultatif ; étiquette en bas à droite : données observées, exemple fictif ou simulation.</p></div></div>
      <p class="xsmall mt-m">Les graphiques sont tracés à partir des données embarquées dans le fichier ; il fonctionne sans connexion. Survolez une courbe (ou utilisez les flèches après l'avoir sélectionnée) pour lire les valeurs.</p>`);
  }

  
  
  function advanceAfterChoice(g) {
    if (st.reading || g.dataset.advanced) return;
    const el = g.closest('.slide'), i = st.els.indexOf(el);
    if (i !== st.idx) return;
    const vals = st.steps[i];
    const lim = st.step > 0 ? vals[st.step - 1] : -Infinity;
    const rv = el.querySelector(`[data-reveal-choices="${g.id}"]`);
    let target;
    if (rv) target = vals.indexOf(+rv.dataset.step) + 1;          
    else if (st.step < vals.length) target = st.step + 1;
    if (!target || target <= st.step) return;
    const own = g.closest('[data-step]');
    if (own && +own.dataset.step > lim) return;                    
    g.dataset.advanced = '1';
    setTimeout(() => { let guard = 20; while (st.idx === i && st.step < target && guard--) next(); }, 260);
  }

  
  function revealChoices(gid) {
    const g = document.getElementById(gid);
    if (!g || g.classList.contains('revealed')) return;
    g.classList.add('revealed');
    const fb = document.getElementById(gid + '-fb');
    if (fb && fb.dataset.text) { fb.innerHTML = fb.dataset.text; frTypo(fb); }   
  }
  D.revealChoices = revealChoices;
  function initWidgets(root) {
    $$('input[type=range]', root).forEach(r => {
      const upd = () => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
      r.addEventListener('input', upd); upd();
    });
    $$('[data-timer]', root).forEach(t => {
      if (t.dataset.ready) return; t.dataset.ready = 1;
      const total = +t.dataset.timer; let left = total, id = null;
      const disp = $('.timer-display', t);
      const show = () => { disp.textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`; t.classList.toggle('done', left === 0); };
      $('[data-t=start]', t).onclick = () => { if (id) return; id = setInterval(() => { left = Math.max(0, left - 1); show(); if (!left) { clearInterval(id); id = null; } }, 1000); };
      $('[data-t=pause]', t).onclick = () => { clearInterval(id); id = null; };
      $('[data-t=reset]', t).onclick = () => { clearInterval(id); id = null; left = total; show(); };
      show();
    });
  }

  
  function setReading(on) {
    st.reading = on;
    document.body.classList.toggle('reading', on);
    const stage = $('#stage');
    if (on) {
      st.els.forEach((el, i) => {
        if (!el.parentElement.classList.contains('slide-wrap')) { const w = document.createElement('div'); w.className = 'slide-wrap'; el.before(w); w.appendChild(el); }
        el.classList.add('show-all');
        if (!st.entered.has(i)) { st.entered.add(i); const h = st.handlers[st.slides[i].id]; if (h && h.enter) try { h.enter(el, { first: true, reading: true, step: 99 }); } catch (e) { console.error(e); } if (h && h.step) try { h.step(el, 99, { jump: true }); } catch (e) { } }
      });
      fitReading();
      st.els[st.idx].parentElement.scrollIntoView();
    } else {
      $$('.slide-wrap', stage).forEach(w => { w.before(w.firstElementChild); w.remove(); });
      st.els.forEach(el => { el.classList.remove('show-all'); el.style.transform = ''; });
      fit(); goTo(st.idx, st.step, true);
    }
  }
  function fitReading() {
    const avail = Math.min(window.innerWidth - 16, W);
    const s = avail / W;
    $$('.slide-wrap').forEach(w => { w.style.width = avail + 'px'; w.style.height = (H * s) + 'px'; });
    st.els.forEach(el => { el.style.transform = `scale(${s})`; });
  }

  
  function bind() {
    $('#tb-prev').onclick = prev; $('#tb-next').onclick = next;
    $('#tb-toc').onclick = toc; $('#tb-rep').onclick = reperes; $('#tb-glo').onclick = glossary; $('#tb-help').onclick = help;
    if ($('#tb-notes')) $('#tb-notes').onclick = notes;
    $('#tb-read').onclick = () => setReading(!st.reading);
    $('#tb-full').onclick = toggleFull;
    $('#panel-close').onclick = closePanel; $('#panel-back').onclick = closePanel;
    $('#panel').addEventListener('click', e => { if (e.target.id === 'panel') closePanel(); });
    $('#blackout').onclick = () => $('#blackout').classList.remove('on');
    window.addEventListener('resize', fit);
    window.addEventListener('hashchange', () => { const [id, s] = decodeURIComponent(location.hash.slice(1)).split('/'); const i = st.slides.findIndex(x => x.id === id); if (i >= 0 && (i !== st.idx || (+s || 0) !== st.step)) goTo(i, +s || 0); });
    window.addEventListener('beforeprint', () => st.els.forEach((el, i) => { el.classList.add('show-all'); if (!st.entered.has(i)) { st.entered.add(i); const h = st.handlers[st.slides[i].id]; if (h && h.enter) try { h.enter(el, { first: true, print: true, step: 99 }); if (h.step) h.step(el, 99, { jump: true }); } catch (e) { } } }));
    window.addEventListener('afterprint', () => { if (!st.reading) st.els.forEach(el => el.classList.remove('show-all')); });
    document.addEventListener('click', e => {
      const go = e.target.closest('[data-goto]');
      if (go) { e.preventDefault(); closePanel(); if (st.reading) setReading(false); goTo(go.dataset.goto, 0); return; }
      const ex = e.target.closest('[data-ext]');
      if (ex) { const [i, j] = ex.dataset.ext.split(':').map(Number); const x = st.slides[i].extensions[j]; openPanel('Aller plus loin', x.title || x.label, x.html, { after: x.after }); return; }
      const ch = e.target.closest('.choice');
      if (ch) {
        const g = ch.closest('.choices');
        if (!g.classList.contains('revealed')) { $$('.choice', g).forEach(c => c.classList.toggle('picked', c === ch)); }
        ch.blur();               
        
        return;
      }
      const rc = e.target.closest('[data-show-answer]');
      if (rc) { revealChoices(rc.dataset.showAnswer); return; }
      const rb = e.target.closest('.reveal-btn[aria-expanded]');
      if (rb) { const body = document.getElementById(rb.getAttribute('aria-controls')); const open = rb.getAttribute('aria-expanded') !== 'true'; rb.setAttribute('aria-expanded', String(open)); if (body) body.hidden = !open; return; }
      const ph = e.target.closest('.photo');   
      if (ph && !e.target.closest('a')) { ph.classList.toggle('cap-on'); ph.setAttribute('aria-expanded', ph.classList.contains('cap-on')); return; }
      const fl = e.target.closest('.flip');
      if (fl) { fl.classList.toggle('flipped'); fl.setAttribute('aria-pressed', fl.classList.contains('flipped')); }
    });
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if ($('#panel').classList.contains('on')) { if (k === 'Escape') { e.preventDefault(); closePanel(); } return; }
      if ($('#blackout').classList.contains('on')) { e.preventDefault(); $('#blackout').classList.remove('on'); return; }
      const t = e.target;
      if (t.matches && t.matches('input,textarea,select,[contenteditable],[data-keys]')) { if (k === 'Escape') t.blur(); return; }
      if ((k === ' ' || k === 'Enter') && t.closest && t.closest('button,a,.flip')) return;
      if (k === 'Enter' && t.closest && t.closest('.photo')) { const ph = t.closest('.photo'); ph.classList.toggle('cap-on'); ph.setAttribute('aria-expanded', ph.classList.contains('cap-on')); return; }
      if (st.reading && !['l', 'L', 'Escape'].includes(k)) { if (['s', 'S', 'r', 'R', 'g', 'G', '?'].includes(k)) { } else return; }
      switch (k) {
        case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); next(); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
        case 'Home': e.preventDefault(); goTo(0, 0); break;
        case 'End': e.preventDefault(); goTo(st.slides.length - 1, 0); break;
        case 's': case 'S': toc(); break;
        case 'r': case 'R': reperes(); break;
        case 'g': case 'G': glossary(); break;
        case 'n': case 'N': notes(); break;
        case 'f': case 'F': toggleFull(); break;
        case 'b': case 'B': case '.': $('#blackout').classList.add('on'); break;
        case 'l': case 'L': setReading(!st.reading); break;
        case '?': case 'h': case 'H': help(); break;
      }
    });
    let sx = null;
    $('#viewport').addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    $('#viewport').addEventListener('touchend', e => { if (sx == null || st.reading) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60 && !e.target.closest('input,.chart')) (dx < 0 ? next : prev)(); sx = null; });
    
    
    
    const wake = () => { $('#toolbar').classList.remove('hide'); clearTimeout(st.idle); st.idle = setTimeout(() => { if (!$('#toolbar').matches(':hover') && !$('#toolbar').contains(document.activeElement)) $('#toolbar').classList.add('hide'); }, 2400); };
    document.addEventListener('mousemove', wake); document.addEventListener('fullscreenchange', wake);
    $('#toolbar').addEventListener('focusin', wake);
    wake();
  }
  async function toggleFull() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch (e) { }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => (document.fonts ? document.fonts.ready : Promise.resolve()).then(build));
  else (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);
})();
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  
  const PJ = window.PJ = {
    
    zoom(id, z = 1.25) {
      const box = typeof id === 'string' ? document.getElementById(id) : id;
      if (!box) return null;
      box.innerHTML = '';
      box.classList.add('p-zoom');
      const w = box.clientWidth || parseFloat(box.style.width) || 800, h = box.clientHeight || parseFloat(box.style.height) || 450;
      const inner = document.createElement('div');
      inner.className = 'p-zin';
      inner.style.width = (w / z) + 'px'; inner.style.height = (h / z) + 'px'; inner.style.transform = `scale(${z})`;
      box.appendChild(inner);
      return inner;
    },
    
    scenes(id, draw, last = 99) {
      let cur = null;
      Deck.on(id, {
        enter(el, ctx) { cur = ctx.reading || ctx.print ? last : Math.min(ctx.step || 0, last); draw(cur, !(ctx.reading || ctx.print)); },
        step(el, n, o) { n = Math.min(n, last); if (o.jump && n === cur) return; cur = n; draw(n, !o.jump); }
      });
    },
    
    atStep(id, n, box, draw) {
      Deck.on(id, {
        enter(el, ctx) { const b = document.getElementById(box); b.innerHTML = ''; if ((ctx.step || 0) >= n || ctx.reading || ctx.print) draw(!(ctx.reading || ctx.print)); },
        step(el, s, o) { const b = document.getElementById(box); if (s >= n && !b.firstChild) draw(!o.jump); if (s < n) b.innerHTML = ''; }
      });
    }
  };

  
  const SIGN = /([−+×÷≈=]) (?=[\d(−+])/g;
  
  function signs(root, full) {
    if (!root) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest('script,style,code,kbd,pre') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      let t = n.nodeValue.replace(SIGN, '$1\u202F');
      if (full) t = t.replace(/ ([;:?!»])/g, '\u202F$1').replace(/« /g, '«\u202F').replace(/(\d) (?=\d{3}(?!\d))/g, '$1\u202F')
        .replace(/(\d) (?=(%|€|ans?\b|heures?\b|points?\b|min\b|h\b))/g, '$1\u00A0');
      if (t !== n.nodeValue) n.nodeValue = t;
    }
  }
  PJ.signs = signs;
  if (document.body && document.body.classList.contains('proj')) {
    document.addEventListener('deck:enter', function first() { document.removeEventListener('deck:enter', first); signs($('#stage')); });
    document.addEventListener('deck:change', () => signs($('#stage .slide.is-active')));
  }

  })();
(function(){
'use strict';
const D = window.DATA, R = window.REPERES, CH = window.Charts, PJ = window.PJ;
const { fmt } = CH;
const NB = ' ';
const byId = id => document.getElementById(id);
const pairs = (rows, xi, yi) => rows.filter(r => r[yi] != null).map(r => [r[xi], r[yi]]);
const seg = (svg, x1, y1, x2, y2, attrs) => CH.el('line', Object.assign({ x1, y1, x2, y2 }, attrs), svg);
const halo = (svg, sel = 'text') => svg.querySelectorAll(sel).forEach(t => { t.style.paintOrder = 'stroke'; t.style.stroke = '#FBFAF6'; t.style.strokeWidth = '5px'; t.style.strokeLinejoin = 'round'; });
const T = (svg, x, y, s, o = {}) => CH.txt(svg, x, y, s, o.cls || '', Object.assign({ 'text-anchor': o.anchor || 'start', fill: o.fill || '#000000',
    'font-family': 'Inter, ui-sans-serif, system-ui, sans-serif', 'font-size': o.size || 24, 'font-weight': o.weight || 600,
    style: String(s).includes('-') ? 'font-variant-numeric:lining-nums' : 'font-variant-numeric:tabular-nums lining-nums' }, o.attrs || {}));
const tw = (s, size) => String(s).length * size * 0.56;
function legend(box, items) {
    const d = document.createElement('div'); d.className = 'pj-chleg';
    d.innerHTML = items.map(([name, color, dash]) => `<span><i style="${dash ? `background:repeating-linear-gradient(90deg,${color} 0 6px,transparent 6px 10px);height:4px;width:1.4em;border-radius:0` : `background:${color}`}"></i>${name}</span>`).join('');
    box.appendChild(d);
    return d;
  }
function zline(id, z, o, leg) {
    const box = PJ.zoom(id, z);
    const res = CH.line(box, Object.assign({ height: box.clientHeight - (leg ? 46 : 0), legend: false, hover: true }, o));
    if (leg) legend(box, leg);
    res.box = box;
    return res;
  }
const once = (id, draw) => Deck.on(id, { enter(el, ctx) { draw(!(ctx.reading || ctx.print), ctx); } });
function scenes(id, draw, last = 99) {
    let cur = null;
    Deck.on(id, {
      enter(el, ctx) { const ro = ctx.reading || ctx.print; cur = ro ? last : Math.min(ctx.step || 0, last); draw(cur, !ro, true, null); },
      step(el, n, o) { n = Math.min(n, last); if (o.jump && n === cur) return; const prev = cur; cur = n; draw(n, !o.jump, false, prev); }
    });
  }
const BLUE = CH.PAL.blue, RED = CH.PAL.red, SLATE = CH.PAL.slate;
once('emissions-monde', animate => {
    const rows = D.monde_co2.filter(r => r[0] >= 1960 && r[2] != null), b = rows.find(r => r[0] === 1990);
    zline('pj-em', 1.2, { animate, duration: 2, stagger: 0.3, ends: true,
      x: { min: 1960, max: 2024, ticks: [1960, 1980, 2000, 2024] },
      y: { min: 0, max: 300, ticks: [0, 100, 200, 300] }, yTitle: 'Indice, 1990 = 100',
      series: [{ name: 'PIB mondial', color: 'blue', data: rows.map(r => [r[0], r[2] / b[2] * 100]), endLabel: 'PIB mondial', format: x => fmt(x, 0) },
               { name: 'CO₂ fossile', color: 'red', data: rows.map(r => [r[0], r[1] / b[1] * 100]), endLabel: 'CO₂', format: x => fmt(x, 0) }] });
  });
function drawTri(upto, animate, from) {
    const box = byId('pj-tri'); box.innerHTML = '';
    const W = box.clientWidth, H = box.clientHeight;
    const A = D.fr_approches_2025, Pd = A.production, Rv = A.revenus, Dm = A.demande;
    const max = Dm.c_menages + Dm.c_isblsm + Dm.c_apu + Dm.fbcf + Dm.stocks + Dm.objets + Dm.x;
    const m = { l: 2, r: 72 }, X = x => m.l + x / max * (W - m.l - m.r);
    const rows = [
      { lab: 'Par la production', c: 'blue', parts: [['Valeur ajoutée', Pd.va], ['Impôts', Pd.imp_prod + Pd.sub_prod]] },
      { lab: 'Par les revenus', c: 'teal', parts: [['Salaires', Rv.remu], ['Profits', Rv.ebe_rm], ['Impôts', Rv.impots + Rv.subv]] },
      { lab: 'Par les dépenses', c: 'red', parts: [['C', Dm.c_menages + Dm.c_isblsm], ['G', Dm.c_apu], ['I', Dm.fbcf + Dm.stocks + Dm.objets], ['X', Dm.x]] }
    ];
    const svg = CH.el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Le PIB français de 2025 par la production, les revenus et les dépenses, milliards d\'euros' }, box);
    const defs = CH.el('defs', {}, svg), pat = CH.el('pattern', { id: 'pj-hatch', width: 10, height: 10, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    CH.el('rect', { width: 10, height: 10, fill: '#fff' }, pat); CH.el('line', { x1: 0, y1: 0, x2: 0, y2: 10, stroke: CH.tint('red', 0.35), 'stroke-width': 5 }, pat);
    const tints = [0, 0.3, 0.52, 0.7], top = 96, rowH = 166, bh = 76;
    rows.forEach((row, i) => {
      if (i >= upto) return;
      const y = top + i * rowH, an = animate && i >= from;
      const g = CH.el('g', { class: an ? 'ch-fade' : '' }, svg);
      T(g, m.l, y - 14, row.lab, { size: 26, weight: 700, fill: CH.darken(row.c) });
      let acc = 0;
      row.parts.forEach(([name, val], j) => {
        const x0 = X(acc), w = X(acc + val) - x0, col = tints[j] > 0.45 ? '#000000' : '#fff';
        CH.el('rect', { x: x0, y, width: Math.max(0, w - 3), height: bh, fill: CH.tint(row.c, tints[j]), class: an ? 'ch-bar anim-x' : '', style: `animation-delay:${0.15 * j}s` }, g);
        if (w > tw(name, 22) + 22) T(g, x0 + 11, y + 31, name, { size: 22, weight: 600, fill: col });
        if (w > tw(fmt(val, 0), 24) + 18) T(g, x0 + 11, y + 62, fmt(val, 0), { size: 24, weight: 700, fill: col });
        acc += val;
      });
      if (i === 2) {
        const yM = y + bh + 12;
        CH.el('rect', { x: X(A.pib), y: yM, width: X(max) - X(A.pib) - 3, height: 40, fill: 'url(#pj-hatch)', stroke: RED, 'stroke-width': 2 }, g);
        T(g, X(max) + 8, yM + 29, '− M', { size: 24, weight: 700, fill: CH.darken('red') });
        T(g, X(A.pib) - 12, yM + 29, `importations ${fmt(Dm.m, 0)}, déjà dans C, I, G, X`, { size: 22, weight: 600, anchor: 'end', fill: CH.darken('red') });
      }
    });
    seg(svg, X(A.pib), 40, X(A.pib), H - 4, { stroke: '#000000', 'stroke-width': 2, 'stroke-dasharray': '6 6' });
    T(svg, X(A.pib), 28, `PIB = ${fmt(A.pib, 0)} Md€`, { size: 24, weight: 700, anchor: 'middle' });
    halo(svg, 'text[text-anchor=middle]');
  }
scenes('trois-approches', (s, animate, entering, prev) => {
    const u = Math.min(s, 2) + 1, before = entering || prev == null ? 0 : Math.min(prev, 2) + 1;
    drawTri(u, animate, entering ? 0 : before);
  }, 3);
once('france-1950', animate => {
    const rows = D.fr_annuel.rows.filter(r => r[0] >= 1950);
    zline('pj-f50', 1.2, { animate, duration: 2, stagger: 0.4, ends: true, starts: true,
      x: { min: 1950, max: 2025, ticks: [1950, 1970, 1990, 2010, 2025] },
      y: { log: true, min: 10, max: 5000, ticks: [10, 20, 50, 100, 200, 500, 1000, 2000, 5000] },
      yTitle: 'Milliards d\'euros, échelle logarithmique',
      series: [{ name: 'Euros courants', color: 'nom', data: rows.map(r => [r[0], r[1]]), endLabel: 'en valeur', format: x => fmt(x, 0) },
               { name: 'Volume, euros de 2020', color: 'blue', data: rows.map(r => [r[0], r[2]]), endLabel: 'en volume', format: x => fmt(x, 0) }] });
  });
function zgrouped(id, o) {
    const box = PJ.zoom(id, 1.2);
    const res = CH.grouped(box, Object.assign({ height: box.clientHeight }, o));
    res.svg.querySelectorAll('text.ch-val').forEach(t => { t.style.fontSize = '19px'; });
    res.box = box;
    return res;
  }
let crsMode = null;
function drawCourses(mode, animate) {
    const rows = D.fr_ipc_mensuel.filter(r => r[0] >= '2019-01'), b0 = rows[0];
    const t = m => +m.slice(0, 4) + (+m.slice(5, 7) - 1) / 12;
    const o = { animate, duration: 1.8, stagger: 0.25, ends: true, x: { min: 2019, max: 2026.75, ticks: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] } };
    if (mode === 'niveau') zline('pj-crs', 1.2, Object.assign(o, {
      y: { min: 95, max: 130, ticks: [95, 100, 105, 110, 115, 120, 125, 130] }, yTitle: 'Niveau des prix, janvier 2019 = 100',
      series: [{ name: 'Alimentation', color: 'red', data: rows.filter(r => r[2] != null).map(r => [t(r[0]), r[2] / b0[2] * 100]), endLabel: 'Alimentation', format: x => fmt(x, 0) },
               { name: 'Ensemble', color: 'blue', data: rows.map(r => [t(r[0]), r[1] / b0[1] * 100]), endLabel: 'Ensemble', format: x => fmt(x, 0) }] }));
    else zline('pj-crs', 1.2, Object.assign(o, {
      y: { min: -2, max: 18, ticks: [0, 4, 8, 12, 16] }, yTitle: 'Hausse des prix sur un an, %',
      series: [{ name: 'Alimentation', color: 'red', data: rows.filter(r => r[4] != null).map(r => [t(r[0]), r[4]]), endLabel: 'Alimentation', format: x => fmt(x, 1) },
               { name: 'Ensemble', color: 'blue', data: rows.filter(r => r[3] != null).map(r => [t(r[0]), r[3]]), endLabel: 'Ensemble', format: x => fmt(x, 1) }] }));
  }
scenes('courses', (s, animate) => {
    const mode = 'taux';
    if (mode === crsMode && byId('pj-crs').firstChild) return;
    crsMode = mode; drawCourses(mode, animate);
  }, 2);
Deck.on('courses', { leave() { crsMode = null; } });
const BCL = D.bcl;
const ltOpts = { duration: 2.2, stagger: 0.3, ends: true, starts: true, x: { min: 1890, max: 2024, ticks: [1890, 1930, 1970, 2024] } };
const drawLTP = animate => zline('pj-ltp', 1.2, Object.assign({ animate }, ltOpts, {
    y: { log: true, min: 2, max: 100, ticks: [2, 5, 10, 20, 50, 100] }, yTitle: 'Production par heure, dollars de 2020 (log)',
    series: [{ name: 'France', color: 'blue', data: pairs(BCL, 0, 2), endLabel: 'France', format: x => fmt(x, 1) },
             { name: 'États-Unis', color: 'slate', data: pairs(BCL, 0, 5), endLabel: 'États-Unis', format: x => fmt(x, 1) }] }));
const drawLTH = animate => zline('pj-lth', 1.2, Object.assign({ animate }, ltOpts, {
    y: { min: 0, max: 1600, ticks: [0, 400, 800, 1200, 1600] }, yTitle: 'Heures travaillées par habitant et par an',
    series: [{ name: 'France', color: 'blue', data: pairs(BCL, 0, 3), endLabel: 'France', format: x => fmt(x, 0) },
             { name: 'États-Unis', color: 'slate', data: pairs(BCL, 0, 6), endLabel: 'États-Unis', format: x => fmt(x, 0) }] }));
Deck.on('long-terme', {
    enter(el, ctx) { const ro = ctx.reading || ctx.print; drawLTP(!ro); byId('pj-lth').innerHTML = ''; if ((ctx.step || 0) >= 1 || ro) drawLTH(!ro); },
    step(el, n, o) { const b = byId('pj-lth'); if (n >= 1 && !b.firstChild) drawLTH(!o.jump); if (n < 1) b.innerHTML = ''; }
  });
once('us-mediane', animate => zline('pj-usm', 1.2, { animate, duration: 2, stagger: 0.3, ends: true,
    x: { min: 1984, max: 2025, ticks: [1984, 1995, 2005, 2015, 2025] },
    y: { min: 80, max: 220, ticks: [80, 100, 120, 140, 160, 180, 200, 220] }, yTitle: 'Indice, 1984 = 100, termes réels',
    series: [{ name: 'PIB réel par habitant', color: 'blue', data: pairs(D.us_revenus, 0, 6), endLabel: 'PIB par habitant', format: x => fmt(x, 0) },
             { name: 'Revenu médian des ménages', color: 'teal', data: pairs(D.us_revenus, 0, 4), endLabel: 'Revenu médian', format: x => fmt(x, 0) }] }));
once('redistribution', animate => {
    const r = D.fr_niveaux_de_vie.find(x => x[0] === 2024);
    zgrouped('pj-red', { animate, categories: ['D1', 'Médiane', 'D9'], y: { min: -10, max: 12, ticks: [-10, -5, 0, 5, 10] },
      yTitle: 'Niveau de vie, 2008-2024, %, euros constants', format: x => (x > 0 ? '+' : '') + fmt(x, 1),
      series: [{ name: 'Avant impôts et prestations', color: 'slate', values: [r[4] - 100, r[5] - 100, r[6] - 100] }, { name: 'Après redistribution', color: 'blue', values: [r[7] - 100, r[8] - 100, r[9] - 100] }] });
  });
const PR = D.preston, PR0 = PR.an[0], PR1 = PR.an[1];
const PR_HL = { FRA: ['France', 'blue'], USA: ['États-Unis', 'red'], CHN: ['Chine', 'amber'], IND: ['Inde', 'amber'], NGA: ['Nigeria', 'amber'], KOR: ['Corée du Sud', 'violet'] };
const prRad = p => Math.max(3, Math.sqrt(p.pop) * 0.8);
function prPoints(t) {
    const y0 = Math.floor(t + 1e-9), f = t - y0, k0 = y0 - PR0, k1 = Math.min(k0 + 1, PR1 - PR0);
    return PR.pays.map(([iso, nom], i) => {
      const g0 = PR.g[i][k0], g1 = PR.g[i][k1], e0 = PR.e[i][k0], e1 = PR.e[i][k1], p0 = PR.p[i][k0], p1 = PR.p[i][k1];
      let x = null, y = null, pop = 0;
      if (g0 != null && e0 != null) {
        if (f > 1e-6 && g1 != null && e1 != null) { x = Math.exp(Math.log(g0) + f * (Math.log(g1) - Math.log(g0))); y = e0 + f * (e1 - e0); pop = (p0 + f * (p1 - p0)) / 1000; }
        else { x = g0; y = e0; pop = p0 / 1000; }
      }
      const h = PR_HL[iso];
      return { key: iso, x, y, pop, name: nom, yr: y0, hl: !!h, label: h ? h[0] : null, color: h ? h[1] : 'slate' };
    });
  }
let prChart = null, prT = PR1, prRaf = null, prLast = 0, prStep = 0;
const prPrev = {};
function prLabels(pts) {
    const S = prChart.S, hl = pts.filter(p => p.hl && p.x != null);
    const order = ['USA', 'FRA', 'CHN', 'IND', 'NGA', 'KOR'];
    hl.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
    const discs = hl.map(p => ({ x: S.X(p.x), y: S.Y(p.y), r: prRad(p) }));
    const placed = [];
    const box = (x, y, w, a) => { const x0 = a === 'start' ? x : a === 'end' ? x - w : x - w / 2; return { x0, x1: x0 + w, y0: y - 16, y1: y + 4 }; };
    const cost = b => placed.reduce((a, q) => a + Math.max(0, Math.min(b.x1, q.x1) - Math.max(b.x0, q.x0)) * Math.max(0, Math.min(b.y1, q.y1) - Math.max(b.y0, q.y0)), 0) +
      discs.reduce((a, d) => { const cx = Math.max(b.x0, Math.min(d.x, b.x1)), cy = Math.max(b.y0, Math.min(d.y, b.y1)), dd = Math.hypot(cx - d.x, cy - d.y); return a + (dd < d.r ? (d.r - dd) * 30 : 0); }, 0);
    hl.forEach(p => {
      const x = S.X(p.x), y = S.Y(p.y), r = prRad(p), w = p.label.length * 10.6 + 4;
      const cand = [[r + 7, 7, 'start'], [-r - 7, 7, 'end'], [0, -r - 9, 'middle'], [0, r + 21, 'middle'],
        [r * 0.7 + 5, -r * 0.7 - 5, 'start'], [-r * 0.7 - 5, -r * 0.7 - 5, 'end'], [r * 0.7 + 5, r * 0.7 + 18, 'start'], [-r * 0.7 - 5, r * 0.7 + 18, 'end']];
      const prev = prPrev[p.key];
      if (prev) cand.unshift([prev[0] * (prev[3] ? r / prev[3] : 1), prev[1] * (prev[3] ? r / prev[3] : 1), prev[2]]);
      let best = cand.find(c => cost(box(x + c[0], y + c[1], w, c[2])) <= 0);
      if (!best) best = cand.reduce((mm, c) => { const val = cost(box(x + c[0], y + c[1], w, c[2])); return val < mm[0] ? [val, c] : mm; }, [Infinity, cand[0]])[1];
      p.dx = best[0]; p.dy = best[1]; p.anchor = best[2];
      prPrev[p.key] = [best[0], best[1], best[2], r];
      placed.push(box(x + best[0], y + best[1], w, best[2]));
    });
  }
function prDraw(t) {
    prT = t;
    if (!prChart) return;
    const pts = prPoints(t);
    prLabels(pts);
    prChart.update(pts); prChart.bg(String(Math.floor(t + 1e-9)));
    prChart.svg.querySelectorAll('text.ch-lab').forEach(e => { e.style.fontSize = '19px'; });
  }
function prStop() { if (prRaf) cancelAnimationFrame(prRaf); prRaf = null; }
function prPlay() {
    prStop(); prT = PR0; prLast = performance.now();
    const tick = now => {
      const dt = Math.min(0.1, (now - prLast) / 1000); prLast = now;
      prDraw(Math.min(PR1, prT + dt * 6));                         
      if (prT < PR1) prRaf = requestAnimationFrame(tick); else prStop();
    };
    prRaf = requestAnimationFrame(tick);
  }
Deck.on('preston', {
    enter(el, ctx) {
      prStop();
      const ro = ctx.reading || ctx.print, box = PJ.zoom('pj-pr', 1.2);
      prStep = ro ? 99 : (ctx.step || 0);
      Object.keys(prPrev).forEach(key => delete prPrev[key]);
      prChart = CH.scatter(box, { height: box.clientHeight, animate: !ro, radius: prRad, opacity: 0.45, bg: String(PR1),
        x: { log: true, min: 300, max: 200000, ticks: [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], format: x => x >= 1000 ? fmt(x / 1000, 0) + NB + 'k' : fmt(x, 0) },
        y: { min: 10, max: 90, ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90] }, yTitle: 'Espérance de vie à la naissance, années', xTitle: 'PIB par habitant, dollars de 2011 (échelle log.)',
        points: prPoints(PR1) });
      prDraw(PR1);
    },
    step(el, n, o) {
      if (n >= 2 && prStep < 2 && !o.jump && !el.classList.contains('show-all')) prPlay();
      else if (n < 2 && prRaf) { prStop(); prDraw(PR1); }
      else if (o.jump && !prRaf) prDraw(PR1);
      prStep = n;
    },
    leave() { prStop(); }
  });
once('fr-decouplage', animate => {
    const rows = D.fr_ges.filter(r => r[5] != null), b = rows[0];
    zline('pj-dc', 1.2, { animate, duration: 2, stagger: 0.3, ends: true,
      x: { min: 1990, max: 2025, ticks: [1990, 2000, 2010, 2020, 2025] }, y: { min: 0, max: 180, ticks: [0, 40, 80, 120, 160] }, yTitle: 'Indice, 1990 = 100',
      series: [{ name: 'PIB réel', color: 'blue', data: rows.map(r => [r[0], r[6] / b[6] * 100]), endLabel: 'PIB réel', format: x => fmt(x, 0) },
               { name: 'Émissions sur le territoire', color: 'red', data: rows.map(r => [r[0], r[5] / b[5] * 100]), endLabel: 'Émissions', format: x => fmt(x, 0) }] });
  });
once('empreinte', animate => {
    const rows = D.fr_ges.filter(r => r[4] != null);
    zline('pj-emp', 1.2, { animate, duration: 2, stagger: 0.3, ends: true, starts: true,
      x: { min: 1990, max: 2024, ticks: [1990, 2000, 2010, 2024] }, y: { min: 0, max: 14, ticks: [0, 2, 4, 6, 8, 10, 12, 14] }, yTitle: 'Tonnes de CO₂e par habitant et par an',
      series: [{ name: 'Empreinte', color: 'red', data: pairs(rows, 0, 4), endLabel: 'Empreinte', format: x => fmt(x, 1) },
               { name: 'Émissions des résidents', color: 'blue', data: pairs(rows, 0, 3), endLabel: 'Résidents', format: x => fmt(x, 1) }] });
  });
const e0 = R.fr_ges_territoire_2025, t30 = R.fr_ges_cible_2030_snbc3, t50 = R.fr_ges_territoire_1990 / 6;
Deck.on('lectures', {
    enter() {
      const bc = byId('btn-credits'), bd = byId('btn-donnees');
      if (bc) bc.onclick = () => Deck.openPanel('Crédits', 'Photographies d\'illustration', '<p class="xsmall">Ces photographies illustrent le propos ; elles ne constituent pas des données.</p>' + Object.entries(window.CREDITS || {}).map(([key, c]) => `<p><b>${c.caption_fr || c.title}</b><br>${c.credit_fr || ''} · <a href="${c.source_page}" target="_blank" rel="noopener">source</a>, <a href="${c.license_url}" target="_blank" rel="noopener">${c.license}</a>${c.modifications ? '. ' + c.modifications : ''}</p>`).join(''));
      if (bd) bd.onclick = () => Deck.openPanel('Sources', 'Données du chapitre et millésimes', window.SOURCES_HTML || '');
    }
  });
})();
(function(){
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

    const logNote = item.logY ? 'Deux axes logarithmiques' : 'Axe du PIB logarithmique';
    
    window.Deck.on(id,{enter(el,ctx){draw(key,ctx);}});
  });
})();


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
    const width = box.clientWidth - 260; 
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


(function () {
  'use strict';
  const C = window.Charts;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pct = v => C.fmt(v, 1) + ' %';
  const animated = ctx => !(ctx.print || ctx.reading || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const find = id => window.SLIDES.find(s => s.id === id);
  const link = (url, text) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;

  function install(id, html, source, note, draw) {
    const s = find(id);
    if (!s) throw new Error('Diapositive absente : ' + id);
     
    
    
    const render = (el, ctx = {}) => draw(el, ctx);
    window.Deck.on(id, {enter:render});
    window.addEventListener('beforeprint', () => {
      const el = window.Deck.slideEl(id); if (el) render(el, {print:true});
    });
    window.addEventListener('afterprint', () => {
      const el = window.Deck.slideEl(id); if (el) render(el, {reading:document.body.classList.contains('reading')});
    });
  }

  const data = window.MASTER_GDP_COMPONENTS;
  const fields = [
    {key:'private_consumption', name:'Consommation privée', color:'#001F5F'},
    {key:'public_consumption', name:'Consommation publique', color:'#B45309'},
    {key:'investment', name:'Investissement hors stocks', color:'#536078', dash:'10 5'},
    {key:'exports', name:'Exportations', color:'#001F5F', dash:'3 5'},
    {key:'imports', name:'Importations', color:'#B45309', dash:'10 5'},
    {key:'stocks', name:'Variations de stocks', color:'#536078'}
  ];
  install('master-composantes-france',
    '<figure class="master-native-figure"><p class="master-chart-metadata">France · 1949–2025 · comptes nationaux, base 2020 · millésime mai 2026</p><div id="master-components-chart" class="master-native-chart"></div><figcaption>Les parts de la consommation, de l’investissement et des échanges évoluent. Les <b>importations sont à soustraire</b> dans le calcul du PIB.</figcaption><p class="master-chart-definition">Consommation privée : ménages et ISBLSM. Investissement hors stocks : FBCF et acquisitions nettes d’objets de valeur, tous secteurs.</p></figure>',
    link(data.source.url, 'Insee, comptes nationaux annuels, tableau 1.101, base 2020') + ' · données à prix courants, 1949–2025.',
    '',
    (el, ctx) => {
      const host = el.querySelector('#master-components-chart');
      host.innerHTML = '';
      const box = window.PJ.zoom(host, 1.2);
      C.line(box, {
        height:box.clientHeight, animate:animated(ctx), duration:2, stagger:0,
        hover:!ctx.print, ends:true, legend:false, labelGap:27,
        aria:'Composantes de la dépense en France de 1949 à 2025, en pourcentage du PIB à prix courants',
        yTitle:'En % du PIB à prix courants',
        y:{min:-5,max:70,ticks:[0,10,20,30,40,50,60,70]},
        x:{min:1949,max:2025,ticks:[1950,1960,1970,1980,1990,2000,2010,2025]},
        series:fields.map(f => ({...f, endLabel:f.name, data:data.rows.map(r => [r.year,r[f.key]]), gaps:1.5, format:pct}))
      });
    });

  const consommation = window.CONSOMMATION_INSEE_DATA;
  const consumptionStyles = {
    CP01:{name:'Alimentation et boissons non alcoolisées',endLabel:'Alimentation',color:'#B45309',dash:false},
    CP04:{name:'Logement, eau et énergie',endLabel:'Logement, eau et énergie',color:'#001F5F',dash:false},
    CP03:{name:'Habillement et chaussures',endLabel:'Habillement',color:'#B45309',dash:'9 5'},
    CP07:{name:'Transports',endLabel:'Transports',color:'#001F5F',dash:'3 5'}
  };
  install('master-ipc-poids',
    `<div class="master-consumption-layout">
      <figure class="master-native-figure master-consumption-figure">
        <p class="master-chart-metadata">France · 1960–2025 · parts des dépenses à prix courants · 2025 provisoire</p>
        <div id="master-consumption-chart" class="master-native-chart"></div>
        <figcaption>La structure des dépenses change. Les <b>pondérations d’un indice de prix doivent être actualisées.</b></figcaption>
        <p class="master-chart-definition">Quatre postes sélectionnés. Logement : eau, énergie et loyers imputés inclus. Ces parts des comptes nationaux diffèrent des poids exacts de l’IPC.</p>
      </figure>
      <aside class="def master-chain-note" aria-labelledby="master-chain-title">
        <h2 id="master-chain-title">Une solution partielle : le chaînage d'indice</h2>
        <p class="master-chain-idea"><b>Idée :</b> actualiser le panier tous les ans et calculer l'inflation sur plusieurs années comme un produit d'inflations annuelles.</p>
        <p>À chaque étape, on compare <b>le même panier aux prix des deux dates</b> (principe de Laspeyres).</p>
        <p>On multiplie les <b>facteurs 1 + π<sub>t</sub></b>, avec π<sub>t</sub> le taux annuel en décimal.</p>
        <div class="master-chain-formula" aria-label="IPC à la date T égale IPC initial multiplié par le produit, de t égal 1 à T, de 1 plus pi t">
          <span>IPC<sub><var>T</var></sub> = IPC<sub>0</sub> ×</span>
          <span class="master-chain-product"><sup><var>T</var></sup><span>∏</span><sub><var>t</var> = 1</sub></span>
          <span>(1 + <var>π</var><sub><var>t</var></sub>)</span>
        </div>
        <p class="master-chain-example"><b>10 % puis 5 % :</b> 1,10 × 1,05 − 1 = <b>15,5 %</b> au total.</p>
        <p class="master-chain-limit"><b>Limite :</b> les substitutions entre produits et les changements de qualité restent à traiter.</p>
      </aside>
    </div>`,
    link(consommation.sourceUrl,'Insee, comptes nationaux, tableau 2.201, base 2020')+' · publication du 29 mai 2026.',
    '',
    (el, ctx) => {
      const host=el.querySelector('#master-consumption-chart');
      host.innerHTML='';
      const box=window.PJ.zoom(host,1.1);
      C.line(box,{
        height:box.clientHeight,animate:animated(ctx),duration:2,stagger:0,
        hover:!ctx.print,ends:true,legend:false,labelGap:29,
        aria:'France, parts de la consommation des ménages de 1960 à 2025. Alimentation, logement, habillement et transports. Comptes nationaux, loyers imputés inclus.',
        yTitle:'Part des dépenses (%)',
        y:{min:0,max:35,ticks:[0,5,10,15,20,25,30,35]},
        x:{min:1960,max:2025,ticks:[1960,1980,2000,2025]},
        series:consommation.series.map(s=>({...consumptionStyles[s.code],
          endLabel:s.code==='CP04'?'Logement':consumptionStyles[s.code].endLabel,
          data:s.values,gaps:1.5,format:pct}))
      });
      box.querySelector('.ch-readout')?.setAttribute('aria-live','polite');
    });
  

  const informal = window.MASTER_INFORMAL_DATA;
  install('master-informel',
    '<figure class="master-native-figure"><p class="master-chart-metadata">Économie souterraine estimée · moyennes 1991–2015 · 19 économies sélectionnées</p><div class="master-informal-panels"><div class="master-informal-panel"></div><div class="master-informal-panel"></div></div><figcaption>Informel ne signifie pas automatiquement « hors PIB ». Le problème est aussi l’observation.</figcaption><p class="master-chart-definition">Estimations de recherche, principalement d’activités productives légales dissimulées aux autorités. Les transactions illégales consenties peuvent aussi entrer dans les comptes.</p></figure>',
    link(informal.source.url, 'Medina et Schneider (2018), FMI WP/18/17, tableau 18, pp. 50–54') + ' · % du PIB officiel.',
    '',
    (el, ctx) => {
      el.querySelectorAll('.master-informal-panel').forEach((host, panel) => {
        host.innerHTML = '';
        const rows = panel ? informal.rows.slice(10) : informal.rows.slice(0,10);
        const box = window.PJ.zoom(host, 1.16);
        const {svg} = C.hbars(box, {
          height:box.clientHeight, animate:animated(ctx), max:60,
          margin:{l:176,r:55,t:44,b:panel ? 8 + (box.clientHeight - 52) / 10 : 8}, yTitle:'En % du PIB officiel',
          aria:'Économie souterraine, moyenne 1991–2015 : '+rows.map(r=>r.label).join(', '),
          data:rows.map(r=>({...r, color:r.iso3 === 'FRA' ? '#B45309' : '#001F5F'})),
          format:pct
        });
        if (ctx.print) return;
        const readout = document.createElement('div'); readout.className = 'ch-readout';
        readout.setAttribute('aria-live','polite'); box.appendChild(readout);
        const bars = [...svg.querySelectorAll('g > rect')];
        const show = i => {
          const r = rows[i];
          readout.innerHTML = `<b>${esc(r.label)}</b><div>${pct(r.value)} du PIB officiel</div><div>Moyenne 1991–2015 · estimation</div>`;
          readout.classList.add('on'); bars.forEach((b,j)=>b.setAttribute('opacity',i===j?1:.4));
        };
        const hide = () => {readout.classList.remove('on'); bars.forEach(b=>b.setAttribute('opacity',1));};
        bars.forEach((bar,i) => {
          bar.classList.add('ch-bar'); bar.tabIndex = 0; bar.setAttribute('role','img');
          bar.setAttribute('data-keys','');
          bar.setAttribute('aria-label',rows[i].label+' : '+pct(rows[i].value)+', moyenne 1991–2015');
          bar.addEventListener('pointerenter',()=>show(i)); bar.addEventListener('pointerleave',hide);
          bar.addEventListener('focus',()=>show(i)); bar.addEventListener('blur',hide);
          bar.addEventListener('keydown',e=>{
            if (['ArrowUp','ArrowDown','Home','End'].includes(e.key)) {
              e.preventDefault(); e.stopPropagation();
              bars[e.key==='Home'?0:e.key==='End'?bars.length-1:Math.max(0,Math.min(bars.length-1,i+(e.key==='ArrowDown'?1:-1)))].focus();
            }
            if (e.key==='Escape') { e.stopPropagation(); bar.blur(); }
          });
        });
      });
    });
})();


(function () {
  'use strict';
  const CH=window.Charts, data=window.MOORE_CPU_GPU_DATA, id='moore-cpu-gpu';
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const count=value=>value>=1e12?`${CH.fmt(value/1e12,0)} billion`:value>=1e9?`${CH.fmt(value/1e9,0)} Md`:value>=1e6?`${CH.fmt(value/1e6,0)} M`:CH.fmt(value,0);
  const cpu=data.points.filter(p=>p.type==='CPU').length, gpu=data.points.filter(p=>p.type==='GPU').length;
  const years=data.points.map(p=>p.year), lo=Math.min(...years),hi=Math.max(...years);
  const fit=data.fit, fitted=year=>Math.exp(fit.a+fit.b*(year-fit.origin));
  const statement=`Ajustement commun : un doublement tous les ${CH.fmt(fit.doublingYears,2)} ans`;
  
  
  
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


(function () {
  'use strict';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  
  

  function text(x, y, lines, cls = '') {
    const start = y - (lines.length - 1) * 18;
    return `<text x="${x}" y="${start}" text-anchor="middle" dominant-baseline="middle" class="${cls}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? 36 : 0}">${esc(line)}</tspan>`).join('')}</text>`;
  }

  function block(id, x, y, w, h, lines, detail, cls, delay) {
    return `<g class="pib-schema-block ${cls}" tabindex="0" role="img" data-keys="" data-detail="${esc(detail)}" aria-label="${esc(lines.join(' ') + '. ' + detail)}" style="--reveal-delay:${delay}ms">
      <title>${esc(lines.join(' ') + ' : ' + detail)}</title>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" />
      ${text(x + w / 2, y + h / 2, lines)}
    </g>`;
  }

  function diagram(id, kind) {
    const income = kind === 'income';
    const heads = text(300, 37, ['Production totale'], 'pib-schema-heading') + text(1070, 37, [income ? 'Répartition des revenus' : 'Origine des dépenses'], 'pib-schema-heading');
    const left = block(id, 85, 95, 430, 110, ['Consommations', 'intermédiaires'], 'Biens et services transformés ou entièrement consommés pendant la production.', 'pib-schema-intermediate', 0)
      + block(id, 85, 205, 430, 330, ['Valeur ajoutée'], 'Production moins consommations intermédiaires : la richesse créée par les unités productrices.', 'pib-schema-value', 150);
    const rows = income ? [
      {lines:['Fournisseurs'], detail:'Les achats intermédiaires rémunèrent d’autres producteurs. Ils sont déduits pour calculer la valeur ajoutée de l’unité.', cls:'pib-schema-intermediate', y:95, h:110},
      {lines:['Rémunération des salariés'], detail:'Salaires et cotisations sociales à la charge des employeurs.', cls:'pib-schema-light', y:205, h:110},
      {lines:['Autres impôts sur la production', 'nets des autres subventions'], detail:'Autres impôts sur la production, nets des autres subventions ; les impôts sur les produits relèvent de la passerelle entre valeur ajoutée et PIB.', cls:'pib-schema-warm', y:315, h:110},
      {lines:['Excédent brut d’exploitation', '+ revenu mixte'], detail:'Solde brut après rémunération des salariés et autres impôts nets sur la production. Il inclut la consommation de capital fixe.', cls:'pib-schema-light', y:425, h:110}
    ] : [
      {lines:['Achats intermédiaires'], detail:'Les ventes intermédiaires se compensent avec les consommations intermédiaires lors de l’agrégation des unités résidentes.', cls:'pib-schema-intermediate', y:95, h:110},
      {lines:['C · Consommation privée'], detail:'Dépenses de consommation finale des ménages et des institutions sans but lucratif au service des ménages.', cls:'pib-schema-light', y:205, h:82.5},
      {lines:['I · Investissement'], detail:'Formation brute de capital de tous les secteurs, y compris public : capital fixe, variations de stocks et acquisitions nettes d’objets de valeur.', cls:'pib-schema-warm', y:287.5, h:82.5},
      {lines:['G · Consommation publique'], detail:'Dépenses de consommation finale des administrations publiques. L’investissement public est dans I ; les transferts monétaires ne sont pas une dépense finale.', cls:'pib-schema-light', y:370, h:82.5},
      {lines:['X − M · Exportations nettes'], detail:'Exportations moins importations. Les importations sont soustraites pour ne retenir que la production intérieure. Ce solde peut être négatif.', cls:'pib-schema-warm', y:452.5, h:82.5}
    ];
    const right = rows.map((r, i) => block(id, 790, r.y, 560, r.h, r.lines, r.detail, r.cls, 300 + i * 150)).join('');
    const arrows = rows.map((r, i) => {
      const y = r.y + r.h / 2;
      const x1 = income ? 524 : 779, x2 = income ? 777 : 528;
      return `<path class="pib-schema-arrow" d="M ${x1} ${y} H ${x2}" marker-end="url(#${id}-arrow)" pathLength="1" style="--reveal-delay:${400 + i * 150}ms" />`;
    }).join('');
    return `<svg class="pib-schema-svg" viewBox="0 0 1440 570" role="group" aria-label="${income ? 'La production se répartit entre les fournisseurs et les revenus issus de la valeur ajoutée.' : 'La production se répartit entre consommations intermédiaires et dépenses finales nettes des importations.'}">
      <defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="#001F5F" stroke-width="1.5" /></marker></defs>
      ${heads}${left}${right}${arrows}
    </svg>`;
  }

  function install(id, title, kind, page, caption, note) {
    
    
    window.Deck.on(id, {enter(el, ctx = {}) {
      const figure = el.querySelector('.pib-schema');
      const animated = !(ctx.print || ctx.reading || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      figure.classList.remove('pib-schema-animated');
      if (animated) { void figure.offsetWidth; figure.classList.add('pib-schema-animated'); }
      if (figure.dataset.bound || ctx.print) return;
      figure.dataset.bound = 'true';
      const readout = figure.querySelector('.pib-schema-readout');
      const blocks = [...figure.querySelectorAll('.pib-schema-block')];
      const show = block => {
        readout.textContent = block.dataset.detail;
        readout.classList.add('on');
        block.classList.add('pib-schema-selected');
      };
      const hide = block => {
        block.classList.remove('pib-schema-selected');
        readout.classList.remove('on');
      };
      blocks.forEach((block, i) => {
        block.addEventListener('pointerenter', () => show(block));
        block.addEventListener('pointerleave', () => { if (document.activeElement !== block) hide(block); });
        block.addEventListener('focus', () => show(block));
        block.addEventListener('blur', () => hide(block));
        block.addEventListener('keydown', e => {
          if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
            e.preventDefault(); e.stopPropagation();
            const next = e.key === 'Home' ? 0 : e.key === 'End' ? blocks.length - 1 : Math.max(0, Math.min(blocks.length - 1, i + (['ArrowDown','ArrowRight'].includes(e.key) ? 1 : -1)));
            blocks[next].focus();
          }
          if (e.key === 'Escape') { e.stopPropagation(); block.blur(); }
        });
      });
    }});
  }

  install('va-revenus-schema', 'Valeur ajoutée = revenus', 'income', 15,
    'La valeur ajoutée se répartit entre <strong>travail, prélèvements sur la production et excédent brut</strong>.',
    '<p><strong>Lecture :</strong> la production paie d’abord les consommations intermédiaires aux fournisseurs. La valeur ajoutée se répartit ensuite en rémunération des salariés, autres impôts sur la production nets des autres subventions, et excédent brut d’exploitation (EBE) ou revenu mixte. La rémunération des salariés comprend les cotisations sociales employeurs. Le revenu mixte concerne les entreprises individuelles, où travail et capital sont difficilement séparables.</p><p><strong>Adaptation de la figure du master :</strong> les rubriques « Rent » et « Profits + interest + capital depreciation » sont remplacées par les catégories des comptes nationaux français. Les intérêts, dividendes et rentes foncières sont des revenus de la propriété distribués après la formation de l’EBE ; il ne faut pas les ajouter une deuxième fois. Les locations de bâtiments ou d’équipements sont des services : leur coût est une consommation intermédiaire du locataire producteur et une production du bailleur. L’EBE et le revenu mixte sont bruts : ils incluent la consommation de capital fixe. Le passage au net la retrancherait.</p>');

  install('va-depenses-schema', 'Valeur ajoutée = dépenses finales', 'expenditure', 22,
    'En agrégeant les producteurs, les achats intermédiaires se compensent. Restent les <strong>dépenses finales nettes des importations</strong>.',
    '<p><strong>Lecture :</strong> les flèches vont des dépenses vers la production. L’agrégation élimine les achats intermédiaires entre unités résidentes ; les importations, intermédiaires ou finales, sont retirées avec M. L’identité exacte aux prix du marché est PIB = C + G + I + X − M. La différence entre cette identité et la valeur ajoutée aux prix de base tient aux impôts nets sur les produits, supposés nuls dans ce schéma simplifié.</p><p><strong>Conventions françaises :</strong> C regroupe la consommation finale des ménages et des ISBLSM. G est la consommation finale des administrations, et non toutes les dépenses publiques. I désigne la formation brute de capital de tous les secteurs : FBCF, variations de stocks et acquisitions nettes d’objets de valeur ; l’investissement public est donc dans I. Les transferts monétaires ne sont pas une production ni une dépense finale. X − M peut être négatif : le rectangle n’indique aucun signe ni aucune proportion. Le schéma suppose une représentation positive à seule fin de lecture.</p>');
})();

(function(){window.Deck.on('master-cpi-core', {enter(el, ctx) {
      const rows = window.MASTER_CPI_DATA.rows;
      const box = window.PJ.zoom('master-cpi-chart', 1.2);
      const animate = !(ctx.reading || ctx.print || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      const percent = value => window.Charts.fmt(value, 1) + ' %';
      const month = i => new Date(rows[Math.round(i)][0] + '-01T00:00:00Z').toLocaleDateString('fr-FR', {month:'long', year:'numeric', timeZone:'UTC'});
      const chart = window.Charts.line(box, {
        height:box.clientHeight, animate, duration:2, stagger:0.3, ends:true, legend:false, hover:true,
        aria:'Inflation américaine totale et hors alimentation et énergie, en glissement annuel de 2005 à 2025',
        x:{min:0, max:rows.length-1, ticks:[0,60,120,180,240], format:i=>rows[i][0].slice(0,4), hoverFormat:month},
        y:{min:-3, max:10, ticks:[-2,0,2,4,6,8,10]}, yTitle:'Variation sur douze mois (%)',
        series:[
          {name:'Inflation totale', endLabel:'Totale', color:'blue', dash:false, data:rows.map((r,i)=>[i,r[1]]), gaps:1.5, format:percent},
          {name:'Hors alimentation et énergie', endLabel:'Hors alimentation-énergie', color:'red', dash:'9 6', data:rows.map((r,i)=>[i,r[2]]), gaps:1.5, format:percent}
        ]
      });
      
      if (animate) chart.svg.querySelectorAll('.ch-line').forEach((path, i) => {
        path.classList.remove('ch-anim');
        const clip = window.Charts.el('clipPath', {id:`master-cpi-reveal-${i}`, clipPathUnits:'userSpaceOnUse'}, chart.svg.querySelector('defs'));
        window.Charts.el('rect', {x:0, y:0, width:chart.svg.getAttribute('width'), height:chart.svg.getAttribute('height'), class:'master-cpi-reveal', style:`animation-delay:${i * 0.3}s`}, clip);
        path.setAttribute('clip-path', `url(#master-cpi-reveal-${i})`);
      });
    }});})();
(function(){
'use strict';
const body = (...paras) => `<div class="rev-body">${paras.map(p=>`<p>${p}</p>`).join('')}</div>`;
const decouplingExamples = [
    {code:'DEU', name:'Allemagne'}, {code:'USA', name:'États-Unis'},
    {code:'SWE', name:'Suède'}, {code:'FIN', name:'Finlande'},
    {code:'DNK', name:'Danemark'}, {code:'JPN', name:'Japon'}
  ];
function installDecoupling(id,key){
    let current='DEU',initialized=false;
    const groups=decouplingExamples.map(country=>{
      const rows=window.REVISION_DATA[key].rows.filter(r=>r.code===country.code&&r.year>=2005&&r.year<=2020).sort((a,b)=>a.year-b.year);
      const base=rows.find(r=>r.year===2005);
      if(!base)throw new Error(`Base 2005 absente : ${country.code}`);
      return {...country,values:rows.map(r=>({year:r.year,...Object.fromEntries(['gdp','production','consumption'].map(k=>[k,base[k]>0&&Number.isFinite(r[k])?100*r[k]/base[k]:null]))}))};
    });
    function draw(ctx={}){
      const root=Deck.slideEl(id);
      const selected=groups.find(g=>g.code===(ctx.print?'DEU':current));
      root.querySelector('.rev-decoupling-country').textContent=`${selected.name} · ${key==='decouplingPerCapita'?'par habitant':'grandeurs totales'}`;
      const box=window.PJ.zoom(root.querySelector('.rev-interactive'),1.2);
      const animate=!(ctx.print||ctx.reading||window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      const max=Math.max(120,...selected.values.flatMap(r=>[r.gdp,r.production,r.consumption].filter(Number.isFinite)));
      const labels=[['gdp','PIB réel','blue',false],['production','CO₂ territorial','red',false],['consumption','CO₂ ajusté des échanges','red','9 6']];
      const chart=window.Charts.line(box,{
        height:box.clientHeight,animate,duration:2,stagger:0.2,ends:true,legend:false,hover:!ctx.print,
        aria:`${selected.name}, PIB réel et émissions de CO₂ ${key==='decouplingPerCapita'?'par habitant':'totales'}, de 2005 à 2020`,
        x:{min:2005,max:2020,ticks:[2005,2010,2015,2020]},
        y:{min:0,max:Math.ceil(max/20)*20},yTitle:'Indice, 2005 = 100',
        refLines:[{y:100,color:'grey',dash:'3 6'}],
        series:labels.map(([column,name,color,dash])=>({name,endLabel:name,color,dash,gaps:1.5,data:selected.values.map(r=>[r.year,r[column]]),format:v=>window.Charts.fmt(v,1)}))
      });
      if(animate)chart.svg.querySelectorAll('.ch-line').forEach((path,i)=>{
        path.classList.remove('ch-anim');
        const clip=window.Charts.el('clipPath',{id:`${id}-reveal-${i}`,clipPathUnits:'userSpaceOnUse'},chart.svg.querySelector('defs'));
        window.Charts.el('rect',{x:0,y:0,width:chart.svg.getAttribute('width'),height:chart.svg.getAttribute('height'),class:'rev-decoupling-reveal',style:`animation-delay:${i*0.2}s`},clip);
        path.setAttribute('clip-path',`url(#${id}-reveal-${i})`);
      });
    }
    Deck.on(id,{enter(el,ctx){
      if(!initialized){
        initialized=true;
        el.querySelector('select').addEventListener('change',e=>{current=e.target.value;draw();});
      }
      draw(ctx);
    }});
    
    window.addEventListener('beforeprint',()=>draw({print:true}));
    window.addEventListener('afterprint',()=>draw({reading:document.body.classList.contains('reading')}));
  }
installDecoupling('decouplage-monde','decouplingTotal');
installDecoupling('decouplage-habitant','decouplingPerCapita');
})();