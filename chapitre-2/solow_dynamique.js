
(function () {
  'use strict';
  const G = window.G2, M = window.SolowContinu;
  const f = G.f, eq = G.eq, dot = G.dot, v = x => `<i>${x}</i>`;
  const k = v('k̃'), y = v('ỹ'), b = v('b'), A = v('A'), E = v('E');
  const pwt = '<a href="https://www.rug.nl/ggdc/productivity/pwt/?lang=en" target="_blank" rel="noopener">Penn World Table 11.0</a>';
  const bcl = '<a href="http://www.longtermproductivity.com/" target="_blank" rel="noopener">Long-Term Productivity Database, v2.7</a>';
  const call = html => `<p class="g-note">${html}</p>`;
  const math = html => `<span class="g-math">${html}</span>`;
  const step = (n, html) => `<div data-step="${n}">${html}</div>`;
  const emptySteps = n => Array.from({length: n}, (_, i) => `<span data-step="${i + 1}" aria-hidden="true"></span>`).join('');
  const number = (n, digits = 1) => G.fmt(n, digits);
  const paramNote = math('α = 1/3, s = 24 %, δ = 4 %, n = 0,5 %, γ = 1 %');
  
  
  function add(position, id, title, html, _, extra = {}) {
    G.add(Object.assign({id, title, html, source: ''}, extra));
  }
  function controls(key, choices) {
    return `<div class="g-controls" data-dyn-group="${key}" role="group" aria-label="Choix de représentation">${choices.map(([value,label]) => `<button type="button" data-dyn-value="${value}" aria-pressed="false">${label}</button>`).join('')}</div>`;
  }
  function bind(el, key, initial, ctx, redraw) {
    const group = el.querySelector(`[data-dyn-group="${key}"]`);
    if (!group) return initial;
    const value = ctx.static ? initial : group.dataset.selected || initial;
    group.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.dynValue === value));
      button.onclick = event => { event.stopPropagation(); group.dataset.selected = button.dataset.dynValue; redraw(); };
    });
    return value;
  }
  const curve = (fn, max = 24, n = 120) => Array.from({length:n + 1}, (_, i) => { const x = max * i / n; return [x, fn(x)]; });
  function diagram(id, ctx, options = {}) {
    const p = options.params || M.BASE, ss = M.steady(p), max = options.max || 24;
    const series = [];
    if (options.production) series.push({name:'Production', color:'#6B7280', dash:'4 5', data:curve(x=>x**p.alpha,max)});
    if (options.investment !== false) series.push({name:'Investissement',color:'#001F5F',data:curve(x=>p.s*x**p.alpha,max),format:x=>number(x,2)});
    if (options.maintenance !== false) series.push({name:'Maintien',color:'#B45309',data:curve(x=>M.maintenance(p)*x,max),format:x=>number(x,2)});
    if (options.other) {
      const q = options.other;
      if (q.s !== p.s) series.push({name:'Nouvel investissement',color:'#001F5F',dash:'8 6',data:curve(x=>q.s*x**q.alpha,max),format:x=>number(x,2)});
      if (M.maintenance(q) !== M.maintenance(p)) series.push({name:'Nouveau maintien',color:'#B45309',dash:'8 6',data:curve(x=>M.maintenance(q)*x,max),format:x=>number(x,2)});
    }
    const markers = options.markers || (options.stationary === false ? [] : [{x:ss.k,y:p.s*ss.k**p.alpha,color:'#001F5F',label:'k̃* = '+number(ss.k,0),dy:-20}] );
    const maxY=options.production?3:Math.ceil(Math.max(options.yMax||1.6,...series.flatMap(s=>s.data.map(r=>r[1])))/.4-1e-9)*.4;
    const yTicks=ctx.static?[0,maxY/2,maxY]:Array.from({length:5},(_,i)=>i*maxY/4);
    return G.line(id, {animate:ctx.animate, legend: true, x:{min:0,max,ticks:(ctx.static?[0,8,16,24]:[0,4,8,12,16,20,24]).filter(x=>x<=max),format:x=>number(x,0)},
      y: options.production ? {min:0,max:3,ticks:[0,1,2,3],format:x=>number(x,0)} : {min:0,max:maxY,ticks:yTicks,format:x=>number(x,1)},
      xTitle:'Capital par unité de travail efficace, k̃', yTitle:'Flux par unité de travail efficace', series, markers});
  }
  function markerLine(res, x, lo, hi, label, color = '#B45309') {
    if (!res || !res.svg || !res.S) return;
    const {S, svg} = res, el = window.Charts.el;
    const key=JSON.stringify([x,lo,hi,label,color]);
    if([...svg.querySelectorAll('[data-marker-line]')].some(node=>node.dataset.markerLine===key))return;
    const group=el('g',{'data-marker-line':key},svg);
    el('line',{x1:S.X(x),x2:S.X(x),y1:S.Y(lo),y2:S.Y(hi),stroke:color,'stroke-width':4},group);
    const text=el('text',{x:S.X(x)+12,y:S.Y((lo+hi)/2),'font-size':22,fill:color},group);text.textContent=label;
  }

  add(23,'s1-croissance-grandeurs','Pourquoi les grandeurs continuent-elles de croître ?',
    G.cols(eq(`${f('Y','L')} = A ${f('K','L')}<sup>α</sup>`)+G.list(['Même capital par travailleur',['PGF plus élevée → production plus élevée',1],['Investissement par travailleur plus élevé',2]])+call(`Avec progrès technique, ${math('K/L')} ne reste pas constant sur le sentier équilibré.`),
      controls('tech',[['1','A = 1'],['2','A = 2']])+G.chart('s1-croissance-grandeurs-chart',440))+emptySteps(2),
    '',{prov:'sim'});
  G.on('s1-croissance-grandeurs',(el,ctx)=>{
    const draw=()=>{
      const a=Number(bind(el,'tech',ctx.step>=1?'2':'1',ctx,draw));
      const series=[{name:'Production, A = 1',color:'#001F5F',data:curve(x=>x**(1/3),20)}];
      if(a===2||ctx.static)series.push({name:'Production, A = 2',color:'#B45309',data:curve(x=>2*x**(1/3),20)});
      if(ctx.step>=2||ctx.static){
        series.push({name:'Investissement, A = 1',color:'#001F5F',dash:'7 5',data:curve(x=>.24*x**(1/3),20)});
        if(a===2||ctx.static)series.push({name:'Investissement, A = 2',color:'#B45309',dash:'7 5',data:curve(x=>.48*x**(1/3),20)});
      }
      G.line('s1-croissance-grandeurs-chart',{animate:ctx.animate,legend:true,x:{min:0,max:20,ticks:[0,5,10,15,20]},y:{min:0,max:6,ticks:[0,2,4,6]},xTitle:'Capital par travailleur, K/L',yTitle:'Production et investissement par travailleur',series});
    };draw();
  });

  add(24,'s1-normalisation','Raisonner par unité de travail efficace',
    `<div class="g-two"><div class="g-col">${eq(`E = A<sup>1/(1−α)</sup>`)}${eq(`Y = K<sup>α</sup>(EL)<sup>1−α</sup>`,1)}${call(`${math('E')} : une autre écriture de la même productivité.`)}</div><div class="g-col">${eq(`${k} = ${f('K','EL')} &emsp; ${y} = ${f('Y','EL')}`,2)}${eq(`${y} = ${k}<sup>α</sup>`,2)}${eq(`${f(dot('E'),'E')} = ${f('γ','1−α')}`,3)}</div></div>${step(4,eq(`${f('Y','N')} = ${f('L','N')} × E × ${y}`)+call('Revenir au niveau de vie : emploi, efficacité et production normalisée.'))}`,
    '');

  add(25,'s1-equation','L’équation centrale de Solow',
    eq(`${dot(k)} = <span style="color:#001F5F">s${k}<sup>α</sup></span> − <span style="color:#B45309">(δ + n + ${f('γ','1−α')}) ${k}</span>`)+
    `<div class="g-two" style="margin-top:32px"><div class="g-panel">${G.list([`Investissement : ${math('s k̃<sup>α</sup>')}`,[`Dépréciation : ${math('δ k̃')}`,1]])}</div><div class="g-panel">${G.list([[`Travail supplémentaire : ${math('n k̃')}`,2],[`Efficacité supplémentaire : ${math('γ/(1−α) × k̃')}`,3]])}</div></div>`+
    step(4,eq(`${b} = δ + n + ${f('γ','1−α')} = 6 %`)+call('Seule la dépréciation représente une perte physique de capital.')),
    '');

  add(26,'s1-diagramme','Le diagramme de Solow',
    G.cols(G.list([`Production : ${math('k̃<sup>α</sup>')}`,[`Investissement : ${math('s k̃<sup>α</sup>')}`,1],[`Maintien : ${math('b k̃')}`,2],[`À l’intersection : ${math('k̃̇ = 0')}`,3]])+call(paramNote),G.chart('s1-diagramme-chart',530)),
    '',{prov:'sim'});
  G.on('s1-diagramme',(el,ctx)=>diagram('s1-diagramme-chart',ctx,{production:!ctx.static&&ctx.step<3,investment:ctx.static||ctx.step>=1,maintenance:ctx.static||ctx.step>=2,stationary:ctx.static||ctx.step>=3}));

  add(27,'s1-convergence-diagramme','Pourquoi l’économie se rapproche-t-elle de l’intersection ?',
    G.cols(G.list([`Investissement > maintien → ${math('k̃')} augmente`,[`Investissement < maintien → ${math('k̃')} diminue`,1]])+
      `<p class="g-note" id="s1-signe-valeur" aria-live="polite"></p><label class="g-controls">Capital normalisé <input id="s1-capital-mobile" type="range" min="0.5" max="22" value="2" step="0.5" aria-label="Capital par unité de travail efficace"></label>`+
      call('L’écart vertical est une variation, pas un taux de croissance.'),G.chart('s1-convergence-diagramme-chart',510)),
    '',{prov:'sim',cls:'g-exercise'});
  G.on('s1-convergence-diagramme',(el,ctx)=>{
    const slider=el.querySelector('#s1-capital-mobile');
    const draw=()=>{
      const points=ctx.static?[2,16]:[Number(slider.value)],markers=[];
      points.forEach(x=>markers.push({x,y:.24*x**(1/3),color:'#001F5F'},{x,y:.06*x,color:'#B45309'}));
      const r=diagram('s1-convergence-diagramme-chart',ctx,{markers});
      points.forEach(x=>markerLine(r,x,.06*x,.24*x**(1/3),M.derivative(x)>0?'→':'←'));
      el.querySelector('#s1-signe-valeur').innerHTML=points.map(x=>`${math(`k̃ = ${number(x,1)}`)} : ${math(`k̃̇ = ${M.derivative(x)>0?'+':''}${number(M.derivative(x),3)}`)} par an`).join('<br>');
    };slider.oninput=draw;draw();
  });

  add(28,'s1-stationnaire','Calculer l’état stationnaire',
    `<div class="g-col" style="gap:24px">${eq(`s(${k}*)<sup>α</sup> = b${k}*`)}${eq(`(${k}*)<sup>1−α</sup> = ${f('s','b')}`,1)}${eq(`${k}* = (${f('s','b')})<sup>1/(1−α)</sup>`,2)}${eq(`${y}* = (${k}*)<sup>α</sup> = (${f('s','b')})<sup>α/(1−α)</sup>`,3)}</div>`,
    '');

  add(29,'s1-capital-production','Combien d’années de production représente le capital ?',
    eq(`${f('K','Y')} = ${f('k̃*','ỹ*')} = ${f('s','δ + n + γ/(1−α)')} = ${f('s','b')}`)+
    `<p class="g-note" style="text-align:center">Sur le sentier de croissance équilibré</p><div class="g-two" style="margin-top:32px"><div class="g-panel"><p>Calibration du modèle</p><p class="g-eq">4 ans</p><p>Stock / flux annuel</p></div><div class="g-panel"><p>États-Unis, 2022</p><p class="g-eq" id="s1-ky-observe"></p><p>Capital / PIB, prix PPA courants</p></div></div>`,
    '',{prov:'mixte',source:`États-Unis : ${pwt}, cn / cgdpo, 2022. Modèle : calibration pédagogique.`});
  G.on('s1-capital-production',el=>{el.querySelector('#s1-ky-observe').textContent=number(G.DATA.kyUSA2022,2)+' ans';});

  add(30,'s1-exercice','Application numérique guidée',
    `<p class="g-note">${math('α = 1/3 &emsp; s = 24 % &emsp; δ = 4 % &emsp; n = 0,5 % &emsp; γ = 1 %')}</p><p>Les taux sont annuels.</p>`+
    G.list([`Calculer le taux de maintien ${math('b')}.`,`Déterminer le capital ${math('k̃*')} et la production ${math('ỹ*')}.`,'Combien d’années de production représente le capital ?',`Comment retrouver le PIB par habitant ${math('Y/N')} ?`])+
    `<div style="margin-top:28px;font-size:26px;color:#536078">Résolution au tableau</div>`,
    '',{cls:'g-exercise',prov:null});

  add(31,'s1-faits-croissance','Stationnaire ne signifie pas immobile',
    G.cols(`<div id="s1-faits-reperes"></div>${step(1,window.C.def('Sentier de croissance équilibré','Croissance commune et constante des agrégats. Rapports constants.',{cls:'compact'}))}`,
      G.chart('s1-faits-croissance-chart',520)),
    '',{prov:'obs',source:`${bcl}. États-Unis, 1950–2024. PIB et capital (bâtiments, équipements) par habitant, dollars 2020 PPA.`});
  G.on('s1-faits-croissance',(el,ctx)=>{
    const D=G.DATA.bclUSA,rows=D.rows;
    el.querySelector('#s1-faits-reperes').innerHTML=G.list([`PIB par habitant : <b>${math(number(D.growthY,2)+' %')}</b> par an`,`Capital par habitant : <b>${math(number(D.growthK,2)+' %')}</b> par an`,`${math('K/Y')} : ${math(number(D.kyStart,2))} ans en ${rows[0][0]}, ${math(number(D.kyEnd,2))} en ${rows[rows.length-1][0]}`]);
    G.line('s1-faits-croissance-chart',{animate:ctx.animate,legend:true,x:{min:1950,max:2024,ticks:[1950,1970,1990,2010,2024]},y:{log:true,min:10000,max:400000,ticks:[10000,20000,50000,100000,200000,400000],format:x=>number(x/1000,0)},
      yTitle:'Milliers de dollars de 2020 PPA (échelle log)',series:[{name:'PIB par habitant',color:'#001F5F',data:rows.map(r=>[r[0],r[1]]),format:x=>number(x/1000,1)},{name:'Capital par habitant',color:'#B45309',dash:'8 5',data:rows.map(r=>[r[0],r[2]]),format:x=>number(x/1000,1)}]});
  });

  add(32,'s1-croissance-equilibree','La croissance de long terme du niveau de vie',
    `<div class="g-two"><div class="g-col">${eq(`${f(dot('Y'),'Y')} = ${f(dot('K'),'K')} = ${f(dot('C'),'C')}`)}${eq(`= n + ${f('γ','1−α')}`,1)}<p class="g-note">Agrégats : travail et efficacité</p></div><div class="g-col">${eq(`${f(dot('Y'),'Y')} − ${f(dot('N'),'N')}`,2)}${eq(`= ${f('γ','1−α')}`,2)}<p class="g-note">Par habitant : efficacité</p></div></div>`+
    step(3,`<div class="g-two" style="margin-top:25px"><p class="g-eq">PIB total : 2 % par an</p><p class="g-eq">PIB / habitant : 1,5 % par an</p></div>`)+call('Sur le sentier équilibré. Pendant la transition, le capital normalisé contribue aussi.'),
    '');

  const scenarios = {
    saving:{name:'Épargne : 24 → 48 %',change:{s:.48}},
    productivity:{name:'PGF : A × 2',AFactor:2},
    productivityDown:{name:'PGF : A ÷ 2',AFactor:.5},
    demography:{name:'Démographie : 0,5 → 0 %',change:{n:0}},
    faster:{name:'PGF : γ = 2 %',change:{gamma:.02}},
    noProgress:{name:'PGF : γ = 0 %',change:{gamma:0}}
  };
  const palette=['#001F5F','#B45309','#6B7280','#B45309'];
  function pathSeries(keys, mode, total=false) {
    const entries=[{name:'Référence',scenario:{}},...keys.map(key=>({name:scenarios[key].name,scenario:scenarios[key]}))];
    return entries.flatMap((entry,i)=>{
      const rows=M.sample(entry.scenario), first=rows[0], baseValue=total?first.Y:first.yPerCapita;
      const data=rows.map(r=>{
        const value=total?r.Y:r.yPerCapita;
        const growth=total?r.gTotal:r.gPerCapita;
        return [r.t,mode==='rate'?(growth===null?null:100*growth):mode==='log'?Math.log(value/baseValue):100*value/baseValue];
      });
      const style={name:entry.name,color:palette[i%palette.length],dash:i>=2?'8 5':undefined,format:x=>number(x,mode==='rate'?2:mode==='log'?2:0)};
      if(mode==='rate'&&(entry.scenario.change||entry.scenario.AFactor)){
        const shock=entry.scenario.shock??20;
        
        
        return [{...style,data:data.filter(r=>r[0]<shock),legend:false},
          {...style,data:data.filter(r=>r[0]>=shock&&r[1]!==null)}];
      }
      return [{...style,data}];
    });
  }
  function drawPath(id,keys,mode,ctx,total=false) {
    const opts={animate:ctx.animate,legend:true,x:{min:0,max:100,ticks:[0,20,40,60,80,100],format:x=>number(x,0)},
      xTitle:ctx.static?'Années':'Années : changement à l’année 20',yTitle:mode==='rate'?'Croissance instantanée, % par an':mode==='log'?'Logarithme du niveau / niveau initial':`${total?'PIB total':'PIB par habitant'} : indice initial 100`,
      y:{zero:false}, series:pathSeries(keys,mode,total)};
    if(mode==='rate')opts.y.format=x=>number(x,1);
    if(ctx.static){
      
      
      const values=opts.series.flatMap(s=>s.data.map(r=>r[1]).filter(Number.isFinite));
      const lo=Math.min(...values),hi=Math.max(...values),span=Math.max(hi-lo,1e-6);
      const scale=10**Math.floor(Math.log10(span/2));
      const steps=[1,1.5,2,2.5,3,4,5,7.5,10,15,20].map(x=>x*scale);
      const gap=steps.find(x=>x>=span/2&&Math.floor(lo/x)*x+2*x>=hi-1e-10)||steps[steps.length-1];
      const min=Math.floor(lo/gap)*gap,max=min+2*gap;
      opts.y={min,max,ticks:[min,min+gap,max],format:x=>number(x,mode==='rate'?1:mode==='log'?1:0)};
    }
    return G.line(id,opts);
  }
  function simulationSlide(position,id,title,left,keys,defaultKey,_,extra={}) {
    const choices=keys.map(key=>[key,scenarios[key].name]);
    const staticPanels=[['diag','Diagramme'],['level','PIB par habitant'],['log','Logarithme du niveau'],['rate','Taux de croissance']];
    const screen=`<div data-dyn-screen>${G.cols(left+controls('scenario',choices)+G.chart(id+'-diagramme',extra.compact?270:310)+`<p data-scenario-detail class="g-note" style="font-size:21px;margin:4px 0"></p>`,controls('view',[['level','Niveaux'],['log','Logarithme'],['rate','Taux'],...(extra.total?[['total','PIB total']]:[])])+G.chart(id+'-trajectoire',455))}</div>`;
    const print=`<div data-dyn-static style="display:none"><p class="g-note" style="margin:0 0 10px">${extra.staticText||'Même point de départ. Changement à l’année 20. Paramètres de référence : '+paramNote}</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 30px">${staticPanels.map(([key,label])=>`<div><p style="font-size:21px;margin:0">${label}</p>${G.chart(id+'-static-'+key,285)}</div>`).join('')}</div></div>`;
    add(position,id,title,screen+print,'',{prov:'sim'});
    G.on(id,(el,ctx)=>{
      if(extra.compact){
        const columns=el.querySelectorAll('[data-dyn-screen] .g-col');
        columns[0].style.gap='14px';
        columns[0].querySelectorAll('.g-eq').forEach(x=>{x.style.fontSize='32px';x.style.lineHeight='1.2';});
        columns[0].querySelectorAll('.g-bullets').forEach(x=>{x.style.fontSize='27px';x.style.lineHeight='1.25';x.style.margin='0';});
        columns[0].querySelectorAll('.g-bullets li').forEach(x=>x.style.setProperty('margin-top','10px','important'));
      }
      const draw=()=>{
        const key=bind(el,'scenario',defaultKey,ctx,draw),mode=bind(el,'view','log',ctx,draw);
        el.querySelector('[data-dyn-screen]').style.display=ctx.static?'none':'';
        el.querySelector('[data-dyn-static]').style.display=ctx.static?'':'none';
        const chosen=scenarios[key],other=Object.assign({},M.BASE,chosen.change||{});
        const diagramOptions={other};
        const detail=el.querySelector('[data-scenario-detail]');
        if(chosen.AFactor){
          const kAfter=8/chosen.AFactor**1.5;
          diagramOptions.markers=[{x:8,y:.48,color:'#001F5F',label:'Avant : 8',dy:-22},{x:kAfter,y:.24*kAfter**(1/3),color:'#B45309',label:'Après : '+number(kAfter,2),dy:-22,anchor:kAfter>20?'end':'middle'}];
          detail.innerHTML=`Courbes inchangées. Au choc, ${math('k̃')} passe de ${math('8')} à ${math(number(kAfter,2))}, puis converge vers ${math('8')}.`;
        }else detail.innerHTML=`Nouvel état stationnaire : ${math('k̃* = '+number(M.steady(other).k,2))}.`;
        if(ctx.static){
          diagram(id+'-static-diag',ctx,diagramOptions);
          ['level','log','rate'].forEach(view=>drawPath(id+'-static-'+view,extra.staticKeys||keys,view,ctx));
        }else{
          diagram(id+'-diagramme',ctx,diagramOptions);
          drawPath(id+'-trajectoire',[key],mode==='total'?'level':mode,ctx,mode==='total');
        }
      };draw();
    });
  }
  simulationSlide(33,'s1-epargne','Que se passe-t-il si l’on épargne davantage ?',
    G.list(['Investissement plus élevé','Accumulation de capital','Même croissance de long terme']),['saving'],'saving',
    '',{staticKeys:['saving']});

  simulationSlide(34,'s1-niveau-taux','Effet de niveau ou effet de croissance ?',
    G.list([`${math('s × 2')} → niveau à long terme ${math('× √2')}`,`${math('A × 2')} → immédiatement ${math('Y × 2')}`,`Puis niveau à long terme ${math('× 2<sup>3/2</sup>')}`])+call('Les pentes équilibrées finales restent identiques.'),['saving','productivity','productivityDown'],'productivity',
    '',{staticText:`Changements de niveau à l’année 20. La croissance par habitant revient à ${math('1,5 %')}. Au saut de ${math('A')}, le taux instantané n’est pas défini.`});

  simulationSlide(35,'s1-demographie','Que change la démographie ?',
    G.list([`${math('n')} plus faible → maintien plus faible`,'Niveau par habitant plus élevé','Croissance totale de long terme plus faible'])+call(`Par habitant : toujours ${math('1,5 %')}. Au total : ${math('2 % → 1,5 %')}.`),['demography'],'demography',
    '',{total:true,staticKeys:['demography'],staticText:`${math('n : 0,5 % → 0 %')}. Croissance équilibrée par habitant inchangée (${math('1,5 %')}). Croissance du PIB total : ${math('2 % → 1,5 %')}.`});

  simulationSlide(36,'s1-progres-technique','Que change une progression plus rapide de la PGF ?',
    eq(`${f(dot('E'),'E')} = ${f('γ','1−α')}`)+G.list([`${math('γ = 1 % → 1,5 %')} par habitant`,`${math('γ = 2 % → 3 %')} par habitant`,`${math('γ = 0 % → 0 %')} par habitant`]),['faster','noProgress'],'faster',
    '',{compact:true,staticText:`Trois rythmes exogènes de PGF. À long terme par habitant : ${math('1,5 %')} (référence), ${math('3 %')} (${math('γ = 2 %')}) ou ${math('0 %')} (${math('γ = 0 %')}).`});

  add(37,'s1-convergence-conditionnelle','La convergence est conditionnelle',
    G.cols(G.list(['Mêmes paramètres et même technologie : même sentier','Paramètres différents : sentiers différents'])+
      call('La pauvreté seule ne suffit pas à prédire un rattrapage.')+controls('case',[['same','Même épargne'],['different','Épargnes différentes']]),G.chart('s1-convergence-conditionnelle-chart',470))+
    `<p class="g-note" id="s1-convergence-legende"></p>`,
    '',{prov:'sim'});
  G.on('s1-convergence-conditionnelle',(el,ctx)=>{
    const draw=()=>{
      const choice=bind(el,'case','same',ctx,draw);
      const definitions=ctx.static?[['Même épargne, départ bas',{kInitial:2},'#001F5F'],['Même épargne, départ haut',{kInitial:16},'#B45309'],['Épargne 12 %, départ bas',{kInitial:2,base:{s:.12}},'#6B7280']]:choice==='same'?[['Capital initial bas',{kInitial:2},'#001F5F'],['Capital initial haut',{kInitial:16},'#B45309']]:[['Épargne 12 %',{kInitial:2,base:{s:.12}},'#001F5F'],['Épargne 24 %',{kInitial:16},'#B45309']];
      const series=definitions.map(([name,scenario,color],i)=>({name,color,dash:i===2?'7 5':undefined,data:M.sample(scenario,150).map(r=>[r.t,Math.log(r.yPerCapita)]),format:x=>number(x,2)}));
      G.line('s1-convergence-conditionnelle-chart',{animate:ctx.animate,legend:true,x:{min:0,max:150,ticks:[0,30,60,90,120,150]},y:{zero:false},xTitle:'Années',yTitle:'Logarithme du PIB par habitant',series});
      el.querySelector('#s1-convergence-legende').innerHTML=ctx.static?`Deux trajectoires à ${math('s = 24 %')} se rapprochent. Une épargne de ${math('12 %')} conduit à un autre sentier.`:choice==='same'?`Même PGF initiale, même part en emploi, ${math('s = 24 %')}. Capitaux normalisés initiaux : ${math('2')} et ${math('16')}.`:`Même PGF initiale. Taux d’épargne : ${math('12 %')} et ${math('24 %')}. Les sentiers de long terme diffèrent.`;
    };draw();
  });

  add(38,'s1-bilan','Ce que Solow explique et ce qu’il laisse ouvert',
    `<div class="g-two"><div class="g-col"><p style="font-size:26px;color:#536078">Production et allocation</p>${eq('Y = AK<sup>α</sup>L<sup>1−α</sup>')}${eq('I = sY &emsp; C = Y − I')}<div data-step="1">${eq(`r = α ${f('Y','K')}`)}</div></div><div class="g-col"><p style="font-size:26px;color:#536078">Dynamique</p>${eq(`${dot('K')} = I − δK`)}${eq(`${dot('L')} = nL &emsp; ${dot('A')} = γA`)}<div data-step="1">${eq(`w = (1−α) ${f('Y','L')}`)}</div></div></div>`+
    step(2,G.list(['Accumulation et transition expliquées','Épargne et progrès technique donnés','Prochaine étape : mesurer les contributions'])) ,
    '');
})();
