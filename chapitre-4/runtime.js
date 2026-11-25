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
  const PAL = { blue: '#001F5F', red: '#B45309', teal: '#2E7D5B', amber: '#B45309', violet: '#6B3FA0', slate: '#8A9BA8', grey: '#CFC7BA', ink: '#000000', nom: '#5F707D',
    olive: '#2E7D5B', prune: '#6B3FA0' };
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
    const labelColor = o.exactSeriesColors ? color => color : darken;
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
      if (r.label) txt(g, Wd - m.r + 8, S.Y(r.y) + 6, r.label, 'ch-lab', { fill: labelColor(r.color || 'red') });
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
      if (s.points) pts.forEach(q => el('circle', { cx: S.X(q[0]), cy: S.Y(q[1]), r: 5.5, fill: col(s.color), class: anim ? 'ch-pop' : '' }, g));
    });

    const lay = (k, at) => { const gg = el('g', anim ? { class: 'ch-fade', style: `animation-delay:${(stag * k + at).toFixed(2)}s` } : {}, g); return gg; };
    const dot = (gg, px, py, c) => el('circle', { cx: px, cy: py, r: 6.5, fill: col(c), stroke: '#fff', 'stroke-width': 2 }, gg);
    const boxes = [], lim = { l: m.l, W: Wd, t: m.t, b: Ht - m.b };
    (o.markers || []).forEach(mk => { if (mk.label) boxes.push(tbox(S.X(mk.x) + (mk.dx || 0), S.Y(mk.y) + (mk.dy ?? -16), textW(mk.label), mk.anchor || 'middle')); });
    const label = (gg, xx, yy, it, anchor) => {
      const t = el('text', { x: xx, y: yy, class: 'ch-lab', fill: labelColor(it.s.color), 'text-anchor': anchor || 'start' }, gg);
      if (it.name) { const a = el('tspan', {}, t); a.textContent = it.name; }
      if (it.val) { const b = el('tspan', { 'font-weight': 700, dx: it.name ? 8 : null, class: 'ch-num' }, t); b.textContent = it.val; }
    };

    const maxPx = Math.max(0, ...ends.map(e => S.X(e.last[0])));
    ends.forEach(e => {
      const px = S.X(e.last[0]), py = S.Y(e.last[1]), gg = lay(e.k, dur * 0.92);
      if (e.dot) dot(gg, px, py, e.s.color);
      const lx = maxPx + (ends.some(q => q.dot) ? 14 : 12) + (arrows ? 22 : 0);
      if (arrows) leader(gg, lx - 5, e.y, px, py, e.dot ? 10 : 5, labelColor(e.s.color));
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
      if (mk.label) txt(g, S.X(mk.x) + (mk.dx || 0), S.Y(mk.y) + (mk.dy ?? -16), mk.label, 'ch-val', { fill: labelColor(mk.color || 'red'), 'text-anchor': mk.anchor || 'middle' });
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
      const rows = o.series.map((s, k) => { const d = s.data.find(z => z[0] === xv); if (!d || d[1] == null) { dots[k].setAttribute('opacity', 0); return ''; } dots[k].setAttribute('cx', S.X(xv)); dots[k].setAttribute('cy', S.Y(d[1])); dots[k].setAttribute('opacity', 1); return `<div><b style="color:${labelColor(s.color)}">${esc(s.name || '')}</b> ${(s.format || o.y.hoverFormat || (v => fmt(v, o.y.digits || 0)))(d[1])}</div>`; }).join('');
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
  const st = { slides: [], els: [], steps: [], idx: 0, step: 0, handlers: {}, entered: new Set(), reading: false, panelReturn: null, idle: null };
  const D = window.Deck = {
    on(id, h) { st.handlers[id] = Object.assign(st.handlers[id] || {}, h); },
    goTo, next, prev, openPanel, closePanel,
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


  function slideHTML(s, i) {
    const ext = (s.extensions || []).map((e, j) => `<button class="ext-btn" data-ext="${i}:${j}">${esc(e.label)}</button>`).join('');
    const prov = s.prov ? `<span class="prov prov-${s.prov}">${{ obs: 'Données observées', fictif: 'Exemple fictif', sim: 'Simulation', illu: 'Illustration', mixte: 'Données et exemple' }[s.prov] || esc(s.prov)}</span>` : '';
    if (s.layout === 'cover' || s.layout === 'raw') return s.html;

    const head = s.layout === 'section' ? `<header class="slide-head" aria-hidden="true"><h1>${s.title}</h1></header>` :
      `<header class="slide-head"><div class="kicker">${s.part ? `<span>${esc(s.part)}</span>` : ''}${s.kicker ? `<span class="kicker-part">${esc(s.kicker)}</span>` : ''}</div><h1>${s.title}</h1></header>`;
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
    stage.innerHTML = slides.map((s, i) => `<section class="slide ${s.layout === 'cover' ? 'cover' : ''} ${s.layout === 'section' ? 'section-open' : ''} ${s.cls || ''}" id="${esc(s.id)}" data-i="${i}" aria-label="${esc(plain(s.title || ''))}">${slideHTML(s, i)}</section>`).join('');
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
    $('#tb-count').textContent = `${st.idx + 1} / ${n}`;
    $('#tb-prev').disabled = st.idx === 0 && st.step === 0;
    $('#tb-next').disabled = st.idx === n - 1 && st.step === st.steps[st.idx].length;
    $('#progress span').style.width = ((st.idx + 1) / n * 100) + '%';
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
      html += `<button class="toc-item ${i === st.idx ? 'cur' : ''}" data-goto="${esc(s.id)}"><span class="n">${i + 1}</span><span>${stripTags(s.title || s.tocTitle || '')}</span></button>`;
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
      html += `<div class="rep-card sm"><div class="rep-tag">Repère</div><div class="rep-value">${esc(r.value)}</div><div class="rep-label">${esc(r.label)}</div>${r.sub ? `<div class="rep-sub">${esc(r.sub)}</div>` : ''}<button class="go" data-goto="${esc(r.id)}">Voir la diapositive ${r.i + 1} →</button></div>`;
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
      `${d.html.replace('class="def', 'class="def compact')}${d.i >= 0 ? `<p class="xsmall" style="margin:-4px 0 18px"><button class="reveal-btn" style="font-size:15px" data-goto="${esc(d.id)}">Voir la diapositive ${d.i + 1}</button></p>` : ''}`).join('');
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
    g.classList.add('revealed'); document.querySelectorAll('[data-show-answer]').forEach(b => { if (b.dataset.showAnswer === gid) b.setAttribute('aria-expanded', 'true'); });
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
    document.body.classList.toggle('reading', on); if (on) document.querySelectorAll('[data-student-quiz]').forEach(g => revealChoices(g.id));
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
        if (g.hasAttribute('data-student-quiz')) { revealChoices(g.id); advanceAfterChoice(g); }
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
window.addEventListener("beforeprint",()=>document.querySelectorAll("[data-student-quiz]").forEach(g=>Deck.revealChoices(g.id)));
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
(function () {
  const { link } = C;
  const M = (window.REPERES || {}).maj || {};
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const jour = d => { const [y, m, j] = String(d).split('-'); return j ? `${+j === 1 ? '1er' : +j} ${MOIS[+m - 1]} ${y}` : `${MOIS[+m - 1]} ${y}`; };
  const de = t => (/^[aeiouéèêâîôû]/i.test(t) ? 'd\'' : 'de ') + t;
  window.SRC = {

    bce_bsi: link('https://data.ecb.europa.eu/data/datasets/BSI', `BCE, statistiques monétaires (BSI), données ${de(jour(M.bce_bsi))}`),
    bce_bsi_c: link('https://data.ecb.europa.eu/data/datasets/BSI', 'BCE, statistiques monétaires'),
    bce_ilm: link('https://data.ecb.europa.eu/data/datasets/ILM', `BCE, situation financière hebdomadaire de l'Eurosystème (ILM), semaine du ${jour(M.bce_ilm)}`),
    bce_ilm_c: link('https://data.ecb.europa.eu/data/datasets/ILM', 'BCE, bilan hebdomadaire de l\'Eurosystème'),
    bce_taux: link('https://data.ecb.europa.eu/data/datasets/FM', `BCE, taux directeurs et €STR (données du ${jour(M.bce_taux)})`),
    bce_taux_c: link('https://data.ecb.europa.eu/data/datasets/FM', 'BCE, taux directeurs'),
    bce_mir: link('https://data.ecb.europa.eu/data/datasets/MIR', 'BCE, taux et montants des crédits nouveaux des banques (MIR), données de la Banque de France'),
    bce_spf: link('https://data.ecb.europa.eu/data/datasets/SPF', 'BCE, enquête auprès des prévisionnistes professionnels (anticipations à cinq ans)'),

    eurostat_ipch: link('https://ec.europa.eu/eurostat/databrowser/view/prc_hicp_minr/default/table', `Eurostat, indice des prix à la consommation harmonisé (prc_hicp_minr, prc_hicp_iw), mis à jour le ${jour(M.eurostat_ipch)}`),
    eurostat_ipch_c: link('https://ec.europa.eu/eurostat/databrowser/view/prc_hicp_minr/default/table', 'Eurostat, IPCH'),
    eurostat_flash: link('https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-18112026-ap', 'Eurostat, inflation de la zone euro en octobre 2026 (18 novembre 2026)'),
    eurostat_nama: link('https://ec.europa.eu/eurostat/databrowser/view/nama_10_gdp/default/table', `Eurostat, nama_10_gdp (${jour(M.eurostat_nama)})`),
    eurostat_une: link('https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table', `Eurostat, une_rt_m (${jour(M.eurostat_une)})`),
    eurostat_pop: link('https://ec.europa.eu/eurostat/databrowser/view/tps00001/default/table', `Eurostat, tps00001 (${jour(M.eurostat_population)})`),

    wdi: link('https://data.worldbank.org/indicator/FM.LBL.BMNY.ZG', `Banque mondiale, World Development Indicators (${jour(M.wdi)}), licence CC BY 4.0 : monnaie au sens large d'après le FMI, IPC, PIB en volume`),
    wdi_c: link('https://data.worldbank.org/indicator/FM.LBL.BMNY.ZG', 'Banque mondiale, WDI (CC BY 4.0)'),
    pink: link('https://www.worldbank.org/en/research/commodity-markets', 'Banque mondiale, prix mensuels des matières premières (« Pink Sheet », 2 octobre 2026), licence CC BY 4.0'),
    pink_c: link('https://www.worldbank.org/en/research/commodity-markets', 'Banque mondiale, « Pink Sheet »'),
    ameco: link('https://economy-finance.ec.europa.eu/economic-research-and-databases/economic-databases/ameco-database_en', 'Commission européenne, AMECO (prévisions du printemps 2026)'),
    insee_cn: link('https://www.insee.fr/fr/statistiques/8988823?sommaire=8988934', 'Insee, comptes nationaux annuels base 2020, tableau 1.102 (mai 2026)'),
    insee_ipc: link('https://www.insee.fr/fr/statistiques/serie/011814630', 'Insee, indice des prix à la consommation (série 011814630, septembre 2026 provisoire)'),
    insee_ipc_c: link('https://www.insee.fr/fr/statistiques/serie/011814630', 'Insee, IPC'),
    bls: link('https://www.bls.gov/data/', 'Bureau of Labor Statistics : taux de chômage (LNS14000000), indice des prix CPI-U et CPI-U hors alimentation et énergie'),
    bls_c: link('https://www.bls.gov/data/', 'BLS'),
    fed_h15: link('https://www.federalreserve.gov/releases/h15/', 'Réserve fédérale, H.15 (taux effectif des fonds fédéraux)'),
    jst: link('https://www.macrohistory.net/database/', 'Jordà, Schularick et Taylor, Macrohistory Database, version 6, licence CC BY-NC-SA 4.0'),

    bce_juin: link('https://www.banque-france.fr/system/files/2026-06/ecb.mp260611.fr_.pdf', 'BCE, décisions de politique monétaire du 11 juin 2026'),
    bce_sept: link('https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260910~314e508016.fr.html', 'BCE, décisions de politique monétaire du 10 septembre 2026'),
    fed_sept: link('https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm', 'Réserve fédérale, communiqué du FOMC du 16 septembre 2026'),
    lane: link('https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp261005~1d8d998ef4.en.html', 'P. R. Lane, « Diagnostic Challenges for ECB Monetary Policy », discours du 5 octobre 2026'),
    schnabel: link('https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp260930_1~7c6c120482.en.html', 'I. Schnabel, « Monetary policy in a world of overlapping shocks », discours du 30 septembre 2026'),
    rstar: link('https://www.ecb.europa.eu/press/economic-bulletin/focus/2025/html/ecb.ebbox202501_08~3be5a005f9.en.html', 'BCE, Bulletin économique 1/2025, encadré 8 (taux neutre)'),
    livret_a: link('https://www.info.gouv.fr/index.php/actualite/augmentation-du-taux-du-livret-a-a-compter-du-1er-aout-2026', 'Gouvernement, « Le taux du livret A augmente à compter du 1er août 2026 » (31 juillet 2026)'),

    boe: link('https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy', 'M. McLeay, A. Radia et R. Thomas (2014), « Money creation in the modern economy », Bank of England Quarterly Bulletin'),
    boe_c: link('https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy', 'Banque d\'Angleterre (2014)'),
    bce_2011: link('https://www.ecb.europa.eu/press/pr/date/2011/html/pr111208_1.en.html', 'BCE, communiqué du 8 décembre 2011 (réserves obligatoires ramenées de 2 % à 1 %)'),
    fed_reserves: link('https://www.federalreserve.gov/monetarypolicy/reservereq.htm', 'Réserve fédérale, « Reserve Requirements » (réserves obligatoires supprimées le 26 mars 2020)'),
    strategie: link('https://www.ecb.europa.eu/press/pr/date/2021/html/ecb.pr210708~dc78cc4b0d.en.html', 'BCE, nouvelle stratégie de politique monétaire (8 juillet 2021)'),
    estr: link('https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_short-term_rate/html/eurostr_overview.en.html', 'BCE, présentation de l\'€STR'),
    euro_num: link('https://www.ecb.europa.eu/euro/digital_euro/faqs/html/ecb.faq_digital_euro.fr.html', 'BCE, questions fréquentes sur l\'euro numérique (lues le 15 octobre 2026)'),
    traite: link('https://www.ecb.europa.eu/ecb/orga/independence/html/index.fr.html', 'Traité sur le fonctionnement de l\'Union européenne, articles 127 et 130 (pages de la BCE)'),
    bdf_1993: link('https://www.banque-france.fr/fr/banque-de-france/institution-ancree-histoire/histoire-banque-de-france', 'Banque de France, histoire (loi du 4 août 1993)'),
    taylor: link('https://web.stanford.edu/~johntayl/Papers/Discretion.PDF', 'J. B. Taylor (1993), « Discretion versus policy rules in practice », Carnegie-Rochester Conference Series on Public Policy 39, p. 202'),
    taylor_c: link('https://web.stanford.edu/~johntayl/Papers/Discretion.PDF', 'Taylor (1993)'),
    orphanides: link('https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp015.pdf', 'A. Orphanides (2000), « The quest for prosperity without inflation », BCE, document de travail n° 15'),
    orphanides_c: link('https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp015.pdf', 'Orphanides (2000)'),
    bb: link('https://www.nber.org/system/files/working_papers/w31417/w31417.pdf', 'B. Bernanke et O. Blanchard (2023), « What Caused the U.S. Pandemic-Era Inflation? », NBER WP 31417'),
    arce: link('https://ideas.repec.org/p/ecb/ecbops/2024343.html', 'O. Arce, M. Ciccarelli, A. Kornprobst et C. Montes-Galdón (2024), « What caused the euro area post-pandemic inflation? », BCE, Occasional Paper n° 343'),
    svb: link('https://www.federalreserve.gov/newsevents/testimony/barr20230328a.htm', 'M. S. Barr, témoignage devant le Sénat américain (28 mars 2023)'),
    friedman: 'M. Friedman (1963), <i>Inflation: Causes and Consequences</i>, Asia Publishing House',
    kp: link('https://doi.org/10.1086/260580', 'F. Kydland et E. Prescott (1977), « Rules Rather than Discretion », Journal of Political Economy'),
    bg: link('https://doi.org/10.1086/261167', 'R. Barro et D. Gordon (1983), « A Positive Theory of Monetary Policy in a Natural Rate Model », Journal of Political Economy'),
    phillips: link('https://doi.org/10.1111/j.1468-0335.1958.tb00003.x', 'A. W. Phillips (1958), Economica'),
    tpi: link('https://www.ecb.europa.eu/press/pr/date/2022/html/ecb.pr220721~973e6e7273.en.html', 'BCE, « The Transmission Protection Instrument », communiqué du 21 juillet 2022'),
    calendrier: link('https://www.ecb.europa.eu/press/calendars/mgcgc/html/index.en.html', 'BCE, calendrier des réunions du Conseil des gouverneurs'),
    ch4_eurosysteme: link('https://www.ecb.europa.eu/mopo/implement/app/html/index.en.html', 'BCE, programmes PSPP et PEPP')
  };
})();
window.EXERCICE_CH05 = (function () {
  const e = {
    credit: 120,
    m: 6, v: -2, y: 1,
    choc: { y: -2, pi_avant: 3, pi_apres: 7, pi_hors_energie: 3 },
    ph: { beta: 0.5, ustar: 7, pe: 3, u: 6 }
  };
  e.monnaie = e.credit;
  e.reserves = 0;
  e.pi = e.m + e.v - e.y;
  e.pi1 = e.ph.pe - e.ph.beta * (e.ph.u - e.ph.ustar);
  e.pi2 = e.pi1 - e.ph.beta * (e.ph.u - e.ph.ustar);
  return e;
})();
window.M5 = (function () {
  const R = window.REPERES;


  const ENT = { alpha: 'Banque Alpha', beta: 'Banque Bêta', bce: 'BCE (Eurosystème)' };
  const OPS = {
    credit: { titre: 'Alpha accorde à Léa un crédit immobilier de 200 000 €. Alpha ne transfère de réserves à Bêta que lorsque Léa paie Marc',
      texte: 'La banque inscrit une créance sur Léa à son actif et le dépôt qu\'elle lui doit à son passif. Personne n\'a été privé de son épargne : 200 000 € de monnaie existent en plus.',
      e: [['alpha', 'actif', 'Crédit à Léa', 200000, 'autre'], ['alpha', 'passif', 'Dépôt de Léa', 200000, 'dep']] },
    paiement: { titre: 'Léa paie Marc, client de Bêta. Alpha règle le virement avec ses réserves. La banque centrale débite le compte d’Alpha de 200 000 € et crédite celui de Bêta du même montant, sans échange de billets',
      texte: 'Le dépôt passe d\'une banque à l\'autre : la monnaie ne change pas. Alpha règle Bêta en lui cédant 200 000 € de réserves.',
      e: [['alpha', 'passif', 'Dépôt de Léa', -200000, 'dep'], ['alpha', 'actif', 'Réserves', -200000, 'res'],
          ['beta', 'actif', 'Réserves', 200000, 'res'], ['beta', 'passif', 'Dépôt de Marc', 200000, 'dep']] },
    salaire: { titre: 'En un an, Léa reçoit 40 000 € de salaire. Les deux comptes sont chez Alpha : au passif, le dépôt de l’employeur baisse et celui de Léa augmente d’autant. Aucun transfert de réserves : l’actif d’Alpha ne varie pas',
      texte: 'Alpha débite le compte de l’employeur et crédite celui de Léa du même montant.',
      e: [['alpha', 'passif', 'Dépôt de l’employeur', -40000, 'dep'], ['alpha', 'passif', 'Dépôt de Léa', 40000, 'dep']] },
    remboursement: { titre: 'Léa rembourse ensuite 10 000 € de capital',
      texte: 'La somme est prélevée sur son compte, où son salaire a été versé : le dépôt et la créance baissent ensemble. Ces 10 000 € de monnaie sont détruits.',
      e: [['alpha', 'actif', 'Crédit à Léa', -10000, 'autre'], ['alpha', 'passif', 'Dépôt de Léa', -10000, 'dep']] },
    reglement: { titre: 'Le paiement de Léa se règle sur les comptes des banques à la BCE',
      texte: 'Les réserves sont les dépôts des banques à la BCE. La BCE débite le compte d\'Alpha et crédite celui de Bêta : les réserves changent de banque, leur total ne bouge pas.',
      e: [['alpha', 'passif', 'Dépôt de Léa', -200000, 'dep'], ['alpha', 'actif', 'Réserves', -200000, 'res'],
          ['beta', 'actif', 'Réserves', 200000, 'res'], ['beta', 'passif', 'Dépôt de Marc', 200000, 'dep'],
          ['bce', 'passif', 'Réserves d\'Alpha', -200000, 'res'], ['bce', 'passif', 'Réserves de Bêta', 200000, 'res']] },
    retrait: { titre: 'Marc retire 5 000 € en billets',
      texte: 'Bêta obtient les billets de la BCE en débitant son compte de réserves. Le dépôt devient un billet : la monnaie détenue par le public ne change pas, les réserves baissent.',
      e: [['beta', 'passif', 'Dépôt de Marc', -5000, 'dep'], ['beta', 'actif', 'Réserves', -5000, 'res'],
          ['bce', 'passif', 'Réserves de Bêta', -5000, 'res'], ['bce', 'passif', 'Billets en circulation', 5000, 'bil']] },
    refinancement: { titre: 'Alpha emprunte 200 000 € à la BCE pour une semaine',
      texte: `Au taux de refinancement (${C.n(R.taux.mro, 2)} %), contre des titres déposés en garantie. La BCE crée la monnaie de banque centrale qu'elle prête : elle crédite le compte d'Alpha.`,
      e: [['alpha', 'actif', 'Réserves', 200000, 'res'], ['alpha', 'passif', 'Emprunt à la BCE', 200000, 'autre'],
          ['bce', 'actif', 'Prêt à Alpha', 200000, 'autre'], ['bce', 'passif', 'Réserves d\'Alpha', 200000, 'res']] },
    qe_assureur: { titre: 'La BCE achète 100 M€ de titres publics à un assureur, client de Bêta',
      texte: 'L\'assureur échange ses titres contre un dépôt chez Bêta, que la BCE paie en réserves : 100 M€ de monnaie de banque centrale et 100 M€ de monnaie détenue par le public.',
      e: [['bce', 'actif', 'Titres publics', 100, 'autre'], ['bce', 'passif', 'Réserves de Bêta', 100, 'res'],
          ['beta', 'actif', 'Réserves', 100, 'res'], ['beta', 'passif', 'Dépôt de l\'assureur', 100, 'dep']] },
    qe_banque: { titre: 'La BCE achète 100 M€ de titres publics à la banque Alpha',
      texte: 'Alpha échange ses titres contre des réserves : la monnaie de banque centrale augmente, la monnaie détenue par le public ne change pas.',
      e: [['bce', 'actif', 'Titres publics', 100, 'autre'], ['bce', 'passif', 'Réserves d\'Alpha', 100, 'res'],
          ['alpha', 'actif', 'Titres publics', -100, 'autre'], ['alpha', 'actif', 'Réserves', 100, 'res']] }
  };

  const SCEN = {
    credit: { ops: ['credit', 'paiement', 'salaire', 'remboursement'], ent: ['alpha', 'beta'], unite: '€' },
    reserves: { ops: ['reglement', 'retrait', 'refinancement'], ent: ['alpha', 'beta', 'bce'], unite: '€', avant: ['credit'] },
    qe: { ops: ['qe_assureur', 'qe_banque'], ent: ['bce', 'alpha', 'beta'], unite: 'M€', separes: true }
  };


  function compteurs(ops) {
    const t = { monnaie: 0, reserves: 0, base: 0 };
    ops.forEach(k => OPS[k].e.forEach(([ent, cote, poste, v, nat]) => {
      if (nat === 'dep') t.monnaie += v;
      if (nat === 'bil') { t.monnaie += v; t.base += v; }
      if (nat === 'res' && ent !== 'bce') { t.reserves += v; t.base += v; }
    }));
    return t;
  }

  const equilibre = k => Object.keys(ENT).every(ent => {
    const s = OPS[k].e.filter(x => x[0] === ent).reduce((a, x) => a + (x[1] === 'actif' ? x[3] : -x[3]), 0);
    return Math.abs(s) < 1e-9;
  });


  const mult = (r, c) => (1 + c) / (r + c);
  const MULT = {
    manuel: { r: 0.01, c: 0.10, nom: 'Réserves limitées au minimum exigé' },
    z2007: { r: R.monnaie.identite_2007.r / 100, c: R.monnaie.identite_2007.c / 100, nom: 'Zone euro, juin 2007' },
    z2026: { r: R.monnaie.identite_dernier.r / 100, c: R.monnaie.identite_dernier.c / 100, nom: 'Zone euro, août 2026' }
  };


  const quantite = (m, v, y) => m + v - y;


  const OG = { cible: 2, kappa: 0.5, b: 1 };
  function ogdg(s) {
    const a = s.a || 0, o = s.o || 0, pe = s.pe ?? OG.cible, k = OG.kappa, b = OG.b;
    const pi = (pe + k * a + k * b * OG.cible + o) / (1 + k * b);
    return { pi, y: a - b * (pi - OG.cible), a, o, pe };
  }
  const SC = {
    depart: { a: 0, o: 0 },
    demande: { a: -3, o: 0 },
    offre: { a: 0, o: 3 },
    deux: { a: -6, o: 3 },
    relance: { a: 3, o: 3 },
    resserrer: { a: -3, o: 3 },
    ramener: { a: -6, o: 3 },
    derive: { a: 0, o: 3, pe: 3.5 }
  };


  const PH = { beta: 0.5, ustar: 7, pi0: 2, ans: 10 };
  function spirale(u, ancre, n = PH.ans, pi0 = PH.pi0) {
    const out = []; let pe = pi0;
    for (let t = 0; t < n; t++) {
      const pi = (ancre ? PH.pi0 : pe) - PH.beta * (u - PH.ustar);
      out.push(pi); pe = pi;
    }
    return out;
  }

  const TENT = { promesse: { u: PH.ustar, pi: 2 }, surprise: { pi: 2.5 }, anticipee: { u: PH.ustar, pi: 2.5 } };
  TENT.surprise.u = PH.ustar - (TENT.surprise.pi - TENT.promesse.pi) / PH.beta;


  const taylor = (pi, gap, rstar = 0, cible = 2) => rstar + pi + 0.5 * (pi - cible) + 0.5 * gap;
  const reel = (i, pi) => i - pi;

  return { ENT, OPS, SCEN, compteurs, equilibre, mult, MULT, quantite, OG, ogdg, SC, PH, spirale, TENT, taylor, reel };
})();
window.Bilans = (function () {
  'use strict';
  const NB = ' ';
  const M = () => window.M5;
  const fmtN = v => Math.abs(v).toLocaleString('fr-FR').replace(/\s/g, NB);
  const sgn = (v, u) => (v > 0 ? '+' : v < 0 ? '−' : '') + NB + fmtN(v) + (u ? NB + u : '');
  const UNITE = { '€': 'variations, en euros', 'M€': 'variations, en millions d\'euros', 'M': 'variations, en millions de valdors' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));


  function lignes(ops, ent, cote, etat) {
    const out = [];
    ops.forEach(k => M().OPS[k].e.forEach(([e, c, poste, v]) => { if (e === ent && c === cote) out.push({ poste, v, op: k, etat: etat(k) }); }));
    return out;
  }
  function tCompte(ent, ops, etat, u) {
    const col = cote => {
      const L = lignes(ops, ent, cote, etat);
      return L.length ? L.map(l => `<div class="bl-row ${l.etat}"><span class="bl-poste">${esc(l.poste)}</span><span class="bl-v k-nom">${sgn(l.v)}</span></div>`).join('')
        : '<div class="bl-row vide"></div>';
    };
    return `<div class="bl-card bl-${ent}"><div class="bl-head">${esc(M().ENT[ent])}</div>
      <div class="bl-t"><div class="bl-col"><div class="bl-lbl">Actif</div>${col('actif')}</div><div class="bl-col"><div class="bl-lbl">Passif</div>${col('passif')}</div></div></div>`;
  }
  function compteur(lbl, v, u, cls, precision = '') {
    return `<div class="bl-cpt ${cls || ''}"><div class="bl-cpt-l">${lbl}</div><div class="bl-cpt-v k-nom">${v === 0 ? '0' : sgn(v, u)}</div>${precision ? `<div class='p-sub' style='font-size:22px;margin:2px 0 0'>${precision}</div>` : ''}</div>`;
  }


  function html(scen, n, o = {}) {
    const S = M().SCEN[scen], u = S.unite, avant = S.avant || [];


    const faits = S.separes || o.seul ? (n > 0 ? [S.ops[n - 1]] : []) : S.ops.slice(0, n);
    const ops = avant.concat(faits), dern = faits[faits.length - 1];
    const etat = k => (avant.includes(k) ? 'avant' : k === dern ? 'new' : 'old');
    const t = M().compteurs(o.seul && !S.separes ? avant.concat(S.ops.slice(0, n)) : ops);
    const base = o.base ?? S.ent.includes('bce');
    const cpt = o.compteurs === false ? '' : `<div class="bl-cpts">${compteur('Monnaie détenue par le public', t.monnaie, u, 'm', scen === 'credit' ? 'Ici, on additionne les dépôts du public chez Alpha et Bêta. Le compteur affiche la variation depuis le début.' : '')}${compteur(scen === 'credit' ? 'Réserves totales des banques<br><span style=font-weight:400>à la Banque Centrale</span>' : 'Réserves des banques', t.reserves, u, 'r')}${base ? compteur('Monnaie de banque centrale', t.base, u, 'b') : ''}</div>`;
    const op = dern ? M().OPS[dern] : null;
    const leg = o.legende === false ? '' : `<div class="bl-leg">${op ? `<b>${esc(op.titre)}.</b> ${esc(op.texte)}` : (o.depart || '')}</div>`;

    const ents = S.separes && dern ? S.ent.filter(ent => M().OPS[dern].e.some(x => x[0] === ent)) : S.ent;
    return `<div class="bl ${o.cls || ''} n${ents.length}"><div class="bl-unit">Bilans : ${UNITE[u] || u}</div><div class="bl-cards">${ents.map(ent => tCompte(ent, ops, etat, u)).join('')}</div>${cpt}${leg}</div>`;
  }
  function render(box, scen, n, o) {
    if (!box) return;
    box.innerHTML = html(scen, n, o);

    const w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
    for (let nd = w.nextNode(); nd; nd = w.nextNode()) { const v = nd.nodeValue.replace(/ ([;:?!»])/g, NB + '$1').replace(/« /g, '«' + NB); if (v !== nd.nodeValue) nd.nodeValue = v; }
  }

  function fixe(entites, u, cls) {
    const col = L => (L.length ? L.map(([p, v]) => `<div class="bl-row new"><span class="bl-poste">${esc(p)}</span><span class="bl-v k-nom">${sgn(v)}</span></div>`).join('') : '<div class="bl-row vide"></div>');
    return `<div class="bl ${cls || ''} n${entites.length}"><div class="bl-unit">Bilans : ${UNITE[u] || u}</div><div class="bl-cards">${entites.map(e => `<div class="bl-card"><div class="bl-head">${esc(e.nom)}</div><div class="bl-t"><div class="bl-col"><div class="bl-lbl">Actif</div>${col(e.actif)}</div><div class="bl-col"><div class="bl-lbl">Passif</div>${col(e.passif)}</div></div></div>`).join('')}</div></div>`;
  }
  return { html, render, fixe, sgn };
})();
window.OGDG = (function () {
  'use strict';
  const CH = window.Charts, fmt = CH.fmt;
  const NB = ' ';
  const COL = { og: '#B45309', dg: '#2E7D5B', eq: '#000000', blue: '#001F5F', red: '#B45309', slate: '#8A9BA8', grey: '#6B7782' };
  const seg = (g, x1, y1, x2, y2, a) => CH.el('line', Object.assign({ x1, y1, x2, y2 }, a), g);
  const num = (v, d = 1) => fmt(v, Math.abs(v - Math.round(v)) < 0.05 ? 0 : d);
  const fade = (g, on, delay) => { if (on) { g.setAttribute('class', 'ch-fade'); g.setAttribute('style', `animation-delay:${delay || 0}s`); } return g; };
  function drawIn(p, dur, delay) {
    const L = p.getTotalLength ? p.getTotalLength() : 0; if (!L) return;
    p.style.setProperty('--len', L.toFixed(1)); p.style.setProperty('--dur', dur + 's'); p.style.animationDelay = delay + 's'; p.classList.add('ch-anim');
  }
  function halo(svg, sel) { svg.querySelectorAll(sel).forEach(t => { t.style.paintOrder = 'stroke'; t.style.stroke = '#FFFFFF'; t.style.strokeWidth = '5px'; t.style.strokeLinejoin = 'round'; }); }

  function draw(box, o) {
    const M = window.M5, P = M.OG;
    const fr = CH.frame(box, { height: o.height, width: o.width }), svg = fr.svg, Wd = fr.Wd, Ht = fr.Ht;
    const xr = o.x || [-8, 4], yr = o.y || [0, 7], fs = o.font || 19;
    const m = Object.assign({ l: 70, t: 64, b: 76, r: 120 }, o.margin || {});
    const X = v => m.l + (v - xr[0]) / (xr[1] - xr[0]) * (Wd - m.l - m.r);
    const Y = v => Ht - m.b - (v - yr[0]) / (yr[1] - yr[0]) * (Ht - m.t - m.b);
    const x0 = m.l, yb = Ht - m.b;

    seg(svg, x0, yb, x0, m.t - 26, { class: 'ch-axis', 'marker-end': fr.arrow });
    seg(svg, x0, yb, Wd - m.r + 30, yb, { class: 'ch-axis', 'marker-end': fr.arrow });
    const eqs = (o.eq || []).map(e => Object.assign({}, e, M.ogdg(e.s)));
    const shown = eqs.filter(e => e.values !== false && !e.faded);
    const xt = o.xTicks || CH.niceTicks(xr[0], xr[1], 6).filter(v => v >= xr[0] && v <= xr[1]);
    const yt = o.yTicks || CH.niceTicks(yr[0], yr[1], 7).filter(v => v >= yr[0] && v <= yr[1]);
    const near = (v, list, w) => list.some(z => Math.abs(v - z) < w);
    xt.forEach(v => { seg(svg, X(v), yb, X(v), yb + 7, { class: 'ch-tickmark' });
      if (!near(v, shown.map(e => e.y), 0.9 * (xr[1] - xr[0]) / 12)) CH.txt(svg, X(v), yb + 31, (v > 0 ? '+' : '') + fmt(v, 0), 'ch-tick ch-num', { 'text-anchor': 'middle', style: `font-size:${fs}px` }); });
    yt.forEach(v => { seg(svg, x0 - 7, Y(v), x0, Y(v), { class: 'ch-tickmark' });
      if (!near(v, shown.map(e => e.pi), 0.42 * (yr[1] - yr[0]) / 7)) CH.txt(svg, x0 - 13, Y(v) + 6.5, fmt(v, 0), 'ch-tick ch-num', { 'text-anchor': 'end', style: `font-size:${fs}px` }); });
    CH.txt(svg, x0 - 12, m.t - 38, o.yTitle || 'Inflation, %', 'ch-ytitle', { 'text-anchor': 'start', style: `font-size:${fs}px` });
    CH.txt(svg, Wd - m.r + 30, yb + 62, o.xTitle || 'Production, écart au potentiel en %', 'ch-xtitle', { 'text-anchor': 'end', style: `font-size:${fs}px` });

    const plot = CH.el('g', {}, svg);
    let cibleLab = null, potLab = null;

    if (o.potentiel !== false) {
      seg(plot, X(0), yb, X(0), m.t - 6, { stroke: COL.blue, 'stroke-width': 2, 'stroke-dasharray': '8 6', opacity: 0.8 });
      potLab = CH.txt(plot, X(0), m.t - 14, 'production potentielle', 'ch-lab', { 'text-anchor': 'middle', fill: CH.darken(COL.blue), style: `font-size:${fs - 2}px` });
    }
    if (o.cible !== false) {
      seg(plot, x0, Y(P.cible), Wd - m.r + 4, Y(P.cible), { stroke: COL.red, 'stroke-width': 2, 'stroke-dasharray': '8 6', opacity: 0.7 });
      cibleLab = CH.txt(plot, Wd - m.r + 10, Y(P.cible) + 6, 'cible 2 %', 'ch-lab', { fill: CH.darken(COL.red), style: `font-size:${fs - 2}px` });
    }

    const ends = [], drawn = [];
    (o.lines || []).forEach(l => {
      const s = l.s || {}, pe = s.pe ?? P.cible, a = s.a || 0, oo = s.o || 0;
      const f = l.type === 'og' ? (y => pe + P.kappa * y + oo) : (y => P.cible + (a - y) / P.b);

      let ya = xr[0], yz = xr[1];
      const inv = l.type === 'og' ? (pi => (pi - pe - oo) / P.kappa) : (pi => a - P.b * (pi - P.cible));
      const plo = l.type === 'dg' ? Math.max(yr[0], yr[0] + 0.35) : yr[0];
      const c1 = inv(plo), c2 = inv(yr[1]);
      ya = Math.max(ya, Math.min(c1, c2)); yz = Math.min(yz, Math.max(c1, c2));
      if (!(ya < yz)) return;
      drawn.push({ f, ya, yz });
      const col = l.color || COL[l.type];
      const g = fade(CH.el('g', {}, plot), l.anim && l.faded, l.delay);
      const p = CH.el('path', { d: `M${X(ya)},${Y(f(ya))} L${X(yz)},${Y(f(yz))}`, fill: 'none', stroke: col, 'stroke-width': l.faded ? 2.4 : 4.2,
        'stroke-dasharray': l.faded ? '7 6' : null, 'stroke-linecap': 'round', opacity: l.faded ? 0.75 : 1 }, g);
      if (l.anim && !l.faded) drawIn(p, l.dur || 0.9, l.delay || 0);
      if (l.label) {

        const xe = l.type === 'og' ? yz : yz, ye = f(xe);
        const gl = fade(CH.el('g', {}, plot), l.anim, (l.delay || 0) + 0.5);
        const t = CH.txt(gl, X(xe) + 10, Y(ye) + 7 + (l.labelDy || 0), l.label, 'ch-lab', { fill: l.faded ? COL.grey : CH.darken(col), style: `font-size:${fs}px;font-weight:700` });
        ends.push(t);
      }
    });

    for (let i = 0; i < ends.length; i++) for (let j = i + 1; j < ends.length; j++) {
      const a = ends[i].getBBox(), c = ends[j].getBBox();
      if (a.x < c.x + c.width && c.x < a.x + a.width && a.y < c.y + c.height && c.y < a.y + a.height) {
        ends[i].setAttribute('y', +ends[i].getAttribute('y') - 12); ends[j].setAttribute('y', +ends[j].getAttribute('y') + 12);
      }
    }

    if (potLab) {
      const pb = potLab.getBBox(), gap = 8;
      ends.forEach(t => { const a = t.getBBox();
        if (a.x < pb.x + pb.width && pb.x < a.x + a.width && a.y < pb.y + pb.height + gap && pb.y < a.y + a.height) t.setAttribute('y', +t.getAttribute('y') + (pb.y + pb.height + gap - a.y)); });
    }


    if (cibleLab) {
      const hit = bb => ends.some(t => { const a = t.getBBox(); return a.x < bb.x + bb.width && bb.x < a.x + a.width && a.y < bb.y + bb.height && bb.y < a.y + a.height; })
        || drawn.some(d => { for (let k = 0; k <= 60; k++) { const yy = d.ya + (d.yz - d.ya) * k / 60, px = X(yy), py = Y(d.f(yy));
          if (px >= bb.x - 3 && px <= bb.x + bb.width + 3 && py >= bb.y - 3 && py <= bb.y + bb.height + 3) return true; } return false; });
      const cands = [[Wd - m.r + 10, Y(P.cible) + 6], [x0 + 8, Y(P.cible) - 8], [X(xr[0] + 3), Y(P.cible) - 8], [x0 + 8, Y(P.cible) + 20], [X(xr[0] + 3), Y(P.cible) + 20]];
      for (const [cx, cy] of cands) { cibleLab.setAttribute('x', cx); cibleLab.setAttribute('y', cy); if (!hit(cibleLab.getBBox())) break; }
    }


    (o.shifts || []).forEach(sh => {
      const g = fade(CH.el('g', {}, plot), sh.anim, sh.delay), col = sh.color || COL[sh.type];
      if (sh.type === 'dg') {
        const yAt = pp => [(sh.from.a || 0) - P.b * (pp - P.cible), (sh.to.a || 0) - P.b * (pp - P.cible)];
        let pi = sh.at;
        if (pi == null) {
          for (pi = yr[1] - 0.8; pi > yr[0] + 0.5; pi -= 0.1) { const [a1, a2] = yAt(pi); if (Math.min(a1, a2) >= xr[0] + 0.7 && Math.max(a1, a2) <= xr[1] - 0.7) break; }
        }
        const [y1, y2] = yAt(pi);
        seg(g, X(y1), Y(pi), X(y2) + (y2 < y1 ? 4 : -4), Y(pi), { stroke: col, 'stroke-width': 3.4, 'marker-end': fr.arrow });
        if (sh.label) CH.txt(g, (X(y1) + X(y2)) / 2, Y(pi) - 12, sh.label, 'ch-val', { 'text-anchor': 'middle', fill: CH.darken(col), style: `font-size:${fs - 1}px` });
      } else {
        const f0 = (s, y) => (s.pe ?? P.cible) + P.kappa * y + (s.o || 0);
        let y = sh.at;
        if (y == null) {
          for (y = xr[1] - 1.4; y > xr[0] + 0.5; y -= 0.1) { const a1 = f0(sh.from, y), a2 = f0(sh.to, y); if (Math.max(a1, a2) <= yr[1] - 0.6 && Math.min(a1, a2) >= yr[0] + 0.3) break; }
        }
        const f = s => f0(s, y), p1 = f(sh.from), p2 = f(sh.to);
        seg(g, X(y), Y(p1), X(y), Y(p2) + (p2 > p1 ? 4 : -4), { stroke: col, 'stroke-width': 3.4, 'marker-end': fr.arrow });
        if (sh.label) CH.txt(g, X(y) + 12, (Y(p1) + Y(p2)) / 2 + 7, sh.label, 'ch-val', { 'text-anchor': 'start', fill: CH.darken(col), style: `font-size:${fs - 1}px` });
      }
    });

    (o.moves || []).forEach(mv => {
      const A = M.ogdg(mv.from), B = M.ogdg(mv.to), g = fade(CH.el('g', {}, plot), mv.anim, mv.delay);
      const ax = X(A.y), ay = Y(A.pi), bx = X(B.y), by = Y(B.pi), d = Math.hypot(bx - ax, by - ay);
      if (d < 30) return;
      const k1 = 16 / d, k2 = 20 / d;
      seg(g, ax + (bx - ax) * k1, ay + (by - ay) * k1, bx - (bx - ax) * k2, by - (by - ay) * k2, { stroke: COL.eq, 'stroke-width': 2.4, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round', 'marker-end': fr.arrow, opacity: 0.85 });
    });

    eqs.forEach(e => {
      const g = fade(CH.el('g', {}, plot), e.anim, e.delay);
      const cx = X(e.y), cy = Y(e.pi), op = e.faded ? 0.55 : 1;
      if (e.guides !== false) {
        seg(g, cx, cy, cx, yb, { stroke: COL.blue, 'stroke-width': 1.5, 'stroke-dasharray': '3 5', opacity: op });
        seg(g, cx, cy, x0, cy, { stroke: COL.red, 'stroke-width': 1.5, 'stroke-dasharray': '3 5', opacity: op });
      }
      CH.el('circle', { cx, cy, r: e.faded ? 7 : 9.5, fill: e.faded ? '#fff' : COL.eq, stroke: e.faded ? COL.eq : '#fff', 'stroke-width': e.faded ? 2.6 : 2.5, opacity: e.faded ? 0.8 : 1 }, g);
      if (e.values !== false && !e.faded) {
        CH.txt(g, cx, yb + 31, (e.y > 0.05 ? '+' : '') + num(e.y), 'ch-val ch-num', { 'text-anchor': 'middle', fill: CH.darken(COL.blue), style: `font-size:${fs}px` });
        CH.txt(g, x0 - 13, cy + 6.5, num(e.pi), 'ch-val ch-num', { 'text-anchor': 'end', fill: CH.darken(COL.red), style: `font-size:${fs}px` });
      }
      if (e.label) CH.txt(g, cx + (e.dx ?? 14), cy + (e.dy ?? -14), e.label, 'ch-lab', { 'text-anchor': e.anchor || 'start', fill: e.faded ? COL.grey : COL.eq, style: `font-size:${fs}px;font-weight:700` });
    });
    halo(svg, 'text.ch-lab,text.ch-val');
    return { svg, X, Y, m };
  }
  return { draw, COL };
})();
window.G5 = (function () {
  'use strict';
  const D = window.DATA, R = window.REPERES, CH = window.Charts, M5 = window.M5;
  const { fmt } = CH;
  const NB = '\u202F';
  const RED = '#B45309', BLUE = '#001F5F', SLATE = '#8A9BA8', NOM = '#4F5F6B', INK = '#000000', OLIVE = '#2E7D5B', TEAL = '#2E7D5B',
    PRUNE = '#6B3FA0', AMB = '#3B8FC4', CHO = '#9B1C31';
  const COL = { RED, BLUE, SLATE, NOM, INK, OLIVE, TEAL, PRUNE, AMB, CHO };
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const halo = (svg, sel = 'text') => svg.querySelectorAll(sel).forEach(t => { t.style.paintOrder = 'stroke'; t.style.stroke = '#FFFFFF'; t.style.strokeWidth = '5px'; t.style.strokeLinejoin = 'round'; });
  const xm = m => +m.slice(0, 4) + (+m.slice(5, 7) - 0.5) / 12;
  const xd = d => +d.slice(0, 4) + (+d.slice(5, 7) - 1) / 12 + (+d.slice(8, 10) - 1) / 365;
  const moisX = x => { const y = Math.floor(x + 1e-9), m = Math.min(11, Math.max(0, Math.round((x - y) * 12 - 0.5))); return MOIS[m] + ' ' + y; };
  const sgn = (v, d = 0) => Math.abs(v) < 0.5 * Math.pow(10, -d) ? '0' : (v > 0 ? '+' : '−') + NB + fmt(Math.abs(v), d);

  const fz = (o, n) => (o && o.big ? Math.max(19, n) : n);

  function escalier(chg, from, to) {
    const out = []; let cur = null;
    chg.forEach(([d, v]) => { if (d <= from) cur = v; });
    out.push([xd(from), cur]);
    chg.forEach(([d, v]) => { if (d > from && d <= to) { out.push([xd(d), cur]); out.push([xd(d), v]); cur = v; } });
    out.push([xd(to), cur]);
    return out;
  }
  const tauxAu = (chg, d) => { let cur = null; chg.forEach(([dd, v]) => { if (dd <= d) cur = v; }); return cur; };

  function panels(box, hs) {
    box.innerHTML = '';
    return hs.map(h => { const d = document.createElement('div'); d.style.height = h + 'px'; box.appendChild(d); return d; });
  }

  const cible = (res, x1) => { if (res && res.S) CH.el('line', { x1: res.m.l, x2: res.S.X(x1), y1: res.S.Y(2), y2: res.S.Y(2), stroke: RED, 'stroke-width': 1.4, 'stroke-dasharray': '3 6', opacity: 0.6 }, res.svg); };


  const MD = D.monde;
  const HL = { JPN: [12, 6, 'start'], CHE: [-12, 6, 'end'], USA: [-12, -10, 'end'], GBR: [12, -8, 'start'], TUR: [12, 6, 'start'], PER: [-12, -8, 'end'], BRA: [12, 6, 'start'], COD: [12, 6, 'start'] };
  function nuage(box, o) {
    const pts = MD.pays.map(([iso, nom, mg, p]) => {

      const h = o.labels && HL[iso] && (o.labels === true || o.labels.includes(iso)) ? HL[iso] : null;
      return { x: mg, y: p, key: iso, label: nom, hl: !!h, color: h ? BLUE : SLATE, dx: h ? h[0] : null, dy: h ? h[1] : null, anchor: h ? h[2] : null };
    });
    const res = CH.scatter(box, {
      height: o.height, animate: o.animate, opacity: 0.6,
      x: { min: 1, max: 200, log: true, ticks: [1, 2, 5, 10, 20, 50, 100], format: v => fmt(v, 0) },
      y: { min: 0.8, max: 200, log: true, ticks: [1, 2, 5, 10, 20, 50, 100], format: v => fmt(v, 0) },
      yTitle: 'Inflation, % par an', xTitle: o.xTitle || 'Croissance de la monnaie moins croissance de la production, % par an',
      radius: p => (p.hl ? 7.5 : 6), points: pts, margin: o.margin,
      tip: p => `<b>${p.label}</b><br>monnaie − production : ${fmt(p.x, 1)} % par an<br>inflation : ${fmt(p.y, 1)} % par an`
    });
    if (!res || !res.S) return res;
    const { S, svg } = res;

    const g = CH.el('g', {}, svg);
    g.parentNode.insertBefore(g, svg.childNodes[2] || null);
    CH.el('line', { x1: S.X(1), y1: S.Y(1), x2: S.X(200), y2: S.Y(200), stroke: '#C9BFAE', 'stroke-width': 2.2, 'stroke-dasharray': '7 6' }, g);
    if (o.diagLabel !== false) CH.txt(svg, S.X(190), S.Y(1.15), 'pointillés : inflation = monnaie − production', 'ch-lab', { 'text-anchor': 'end', fill: '#7A6F5E', style: `font-size:${fz(o, 16)}px` });

    const ea = MD.ea;
    CH.el('circle', { cx: S.X(ea.m_g), cy: S.Y(ea.p), r: 8, fill: '#fff', stroke: RED, 'stroke-width': 3 }, svg);
    CH.txt(svg, S.X(ea.m_g) - 14, S.Y(ea.p) + 6, o.eaLabel || 'zone euro', 'ch-lab', { 'text-anchor': 'end', fill: CH.darken(RED), style: `font-size:${fz(o, 17)}px;font-weight:700` });
    if (o.big) svg.querySelectorAll('text.ch-lab').forEach(t => { if (!t.style.fontSize || parseFloat(t.style.fontSize) < 19) t.style.fontSize = '19px'; });
    halo(svg, 'text.ch-lab');
    return res;
  }


  const BR = D.brent, BX = BR.mois.map(xm), BRP = R.brent;
  function brent(box, o) {
    const i = m => BR.mois.indexOf(m);
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2, legend: false, hover: !o.big, margin: o.big ? { r: 64 } : undefined,
      x: { min: 2019, max: BX[BX.length - 1] + 0.1, ticks: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], hoverFormat: moisX },
      y: { min: 0, max: 140, ticks: [0, 20, 40, 60, 80, 100, 120, 140] },
      yTitle: 'Pétrole Brent, dollars par baril',
      series: [{ name: 'Brent', color: AMB, data: BX.map((x, j) => [x, BR.prix[j]]), width: 3.6, format: v => fmt(v, 1) }],

      markers: [Object.assign({ x: BX[i(BRP.pic_2022_mois)], y: BRP.pic_2022, color: AMB, label: `${fmt(BRP.pic_2022, 0)} en ${moisX(BX[i(BRP.pic_2022_mois)])}` }, o.big ? { anchor: 'end', dx: -12, dy: -10 } : { dy: -16 }),
                { x: BX[i('2026-01')], y: BRP['2026-01'], color: AMB, label: `${fmt(BRP['2026-01'], 0)}`, anchor: 'end', dx: -12, dy: 30 },
                { x: BX[i('2026-04')], y: BRP['2026-04'], color: AMB, label: `${fmt(BRP['2026-04'], 0)} en avril 2026`, anchor: 'end', dx: -14, dy: -12 },
                { x: BX[i('2026-09')], y: BRP['2026-09'], color: AMB, label: `${fmt(BRP['2026-09'], 0)}`, anchor: 'start', dx: 12, dy: 6 }]
    });
    if (res && res.svg) halo(res.svg, 'text.ch-val');
    return res;
  }



  const CO = R.monnaie.composition;
  function m3bars(box, o) {
    const rows = [['Billets et pièces', CO.billets, CO.part_billets, NOM], ['Dépôts à vue', CO.depots_vue, CO.part_depots_vue, '#2E7D5B'], ['Autres dépôts à court terme', CO.autres_depots, CO.part_autres_depots, '#8CBFA4'], ['Titres monétaires', CO.titres, CO.part_titres, '#C99A2E']];
    return CH.hbars(box, { height: o.height, animate: o.animate, max: 11000, yTitle: `M3, ${MOIS[+CO.mois.slice(5, 7) - 1]} ${CO.mois.slice(0, 4)} : ${fmt(CO.m3, 0)} milliards d'euros`,
      data: rows.map(([l, v, p, c], j) => ({ label: l, value: v, color: c, bold: !j, valueLabel: `${fmt(v, 0)} Md€ · ${fmt(p, 1)} %` })) });
  }

  const ESD = D.eurosysteme, ESX = ESD.mois.map(xm), ESR = R.eurosysteme;
  function eurosys(box, o) {
    const res = CH.line(box, { exactSeriesColors: true,
      height: o.height, animate: o.animate, duration: 2, stagger: 0.2, hover: !o.big,
      x: { min: 2007, max: ESX[ESX.length - 1] + 0.1, ticks: [2007, 2010, 2014, 2018, 2022, 2026], hoverFormat: moisX },
      y: { min: 0, max: 5000, ticks: [0, 1000, 2000, 3000, 4000, 5000] },
      yTitle: 'Eurosystème, milliards d\'euros',
      series: [{ name: 'Prêts aux banques', color: BLUE, data: ESX.map((x, j) => [x, ESD.prets[j]]), endLabel: 'prêts aux banques', endDy: -22, width: 3.4, format: v => fmt(v, 0) },
               { name: 'Titres de politique monétaire', color: RED, data: ESX.map((x, j) => [x, ESD.titres[j]]).filter(d => d[1] != null), endLabel: 'titres', width: 3.4, format: v => fmt(v, 0) }],
      markers: [{ x: xd(ESR.prets_pic_date), y: ESR.prets_pic_mds, color: BLUE, label: fmt(ESR.prets_pic_mds, 0), dy: -14 },
                { x: xd(ESR.titres_pic_date), y: ESR.titres_pic_mds, color: RED, label: fmt(ESR.titres_pic_mds, 0), dy: -14 }]
    });
    if (res && res.svg) halo(res.svg, 'text.ch-val');
    return res;
  }

  const CMD = D.credit_m3, CMX = CMD.mois.map(xm);
  function creditM3(box, o) {
    return CH.line(box, {
      height: o.height, animate: o.animate, duration: 2, stagger: 0.2, hover: !o.big,
      x: { min: 1999, max: CMX[CMX.length - 1] + 0.1, ticks: [2000, 2005, 2010, 2015, 2020, 2025], hoverFormat: moisX },
      y: { min: -4, max: 14, ticks: [-4, 0, 4, 8, 12] },
      yTitle: 'Variation sur un an, %',
      series: [{ name: 'Prêts au secteur privé', color: OLIVE, data: CMX.map((x, j) => [x, CMD.credit[j]]), endLabel: 'crédit', width: 3, format: v => fmt(v, 1) },
               { name: 'M3', color: NOM, data: CMX.map((x, j) => [x, CMD.m3[j]]), endLabel: 'M3', width: 3, format: v => fmt(v, 1) }]
    });
  }

  const RSD = D.reserves, RSX = RSD.mois.map(xm);
  function reserves(box, o) {
    const RR = R.reserves, last = RR.dernier_mois;
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2, stagger: 0.2, hover: !o.big,
      x: { min: 2003, max: RSX[RSX.length - 1] + 0.1, ticks: [2003, 2007, 2012, 2017, 2022, 2026], hoverFormat: moisX },
      y: { min: 0, max: 5000, ticks: [0, 1000, 2000, 3000, 4000, 5000] },
      yTitle: 'Réserves des banques, milliards d\'euros',
      series: [{ name: 'Détenues', color: NOM, data: RSX.map((x, j) => [x, RSD.detenues[j]]), endLabel: 'détenues', width: 3.2, format: v => fmt(v, 0) },
               { name: 'Exigées', color: SLATE, data: RSX.map((x, j) => [x, RSD.exigees[j]]), endLabel: 'exigées', endDy: -20, width: 3.2, format: v => fmt(v, 0) }],
      markers: [{ x: xm(last), y: RR[last].detenues, color: NOM, label: fmt(RR[last].detenues, 0), anchor: 'end', dx: -12, dy: -10 }]
    });
    if (res && res.svg) halo(res.svg, 'text.ch-val');
    return res;
  }

  const MB = D.monnaie_base, MBX = MB.mois.map(xm);
  function qe(box, o) {
    const i14 = MB.mois.indexOf('2014-12'), i21 = MB.mois.indexOf('2021-12');
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2, stagger: 0.2, hover: !o.big,
      x: { min: 2007, max: MBX[MBX.length - 1] + 0.1, ticks: [2007, 2010, 2014, 2018, 2022, 2026], hoverFormat: moisX },
      y: { min: 0, max: 20, ticks: [0, 5, 10, 15, 20], format: v => fmt(v, 0) },
      yTitle: 'Zone euro, milliers de milliards d\'euros',
      series: [{ name: 'M3', color: NOM, data: MBX.map((x, j) => [x, MB.m3[j] / 1000]), endLabel: 'M3', width: 3.4, format: v => fmt(v, 1) },
               { name: 'Monnaie de banque centrale', color: SLATE, data: MBX.map((x, j) => [x, MB.base[j] / 1000]), endLabel: 'monnaie centrale', width: 3.4, format: v => fmt(v, 1) }],
      markers: [{ x: MBX[i14], y: MB.base[i14] / 1000, color: SLATE, label: fmt(MB.base[i14] / 1000, 1), dy: -14 },
                { x: MBX[i21], y: MB.base[i21] / 1000, color: SLATE, label: fmt(MB.base[i21] / 1000, 1), dy: -14 }]
    });
    if (res && res.svg) halo(res.svg, 'text.ch-val');
    return res;
  }



  const IPD = D.ipch, IPX = IPD.mois.map(xm);
  function courtTerme(box, o) {
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2.2, stagger: 0.25, hover: !o.big,
      x: { min: 2000, max: IPX[IPX.length - 1] + 0.1, ticks: [2000, 2005, 2010, 2015, 2020, 2025], hoverFormat: moisX },
      y: { min: -2, max: 14, ticks: [-2, 0, 2, 4, 6, 8, 10, 12, 14] },
      yTitle: 'Variation sur un an, %',
      series: [{ name: 'M3', color: NOM, data: CMX.map((x, j) => [x, CMD.m3[j]]).filter(d => d[0] >= 2000), endLabel: 'M3', width: 3, format: v => fmt(v, 1) },
               { name: 'Inflation', color: RED, data: IPX.map((x, j) => [x, IPD.total[j]]), endLabel: 'inflation', width: 3, format: v => fmt(v, 1) }]
    });
    cible(res, IPX[IPX.length - 1] + 0.1);
    return res;
  }



  function composantes(box, o) {
    const [h1, h2] = o.heights || [250, 350];
    const [top, bot] = panels(box, [h1, h2]);
    const from = '2019-01', i0 = IPD.mois.indexOf(from), XS = IPX.slice(i0), sl = a => a.slice(i0);
    const xo = { min: 2019, max: XS[XS.length - 1] + 0.1, ticks: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], hoverFormat: moisX };
    CH.line(top, { height: h1, animate: o.animate, duration: 2, legend: false, hover: !o.big, x: Object.assign({}, xo, { ticks: [] }), margin: { b: 14, t: 52 },
      y: { min: -20, max: 50, ticks: [-20, 0, 20, 40] }, yTitle: 'Énergie, variation sur un an, %',
      series: [{ name: 'Énergie', color: AMB, data: XS.map((x, j) => [x, sl(IPD.energie)[j]]), width: 3, format: v => fmt(v, 1) }],
      markers: [{ x: xm(R.ipch.pic_energie_mois), y: R.ipch.pic_energie, color: AMB, label: fmt(R.ipch.pic_energie, 1), dy: -12 },
                { x: XS[XS.length - 1], y: R.ipch.ea.energie, color: AMB, label: fmt(R.ipch.ea.energie, 1), anchor: 'end', dx: -12, dy: -12 }] });
    const res = CH.line(bot, { height: h2, animate: o.animate, duration: 2, stagger: 0.2, hover: !o.big, x: xo,
      y: { min: -1, max: 11, ticks: [0, 2, 4, 6, 8, 10] }, yTitle: 'Ensemble et hors énergie et alimentation, %',
      series: [{ name: 'Ensemble', color: RED, data: XS.map((x, j) => [x, sl(IPD.total)[j]]), endLabel: 'ensemble', width: 3.2, format: v => fmt(v, 1) },
               { name: 'Sous-jacente', color: INK, data: XS.map((x, j) => [x, sl(IPD.sous_jacente)[j]]), endLabel: 'sous-jacente', width: 3.2, format: v => fmt(v, 1) }],
      ends: true });
    [top, bot].forEach(b => { const s = b.querySelector('svg'); if (s) halo(s, 'text.ch-val,text.ch-lab'); });
    cible(res, xo.max);
    return res;
  }

  const SC = M5.SC, ogR = M5.ogdg;
  const OG_X = [-8, 4], OG_Y = [0, 7];
  function ogdgEtat(box, s, o = {}) {
    const dep = SC.depart, isDep = (s.a || 0) === 0 && (s.o || 0) === 0 && (s.pe ?? 2) === 2;
    const lines = [], eq = [], shifts = [];
    if (!isDep) {
      if ((s.o || 0) !== 0 || (s.pe ?? 2) !== 2) lines.push({ type: 'og', s: dep, faded: true, label: 'OG' });
      if ((s.a || 0) !== 0) lines.push({ type: 'dg', s: dep, faded: true, label: 'DG' });
      eq.push({ s: dep, faded: true });
    }
    lines.push({ type: 'og', s, label: isDep || ((s.o || 0) === 0 && (s.pe ?? 2) === 2) ? 'OG' : 'OG′', anim: o.animate && !isDep });
    lines.push({ type: 'dg', s, label: isDep || (s.a || 0) === 0 ? 'DG' : 'DG′', anim: o.animate && !isDep, labelDy: 6 });
    if ((s.a || 0) !== 0) shifts.push({ type: 'dg', from: dep, to: s, label: (s.a > 0 ? '+' : '−') + NB + fmt(Math.abs(s.a), 0), anim: o.animate });
    if ((s.o || 0) !== 0 || (s.pe ?? 2) !== 2) shifts.push({ type: 'og', from: dep, to: s, label: sgn((s.o || 0) + (s.pe ?? 2) - 2, 1).replace(',0', ''), anim: o.animate });
    eq.push({ s, anim: o.animate && !isDep, delay: o.animate ? 0.8 : 0 });
    OGDG.draw(box, Object.assign({ height: o.height || 520, x: OG_X, y: OG_Y, lines, eq, shifts, moves: isDep ? [] : [{ from: dep, to: s, anim: o.animate, delay: 0.9 }] }, o.extra || {}));
    return ogR(s);
  }

  function relance(box, o = {}) {
    const off = SC.offre, rel = SC.relance, first = o.animate;
    OGDG.draw(box, Object.assign({ height: o.height || 520, x: OG_X, y: OG_Y,
      lines: [{ type: 'og', s: off, label: 'OG′' }, { type: 'dg', s: off, faded: true, label: 'DG' }, { type: 'dg', s: rel, label: 'DG′', anim: first, labelDy: 6 }],
      shifts: [{ type: 'dg', from: off, to: rel, label: '+' + NB + '3', anim: first }],
      eq: [{ s: SC.depart, faded: true }, { s: off, faded: true }, { s: rel, anim: first, delay: first ? 0.8 : 0 }],
      moves: [{ from: off, to: rel, anim: first, delay: 0.9 }] }, o.extra || {}));
    return ogR(rel);
  }

  function reponseChoc(box, key, o = {}) {
    const first = o.animate, off = SC.offre, s = SC[key], lines = [{ type: 'og', s: SC.depart, faded: true, label: 'OG' }], eq = [{ s: SC.depart, faded: true }], shifts = [];
    if (key === 'derive') { lines.push({ type: 'og', s: off, faded: true, label: 'OG′' }); lines.push({ type: 'og', s, label: 'OG″', anim: first }); shifts.push({ type: 'og', from: off, to: s, label: '+' + NB + '1,5', anim: first }); }
    else lines.push({ type: 'og', s: off, label: 'OG′' });
    if ((s.a || 0) !== 0) { lines.push({ type: 'dg', s: off, faded: true, label: 'DG' }); lines.push({ type: 'dg', s, label: 'DG′', anim: first, labelDy: 6 }); shifts.push({ type: 'dg', from: off, to: s, label: '−' + NB + fmt(-s.a, 0), anim: first }); }
    else lines.push({ type: 'dg', s, label: 'DG', labelDy: 6 });
    if (key !== 'offre') eq.push({ s: off, faded: true });
    eq.push({ s, anim: first, delay: first ? 0.7 : 0 });
    OGDG.draw(box, Object.assign({ height: o.height || 510, x: OG_X, y: OG_Y, lines, eq, shifts, moves: key === 'offre' ? [] : [{ from: off, to: s, anim: first, delay: 0.8 }] }, o.extra || {}));
    return ogR(s);
  }

  const CF = D.chocs, BANDE = { offre: '#F0CFC9', demande: '#D2DFEE', deux: '#DDD5C4' };
  function chocsFrance(box, o) {
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2.2, stagger: 0.2, hover: !o.big,
      x: { min: 1960, max: 2025.5, ticks: [1960, 1970, 1980, 1990, 2000, 2010, 2020] },
      y: { min: -8, max: 14, ticks: [-8, -4, 0, 4, 8, 12] },
      yTitle: 'France, %',
      bands: CF.episodes.map(([a, t]) => ({ x0: a - 0.5, x1: a + 0.5, color: BANDE[t] })),
      series: [{ name: 'Croissance du PIB en volume', color: BLUE, data: CF.annees.map((a, j) => [a, CF.g[j]]), endLabel: 'croissance', width: 3.2, format: v => fmt(v, 1) },
               { name: 'Inflation', color: RED, data: CF.annees.map((a, j) => [a, CF.inflation[j]]), endLabel: 'inflation', width: 3.2, format: v => fmt(v, 1) }]
    });


    const fs = o.big ? 19 : 15;
    if (res && res.S) CF.episodes.forEach(([a], j) => {
      const pr = CF.episodes[j - 1], nx = CF.episodes[j + 1], near = b => b && Math.abs(res.S.X(b[0]) - res.S.X(a)) < 2.6 * fs;
      CH.txt(res.svg, res.S.X(a) + (near(nx) ? 4 : near(pr) ? -4 : 0), res.m.t - 8, String(a), 'ch-lab', { 'text-anchor': near(nx) ? 'end' : near(pr) ? 'start' : 'middle', fill: '#5F707D', style: `font-size:${fs}px` });
    });
    return res;
  }
  const BANDES = BANDE;



  const USA = D.us, ya = a => USA.annees.indexOf(a);
  function phillips(box, o) {
    const fr = CH.frame(box, { height: o.height }), svg = fr.svg, Wd = fr.Wd, Ht = fr.Ht;
    const m = { l: 70, r: 40, t: 62, b: 76 };
    const X = v => m.l + (v - o.x[0]) / (o.x[1] - o.x[0]) * (Wd - m.l - m.r), Y = v => Ht - m.b - (v - o.y[0]) / (o.y[1] - o.y[0]) * (Ht - m.t - m.b);
    CH.el('line', { x1: m.l, y1: Ht - m.b, x2: m.l, y2: m.t - 22, class: 'ch-axis', 'marker-end': fr.arrow }, svg);
    CH.el('line', { x1: m.l, y1: Ht - m.b, x2: Wd - m.r + 22, y2: Ht - m.b, class: 'ch-axis', 'marker-end': fr.arrow }, svg);
    o.xt.forEach(v => { CH.el('line', { x1: X(v), x2: X(v), y1: Ht - m.b, y2: Ht - m.b + 7, class: 'ch-tickmark' }, svg); CH.txt(svg, X(v), Ht - m.b + 30, fmt(v, 0), 'ch-tick', { 'text-anchor': 'middle' }); });
    o.yt.forEach(v => { CH.el('line', { x1: m.l - 7, x2: m.l, y1: Y(v), y2: Y(v), class: 'ch-tickmark' }, svg); CH.txt(svg, m.l - 13, Y(v) + 6.5, fmt(v, 0), 'ch-tick ch-num', { 'text-anchor': 'end' }); });
    CH.txt(svg, m.l - 10, m.t - 34, 'Inflation, %', 'ch-ytitle', { 'text-anchor': 'start' });
    CH.txt(svg, Wd - m.r, Ht - 6, 'Taux de chômage, %', 'ch-xtitle', { 'text-anchor': 'end' });
    const vus = new Set();
    o.segments.forEach((sg, si) => {
      const ans = []; for (let a = sg.from; a <= sg.to; a++) ans.push(a);
      const d = ans.map((a, j) => (j ? 'L' : 'M') + X(USA.chomage[ya(a)]).toFixed(1) + ',' + Y(USA.inflation[ya(a)]).toFixed(1)).join(' ');
      const p = CH.el('path', { d, fill: 'none', stroke: sg.color, 'stroke-width': 3, 'stroke-linejoin': 'round', class: 'ch-line' }, svg);
      if (o.animate) { try { const L = p.getTotalLength(); p.style.setProperty('--len', L); p.style.setProperty('--dur', '0.9s'); p.style.animationDelay = (si * 0.9) + 's'; p.classList.add('ch-anim'); } catch (e) { } }
      ans.forEach(a => {
        const g = CH.el('g', o.animate ? { class: 'ch-fade', style: `animation-delay:${si * 0.9 + 0.3}s` } : {}, svg);
        CH.el('circle', { cx: X(USA.chomage[ya(a)]), cy: Y(USA.inflation[ya(a)]), r: 5.5, fill: sg.color, stroke: '#fff', 'stroke-width': 1.5 }, g);
        const lab = vus.has(a) ? null : (o.labels || {})[a];
        if (lab) vus.add(a);
        if (lab) CH.txt(g, X(USA.chomage[ya(a)]) + lab[0], Y(USA.inflation[ya(a)]) + lab[1], String(a), 'ch-lab', { 'text-anchor': lab[2] || 'start', fill: CH.darken(sg.color), style: `font-size:${fz(o, 17)}px;font-weight:700` });
      });
    });
    halo(svg, 'text.ch-lab');
    return { svg, X, Y };
  }

  const PH60 = { x: [3, 7.5], y: [0, 6], xt: [3, 4, 5, 6, 7], yt: [0, 1, 2, 3, 4, 5, 6], segments: [{ from: 1961, to: 1969, color: BLUE }], labels: { 1961: [10, -10], 1965: [10, -10], 1969: [-12, -10, 'end'] } };
  const PH70 = { x: [3, 10.5], y: [0, 14], xt: [3, 4, 5, 6, 7, 8, 9, 10], yt: [0, 2, 4, 6, 8, 10, 12, 14],
    segments: [{ from: 1961, to: 1969, color: BLUE }, { from: 1969, to: 1979, color: RED }, { from: 1979, to: 1983, color: INK }],
    labels: { 1961: [10, 18], 1969: [10, 24], 1974: [-12, -8, 'end'], 1975: [12, 6], 1980: [12, -8], 1982: [12, 6], 1983: [12, 18] } };
  const phillips60 = (box, o) => phillips(box, Object.assign({}, PH60, o));
  const phillips70 = (box, o) => phillips(box, Object.assign({}, PH70, o));


  const PH = M5.PH;
  function spirale(box, u, ancre, o) {
    const s = M5.spirale(u, ancre), base = M5.spirale(PH.ustar, false), ans = s.map((_, j) => j + 1);
    const lo = Math.min(-2, Math.floor(Math.min(...s))), hi = Math.max(8, Math.ceil(Math.max(...s)));
    const res = CH.line(box, { height: o.height, animate: o.animate, duration: 1.4, legend: false, hover: !o.big,
      x: { min: 1, max: 10.3, ticks: ans, format: v => String(v), hoverFormat: v => 'année ' + v }, y: { min: o.y ? o.y[0] : lo, max: o.y ? o.y[1] : hi, ticks: o.yTicks || CH.niceTicks(lo, hi, 5) },
      yTitle: 'Inflation, %', xTitle: o.xTitle,
      series: [{ name: `chômage à ${PH.ustar} %`, color: SLATE, data: ans.map((a, j) => [a, base[j]]), width: 2.4, format: v => fmt(v, 1) },
               { name: 'simulation', color: RED, data: ans.map((a, j) => [a, s[j]]), width: 3.6, points: true, format: v => fmt(v, 1) }] });

    if (res && res.S) { CH.txt(res.svg, res.S.X(10.2), s[9] < 1.99 ? res.S.Y(2) - 10 : res.S.Y(2) + 24, `chômage à ${PH.ustar} %`, 'ch-lab', { 'text-anchor': 'end', fill: '#5F707D', style: `font-size:${fz(o, 15)}px` }); halo(res.svg, 'text.ch-lab'); }
    return s;
  }

  const TE = M5.TENT;
  function tentation(box, n, o) {
    const fr = CH.frame(box, { height: o.height }), svg = fr.svg, Wd = fr.Wd, Ht = fr.Ht, first = o.animate;
    const m = { l: 70, r: o.big ? 200 : 150, t: 62, b: 76 }, xr = [4, 9], yr = [0, 5];
    const X = v => m.l + (v - xr[0]) / (xr[1] - xr[0]) * (Wd - m.l - m.r), Y = v => Ht - m.b - (v - yr[0]) / (yr[1] - yr[0]) * (Ht - m.t - m.b);
    CH.el('line', { x1: m.l, y1: Ht - m.b, x2: m.l, y2: m.t - 22, class: 'ch-axis', 'marker-end': fr.arrow }, svg);
    CH.el('line', { x1: m.l, y1: Ht - m.b, x2: Wd - m.r + 22, y2: Ht - m.b, class: 'ch-axis', 'marker-end': fr.arrow }, svg);
    [4, 5, 6, 7, 8, 9].forEach(v => { CH.el('line', { x1: X(v), x2: X(v), y1: Ht - m.b, y2: Ht - m.b + 7, class: 'ch-tickmark' }, svg); CH.txt(svg, X(v), Ht - m.b + 30, fmt(v, 0), 'ch-tick', { 'text-anchor': 'middle' }); });
    [0, 1, 2, 3, 4, 5].forEach(v => { CH.el('line', { x1: m.l - 7, x2: m.l, y1: Y(v), y2: Y(v), class: 'ch-tickmark' }, svg); CH.txt(svg, m.l - 13, Y(v) + 6.5, fmt(v, 0), 'ch-tick ch-num', { 'text-anchor': 'end' }); });
    CH.txt(svg, m.l - 10, m.t - 34, 'Inflation, %', 'ch-ytitle', { 'text-anchor': 'start' });
    CH.txt(svg, Wd - m.r, Ht - 6, 'Taux de chômage, %', 'ch-xtitle', { 'text-anchor': 'end' });
    CH.el('line', { x1: X(PH.ustar), x2: X(PH.ustar), y1: Ht - m.b, y2: m.t, stroke: CHO, 'stroke-width': 1.8, 'stroke-dasharray': '7 6', opacity: 0.7 }, svg);
    CH.txt(svg, X(PH.ustar), m.t - 10, 'chômage d\'équilibre', 'ch-lab', { 'text-anchor': 'middle', fill: CHO, style: `font-size:${fz(o, 16)}px` });
    const droite = (pe, col, faded, lab) => {
      const f = u => pe - PH.beta * (u - PH.ustar);
      CH.el('line', { x1: X(xr[0]), y1: Y(f(xr[0])), x2: X(xr[1]), y2: Y(f(xr[1])), stroke: col, 'stroke-width': faded ? 2.4 : 3.6, 'stroke-dasharray': faded ? '7 6' : null, opacity: faded ? 0.7 : 1 }, svg);
      CH.txt(svg, X(xr[1]) + 10, Y(f(xr[1])) + 7, lab, 'ch-lab', { fill: faded ? '#6B7782' : CH.darken(col), style: `font-size:${fz(o, 17)}px;font-weight:700` });
    };
    const point = (u, pi, lab, dx, dy, anchor, faded) => {
      const g = CH.el('g', first && !faded ? { class: 'ch-fade' } : {}, svg);
      CH.el('circle', { cx: X(u), cy: Y(pi), r: faded ? 7 : 9.5, fill: faded ? '#fff' : INK, stroke: faded ? INK : '#fff', 'stroke-width': 2.5, opacity: faded ? 0.75 : 1 }, g);
      CH.txt(g, X(u) + dx, Y(pi) + dy, lab, 'ch-lab', { 'text-anchor': anchor || 'start', fill: faded ? '#6B7782' : INK, style: `font-size:${fz(o, 17)}px;font-weight:700` });
    };
    if (n >= 1) droite(TE.promesse.pi, RED, n >= 3, 'anticipations 2 %');
    if (n >= 3) droite(TE.anticipee.pi, RED, false, 'anticipations 2,5 %');
    if (n >= 1) point(TE.promesse.u, TE.promesse.pi, '1. promesse', 14, 28, 'start', n >= 2);
    if (n >= 2) point(TE.surprise.u, TE.surprise.pi, '2. surprise', -14, -14, 'end', n >= 3);
    if (n >= 3) point(TE.anticipee.u, TE.anticipee.pi, '3. anticipée', 14, -14, 'start', false);
    halo(svg, 'text.ch-lab');
  }

  const SPD = D.spf, SPX = SPD.trimestres.map(q => +q.slice(0, 4) + (+q.slice(-1) - 0.5) / 4);
  function ancrage(box, o) {
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2.2, stagger: 0.3, hover: !o.big,
      x: { min: 1999, max: IPX[IPX.length - 1] + 0.1, ticks: [2000, 2005, 2010, 2015, 2020, 2026], hoverFormat: moisX },
      y: { min: -1, max: 11, ticks: [0, 2, 4, 6, 8, 10] },
      yTitle: 'Zone euro, %',
      series: [{ name: 'Inflation sur un an', color: RED, data: IPX.map((x, j) => [x, IPD.total[j]]), endLabel: 'inflation', width: 2.8, format: v => fmt(v, 1) },
               { name: 'Anticipée dans cinq ans', color: INK, data: SPX.map((x, j) => [x, SPD.long_terme[j]]), endLabel: 'anticipée à 5 ans', width: 3.6, format: v => fmt(v, 2) }]
    });
    cible(res, IPX[IPX.length - 1] + 0.1);
    return res;
  }



  const TD = D.taux, EX_ = TD.estr_mois.map(xm);
  function corridor(box, o) {
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2, stagger: 0.2, hover: false,
      x: { min: 2019.75, max: xd(TD.jusqu_au) + 0.05, ticks: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      y: { min: -1, max: 4.5, ticks: [-1, 0, 1, 2, 3, 4], format: v => fmt(v, 0) },
      yTitle: 'Taux, %',
      series: [{ name: 'Facilité de dépôt', color: PRUNE, data: escalier(TD.dfr, '2019-10-01', TD.jusqu_au), endLabel: 'taux de dépôt', width: 3.6, format: v => fmt(v, 2) },
               { name: '€STR, moyenne mensuelle', color: INK, data: EX_.map((x, j) => [x, TD.estr[j]]), endLabel: '€STR', width: 2.4, format: v => fmt(v, 2) }]
    });
    if (res && res.svg) halo(res.svg, 'text.ch-lab');
    return res;
  }

  const CFD = D.credit_fr, CFX = CFD.mois.map(xm);
  function transmission(box, o) {
    const [h1, h2] = o.heights || [300, 300];
    const [top, bot] = panels(box, [h1, h2]);
    const xo = { min: 2014, max: CFX[CFX.length - 1] + 0.1, ticks: [2014, 2016, 2018, 2020, 2022, 2024, 2026], hoverFormat: moisX };
    CH.line(top, { height: h1, animate: o.animate, duration: 2, legend: false, hover: !o.big, x: Object.assign({}, xo, { ticks: [] }), margin: { b: 14 },
      y: { min: 0, max: 4.5, ticks: [0, 1, 2, 3, 4], format: v => fmt(v, 0) }, yTitle: 'Taux des crédits nouveaux à l\'habitat, %',
      series: [{ name: 'Taux', color: PRUNE, data: CFX.map((x, j) => [x, CFD.taux[j]]), width: 3.4, format: v => fmt(v, 2) }],
      markers: [{ x: xm(R.credit_fr.taux_min_mois), y: R.credit_fr.taux_min, color: PRUNE, label: fmt(R.credit_fr.taux_min, 2), dy: 30 },
                { x: xm(R.credit_fr.taux_max_mois), y: R.credit_fr.taux_max, color: PRUNE, label: fmt(R.credit_fr.taux_max, 2), dy: -14 }] });
    CH.line(bot, { height: h2, animate: o.animate, duration: 2, legend: false, hover: !o.big, x: xo,
      y: { min: 0, max: 30, ticks: [0, 10, 20, 30] }, yTitle: 'Montants hors renégociations, Md€ par mois',
      series: [{ name: 'Montants', color: NOM, data: CFX.map((x, j) => [x, CFD.montants_nouveaux[j]]).filter(d => d[1] != null), width: 3, format: v => fmt(v, 1) }] });
    [top, bot].forEach(b => { const s = b.querySelector('svg'); if (s) halo(s, 'text.ch-val'); });
  }

  function tauxReel(box, o) {
    const i0 = IPD.mois.indexOf('2019-01');

    const data = IPD.mois.slice(i0).map((m, j) => [xm(m), tauxAu(TD.dfr, m + '-31') - IPD.total[i0 + j]]);
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2, legend: false, hover: !o.big,
      x: { min: 2019, max: data[data.length - 1][0] + 0.1, ticks: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], hoverFormat: moisX },
      y: { min: -12, max: 4, ticks: [-12, -8, -4, 0, 4] },
      yTitle: 'Taux de dépôt moins inflation, points',
      series: [{ name: 'Taux réel', color: PRUNE, data, width: 3.4, format: v => fmt(v, 1) }],
      markers: [{ x: xm('2022-12'), y: R.taylor.taux_reel['2022-12'], color: PRUNE, label: fmt(R.taylor.taux_reel['2022-12'], 1) + ' en décembre 2022', anchor: 'start', dx: 14, dy: 8 },
                { x: data[data.length - 1][0], y: data[data.length - 1][1], color: PRUNE, label: fmt(data[data.length - 1][1], 1), anchor: 'end', dx: -12, dy: 30 }]
    });
    if (res && res.svg) halo(res.svg, 'text.ch-val');
    return res;
  }

  const TYD = D.taylor;
  function taylor(box, mes, o) {
    const res = CH.line(box, { height: o.height, animate: o.animate, duration: 2, stagger: 0.2, hover: !o.big,
      x: { min: 2001, max: 2025.3, ticks: [2001, 2005, 2010, 2015, 2020, 2025] }, y: { min: -4, max: 13, ticks: [-4, 0, 4, 8, 12] },
      yTitle: 'Zone euro, moyennes annuelles, %',
      series: [{ name: 'Taux au jour le jour', color: PRUNE, data: TYD.annees.map((a, j) => [a, TYD.jj[j]]), endLabel: 'taux effectif', width: 3.2, format: v => fmt(v, 1) },
               { name: 'Règle de Taylor', color: INK, data: TYD.annees.map((a, j) => [a, (mes === 'sj' ? TYD.t_sj : TYD.t_total)[j]]), endLabel: mes === 'sj' ? 'règle (sous-jacente)' : 'règle (totale)', width: 3.2, format: v => fmt(v, 1) }] });
    if (res && res.svg) halo(res.svg, 'text.ch-lab');
    return res;
  }

  return { COL, MOIS, halo, xm, xd, moisX, sgn, escalier, tauxAu, panels,
    nuage, brent, m3bars, eurosys, creditM3, reserves, qe, courtTerme, composantes,
    OG_X, OG_Y, ogdgEtat, relance, reponseChoc, chocsFrance, BANDES,
    phillips, phillips60, phillips70, spirale, tentation, ancrage, corridor, transmission, tauxReel, taylor };
})();
(function () {
  'use strict';
  const R = window.REPERES, CH = window.Charts, PJ = window.PJ, G = window.G5, M5 = window.M5;
  const { fmt } = CH;
  const NB = ' ';
  const byId = id => document.getElementById(id);
  const k = (kind, html) => `<span class="k-${kind}">${html}</span>`;
  const anim = ctx => !(ctx && (ctx.reading || ctx.print));
  const put = (id, html) => { const e = typeof id === 'string' ? byId(id) : id; if (e) { e.innerHTML = html; PJ.signs(e, true); } };
  const sgn = (v, d = 0) => Math.abs(v) < 0.5 * Math.pow(10, -d) ? '0' : (v > 0 ? '+' : '−') + NB + fmt(Math.abs(v), d);
  const num = v => fmt(v, Math.abs(v - Math.round(v)) < 0.05 ? 0 : 1);
  const MOIS = G.MOIS;
  const Z = 1.25;
  const zoom = id => PJ.zoom(id, Z);
  const big = (box, animate, extra) => Object.assign({ height: box.clientHeight, animate, big: true }, extra || {});

  const scen = (id, i, n, txt) => put(id, `<span class="n">${i + 1} / ${n}</span> ${txt}`);

  const onEnter = (id, draw) => Deck.on(id, { enter(el, ctx) { draw(anim(ctx)); } });


  onEnter('couverture', a => { const b = PJ.zoom('pj-cover', 1.2); G.nuage(b, big(b, a, { labels: ['COD', 'TUR', 'USA', 'JPN'], diagLabel: false, xTitle: 'Croissance de la monnaie moins celle de la production, %' })); });
  onEnter('bce-2026', a => { const b = zoom('pj-brent'); G.brent(b, big(b, a)); });



  function bilans(id, scen, box, nOps) {
    PJ.scenes(id, n => {
      const S = M5.SCEN[scen], op = S.ops[n];
      Bilans.render(byId(box), scen, n + 1, { legende: false, base: scen !== 'credit' });
      put(box + '-leg', `<span class="p-scen" style="margin-right:14px"><span class="n">${n + 1} / ${nOps}</span></span><b>${M5.OPS[op].titre}.</b>`);
    }, nOps - 1);
  }
  bilans('credit-bilan', 'credit', 'pj-bl-credit', 4);
  bilans('reserves-bilan', 'reserves', 'pj-bl-reserves', 3);
  bilans('qe-bilan', 'qe', 'pj-bl-qe', 2);
  onEnter('bce-monnaie', a => { const b = zoom('pj-eurosys'); G.eurosys(b, big(b, a)); });
  onEnter('credit-m3', a => { const b = zoom('pj-credit-m3'); G.creditM3(b, big(b, a)); });

  const monnaie = R.monnaie;
  const moisObserve = monnaie.composition.mois;
  const casMultiplicateur = [
    { titre: 'Scénario de référence', m3_mds: 110, base_mds: 11, billets_public_mds: 10, reserves_larges_mds: 1 },
    { titre: 'Zone euro, juin 2007', ...monnaie.identite_2007 },
    { titre: 'Zone euro, ' + MOIS[+moisObserve.slice(5, 7) - 1] + ' ' + moisObserve.slice(0, 4), ...monnaie.identite_dernier }
  ];
  PJ.scenes('multi-scen', i => {
    const { titre, m3_mds: m3, base_mds: base, billets_public_mds: billets, reserves_larges_mds: reserves } = casMultiplicateur[i];
    const depots = m3 - billets, r = reserves / depots, c = billets / depots;
    const exemple = i === 0, signe = exemple ? '=' : '≈';
    const precision = exemple ? 2 : 4, dec = x => fmt(x, precision);
    const rAffiche = Number(r.toFixed(precision)), cAffiche = Number(c.toFixed(precision));
    const frac = window.C.frac;
    const ratio = (lettre, montant, taux) => `<i>${lettre}</i> = ${frac(fmt(montant), fmt(depots))} ${signe} ${dec(taux)} = <b>${fmt(100 * taux, exemple ? 0 : 2)}${NB}%</b>`;
    scen('pj-mu-lbl', i, casMultiplicateur.length, titre);
    put('pj-mu-depots', exemple
      ? 'Pour <b>100 € de dépôts</b>, supposons que les banques gardent 1 € de réserves et que le public détient 10 € en billets.'
      : `En milliards d’euros, <b>dépôts</b> = M3 − billets du public = ${fmt(m3)} − ${fmt(billets)} = <b>${fmt(depots)}</b>.`);
    put('pj-mu-r', ratio('r', reserves, r));
    put('pj-mu-c', ratio('c', billets, c));
    const substitution = frac('1 + ' + dec(c), dec(r) + ' + ' + dec(c));
    const quotient = frac(dec(1 + cAffiche), dec(rAffiche + cAffiche));
    put('pj-mu-m', `${frac('M3', '<i>B</i>')} = ${frac('1 + <i>c</i>', '<i>r</i> + <i>c</i>')} ${signe} ${substitution} = ${quotient} ${signe} <b>${fmt(M5.mult(r, c), exemple ? 0 : 1)}</b>`);
    const stocks = exemple ? 'M3 = 100 + 10 = 110 € et la base monétaire vaut 1 + 10 = 11 €.' : 'Montants arrondis au milliard d’euros.';
    put('pj-mu-verif', `${stocks} On retrouve M3 / <i>B</i> = ${fmt(m3)} / ${fmt(base)} ${signe} ${fmt(m3 / base, exemple ? 0 : 1)}.`);
  }, 2);
  onEnter('multi-reserves', a => { const b = zoom('pj-reserves'); G.reserves(b, big(b, a)); });
  onEnter('qe-donnees', a => { const b = zoom('pj-qe'); G.qe(b, big(b, a)); });


  onEnter('long-terme', a => { const b = zoom('pj-lt'); G.nuage(b, big(b, a, { labels: true })); });
  onEnter('court-terme', a => { const b = zoom('pj-ct'); G.courtTerme(b, big(b, a)); });


  onEnter('composantes', a => { const b = zoom('pj-comp'), h = b.clientHeight; G.composantes(b, { heights: [Math.round(0.41 * h), h - Math.round(0.41 * h)], animate: a, big: true }); });
  const SC = M5.SC, ogR = M5.ogdg, FONT = 20;
  const og = (id, s, a, extra) => { const b = zoom(id); return G.ogdgEtat(b, s, { height: b.clientHeight, animate: a, extra: Object.assign({ font: FONT }, extra || {}) }); };

  function res(id, e, ref) {
    put(id + '-y', k('vol', sgn(e.y, 1).replace(',0', '') + NB + '%'));
    put(id + '-pi', k('prix', num(e.pi) + NB + '%'));
    if (!byId(id + '-y-txt')) return;
    const dy = e.y - ref.y, dp = e.pi - ref.pi;
    put(id + '-y-txt', Math.abs(dy) < 0.05 ? 'au potentiel' : `${dy < 0 ? 'baisse' : 'hausse'} de ${num(Math.abs(dy))} point${Math.abs(dy) >= 2 ? 's' : ''}`);
    put(id + '-pi-txt', Math.abs(dp) < 0.05 ? 'inchangée' : `${dp < 0 ? 'baisse' : 'hausse'} de ${num(Math.abs(dp))} point${Math.abs(dp) >= 2 ? 's' : ''}` + (Math.abs(dy) > 0.05 && Math.abs(dp) > 0.05 ? (dy * dp > 0 ? ' : même sens' : ' : sens contraires') : ''));
  }
  onEnter('og-dg', a => og('pj-ogdg', SC.depart, a));
  const CHOCS = [['demande', 'La demande baisse : choc de demande de − 3'], ['offre', 'L\'énergie renchérit : choc d\'offre de + 3'], ['deux', 'Les deux à la fois, comme en 2020']];
  PJ.scenes('chocs-scen', (n, a) => {
    const [key, txt] = CHOCS[Math.min(n, 2)];
    scen('pj-chocs-lbl', Math.min(n, 2), 3, txt);
    res('pj-chocs', og('pj-chocs-g', SC[key], a && n <= 2), ogR(SC.depart));
  }, 3);
  onEnter('chocs-france', a => { const b = zoom('pj-cf'); G.chocsFrance(b, big(b, a)); });
  PJ.scenes('diag-scen', (n, a) => {
    if (n === 0) { scen('pj-diag-lbl', 0, 2, 'Le choc d\'offre : l\'énergie renchérit'); res('pj-diag', og('pj-diag', SC.offre, a), ogR(SC.depart)); return; }
    scen('pj-diag-lbl', 1, 2, 'On relance la demande pour revenir au potentiel');
    const b = zoom('pj-diag');
    res('pj-diag', G.relance(b, { height: b.clientHeight, animate: a && n === 1, extra: { font: FONT } }), ogR(SC.offre));
  }, 2);


  onEnter('phillips', a => { const b = zoom('pj-ph'); G.phillips60(b, big(b, a, { labels: { 1961: [10, -10], 1965: [10, -10], 1969: [12, -6] } })); });
  onEnter('stagflation', a => { const b = zoom('pj-stag'); G.phillips70(b, big(b, a)); });
  onEnter('p4-verif2', a => { const b = zoom('pj-ph70b'); G.phillips70(b, big(b, false)); });
  const PH = M5.PH;
  const SPI = [[PH.ustar, false, `Chômage maintenu à ${PH.ustar} %, son niveau d'équilibre`, 'L\'inflation reste à 2 %.'],
               [PH.ustar - 1, false, `Chômage maintenu à ${PH.ustar - 1} % ; anticipations = inflation passée`, `Chaque année, l'inflation anticipée rattrape l'inflation passée : la spirale. Pour revenir à 2 %, il faudra un chômage au-dessus de ${PH.ustar} %, comme aux États-Unis en 1980-1983.`],
               [PH.ustar - 1, true, `Chômage maintenu à ${PH.ustar - 1} % ; anticipations ancrées à 2 %`, `Les anticipations ne bougent plus : l'inflation reste à ${fmt(M5.spirale(PH.ustar - 1, true)[9], 1)} %, sans spirale. Tout repose sur la crédibilité de la banque centrale.`]];
  PJ.scenes('spirale-scen', (n, a) => {
    const [u, ancre, lbl, txt] = SPI[n], b = zoom('pj-spi');
    const s = G.spirale(b, u, ancre, { height: b.clientHeight, animate: a, big: true, y: [-2, 8], yTicks: [-2, 0, 2, 4, 6, 8] });
    scen('pj-spi-lbl', n, 3, lbl);
    put('pj-spi-1', k('prix', fmt(s[0], 1) + NB + '%'));
    put('pj-spi-10', k('prix', fmt(s[9], 1) + NB + '%'));
    put('pj-spi-txt', txt);
  }, 2);
  const TENT = [['1. La promesse', `La banque centrale annonce 2 % d'inflation. Salaires et prix sont fixés sur cette base.`],
                ['2. La surprise', `Une fois les salaires fixés, ${fmt(M5.TENT.surprise.pi, 1)} % d'inflation réduisent le salaire réel : le chômage tombe à ${M5.TENT.surprise.u} %. La tentation est réelle.`],
                ['3. Les anticipations', `Salariés et entreprises le savent et anticipent ${fmt(M5.TENT.anticipee.pi, 1)} % : le chômage revient à ${M5.TENT.anticipee.u} %, avec plus d'inflation.`]];
  PJ.scenes('tentation', (n, a) => {
    const m = Math.min(n, 2), b = zoom('pj-tent');
    G.tentation(b, m + 1, { height: b.clientHeight, animate: a && n <= 2, big: true });
    scen('pj-tent-lbl', m, 3, TENT[m][0].replace(/^\d\. /, ''));
    put('pj-tent-txt', TENT[m][1]);
  }, 3);
  onEnter('ancrage', a => { const b = zoom('pj-anc'); G.ancrage(b, big(b, a)); });


  onEnter('corridor', a => { const b = zoom('pj-cor'); G.corridor(b, big(b, a)); });
  onEnter('transmission', a => { const b = zoom('pj-tr'), h = b.clientHeight; G.transmission(b, { heights: [Math.round(h / 2), h - Math.round(h / 2)], animate: a, big: true }); });
  onEnter('taux-reel', a => { const b = zoom('pj-tre'); G.tauxReel(b, big(b, a)); });
  const TY = R.taylor, TYK = ['2019', '2022', 'sept2026'];
  const TYN = { 2019: 'Zone euro, 2019 (moyennes annuelles)', 2022: 'Zone euro, 2022 (moyennes annuelles)', sept2026: `Zone euro, ${MOIS[+R.ipch.mois.slice(5, 7) - 1]} ${R.ipch.mois.slice(0, 4)}` };
  const TYT = { 2019: 'Le taux effectif est sous la règle : après des années d\'inflation sous la cible, la BCE soutient l\'activité.', 2022: 'Le taux au jour le jour reste proche de zéro en moyenne, loin sous la règle : la BCE a réagi tard.', sept2026: 'Avec l\'inflation sous-jacente, la règle donne à peu près le taux actuel.' };
  PJ.scenes('taylor-scen', n => {
    const key = TYK[n], p = TY[key], t = M5.taylor(p.sj, p.ecart, TY.rstar);
    scen('pj-ty-lbl', n, 3, TYN[key]);
    put('pj-ty-t', k('taux', fmt(t, 1) + NB + '%'));
    put('pj-ty-f', `0 + ${fmt(p.sj, 1)} + 0,5 × (${fmt(p.sj - 2, 1)}) + 0,5 × (${fmt(p.ecart, 2)})`);
    put('pj-ty-e', k('taux', fmt(key === 'sept2026' ? p.dfr : p.jj, 2) + NB + '%'));
    put('pj-ty-es', key === 'sept2026' ? 'taux de dépôt' : `taux au jour le jour, moyenne ${key}`);
    put('pj-ty-txt', TYT[key] + (key === 'sept2026' ? ` Avec l'inflation totale (${fmt(p.ipch, 1)} %), elle demande ${fmt(M5.taylor(p.ipch, p.ecart, TY.rstar), 1)} %.` : ''));
  }, 2);
  onEnter('taylor-graph', a => { const b = zoom('pj-ty'); G.taylor(b, 'sj', big(b, a)); });
  const RC = [['offre', 'Attendre : le choc d\'offre seul', 'La production baisse, l\'inflation monte, puis le choc passe.'],
              ['resserrer', 'Resserrer un peu : choc de demande de − 3', 'Moins d\'inflation, au prix d\'une production plus basse.'],
              ['ramener', 'Ramener l\'inflation à 2 % tout de suite', 'La production tombe très bas : c\'est cher.'],
              ['derive', 'Attendre, et les anticipations montent', 'L\'offre monte encore : plus d\'inflation et moins de production.']];
  PJ.scenes('reponse-scen', (n, a) => {
    const [key, lbl, txt] = RC[n], b = zoom('pj-rcg');
    const e = G.reponseChoc(b, key, { height: b.clientHeight, animate: a, extra: { font: FONT } });
    scen('pj-rc-lbl', n, 4, lbl);
    put('pj-rc-y', k('vol', sgn(e.y, 1).replace(',0', '') + NB + '%'));
    put('pj-rc-pi', k('prix', num(e.pi) + NB + '%'));
    put('pj-rc-txt', txt);
  }, 3);


  Deck.on('corrige-1', { enter() {
    const E = window.EXERCICE_CH05, box = byId('pj-corr-bl');
    if (box) box.innerHTML = Bilans.fixe([
      { nom: 'Banque Alpha', actif: [['Crédit à Solaris', E.credit], ['Réserves', -E.credit]], passif: [['Dépôt de Solaris', E.credit], ['Dépôt de Solaris', -E.credit]] },
      { nom: 'Banque Bêta', actif: [['Réserves', E.credit]], passif: [['Dépôt du fournisseur', E.credit]] }], 'M');
  } });
  Deck.on('lectures', { enter() { const bd = byId('btn-donnees'); if (bd) bd.onclick = () => Deck.openPanel('Sources', 'Données du chapitre et millésimes', window.SOURCES_HTML || ''); } });
})();
(function () {
  'use strict';
  const D = window.DATA, CH = window.Charts, PJ = window.PJ, fmt = CH.fmt;
  const MARINE = '#001F5F', ORANGE = '#B45309', ENCRE = '#000000', GRIS = '#5F707D';
  const anim = ctx => !(ctx && (ctx.reading || ctx.print));
  const Z = 1.25, zoom = id => PJ.zoom(id, Z);
  const big = (box, animate, extra) => Object.assign({ height: box.clientHeight, animate, big: true }, extra || {});
  const onEnter = (id, draw) => Deck.on(id, { enter(el, ctx) { draw(anim(ctx)); } });
  const halo = (svg, sel) => svg && svg.querySelectorAll(sel || 'text').forEach(t => { t.style.paintOrder = 'stroke'; t.style.stroke = '#FFFFFF'; t.style.strokeWidth = '5px'; t.style.strokeLinejoin = 'round'; });


  function grandeModeration(box, o) {
    const CF = D.chocs;
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2.2, stagger: 0.2, hover: !o.big,
      x: { min: 1960, max: 2025.5, ticks: [1960, 1970, 1980, 1990, 2000, 2010, 2020] },
      y: { min: -8, max: 14, ticks: [-8, -4, 0, 4, 8, 12] },
      yTitle: 'France, %',
      bands: [{ x0: 1984.5, x1: 2007.5, color: '#E3E8F0' }],
      series: [{ name: 'Croissance du PIB en volume', color: MARINE, data: CF.annees.map((a, j) => [a, CF.g[j]]), endLabel: 'croissance', width: 3.2, format: v => fmt(v, 1) },
               { name: 'Inflation', color: ORANGE, data: CF.annees.map((a, j) => [a, CF.inflation[j]]), endLabel: 'inflation', width: 3.2, format: v => fmt(v, 1) }]
    });
    if (res && res.S) CH.txt(res.svg, (res.S.X(1984.5) + res.S.X(2007.5)) / 2, res.m.t - 8, 'grande modération', 'ch-lab', { 'text-anchor': 'middle', fill: GRIS, style: `font-size:${o.big ? 19 : 15}px;font-weight:600` });
    return res;
  }
  onEnter('grande-moderation', a => { const b = zoom('pj-gm'); if (b) grandeModeration(b, big(b, a)); });


  const R = window.REPERES;
  function agregatsCercles(n) {
    const box = document.getElementById('pj-agr-cercles');
    if (!box) return;
    const CO = R.monnaie.composition, MO = R.monnaie, f0 = v => fmt(v, 0) + ' Md€';
    const SVGNS = 'http://www.w3.org/2000/svg';
    const el = (tag, at, parent) => { const e = document.createElementNS(SVGNS, tag); Object.entries(at).forEach(([a, v]) => e.setAttribute(a, v)); parent.appendChild(e); return e; };
    const txt = (parent, x, y, s, at) => { const e = el('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': 24 }, at || {}), parent); e.textContent = s; return e; };
    box.innerHTML = '';
    const svg = el('svg', { viewBox: '0 0 1000 560', width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid meet' }, box);
    const cy = 285;

    const cercles = [
      { cle: 'M3', etape: 3, cx: 400, rx: 400, ry: 260, couleur: '#B8891F', fond: '#FBF5E8', lignes: ['M3', f0(CO.m3), '+ titres', 'monétaires ' + fmt(CO.titres, 0)], lx: 112,
        def: 'M3 : M2 et titres monétaires (parts de fonds monétaires, titres de moins de deux ans).' },
      { cle: 'M2', etape: 2, cx: 510, rx: 290, ry: 205, couleur: '#5E9E7E', fond: '#EEF6F1', lignes: ['M2', f0(CO.m2), '+ autres dépôts', 'à court terme ' + fmt(CO.autres_depots, 0)], lx: 312,
        def: 'M2 : M1 et dépôts à court terme (livrets, dépôts à terme de moins de deux ans).' },
      { cle: 'M1', etape: 1, cx: 600, rx: 200, ry: 150, couleur: '#2E7D5B', fond: '#E3F0E9', lignes: ['M1', f0(CO.m1), 'dépôts à vue', fmt(CO.depots_vue, 0)], lx: 535,
        def: 'M1 : billets et pièces, et dépôts à vue.' }
    ];
    cercles.forEach(c => {
      const g = el('g', { class: 'pj-agr-g', opacity: n >= c.etape ? 1 : 0 }, svg);
      el('ellipse', { cx: c.cx, cy, rx: c.rx, ry: c.ry, fill: c.fond, stroke: c.couleur, 'stroke-width': 3 }, g);
      el('title', {}, g).textContent = c.def;
      txt(g, c.lx, cy - 40, c.lignes[0], { fill: c.couleur, 'font-weight': 700, 'font-size': 32 });
      txt(g, c.lx, cy - 8, c.lignes[1], { fill: c.couleur, 'font-weight': 700, 'font-size': 23 });
      txt(g, c.lx, cy + 24, c.lignes[2], { fill: '#3E4954', 'font-size': 19 });
      txt(g, c.lx, cy + 47, c.lignes[3], { fill: '#3E4954', 'font-size': 19 });
    });

    const gb = el('g', { class: 'pj-agr-g' }, svg);
    el('ellipse', { cx: 747, cy, rx: 52, ry: 56, fill: '#E9ECEF', stroke: '#4F5F6B', 'stroke-width': 3 }, gb);
    el('title', {}, gb).textContent = 'Billets et pièces détenus par le public.';
    txt(gb, 747, cy - 8, 'billets', { fill: '#4F5F6B', 'font-weight': 700, 'font-size': 20 });
    txt(gb, 747, cy + 18, fmt(CO.billets, 0), { fill: '#4F5F6B', 'font-size': 18 });

    const g0 = el('g', { class: 'pj-agr-g', opacity: n >= 4 ? 1 : 0 }, svg);
    el('ellipse', { cx: 840, cy, rx: 150, ry: 96, fill: 'none', stroke: '#3B8FC4', 'stroke-width': 3.5, 'stroke-dasharray': '10 6' }, g0);
    el('title', {}, g0).textContent = 'M0, ou base monétaire : billets en circulation et réserves des banques à la banque centrale.';
    txt(g0, 905, cy - 116, `M0 : ${f0(MO.base_mds)}`, { fill: '#2A6F99', 'font-weight': 700, 'font-size': 24 });
    txt(g0, 905, cy - 4, 'réserves', { fill: '#2A6F99', 'font-weight': 700, 'font-size': 20 });
    txt(g0, 905, cy + 22, fmt(MO.reserves_mds, 0), { fill: '#2A6F99', 'font-size': 18 });
    const noms = ['Billets et pièces', 'M1 : + dépôts à vue', 'M2 : + autres dépôts à court terme', 'M3 : + titres monétaires', 'M0 : billets et réserves des banques'];
    const lbl = document.getElementById('pj-agr-lbl');
    if (lbl) lbl.innerHTML = `<span class="n">${Math.min(n, 4) + 1} / 5</span> ${noms[Math.min(n, 4)]}`;
  }
  PJ.scenes('agregats', n => agregatsCercles(n), 4);



  const xm = m => +m.slice(0, 4) + (+m.slice(5, 7) - 0.5) / 12;
  function multiCourbe(box, o, serie, opts) {
    const res = CH.line(box, {
      height: o.height, animate: o.animate, duration: 2, legend: false, hover: !o.big,
      x: { min: opts.x0, max: 2026.9, ticks: opts.ticks },
      y: { min: 0, max: 12, ticks: [0, 2, 4, 6, 8, 10, 12] },
      yTitle: opts.yTitle,
      series: [{ name: opts.nom, color: opts.couleur, data: serie, width: 3, format: v => fmt(v, 1) }],
      markers: opts.reperes.map(([m, val, label, dy, anchor]) => ({ x: xm(m), y: val, color: opts.couleur, label, dy, anchor: anchor || 'start', dx: anchor === 'end' ? -12 : 12 }))
    });
    if (res && res.S) {
      const y10 = res.S.Y(10);
      CH.el('line', { x1: res.S.X(opts.x0), x2: res.S.X(2026.9), y1: y10, y2: y10, stroke: GRIS, 'stroke-width': 1.8, 'stroke-dasharray': '7 6' }, res.svg);
      CH.txt(res.svg, res.S.X(2026.9) - 4, y10 - 10, 'scénario de référence : 10', 'ch-lab', { 'text-anchor': 'end', fill: GRIS, style: `font-size:${o.big ? 18 : 14}px` });
      halo(res.svg, 'text.ch-val, text.ch-lab');
    }
    return res;
  }
  Deck.on('multi-courbe', { enter(el, ctx) {
    const a = anim(ctx), MB = D.monnaie_base, US = window.MULTI_US;
    const ea = MB.mois.map((m, j) => [xm(m), MB.m3[j] / MB.base[j]]), rEa = m => MB.m3[MB.mois.indexOf(m)] / MB.base[MB.mois.indexOf(m)];
    const b1 = zoom('pj-mc-ea');
    if (b1) multiCourbe(b1, big(b1, a), ea, { x0: 2007, ticks: [2007, 2012, 2017, 2022, 2026], yTitle: 'Rapport', nom: 'M3 / monnaie de banque centrale', couleur: '#4F5F6B',
      reperes: [['2007-06', rEa('2007-06'), fmt(rEa('2007-06'), 1) + ' en juin 2007', -14], ['2022-04', rEa('2022-04'), fmt(rEa('2022-04'), 1) + ' en avril 2022', 30, 'end'], [MB.mois[MB.mois.length - 1], rEa(MB.mois[MB.mois.length - 1]), fmt(rEa(MB.mois[MB.mois.length - 1]), 1), -14, 'end']] });
    const b2 = zoom('pj-mc-us');
    if (b2 && US) {
      const us = US.mois.map((m, j) => [xm(m), US.ratio[j]]), rUs = m => US.ratio[US.mois.indexOf(m)];
      multiCourbe(b2, big(b2, a), us, { x0: 1960, ticks: [1960, 1980, 2000, 2020], yTitle: 'Rapport', nom: 'M2 / base monétaire', couleur: '#2E7D5B',
        reperes: [['2008-08', rUs('2008-08'), fmt(rUs('2008-08'), 1) + ' en août 2008', 40, 'start'], [US.min_mois, US.min, fmt(US.min, 1) + ' en ' + G5MOIS(US.min_mois), 30, 'end'], [US.dernier_mois, US.dernier, fmt(US.dernier, 1), -14, 'end']] });
    }
  } });
  const G5MOIS = m => window.G5.MOIS[+m.slice(5, 7) - 1] + ' ' + m.slice(0, 4);
})();