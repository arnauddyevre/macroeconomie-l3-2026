/* Fin du chapitre 1, partie 5 — 1er novembre 2026.
 * Données OWID déjà archivées le 22 octobre 2026. Aucun rafraîchissement.
 * Charger après revision.js et psid_croissance.js, avant reorganisation.js.
 * Les parties 1 à 3, les identités, définitions et exercices sont inchangés.
 */
(function () {
  'use strict';
  const CH = window.Charts, Deck = window.Deck;
  const START = 2005, END = 2023;
  const measures = ['gdp', 'production', 'consumption'];
  const developed = [['DEU', 'Allemagne'], ['USA', 'États-Unis'], ['SWE', 'Suède'], ['FIN', 'Finlande'], ['DNK', 'Danemark'], ['JPN', 'Japon']];
  const emerging = [
    {code:'CHN', name:'Chine', color:'#001F5F', dash:null},
    {code:'IND', name:'Inde', color:'#B45309', dash:'9 5'},
    {code:'BRA', name:'Brésil', color:'#526780', dash:'2 5'}
  ];
  const byId = id => window.SLIDES.find(s => s.id === id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pct = (value, digits=1) => (value > 0 ? '+' : '') + CH.fmt(value, digits) + '\u202f%';
  const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const source = perCapita => `${link('https://ourworldindata.org/grapher/co2-emissions-and-gdp'+(perCapita?'-per-capita':''), 'OWID')} · PIB réel : WDI 2026, PPA constantes de 2021. CO₂ : Global Carbon Budget 2025, fossile et industriel, hors changement d’usage des terres. 2005–2023.`;
  const canAnimate = ctx => !(ctx.print || ctx.reading || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function annotate(id, text) { window.NOTES[id] = (window.NOTES[id] || '') + `<p>1er novembre 2026 : ${text}</p>`; }
  function styleSlide(s) { s.cls = [s.cls, 'fin-climat'].filter(Boolean).join(' '); }
  function rowsFor(key, code) {
    const rows = window.REVISION_DATA[key].rows.filter(r => r.code === code && r.year >= START && r.year <= END).sort((a,b) => a.year-b.year);
    if (rows.length !== END-START+1 || rows.some((r,i) => r.year !== START+i || measures.some(k => !Number.isFinite(r[k]) || r[k] <= 0))) throw new Error(`Série climatique incomplète : ${key}/${code}`);
    return rows;
  }
  function indexed(key, code) {
    const rows = rowsFor(key, code), base = rows[0];
    return rows.map(r => ({year:r.year, ...Object.fromEntries(measures.map(k => [k, 100*r[k]/base[k]]))}));
  }
  const developedData = Object.fromEntries(['decouplingTotal','decouplingPerCapita'].map(key => [key,
    Object.fromEntries(developed.map(([code]) => [code, indexed(key, code)]))]));
  const emergingData = Object.fromEntries(emerging.map(c => [c.code, indexed('decouplingTotal', c.code)]));

  // Repère biographique ajouté le 1er novembre 2026. Ordre déclaré dans reorganisation.js.
  const nordhausWiki='https://en.wikipedia.org/wiki/William_Nordhaus';
  const nordhausYale='https://news.yale.edu/2026/10/31/william-nordhaus-nobel-laureate-who-integrated-economics-and-climate-change-devoted-yale';
  const nordhausCepr='https://cepr.org/voxeu/columns/william-nordhaus-and-costs-climate-change';
  const nordhausPhoto='https://commons.wikimedia.org/wiki/File:William_Nordhaus_EM1B6043_%2846234132921%29.jpg';
  window.SLIDES.push({
    id:'nordhaus',part:'Partie 5 · À quel coût ?',cls:'nordhaus-slide',
    title:'William Nordhaus (1941–2026)',prov:null,
    html:`<div class="nd-layout"><div class="nd-copy">
      <p class="nd-lead">Un pionnier de l’économie du climat</p>
      <ul>
        <li><strong>Une vie à Yale :</strong> économiste américain, professeur depuis 1967. Nobel d’économie 2018, partagé avec Paul Romer.</li>
        <li data-step="1"><strong>Au-delà du PIB :</strong> avec James Tobin (1972), prendre en compte les loisirs et l’environnement pour mesurer le bien-être.</li>
        <li data-step="2"><strong>Le modèle DICE :</strong> relier production, émissions de CO₂, climat et dommages économiques dans un même cadre.</li>
        <li data-step="3"><strong>Pour notre cours :</strong> comparer les coûts de décarbonation aux dommages évités, et comprendre l’intérêt d’un prix du carbone.</li>
      </ul>
    </div><figure class="nd-portrait">
      <img src="sources/nordhaus_2026-11-01/william_nordhaus_2018_bengt_nyman.jpg" width="2308" height="3462" alt="Portrait de William Nordhaus à Stockholm, en décembre 2018.">
      <figcaption><p class="nd-memorial">Décédé le 30 octobre 2026, à 85 ans.</p><p class="nd-credit">${link(nordhausPhoto,'Bengt Nyman, 2018 · Wikimedia Commons')}<br>${link('https://creativecommons.org/licenses/by/2.0/','CC BY 2.0')} · photographie non modifiée</p></figcaption>
    </figure></div>`,
    source:`${link(nordhausWiki,'Wikipédia')} · ${link(nordhausYale,'Yale News, 31 octobre 2026')} · ${link(nordhausCepr,'Kenneth Gillingham, VoxEU/CEPR, 19 octobre 2018')}.`
  });
  window.NOTES.nordhaus='<p>Ajout demandé par Arnaud le 1er novembre 2026, après les définitions du découplage. Faits vérifiés dans les trois pages fournies : naissance en 1941, carrière à Yale depuis 1967, prix 2018 partagé avec Paul Romer et décès le 30 octobre 2026 à 85 ans. Nordhaus est distingué pour l’intégration du changement climatique à la macroéconomie de long terme. Avec Tobin, Is Growth Obsolete? (1972) étend la mesure du progrès au bien-être.</p><p>DICE signifie Dynamic Integrated Climate-Economy. Le modèle relie activité économique, cycle du carbone, réchauffement et dommages, puis compare des trajectoires de réduction des émissions. Le coût social du carbone mesure les dommages d’une tonne supplémentaire de CO₂, actualisés. Les résultats dépendent notamment des hypothèses sur les dommages, l’actualisation et l’incertitude : ils éclairent les choix, sans les fixer à la place de la société.</p><p>Lien pédagogique proposé : l’identité comptable et le découplage décrivent l’évolution observée ; les modèles de Nordhaus permettent d’analyser les politiques et leurs conséquences. Aucun résultat numérique de DICE ni ancienne projection climatique n’est présenté comme une donnée ou un consensus actuel. Portrait exact de Wikipédia, Bengt Nyman, 2018, CC BY 2.0, sans recadrage.</p>';

  // Réorganiser uniquement les écrans de la partie 5, en conservant leurs données
  // et leurs éléments de graphique pour les moteurs existants.
  const world = byId('emissions-monde');
  if (world) {
    styleSlide(world);
    const template = document.createElement('template'); template.innerHTML = world.html;
    const chart = template.content.querySelector('#pj-em').outerHTML;
    const comparison = template.content.querySelector('[data-step="1"] p') || template.content.querySelector('[data-step="1"]');
    const fact = template.content.querySelector('.p-kpi');
    const rows = window.DATA.monde_co2, a = rows.find(r => r[0] === 1990), b = rows.find(r => r[0] === 2024);
    const intensity = (b[1]/a[1])/(b[2]/a[2])-1;
    world.title = 'Dans le monde, le PIB augmente plus vite que le CO₂';
    world.html = `<div class="fin-climat-layout"><div class="fin-climat-copy"><p class="fin-climat-lead">Un progrès de l’intensité en émissions</p><ul><li>${comparison.innerHTML}</li><li data-step="1">L’intensité en CO₂ a baissé de <strong>${CH.fmt(-100*intensity,0)} %</strong> depuis 1990.</li><li data-step="2">Le prochain objectif : réduire les <strong>émissions totales</strong> tout en augmentant le niveau de vie.</li></ul><p class="fin-climat-context">${fact.querySelector('.v').textContent} de CO₂ fossile dans le monde en 2024. Les émissions totales augmentent encore.</p></div><figure class="fin-climat-figure">${chart}</figure></div>`;
    annotate(world.id, 'Présentation positive de la baisse de l’intensité, sans masquer la hausse des émissions totales. Séries mondiales et périmètres conservés. Le budget carbone demeure documenté dans la note enseignante précédente. Ce graphique appartient exclusivement à la partie 5.');
  }
  const france = byId('fr-decouplage');
  if (france) {
    styleSlide(france);
    const template = document.createElement('template'); template.innerHTML = france.html;
    const chart = template.content.querySelector('#pj-dc').outerHTML;
    const comparison = template.content.querySelector('.p-grow > .p-txt').innerHTML;
    const kpi = template.content.querySelector('.p-kpi');
    france.title = 'En France, croissance et baisse des émissions vont ensemble';
    france.html = `<div class="fin-climat-layout"><div class="fin-climat-copy"><p class="fin-climat-lead">Un découplage absolu observé</p><ul><li>${comparison}</li><li data-step="1">${kpi.querySelector('.v').innerHTML} ${kpi.querySelector('.l').innerHTML}.</li></ul><p class="fin-climat-context">Produire davantage et réduire les émissions peuvent aller de pair.</p></div><figure class="fin-climat-figure">${chart}<figcaption>Gaz à effet de serre en CO₂e, hors usage des terres. 2025 provisoire.</figcaption></figure></div>`;
    annotate(france.id, 'Texte à gauche et graphique à droite. Données françaises, émissions en CO₂e hors UTCATF, période 1990–2025 et statut provisoire conservés. Le constat n’établit pas à lui seul la cause de la baisse.');
  }
  const footprint = byId('empreinte');
  if (footprint) {
    styleSlide(footprint);
    const template = document.createElement('template'); template.innerHTML = footprint.html;
    const chart = template.content.querySelector('#pj-emp').outerHTML;
    const copy = template.content.querySelector('.p-grow').innerHTML;
    footprint.title = 'L’empreinte carbone compte aussi les émissions importées';
    footprint.html = `<div class="fin-climat-layout"><div class="fin-climat-copy fin-climat-footprint">${copy}<p class="fin-climat-context">Un outil pour mesurer les émissions de notre consommation, où qu’elles soient produites.</p></div><figure class="fin-climat-figure">${chart}<figcaption>Ensemble des gaz à effet de serre, en CO₂e. Empreinte 2024 provisoire.</figcaption></figure></div>`;
    annotate(footprint.id, 'Texte à gauche et graphique à droite. Définition de l’empreinte et séries françaises de CO₂e conservées. Elles portent sur tous les gaz à effet de serre et ne sont pas confondues avec les séries internationales de CO₂ fossile et industriel des écrans suivants.');
  }

  function addLineLegend(chart) {
    // Sous les trois séries : toutes restent au-dessus de 45 sur cette sélection.
    // La légende garde sa place lors du changement de pays et à l’impression.
    const x = chart.m.l + 17, bottom = +chart.svg.getAttribute('height') - chart.m.b - 13;
    const group = CH.el('g', {class:'fin-climat-inplot-legend','aria-label':'Légende des trois séries'}, chart.svg);
    [['PIB réel','#001F5F',null],['CO₂ territorial','#B45309',null],['CO₂ de consommation','#B45309','9 6']].forEach(([name,color,dash],i)=>{
      const y = bottom - 54 + i*27;
      CH.el('line',{x1:x,y1:y-7,x2:x+32,y2:y-7,stroke:color,'stroke-width':3,'stroke-dasharray':dash},group);
      const label = CH.el('text',{x:x+44,y,fill:color},group);label.textContent=name;
    });
  }
  const developedDrawers = [];
  function installDeveloped(id, key) {
    const s = byId(id), perCapita = key === 'decouplingPerCapita';
    if (!s) throw new Error(`Diapositive absente : ${id}`);
    s.cls = (s.cls || '').replace(/\brev-decoupling\b/g,'').trim(); styleSlide(s);
    s.title = perCapita ? 'Par habitant aussi, produire plus et émettre moins' : 'Produire plus en émettant moins : six exemples';
    s.html = `<div class="fin-climat-layout"><div class="fin-climat-copy"><p class="fin-climat-lead">2005–2023 · ${perCapita?'par habitant':'grandeurs totales'}</p><ul><li>PIB réel : <strong data-climate-gdp></strong>.</li><li>CO₂ territorial : <strong data-climate-production></strong>.</li><li>CO₂ de consommation : <strong data-climate-consumption></strong>.</li></ul><p class="fin-climat-context">Ces six économies produisent davantage tout en émettant moins, y compris en tenant compte des échanges.</p><p class="fin-climat-small">Six exemples de découplage absolu. Cette sélection ne représente pas tous les pays.</p></div><figure class="fin-climat-figure"><div class="fin-climat-controls"><label>Pays <select data-climate-country data-keys aria-label="Choisir un des six pays">${developed.map(([code,name])=>`<option value="${code}">${name}</option>`).join('')}</select></label><span class="rev-decoupling-country"></span></div><div class="rev-interactive fin-climat-line"></div><figcaption>Base 100 en 2005. Consommation : émissions territoriales − exportées + importées.</figcaption></figure></div>`;
    s.source = source(perCapita); s.prov = 'obs';
    annotate(id, 'Période prolongée de 2005–2020 à 2005–2023 à partir des mêmes fichiers locaux. Les six économies restent des exemples de découplage absolu, territorial et de consommation, en total et par habitant. La capture de 2005–2020 reste la source historique du choix des pays, pas celle des nouveaux pourcentages. Impression : Allemagne, état complet sans animation.');
    let current = 'DEU';
    function draw(ctx={}) {
      const root = Deck.slideEl(id); if (!root) return;
      if (!ctx.print && ((!root.classList.contains('is-active') && !document.body.classList.contains('reading')) || root.clientWidth === 0)) return;
      const code = ctx.print ? 'DEU' : current, rows = developedData[key][code], last = rows[rows.length-1];
      root.querySelector('[data-climate-country]').value = code;
      root.querySelector('.rev-decoupling-country').textContent = developed.find(c=>c[0]===code)[1];
      measures.forEach(k => { root.querySelector(`[data-climate-${k}]`).textContent = pct(last[k]-100); });
      const host = root.querySelector('.rev-interactive'), box = window.PJ.zoom(host,1.12);
      const maximum = Math.ceil(Math.max(120,...rows.flatMap(r=>measures.map(k=>r[k])))/20)*20;
      const chart = CH.line(box, {height:box.clientHeight, animate:canAnimate(ctx), duration:1.6, stagger:.15, ends:true, labelGap:29, legend:false, hover:!ctx.print,
        aria:`${developed.find(c=>c[0]===code)[1]}, PIB et CO₂ ${perCapita?'par habitant':'totaux'}, 2005 à 2023, base 100 en 2005`,
        x:{min:START,max:END,ticks:[2005,2010,2015,2020,2023]},y:{min:0,max:maximum}, yTitle:'Indice, 2005 = 100',margin:{l:59,r:81,t:62,b:54},
        refLines:[{y:100,color:'#A6ACB5',dash:'3 6'}],
        series:[['gdp','PIB réel','#001F5F',false],['production','CO₂ territorial','#B45309',false],['consumption','CO₂ de consommation','#B45309','9 6']].map(([k,name,color,dash])=>({name,color,dash,data:rows.map(r=>[r.year,r[k]]),format:v=>CH.fmt(v,1)}))
      });
      addLineLegend(chart);
      host.dataset.lastYear = String(END); host.dataset.country = code;
    }
    Deck.on(id,{enter(el,ctx){
      const select = el.querySelector('[data-climate-country]');
      if (!select.dataset.bound) { select.dataset.bound='true'; select.addEventListener('change',e=>{current=e.target.value;draw({reading:document.body.classList.contains('reading')});}); }
      draw(ctx);
    }});
    developedDrawers.push(draw);
  }
  installDeveloped('decouplage-monde','decouplingTotal');
  installDeveloped('decouplage-habitant','decouplingPerCapita');

  const id = 'decouplage-emergents';
  window.SLIDES.push({id,part:'Partie 5 · À quel coût ?',cls:'fin-climat',prov:'obs',
    title:'Chine, Inde, Brésil : moins de CO₂ par unité produite',
    html:`<div class="fin-climat-layout"><div class="fin-climat-copy"><p class="fin-climat-lead">Une baisse de l’intensité en CO₂</p><ul><li>Sur 2005–2023 : <strong data-climate-intensities></strong>.</li><li><strong>Découplage relatif :</strong> le CO₂ augmente moins que le PIB. Entre la diagonale et la ligne zéro.</li><li><strong>Découplage absolu :</strong> les émissions baissent. Sous la ligne zéro.</li></ul><p class="fin-climat-context">Dans les trois pays, les émissions totales augmentent encore sur cette période.</p></div><figure class="fin-climat-figure"><div class="fin-climat-controls"><label>CO₂ <select data-climate-measure data-keys aria-label="Périmètre des émissions de CO₂"><option value="production">Territorial</option><option value="consumption">De consommation</option></select></label><button type="button" data-climate-play data-keys>Rejouer 2005–2023</button></div><div class="fin-climat-timeline"><label>Année <input type="range" min="2005" max="2023" value="2023" step="1" data-climate-year data-keys aria-label="Année des trajectoires depuis 2005"></label><output data-climate-year-label>2023</output></div><div class="fin-climat-scatter" data-climate-scatter></div><figcaption>Variations cumulées depuis 2005. Diagonale : même croissance du PIB et du CO₂. Survolez les points annuels ou utilisez le curseur.</figcaption></figure></div>`,
    source:source(false)
  });
  annotate(id, 'Ajout demandé par Arnaud. Trajectoires annuelles 2005–2023, PIB réel en abscisse et CO₂ total en ordonnée, en variations cumulées depuis 2005. Les 19 observations de chaque pays sont présentes dans les fichiers locaux. Pour une hausse du PIB : 0 &lt; croissance du CO₂ &lt; croissance du PIB signifie un découplage relatif, croissance du CO₂ &lt; 0 un découplage absolu. À zéro, émissions stables. Aucun des trois pays ne présente un découplage absolu sur toute cette période, dans aucun des deux périmètres. CO₂ fossile et industriel uniquement, hors usages des terres et déforestation. Les trajectoires décrivent des évolutions, pas un effet causal identifié de la croissance. Impression : état 2023 complet dans le périmètre choisi.');

  let metric = 'production', year = END, raf = 0, view = null, printSaved = null;
  function stop() {
    if (raf) cancelAnimationFrame(raf); raf=0;
    const button = Deck.slideEl(id)?.querySelector('[data-climate-play]');
    if (button) {button.textContent='Rejouer 2005–2023';button.setAttribute('aria-pressed','false');}
  }
  function point(country, at) {
    const r = emergingData[country.code][at-START];
    const early = at < 2010;
    return {...country,key:country.code,x:r.gdp-100,y:r[metric]-100,year:at,hl:true,label:country.name,
      dx:early?15:country.code==='CHN'?-12:14,dy:early?{CHN:-73,IND:-40,BRA:-7}[country.code]:-16,anchor:!early&&country.code==='CHN'?'end':'start'};
  }
  function tip(point) {
    const ratio = (1+point.y/100)/(1+point.x/100)-1;
    return `<b>${esc(point.name)} · ${point.year}</b><br>PIB réel : ${pct(point.x)}<br>CO₂ ${metric==='production'?'territorial':'de consommation'} : ${pct(point.y)}<br>Intensité : ${pct(100*ratio)}`;
  }
  function showTip(p, circle) {
    if (!view) return;
    const box = view.box, t = box.querySelector('.ch-tip'), scale = view.chart.svg.getBoundingClientRect().width / Number(view.chart.svg.getAttribute('width'));
    t.innerHTML = tip(p); t.style.left = `${view.chart.S.X(p.x)*scale}px`; t.style.top = `${(view.chart.S.Y(p.y)-10)*scale}px`; t.classList.add('on');
    if (circle) circle.classList.add('fin-climat-focused');
  }
  function hideTip(circle) {
    view?.box.querySelector('.ch-tip')?.classList.remove('on');
    circle?.classList.remove('fin-climat-focused');
  }
  function spaceCountryLabels(svg) {
    const labels=[...svg.querySelectorAll('text[data-k]')];
    // Aux premières années les trajectoires sont proches : écarter les noms
    // vers le haut, sans les faire passer dans la zone de baisse des émissions.
    for(let pass=0;pass<12;pass++){
      let moved=false;
      for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
        const a=labels[i].getBBox(),b=labels[j].getBBox();
        if(a.x>b.x+b.width+5||b.x>a.x+a.width+5||a.y>b.y+b.height+5||b.y>a.y+a.height+5)continue;
        const upper=a.y<=b.y?labels[i]:labels[j],u=a.y<=b.y?a:b,l=a.y<=b.y?b:a;
        upper.setAttribute('y',+upper.getAttribute('y')-(u.y+u.height+6-l.y));moved=true;
      }
      if(!moved)break;
    }
  }
  function setYear(at) {
    year = Math.max(START,Math.min(END,Math.round(at)));
    if (!view) return;
    const {root,chart,trails,dots} = view;
    root.querySelector('[data-climate-year]').value = String(year);
    root.querySelector('[data-climate-year-label]').textContent = String(year);
    root.querySelector('[data-climate-scatter]').dataset.year = String(year);
    chart.update(emerging.map(c=>point(c,year)));
    spaceCountryLabels(chart.svg);
    dots.replaceChildren();
    emerging.forEach((c,i)=>{
      const points = emergingData[c.code].filter(r=>r.year<=year).map(r=>point(c,r.year));
      trails[i].setAttribute('d',points.map((p,j)=>`${j?'L':'M'}${chart.S.X(p.x)},${chart.S.Y(p.y)}`).join(' '));
      const p=points[points.length-1],label=chart.svg.querySelector(`text[data-k="${c.code}"]`),labelY=+label.getAttribute('y');
      if(Math.abs(labelY-chart.S.Y(p.y))>28){
        const x=chart.S.X(p.x),y=chart.S.Y(p.y),side=p.anchor==='end'?-1:1;
        CH.el('line',{x1:x+4*side,y1:y-5,x2:+label.getAttribute('x')-3*side,y2:labelY+4,stroke:c.color,'stroke-width':1.2,opacity:.65,'pointer-events':'none'},dots);
      }
      points.slice(1,-1).forEach(p=>{
        const dot = CH.el('circle',{cx:chart.S.X(p.x),cy:chart.S.Y(p.y),r:7,fill:'transparent','pointer-events':'all','aria-hidden':'true'},dots);
        dot.addEventListener('pointerenter',()=>showTip(p));dot.addEventListener('pointerleave',()=>hideTip());
      });
      const endpoint = chart.svg.querySelector(`circle[data-k="${c.code}"]`);
      endpoint.setAttribute('tabindex','0'); endpoint.setAttribute('data-keys','');
      endpoint.setAttribute('role','img'); endpoint.setAttribute('aria-label',`${c.name}, ${year}. PIB ${pct(points[points.length-1].x)}. CO₂ ${pct(points[points.length-1].y)}.`);
    });
  }
  function drawEmerging(ctx={}) {
    const root=Deck.slideEl(id); if (!root) return;
    if (!ctx.print && ((!root.classList.contains('is-active') && !document.body.classList.contains('reading')) || root.clientWidth === 0)) return;
    const box=window.PJ.zoom(root.querySelector('[data-climate-scatter]'),1.08);
    root.querySelector('[data-climate-measure]').value=metric;
    root.querySelector('[data-climate-intensities]').textContent=emerging.map(c=>{
      const r=emergingData[c.code][END-START];return `${c.name} ${pct((r[metric]/r.gdp-1)*100,0)}`;
    }).join(', ');
    const chart=CH.scatter(box,{height:box.clientHeight,animate:false,
      aria:'Chine, Inde et Brésil : trajectoires de croissance du PIB réel et du CO₂ depuis 2005.',
      x:{min:0,max:320,ticks:[0,100,200,300]},y:{min:-60,max:320,ticks:[-50,0,100,200,300]},
      margin:{l:61,r:24,t:51,b:70},yTitle:'CO₂ : variation depuis 2005 (%)',xTitle:'PIB réel : variation depuis 2005 (%)',
      radius:()=>7,tip,points:emerging.map(c=>point(c,ctx.print?END:year))});
    const firstGroup=chart.svg.querySelector('g'), zones=CH.el('g',{'pointer-events':'none','aria-hidden':'true'});
    chart.svg.insertBefore(zones,firstGroup);
    const {X,Y}=chart.S;
    CH.el('rect',{x:X(0),y:Y(0),width:X(320)-X(0),height:Y(-60)-Y(0),fill:'#EAF0F6'},zones);
    CH.el('path',{d:`M${X(0)},${Y(0)}L${X(320)},${Y(0)}L${X(320)},${Y(320)}Z`,fill:'#F5F6F8'},zones);
    CH.el('line',{x1:X(0),y1:Y(0),x2:X(320),y2:Y(320),stroke:'#8A9BA8','stroke-width':1.8,'stroke-dasharray':'5 5'},zones);
    CH.el('line',{x1:X(0),y1:Y(0),x2:X(320),y2:Y(0),stroke:'#000','stroke-width':1.5,class:'fin-climat-zero'},zones);
    [['Découplage relatif',46],['Découplage absolu',-37]].forEach(([label,y])=>{
      const text=CH.el('text',{x:X(311),y:Y(y),'text-anchor':'end',class:'fin-climat-zone-label'},zones);text.textContent=label;
    });
    const trajectoryLayer=CH.el('g',{'aria-hidden':'true'}), pointLayer=chart.svg.querySelector('circle[data-k]').parentNode;
    chart.svg.insertBefore(trajectoryLayer,pointLayer);
    const trails=emerging.map(c=>CH.el('path',{fill:'none',stroke:c.color,'stroke-width':2.5,'stroke-dasharray':c.dash,class:'fin-climat-trajectory'},trajectoryLayer));
    const dots=CH.el('g',{},trajectoryLayer);
    view={root,box,chart,trails,dots};
    emerging.forEach(c=>{
      const endpoint=chart.svg.querySelector(`circle[data-k="${c.code}"]`);
      endpoint.addEventListener('focus',()=>showTip(point(c,year),endpoint));
      endpoint.addEventListener('blur',()=>hideTip(endpoint));
      endpoint.addEventListener('keydown',e=>{
        if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();stop();setYear(year+(e.key==='ArrowRight'?1:-1));showTip(point(c,year),endpoint);}
        if(e.key==='Escape'){e.stopPropagation();hideTip(endpoint);endpoint.blur();}
      });
    });
    setYear(ctx.print?END:year);
  }
  function play() {
    if(raf){stop();return;}
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setYear(END);return;}
    setYear(START);
    const button=Deck.slideEl(id).querySelector('[data-climate-play]');button.textContent='Pause';button.setAttribute('aria-pressed','true');
    const beginning=performance.now();
    function frame(now){
      const next=START+Math.min(END-START,Math.floor((now-beginning)/250));
      if(next!==year)setYear(next);
      if(next<END)raf=requestAnimationFrame(frame);else stop();
    }
    raf=requestAnimationFrame(frame);
  }
  Deck.on(id,{enter(el,ctx){
    stop();
    if(!el.dataset.climateBound){
      el.dataset.climateBound='true';
      el.querySelector('[data-climate-measure]').addEventListener('change',e=>{stop();metric=e.target.value;drawEmerging();});
      el.querySelector('[data-climate-year]').addEventListener('input',e=>{stop();setYear(+e.target.value);});
      el.querySelector('[data-climate-play]').addEventListener('click',play);
    }
    if(ctx.print||ctx.reading)year=END;
    drawEmerging(ctx);
  },leave(){stop();}});

  // Les anciens listeners d’impression de revision.js dessinent encore 2020.
  // Enregistrés plus tard, ces listeners restaurent systématiquement 2023.
  // Les classes de compatibilité empêchent les anciens listeners de lever une erreur.
  window.addEventListener('beforeprint',()=>{
    printSaved={year,metric};stop();developedDrawers.forEach(draw=>draw({print:true}));drawEmerging({print:true});
  });
  window.addEventListener('afterprint',()=>{
    developedDrawers.forEach(draw=>draw({reading:document.body.classList.contains('reading')}));
    if(printSaved){year=printSaved.year;metric=printSaved.metric;printSaved=null;}
    drawEmerging({reading:document.body.classList.contains('reading')});
  });
  window.FIN_CLIMAT={start:START,end:END,ids:['emissions-monde','fr-decouplage','empreinte','decouplage-monde','decouplage-habitant',id],developedData,emergingData};
})();
