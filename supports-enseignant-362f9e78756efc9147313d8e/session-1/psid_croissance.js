/* Incidence de la croissance : exemple fictif puis PSID, Etats-Unis.
 * Donnees : data/psid_croissance_data.js. Aucun changement du moteur Charts.
 * Charger avant reorganisation.js ; l'ordre est declare dans ce dernier. */
(function () {
  'use strict';
  const Charts=window.Charts, data=window.PSID_CROISSANCE_DATA;
  if(!data) throw new Error('Donnees PSID de croissance absentes.');
  const NAVY='#001F5F',ORANGE='#B45309';
  const fmt=(x,n=1)=>Charts.fmt(x,n);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const part='Partie 4 · Pour qui ?';
  const legend=''; // Les deux libellés sont intégrés dans le SVG.
  const people=[
    {id:'A',start:10000,end:24000},
    {id:'B',start:20000,end:18000},
    {id:'C',start:30000,end:36000},
    {id:'D',start:40000,end:42000}
  ];
  const ranked=people.slice().sort((a,b)=>a.end-b.end);
  const exampleValues=unit=>({
    anonymous:people.map((person,i)=>unit==='percent'?100*(ranked[i].end/person.start-1):ranked[i].end-person.start),
    nonAnonymous:people.map(person=>unit==='percent'?100*(person.end/person.start-1):person.end-person.start)
  });
  const personColumn=(atEnd)=>`<div class="psid-example-column"><h3>${atEnd?'<span data-example-arrival-title>Arrivée : mêmes personnes</span>':'Départ : ordre des revenus'}</h3><div class="psid-example-people${atEnd?' psid-example-arrival':''}">${people.map((person,i)=>`<div class="psid-example-person" data-person="${person.id}" style="--psid-row:${i}"><span>${person.id}</span><strong>${fmt(atEnd?person.end:person.start,0)} €</strong></div>`).join('')}</div></div>`;
  window.SLIDES.push({
    id:'croissance-rangs-exemple',title:'Point méthodologique : Même rang ou mêmes personnes, deux questions différentes',part,cls:'psid-slide psid-example-slide',prov:'fictif',
    html:`<div class="psid-layout"><div class="psid-copy"><p class="psid-lead"><strong>Exemple :</strong> calculons la croissance du revenu pour chaque 25 % de la distribution de revenu : Quatre personnes, deux années consécutives et des changements de rang.</p><div class="psid-example-rankings">${personColumn(false)}${personColumn(true)}</div><button type="button" class="psid-button" data-example-sort data-keys>Reclasser à l’arrivée</button><ul><li><strong>Courbe de croissance non anonyme :</strong> suivre A, de 10 000 à 24 000 €.</li><li><strong>Courbe de croissance anonyme :</strong> comparer le premier rang, de 10 000 à 18 000 €. B remplace A.</li></ul><p class="psid-small">Exemple fictif. Même population et mêmes revenus dans les deux calculs.</p></div><figure class="psid-figure"><div class="psid-controls"><label>Variation <select data-example-unit data-keys aria-label="Unité de la variation dans l’exemple"><option value="percent">En pourcentage</option><option value="amount">En euros</option></select></label></div><p class="psid-axis-title" data-example-ytitle>Croissance du revenu sur un an (%)</p><div class="psid-chart" data-example-chart></div>${legend}<figcaption data-example-caption>Les mêmes personnes peuvent changer de place dans la distribution.</figcaption></figure></div>`,
    source:'Exemple fictif : revenus annuels en euros constants. Calculs à partir des quatre personnes représentées.'
  });
  window.NOTES['croissance-rangs-exemple']='<p>Ajout du 1er novembre 2026, à la demande d’Arnaud : illustration animée de la distinction anonyme/non anonyme avant les données américaines. Quatre personnes, chacune représentant un rang, et non quatre déciles. Revenus annuels fictifs en euros constants. Départ : A 10 000, B 20 000, C 30 000, D 40 000 ; arrivée : A 24 000, B 18 000, C 36 000, D 42 000. A et B échangent leurs rangs. Le bouton reclasse uniquement la colonne d’arrivée ; le graphique garde les deux définitions visibles.</p><p>Anonyme : les revenus classés à l’arrivée sont 18 000, 24 000, 36 000 et 42 000 ; variations de 80 %, 20 %, 20 %, 5 %, ou gains de 8 000, 4 000, 6 000, 2 000 euros. Non anonyme : mêmes personnes dans leur rang initial, variations de 140 %, −10 %, 20 %, 5 %, ou gains de 14 000, −2 000, 6 000, 2 000 euros. Les deux calculs utilisent le même total, qui passe de 100 000 à 120 000 euros. La moyenne simple des quatre taux individuels ou de rang ne mesure pas la croissance de ce total.</p><p>Les graphiques racontent deux faits distincts : l’évolution de la distribution et les trajectoires des personnes. Leur différence ne prouve pas une réduction des inégalités ; une hausse en pourcentage ne donne pas le même classement qu’un gain monétaire. L’exemple est une illustration de cours, pas une observation et pas un QCM. Le mode impression montre le reclassement final et les deux courbes.</p>';

  const periodKey=p=>`${p.start}-${p.end}`;
  const options=`<option value="summary">Moyenne des 12 intervalles</option>${data.periods.map(p=>`<option value="${periodKey(p)}">${p.start}–${p.end}</option>`).join('')}`;
  const baseYear=data.meta.realIncomeBaseYear;
  const unitLabel=baseYear?`Dollars constants de ${esc(baseYear)}`:'Revenus corrigés de l’inflation';
  window.SLIDES.push({
    id:'croissance-psid',title:'3. La <em>croissance</em> du PIB revient-elle aux riches ? Aux pauvres ?',part,cls:'psid-slide',prov:'obs',
    html:`<div class="psid-layout"><div class="psid-copy"><p class="psid-lead">Croissance distributionnelle dans les données :<br>États-Unis, Revenus du travail, 1998–2022</p><aside class="psid-warning" aria-labelledby="psid-warning-label"><div class="psid-warning-label" id="psid-warning-label">Avertissement</div><p class="psid-warning-lead">Les revenus du travail ne sont pas l’ensemble du PIB.</p><ul><li>Il faut aussi compter les <strong>revenus du capital</strong>, notamment les profits non distribués et les loyers imputés.</li><li><strong><a href="https://gabriel-zucman.eu/files/PSZ2018QJE.pdf" target="_blank" rel="noopener noreferrer">Piketty et al. (2018)</a></strong> proposent une approche anonyme du revenu national.</li><li>Je travaille sur l’équivalent <strong>non anonyme au Royaume-Uni</strong>.</li></ul></aside><div class="psid-footnotes"><p><strong>D1 :</strong> les taux sont très sensibles aux revenus de départ très faibles.</p><p class="psid-context" data-psid-context data-step="1"></p></div></div><figure class="psid-figure" data-psid-figure data-step="1"><div class="psid-controls"><label>Période <select data-psid-period data-keys aria-label="Période des courbes de croissance PSID">${options}</select></label><button type="button" class="psid-button" data-psid-play data-keys aria-label="Rejouer les douze intervalles puis leur moyenne">Rejouer</button></div><p class="psid-axis-title">Croissance annualisée du revenu réel (%)</p><div class="psid-chart" data-psid-chart></div>${legend}<figcaption><p>Bandes : intervalles d’incertitude à 95 %, point par point.</p><div class="psid-caption-bottom"><span>D2 : deuxième décile ; D10 : revenus les plus élevés.</span><div class="psid-notes"><button type="button" class="reveal-btn psid-notes-toggle" data-keys aria-expanded="false" aria-controls="psid-population-notes">Notes</button><aside class="psid-notes-bubble" id="psid-population-notes" role="note" aria-labelledby="psid-notes-label" hidden><div id="psid-notes-label" class="psid-notes-label">Notes</div><p class="psid-small">Personnes de référence et conjoints, 20–55 ans au départ ; revenus du travail non agricoles positifs aux deux dates. ${unitLabel}. Ces revenus ne constituent pas une répartition complète du PIB.</p></aside></div></div></figcaption></figure></div>`,
    source:'<a href="https://psidonline.isr.umich.edu/" target="_blank" rel="noopener noreferrer">PSID, University of Michigan</a> · calculs propres · <a href="https://fred.stlouisfed.org/series/A191RD3A086NBEA" target="_blank" rel="noopener noreferrer">BEA, déflateur du PIB (base 2017), via FRED</a>.'
  });
  window.NOTES['croissance-psid']='<p>Ajout du 1er novembre 2026, à la demande d’Arnaud. Données PSID : personnes de référence et conjoints/partenaires, âgés de 20–55 ans à l’entretien initial de chaque paire ; revenu individuel annuel du travail non agricole, positif aux deux dates de chaque intervalle. Le rang de revenu et les calculs utilisent les pondérations documentées dans les sources. Les deux courbes comparent les mêmes personnes et emploient les mêmes poids à l’intérieur de chaque paire ; la population appariée peut changer entre paires. Il ne s’agit donc pas d’une cohorte unique suivie sans interruption de 1998 à 2022, ni de comptes nationaux distribués.</p><p>Courbe non anonyme : classer les personnes selon leur revenu initial, calculer pour chacune 100 × [(revenu final / revenu initial)^(1/2) − 1], puis prendre la moyenne pondérée de ces taux dans chaque décile initial. Courbe anonyme : apparier de manière monotone les quantiles pondérés des deux distributions, calculer le taux annualisé entre les revenus de même rang, puis prendre sa moyenne pondérée dans chaque tranche de rangs. Il ne s’agit pas du taux de croissance d’un revenu moyen de groupe. Le graphique apparaît au clic après l’avertissement sur le périmètre des revenus, parcourt les douze intervalles de deux ans puis termine sur leur moyenne simple, à poids égaux ; ce n’est ni le taux cumulé 1998–2022 ni la croissance du revenu agrégé.</p><p>Le changement de rang reflète mobilité, cycle de vie et chocs de revenu. La sélection de revenus positifs aux deux dates exclut les entrées ou sorties à revenu nul : les résultats ne décrivent pas toute la population américaine. Des revenus initiaux positifs très faibles peuvent produire des taux individuels très élevés et peser sur leur moyenne, surtout dans D1 ; ils ne sont pas tronqués. Le conditionnement sur un revenu initial faible peut aussi faire apparaître un rebond. Les deux courbes ne s’interprètent pas comme un effet causal ni comme une preuve que les inégalités ont diminué. Les gains de revenus du travail ne sont pas identifiés à la croissance du PIB, au revenu national ou au revenu disponible après redistribution.</p><p>Les intervalles normaux à 95 % sont calculés par BRR de Fay, coefficient 0,5 et 128 réplicats, selon le plan documenté dans les métadonnées et la note de sources. Ils sont spécifiques à chaque estimation ; ils ne sont pas des bandes simultanées sur les dix déciles. Les données restent locales et les courbes sont natives, consultables au survol et au clavier. Le zoom D2–D10 ne change aucun calcul et ne reclasse pas les personnes ; seul le domaine affiché est réduit. Seuls D2–D10 sont affichés, y compris en lecture et à l’impression, qui présentent la moyenne sans animation. D1 reste dans les données sources. Les axes sont fixes pendant le défilement ; les courbes, points et bandes se déplacent progressivement entre deux états observés. Ces transitions sont visuelles et ne créent pas de nouvelles observations annuelles. Le survol ou le clavier interrompt le défilement et consulte un intervalle exact. Le sélecteur permet une consultation manuelle et le bouton permet de mettre en pause ou de rejouer. Les précisions sur D1 et la période figurent en petites notes grisées en bas à gauche. La précision sur la population et les unités est masquée par défaut, dans une bulle ouverte par le bouton Notes sous le graphique.</p>';

  window.NOTES['croissance-psid'] += '<p>1er novembre 2026, demande d’Arnaud : retrait des deux définitions redondantes et ajout d’un avertissement rouge. Piketty, Saez et Zucman (2018), Distributional National Accounts: Methods and Estimates for the United States, QJE 133(2), 553–609, p. 561–562 : le revenu national est le PIB moins la dépréciation, plus les revenus nets reçus de l’étranger. Les comptes incluent notamment bénéfices non distribués et loyers imputés. La mention à la première personne d’un travail non anonyme au Royaume-Uni est une information fournie par Arnaud, non une publication supplémentaire vérifiée.</p>';

  function activeAnimation(ctx){return !(ctx.print||ctx.reading||window.matchMedia('(prefers-reduced-motion: reduce)').matches);}
  function rangeFor(values){
    const finite=values.filter(Number.isFinite),low=Math.min(0,...finite),high=Math.max(0,...finite);
    const span=high-low||1,raw=span/5,power=10**Math.floor(Math.log10(raw));
    const unit=[1,2,2.5,5,10].find(v=>v*power>=raw)*power;
    const min=low<0?-Math.ceil(Math.abs(low)*1.15/(unit/5))*(unit/5):0,max=Math.ceil((high+.04*span)/unit)*unit;
    const ticks=[];if(min<0&&Math.abs(min/unit-Math.round(min/unit))>1e-8)ticks.push(Number(min.toPrecision(12)));
    for(let t=Math.ceil(min/unit)*unit;t<=max+unit/10;t+=unit)ticks.push(Number(t.toPrecision(12)));
    return {min,max,ticks};
  }
  function drawLines(host,ctx,values,config){
    const box=window.PJ.zoom(host,1.12),xs=config.xs;
    const bands=config.ci;
    const all=[...values.anonymous,...values.nonAnonymous];
    if(bands) ['anonymous','nonAnonymous'].forEach(key=>all.push(...bands[key].lower,...bands[key].upper));
    const yrange=config.range||rangeFor(all);
    const series=[['anonymous',config.fullNames?'Courbe de croissance anonyme':'Anonyme',NAVY,false],['nonAnonymous',config.fullNames?'Courbe de croissance non anonyme':'Non anonyme',ORANGE,'8 6']];
    const chartSeries=series.map(([key,name,color,dash])=>({name,color,dash,points:true,data:xs.map((x,i)=>[x,values[key][i]]),format:config.valueFormat}));
    const chart=Charts.line(box,{
      height:box.clientHeight,animate:config.animate??activeAnimation(ctx),duration:1.4,stagger:.15,legend:false,ends:false,hover:!ctx.print,
      aria:config.aria,
      x:{min:xs[0],max:xs[xs.length-1],ticks:xs,format:x=>config.labels[xs.indexOf(x)],hoverFormat:x=>config.hoverLabel(xs.indexOf(x))},
      xTitle:config.xTitle,
      y:{...yrange,format:config.tickFormat||((v)=>fmt(v,Math.abs(v)<1&&v!==0?1:0))},
      margin:{l:config.amount?76:58,r:22,t:24,b:77},
      refLines:yrange.min<0?[{y:0,color:'slate',dash:'4 4'}]:[],
      series:chartSeries
    });
    if(bands){
      const firstLine=chart.svg.querySelector('.ch-line');
      series.forEach(([key,,color])=>{
        const points=xs.map((x,i)=>[chart.S.X(x),chart.S.Y(bands[key].upper[i])]).concat(xs.map((x,i)=>[chart.S.X(x),chart.S.Y(bands[key].lower[i])]).reverse());
        const polygon=Charts.el('polygon',{points:points.map(p=>p.join(',')).join(' '),fill:color,'fill-opacity':.12,class:'psid-ci-band','pointer-events':'none'});
        firstLine.parentNode.insertBefore(polygon,firstLine);
      });
      // Le moteur met a jour le guide avant de terminer son gestionnaire de survol.
      // Cette surcouche lit sa position APRES ce gestionnaire ; elle ne deduit jamais
      // le decile de la valeur du revenu (qui peut etre identique a plusieurs rangs).
      const guide=chart.svg.querySelector('.ch-guide'),hit=chart.svg.querySelector('.ch-hit'),readout=box.querySelector('.ch-readout');
      if(guide&&hit&&readout){
        const updateReadout=()=>{
          const pixel=Number(guide.getAttribute('x1'));
          let index=0;xs.forEach((x,i)=>{if(Math.abs(chart.S.X(x)-pixel)<Math.abs(chart.S.X(xs[index])-pixel))index=i;});
          readout.innerHTML=`<div style="font-weight:700;margin-bottom:2px">${esc(config.hoverLabel(index))}</div>`+series.map(([key,name,color])=>
            `<div><b style="color:${color}">${esc(name)}</b> ${esc(config.valueFormat(values[key][index]))} (IC 95 % : ${esc(fmt(bands[key].lower[index],1))} à ${esc(fmt(bands[key].upper[index],1))} %)</div>`
          ).join('');
        };
        hit.addEventListener('pointermove',updateReadout);
        box.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight')updateReadout();});
      }
    }
    // Légende dans l’angle supérieur droit, libre dans les vues proposées.
    // Deux lignes par courbe dans l’exemple pour conserver une grande police.
    const width=config.fullNames?300:210, rowHeight=config.fullNames?62:38;
    const legendX=Number(chart.svg.getAttribute('width'))-chart.m.r-width-6, legendY=chart.m.t+9;
    const labels=Charts.el('g',{class:'psid-embedded-legend','pointer-events':'none','aria-label':series.map(s=>s[1]).join(' ; ')},chart.svg);
    Charts.el('rect',{x:legendX,y:legendY,width,height:rowHeight*2+10,rx:6,fill:'#FFFFFF','fill-opacity':.96},labels);
    series.forEach(([,name,color,dash],i)=>{
      const top=legendY+10+i*rowHeight;
      Charts.el('line',{x1:legendX+10,x2:legendX+36,y1:top+14,y2:top+14,stroke:color,'stroke-width':3,'stroke-dasharray':dash||null},labels);
      if(config.fullNames){
        Charts.txt(labels,legendX+46,top+20,'Courbe de croissance','psid-legend-title',{fill:color});
        Charts.txt(labels,legendX+46,top+47,i?'non anonyme':'anonyme','psid-legend-title',{fill:color});
      }else Charts.txt(labels,legendX+46,top+22,name,'psid-legend-title',{fill:color});
    });
    box.setAttribute('aria-label',config.aria+'. Flèches gauche et droite : consulter les valeurs.');
    if(config.mutable){
      // Déplacer les mêmes éléments SVG, sans reconstruire axes ou légende à chaque image.
      // Les tableaux partagés avec les infobulles restent synchronisés avec le tracé.
      const paths=[...chart.svg.querySelectorAll('.ch-line')];
      const dots=paths.map(path=>{const nodes=[];let node=path.nextElementSibling;while(node&&node.tagName.toLowerCase()==='circle'){nodes.push(node);node=node.nextElementSibling;}return nodes;});
      const polygons=[...chart.svg.querySelectorAll('.psid-ci-band')];
      chart.update=(next)=>{
        series.forEach(([key],k)=>{
          values[key].splice(0,values[key].length,...next[key]);
          chartSeries[k].data.forEach((point,i)=>{point[1]=values[key][i];});
          paths[k].setAttribute('d',xs.map((x,i)=>(i?'L':'M')+chart.S.X(x).toFixed(1)+','+chart.S.Y(values[key][i]).toFixed(1)).join(' '));
          dots[k].forEach((dot,i)=>dot.setAttribute('cy',chart.S.Y(values[key][i])));
          ['lower','upper'].forEach(edge=>bands[key][edge].splice(0,bands[key][edge].length,...next.ci[key][edge]));
          const points=xs.map((x,i)=>[chart.S.X(x),chart.S.Y(bands[key].upper[i])]).concat(xs.map((x,i)=>[chart.S.X(x),chart.S.Y(bands[key].lower[i])]).reverse());
          polygons[k].setAttribute('points',points.map(point=>point.join(',')).join(' '));
        });
      };
      chart.hideReadout=()=>chart.svg.querySelector('.ch-hit')?.dispatchEvent(new Event('pointerleave'));
    }
    return chart;
  }

  window.NOTES['croissance-rangs-exemple'] += '<p>1er novembre 2026 : titre préfixé Point méthodologique, libellés Courbe de croissance anonyme / non anonyme, légende intégrée au graphique et typographie agrandie à la demande d’Arnaud. Les quatre personnes, les revenus et les calculs sont inchangés.</p>';

  let exampleUnit='percent',exampleSorted=false;
  function drawExample(el,ctx={}){
    const sorted=ctx.print||ctx.reading||exampleSorted;
    el.querySelectorAll('.psid-example-arrival .psid-example-person').forEach(node=>{
      const index=(sorted?ranked:people).findIndex(p=>p.id===node.dataset.person);
      node.style.setProperty('--psid-row',index);
    });
    el.querySelector('[data-example-arrival-title]').textContent=sorted?'Arrivée : ordre des revenus':'Arrivée : mêmes personnes';
    const button=el.querySelector('[data-example-sort]');button.textContent=sorted?'Retrouver les mêmes personnes':'Reclasser à l’arrivée';button.setAttribute('aria-pressed',String(sorted));
    el.querySelector('[data-example-unit]').value=exampleUnit;
    el.querySelector('[data-example-ytitle]').textContent=exampleUnit==='percent'?'Croissance du revenu sur un an (%)':'Gain de revenu sur un an (euros)';
    el.querySelector('[data-example-caption]').textContent=exampleUnit==='percent'?'Au premier rang : +80 % ; pour la personne A : +140 %.':'Au premier rang : +8 000 € ; pour la personne A : +14 000 €.';
    drawLines(el.querySelector('[data-example-chart]'),ctx,exampleValues(exampleUnit),{
      fullNames:true,xs:[1,2,3,4],labels:['1','2','3','4'],xTitle:'Rang de revenu',hoverLabel:i=>`Rang ${i+1} · personne ${people[i].id} au départ`,amount:exampleUnit==='amount',
      valueFormat:v=>fmt(v,0)+(exampleUnit==='percent'?' %':' €'),tickFormat:v=>exampleUnit==='amount'?fmt(v/1000,0)+' k':fmt(v,0),
      aria:'Exemple fictif, croissance des revenus par rang, courbe anonyme et suivi des mêmes personnes.'
    });
  }
  const psidKeys=['anonymous','nonAnonymous'];
  const sequence=[...data.periods.map(periodKey),'summary'];
  const psidRange={min:-15,max:35,ticks:[-10,0,10,20,30]};
  const PLAYBACK_SPEED=1.5;
  const HOLD_MS=1300/PLAYBACK_SPEED,MORPH_MS=850/PLAYBACK_SPEED;
  let selectedPeriod='summary',psidChart=null,currentView=null;
  let playing=false,revealed=false,frameId=0,holdId=0,printing=false,periodBeforePrint='summary';
  const getPeriod=key=>key==='summary'?data.summary:data.periods.find(p=>periodKey(p)===key);
  const viewFor=key=>{
    const period=getPeriod(key);
    if(!period)throw new Error('Intervalle PSID absent : '+key);
    return Object.fromEntries([
      ...psidKeys.map(name=>[name,period[name].slice(1)]),
      ['ci',Object.fromEntries(psidKeys.map(name=>[name,{lower:period.ci[name].lower.slice(1),upper:period.ci[name].upper.slice(1)}]))]
    ]);
  };
  function periodLabel(key){return key==='summary'?'moyenne des douze intervalles 1998–2022':key.replace('-', '–');}
  function updatePeriod(el,key){
    const period=getPeriod(key);
    el.querySelector('[data-psid-period]').value=key;
    el.querySelector('[data-psid-chart]').dataset.period=key;
    el.querySelector('[data-psid-context]').textContent=(key==='summary'
      ?'Moyenne simple des 12 intervalles de deux ans. La population suivie est renouvelée entre les intervalles.'
      :`${period.start}–${period.end} : ${fmt(period.n,0)} personnes observées aux deux dates.`)+' Zoom d’affichage sur D2–D10, sans recalcul des déciles.';
    const label=`Croissance annualisée réelle des revenus du travail, États-Unis, ${periodLabel(key)}, courbes anonyme et non anonyme, déciles D2 à D10. Flèches gauche et droite : consulter les valeurs.`;
    el.querySelector('[data-psid-chart] .p-zin')?.setAttribute('aria-label',label);
    el.querySelector('[data-psid-chart] svg')?.setAttribute('aria-label',label);
  }
  function updatePlayButton(el){
    const button=el.querySelector('[data-psid-play]');
    button.textContent=playing?'Pause':'Rejouer';
    button.setAttribute('aria-label',playing?'Mettre le défilement en pause':'Rejouer les douze intervalles puis leur moyenne');
    el.dataset.psidPlaying=String(playing);
  }
  function drawPSID(el,ctx={}){
    currentView=viewFor(selectedPeriod);
    psidChart=drawLines(el.querySelector('[data-psid-chart]'),ctx,currentView,{
      animate:false,mutable:!ctx.print,range:psidRange,
      xs:data.deciles.centers.slice(1),labels:data.deciles.labels.slice(1),xTitle:'Décile de revenu · D2–D10',
      hoverLabel:i=>`${periodLabel(selectedPeriod)} · ${data.deciles.labels[i+1]} · ${(i+1)*10}–${(i+2)*10} %`,
      ci:currentView.ci,valueFormat:v=>fmt(v,1)+' % par an',
      aria:`Croissance annualisée réelle des revenus du travail, États-Unis, ${periodLabel(selectedPeriod)}, courbes anonyme et non anonyme, déciles D2 à D10.`
    });
    updatePeriod(el,selectedPeriod);updatePlayButton(el);
    el.querySelector('[data-psid-chart]').dataset.transitioning='false';
  }
  function applyView(view){psidChart.update(view);currentView=view;}
  function stopPlayback(el,settle=true){
    cancelAnimationFrame(frameId);clearTimeout(holdId);frameId=holdId=0;playing=false;
    if(settle&&psidChart?.update)applyView(viewFor(selectedPeriod));
    el.querySelector('[data-psid-chart]').dataset.transitioning='false';
    updatePlayButton(el);
  }
  function isLive(el){return el.classList.contains('is-active')&&window.Deck.step>=1&&!printing&&!document.body.classList.contains('reading');}
  function transitionTo(el,key,done=()=>{}){
    const from=structuredClone(currentView),to=viewFor(key);
    selectedPeriod=key;updatePeriod(el,key);psidChart?.hideReadout?.();
    if(!activeAnimation({reading:document.body.classList.contains('reading')})||!psidChart?.update){
      drawPSID(el,{reading:document.body.classList.contains('reading')});done();return;
    }
    const host=el.querySelector('[data-psid-chart]');host.dataset.transitioning='true';
    const started=performance.now();
    function frame(now){
      if(!isLive(el)){stopPlayback(el);return;}
      const progress=Math.min(1,(now-started)/MORPH_MS),t=progress*progress*(3-2*progress);
      const mix=(a,b)=>a.map((value,i)=>value+(b[i]-value)*t);
      const view=Object.fromEntries([
        ...psidKeys.map(name=>[name,mix(from[name],to[name])]),
        ['ci',Object.fromEntries(psidKeys.map(name=>[name,{lower:mix(from.ci[name].lower,to.ci[name].lower),upper:mix(from.ci[name].upper,to.ci[name].upper)}]))]
      ]);
      applyView(view);
      if(progress<1)frameId=requestAnimationFrame(frame);
      else{frameId=0;applyView(to);host.dataset.transitioning='false';done();}
    }
    frameId=requestAnimationFrame(frame);
  }
  function startPlayback(el){
    stopPlayback(el,false);
    if(!activeAnimation({})){selectedPeriod='summary';drawPSID(el);return;}
    selectedPeriod=sequence[0];playing=true;drawPSID(el);
    let index=0;
    function advance(){
      if(!isLive(el)){stopPlayback(el);return;}
      transitionTo(el,sequence[++index],()=>{
        if(index===sequence.length-1)stopPlayback(el,false);
        else holdId=setTimeout(advance,HOLD_MS);
      });
    }
    holdId=setTimeout(advance,HOLD_MS);
  }
  function closePSIDNotes(el){
    el.querySelector('#psid-population-notes').hidden=true;
    el.querySelector('.psid-notes-toggle').setAttribute('aria-expanded','false');
  }
  function revealPSID(el,step){
    const reading=document.body.classList.contains('reading');
    el.querySelector('[data-psid-figure]').inert=!reading&&step<1;
    if(reading||printing)return;
    if(step<1){stopPlayback(el);closePSIDNotes(el);revealed=false;return;}
    if(!revealed){revealed=true;startPlayback(el);}
  }
  window.Deck.on('croissance-rangs-exemple',{enter(el,ctx){
    el.querySelector('[data-example-sort]').onclick=()=>{exampleSorted=!exampleSorted;drawExample(el,{});};
    el.querySelector('[data-example-unit]').onchange=e=>{exampleUnit=e.target.value;drawExample(el,{});};
    drawExample(el,ctx);
  }});
  window.Deck.on('croissance-psid',{
    enter(el,ctx){
      stopPlayback(el,false);revealed=false;
      const reading=ctx.reading||document.body.classList.contains('reading');
      const print=ctx.print||printing;
      if(!print)closePSIDNotes(el);
      el.querySelector('.psid-notes-toggle').onkeydown=event=>{
        if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closePSIDNotes(el);}
      };
      selectedPeriod=reading||print?'summary':sequence[0];
      el.querySelector('[data-psid-period]').onchange=e=>{
        stopPlayback(el,false);transitionTo(el,e.target.value);
      };
      el.querySelector('[data-psid-play]').onclick=()=>{
        if(playing)stopPlayback(el);else startPlayback(el);
      };
      const host=el.querySelector('[data-psid-chart]');
      // Consulter uniquement un état observé, jamais une valeur interpolée.
      // Un pointeur immobile sur la figure lors de sa révélation ne la met pas en pause.
      if(!host.dataset.inspectionBound){
        host.dataset.inspectionBound='true';
        const inspect=()=>{if(playing||frameId)stopPlayback(el);};
        host.addEventListener('pointermove',inspect,true);
        host.addEventListener('focusin',inspect);
      }
      drawPSID(el,{reading,print});
    },
    step:revealPSID,
    leave(el){stopPlayback(el);closePSIDNotes(el);revealed=false;}
  });
  document.addEventListener('deck:change',event=>{
    if(event.detail.id!=='croissance-psid'&&(playing||frameId))stopPlayback(window.Deck.slideEl('croissance-psid'));
  });
  // Le moteur ne rappelle pas enter() pour une diapositive déjà vue en mode lecture.
  new MutationObserver(()=>{
    if(!document.body.classList.contains('reading')||printing)return;
    const el=window.Deck.slideEl('croissance-psid');if(!el)return;
    stopPlayback(el,false);selectedPeriod='summary';drawPSID(el,{reading:true});
    el.querySelector('[data-psid-figure]').inert=false;
  }).observe(document.body,{attributes:true,attributeFilter:['class']});
  window.addEventListener('beforeprint',()=>{
    const example=window.Deck.slideEl('croissance-rangs-exemple'),observed=window.Deck.slideEl('croissance-psid');
    printing=true;periodBeforePrint=selectedPeriod;
    if(example)drawExample(example,{print:true});
    if(observed){stopPlayback(observed,false);selectedPeriod='summary';drawPSID(observed,{print:true});}
  });
  window.addEventListener('afterprint',()=>{
    printing=false;selectedPeriod=periodBeforePrint;
    const ctx={reading:document.body.classList.contains('reading')},example=window.Deck.slideEl('croissance-rangs-exemple'),observed=window.Deck.slideEl('croissance-psid');
    if(example&&example.getBoundingClientRect().width>0)drawExample(example,ctx);
    if(observed&&observed.getBoundingClientRect().width>0){
      if(ctx.reading)selectedPeriod='summary';
      drawPSID(observed,ctx);
    }
  });
})();
