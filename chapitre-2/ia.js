
(function(){
  'use strict';
  const G=window.G2,M=window.IACroissance,C=window.Charts,part=G.titles[3];
  if(!M)throw new Error('Modèle de croissance IA absent');
  const navy='#001F5F',orange='#B45309',slate='#65758B';
  const m=x=>`<span class="g-math">${x}</span>`,f=G.f,dot=G.dot,ul=G.list;
  const eq=x=>`<span class="ia-eq g-math">${x}</span>`;
  const split=(left,right)=>`<div class="ia-split"><div>${left}</div><div>${right}</div></div>`;
  const card=(title,body,{orange=false,step=0}={})=>`<div class="ia-card${orange?' ia-orange':''}"${step?` data-step="${step}"`:''}><h2>${title}</h2>${body}</div>`;
  const context=items=>`<div class="ia-context">${ul(items).replace('g-bullets','g-bullets ia-small')}</div>`;
  const link=(url,text)=>`<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  const ajj=link('https://web.stanford.edu/~chadj/AJJ-AIandGrowth.pdf','Aghion, Jones et Jones (2019)'),
    proof=link('https://web.stanford.edu/~chadj/explosivegrowthChatGPT5.2.pdf','preuve diffusée par C. Jones (2026)'),
    jep=link('https://doi.org/10.1257/jep.20261505','C. Jones (2026)'),
    ben=link('https://www.kellogg.northwestern.edu/faculty/jones-ben/htm/Artificial_Intelligence_in_Research_and_Development.pdf','B. Jones (2025)');
  const source=`Adapté d’${ajj}, §9.2–9.4.`;
  function add(obj){G.add({part,cls:'ia-slide',source,...obj});}
  const chart=(id,title,{height=430,note='',controls='',math=false}={})=>`<div class="ia-visual${math?' ia-chart-math':''}"><div class="ia-chart-title">${ul([title])}</div>${controls}${G.chart(id,height)}${note?`<div class="ia-chart-note">${ul([note])}</div>`:''}</div>`;


  add({id:'s4',title:part,layout:'section',html:G.plan(3),source:''});

  add({id:'s4-deux-canaux',title:'L’IA peut produire et aider à inventer',html:split(
    card('Produire',ul(['Confier des tâches à des machines.',`Accroître la production avec le capital.${eq('K → Y')}`])),
    card('Inventer',ul(['Aider les chercheurs à trouver des idées.',`Améliorer les façons de produire.${eq(`K → ${dot('A')} → Y`)}`]),{orange:true,step:1}))});

  add({id:'s4-modele',title:'Solow, avec une production d’idées',html:split(
    `<div class="ia-system">${card('Le modèle',ul([
      `Produire${eq('Y = A K<sub>Y</sub><sup>α</sup>L<sub>Y</sub><sup>1−α</sup>')}`,
      `Investir${eq(`${dot('K')} = sY − δK`)}`,
      `<strong>Inventer</strong>${eq(`${dot('A')} = zK<sub>R</sub><sup>η</sup>S<sup>1−η</sup>A<sup>φ</sup>`)}`
    ]))}</div>`,
    `<div class="ia-definitions">${ul([
      `${m('A')} : productivité globale des facteurs.`,
      [`${m('K<sub>Y</sub>, L<sub>Y</sub>')} : capital et travail pour produire.`,1],
      [`${m('K<sub>R</sub>, S')} : capital et chercheurs pour inventer.`,1],
      [`${m('z')} : efficacité de la recherche.`,1]
    ])}<div class="ia-context" data-step="2">${ul([
      `Parts fixes : ${m('K = K<sub>Y</sub> + K<sub>R</sub>')}.`,
      `Travail total constant : ${m('L = L<sub>Y</sub> + S')}.`
    ])}</div></div>`)});

  add({id:'s4-production',title:'Automatiser renforce le rôle du capital',prov:'sim',html:split(
    ul([
      `Une tâche automatisée est réalisée avec du <strong>capital</strong>.${eq('Y = A K<sub>Y</sub><sup>α</sup>L<sub>Y</sub><sup>1−α</sup>')}`,
      [`Plus de tâches automatisées : un poids ${m('α')} plus élevé.`,1],
      [`Si ${m('α &lt; 1')}, les rendements restent décroissants.`,2]
    ]),chart('ia-production-chart','Production, indice initial = 1',{math:true,note:`${m('A')} et ${m('L<sub>Y</sub>')} constants ; exemples normalisés.`}))});

  add({id:'s4-innovation',title:'Le capital peut aussi produire des idées',prov:'sim',html:split(
    ul([
      `Les machines assistent les chercheurs.${eq(`${dot('A')} = zK<sub>R</sub><sup>η</sup>S<sup>1−η</sup>A<sup>φ</sup>`)}`,
      [`${m('η')} mesure le rôle du capital dans la recherche.`,1],
      [`${m('φ &lt; 1')} : garder le même progrès en % exige plus de moyens.`,2]
    ]),chart('ia-innovation-chart','Production d’idées, indice initial = 1',{math:true,note:`${m('A, S, z')} constants ; exemples normalisés.`})),source:`${ajj}, §9.3 et exemple 3 ; ${ben}.`});

  add({id:'s4-boucle',title:'Produire et inventer se renforcent',html:split(
    ul([
      'De meilleures idées permettent de <strong>produire plus</strong>.',
      ['Une partie de ce surplus finance le <strong>capital de recherche</strong>.',1],
      ['Ce capital aide à trouver de nouvelles idées.',2]
    ]),card('La boucle capital–idées',ul([
      `Produire${eq('A ↑ &nbsp;→&nbsp; Y ↑')}`,
      [`Investir${eq('sY ↑ &nbsp;→&nbsp; K<sub>R</sub> ↑')}`,1],
      [`Inventer${eq(`${dot('A')} ↑ &nbsp;→&nbsp; A ↑`)}`,2]
    ])))});

  add({id:'s4-seuil',title:'Trois régimes de croissance',prov:'sim',html:split(
    ul([
      `Force de la boucle${eq(`Γ = ${f('η','(1−α)(1−φ)')}`)}`,
      `<span class="ia-regime" style="color:${slate}">Γ &lt; 1</span> : le taux tend vers zéro.`,
      [`<span class="ia-regime">Γ = 1</span> : un taux constant à long terme.`,1],
      [`<span class="ia-regime" style="color:${orange}">Γ &gt; 1</span> : divergence en temps fini dans le modèle.`,2]
    ])+context([`${m('L')} et parts d’allocation constants ; ${m('δ = 0')}.`,'Exemple illustratif, pas une prévision.']),
    chart('ia-regimes-chart','Trois trajectoires du même système',{height:410,math:true,
      controls:`<div class="g-controls ia-controls" role="group" aria-label="Représentation des trajectoires"><button type="button" data-ia-view="growth" aria-pressed="true">Taux de croissance</button><button type="button" data-ia-view="level" aria-pressed="false">Niveau · échelle log</button></div>`,
      note:`${m('α = 1/3, φ = 1/2')} ; ${m('η = 1/6, 1/3, 1/2')}.`
    })),source:`${ajj}, exemple 3 ; ${proof}.`});

  add({id:'s4-calcul',title:'Calculer la force de la boucle',cls:'ia-slide g-exercise',html:split(
    ul([
      `Prenons ${m('α = 1/3')} et ${m('φ = 1/2')}.`,
      `Calculer ${m('Γ')} pour chaque valeur de ${m('η')}.`
    ])+context(['Valeurs illustratives.',`${m('L')} et parts fixes ; ${m('δ = 0')}.`]),
    `<table class="ia-table" aria-label="Calcul de la force de la boucle"><thead><tr><th scope="col">${m('η')}</th><th scope="col">${m('Γ')}</th><th scope="col">Régime</th></tr></thead><tbody>
      <tr><td>1/6</td><td></td><td></td></tr>
      <tr><td>1/3</td><td></td><td></td></tr>
      <tr><td>1/2</td><td></td><td></td></tr>
    </tbody></table>`),source:`Modèle simplifié d’après ${ajj} ; ${proof}.`});

  add({id:'s4-goulots',title:'Une tâche peut limiter l’ensemble',prov:'sim',html:split(
    ul([
      `Découvrir ${m('(x₁)')} et tester ${m('(x₂)')} sont <strong>complémentaires</strong>.${eq(`Q = ${f('2','1/x₁ + 1/x₂')}`)}`,
      [`Découverte ${m('× 10')}, tests inchangés : résultat ${m('× 1,82')}.`,1],
      [`Avec ${m('x₂ = 1')}, le résultat reste inférieur à ${m('2')}.`,2]
    ]),chart('ia-goulots-chart','Résultat de la recherche, indice initial = 1',{height:420,
      controls:'',note:`Tests inchangés : ${m('x₂ = 1')}.`
    })+`<div class="ia-slider"><label for="ia-capacite">Découverte ${m('x₁')} = <output id="ia-capacite-val" for="ia-capacite">1</output></label><input id="ia-capacite" type="range" min="1" max="20" step="0.5" value="1" aria-label="Capacité de découverte, indice initial 1"></div>`),source:`Exemple harmonique adapté de ${jep}, p. 9–12 ; complément : ${ben}.`});

  add({id:'s4-message',title:'L’IA peut accélérer la croissance, sous conditions',html:split(
    card('Deux canaux',ul([
      '<strong>Produire :</strong> confier plus de tâches au capital.',
      ['<strong>Inventer :</strong> utiliser ce capital pour améliorer la productivité.',1]
    ])),
    card('Deux conditions',ul([
      ['Des rendements suffisants pour entretenir la boucle.',1],
      ['Des tâches complémentaires qui ne bloquent pas les gains.',2]
    ]),{orange:true})),source:`${ajj} ; ${ben} ; ${jep}.`});


  const curve=(fn,max=8,n=160,min=0)=>Array.from({length:n+1},(_,i)=>{const x=min+(max-min)*i/n;return [x,fn(x)];});
  function line(id,ctx,options){return G.line(id,{animate:ctx.entry?ctx.animate:false,duration:2,legend:false,margin:{l:65,r:132,t:20,b:74},labelGap:28,...options});}
  G.on('s4-production',(el,ctx)=>line('ia-production-chart',ctx,{
    x:{min:0,max:8,ticks:[0,2,4,6,8]},y:{min:0,max:4.5,ticks:[0,1,2,3,4]},xTitle:'Capital de production, indice initial = 1',
    series:[{name:'α = 1/3',endLabel:true,color:navy,data:curve(x=>M.production(x,1/3)),format:x=>G.fmt(x,2)},
      {name:'α = 2/3',endLabel:true,color:orange,dash:'8 5',data:curve(x=>M.production(x,2/3)),format:x=>G.fmt(x,2)}],
    markers:[{x:1,y:1,color:slate,label:'Départ : 1',dx:12,dy:34,anchor:'start'}]
  }));
  G.on('s4-innovation',(el,ctx)=>line('ia-innovation-chart',ctx,{
    x:{min:0,max:9,ticks:[0,1,3,6,9]},y:{min:0,max:3.5,ticks:[0,1,2,3]},xTitle:'Capital de recherche, indice initial = 1',
    series:[{name:'η = 0',endLabel:true,color:slate,dash:'7 6',data:curve(x=>M.research(x,0),9,160,.01),format:x=>G.fmt(x,2)},
      {name:'η = 1/2',endLabel:true,color:navy,data:curve(x=>M.research(x,1/2),9),format:x=>G.fmt(x,2)}],
    markers:[{x:1,y:1,color:orange,label:'Départ : 1',dx:12,dy:34,anchor:'start'}]
  }));
  const regimes=[{eta:1/6,name:'Γ = 0,5',color:slate,dash:'4 6'},
    {eta:1/3,name:'Γ = 1',color:navy},
    {eta:1/2,name:'Γ = 1,5',color:orange,dash:'9 5'}]
    .map(o=>({...o,rows:M.trajectory(o.eta)}));
  G.on('s4-seuil',(el,ctx)=>{
    const draw=()=>{
      const mode=ctx.static?'growth':el.dataset.iaView||'growth',levels=mode==='level';
      el.querySelectorAll('[data-ia-view]').forEach(button=>{
        button.setAttribute('aria-pressed',String(button.dataset.iaView===mode));
        button.onclick=event=>{event.stopPropagation();el.dataset.iaView=button.dataset.iaView;draw();button.blur();};
      });
      line('ia-regimes-chart',{...ctx,entry:false,animate:false},{margin:{l:80,r:140,t:58,b:74},
        x:{min:0,max:6,ticks:[0,2,4,6]},xTitle:'Temps (unités du modèle)',
        y:levels?{min:1,max:100000,log:true,ticks:[1,10,100,1000,10000,100000],format:x=>G.fmt(x,0)}:{min:0,max:3,ticks:[0,1,2,3]},
        yTitle:levels?'Production Y, indice initial = 1':'Taux de croissance, indice initial = 1',
        series:regimes.map(o=>({name:o.name,endLabel:true,color:o.color,dash:o.dash,data:o.rows.filter((_,i)=>i%10===0).map(r=>[r.t,levels?r.Y:r.gY]),format:x=>G.fmt(x,2)}))
      });
    };
    draw();
  });
  G.on('s4-goulots',(el,ctx)=>{
    const input=el.querySelector('#ia-capacite'),output=el.querySelector('#ia-capacite-val');
    if(ctx.static||ctx.entry||Number(el.dataset.iaStep)!==ctx.step)input.value=(ctx.static||ctx.step>=1)?10:1;
    el.dataset.iaStep=ctx.step;
    const graph=line('ia-goulots-chart',ctx,{margin:{l:60,r:142,t:20,b:74},
      x:{min:0,max:20,ticks:[0,5,10,15,20]},y:{min:0,max:2.25,ticks:[0,1,2]},xTitle:'Capacité de découverte, x₁',
      series:[{name:'Résultat Q',endLabel:true,color:navy,data:curve(x=>M.bottleneck(x),20),format:x=>G.fmt(x,2)}],
      refLines:[{y:2,color:slate,dash:'6 6'}]
    });
    if(!graph.svg.querySelector('.ia-limit-label'))C.txt(graph.svg,graph.S.X(20)+8,graph.S.Y(2)-14,'Plafond : 2','ch-lab ia-limit-label',{fill:slate});
    function point(){
      const x=ctx.static?10:Number(input.value),q=M.bottleneck(x);output.value=G.fmt(x,x%1?1:0);
      graph.svg.querySelector('.ia-cursor')?.remove();
      const g=C.el('g',{class:'ia-cursor'},graph.svg),X=graph.S.X(x),Y=graph.S.Y(q);
      C.el('line',{x1:X,x2:X,y1:graph.S.Y(0),y2:Y,stroke:orange,'stroke-width':2,'stroke-dasharray':'5 5'},g);
      C.el('circle',{cx:X,cy:Y,r:7,fill:orange,stroke:'#fff','stroke-width':2},g);
      C.txt(g,X,Y+35,'Q = '+G.fmt(q,2),'ch-val',{'text-anchor':'middle',fill:orange,'font-style':'italic'});
    }
    input.oninput=point;point();
  });
})();
