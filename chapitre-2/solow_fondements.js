
(function () {
  'use strict';
  const G = window.G2;
  if (!G) throw new Error('G2 doit être chargé avant solow_fondements.js');
  const part = 'Modéliser la croissance de long terme : le modèle de Solow';
  const pwt = '<a href="https://www.rug.nl/ggdc/productivity/pwt/?lang=en" target="_blank" rel="noopener">Penn World Table 11.0</a>';
  const blue = '#001F5F', orange = '#B45309', grey = '#697386';
  const m = html => `<span class="g-math">${html}</span>`;
  const v = x => `<i>${x}</i>`;
  const f = G.f, dot = G.dot, eq = G.eq;
  const show = (step, html) => `<div data-step="${step}">${html}</div>`;
  const text = html => `<p class="g-note">${html}</p>`;
  const add = (position, obj) => G.add(Object.assign({part, source:''}, obj));
  
  const buttons = (id, values) => `<div class="g-controls sf-controls" id="${id}" role="group">${values.map(([value,label])=>`<button type="button" data-value="${value}" aria-pressed="false">${label}</button>`).join('')}</div>`;
  function control(el, id, fallback, onChange, stat) {
    const box = el.querySelector('#'+id);
    if (!box) return String(fallback);
    if (stat) return String(fallback);
    const chosen = box.dataset.choice || String(fallback);
    box.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.value === chosen));
      button.classList.toggle('is-active', button.dataset.value === chosen);
      button.onclick = e => { e.stopPropagation(); box.dataset.choice = button.dataset.value; onChange(); };
    });
    return chosen;
  }
  function samples(fn, max=8, count=100) {
    return Array.from({length:count+1},(_,i)=>{const x=max*i/count;return [x,fn(x)];});
  }
  const fmt = (x,d=2) => G.fmt(x,d);
  const base = {x:{min:0,max:8,ticks:[0,2,4,6,8]},y:{min:0,max:2.4,ticks:[0,.5,1,1.5,2],format:x=>fmt(x,1)},xTitle:'Capital K',yTitle:'Production Y',legend:false,hover:true};
  function line(id, options, ctx) { return G.line(id,Object.assign({animate:ctx.animate,legend:false,hover:true},options)); }
  const style = document.createElement('style'); style.id='g2-solow-fondements-style';
  style.textContent=`
    .sf-definition-layout{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(0,1fr);gap:42px;align-items:center}.slide-body .sf-definition{font-size:30px;line-height:1.28;width:100%;margin:0;padding-left:40px}.sf-definition>li{padding:0}.sf-definition>li+li{margin-top:18px}.sf-definition>li::marker,.sf-definition strong{color:${blue};font-weight:700}.sf-definition strong{font-style:normal}.sf-definition ul{font-size:26px;line-height:1.3;margin:8px 0 0;padding-left:30px;list-style-type:disc}.sf-definition ul li+li{margin-top:7px}.sf-definition .g-math{color:${orange};white-space:nowrap}.sf-definition .g-math sub,.sf-definition .g-math sup{font-size:.7em}.sf-definition .sf-bgp{font-size:26px}.sf-purpose{font-size:28px;line-height:1.4;padding:28px}.sf-purpose p+p{margin-top:24px}.sf-purpose strong{color:${orange}}
    .sf-head{font-size:25px;color:${blue};font-weight:bold;margin:0 0 14px}.sf-vars{font-size:29px;line-height:1.45;width:100%;border-collapse:collapse}.sf-vars td{padding:8px 14px 8px 0;vertical-align:top;border-bottom:1px solid #D9DDE3}.sf-vars td:first-child{width:120px;color:${blue};font-style:italic}
    .sf-economy{display:grid;grid-template-columns:1.4fr 1fr .9fr;gap:24px}.sf-economy .g-panel{padding:24px}.sf-economy h2{font-size:34px;margin-bottom:14px}.sf-economy .sf-vars{font-size:30px;line-height:1.22}.sf-economy .sf-vars td{padding:6px 8px 6px 0}.sf-economy .sf-vars td:first-child{width:70px}.sf-economy .g-panel:first-child .sf-vars td:first-child{width:100px}.sf-economy .sf-vars tr:last-child td{border-bottom:0}.sf-hypotheses{grid-column:1/-1}.sf-hypotheses ul{display:grid;grid-template-columns:1fr 1.1fr;gap:12px 48px;font-size:29px;line-height:1.25;padding-left:30px;margin:0}.sf-hypotheses li+li{margin:0}.sf-economy .sf-vars sub{font-size:.65em}
    .sf-model{display:grid;grid-template-columns:minmax(0,1fr) 453px;gap:40px;align-items:center}.sf-core{display:flex;flex-direction:column;gap:20px;min-width:0}.sf-model-panel{padding:26px 30px}.sf-model-panel h2{font-size:34px;margin:0 0 20px}.sf-core-equation{font-size:46px;line-height:1.28;color:${blue};white-space:nowrap}.sf-core-equation sup,.sf-core-profit sup{font-size:.65em}.sf-core-row{display:flex;gap:70px;margin-top:15px}.sf-core-choice{font-size:27px;color:${blue};margin:20px 0 8px!important}.sf-core-profit{font-size:41px;line-height:1.3;color:${blue};white-space:nowrap}.sf-max{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1}.sf-max sub{font-size:.5em;line-height:1.3}.sf-dynamics-row{display:flex;justify-content:space-between;gap:20px}.sf-dynamics-row .sf-core-equation{font-size:40px}.sf-model-note{font-size:26px;line-height:1.35}.sf-model-panel .sf-model-note{margin-top:20px}.sf-portrait{margin:0;text-align:center}.sf-portrait img{display:block;width:453px;max-width:100%;height:auto}.sf-portrait figcaption{font-size:13px;line-height:1.35;color:#536078;margin-top:8px}.sf-portrait .sf-portrait-name{font-size:32px;line-height:1.2;color:${blue};font-weight:bold;margin:12px 0 3px}.sf-portrait .sf-portrait-bio{font-size:25px;line-height:1.25;margin:0}.sf-portrait-bio a{color:inherit}.sf-solow-papers{font-size:24px;line-height:1.25;text-align:left;margin-top:18px}.sf-solow-papers p+p{margin-top:12px}.sf-solow-papers strong{color:${blue}}.sf-solow-papers a{font-style:italic}.sf-steps{height:0;overflow:hidden}.sf-steps span{display:block;width:1px;height:1px}
    .sf-three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px}.sf-two{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start}.sf-cdp{font-size:41px}.sf-key{font-size:29px;margin:18px 0 8px}.sf-sub{font-size:24px;color:#536078;line-height:1.35;margin:12px 0}.sf-result{color:${orange};font-weight:bold}.sf-controls{margin:12px 0 0}.sf-controls button[aria-pressed=true]{background:${blue};color:white}
    .sf-closure{display:flex;flex-direction:column;gap:18px}.sf-closure-equations{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:48px}.sf-closure .g-panel{padding:18px 24px}.sf-closure h2{font-size:28px;margin:0 0 12px}.sf-closure .sf-closure-eqs{font-size:40px;line-height:1.25;padding-left:40px;margin:0}.sf-closure .sf-closure-eqs li+li{margin-top:8px}.sf-closure-eqs li::marker{font-size:25px;color:${blue}}.sf-closure-eqs .g-math{color:${blue};white-space:nowrap}.sf-closure-eqs sup{font-size:.65em}.sf-closure .sf-closure-price-note{font-size:23px;line-height:1.25;margin-top:16px;color:#536078}.sf-closure-summary{display:grid;grid-template-columns:1.45fr 1fr;gap:24px}.sf-closure .sf-closure-variables{font-size:40px;line-height:1.25;color:${blue};margin-bottom:14px}.sf-closure .sf-closure-given{font-size:27px;line-height:1.3}.sf-closure .sf-closure-given+.sf-closure-given{margin-top:12px}.sf-closure-given .g-math{color:${blue};font-size:31px}.sf-closure-purpose{font-size:27px;line-height:1.3}.sf-closure-purpose strong{color:${orange}}.sf-closure .sf-closure-takeaway{background:#FFF1F2;border-color:#E6BFC4;color:#991B1B;text-align:center;font-size:29px;line-height:1.25;padding:16px 24px}
    #s1-production .slide-body{gap:18px}.sf-production-intro{font-size:30px;color:${blue};line-height:1.3}.sf-production-layout{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:42px;align-items:center}.sf-production-text{gap:20px}.sf-production-text .g-eq{font-size:39px;line-height:1.3}.sf-production-text .g-bullets{font-size:29px;line-height:1.3}.sf-production-property{font-size:29px;line-height:1.35}.sf-production-property strong{color:${orange}}.sf-production-visual{min-width:0}.sf-production-visual [hidden]{display:none!important}.sf-production-visual .sf-controls{margin:0 0 10px}.sf-production-visual #sf-production-choice{margin:10px 0}.sf-production-caption{font-size:22px;color:#536078;line-height:1.3}.sf-production-visual[data-static="true"] #sf-production-chart{height:240px!important;margin-bottom:14px}.sf-production-visual[data-static="true"] #sf-production-surface{height:270px!important}.sf-production-visual[data-static="true"] .g-controls{display:none}
    #s1-echelle .slide-body{gap:20px}.sf-scale-property{font-size:30px;line-height:1.3}.sf-scale-property strong{color:${orange}}.sf-scale-explanation{font-size:30px;line-height:1.3}.sf-scale-technology{font-size:26px;color:#536078}.slide-body .sf-scale{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start;margin:8px 0;padding-left:32px;font-size:31px;line-height:1.3}.slide-body .sf-scale>li{margin:0;padding-left:5px}.sf-scale>li::marker,.sf-scale>li>strong{color:${blue}}.slide-body .sf-scale p{font-size:32px;margin:10px 0 0}.sf-scale-result{font-size:30px;line-height:1.3}
    #s1-marginal .slide-body{gap:18px}.sf-marginal-property{font-size:29px;line-height:1.3}.sf-marginal-property strong{color:${orange}}#s1-marginal .g-col{gap:16px}#s1-marginal .sf-key{font-size:28px;margin:0}#s1-marginal .sf-sub{font-size:23px;line-height:1.3;margin:0}#s1-marginal .g-eq{font-size:34px;line-height:1.25}#s1-marginal .sf-small-table{font-size:23px;margin:0}#s1-marginal .sf-small-table th,#s1-marginal .sf-small-table td{padding:7px}#s1-marginal .g-controls{margin:0}#s1-marginal [hidden]{display:none!important}
    #s1-marginal .sf-marginal-point{display:grid;grid-template-columns:1fr 1fr;gap:16px}.sf-point-control{display:flex;align-items:center;gap:10px;min-width:0;font-size:22px}.sf-point-control label{font-size:22px;white-space:nowrap}.sf-point-control input{width:155px;min-width:0;accent-color:${blue}}.sf-point-control output{min-width:37px}.sf-gradient-formula{font-size:26px;line-height:1.3;color:${blue};white-space:nowrap;margin:7px 0!important}.sf-gradient-values{font-size:23px;line-height:1.35}.sf-gradient-k{color:${orange}}.sf-gradient-l{color:#526780}#s1-marginal:has(#sf-marginal-gradient:not([hidden])) .g-col{gap:12px}#s1-marginal:has(#sf-marginal-gradient:not([hidden])) .sf-small-table td{padding:6px 7px}body.reading #s1-marginal .sf-marginal-point{display:none}
    .sf-small-table{font-size:24px;border-collapse:collapse;width:100%;margin-top:24px}.sf-small-table th,.sf-small-table td{padding:8px;border-bottom:1px solid #D9DDE3;text-align:right}.sf-small-table th:first-child,.sf-small-table td:first-child{text-align:left}.sf-small-table th{color:${blue};font-weight:normal;font-size:22px}.sf-range{display:flex;align-items:center;gap:20px;font-size:24px}.sf-range input{width:250px;accent-color:${blue}}
    #s1-entreprise .slide-body{gap:12px}.slide-body .sf-firm-assumptions{font-size:34px;line-height:1.18;padding-left:38px}.slide-body .sf-firm-assumptions>li+li{margin-top:12px}.slide-body .sf-firm-assumptions ul{font-size:30px;line-height:1.2;margin-top:8px;padding-left:36px}.slide-body .sf-firm-assumptions ul li+li{margin-top:6px}#s1-entreprise .sf-profit{font-size:50px;line-height:1.25;margin:6px 0}#s1-entreprise .sf-term small{font-size:25px}.sf-firm-explanations{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:stretch}.sf-firm-explanations>aside{padding:16px 22px}.sf-firm-definition .def-label,.sf-firm-property-label{font-size:19px;line-height:1.15;margin:0 0 7px}.sf-firm-property-label{color:${orange}}.sf-firm-definition .def-term{font-size:28px;line-height:1.15;margin:0 0 8px}.sf-firm-definition .def-text,.sf-firm-rule p{font-size:25px;line-height:1.22}.sf-firm-rule h2{font-size:28px;line-height:1.15;color:${orange};margin:0 0 10px}.sf-firm-derivatives{display:flex;gap:55px;align-items:center;font-size:29px;line-height:1.2;color:${blue};margin-top:10px}.sf-firm-derivatives sub{font-size:.65em}
    .sf-profit{font-size:46px;line-height:1.6;display:flex;align-items:flex-start;justify-content:center;gap:18px;margin:36px 0 30px}.sf-term{display:inline-flex;flex-direction:column;text-align:center}.sf-term small{font-size:23px;color:#536078;border-top:1px solid #D9DDE3;padding-top:7px}.sf-term.sf-focus{color:${orange}}.sf-prices{display:grid;grid-template-columns:1fr 1fr;gap:40px}.sf-prices h2{font-size:27px;color:${blue};margin:0 0 12px}.sf-prices .g-eq{font-size:34px;margin:16px 0}.sf-share{display:inline-block;padding:12px 24px;border:1px solid #D9DDE3;border-radius:10px;font-size:36px;margin-top:16px;background:#F0F3F8}.sf-price-notes{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:30px;font-size:27px;line-height:1.4}.sf-price-notes p{margin:8px 0}
    #s1-prix .slide-body{gap:16px}.sf-optimization-area{position:relative}.sf-optimization-method{font-size:29px;line-height:1.3;padding:18px 24px}.sf-convex-trigger{display:inline;border:0;border-bottom:1px dashed currentColor;padding:0;background:none;font:inherit;color:${orange};cursor:pointer}.sf-convex-trigger:focus-visible,.sf-convex-close:focus-visible{outline:2px solid ${orange};outline-offset:4px}.sf-convex-definition{position:absolute;z-index:10;top:calc(100% + 12px);left:120px;right:120px;padding:22px 28px}.sf-convex-definition[hidden]{display:none}.sf-convex-definition .def-label{font-size:20px;margin-bottom:6px}.sf-convex-definition .def-term{font-size:31px;margin-bottom:14px}.sf-convex-definition ul{font-size:27px;line-height:1.3;padding-left:28px;margin:0}.sf-convex-definition li+li{margin-top:12px}.sf-convex-definition p{font-size:26px;line-height:1.3;margin-top:18px}.sf-convex-definition strong{color:${blue}}.sf-convex-close{position:absolute;top:10px;right:18px;border:0;padding:0 6px;background:none;font:30px Palatino,serif;color:${blue};cursor:pointer}#s1-prix .sf-prices h2{margin-bottom:8px}#s1-prix .sf-prices .g-eq{font-size:34px;line-height:1.2;margin:8px 0}#s1-prix .sf-share{font-size:34px;margin-top:8px;padding:8px 22px}#s1-prix .sf-price-notes{margin-top:4px;font-size:27px;line-height:1.25}#s1-prix .sf-price-notes p{margin:6px 0}
    #s1-prix.sf-prices-static .sf-optimization-area{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:stretch}#s1-prix.sf-prices-static .sf-optimization-method{font-size:25px;line-height:1.28}#s1-prix.sf-prices-static .sf-convex-definition{display:block;position:relative;top:auto;left:auto;right:auto;padding:16px 22px}#s1-prix.sf-prices-static .sf-convex-close{display:none}#s1-prix.sf-prices-static .sf-convex-trigger{border:0;pointer-events:none}#s1-prix.sf-prices-static .sf-convex-definition .def-label{font-size:17px;margin-bottom:4px}#s1-prix.sf-prices-static .sf-convex-definition .def-term{font-size:25px;margin-bottom:6px}#s1-prix.sf-prices-static .sf-convex-definition ul,#s1-prix.sf-prices-static .sf-convex-definition p{font-size:22px;line-height:1.2}#s1-prix.sf-prices-static .sf-convex-definition li+li{margin-top:7px}#s1-prix.sf-prices-static .sf-convex-definition p{margin-top:8px}#s1-prix.sf-prices-static .sf-prices .g-eq{font-size:32px}#s1-prix.sf-prices-static .sf-share{font-size:32px}
    #s1-prix.sf-prices-static .sf-optimization-method{font-size:24px}#s1-prix.sf-prices-static .sf-convex-definition ul,#s1-prix.sf-prices-static .sf-convex-definition p{font-size:21px}#s1-prix.sf-prices-static .sf-prices .g-eq{margin:4px 0}#s1-prix.sf-prices-static .sf-share{padding:6px 22px}#s1-prix.sf-prices-static .sf-price-notes{font-size:25px;line-height:1.2}
    #s1-accumulation .slide-body{gap:22px}.sf-acc-law{display:grid;grid-template-columns:1.15fr auto .95fr auto 1fr auto 1.15fr auto 1fr;align-items:start;gap:16px;width:100%;color:${blue};font-size:64px;line-height:1.2}.sf-acc-term{display:flex;flex-direction:column;text-align:center;min-width:0}.sf-acc-symbol{display:flex;align-items:center;justify-content:center;height:82px}.sf-acc-explanation{display:block;border-top:1px solid #D9DDE3;padding-top:10px;margin-top:4px;font-size:26px;line-height:1.2;color:#536078;font-style:normal}.sf-acc-sign{padding-top:3px}#s1-accumulation .sf-stock-defs{margin:10px 0}#s1-accumulation .sf-stock-defs h2{font-size:35px;line-height:1.2;margin-bottom:14px}#s1-accumulation .sf-stock-defs p{font-size:36px;line-height:1.3;margin:16px 0}#s1-accumulation .sf-stock-defs .sf-sub{font-size:32px}#s1-accumulation .g-eq{font-size:44px;line-height:1.3}#s1-accumulation .sf-flow-example{font-size:33px;line-height:1.3;margin-top:6px}
    #s1-parts .slide-body{gap:16px}.sf-parts-intro{font-size:28px;line-height:1.3}.sf-parts-intro strong{color:${blue}}#s1-parts .sf-parts-note{margin-top:6px}#s1-parts .ch-lab{font-size:22px}
    .sf-part-head{font-size:29px;color:${blue};margin:0 0 8px}.sf-parts-note{font-size:23px;color:#536078;line-height:1.35;margin-top:16px}.sf-stock-defs{margin:32px 0}.sf-stock-defs p{font-size:30px;line-height:1.4;margin:18px 0}.sf-flow-example{font-size:29px;text-align:center;margin-top:25px}.sf-data-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px}.sf-invest-values{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:30px}.sf-invest-values div{border:1px solid #D9DDE3;border-radius:12px;padding:18px}.sf-invest-values span{display:block;font-size:23px;color:#536078}.sf-invest-values strong{display:block;font-size:40px;color:${blue};margin-top:12px}.sf-median{font-size:66px;color:${orange};margin:42px 0 8px}.sf-median-caption{font-size:26px;line-height:1.35}.sf-rate-lines .g-eq{font-size:39px;margin:27px 0}.sf-growth-final{background:#F0F3F8;border:1px solid #D9DDE3;border-radius:12px;padding:24px;margin-top:30px}
    body.reading .sf-steps{display:none}@media print{.sf-controls,.sf-range{display:none!important}.sf-system .sf-focus,.sf-term.sf-focus{background:none;color:inherit}}
  `;
  document.head.appendChild(style);

  
  add(8,{id:'s1',layout:'section',title:part,source:'',html:G.plan(0)});

  
  add(9,{id:'s1-definition-modele',title:'Qu’est-ce qu’un modèle économique ?',html:`<div class="sf-definition-layout"><ol class="sf-definition">
    <li><strong>Équations</strong> : relations économiques d’intérêt
      <ul><li>Par exemple : Cobb–Douglas : ${m('Y<sub>t</sub> = A<sub>t</sub> K<sub>t</sub><sup>α</sup> L<sub>t</sub><sup>1−α</sup>')}</li></ul>
    </li>
    <li data-step="1"><strong>Variables à déterminer</strong> : inconnues du modèle
      <ul><li>Par exemple : variable : ${m('Y<sub>t</sub>')}.</li><li>Par exemple : paramètre : ${m('α')}. Les paramètres, a contrario, sont donnés et ne varient pas.</li></ul>
    </li>
    <li data-step="2"><strong>Système fermé</strong> : autant de relations indépendantes que d’inconnues</li>
    <li data-step="3"><strong>Conditions initiales</strong> : point de départ
      <ul><li>Par exemple : production initiale : ${m('Y<sub>0</sub>')}</li></ul>
    </li>
    <li data-step="4"><strong>Équilibre de long terme</strong> : sentier de croissance équilibré <em class="sf-bgp">(balanced growth path)</em>
      <ul><li>Par exemple : ${m('y<sub>0</sub> e<sup>gt</sup>')}, avec ${m('g')} constant</li></ul>
    </li>
  </ol><aside class="g-panel orange sf-purpose" data-step="5">
    <p><strong>Le but d’un modèle :</strong> expliquer le plus de phénomènes intéressants sans être trop compliqué (son but n’est <em>pas</em> le réalisme le plus total).</p>
    <p>Un modèle est une « histoire », formelle, racontée par un économiste.</p>
    <p><strong>Idéalement :</strong> un modèle = un mécanisme d’intérêt principal</p>
  </aside></div>`});

  
  add(10,{id:'s1-economie',title:'Notre économie : variables et hypothèses',html:`<div class="sf-economy">
    <section class="g-panel"><h2>Quantités</h2><table class="sf-vars">
      <tr><td>${m('Y, C, I')}</td><td>Production, consommation, investissement</td></tr>
      <tr><td>${m('K')}</td><td>Capital productif</td></tr>
      <tr><td>${m('L')}</td><td>Personnes en emploi</td></tr>
      <tr><td>${m('A')}</td><td>Productivité globale des facteurs</td></tr>
      <tr><td>${m('N, H')}</td><td>Population, heures travaillées</td></tr>
    </table></section>
    <section class="g-panel" data-step="1"><h2>Paramètres</h2><table class="sf-vars">
      <tr><td>${m('α')}</td><td>Élasticité au capital</td></tr>
      <tr><td>${m('s')}</td><td>Taux d’épargne</td></tr>
      <tr><td>${m('δ')}</td><td>Dépréciation</td></tr>
      <tr><td>${m('n')}</td><td>Croissance de l’emploi</td></tr>
      <tr><td>${m('γ')}</td><td>Croissance de la PGF</td></tr>
    </table></section>
    <section class="g-panel" data-step="2"><h2>Prix des facteurs</h2><table class="sf-vars">
      <tr><td>${m('w')}</td><td>Salaire réel par travailleur</td></tr>
      <tr><td>${m('r')}</td><td>Prix de location du capital, avant dépréciation</td></tr>
    </table></section>
    <section class="g-panel sf-hypotheses" data-step="3"><h2>Hypothèses</h2><ul>
      <li>Économie fermée à un bien</li>
      <li>Concurrence parfaite. Prix du bien unique : ${m('1')} (un <em>numéraire</em>).</li>
      <li>Travail offert = travail employé.</li>
      <li>${m('L/N')} et ${m('H/L')} constants</li>
    </ul></section>
  </div>`});

  
  add(11,{id:'s1-modele',title:'Le modèle de Solow : les relations entre les variables',html:`<div class="sf-model"><div class="sf-core">
    <section class="g-panel sf-model-panel" id="sf-core-production"><h2>Production et allocation</h2>
      <div class="sf-core-equation g-math">Y = A K<sup>α</sup> L<sup>1−α</sup></div>
      <div class="sf-core-row"><div class="sf-core-equation g-math">I = sY</div><div class="sf-core-equation g-math">C = Y − I</div></div>
      <p class="sf-core-choice">Choix des entreprises</p>
      <div class="sf-core-profit g-math"><span class="sf-max">max<sub>K,L</sub></span> π = A K<sup>α</sup> L<sup>1−α</sup> − rK − wL</div>
    </section>
    <section class="g-panel sf-model-panel" id="sf-core-dynamics" data-step="1"><h2>Dynamique</h2>
      <div class="sf-dynamics-row"><div class="sf-core-equation g-math">${dot('K')} = I − δK</div><div class="sf-core-equation g-math">${dot('L')} = nL</div><div class="sf-core-equation g-math">${dot('A')} = γA</div></div>
      <p class="sf-model-note">${m(dot('x'))} : variation instantanée de ${m('x')}.</p>
    </section>
    <p class="sf-model-note">Paramètres et valeurs initiales de ${m('K, L, A')} donnés.</p>
  </div><figure class="sf-portrait">
    <img src="assets/a466d1a0277cc03d.jpg" width="453" height="336" alt="Robert Solow, photographié par Olaf Storbeck en 2008">
    <figcaption><a href="https://commons.wikimedia.org/wiki/File:Robert_Solow_by_Olaf_Storbeck.jpg" target="_blank" rel="noopener">Olaf Storbeck, 2008 (Wikimedia)</a>. <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener">CC BY-SA 2.0</a></figcaption>
    <p class="sf-portrait-name">Robert Solow (1924–2023)</p>
    <p class="sf-portrait-bio"><a href="https://news.mit.edu/2023/institute-professor-emeritus-robert-solow-dies-1222" target="_blank" rel="noopener">Prix Nobel d’économie 1987</a></p>
    <div class="sf-solow-papers">
      <p><strong>1956.</strong> <a href="https://academic.oup.com/qje/article-abstract/70/1/65/1903777" target="_blank" rel="noopener">A Contribution to the Theory of Economic Growth</a></p>
      <p><strong>1957.</strong> <a href="https://www.jstor.org/stable/1926047" target="_blank" rel="noopener">Technical Change and the Aggregate Production Function</a></p>
    </div>
  </figure></div>`});

  
  add('11 bis',{id:'s1-systeme-ferme',title:'Le modèle de Solow : Huit équations, huit variables à trouver',html:`<div class="sf-closure">
    <div class="g-panel sf-closure-equations">
      <section><h2>Production et allocation</h2><ol class="sf-closure-eqs">
        <li>${m('Y = A K<sup>α</sup> L<sup>1−α</sup>')}</li>
        <li>${m('I = sY')}</li>
        <li>${m('C = Y − I')}</li>
      </ol></section>
      <section><h2>Dynamique</h2><ol class="sf-closure-eqs" start="4">
        <li>${m(`${dot('K')} = I − δK`)}</li>
        <li>${m(`${dot('L')} = nL`)}</li>
        <li>${m(`${dot('A')} = γA`)}</li>
      </ol></section>
      <section><h2>Prix des facteurs</h2><ol class="sf-closure-eqs" start="7">
        <li>${m(`r = α ${f('Y','K')}`)}</li>
        <li>${m(`w = (1−α) ${f('Y','L')}`)}</li>
      </ol><p class="sf-closure-price-note">Produits marginaux à l’équilibre des marchés des facteurs.</p></section>
    </div>
    <div class="sf-closure-summary">
      <section class="g-panel" data-step="1"><h2>8 variables à trouver au cours du temps</h2>
        <p class="sf-closure-variables g-math">Y, I, C, K, L, A, r, w</p>
        <p class="sf-closure-given"><strong>Valeurs initiales données :</strong> ${m('K<sub>0</sub>, L<sub>0</sub>, A<sub>0</sub>')}</p>
        <p class="sf-closure-given"><strong>Paramètres donnés :</strong> ${m('α, s, δ, n, γ')}</p>
      </section>
      <aside class="g-panel orange sf-closure-purpose" data-step="2"><p><strong>Notre but dans ce cours :</strong> résoudre le modèle de Solow (trouver la valeur des variables au cours du temps et le sentier équilibré) et en tirer des conclusions sur les sources de la croissance</p></aside>
    </div>
    <aside class="g-panel sf-closure-takeaway" data-step="3"><p>Si vous ne retenez qu’une slide du modèle de Solow : <strong>retenez celle-ci</strong></p></aside>
  </div>`});

  
  add(12,{id:'s1-production',title:'Une fonction de production : Cobb–Douglas',prov:'sim',html:`
    <aside class="g-panel orange sf-production-property"><p><strong>Propriété 1 :</strong> À capital et travail donnés, une PGF plus élevée augmente la production.</p></aside>
    <div class="sf-production-layout">
      <div class="g-col sf-production-text">
        <p class="sf-production-intro">Étudions les propriétés de la fonction de production</p>
        ${eq(`${v('Y')} = ${v('A')} ${v('F')}(${v('K')},${v('L')})`)}
        ${eq(`${v('Y')} = ${v('A')} ${v('K')}<sup>α</sup>${v('L')}<sup>1−α</sup>`,1)}
        ${G.list(['Capital et travail : les facteurs',['PGF : efficacité de la production',1],[`${m('α = 1/3')} : convention pédagogique`,2]])}
      </div>
      <div class="sf-production-visual">
        ${buttons('sf-production-view',[['2d','Vue 2D'],['3d','Vue 3D']])}
        ${G.chart('sf-production-chart',420)}
        <div id="sf-production-surface" class="g-chart chart" style="height:420px" hidden></div>
        ${buttons('sf-production-choice',[['1',m('A = 1')],['2',m('A = 2')],['both','Comparer']])}
        <p class="sf-production-caption" id="sf-production-caption"></p>
      </div>
    </div>`});
  G.on('s1-production',(el,ctx)=>{
    const draw=()=>{
      const mode=control(el,'sf-production-choice',ctx.static?'both':'1',draw,ctx.static);
      const view=control(el,'sf-production-view','2d',draw,ctx.static);
      const values=mode==='both'?[1,2]:[+mode];
      const two=el.querySelector('#sf-production-chart'),three=el.querySelector('#sf-production-surface');
      el.querySelector('.sf-production-visual').dataset.static=String(ctx.static);
      two.hidden=!ctx.static&&view!=='2d';three.hidden=!ctx.static&&view!=='3d';
      if(!two.hidden)line(two,Object.assign({},base,{height:ctx.static?240:420,y:{min:0,max:4.5,ticks:[0,1,2,3,4]},yTitle:ctx.static?'Production Y (L = 1)':'Production Y',series:values.map(A=>({name:'A = '+A,color:A===1?blue:orange,data:samples(K=>A*K**(1/3)),endLabel:'A = '+A,format:x=>fmt(x,2)}))}),ctx);
      if(!three.hidden)window.SolowSurface3D.render(three,{values,alpha:1/3,static:ctx.static,animate:ctx.animate,entry:ctx.entry});
      el.querySelector('#sf-production-caption').innerHTML=ctx.static?`${m('α = 1/3')}. Unités pédagogiques.`:(view==='2d'?`${m('L = 1')}, ${m('α = 1/3')}. Unités pédagogiques.`:`${m('K, L')} de ${m('0')} à ${m('8')}, ${m('α = 1/3')}. Unités pédagogiques.`);
    };
    draw();
  });

  
  add(13,{id:'s1-echelle',title:'Doubler tous les facteurs',html:`
    <aside class="g-panel orange sf-scale-property"><p><strong>Propriété 2 :</strong> La fonction de production de Cobb-Douglas est homogène de degré ${m('1')}. Les rendements d’échelle de <em>l’ensemble des facteurs</em> sont constants.</p></aside>
    <p class="sf-scale-explanation">En d’autres termes : doubler tous les facteurs double la production.</p>
    <p class="sf-scale-technology">À technologie ${m('A')} donnée</p>
    <ul class="sf-scale">
      <li><strong>Situation initiale</strong><p>${m('K')} unités de capital</p><p>${m('L')} travailleurs</p><p>Production : ${m('Y')}</p></li>
      <li data-step="1"><strong>Deux fois plus de facteurs</strong><p>${m('2K')} unités de capital</p><p>${m('2L')} travailleurs</p><p>Production : <strong class="sf-result">${m('2Y')}</strong></p></li>
    </ul>
    ${eq(`${v('A')}(2${v('K')})<sup>α</sup>(2${v('L')})<sup>1−α</sup> = 2<sup>α+1−α</sup>${v('AK')}<sup>α</sup>${v('L')}<sup>1−α</sup> = 2${v('Y')}`,2)}
    ${show(2,'<p class="sf-scale-result">Un argument de réplication simple : doubler le nombre d’usines et de travailleurs double la production</p>')}`});

  
  add(14,{id:'s1-marginal',title:'Ajouter des machines à travail donné',prov:'sim',html:`
    <aside class="g-panel orange sf-marginal-property"><p><strong>Propriété 3 :</strong> Le produit marginal de chaque facteur pris isolément est décroissant. Les rendements marginaux de chaque facteur sont décroissants, à technologie et autre facteur donnés.</p></aside>
    ${G.cols(`<p class="sf-key">Doubler le capital à travail donné</p>
      ${eq(`${f('Y <span style="font-style:normal">après</span>','Y <span style="font-style:normal">avant</span>')} = 2<sup>1/3</sup> ≈ 1,26`,1)}
      ${show(1,`<p class="sf-sub">Environ ${m('+26 %')} de production. Exemple : ${m('A = L = 1')}.</p>`)}
      <table class="sf-small-table" data-step="2"><tr><th>Capital</th><th>Capital ajouté</th><th>Gain par unité</th></tr><tr><td>${m('1 → 2')}</td><td>${m('1')}</td><td>${m('0,260')}</td></tr><tr><td>${m('2 → 4')}</td><td>${m('2')}</td><td>${m('0,164')}</td></tr><tr><td>${m('4 → 8')}</td><td>${m('4')}</td><td>${m('0,103')}</td></tr></table>
      ${show(3,`<div id="sf-marginal-single"><p class="sf-key">Produit marginal : pente de la tangente</p><p class="sf-sub" id="sf-pmk-readout"></p></div><div id="sf-marginal-gradient" hidden><p class="sf-key">Gradient au point choisi</p><p class="sf-gradient-formula g-math">∇Y(K,L) = (${f('∂Y','∂K')}, ${f('∂Y','∂L')}) = (${f('αY','K')}, ${f('(1−α)Y','L')})</p><p class="sf-gradient-values" id="sf-gradient-values"></p></div>`)}`,
      `${buttons('sf-marginal-view',[['2d','Vue 2D'],['3d','Vue 3D']])}${G.chart('sf-marginal-chart',400)}<div id="sf-marginal-surface" class="g-chart chart" style="height:400px" hidden></div><div class="g-controls sf-marginal-point" data-step="3"><div class="sf-point-control"><label for="sf-tangent-k">Capital ${m('K')}</label><input id="sf-tangent-k" type="range" min="1" max="8" step=".1" value="2"><output class="g-math" id="sf-tangent-value">2</output></div><div class="sf-point-control" id="sf-l-control" hidden><label for="sf-tangent-l">Travail ${m('L')}</label><input id="sf-tangent-l" type="range" min="1" max="8" step=".1" value="1"><output class="g-math" id="sf-l-value">1</output></div></div><p class="sf-sub" id="sf-marginal-params">${m('A = L = 1')}, ${m('α = 1/3')}</p>`)}
    `});
  G.on('s1-marginal',(el,ctx)=>{
    const input=el.querySelector('#sf-tangent-k'),labor=el.querySelector('#sf-tangent-l');
    const draw=()=>{
      const K=ctx.static?2:+input.value,Y=K**(1/3),slope=(1/3)*K**(-2/3);
      const view=control(el,'sf-marginal-view','2d',draw,ctx.static);
      const tangent=ctx.static||ctx.step>=3;
      const two=el.querySelector('#sf-marginal-chart'),three=el.querySelector('#sf-marginal-surface');
      two.hidden=!ctx.static&&view==='3d';three.hidden=ctx.static||view!=='3d';
      if(!two.hidden){
        const lo=Math.max(0,K-2),hi=Math.min(8,K+2);
        const series=[{name:'Production',color:blue,data:samples(k=>k**(1/3)),format:x=>fmt(x,2)}];
        if(tangent)series.push({name:'Tangente',color:orange,dash:'7 5',data:[[lo,Y+slope*(lo-K)],[hi,Y+slope*(hi-K)]],format:x=>fmt(x,2)});
        line(two,Object.assign({},base,{height:400,series,markers:tangent?[{x:K,y:Y,label:'K = '+fmt(K,1),color:orange}]:[{x:1,y:1,color:blue},{x:2,y:2**(1/3),color:blue}]}),ctx);
      }
      const L=ctx.static||view==='2d'?1:+labor.value,production=K**(1/3)*L**(2/3),dK=production/(3*K),dL=2*production/(3*L);
      if(!three.hidden)window.SolowSurface3D.render(three,{values:[1],alpha:1/3,static:false,animate:ctx.animate,entry:ctx.entry,gradient:{K,L,tangent}});
      el.querySelector('#sf-l-control').hidden=three.hidden;
      el.querySelector('#sf-marginal-single').hidden=!three.hidden||ctx.static;
      el.querySelector('#sf-marginal-gradient').hidden=three.hidden&&!ctx.static;
      el.querySelector('#sf-l-value').textContent=fmt(L,1);
      el.querySelector('#sf-gradient-values').innerHTML=`${m('K = '+fmt(K,1)+', L = '+fmt(L,1))} : <span class="g-math">∇Y ≈ (<span class="sf-gradient-k">${fmt(dK,3)}</span> ; <span class="sf-gradient-l">${fmt(dL,3)}</span>)</span>`;
      el.querySelector('#sf-marginal-params').innerHTML=!three.hidden?`${m('A = 1')}, ${m('α = 1/3')}`:`${m('A = L = 1')}, ${m('α = 1/3')}`;
      el.querySelector('#sf-tangent-value').textContent=fmt(K,1);
      el.querySelector('#sf-pmk-readout').innerHTML='Au point '+m('K = '+fmt(K,1))+' : produit marginal '+m('≈ '+fmt(slope,3))+'.';
    };
    input.oninput=draw;labor.oninput=draw;draw();
  });

  
  add(15,{id:'s1-alpha',title:`Que change l’exposant ${m('α')} ?`,prov:'sim',html:G.cols(`<div class="g-col">${eq(`${v('Y')} = ${v('K')}<sup>α</sup>`)}<p class="sf-key">Doubler le capital : production ${m('× 2<sup>α</sup>')}</p><table class="sf-small-table"><tr><th>${m('α')}</th><th>Multiplicateur</th></tr><tr><td>${m('1')}</td><td>${m('2')}</td></tr><tr data-step="1"><td>${m('0,1')}</td><td>${m('1,072')}</td></tr><tr data-step="2"><td>${m('1/3')}</td><td>${m('1,260')}</td></tr></table><p class="sf-sub">${m('α = 1')} : comparaison linéaire.<br>Le modèle de Solow étudié retient ${m('0 &lt; α &lt; 1')}.</p></div>`,`${G.chart('sf-alpha-chart',450)}${buttons('sf-alpha-choice',[['1',m('α = 1')],['.1',m('α = 0,1')],['third',m('α = 1/3')],['all','Comparer']])}<p class="sf-sub">${m('A = L = 1')}. Repères : ${m('K = 1, 2, 4')}</p>`)});
  G.on('s1-alpha',(el,ctx)=>{
    const draw=()=>{const mode=control(el,'sf-alpha-choice',ctx.static?'all':(ctx.step>=2?'third':ctx.step>=1?'.1':'1'),draw,ctx.static);const all=[{a:1,name:'α = 1',color:grey,dash:'7 5'},{a:.1,name:'α = 0,1',color:orange,dash:'3 4'},{a:1/3,name:'α = 1/3',color:blue}];const series=(mode==='all'?all:all.filter(s=>s.a===(mode==='third'?1/3:+mode))).map(s=>({...s,endLabel:s.name,data:samples(x=>x**s.a,4),format:y=>fmt(y,2)}));line('sf-alpha-chart',{x:{min:0,max:4,ticks:[0,1,2,3,4]},y:{min:0,max:4.2,ticks:[0,1,2,3,4]},xTitle:'Capital K',yTitle:'Production Y',series},ctx);};draw();
  });

  
  add(16,{id:'s1-entreprise',title:'Que choisit une entreprise ?',html:`<ul class="sf-firm-assumptions">
    <li>Entreprises concurrentielles et identiques → simplification : une entreprise représentative qui n’affecte pas les prix<ul>
      <li>Salaire ${m('w')}, location du capital ${m('r')} : pris comme donnés</li>
      <li>Prix des facteurs : déterminés par l’équilibre final du système, une fois le modèle résolu</li>
    </ul></li>
    <li>Prix du bien final normalisé à ${m('1')}</li>
    <li>Quantités de capital et de travail demandées : choisies</li>
  </ul><div class="sf-profit"><span>max<sub>K,L</sub> π =</span><span class="sf-term" data-profit="recettes"><span>${v('A')}${v('K')}<sup>α</sup>${v('L')}<sup>1−α</sup></span><small>recettes</small></span><span>−</span><span class="sf-term" data-profit="couts"><span>${v('rK')}</span><small>coût du capital</small></span><span>−</span><span class="sf-term" data-profit="couts"><span>${v('wL')}</span><small>coût du travail</small></span></div><div class="sf-firm-explanations">
    <aside class="def sf-firm-definition" data-step="3"><div class="def-label">Définition</div><div class="def-term">Produit marginal d’un facteur</div><p class="def-text">Production supplémentaire par unité de facteur ajoutée à la marge, les autres facteurs et la technologie étant donnés.</p><div class="sf-firm-derivatives g-math"><span>PM<sub>K</sub> = ${f('∂Y','∂K')}</span><span>PM<sub>L</sub> = ${f('∂Y','∂L')}</span></div></aside>
    <aside class="g-panel orange sf-firm-rule" data-step="4"><div class="sf-firm-property-label">Propriété</div><h2>Comment l’entreprise choisit les quantités optimales ?</h2><p>Une unité supplémentaire est rentable tant que son produit marginal dépasse son coût. Tant que le produit marginal est supérieur au prix, l’entreprise augmente la quantité qu’elle demande.</p></aside>
  </div><div class="sf-steps" aria-hidden="true"><span data-step="1"></span><span data-step="2"></span></div>`});
  G.on('s1-entreprise',(el,ctx)=>el.querySelectorAll('[data-profit]').forEach(node=>node.classList.toggle('sf-focus',!ctx.static && node.dataset.profit===(ctx.step===1?'recettes':ctx.step===2?'couts':''))));

  
  add('16 bis',{id:'s1-annales',title:'Aparté: Corrigés des examens des années précédentes',html:`<ul class="g-bullets sf-annales-list">
    <li>Six examens : <strong>2018, 2019, 2022, 2023, 2024 et 2025</strong>.</li>
    <li>Pour chaque année : <strong>le sujet et son corrigé en PDF</strong>.</li>
    <li>QCM, exercices de calcul et questions de raisonnement économique.</li>
  </ul><div class="sf-annales-access"><p>Sur le site du cours, rubrique « Annales » :</p><a href="https://arnauddyevre.github.io/macroeconomie-l3-2026/#annales" target="_blank" rel="noopener">https://arnauddyevre.github.io/macroeconomie-l3-2026/</a></div>`});

  
  add(17,{id:'s1-prix',title:'Résoudre le problème d’optimisation de l’entreprise',html:`<div class="sf-optimization-area">
    <div class="g-panel orange sf-optimization-method"><p>Le problème de maximisation de l’entreprise est un <button type="button" class="sf-convex-trigger" aria-expanded="false" aria-controls="sf-convex-definition">problème <em>convexe</em></button> : la fonction de profit est concave. Pour un choix intérieur, nous pouvons le résoudre en annulant la dérivée de la fonction objective par rapport à la quantité de chaque facteur.</p></div>
    <aside id="sf-convex-definition" class="def sf-convex-definition" aria-labelledby="sf-convex-title" hidden>
      <button type="button" class="sf-convex-close" aria-label="Fermer la définition">×</button>
      <div class="def-label">Définition</div><div id="sf-convex-title" class="def-term">Problème convexe</div>
      <ul><li><strong>Ensemble des choix convexe :</strong> tout le segment reliant deux choix possibles reste admissible.</li><li><strong>Objectif :</strong> minimiser une fonction convexe ou maximiser une fonction concave.</li></ul>
      <p>Dans notre cas, le profit est concave en ${m('K')} et ${m('L')}. Un point intérieur où les deux dérivées partielles sont nulles est un maximum global.</p>
    </aside>
  </div><div class="sf-prices-layout"><div class="sf-price-calculations"><div class="sf-prices"><div><h2>Capital</h2>${eq(`${f('∂π','∂K')} = 0`)}${eq(`${v('r')} = α${v('AK')}<sup>α−1</sup>${v('L')}<sup>1−α</sup>`,1)}${eq(`${v('r')} = α ${f(v('Y'),v('K'))}`,1)}<div class="sf-share" data-step="3">${f(v('rK'),v('Y'))} = α</div></div><div data-step="2"><h2>Travail</h2>${eq(`${f('∂π','∂L')} = 0`)}${eq(`${v('w')} = (1−α)${v('AK')}<sup>α</sup>${v('L')}<sup>−α</sup>`)}${eq(`${v('w')} = (1−α) ${f(v('Y'),v('L'))}`)}<div class="sf-share" data-step="3">${f(v('wL'),v('Y'))} = 1−α</div></div></div><div class="sf-price-notes" data-step="4"><div><p>Rémunérations = produits marginaux</p><p>Parts du revenu constantes</p></div><div><p>${v('r')} : location avant dépréciation</p><p>${m('r − δ')} : rendement net</p></div></div></div><aside class="sf-optimization-reminder" aria-labelledby="sf-optimization-reminder-title"><h2 id="sf-optimization-reminder-title"><strong>Maximiser = dérivée égale à zéro</strong></h2><p>Dans ce cours, dès qu’on demande de résoudre un problème d’optimisation, vous pouvez simplement prendre la dérivée de la fonction à optimiser. Cette dérivée, quand elle est égale à zéro, vous donnera les valeurs <em>choisies</em> qui maximisent cette fonction.</p></aside></div>`});
  G.on('s1-prix',(el,ctx)=>{
    const trigger=el.querySelector('.sf-convex-trigger'), bubble=el.querySelector('.sf-convex-definition');
    el.classList.toggle('sf-prices-static',ctx.static);
    const setOpen=open=>{bubble.hidden=!open;trigger.setAttribute('aria-expanded',String(open));};
    setOpen(ctx.static);
    trigger.onclick=e=>{e.stopPropagation();if(!ctx.static)setOpen(bubble.hidden);};
    el.querySelector('.sf-convex-close').onclick=e=>{e.stopPropagation();setOpen(false);trigger.focus();};
    el.onkeydown=e=>{if(e.key==='Escape'&&!ctx.static&&!bubble.hidden){e.preventDefault();e.stopPropagation();setOpen(false);trigger.focus();}};
  });

  
  add(18,{id:'s1-parts',title:'Une stabilité relative des parts factorielles',prov:'obs',source:`${pwt}. France et États-Unis, 1950 à 2023. Travail : labsh. Capital : ${m('1 − labsh')}.`,html:`<p class="sf-parts-intro"><strong>Une régularité empirique à connaître :</strong> les parts du capital et du travail dans la production ont très peu varié au cours du temps → Justification pour un ${m('α')} constant.</p><div class="sf-two"><div><h2 class="sf-part-head">Part du capital</h2>${G.chart('sf-capital-chart',400)}</div><div><h2 class="sf-part-head">Part du travail</h2>${G.chart('sf-labor-chart',400)}</div></div><p class="sf-parts-note">1950 → 2023 : part du travail <strong>−6,48 points en France</strong> et <strong>−6,01 aux États-Unis</strong>.<br>Moyennes de la part du capital : 33,15 % en France. 38,33 % aux États-Unis. Repères théoriques : ${m('2/3')} et ${m('1/3')}.</p>`});
  G.on('s1-parts',(el,ctx)=>{
    const rows=G.DATA.parts;
    const countries=[['FRA','France',blue],['USA','États-Unis',orange]];
    const x={min:1950,max:2023,ticks:[1950,1970,1990,2010,2023],format:String};
    [['sf-labor-chart','labsh',200/3],['sf-capital-chart','capital_share',100/3]].forEach(([id,key,ref])=>{
      line(id,{x,y:{min:0,max:100,ticks:[0,20,40,60,80,100],format:y=>fmt(y,0)+' %'},yTitle:'Part du PIB, %',xTitle:'Année',legend:false,ends:false,labelGap:24,margin:{l:78,r:142,t:62,b:74},refLines:[{y:ref,color:grey,dash:'4 6'}],series:countries.map(([iso,name,color])=>({name,endLabel:name,endDy:(key==='labsh'?(iso==='FRA'?-12:12):(iso==='FRA'?12:-12)),color,dash:iso==='USA'?'8 5':null,data:rows.filter(r=>r.countrycode===iso).map(r=>[r.year,100*r[key]]),format:y=>fmt(y,2)+' %'}))},ctx);
    });
  });

  
  add(19,{id:'s1-accumulation',title:'Comment le capital s’accumule',html:`<div class="sf-acc-law" aria-label="Loi d’accumulation du capital">
    <span class="sf-acc-term"><span class="sf-acc-symbol g-math">${dot('K')}</span><span class="sf-acc-explanation">Variation instantanée<br>du capital</span></span><span class="sf-acc-sign g-math">=</span>
    <span class="sf-acc-term"><span class="sf-acc-symbol g-math">I</span><span class="sf-acc-explanation">Investissement<br>brut</span></span><span class="sf-acc-sign g-math">−</span>
    <span class="sf-acc-term"><span class="sf-acc-symbol g-math">δK</span><span class="sf-acc-explanation">Dépréciation<br>du capital</span></span><span class="sf-acc-sign g-math">=</span>
    <span class="sf-acc-term"><span class="sf-acc-symbol g-math">sY</span><span class="sf-acc-explanation">Part de la production<br>investie</span></span><span class="sf-acc-sign g-math">−</span>
    <span class="sf-acc-term"><span class="sf-acc-symbol g-math">δK</span><span class="sf-acc-explanation">Dépréciation<br>du capital</span></span>
  </div><div class="sf-two sf-stock-defs"><div><h2 class="sf-head">Un stock à un instant donné</h2><p>${m('K')} : capital disponible</p><p class="sf-sub">Machines, bâtiments, logiciels</p></div><div><h2 class="sf-head">Des flux par unité de temps</h2><p data-step="1">${m('I = sY')} : investissement</p><p data-step="2">${m('δK')} : dépréciation</p><p data-step="3">${m(dot('K'))} : variation nette du capital</p></div></div>${show(4,`<div class="sf-two"><div>${eq(`${v('sY')} &gt; δ${v('K')} ⇒ ${dot('K')} &gt; 0`)}</div><div>${eq(`${v('sY')} &lt; δ${v('K')} ⇒ ${dot('K')} &lt; 0`)}</div></div>`)}<p class="sf-flow-example">Un investissement positif ne suffit pas : il doit dépasser la dépréciation.</p>`});

  
  add(20,{id:'s1-ordres-grandeur',title:'Épargne et dépréciation : quels ordres de grandeur ?',prov:'obs',source:`${pwt}. Année : 2022. Investissement : csh_i, prix PPA courants. Dépréciation : delta.`,html:`<div class="sf-data-grid"><div><h2 class="sf-head">Investissement / PIB</h2><p class="sf-sub">Un ordre de grandeur pour ${v('s')}</p><div class="sf-invest-values">${[['CHN','Chine'],['FRA','France'],['USA','États-Unis'],['NER','Niger']].map(([iso,label])=>`<div><span>${label}, 2022</span><strong id="sf-si-${iso}"></strong></div>`).join('')}</div></div><div data-step="1"><h2 class="sf-head">Taux de dépréciation du capital</h2><p class="sf-sub">Un ordre de grandeur pour ${m('δ')}</p><div class="sf-median" id="sf-delta-median"></div><p class="sf-median-caption">Médiane internationale en 2022<br><span id="sf-delta-count"></span></p><p class="sf-sub">Une moyenne d’actifs aux durées de vie différentes.</p></div></div>${show(2,'<p class="sf-key">Une mesure statistique ne coïncide pas automatiquement avec le paramètre du modèle.</p>')}`});
  G.on('s1-ordres-grandeur',(el)=>{
    const D=G.DATA;
    ['CHN','FRA','USA','NER'].forEach(iso=>{el.querySelector('#sf-si-'+iso).textContent=fmt(100*D.investissement2022[iso],1)+' %';});
    el.querySelector('#sf-delta-median').textContent=fmt(100*D.depreciation2022.median,1)+' %';
    el.querySelector('#sf-delta-count').textContent=D.depreciation2022.count+' pays disposant d’une observation';
  });

  
  add(21,{id:'s1-exogenes',title:'La population active et la PGF progressent',prov:'sim',html:G.cols(`<div class="g-col">${eq(`${dot('L')} = ${v('nL')} &nbsp; ⇒ &nbsp; ${f(dot('L'),v('L'))} = ${v('n')}`)}${eq(`${dot('A')} = γ${v('A')} &nbsp; ⇒ &nbsp; ${f(dot('A'),v('A'))} = γ`,1)}${show(2,'<p class="sf-key">Exogène : donné au modèle</p><p class="sf-sub">Un taux constant n’implique pas un niveau constant.</p>')}<p class="sf-sub">Dans le modèle, le travail offert est employé.<br>${m('L/N')} constant ⇒ croissance de ${m('N')} égale à ${m('n')}.</p></div>`,`${G.chart('sf-exogenous-chart',460)}<p class="sf-sub">Indices initiaux ${m('= 1')}. Paramètres : ${m('n = 0,5 %')}, ${m('γ = 1 %')} par an</p>`)});
  G.on('s1-exogenes',(el,ctx)=>{
    const series=[{name:'Travail L',color:blue,endLabel:'L',data:samples(t=>Math.exp(.005*t),100),format:y=>fmt(y,2)}];
    if(ctx.static||ctx.step>=1)series.push({name:'PGF A',color:orange,dash:'7 5',endLabel:'A',data:samples(t=>Math.exp(.01*t),100),format:y=>fmt(y,2)});
    line('sf-exogenous-chart',{x:{min:0,max:100,ticks:[0,25,50,75,100]},y:{min:1,max:3,ticks:[1,1.5,2,2.5,3],format:y=>fmt(y,1)},xTitle:'Années écoulées',yTitle:'Indice initial = 1',series},ctx);
  });

  
  add(22,{id:'s1-taux',title:'Des niveaux aux taux de croissance',html:`<div class="sf-rate-lines">${eq(`${f(dot('x'),v('x'))} = ${f('d ln '+v('x'),'dt')} &nbsp;&nbsp; (${v('x')} &gt; 0)`)}${eq(`ln ${v('Y')} = ln ${v('A')} + α ln ${v('K')} + (1−α) ln ${v('L')}`,1)}<div class="sf-growth-final" data-step="2">${eq(`${f(dot('Y'),v('Y'))} = ${f(dot('A'),v('A'))} + α ${f(dot('K'),v('K'))} + (1−α) ${f(dot('L'),v('L'))}`)}${eq(`${f(dot('Y'),v('Y'))} = γ + α ${f(dot('K'),v('K'))} + (1−α)${v('n')}`,3)}</div></div>`});
})();
