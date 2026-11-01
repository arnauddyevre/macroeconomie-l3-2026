/* Trois facteurs du PIB par habitant, PWT 11.0, France et États-Unis, 1950–2023.
 * Source et calculs reproductibles : sources/long_terme_2026-11-01/.
 * Remplace les deux panneaux historiques Y/H et H/N sans raccorder les bases. */
(function () {
  'use strict';
  const data = window.LONG_TERME_DATA, Charts = window.Charts;
  const slide = window.SLIDES.find(s => s.id === 'long-terme');
  if (!data || !slide) throw new Error('Données ou diapositive du long terme absentes.');
  const panels = [
    {key:'p', ratio:'Y/H', title:'Productivité horaire', unit:'Dollars internationaux de 2021<br>Échelle logarithmique', y:{log:true,min:5,max:100,ticks:[5,10,20,50,100]}, digits:1, suffix:' dollars par heure'},
    {key:'h', ratio:'H/L', title:'Heures par personne en emploi', unit:'Heures travaillées par an', y:{min:0,max:3000,ticks:[0,1000,2000,3000]}, digits:0, suffix:' heures par an'},
    {key:'e', ratio:'L/N', title:'Part de la population en emploi', unit:'% de la population totale<br>Enfants et retraités compris', y:{min:0,max:60,ticks:[0,20,40,60]}, digits:1, suffix:' %'}
  ];
  const countries = data.countries.map((country,i) => ({...country,color:i===0?'#001F5F':'#738095',dash:i===0?false:'8 6'}));
  slide.title = 'Depuis 1950, chaque heure produit plus et l’on travaille moins';
  slide.cls = [slide.cls,'lt-three-factors'].filter(Boolean).join(' ');
  slide.html = `<figure class="lt-figure">
    <div class="lt-meta"><div class="lt-legend"><span><i class="lt-france"></i>France</span><span><i class="lt-usa"></i>États-Unis</span></div><span>1950–2023</span></div>
    <div class="lt-panels">${panels.map(p=>`<section class="lt-panel"><h3><span class="lt-ratio">${p.ratio}</span> ${p.title}</h3><p class="lt-unit">${p.unit}</p><div class="lt-chart" data-factor="${p.key}"></div></section>`).join('')}</div>
    <figcaption><var>Y</var>/<var>N</var> = <var>Y</var>/<var>H</var> × <var>H</var>/<var>L</var> × <var>L</var>/<var>N</var></figcaption>
  </figure>`;
  slide.source = '<a href="https://www.rug.nl/ggdc/productivity/pwt/" target="_blank" rel="noopener noreferrer">Penn World Table 11.0</a> · France et États-Unis, 1950–2023 · PIB réel : ancrage PPA de 2021.';
  window.NOTES['long-terme'] = '<p>1er novembre 2026 : à la demande d’Arnaud, trois graphiques reprennent les facteurs de l’exercice de décomposition. Les deux panneaux précédents utilisaient Bergeaud, Cette et Lecat, Long-Term Productivity Database v2.7, 1890–2024 : Y/H et H/N (heures par habitant), et non H/L. Cette base ne contient pas l’emploi nécessaire à la séparation. Les trois séries sont remplacées ensemble par PWT 11.0, France et États-Unis, 1950–2023, sans raccord de sources.</p><p>Y = rgdpna, PIB réel aux prix nationaux constants avec ancrage PPA de 2021 ; N = pop, population totale ; L = emp, personnes engagées dans l’emploi ; H = emp × avh. Les graphiques montrent Y/H = rgdpna/(emp × avh), H/L = avh et 100 × L/N = 100 × emp/pop. Les 148 observations sont complètes, sans imputation. Le troisième panneau exprime L/N en pourcentage ; le facteur de l’identité est le rapport brut, donc la valeur affichée divisée par 100.</p><p>La productivité horaire augmente et les heures annuelles par personne en emploi diminuent sur l’ensemble de la période. La part de la population en emploi ne suit pas une baisse régulière ; elle dépend notamment de la structure démographique et de la participation au marché du travail. Elle n’est ni le taux d’emploi des 15–64 ans, ni un taux d’activité, ni le complément du taux de chômage. La décomposition est comptable, sans interprétation causale automatique. La comparaison des niveaux internationaux et des heures reste soumise aux conventions statistiques. L’axe de productivité est logarithmique ; les deux autres sont linéaires.</p><p>Source pédagogique : diapositive long-terme du support d’Antonin, adaptée dans le chapitre 1. Source statistique unique : classeur PWT 11.0 déjà archivé pour l’exercice. Provenance, calculs et vérification : sources/long_terme_2026-11-01/README.md. Les trois panneaux sont simultanément visibles, consultables au survol et au clavier ; l’impression restitue toutes les courbes.</p>';
  function draw(element, ctx = {}) {
    const animate = !(ctx.reading || ctx.print || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    panels.forEach(panel => {
      const host = element.querySelector(`[data-factor="${panel.key}"]`);
      const box = window.PJ.zoom(host,1.1);
      const format = value => Charts.fmt(value,panel.digits) + panel.suffix;
      Charts.line(box,{
        height:box.clientHeight,animate,duration:1.6,stagger:.2,hover:!ctx.print,legend:false,ends:false,
        aria:`${panel.ratio}, ${panel.title}, France et États-Unis, 1950–2023. ${panel.unit.replace(/<br>/g,', ')}.`,
        x:{min:data.start,max:data.end,ticks:[1950,1975,2000,2023]},y:{...panel.y},
        margin:{l:panel.key==='h'?66:48,r:28,t:18,b:48},
        series:countries.map(country=>({name:country.name,color:country.color,dash:country.dash,gaps:1.5,data:country.rows.map(row=>[row.year,row[panel.key]]),format}))
      });
      box.setAttribute('aria-label',`${panel.title}. Flèches gauche et droite pour consulter les valeurs annuelles.`);
    });
  }
  // Remplacer aussi l’ancien gestionnaire d’étapes, qui dessinait H/N au premier clic.
  window.Deck.on('long-terme',{enter:draw,step(){}});
  window.addEventListener('beforeprint',()=>{
    const el=window.Deck.slideEl('long-terme'); if(el) draw(el,{print:true});
  });
  window.addEventListener('afterprint',()=>{
    const el=window.Deck.slideEl('long-terme'); if(el) draw(el,{reading:document.body.classList.contains('reading')});
  });
})();
