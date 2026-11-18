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
window.CROIX = (function () {
  const R = window.REPERES;
  const Y0 = 1000;
  const pente = e => e.c * (1 - e.t) - e.m;
  const k = e => 1 / (1 - pente(e));


  const kCible = e => 1 / ((1 - e.c) * (1 - e.t) + e.m);
  const A = e => (1 - pente(e)) * Y0;
  const eco = (nom, c, t, m, extra) => Object.assign({ nom, c, t, m }, extra || {});

  const E1 = eco('économie fermée, sans impôts', 0.6, 0, 0, { C0: 100, I: 150, G: 150 });
  const E2 = eco('avec impôts', 0.6, 0.5, 0);
  const E3 = eco('avec impôts et importations', 0.6, 0.5, 0.3);


  const FR = eco('France, ordres de grandeur', 0.6, R.fr_2025.po_pct / 100, R.fr_importations_part_2025 / 100);
  const choc = 40;

  const tours = (d, b, n) => Array.from({ length: n }, (_, i) => d * Math.pow(b, i));


  function cible(e, d, n) {
    const out = [{ A: A(e), Y: Y0, coupe: 0 }];
    let a = A(e) - d, coupes = 0;
    for (let i = 0; i < n; i++) {
      const y = a * k(e);
      out.push({ A: a, Y: y, coupe: coupes });
      const besoin = e.t * (Y0 - y) - coupes;
      coupes += besoin; a -= besoin;
    }
    return out;
  }
  return { Y0, E1, E2, E3, FR, pente, k, kCible, A, choc, tours, cible,
           DG: (a, e, y) => a + pente(e) * y, Yeq: (a, e) => a * k(e) };
})();
window.Croix = (function () {
  'use strict';
  const CH = window.Charts, fmt = CH.fmt;
  const NB = '\u202F';
  const C = { olive: '#526780', blue: '#001F5F', ink: '#000000', slate: '#8A9BA8', teal: '#001F5F', red: '#B45309', petrole: '#526780', grey: '#B9C2CA' };
  const seg = (g, x1, y1, x2, y2, a) => CH.el('line', Object.assign({ x1, y1, x2, y2 }, a), g);
  const sgn = (v, d = 0) => (Math.abs(v) < 0.5 * Math.pow(10, -d) ? '0' : (v > 0 ? '+' : '−') + NB + fmt(Math.abs(v), d));

  const num = v => fmt(v, Math.abs(v - Math.round(v)) < 0.05 ? 0 : 1);
  function halo(svg, sel = 'text') {
    svg.querySelectorAll(sel).forEach(t => { t.style.paintOrder = 'stroke'; t.style.stroke = '#FFFFFF'; t.style.strokeWidth = '5px'; t.style.strokeLinejoin = 'round'; });
  }

  function drawIn(p, dur, delay) {
    const L = p.getTotalLength ? p.getTotalLength() : 0;
    if (!L) return;
    p.style.setProperty('--len', L.toFixed(1)); p.style.setProperty('--dur', dur + 's'); p.style.animationDelay = delay + 's';
    p.classList.add('ch-anim');
  }
  const fade = (g, on, delay) => { if (on) { g.setAttribute('class', 'ch-fade'); g.setAttribute('style', `animation-delay:${delay || 0}s`); } return g; };



  function spread(items, H, top) {
    if (items.length < 2) return;
    items.sort((p, q) => p.y - q.y);
    const offs = its => { let o = 0; return its.map(it => { const r = o; o += it.h || H; return r; }); };
    const place = c => {
      const o = offs(c.its);
      c.top = Math.max(top, c.its.reduce((s, it, i) => s + it.y - o[i], 0) / c.its.length);
      c.size = o[o.length - 1] + (c.its[c.its.length - 1].h || H);
    };
    const cl = items.map(it => { const c = { its: [it] }; place(c); return c; });
    for (let i = 1; i < cl.length;) {
      const a = cl[i - 1], b = cl[i];
      if (a.top + a.size > b.top + 0.5) { a.its = a.its.concat(b.its); place(a); cl.splice(i, 1); i = Math.max(1, i - 1); } else i++;
    }
    cl.forEach(c => { const o = offs(c.its); c.its.forEach((it, i) => {
      const y = c.top + o[i]; it.t.setAttribute('y', y.toFixed(1)); if (it.sub) it.sub.setAttribute('y', (y + H).toFixed(1));
    }); });
  }

  function draw(box, o) {
    const fr = CH.frame(box, { height: o.height, width: o.width }), svg = fr.svg, Wd = fr.Wd, Ht = fr.Ht;
    const lo = o.lo ?? 0, hi = o.hi ?? 1200, span = hi - lo;
    const m = Object.assign({ l: 88, t: 62, b: 72, r: 118 }, o.margin || {});
    const L = Math.min(Wd - m.l - m.r, Ht - m.t - m.b);
    const X = v => m.l + (v - lo) / span * L, Y = v => m.t + L - (v - lo) / span * L;
    const x0 = m.l, y0 = m.t + L, fs = o.font || 19;
    const ticks = o.ticks || CH.niceTicks(lo, hi, 6).filter(v => v >= lo && v <= hi);
    const eqs = (o.eq || []).filter(e => e && e.y != null);
    const px = span / L;
    const near = (v, list) => list.some(w => Math.abs(v - w) < 58 * px);

    eqs.forEach(e => { if (e.faded && eqs.some(f => !f.faded && Math.abs(f.y - e.y) < 62 * px)) { if (e.xLabel !== true) e.xLabel = false; if (e.yLabel !== true) e.yLabel = false; } });
    const eqX = eqs.filter(e => e.xLabel !== false).map(e => e.y), eqY = eqs.filter(e => e.yLabel !== false).map(e => e.y);
    const extraX = (o.xMarks || []).map(e => e.v).concat(o.gap ? [o.gap.y] : []);
    const extraY = o.gap ? [o.gap.y, o.gap.a + o.gap.b * o.gap.y] : [];


    seg(svg, x0, y0, x0, m.t - 26, { class: 'ch-axis', 'marker-end': fr.arrow });
    seg(svg, x0, y0, x0 + L + 26, y0, { class: 'ch-axis', 'marker-end': fr.arrow });
    if (lo > 0) {

      const brk = (x, y, vert) => { const g = CH.el('g', {}, svg); CH.el('rect', vert ? { x: x - 6, y: y - 5, width: 12, height: 10, fill: '#FFFFFF' } : { x: x - 5, y: y - 6, width: 10, height: 12, fill: '#FFFFFF' }, g);
        [-4, 4].forEach(d => seg(g, vert ? x - 8 : x + d - 4, vert ? y + d + 4 : y + 8, vert ? x + 8 : x + d + 4, vert ? y + d - 4 : y - 8, { stroke: '#111', 'stroke-width': 2 })); };
      brk(x0 + 16, y0, false); brk(x0, y0 - 16, true);
    }
    ticks.forEach(v => {
      seg(svg, X(v), y0, X(v), y0 + 7, { class: 'ch-tickmark' });
      seg(svg, x0 - 7, Y(v), x0, Y(v), { class: 'ch-tickmark' });
      if (!near(v, eqX.concat(extraX))) CH.txt(svg, X(v), y0 + 31, fmt(v, 0), 'ch-tick ch-num', { 'text-anchor': 'middle', style: `font-size:${fs}px` });
      if (!near(v, eqY.concat(extraY))) CH.txt(svg, x0 - 13, Y(v) + 6.5, fmt(v, 0), 'ch-tick ch-num', { 'text-anchor': 'end', style: `font-size:${fs}px` });
    });
    CH.txt(svg, x0 - 12, m.t - 38, o.yTitle || 'Demande globale planifiée DG(Y), milliards', 'ch-ytitle', { 'text-anchor': 'start', style: `font-size:${fs}px` });
    CH.txt(svg, x0 + L + 26, y0 + 62, o.xTitle || 'Production Y, milliards', 'ch-xtitle', { 'text-anchor': 'end', style: `font-size:${fs}px` });

    const plot = CH.el('g', {}, svg);

    const ends = [];

    if (o.potentiel) {
      const p = o.potentiel, g = fade(CH.el('g', {}, plot), p.anim, p.delay);
      seg(g, X(p.y), y0, X(p.y), m.t - 4, { stroke: C.petrole, 'stroke-width': 2.2, 'stroke-dasharray': '8 6' });
      CH.txt(g, X(p.y), m.t - 12, p.label || 'potentiel', 'ch-lab', { 'text-anchor': 'middle', fill: CH.darken(C.petrole), style: `font-size:${fs}px` });
    }

    if (o.diag !== false) {
      const d = o.diag || {}, g = fade(CH.el('g', {}, plot), d.anim, d.delay);
      const p = CH.el('path', { d: `M${X(lo)},${Y(lo)} L${X(hi)},${Y(hi)}`, fill: 'none', stroke: C.ink, 'stroke-width': 2.4 }, g);
      if (d.anim) drawIn(p, 1, d.delay || 0);
      const t = CH.txt(g, X(hi) + 10, Y(hi) + 7, d.label || 'Y = DG(Y)', 'ch-lab', { fill: C.ink, style: `font-size:${fs}px` });
      const sub = d.sub ? CH.txt(g, X(hi) + 10, Y(hi) + 7 + fs + 4, d.sub, 'ch-lab', { fill: '#3E4954', style: `font-size:${fs - 2}px;font-weight:500` }) : null;
      ends.push({ t, sub, x: X(hi) + 10, y: Y(hi) + 7, h: sub ? 2 * (fs + 4) : fs + 4 });
    }

    const clip = (a, b) => {
      let xa = lo, xb = hi;
      if (Math.abs(b) < 1e-9) { if (a < lo - 1e-9 || a > hi + 1e-9) return null; }
      else { const u = (lo - a) / b, w = (hi - a) / b; xa = Math.max(lo, Math.min(u, w)); xb = Math.min(hi, Math.max(u, w)); }
      return xa < xb ? [xa, xb] : null;
    };
    (o.lines || []).forEach(l => {
      const c = clip(l.a, l.b); if (!c) return;
      const g = fade(CH.el('g', {}, plot), l.anim && l.dash, l.delay);
      const p = CH.el('path', { d: `M${X(c[0])},${Y(l.a + l.b * c[0])} L${X(c[1])},${Y(l.a + l.b * c[1])}`, fill: 'none', stroke: l.color || C.olive,
        'stroke-width': l.width || (l.faded ? 2.4 : 4), 'stroke-dasharray': l.dash || (l.faded ? '7 6' : null), 'stroke-linecap': 'round', opacity: l.faded ? 0.75 : 1 }, g);
      if (l.anim && !l.dash && !l.faded) drawIn(p, l.dur || 1, l.delay || 0);
      if (l.label) {
        const gl = fade(CH.el('g', {}, plot), l.anim, (l.delay || 0) + (l.anim ? 0.6 : 0));
        const st = l.labelAt === 'start', xe = st ? c[0] + (l.labelDx || span * 0.03) : c[1], ye = l.a + l.b * xe;
        const t = CH.txt(gl, X(xe) + (st ? 0 : 10), Y(ye) + (st ? -12 : 7) + (l.labelDy || 0), l.label, 'ch-lab', { fill: l.faded ? '#6B7782' : CH.darken(l.color || C.olive), style: `font-size:${fs}px;font-weight:700` });
        if (!st) ends.push({ t, x: X(xe) + 10, y: Y(ye) + 7 + (l.labelDy || 0) });
      }
    });

    (o.intercepts || []).forEach(q => {
      const g = fade(CH.el('g', {}, plot), q.anim, q.delay), col = q.color || C.olive;
      CH.el('circle', { cx: x0, cy: Y(q.a), r: 7.5, fill: q.faded ? '#fff' : col, stroke: q.faded ? '#8A9BA8' : '#fff', 'stroke-width': q.faded ? 2.5 : 2 }, g);
      if (q.label !== false) CH.txt(g, x0 + 14, Y(q.a) + (q.dy ?? -12), q.label || `A = ${fmt(q.a, 0)}`, 'ch-val', { fill: q.faded ? '#6B7782' : CH.darken(col), style: `font-size:${fs}px` });
    });

    (o.slopes || []).forEach(q => {
      const g = fade(CH.el('g', {}, plot), q.anim, q.delay), col = q.color || C.teal;
      const xa = q.x, xb = q.x + q.dx, ya = q.a + q.b * xa, yb = q.a + q.b * xb;
      seg(g, X(xa), Y(ya), X(xb), Y(ya), { stroke: col, 'stroke-width': 2.6 });
      seg(g, X(xb), Y(ya), X(xb), Y(yb), { stroke: col, 'stroke-width': 2.6 });
      CH.txt(g, (X(xa) + X(xb)) / 2, Y(ya) + 27, `+${NB}${fmt(q.dx, 0)}`, 'ch-val', { 'text-anchor': 'middle', fill: CH.darken(C.blue), style: `font-size:${fs}px` });
      CH.txt(g, X(xb) + 10, (Y(ya) + Y(yb)) / 2 + 7, `+${NB}${num(q.b * q.dx)}`, 'ch-val', { fill: CH.darken(col), style: `font-size:${fs}px` });
    });


    if (o.gap) {
      const q = o.gap, dg = q.a + q.b * q.y, g = fade(CH.el('g', {}, plot), q.anim, q.delay), up = dg > q.y;
      seg(g, X(q.y), y0, X(q.y), Y(q.y), { stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '3 5' });
      seg(g, x0, Y(q.y), X(q.y), Y(q.y), { stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '3 5' });
      seg(g, x0, Y(dg), X(q.y), Y(dg), { stroke: C.olive, 'stroke-width': 1.5, 'stroke-dasharray': '3 5' });
      seg(g, X(q.y), Y(q.y), X(q.y), Y(dg), { stroke: C.red, 'stroke-width': 6, 'stroke-linecap': 'butt' });
      CH.el('circle', { cx: X(q.y), cy: Y(q.y), r: 7, fill: '#fff', stroke: C.blue, 'stroke-width': 3 }, g);
      CH.el('circle', { cx: X(q.y), cy: Y(dg), r: 7, fill: '#fff', stroke: C.olive, 'stroke-width': 3 }, g);
      CH.txt(g, X(q.y), y0 + 31, fmt(q.y, 0), 'ch-val ch-num', { 'text-anchor': 'middle', fill: CH.darken(C.blue), style: `font-size:${fs}px` });
      CH.txt(g, x0 - 13, Y(q.y) + 6.5, fmt(q.y, 0), 'ch-val ch-num', { 'text-anchor': 'end', fill: CH.darken(C.blue), style: `font-size:${fs}px` });
      CH.txt(g, x0 - 13, Y(dg) + 6.5, fmt(dg, 0), 'ch-val ch-num', { 'text-anchor': 'end', fill: CH.darken(C.olive), style: `font-size:${fs}px` });
      CH.txt(g, X(q.y) - 14, (Y(q.y) + Y(dg)) / 2 + 7, `stocks ${sgn(q.y - dg, 0)}`, 'ch-val', { 'text-anchor': 'end', fill: CH.darken(C.red), style: `font-size:${fs}px` });

      const xa = X(q.y) + (up ? 10 : -10), xb = X(q.y + (up ? 1 : -1) * span * 0.11);
      seg(g, xa, y0 - 16, xb, y0 - 16, { stroke: C.blue, 'stroke-width': 3.4, 'marker-end': fr.arrow });
    }

    (o.shifts || []).forEach(s => {
      const g = fade(CH.el('g', {}, plot), s.anim, s.delay);
      seg(g, X(s.x), Y(s.from), X(s.x), Y(s.to) + (s.to < s.from ? -3 : 3), { stroke: s.color || C.olive, 'stroke-width': 3.4, 'marker-end': fr.arrow });
      const t = CH.txt(g, X(s.x) + (s.side || 1) * 12, (Y(s.from) + Y(s.to)) / 2 + 7, s.label, 'ch-val', { 'text-anchor': (s.side || 1) > 0 ? 'start' : 'end', fill: CH.darken(s.color || C.olive), style: `font-size:${fs}px` });
      if ((s.side || 1) > 0) ends.push({ t, x: X(s.x) + 12, y: (Y(s.from) + Y(s.to)) / 2 + 7 });
    });
    spread(ends.filter(e => e.x > X(hi) - 60), fs + 4, fs + 2);

    if (o.stairs) {
      const st = o.stairs, b = st.b, a = st.a, n = st.n || 6, dt = st.step || 0.45;
      let x = st.y0, yv = st.y0, i = 0;
      for (let j = 0; j < n; j++) {
        const yd = a + b * x;
        if (Math.abs(yd - yv) < span * 0.004) break;
        const g1 = fade(CH.el('g', {}, plot), st.anim, (st.delay || 0) + dt * i++);
        seg(g1, X(x), Y(yv), X(x), Y(yd), { stroke: st.colorV || C.olive, 'stroke-width': 3.2, 'stroke-linecap': 'round' });
        const g2 = fade(CH.el('g', {}, plot), st.anim, (st.delay || 0) + dt * i++);
        seg(g2, X(x), Y(yd), X(yd), Y(yd), { stroke: st.colorH || C.blue, 'stroke-width': 3.2, 'stroke-linecap': 'round' });
        yv = yd; x = yd;
      }
    }

    (o.dY || []).forEach(d => {
      const g = fade(CH.el('g', {}, plot), d.anim, d.delay), yy = y0 - (d.h || 22);
      seg(g, X(d.from), yy, X(d.to) + (d.to < d.from ? 3 : -3), yy, { stroke: d.color || C.blue, 'stroke-width': 3.4, 'marker-end': fr.arrow });
      CH.txt(g, (X(d.from) + X(d.to)) / 2, yy - 12, d.label, 'ch-val', { 'text-anchor': 'middle', fill: CH.darken(d.color || C.blue), style: `font-size:${fs}px` });
    });

    eqs.forEach(e => {
      const g = CH.el('g', {}, plot), col = e.color || C.blue;
      const gg = fade(CH.el('g', {}, g), e.anim, e.delay);
      if (e.guides !== false) {
        seg(gg, X(e.y), Y(e.y), X(e.y), y0, { stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': '3 5', opacity: e.faded ? 0.6 : 1 });
        seg(gg, X(e.y), Y(e.y), x0, Y(e.y), { stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': '3 5', opacity: e.faded ? 0.6 : 1 });
      }
      CH.el('circle', { cx: X(e.y), cy: Y(e.y), r: e.faded ? 7 : 9, fill: e.faded ? '#fff' : col, stroke: e.faded ? col : '#fff', 'stroke-width': e.faded ? 3 : 2.5 }, gg);
      const lab = e.value || num(e.y);
      if (e.xLabel !== false) CH.txt(gg, X(e.y), y0 + 31, lab, 'ch-val ch-num', { 'text-anchor': 'middle', fill: e.faded ? '#6B7782' : CH.darken(col), style: `font-size:${fs}px` });
      if (e.yLabel !== false) CH.txt(gg, x0 - 13, Y(e.y) + 6.5, lab, 'ch-val ch-num', { 'text-anchor': 'end', fill: e.faded ? '#6B7782' : CH.darken(col), style: `font-size:${fs}px` });
      if (e.label) CH.txt(gg, X(e.y) + (e.dx ?? -14), Y(e.y) + (e.dy ?? -16), e.label, 'ch-lab', { 'text-anchor': e.anchor || 'end', fill: e.faded ? '#6B7782' : CH.darken(col), style: `font-size:${fs}px;font-weight:700` });
    });
    (o.xMarks || []).forEach(e => CH.txt(svg, X(e.v), y0 + 31, e.label || fmt(e.v, 0), 'ch-val ch-num', { 'text-anchor': 'middle', fill: CH.darken(e.color || C.blue), style: `font-size:${fs}px` }));
    halo(svg, 'text.ch-lab,text.ch-val');
    return { svg, X, Y, m, L, x0, y0, arrow: fr.arrow, plot };
  }
  return { draw, C, sgn, num };
})();
(function(){
'use strict';
const D = window.DATA, R = window.REPERES, CH = window.Charts, PJ = window.PJ;
const A = D.articles;
const { fmt } = CH;
const NB = '\u202F';
const PET = '#526780', OLIVE = '#526780', CONSO = '#001F5F', RED = '#B45309', BLUE = '#001F5F', SLATE = '#8A9BA8', NOM = '#4F5F6B', INK = '#000000', ES = '#D08F2E';
const byId = id => document.getElementById(id);
const k = (kind, html) => `<span class="k-${kind}">${html}</span>`;
const anim = ctx => !(ctx && (ctx.reading || ctx.print));
const put = (id, html) => { const e = typeof id === 'string' ? byId(id) : id; if (e) { e.innerHTML = html; PJ.signs(e, true); } };
const sgn = (v, d = 0) => Math.abs(v) < 0.5 * Math.pow(10, -d) ? '0' : (v > 0 ? '+' : '−') + NB + fmt(Math.abs(v), d);
const sgnPct = (v, d = 0) => sgn(v, d) + NB + '%';
const seg = (svg, x1, y1, x2, y2, attrs) => CH.el('line', Object.assign({ x1, y1, x2, y2 }, attrs), svg);
const bigLabels = svg => svg.querySelectorAll('text.ch-lab').forEach(t => { t.style.fontSize = '19px'; });
const halo = (svg, sel = 'text') => svg.querySelectorAll(sel).forEach(t => { t.style.paintOrder = 'stroke'; t.style.stroke = '#FFFFFF'; t.style.strokeWidth = '5px'; t.style.strokeLinejoin = 'round'; });
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const moisX = x => { const y = Math.floor(x + 1e-9), m = Math.min(11, Math.max(0, Math.round((x - y) * 12 - 0.5))); return MOIS[m] + ' ' + y; };
function legendIn(box, items, o = {}) {
    const d = document.createElement('div'); d.className = 'ch-legend';
    d.style.cssText = `flex-wrap:wrap;gap:6px ${o.gap ?? 24}px;font-size:19px`;
    d.innerHTML = items.map(([name, color, ring]) => `<span style="white-space:nowrap"><i style="background:${ring ? '#fff' : color};width:17px;height:17px;border-radius:${ring ? '50%' : '3px'};${ring ? `box-shadow:inset 0 0 0 3px ${color}` : ''}"></i><span style="color:#000000">${name}</span></span>`).join('');
    box.appendChild(d);
    return d;
  }
function axesMain(svg, arrow, m, Wd, Ht, Y, ticks, fmtY, yTitle, y0) {
    seg(svg, m.l, Ht - m.b, m.l, m.t - 22, { class: 'ch-axis', 'marker-end': arrow });
    seg(svg, m.l, y0, Wd - m.r + 18, y0, { class: 'ch-axis', 'marker-end': arrow });
    ticks.forEach(v => { const yy = Y(v); seg(svg, m.l - 7, yy, m.l, yy, { class: 'ch-tickmark' }); CH.txt(svg, m.l - 13, yy + 6.5, fmtY(v), 'ch-tick ch-num', { 'text-anchor': 'end' }); });
    if (yTitle) CH.txt(svg, m.l - 10, m.t - 34, yTitle, 'ch-ytitle', { 'text-anchor': 'start' });
  }
function bridge(box, o) {
    const fr = CH.frame(box, { height: box.clientHeight }), svg = fr.svg, Wd = fr.Wd, Ht = fr.Ht;
    const m = Object.assign({ l: 64, r: 22, t: 58, b: 74 }, o.margin || {});
    const Y = v => m.t + (o.max - v) / o.max * (Ht - m.t - m.b);
    axesMain(svg, fr.arrow, m, Wd, Ht, Y, o.ticks, o.fmtY || (v => fmt(v, 0)), o.yTitle, Y(0));
    const nS = o.steps.length, bw = (Wd - m.l - m.r) / nS, w = Math.min(o.barMax || 110, bw * 0.6), d = o.digits || 0;
    let level = 0;
    o.steps.forEach((st, i) => {
      const x0 = m.l + bw * i + (bw - w) / 2, from = st.total ? 0 : level, to = st.total ? st.value : level + st.value;
      st.label.split('|').forEach((ln, j) => CH.txt(svg, x0 + w / 2, Ht - m.b + 28 + j * 22, ln, 'ch-tick', { 'text-anchor': 'middle' }));
      if (i < o.upto) {
        const ya = Y(Math.max(from, to)), yb = Y(Math.min(from, to)), isNew = o.animate && i >= (o.from || 0);
        CH.el('rect', { x: x0, y: ya, width: w, height: Math.max(2, yb - ya), fill: st.color, class: isNew ? 'ch-bar anim-y' + (to < from ? ' neg' : '') : '' }, svg);
        const lab = o.fmtV ? o.fmtV(st.value, st.total) : st.total ? fmt(st.value, d) : sgn(st.value, d);
        CH.txt(svg, x0 + w / 2, (to < from && !st.total ? yb + 26 : ya - 10), lab, 'ch-val' + (isNew ? ' ch-fade' : ''), { 'text-anchor': 'middle', fill: CH.darken(st.color), style: isNew ? 'animation-delay:.3s' : '' });
        if (i < o.upto - 1) seg(svg, x0 + w, Y(to), x0 + bw, Y(to), { stroke: SLATE, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' });
      }
      level = to;
    });
    halo(svg, 'text.ch-val');
    return { svg, Y, m };
  }
const G = D.grece, GY = G.annees;
const FA = D.france_apu, PLF = D.plf2027;
Deck.on('france-2027', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-fr27', 1.2);
      const obs = FA.annees.map((y, i) => [y, FA.solde[i]]);
      const prev = [[2025, FA.solde[FA.solde.length - 1]], [2026, PLF.solde_effectif['2026']], [2027, PLF.solde_effectif['2027']]];
      const i20 = FA.annees.indexOf(2020);
      const res = CH.line(box, { height: box.clientHeight, animate: anim(ctx), duration: 2, legend: false, hover: false,
        x: { min: 1995, max: 2027, ticks: [1995, 2005, 2015, 2027] },
        y: { min: -10, max: 0, ticks: [-10, -8, -6, -4, -2, 0], format: v => fmt(v, 0) },
        yTitle: 'Solde public, % du PIB',
        refLines: [{ y: -3, color: 'slate', dash: '6 6' }],
        series: [{ name: 'Observé', color: PET, data: obs, format: v => fmt(v, 1) },
                 { name: 'Prévu', color: PET, data: prev, dash: '7 6', width: 3.5, format: v => fmt(v, 1) }],
        markers: [{ x: 2020, y: FA.solde[i20], color: PET, label: `${fmt(FA.solde[i20], 1)} en 2020`, dy: 34 },
                  { x: 2027, y: PLF.solde_effectif['2027'], color: PET, label: fmt(PLF.solde_effectif['2027'], 1), anchor: 'end', dx: -4, dy: -18 }] });
      if (res && res.S) {

        CH.txt(res.svg, res.S.X(2008.8), res.S.Y(-3) - 36, 'seuil européen', 'ch-lab', { fill: '#5F707D' });
        CH.txt(res.svg, res.S.X(2008.8), res.S.Y(-3) - 10, '−3 % du PIB', 'ch-lab', { fill: '#5F707D' });
        CH.txt(res.svg, res.S.X(2025.4), res.S.Y(-7), 'prévisions', 'ch-lab', { 'text-anchor': 'middle', fill: CH.darken(PET) });
        halo(res.svg, 'text.ch-lab');
      }
    }
  });
Deck.on('budget', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-apu', 1.2);
      const res = CH.line(box, { height: box.clientHeight, animate: anim(ctx), duration: 2, stagger: 0.2, ends: true, hover: false,
        x: { min: 1995, max: 2025, ticks: [1995, 2005, 2015, 2025] },
        y: { min: 46, max: 64, ticks: [46, 50, 54, 58, 62], format: v => fmt(v, 0) },
        yTitle: 'Administrations publiques, % du PIB',
        series: [{ name: 'Dépenses', color: NOM, data: FA.annees.map((y, i) => [y, FA.depenses[i]]), endLabel: 'dépenses', format: v => fmt(v, 1) },
                 { name: 'Recettes', color: 'blue', data: FA.annees.map((y, i) => [y, FA.recettes[i]]), endLabel: 'recettes', format: v => fmt(v, 1) }] });
      if (res && res.S) {
        const x = res.S.X(2025) - 16, y1 = res.S.Y(FA.depenses[FA.depenses.length - 1]), y2 = res.S.Y(FA.recettes[FA.recettes.length - 1]);
        const g = CH.el('g', anim(ctx) ? { class: 'ch-fade', style: 'animation-delay:2.1s' } : {}, res.svg);
        CH.el('path', { d: `M${x + 6},${y1 + 3} L${x},${y1 + 3} L${x},${y2 - 3} L${x + 6},${y2 - 3}`, fill: 'none', stroke: PET, 'stroke-width': 2.2 }, g);

        CH.txt(g, res.S.X(2025) + 16, (y1 + y2) / 2 + 7, `déficit ${fmt(-FA.solde[FA.solde.length - 1], 1)}`, 'ch-lab', { 'text-anchor': 'start', fill: CH.darken(PET), style: 'font-weight:700' });
        halo(res.svg, 'text.ch-lab');
      }
    }
  });
Deck.on('dette', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-dette', 1.2);
      const data = FA.annees.map((y, i) => [y, FA.dette_pct[i]]).filter(d => d[1] != null);
      const T2 = R.fr_dette_2026T2, first = data[0], last = data[data.length - 1];
      const res = CH.line(box, { height: box.clientHeight, animate: anim(ctx), duration: 2, hover: false,
        x: { min: 2000, max: 2026.5, ticks: [2000, 2010, 2020] },
        y: { min: 0, max: 140, ticks: [0, 20, 40, 60, 80, 100, 120, 140] },
        yTitle: 'Dette publique, % du PIB',
        refLines: [{ y: 60, color: 'slate', dash: '6 6' }],
        series: [{ name: 'Dette publique', color: PET, data, format: v => fmt(v, 1) }],
        markers: [{ x: first[0], y: first[1], color: PET, label: `${fmt(first[1], 1)} en ${first[0]}`, anchor: 'start', dx: 6, dy: 34 },
                  { x: last[0], y: last[1], color: PET, label: `${fmt(last[1], 1)} en ${last[0]}`, anchor: 'end', dx: 26, dy: 46 }] });
      if (res && res.S) {
        const g = CH.el('g', anim(ctx) ? { class: 'ch-fade', style: 'animation-delay:2s' } : {}, res.svg);
        CH.el('circle', { cx: res.S.X(2026.5), cy: res.S.Y(T2.pct), r: 7, fill: '#fff', stroke: PET, 'stroke-width': 3 }, g);
        CH.txt(g, res.S.X(2026.5) - 12, res.S.Y(T2.pct) - 14, `fin juin 2026 : ${fmt(T2.pct, 1)}`, 'ch-lab', { 'text-anchor': 'end', fill: CH.darken(PET), style: 'font-weight:700' });
        CH.txt(res.svg, res.S.X(2009), res.S.Y(60) - 10, 'critère européen : 60 %', 'ch-lab', { fill: '#5F707D' });
        halo(res.svg, 'text.ch-lab');
      }
    }
  });
const TX = D.taux, TXX = TX.mois.map(m => +m.slice(0, 4) + (+m.slice(5, 7) - 0.5) / 12);
Deck.on('taux', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-taux', 1.2);
      const ip = TX.mois.indexOf(R.el_taux_pic_mois);
      CH.line(box, { height: box.clientHeight, animate: anim(ctx), duration: 2.2, stagger: 0.2, ends: true, hover: false,
        x: { min: 2007, max: TXX[TXX.length - 1] + 0.1, ticks: [2007, 2012, 2017, 2022, 2026] },
        y: { min: 0, max: 30, ticks: [0, 10, 20, 30] },
        yTitle: 'Taux d\'intérêt de l\'État à dix ans, %',
        series: [{ name: 'Grèce', color: 'blue', data: TXX.map((x, i) => [x, TX.EL[i]]), endLabel: 'Grèce', gaps: 0.1, format: v => fmt(v, 1), width: 3 },
                 { name: 'France', color: SLATE, data: TXX.map((x, i) => [x, TX.FR[i]]), endLabel: 'France', format: v => fmt(v, 1), width: 3, endDy: -16 }],
        markers: [{ x: TXX[ip], y: R.el_taux_pic, color: 'blue', label: `${fmt(R.el_taux_pic, 1)} en ${moisX(TXX[ip])}`, anchor: 'start', dx: 14, dy: 6 }] });
    }
  });
const DTN = D.detention, AMB = '#B87514';
const COURT = { 'Non-résidents': 'Non-résidents', 'Établissements de crédit français': 'Banques françaises', 'Compagnies d\'assurance françaises': 'Assureurs français',
                  'OPCVM français': 'Fonds français', 'Autres détenteurs français': 'Autres résidents' };
Deck.on('preteurs', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-pret-chart', 1.2);
      CH.hbars(box, { height: box.clientHeight, animate: anim(ctx), max: 70, format: v => fmt(v, 1) + NB + '%',
        data: DTN.groupes.map((g, i) => ({ label: COURT[g], value: DTN.parts[i], color: i ? SLATE : PET, bold: !i })) });
    }
  });
const SPD = D.spreads, SPX = SPD.mois.map(m => +m.slice(0, 4) + (+m.slice(5, 7) - 0.5) / 12);
Deck.on('spread-zoom', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-spread-chart', 1.2);
      const res = CH.line(box, { height: box.clientHeight, animate: anim(ctx), duration: 2, stagger: 0.15, ends: true, hover: false,
        x: { min: 2024, max: SPX[SPX.length - 1] + 0.05, ticks: [2024, 2025, 2026] },
        y: { min: 0, max: 180, ticks: [0, 60, 120, 180] }, margin: { t: 40 },
        series: [{ name: 'Italie', color: AMB, data: SPX.map((x, i) => [x, SPD.IT[i]]), endLabel: 'Italie', width: 3, format: v => fmt(v, 0) },
                 { name: 'Espagne', color: SLATE, data: SPX.map((x, i) => [x, SPD.ES[i]]), endLabel: 'Espagne', width: 3, format: v => fmt(v, 0) },
                 { name: 'France', color: BLUE, data: SPX.map((x, i) => [x, SPD.FR[i]]), endLabel: 'France', width: 4.5, format: v => fmt(v, 0) }] });
      if (res && res.S) {
        const xv = 2024 + 5.3 / 12;
        seg(res.svg, res.S.X(xv), res.m.t - 6, res.S.X(xv), res.S.Y(0), { stroke: SLATE, 'stroke-width': 1.6, 'stroke-dasharray': '5 6' });
        CH.txt(res.svg, res.S.X(xv) + 8, res.m.t - 12, 'juin 2024 : dissolution', 'ch-lab', { 'text-anchor': 'start', fill: '#5F707D' });
        halo(res.svg, 'text.ch-lab,text.ch-val');
      }
    }
  });
function scenes(id, draw, last = 99) {
    let cur = null;
    Deck.on(id, {
      enter(el, ctx) { const ro = ctx.reading || ctx.print; cur = ro ? last : Math.min(ctx.step || 0, last); draw(cur, !ro, -1); },
      step(el, n, o) { n = Math.min(n, last); if (o.jump && n === cur) return; const prev = cur; cur = n; draw(n, !o.jump, o.jump ? n : prev); }
    });
  }
const X = window.CROIX, CX = window.Croix;
const E1 = X.E1, E2 = X.E2, E3 = X.E3, FR = X.FR, Y0 = X.Y0, DCH = X.choc;
const A1 = X.A(E1), k1 = X.k(E1);
const XS = 1035;
const ZOOM = { lo: 850, hi: 1050, ticks: [850, 900, 950, 1000, 1050] };
const croix = (id, o) => { const box = PJ.zoom(id, 1.2); return CX.draw(box, Object.assign({ height: box.clientHeight, width: box.clientWidth }, o)); };
const num = v => fmt(v, Math.abs(v - Math.round(v)) < 0.05 ? 0 : 1);
const kf = v => fmt(v, Math.abs(v - Math.round(v)) < 1e-9 ? 0 : Math.abs(v * 10 - Math.round(v * 10)) < 1e-9 ? 1 : 2);
const EQ = `${NB}=${NB}`;
const cRow = (l, val) => `<div><span class="l">${l}</span><span class="v">${val}</span></div>`;
const scenCard = (tag, name, html) => `<div class="pj-scen-card"><div><span class="p-scen">${tag ? `<span class="n">${tag}</span>` : ''}${name}</span></div>${html}</div>`;
const ruleCard = html => `<div class="pj-scen-card"><div><span class="p-scen">La règle</span></div>${html}</div>`;
const PXF = A.dhyne2005_frequence_prix;
Deck.on('prix', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-prix-chart', 1.2);
      const rows = [['énergie', 'énergie'], ['alimentation non transformée', 'alimentation non transformée'], ['ensemble des prix', 'zone euro'],
                    ['alimentation transformée', 'alimentation transformée'], ['biens industriels', 'biens industriels hors énergie'], ['services', 'services']];
      CH.hbars(box, { height: box.clientHeight, animate: anim(ctx), max: 85, format: v => fmt(v, 1) + NB + '%',
        data: rows.filter(r => PXF[r[1]] != null).map(([lab, key]) => ({ label: lab, value: PXF[key], color: key === 'zone euro' ? INK : BLUE, bold: key === 'zone euro' })) });
    }
  });
const FULL = { lo: 0, hi: 1200, ticks: [0, 400, 800, 1200] };
scenes('droite-dg', (st, animate, prev) => {

    const line = st >= 2;
    croix('pj-dg-chart', Object.assign({}, FULL, { diag: false,
      lines: line ? [{ a: A1, b: E1.c, label: 'DG(Y)', anim: animate && prev < 2 }] : [],
      intercepts: st >= 1 ? [{ a: A1, label: `A = ${fmt(A1, 0)}`, dy: 28, anim: animate && prev < 1 }] : [],
      slopes: line ? [{ a: A1, b: E1.c, x: 700, dx: 200, color: CONSO, anim: animate && prev < 2, delay: 0.9 }] : [] }));
  }, 3);
scenes('dg-scen', (st, animate, prev) => {
    const piv = st >= 1, a = piv ? A1 : A1 - 50, c = piv ? 0.8 : E1.c;
    croix('pj-dgs', Object.assign({}, FULL, { diag: false,
      lines: [{ a: A1, b: E1.c, faded: true, color: SLATE, label: 'départ', labelDy: piv ? 18 : -6 }, { a, b: c, label: 'DG(Y)', anim: animate && st !== prev && st <= 1 }],
      intercepts: (piv ? [] : [{ a: A1, faded: true, label: false }]).concat([{ a, label: `A = ${fmt(a, 0)}`, dy: 28 }]),
      slopes: piv ? [{ a, b: c, x: 700, dx: 200, color: CONSO }] : [] }));
    if (st >= 2) put('pj-dgs-card', ruleCard(`<p class="p-stmt sm">La dépense autonome ${k('dep', 'déplace')} la droite ; la propension à consommer la fait ${k('conso', 'pivoter')}.</p>
      <div class="pj-calc">${cRow('Ordonnée à l\'origine', k('dep', '<var>A</var>'))}${cRow('Pente', k('conso', '<var>c</var>'))}</div>`));
    else if (!piv) put('pj-dgs-card', scenCard('1 sur 2', 'Investissement − 50', `<p class="p-txt">La dépense autonome passe de ${A1} à ${A1 - 50} : toute la droite descend de 50, parallèlement.</p>
      <div class="pj-calc">${cRow('Droite DG', `${k('dep', A1 - 50)} + ${k('conso', '0,6')} <var>Y</var>`)}</div>`));
    else put('pj-dgs-card', scenCard('2 sur 2', 'Propension à consommer 0,8', `<p class="p-txt">Même ordonnée à l'origine, pente plus forte : la droite pivote autour de ${k('dep', 'A = ' + A1)}.</p>
      <div class="pj-calc">${cRow('Droite DG', `${k('dep', A1)} + ${k('conso', '0,8')} <var>Y</var>`)}</div>`));
  }, 2);
scenes('equilibre', (st, animate, prev) => {
    const gy = st === 1 ? 800 : st === 2 ? 1100 : null, atEq = st >= 3;
    croix('pj-eq-chart', { lo: 600, hi: 1200, ticks: [600, 800, 1000, 1200], diag: { label: 'Y = DG(Y)', anim: animate && prev < 0 },
      lines: [{ a: A1, b: E1.c, label: 'DG(Y)' }],
      gap: gy != null ? { y: gy, a: A1, b: E1.c, anim: animate && st !== prev } : null,
      eq: atEq ? [{ y: Y0, label: 'équilibre', anim: animate && prev < 3 }] : [] });
    const dg = y => A1 + E1.c * y;
    const cards = [
      `<p class="p-txt">Sur la droite à 45°, chaque point vérifie ${k('vol', '<var>Y</var>')}${EQ}${k('dep', 'DG(<var>Y</var>)')} : la production égale la demande.</p>`,
      scenCard('', 'Production 800', `<div class="pj-calc">${cRow('Demande', k('dep', `${A1} + 0,6 × 800 = ${fmt(dg(800), 0)}`))}${cRow('Stocks', k('moins', sgn(800 - dg(800), 0)))}</div><p class="p-txt">Les stocks baissent : les entreprises produisent davantage.</p>`),
      scenCard('', 'Production 1 100', `<div class="pj-calc">${cRow('Demande', k('dep', `${A1} + 0,6 × 1 100 = ${fmt(dg(1100), 0)}`))}${cRow('Stocks', k('moins', sgn(1100 - dg(1100), 0)))}</div><p class="p-txt">Les invendus s'accumulent : elles produisent moins.</p>`),
      ruleCard(`<p class="p-stmt sm"><span class="nowrap">${k('vol', '<var>Y</var>')}${EQ}${k('dep', A1)} + 0,6${NB}${k('vol', '<var>Y</var>')}</span>, d'où <span class="nowrap">${k('vol', '<var>Y</var>')}${EQ}${A1} / (1 − 0,6)${EQ}${k('vol', fmt(Y0, 0))}</span>.</p><p class="p-txt">À l'intersection, les stocks ne varient plus.</p>`)
    ];
    put('pj-eq-card', cards[Math.min(st, 3)]);
  }, 3);
const MU_WIN = { lo: 800, hi: 1050, ticks: [800, 900, 1000] };
scenes('mu-tours', (st, animate, prev) => {
    const c = E1.c, a0 = A1, a1 = A1 - DCH, y1 = Y0 - k1 * DCH;
    croix('pj-mu-chart', Object.assign({}, MU_WIN, { diag: {},
      lines: [{ a: a0, b: c, faded: true, color: OLIVE, label: 'DG(Y)', labelDy: -6 }, { a: a1, b: c, label: 'DG′(Y)', labelDy: 16, anim: animate && prev < 0 }],
      shifts: [{ x: XS, from: a0 + c * XS, to: a1 + c * XS, label: `−${NB}${DCH}`, anim: animate && prev < 0 }],
      stairs: st >= 1 ? { y0: Y0, a: a1, b: c, n: 7, anim: animate && prev < 1, step: 0.3 } : null,
      eq: [{ y: Y0, faded: true }].concat(st >= 2 ? [{ y: y1, anim: animate && prev < 2 }] : []),
      dY: st >= 2 ? [{ from: Y0, to: y1, label: sgn(-k1 * DCH, 0), anim: animate && prev < 2, delay: 0.3 }] : [] }));
  }, 2);
const MUC = [0.5, 0.75];
scenes('mu-c', (st, animate, prev) => {
    const c = MUC[Math.min(st, 1)], a0 = (1 - c) * Y0, a1 = a0 - DCH, kk = 1 / (1 - c), y1 = Y0 - kk * DCH, fresh = animate && Math.min(st, 1) !== Math.min(prev, 1);
    croix('pj-muc-chart', { lo: 750, hi: 1050, ticks: [800, 900, 1000], diag: {},
      lines: [{ a: a0, b: c, faded: true, color: OLIVE, label: 'DG(Y)', labelDy: -6 }, { a: a1, b: c, label: 'DG′(Y)', labelDy: 16, anim: fresh }],
      shifts: [{ x: XS, from: a0 + c * XS, to: a1 + c * XS, label: `−${NB}${DCH}` }],
      stairs: { y0: Y0, a: a1, b: c, n: 7, anim: fresh, step: 0.2 },
      eq: [{ y: Y0, faded: true }, { y: y1, anim: fresh, delay: fresh ? 1.6 : 0 }],
      dY: [{ from: Y0, to: y1, label: sgn(-kk * DCH, 0), anim: fresh, delay: fresh ? 1.8 : 0 }] });
    if (st >= 2) { put('pj-muc-card', ruleCard(`<p class="p-stmt sm">Plus ${k('conso', '<var>c</var>')} est grand, plus la droite ${k('dep', 'DG')} est pentue et plus l'équilibre recule.</p><p class="p-txt">${k('res', '<var>k</var>')} = 1 / (1 − ${k('conso', '<var>c</var>')}) : 2 avec 0,5 ; 2,5 avec 0,6 ; 4 avec 0,75.</p>`)); return; }
    put('pj-muc-card', scenCard(`${st + 1} sur 2`, `Propension à consommer ${fmt(c, 2).replace(/0$/, '')}`, `<div class="pj-calc">
      ${cRow('Pente de DG', k('conso', fmt(c, 2).replace(/0$/, '')))}${cRow('Multiplicateur', k('res', `1 / (1 − ${fmt(c, 2).replace(/0$/, '')}) = ${fmt(kk, 0)}`))}${cRow('Production', k('vol', sgn(-kk * DCH, 0)))}</div>`));
  }, 2);
const FU = [['Sans fuites', E1], [`Avec impôts, <i>τ</i>${EQ}${fmt(E2.t, 1)}`, E2], [`Et des importations, <i>m</i>${EQ}${fmt(E3.m, 1)}`, E3]];
const FU_WIN = { lo: 800, hi: 1050, ticks: [800, 900, 1000] };
scenes('fuites', (st, animate, prev) => {
    const s3 = Math.min(st, 2), e = FU[s3][1], b = X.pente(e), kk = X.k(e), a0 = X.A(e), a1 = a0 - DCH, y1 = Y0 - kk * DCH;
    const isE1 = s3 === 0, yE1 = Y0 - k1 * DCH, fresh = animate && s3 !== Math.min(prev, 2);
    croix('pj-fu-chart', Object.assign({}, FU_WIN, { diag: {},
      lines: (isE1 ? [] : [{ a: A1 - DCH, b: E1.c, faded: true, color: SLATE, label: 'sans fuites', labelAt: 'start', labelDx: 12 }])
        .concat([{ a: a0, b, faded: true, color: OLIVE, label: 'DG(Y)', labelDy: -8 }, { a: a1, b, label: 'DG′(Y)', labelDy: 14, anim: fresh }]),
      shifts: [{ x: XS, from: a0 + b * XS, to: a1 + b * XS, label: `−${NB}${DCH}` }],
      eq: (isE1 ? [] : [{ y: yE1, faded: true, color: SLATE, yLabel: false }]).concat([{ y: Y0, faded: true }, { y: y1, anim: fresh }]),
      dY: [{ from: Y0, to: y1, label: sgn(-kk * DCH, 0), anim: fresh, delay: fresh ? 0.4 : 0 }] }));
    if (st >= 3) {
      put('pj-fu-card', ruleCard(`<p class="p-stmt sm">Impôts et importations sont des fuites : la droite ${k('dep', 'DG')} est plus plate, le multiplicateur plus faible.</p>
        <p class="p-txt">France, ordres de grandeur : ${k('moins', '<i>τ</i>' + EQ + fmt(FR.t, 2))} et ${k('moins', '<i>m</i>' + EQ + fmt(FR.m, 2))}, donc ${k('res', '<var>k</var>' + NB + '≈' + NB + fmt(X.k(FR), 1))}.</p>`));
      return;
    }
    put('pj-fu-card', scenCard(`${s3 + 1} sur 3`, FU[s3][0], `<div class="pj-calc">
      ${cRow('Pente de DG', `${k('conso', num(e.c))} × (1 − ${k('moins', num(e.t))}) − ${k('moins', num(e.m))} = ${k('dep', num(b))}`)}
      ${cRow('Multiplicateur', k('res', `1 / (1 − ${num(b)}) = ${kf(kk)}`))}
      ${cRow('Production', k('vol', sgn(-kk * DCH, 0)))}</div>${isE1 ? '' : `<p class="p-sub">contre ${sgn(-k1 * DCH, 0)} sans fuites</p>`}`));
  }, 3);
const A3 = X.A(E3), b3 = X.pente(E3), k3 = X.k(E3);
scenes('choc', (st, animate, prev) => {
    const y1 = Y0 - k3 * DCH, o = Object.assign({}, ZOOM, { diag: {}, potentiel: { y: Y0, label: 'potentiel Y*' } });
    const fresh = animate && prev < 1;
    if (!st) Object.assign(o, { lines: [{ a: A3, b: b3, label: 'DG(Y)' }], eq: [{ y: Y0 }] });
    else Object.assign(o, {
      lines: [{ a: A3, b: b3, faded: true, color: OLIVE, label: 'DG(Y)', labelDy: -10 }, { a: A3 - DCH, b: b3, label: 'DG′(Y)', labelDy: 18, anim: fresh }],
      shifts: [{ x: XS, from: A3 + b3 * XS, to: A3 - DCH + b3 * XS, label: `I −${NB}${DCH}`, anim: fresh }],
      eq: [{ y: Y0, faded: true }, { y: y1, anim: fresh, delay: fresh ? 0.6 : 0 }],
      dY: [{ from: Y0, to: y1, label: `${sgn(-k3 * DCH, 0)}, soit ${sgn(-100 * k3 * DCH / Y0, 0)}${NB}%`, anim: fresh, delay: fresh ? 0.8 : 0 }] });
    croix('pj-choc', o);
  }, 2);
const PO = D.potentiel;
Deck.on('potentiel', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-og', 1.2);
      const show = { 2009: 1, 2019: 1, 2020: 1, 2025: 1 };
      CH.bars(box, { height: box.clientHeight, animate: anim(ctx), gap: 0.28, digits: 1, labelsBottom: true,
        y: { min: -8, max: 4, ticks: [-8, -4, 0, 4] }, yTitle: 'Écart de production, % du PIB potentiel',
        data: PO.annees.map((y, i) => ({ label: [2007, 2013, 2019, 2025].includes(y) ? String(y) : '', value: PO.ecart[i],
          color: y >= PO.prevision_depuis ? '#CFC7BA' : PO.ecart[i] < 0 ? RED : BLUE, valueLabel: show[y] ? fmt(PO.ecart[i], 1) : '' })) });
    }
  });
const P27 = (() => {
    const P = PLF;
    return [{ label: 'Déficit|2026', value: -P.solde_effectif['2026'], total: true, color: PET },
            { label: 'Mesures|dépenses', value: -P.effort_depense, color: OLIVE },
            { label: 'Mesures|recettes', value: -P.effort_recettes, color: RED },
            { label: 'Recettes|moins|dynamiques', value: -(P.po_spontanes + P.recettes_hors_po), color: '#DE9E97' },
            { label: 'Charge|de la dette', value: -P.contribution_charge_dette, color: '#96382F' },
            { label: 'Conjonc-|ture', value: -(P.solde_conjoncturel['2027'] - P.solde_conjoncturel['2026']), color: BLUE },
            { label: 'Déficit|2027', value: -P.solde_effectif['2027'], total: true, color: PET }];
  })();
const P27_UPTO = [1, 3, 5, 7], P27_FROM = [0, 1, 3, 5];
PJ.scenes('pont27', (st, animate) => {
    const s = Math.min(st, 3);
    bridge(PJ.zoom('pj-pont', 1.2), { animate, from: P27_FROM[s], upto: P27_UPTO[s], max: 6, ticks: [0, 2, 4, 6], digits: 1, yTitle: 'Déficit public, % du PIB', barMax: 76, margin: { b: 100 }, steps: P27 });
  }, 3);
const yCible = Y0 - X.kCible(E3) * DCH;
const coupes = E3.t * X.kCible(E3) * DCH, aFin = A3 - DCH - coupes;
scenes('cible', (st, animate, prev) => {
    const y1 = Y0 - k3 * DCH, o = Object.assign({}, ZOOM, { diag: {} }), cib = st >= 1, fresh = animate && prev < 1;
    if (!cib) Object.assign(o, {
      lines: [{ a: A3, b: b3, faded: true, color: OLIVE, label: 'DG(Y)', labelDy: -10 }, { a: A3 - DCH, b: b3, label: 'DG′(Y)', labelDy: 18 }],
      shifts: [{ x: XS, from: A3 + b3 * XS, to: A3 - DCH + b3 * XS, label: `choc −${NB}${DCH}` }],
      eq: [{ y: Y0, faded: true }, { y: y1 }],
      dY: [{ from: Y0, to: y1, label: sgn(-k3 * DCH, 0) }] });
    else Object.assign(o, {
      lines: [{ a: A3, b: b3, faded: true, color: OLIVE, label: 'DG(Y)', labelDy: -10 }, { a: A3 - DCH, b: b3, faded: true, color: OLIVE, label: 'DG′(Y)', labelDy: 0 },
              { a: aFin, b: b3, label: 'DG″(Y)', labelDy: 18, anim: fresh, delay: fresh ? 3 : 0 }],
      shifts: [{ x: XS, from: A3 + b3 * XS, to: A3 - DCH + b3 * XS, label: `choc −${NB}${DCH}` },
               { x: XS, from: A3 - DCH + b3 * XS, to: aFin + b3 * XS, label: `coupes −${NB}${fmt(coupes, 0)}`, anim: fresh, delay: fresh ? 3 : 0 }],
      stairs: { y0: Y0, a: A3 - DCH - E3.t * Y0, b: b3 + E3.t, n: 7, anim: fresh, delay: 0.2, step: 0.26 },
      eq: [{ y: Y0, faded: true }, { y: y1, faded: true }, { y: yCible, anim: fresh, delay: fresh ? 3.6 : 0 }],
      dY: [{ from: Y0, to: yCible, label: sgn(-X.kCible(E3) * DCH, 0), anim: fresh, delay: fresh ? 3.7 : 0 }] });
    croix('pj-ci-chart', o);
    if (st >= 2) {
      put('pj-ci-card', ruleCard(`<p class="p-stmt sm">Tenir un objectif de déficit pendant un choc de demande neutralise les stabilisateurs : la politique budgétaire ${k('moins', 'amplifie')} le choc.</p>`));
      return;
    }
    put('pj-ci-card', scenCard(`${st + 1} sur 2`, cib ? 'Tenir l\'objectif de déficit' : 'Laisser jouer les stabilisateurs', `<div class="pj-calc">
      ${cRow('Production', k('vol', sgn(cib ? -X.kCible(E3) * DCH : -k3 * DCH, 0)))}
      ${cRow('Dépenses publiques', k('dep', cib ? sgn(-coupes, 0) : '0'))}
      ${cRow('Déficit', k('fp', cib ? '0' : sgn(E3.t * k3 * DCH, 0)))}</div>
      <p class="p-sub">${cib ? `Coupes de ${fmt(E3.t * DCH, 0)}, puis ${fmt(E3.t * E3.t * DCH, 0)}, puis ${fmt(Math.pow(E3.t, 3) * DCH, 0)}… : ${fmt(coupes, 0)} au total.` : `Les recettes baissent de ${fmt(E3.t, 1)} × ${fmt(k3 * DCH, 0)} = ${fmt(E3.t * k3 * DCH, 0)} : le déficit se creuse.`}</p>`));
  }, 2);
const EPD = D.epargne, EPR = R.epargne;
const trimX = x => `T${Math.min(4, Math.floor((x - Math.floor(x)) * 4) + 1)} ${Math.floor(x)}`;
Deck.on('epargne', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-ep', 1.2);
      const pic = EPD.trimestres.indexOf(EPR.pic_trimestre), last = EPD.x.length - 1;
      const res = CH.line(box, { height: box.clientHeight, animate: anim(ctx), duration: 2.2, legend: false, ends: true, hover: false,
        x: { min: 2000, max: EPD.x[last], ticks: [2000, 2010, 2020] },
        y: { min: 10, max: 28, ticks: [10, 14, 18, 22, 26], format: v => fmt(v, 0) },
        yTitle: 'Épargne des ménages, % du revenu disponible',
        refLines: [{ y: EPR.annuel['2019'], color: 'slate', dash: '6 6' }],
        series: [{ name: 'Taux d\'épargne', color: CONSO, data: EPD.x.map((x, i) => [x, EPD.taux[i]]), format: v => fmt(v, 1), width: 3 }],
        markers: [{ x: EPD.x[pic], y: EPD.taux[pic], color: CONSO, label: `${fmt(EPR.pic, 1)} au ${trimX(EPD.x[pic])}`, anchor: 'end', dx: -12, dy: 4 }] });
      if (res && res.S) {

        CH.txt(res.svg, res.S.X(2021), res.S.Y(EPR.annuel['2019']) + 26, `2019 : ${fmt(EPR.annuel['2019'], 1)}`, 'ch-lab', { fill: '#5F707D' });
        halo(res.svg, 'text.ch-lab');
      }
    }
  });
const BLK = A.blanchard_leigh_multiplicateur_suppose['prévisions de 2010'];
const DB_ROWS = [
    { who: 'Ramey (2019)', what: 'achats publics, moyenne des études', lo: A.ramey2019_depenses.minimum, hi: A.ramey2019_depenses.maximum, color: BLUE, lab: `${fmt(A.ramey2019_depenses.minimum, 1)} à ${fmt(A.ramey2019_depenses.maximum, 0)}` },
    { who: 'Auerbach et Gorodnichenko', what: 'États-Unis, en expansion', lo: A.ag2012_expansion.minimum, hi: A.ag2012_expansion.maximum, color: BLUE, lab: `${fmt(A.ag2012_expansion.minimum, 0)} à ${fmt(A.ag2012_expansion.maximum, 1)}` },
    { who: 'Auerbach et Gorodnichenko', what: 'États-Unis, en récession', lo: A.ag2012_recession.minimum, hi: A.ag2012_recession.maximum, color: BLUE, lab: `${fmt(A.ag2012_recession.minimum, 0)} à ${fmt(A.ag2012_recession.maximum, 1)}` },
    { who: 'Guajardo, Leigh et Pescatori', what: '17 pays, sur deux ans', pt: -A.glp2014_pib['2 ans'], color: BLUE, lab: fmt(-A.glp2014_pib['2 ans'], 2) },
    { who: 'Blanchard et Leigh (2013)', what: 'Europe 2010-2011', pt: BLK - D.bl.article.b, color: BLUE, lab: '≈' + NB + fmt(BLK - D.bl.article.b, 1) },
    { who: 'House, Proebsting et Tesar', what: 'écarts entre pays européens', lo: A.hpt2020_multiplicateur.minimum, hi: A.hpt2020_multiplicateur.maximum, pt: A.hpt2020_multiplicateur['référence'], color: OLIVE, lab: fmt(A.hpt2020_multiplicateur['référence'], 1) },
    { who: 'Prévisions du FMI en 2010', what: 'multiplicateur supposé', pt: BLK, color: SLATE, ref: true, lab: fmt(BLK, 1) }
  ];
Deck.on('debat', {
    enter(el, ctx) {
      const animate = anim(ctx), box = PJ.zoom('pj-db-chart', 1.15);
      const fr = CH.frame(box, { height: box.clientHeight - 40 }), svg = fr.svg, Wd = fr.Wd, Ht = fr.Ht;

      const meas = CH.txt(svg, 0, -50, '', 'ch-lab', { style: 'font-weight:650' });
      const lw = Math.max(...DB_ROWS.flatMap(r => [r.who, r.what]).map(t => { meas.textContent = t; return meas.getComputedTextLength(); }));
      meas.remove();
      const m = { l: Math.ceil(lw) + 30, r: 30, t: 46, b: 54 }, xmax = 2.8;
      const X = v => m.l + v / xmax * (Wd - m.l - m.r), rowH = (Ht - m.t - m.b) / DB_ROWS.length;
      CH.txt(svg, 4, 22, 'Production perdue par euro d\'économie', 'ch-ytitle', { 'text-anchor': 'start' });
      seg(svg, m.l, Ht - m.b, Wd - m.r + 14, Ht - m.b, { class: 'ch-axis', 'marker-end': fr.arrow });
      [0, 1, 2].forEach(v => { seg(svg, X(v), Ht - m.b, X(v), Ht - m.b + 7, { class: 'ch-tickmark' }); CH.txt(svg, X(v), Ht - m.b + 30, fmt(v, 0), 'ch-tick ch-num', { 'text-anchor': 'middle' }); });
      seg(svg, X(1), m.t - 6, X(1), Ht - m.b, { stroke: '#CFC7BA', 'stroke-width': 1.5, 'stroke-dasharray': '5 5' });
      const yRule = m.t + rowH * (DB_ROWS.length - 1) + 2;
      seg(svg, 4, yRule, Wd - m.r, yRule, { stroke: '#D9D2C5', 'stroke-width': 1 });
      DB_ROWS.forEach((r, i) => {
        const yc = m.t + rowH * i + rowH / 2 + 4, d = `animation-delay:${0.2 * i}s`;
        CH.txt(svg, m.l - 18, yc - 4, r.who, 'ch-lab', { 'text-anchor': 'end', fill: INK, style: 'font-weight:650' });
        CH.txt(svg, m.l - 18, yc + 19, r.what, 'ch-lab', { 'text-anchor': 'end', fill: '#3E4954', style: 'font-weight:500' });
        if (r.lo != null) CH.el('line', { x1: X(r.lo), x2: X(r.hi), y1: yc, y2: yc, stroke: r.color, 'stroke-width': 14, 'stroke-linecap': 'round', opacity: r.pt != null ? 0.35 : 1, class: animate ? 'ch-fade' : '', style: d }, svg);
        if (r.pt != null) CH.el('circle', { cx: X(r.pt), cy: yc, r: 10, fill: r.ref ? '#fff' : r.color, stroke: r.color, 'stroke-width': r.ref ? 3 : 0, class: animate ? 'ch-pop' : '', style: d }, svg);
        CH.txt(svg, X(Math.max(r.hi ?? 0, r.pt ?? 0)) + 16, yc + 7, r.lab, 'ch-val' + (animate ? ' ch-fade' : ''), { 'text-anchor': 'start', fill: CH.darken(r.color), style: d });
      });
      halo(svg, 'text');
      legendIn(box, [['multiplicateur d\'un pays', BLUE], ['écart entre pays d\'une union monétaire', OLIVE]]);
    }
  });
const BL = D.bl;
const BL_LAB = { 'Grèce': [-12, 22, 'end'], 'Allemagne': [12, -12, 'start'], 'Suède': [12, 6, 'start'], 'Irlande': [12, -14, 'start'], 'France': [10, -14, 'start'] };
Deck.on('fmi', {
    enter(el, ctx) {
      const animate = anim(ctx), box = PJ.zoom('pj-bl-chart', 1.2);
      const res = CH.scatter(box, { height: box.clientHeight, animate, opacity: 0.9, radius: () => 8,
        x: { min: -3.5, max: 6, ticks: [-2, 0, 2, 4, 6] }, y: { min: -9, max: 8, ticks: [-8, -4, 0, 4, 8] },
        yTitle: 'Erreur de prévision de la croissance, points', xTitle: 'Consolidation prévue, points de PIB',
        points: BL.points.map(p => Object.assign({ x: p.consol, y: p.erreur, color: 'blue', label: p.pays, key: p.pays }, BL_LAB[p.pays] ? { hl: true, dx: BL_LAB[p.pays][0], dy: BL_LAB[p.pays][1], anchor: BL_LAB[p.pays][2] } : {})),
        tip: null });
      if (res && res.S) {
        const x1 = -3, x2 = 5.8, g = CH.el('g', animate ? { class: 'ch-fade', style: 'animation-delay:.9s' } : {}, res.svg);
        seg(g, res.S.X(x1), res.S.Y(BL.a + BL.b * x1), res.S.X(x2), res.S.Y(BL.a + BL.b * x2), { stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '9 7' });
        CH.txt(g, res.S.X(2.9), res.S.Y(-4), `pente ${fmt(BL.b, 2)}`, 'ch-val', { fill: CH.darken(RED), 'text-anchor': 'end' });
        bigLabels(res.svg);
        halo(res.svg, 'text.ch-val,text.ch-lab');
      }
    }
  });
const adDelta = (d, kk, s) => (d - (1 - kk * s)) / (1 - kk / 100) - d;
const AD = [
    { name: 'France 2027, multiplicateur 0,5', d: Math.round(PLF.dette['2026']), k: 0.5, s: 0.6 },
    { name: 'France 2027, multiplicateur 1', d: Math.round(PLF.dette['2026']), k: 1, s: 0.6 },
    { name: 'Grèce 2011, multiplicateur 1,5', d: Math.round(G.dette_pct.EL[GY.indexOf(2011)]), k: 1.5, s: 0.5 }
  ];
PJ.scenes('ad-scen', (st, animate) => {
    const s = Math.min(st, 2), sc = AD[s];
    const box = PJ.zoom('pj-ad-chart', 1.2);
    const curve = (d, ss) => Array.from({ length: 51 }, (_, i) => [i * 0.05, adDelta(d, i * 0.05, ss)]);
    const series = [];
    if (s === 2) series.push({ name: 'France', color: '#B9C2CA', data: curve(AD[0].d, AD[0].s), width: 2.5, dash: '6 6' });
    series.push({ name: s === 2 ? 'Grèce' : 'France', color: PET, data: curve(sc.d, sc.s), width: 3.5 });
    const pts = (s === 2 ? [AD[2]] : AD.slice(0, s + 1)).map((p, i, arr) => ({ x: p.k, y: adDelta(p.d, p.k, p.s), color: i === arr.length - 1 ? PET : SLATE, r: i === arr.length - 1 ? 8 : 6,
      label: sgn(adDelta(p.d, p.k, p.s), 1), anchor: 'end', dx: -12, dy: -12 }));
    const res = CH.line(box, { height: box.clientHeight, animate: false, hover: false, legend: false,
      x: { min: 0, max: 2.5, ticks: [0, 0.5, 1, 1.5, 2, 2.5], format: v => fmt(v, 1) },
      y: { min: -2, max: 6, ticks: [-2, 0, 2, 4, 6], format: v => fmt(v, 0) },
      yTitle: 'Variation du ratio de dette, points', xTitle: 'Multiplicateur k', series, markers: pts });
    if (res && res.svg) halo(res.svg, 'text');
    if (st >= 3) {
      put('pj-ad-card', `<div class="pj-scen-card"><div><span class="p-scen">La règle</span></div>
        <p class="p-stmt sm">La première année, le ratio de dette monte si ${k('res', '<var>k</var>')} (${k('fp', '<var>d</var>')} + <var>ε</var>) > 1.</p>
        <p class="p-sub">Multiplicateur élevé et dette élevée : le PIB baisse plus vite que la dette.</p></div>`);
      return;
    }
    const dy = -sc.k, db = 1 - sc.k * sc.s, dr = adDelta(sc.d, sc.k, sc.s), cond = sc.k * (sc.d / 100 + sc.s);
    put('pj-ad-card', `<div class="pj-scen-card">
      <div><span class="p-scen"><span class="n">Situation ${s + 1} sur 3</span>${sc.name}</span></div>
      <p class="p-sub">Dette de ${fmt(sc.d, 0)} % du PIB ; le solde perd ${fmt(sc.s, 1)} point par point de PIB perdu.</p>
      <div class="pj-calc">
        <div><span class="l">PIB</span><span class="v">${k('vol', sgnPct(dy, 1))}</span></div>
        <div><span class="l">Solde public, points de PIB</span><span class="v">${k('fp', sgn(db, 2))}</span></div>
        <div><span class="l">Ratio de dette, points</span><span class="v">${k('fp', sgn(dr, 1))}</span></div>
      </div>
      <p class="p-sub">${fmt(sc.k, 1)} × (${fmt(sc.d / 100, 2)} + ${fmt(sc.s, 1)}) = ${fmt(cond, 2)} ${cond > 1 ? '> 1 : il monte' : '< 1 : il baisse'}</p></div>`);
  }, 3);
const EC = D.ecarts_de, ECR = R.ecarts_de, AMBER = '#B87514';
const ECX = TX.mois.map(m => +m.slice(0, 4) + (+m.slice(5, 7) - 0.5) / 12);
const PAYS = { EL: 'Grèce', IE: 'Irlande', PT: 'Portugal', ES: 'Espagne', IT: 'Italie' };
const xMois = m => +m.slice(0, 4) + (+m.slice(5, 7) - 0.5) / 12;
Deck.on('ecarts', {
    enter(el, ctx) {
      const box = PJ.zoom('pj-ze-chart', 1.2), H = box.clientHeight;
      const panels = [{ geos: ['EL'], max: 30, ticks: [0, 10, 20, 30], h: Math.round(H * 0.37) }, { geos: ['PT', 'IE'], max: 15, ticks: [0, 5, 10, 15], h: Math.round(H * 0.3) },
                      { geos: ['ES', 'IT'], max: 6, ticks: [0, 3, 6], h: 0 }];
      panels[2].h = H - panels[0].h - panels[1].h;
      panels.forEach((pn, j) => {
        const div = document.createElement('div'); box.appendChild(div);
        const cols = [BLUE, AMBER];
        const res = CH.line(div, { height: pn.h, animate: anim(ctx), duration: 2, stagger: 0.2, legend: false, hover: false,
          x: { min: 2007, max: ECX[ECX.length - 1] + 0.1, ticks: j === 2 ? [2007, 2012, 2017, 2022] : [] },
          y: { min: 0, max: pn.max, ticks: pn.ticks, format: v => fmt(v, 0) },

          margin: { b: j === 2 ? 40 : 10, t: j === 0 ? 28 : 20 },
          series: pn.geos.map((g, i) => ({ name: PAYS[g], color: cols[i], data: ECX.map((x, t) => [x, EC[g][t]]), gaps: 0.1, width: 2.8, format: v => fmt(v, 1) })),
          markers: pn.geos.map((g, i) => ({ x: xMois(ECR[g].pic_mois), y: ECR[g].pic, color: cols[i], label: `${PAYS[g]} : ${fmt(ECR[g].pic, 1)}`, anchor: 'start', dx: 12, dy: i ? 20 : 2 })) });
        if (res && res.S) {
          [[2010 + 4.5 / 12, 'mai 2010'], [2012 + 6.5 / 12, 'juillet 2012']].forEach(([xv, lab]) => {
            CH.el('line', { x1: res.S.X(xv), x2: res.S.X(xv), y1: res.m.t - 6, y2: res.S.Y(0), stroke: '#8A9BA8', 'stroke-width': 1.4, 'stroke-dasharray': '4 5' }, res.svg);
            if (j === 0) CH.txt(res.svg, res.S.X(xv) + (lab === 'mai 2010' ? -6 : 6), res.m.t - 12, lab, 'ch-lab', { 'text-anchor': lab === 'mai 2010' ? 'end' : 'start', fill: '#5F707D' });
          });
          halo(res.svg, 'text.ch-lab,text.ch-val');
        }
      });
    }
  });
const GRc = window.GRECE_CH03;
const GDS = [{ label: '2009', value: GRc.debut, total: true, color: BLUE },
               { label: 'Déficits|primaires', value: GRc.primaire, color: PET },
               { label: 'Intérêts', value: GRc.interets, color: RED },
               { label: 'Baisse|du PIB', value: GRc.pib, color: NOM },
               { label: 'Restruc-|turation|et autres', value: GRc.autres, color: SLATE },
               { label: '2013', value: GRc.fin, total: true, color: BLUE }];
const GD_FROM = [0, 1, 2, 4], GD_UPTO = [1, 2, 4, 6];
PJ.scenes('grece-dette', (st, animate) => {
    const e = Math.min(st, 3);
    bridge(PJ.zoom('pj-gd', 1.2), { animate, from: GD_FROM[e], upto: GD_UPTO[e], max: 250, ticks: [0, 50, 100, 150, 200, 250], digits: 1,
      yTitle: 'Dette de la Grèce, % du PIB', barMax: 80, margin: { b: 100 }, steps: GDS });
  }, 3);
{
    const F25 = window.REPERES.fr_2025, DDc = window.DETTE_CH03;




    const DA = [{ label: 'Intérêts', value: F25.interets_mds, color: RED },
                { label: 'Déficit|primaire', value: -F25.solde_primaire_mds, color: PET },
                { label: 'Autres|opérations', value: DDc.autres_mds, color: SLATE },
                { label: 'Hausse de|la dette', value: DDc.hausse_mds, total: true, color: BLUE }];
    const AUTRES_BULLE = ['Opérations qui changent la dette', 'sans passer par le déficit :', 'variation de la trésorerie de l\'État,',
      'prêts et prises de participation,', 'primes et décotes à l\'émission,', 'indexation des obligations sur l\'inflation.'];

    const bulleEtiquette = (svg, mots, lignes) => {
      const labs = Array.from(svg.querySelectorAll('text.ch-tick')).filter(t => mots.includes(t.textContent));
      if (!labs.length) return;
      const bb = labs.map(t => t.getBBox()), x1 = Math.min(...bb.map(b => b.x)), x2 = Math.max(...bb.map(b => b.x + b.width));
      const y1 = Math.min(...bb.map(b => b.y)), y2 = Math.max(...bb.map(b => b.y + b.height)), cx = (x1 + x2) / 2;
      labs.forEach(t => t.setAttribute('style', 'text-decoration:underline dotted;text-underline-offset:4px'));
      const W = +(svg.getAttribute('viewBox') || '').split(/\s+/)[2] || svg.getBBox().width;
      const lh = 24, bw = 370, bh = lignes.length * lh + 20, bx = Math.max(4, Math.min(W - bw - 4, cx - bw / 2)), by = y1 - bh - 12;
      const g = CH.el('g', { style: 'opacity:0;transition:opacity .12s;pointer-events:none' }, svg);
      CH.el('rect', { x: bx, y: by, width: bw, height: bh, rx: 6, fill: 'rgba(24,33,43,.94)' }, g);
      lignes.forEach((l, i) => CH.txt(g, bx + 14, by + 30 + i * lh, l, '', { fill: '#fff', style: 'font-size:18px' }));
      const zone = CH.el('rect', { x: x1 - 8, y: y1 - 6, width: x2 - x1 + 16, height: y2 - y1 + 12, fill: 'transparent', style: 'cursor:help' }, svg);
      zone.addEventListener('pointerenter', () => { g.style.opacity = 1; });
      zone.addEventListener('pointerleave', () => { g.style.opacity = 0; });
    };
    let vuDA = null;
    PJ.scenes('dette-annee', (st, animate) => {
      const e = Math.min(st, 2), anime = animate && (vuDA === null || e > vuDA);
      vuDA = Math.max(e, vuDA === null ? -1 : vuDA);
      const { svg } = bridge(PJ.zoom('pj-dette-annee', 1.2), { animate: anime, from: [0, 2, 3][e], upto: [2, 3, 4][e], max: 160,
        ticks: [0, 40, 80, 120, 160], digits: 1, yTitle: 'Dette publique ajoutée en 2025, Md€', barMax: 90, steps: DA });
      bulleEtiquette(svg, ['Autres', 'opérations'], AUTRES_BULLE);
    }, 2);



    const tauxEn = an => DDc.fr_taux.find(p => p[0] === an)[1];
    PJ.scenes('dette-interets-fr', st => {
      const box = PJ.zoom('pj-interets-fr', 1.2), e = Math.min(st, 2);
      const series = [{ name: 'Taux apparent', color: RED, width: 4, endLabel: 'taux apparent', data: DDc.fr_taux }];
      if (e >= 2) series.push({ name: 'Croissance du PIB nominal', color: NOM, width: 3, endLabel: 'croissance nominale', data: DDc.fr_gnom });

      const markers = e >= 1 ? [{ x: 2000, y: tauxEn(2000), color: RED, label: fmt(tauxEn(2000), 1) + ' %', dy: -18 },
                                { x: 2021, y: tauxEn(2021), color: RED, label: fmt(tauxEn(2021), 1) + ' %', dx: 14, dy: -20, anchor: 'start' }] : [];
      const res = CH.line(box, { height: box.clientHeight, animate: false, hover: false, legend: false,
        x: { min: 2000, max: 2025, ticks: [2000, 2005, 2010, 2015, 2020, 2025], format: x => String(x) },
        y: { min: -6, max: 10, ticks: [-5, 0, 5, 10], format: x => fmt(x, 0) },
        yTitle: 'Taux et croissance, %', series, markers });
      if (res && res.svg) halo(res.svg, 'text');
    }, 2);



    const UKs = window.DETTE_SERIES.uk, URr = window.DETTE_SERIES.uk_reperes;
    const ukData = UKs.annees.map((an, i) => [an, UKs.dette_pct_pib[i]]);
    const ukBandes = [null, [URr.apres_1815.de, URr.apres_1815.a], [URr.apres_1945.de, URr.apres_1945.a], [2008, 2025]];
    const ukLab = ([an, val]) => fmt(val, 0) + ' % en ' + an;

    const UK_EVTS = [[1694, 'Banque d\'Angleterre', 'bas'], [1756, 'Sept Ans', 'bas'], [1775, 'Guerre d\'Amérique', 'haut'],
                     [1793, 'Révolution et Empire', 'haut'], [1914, '1914-1918', 'haut'], [1939, '1939-1945', 'haut']];

    let ukChart = null, ukVu = false;
    const finirUK = () => {
      if (ukChart) ukChart.svg.querySelector('.ch-line').classList.remove('ch-anim');
    };
    const dessinerUK = (st, animate = false) => {
      const host = document.getElementById('pj-royaume-uni'), e = Math.min(st, 3);
      if (!ukChart || !ukChart.svg.isConnected || ukChart.width !== host.clientWidth || ukChart.height !== host.clientHeight) {
        const box = PJ.zoom(host, 1.2);


        const ppu = (box.clientHeight - 110) / 275, auRas = y => Math.max(24, y * ppu - 6);
        const pics = [URr.pic_1815, URr.pic_1923, URr.pic_1946].map(p => Object.assign({ x: p[0], y: p[1], color: BLUE, label: ukLab(p), dy: -18 },
          p === URr.pic_1946 ? { anchor: 'start', dx: 12, dy: 6 } : p === URr.pic_1815 ? { anchor: 'start', dx: 4, dy: -48 } : {}));
        const bas = [[URr.creux_1913, 1, null], [URr.creux_1990, 2, null], [URr.annee_2025, 3, { anchor: 'end', dx: -12, dy: -16 }]]
          .map(([p, , o]) => Object.assign({ x: p[0], y: p[1], color: RED, label: ukLab(p), dy: auRas(p[1]) }, o || {}));
        const res = CH.line(box, { height: box.clientHeight, animate, duration: 2.2, hover: false, legend: false,
          x: { min: 1680, max: 2025, ticks: [1700, 1750, 1800, 1850, 1900, 1950, 2000], format: x => String(x) },
          y: { min: 0, max: 275, ticks: [0, 50, 100, 150, 200, 250], format: x => fmt(x, 0) },
          yTitle: 'Dette publique britannique, % du PIB', series: [{ name: 'Royaume-Uni', color: BLUE, width: 3, data: ukData }],
          bands: ukBandes.slice(1).map(([x0, x1]) => ({ x0, x1 })), markers: [...pics, ...bas] });
        halo(res.svg, 'text');


        if (res.S) {
          const g = CH.el('g', {}, res.svg), S = res.S, haut = S.Y(275), bas0 = S.Y(0);
          res.svg.insertBefore(g, res.svg.querySelector('.ch-line').parentNode);
          UK_EVTS.forEach(([an, lab, pos]) => {
            const x = S.X(an), y0 = pos === 'haut' ? haut : bas0 - 6;
            CH.el('line', { x1: x, x2: x, y1: haut, y2: bas0, stroke: '#5F707D', 'stroke-width': 1.4, 'stroke-dasharray': '5 5' }, g);
            CH.txt(g, x - 5, y0, lab, 'ch-lab', { 'text-anchor': pos === 'haut' ? 'end' : 'start', transform: `rotate(-90 ${x - 5} ${y0})`, fill: '#5F707D', style: 'font-size:15px;font-weight:600' });
          });
        }
        ukChart = {
          svg: res.svg, width: host.clientWidth, height: host.clientHeight,
          bandes: Array.from(res.svg.querySelector('.ch-line').parentNode.children).filter(el => el.tagName === 'rect'),
          reperes: Array.from(res.svg.querySelectorAll('.ch-val')).slice(pics.length).map(label => [label.previousElementSibling, label])
        };
        res.svg.querySelector('.ch-line').addEventListener('animationend', finirUK, { once: true });
      }
      ukChart.bandes.forEach((b, i) => { b.style.display = e === i + 1 ? '' : 'none'; });
      ukChart.reperes.forEach((repere, i) => repere.forEach(el => { el.style.display = e >= i + 1 ? '' : 'none'; }));
    };
    Deck.on('dette-royaume-uni', {
      enter(el, ctx) {
        const statique = ctx.reading || ctx.print;
        finirUK();
        dessinerUK(statique ? 3 : ctx.step || 0, !statique && !ukVu && !matchMedia('(prefers-reduced-motion: reduce)').matches);
        if (!statique) ukVu = true;
      },
      step(el, st) { dessinerUK(st); },
      leave: finirUK
    });
  }
})();