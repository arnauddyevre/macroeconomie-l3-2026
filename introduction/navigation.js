

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
    // Fonctions qui dessinent le contenu d'une extension (graphique…), enregistrées par interactions.js : C.ext(…, 'clé')
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

  // Le numéro pédagogique exclut couverture et annexes ; l’index de navigation ne change pas.
  function pageLabel(index = st.idx) {
    return st.pages[index] ? `${st.pages[index]} / ${st.pageTotal}`
      : st.slides[index].appendix ? 'Annexe' : 'Couverture';
  }
  function pageReference(index) {
    return st.pages[index] ? `la diapositive ${st.pages[index]}`
      : st.slides[index].appendix ? 'l’annexe' : 'la couverture';
  }

  // ------------------------------------------------------------------ rendu
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
    // Diapositives réservées à l'enseignant (fichier séparé, absent de la version étudiants)
    ([]).forEach(x => {
      const k = slides.findIndex(s => s.id === x.insertAfter);
      slides.splice(k < 0 ? slides.length : k + 1, 0, Object.assign({ teacherOnly: true }, x));
    });
    // Notes de l'enseignant (fichier séparé) : { idDiapo: html }
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
  // Texte brut d'un titre HTML (balises retirées, entités comme &#8239; décodées), pour les attributs.
  const plain = s => { const d = document.createElement('div'); d.innerHTML = String(s); return d.textContent; };

  // Typographie française : l'espace ordinaire avant ; : ? ! » (et après «) devient une espace fine
  // insécable, pour qu'aucune ligne ne commence par un signe de ponctuation ; les nombres ne sont
  // jamais coupés de leurs milliers ni de leur unité. Nœuds de texte seulement.
  function frTypo(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest('script,style,code,kbd,pre') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = n.nodeValue.replace(/ ([;:?!»])/g, '\u202F$1').replace(/« /g, '«\u202F')
        .replace(/(\d) (?=\d{3}(?!\d))/g, '$1\u202F')                                   // 40 000 : jamais coupé
        .replace(/(\d) (?=(%|€|k€|M€|Md€|Mt|Gt|°C|ans?\b|heures?\b|points?\b|h\b|t\b))/g, '$1\u00A0'); // 5,3 % ; 359 Mt
      if (t !== n.nodeValue) n.nodeValue = t;
    }
  }

  function fit() {
    if (st.reading) return fitReading();
    // La scène remplit la boîte #viewport (toute la fenêtre, sauf dans la vue présentateur de la projection)
    const vp = $('#viewport'), s = Math.min((vp.clientWidth || window.innerWidth) / W, (vp.clientHeight || window.innerHeight) / H);
    $('#stage').style.transform = `translate(${-W / 2 * s}px, ${-H / 2 * s}px) scale(${s})`;
    st.scale = s;
  }
  D.scale = () => st.scale || 1;

  // ------------------------------------------------------------------ navigation
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
    else {   // saut à une autre étape de la même diapositive (adresse #id/n, liens) : les graphiques suivent
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
    // data-until="k" : l'élément est visible jusqu'à l'étape k, puis laisse sa place (version de projection)
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

  // ------------------------------------------------------------------ panneaux
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
    if (!list.length) return openPanel('Carnet de repères', 'Les ordres de grandeur à connaître', '<p>Aucun repère chiffré n’est associé à cette introduction.</p>');
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
    if (!list.length) return openPanel('Glossaire', 'Définitions du chapitre', '<p>Aucune définition n’est répertoriée dans le glossaire de cette introduction.</p>');
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

  // Cliquer une réponse fait avancer la diapositive : jusqu'à l'étape qui révèle la bonne réponse
  // (revealAt), ou d'une étape pour un vote sans bonne réponse. Une seule fois par groupe ; rien en mode lecture.
  function advanceAfterChoice(g) {
    if (st.reading || g.dataset.advanced) return;
    const el = g.closest('.slide'), i = st.els.indexOf(el);
    if (i !== st.idx) return;
    const vals = st.steps[i];
    const lim = st.step > 0 ? vals[st.step - 1] : -Infinity;
    const rv = el.querySelector(`[data-reveal-choices="${g.id}"]`);
    let target;
    if (rv) target = vals.indexOf(+rv.dataset.step) + 1;          // nombre d'étapes à afficher
    else if (st.step < vals.length) target = st.step + 1;
    if (!target || target <= st.step) return;
    const own = g.closest('[data-step]');
    if (own && +own.dataset.step > lim) return;                    // groupe pas encore visible
    g.dataset.advanced = '1';
    setTimeout(() => { let guard = 20; while (st.idx === i && st.step < target && guard--) next(); }, 260);
  }

  // ------------------------------------------------------------------ widgets génériques
  function revealChoices(gid) {
    const g = document.getElementById(gid);
    if (!g || g.classList.contains('revealed')) return;
    g.classList.add('revealed');
    const fb = document.getElementById(gid + '-fb');
    if (fb && fb.dataset.text) { fb.innerHTML = fb.dataset.text; frTypo(fb); }   // typographie française aussi pour le texte révélé
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

  // ------------------------------------------------------------------ mode lecture
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

  // ------------------------------------------------------------------ évènements
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
        ch.blur();               // la touche Espace ou Entrée doit ensuite faire avancer, pas recliquer
        advanceAfterChoice(g);
        return;
      }
      const rc = e.target.closest('[data-show-answer]');
      if (rc) { revealChoices(rc.dataset.showAnswer); return; }
      const rb = e.target.closest('.reveal-btn[aria-expanded]');
      if (rb) { const body = document.getElementById(rb.getAttribute('aria-controls')); const open = rb.getAttribute('aria-expanded') !== 'true'; rb.setAttribute('aria-expanded', String(open)); if (body) body.hidden = !open; return; }
      const ph = e.target.closest('.photo');   // la légende et le crédit d'une photographie s'affichent au clic
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
    // La barre d'outils n'apparaît que lorsque la souris bouge (ou au clavier avec Tab). Elle se place en haut à droite,
    // dans la marge supérieure de la diapositive, où il n'y a jamais de contenu : elle ne couvre ni les boutons du pied de page
    // (« Aller plus loin », sources) ni les simulations.
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

;

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
  // full : règles du moteur en plus (espace fine avant ; : ? ! », nombres jamais coupés), pour les textes écrits après coup
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
