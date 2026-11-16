/* Section 4, demandée le 16 novembre 2026. Dix écrans, quatre graphiques natifs.
 * Sources intégralement lues : sources/litterature_ia/. Modèle : ia_modele.js. */
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
  function add(obj,notes){G.add({part,cls:'ia-slide',source,...obj,notes});}
  const chart=(id,title,{height=430,note='',controls='',math=false}={})=>`<div class="ia-visual${math?' ia-chart-math':''}"><div class="ia-chart-title">${ul([title])}</div>${controls}${G.chart(id,height)}${note?`<div class="ia-chart-note">${ul([note])}</div>`:''}</div>`;
  const modelNotes='<p>Spécialisation pédagogique de l’exemple 3 d’AJJ, p. 256–257 : σ = 1 pour conserver A comme PGF multiplicative, β renommé η car β désigne les matières premières en section 3, λ = 1−η. K_Y = (1−κ)K, K_R = κK, L_Y = (1−ℓ)L, S = ℓL, avec parts κ,ℓ constantes entre zéro et un, L constant et stocks initiaux positifs. Le capital rival est réparti, pas compté deux fois. C = (1−s)Y. Aucune optimisation des allocations ou du financement de la recherche. Les ressources naturelles et h ne sont pas explicités : cette omission ne réfute pas les contraintes de l’écran s3-monde-fini.</p>';

  add({id:'s4',title:part,layout:'section',html:G.plan(3),source:''},
    '<p>La quatrième section suit s3-monde-fini et précède la conclusion. Elle reprend le plan commun sur fond marine. Deux canaux : production et innovation. Le modèle est une spécialisation pédagogique, pas une prévision quantitative.</p>');

  add({id:'s4-deux-canaux',title:'L’IA peut produire et aider à inventer',html:split(
    card('Produire',ul(['Confier des tâches à des machines.',`Accroître la production avec le capital.${eq('K → Y')}`])),
    card('Inventer',ul(['Aider les chercheurs à trouver des idées.',`Améliorer les façons de produire.${eq(`K → ${dot('A')} → Y`)}`]),{orange:true,step:1}))},
    '<p>AJJ, §9.2–9.3. Dans le premier canal, le capital réalise des tâches de production. Dans le second, il contribue à la production de connaissances. Le capital comprend ici les équipements informatiques mobilisés par les systèmes d’IA. Les capacités de calcul et le temps des chercheurs sont rivaux ; une idée peut servir simultanément à plusieurs producteurs. Les flèches indiquent des canaux, pas deux contributions mesurées à additionner.</p>');

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
    ])}</div></div>`)},modelNotes+
    '<p>Le modèle complet est visible dès l’entrée. Les notations apparaissent ensuite à droite. 0 &lt; α &lt; 1, 0 ≤ η &lt; 1, φ &lt; 1, s et z positifs. η et φ sont expliqués à l’écran sur la recherche. Par rapport à Solow, la loi exogène Ȧ = γA est remplacée : le rythme de la PGF dépend maintenant de moyens de recherche.</p>');

  add({id:'s4-production',title:'Automatiser renforce le rôle du capital',prov:'sim',html:split(
    ul([
      `Une tâche automatisée est réalisée avec du <strong>capital</strong>.${eq('Y = A K<sub>Y</sub><sup>α</sup>L<sub>Y</sub><sup>1−α</sup>')}`,
      [`Plus de tâches automatisées : un poids ${m('α')} plus élevé.`,1],
      [`Si ${m('α &lt; 1')}, les rendements restent décroissants.`,2]
    ]),chart('ia-production-chart','Production, indice initial = 1',{math:true,note:`${m('A')} et ${m('L<sub>Y</sub>')} constants ; exemples normalisés.`}))},
    '<p>AJJ, §9.2.1, p. 239–241, interprétation de Zeira : dans ce modèle de tâches particulier, α mesure le poids des tâches automatisées. Ce n’est pas une mesure empirique du pourcentage de tâches automatisées. Les courbes tracent Y/Y₀ = (K_Y/K_Y₀)^α, avec α = 1/3 ou 2/3. Elles sont toutes deux normalisées à un pour K_Y/K_Y₀ = 1. À capital multiplié par huit, la production est multipliée par deux ou quatre. Cette comparaison montre des élasticités, pas un gain de niveau obtenu gratuitement en changeant α : la constante de normalisation issue de l’agrégateur de tâches dépend elle-même de l’automatisation.</p><p>À PGF exogène croissant au taux γ, la croissance équilibrée par travailleur vaut γ/(1−α). Ce rappel peut être fait oralement mais ne résout pas encore la boucle d’innovation. Les deux courbes sont révélées ensemble ; les clics de texte ne les redessinent pas.</p>');

  add({id:'s4-innovation',title:'Le capital peut aussi produire des idées',prov:'sim',html:split(
    ul([
      `Les machines assistent les chercheurs.${eq(`${dot('A')} = zK<sub>R</sub><sup>η</sup>S<sup>1−η</sup>A<sup>φ</sup>`)}`,
      [`${m('η')} mesure le rôle du capital dans la recherche.`,1],
      [`${m('φ &lt; 1')} : garder le même progrès en % exige plus de moyens.`,2]
    ]),chart('ia-innovation-chart','Production d’idées, indice initial = 1',{math:true,note:`${m('A, S, z')} constants ; exemples normalisés.`})),source:`${ajj}, §9.3 et exemple 3 ; ${ben}.`},modelNotes+
    '<p>Les courbes tracent Ȧ/Ȧ₀ = (K_R/K_R₀)^η : η = 0 (aucun effet du capital) et η = 1/2. À autres facteurs constants, +1 % de K_R donne environ +η % de production d’idées. Ce sont des élasticités illustratives, pas une estimation des outils d’IA actuels. L’IA peut aussi accroître z : performance d’un outil et étendue des tâches auxquelles il s’applique sont distinctes.</p><p>Le cours avait présenté Ȧ/A = zS, cas η = 0 et φ = 1. On retient maintenant φ &lt; 1 : à ressources constantes, Ȧ/A baisse quand A augmente. Cela ne demande pas φ &lt; 0. Exemples à donner oralement : code, exploration de molécules, analyse de données. Les expériences et la validation clinique ne deviennent pas automatiquement plus rapides.</p>');

  add({id:'s4-boucle',title:'Produire et inventer se renforcent',html:split(
    ul([
      'De meilleures idées permettent de <strong>produire plus</strong>.',
      ['Une partie de ce surplus finance le <strong>capital de recherche</strong>.',1],
      ['Ce capital aide à trouver de nouvelles idées.',2]
    ]),card('La boucle capital–idées',ul([
      `Produire${eq('A ↑ &nbsp;→&nbsp; Y ↑')}`,
      [`Investir${eq('sY ↑ &nbsp;→&nbsp; K<sub>R</sub> ↑')}`,1],
      [`Inventer${eq(`${dot('A')} ↑ &nbsp;→&nbsp; A ↑`)}`,2]
    ])))},modelNotes+
    '<p>Ces flèches sont des effets toutes choses égales par ailleurs. Y augmente le flux d’investissement, puis le stock K ; la part de recherche constante transmet ce mouvement à K_R. Il n’y a pas de saut instantané de capital. La boucle positive ne suffit pas à prouver que le taux de croissance augmente : il faut tenir compte des rendements décroissants dans les deux équations.</p>');

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
    })),source:`${ajj}, exemple 3 ; ${proof}.`},modelNotes+
    '<p>La preuve initiale p. 257 d’AJJ est erronée. La correction intermédiaire de Trammell est retirée. La note diffusée par Charles Jones le 2 janvier 2026, issue de ChatGPT 5.2 Pro, donne une preuve détaillée pour δ = 0 ; son extension avec dépréciation est seulement évoquée. Le seuil projeté conserve donc δ = 0. Γ &lt; 1 : les niveaux peuvent augmenter sans borne alors que les taux tendent vers zéro. Γ = 1 : régime asymptotiquement exponentiel. Γ &gt; 1 : divergence mathématique en temps fini, distincte d’une simple accélération et d’une prévision économique.</p>'+
    '<p>Graphique : système réduit K̇ = cAK^α, Ȧ = dK^ηA^φ, c = 1, d = 2/3, K₀ = A₀ = 1, α = 1/3, φ = 1/2. Les trois trajectoires ne diffèrent que par η. Y/Y₀ = AK^α. Même croissance initiale de Y, égale à un par unité de temps du modèle. L’axe du taux est normalisé par ce taux initial, et n’exprime pas des pourcentages annuels. Horizon 0–6 unités abstraites ; aucune date de singularité réelle. Pour η = 1/3, K = exp(t), A = exp(2t/3), Y = exp(t), exactement. Les autres trajectoires sont intégrées en logarithmes par RK4. La vue niveau est logarithmique pour rendre comparables les trois trajectoires ; lecture et impression reviennent à la vue des taux.</p>'+
    '<p>Vérification indépendante pour δ = 0 : A^(2−φ)/(2−φ) − (d/c)K^(1+η−α)/(1+η−α) est constant. Asymptotiquement K̇ est proportionnel à K^p, avec p−1 = [η−(1−α)(1−φ)]/(2−φ). L’intégrale du temps converge à l’infini si et seulement si Γ &gt; 1. Démonstration complète : plan_section_4_ia.md.</p>');

  add({id:'s4-calcul',title:'Calculer la force de la boucle',cls:'ia-slide g-exercise',html:split(
    ul([
      `Prenons ${m('α = 1/3')} et ${m('φ = 1/2')}.`,
      `Calculer ${m('Γ')} pour chaque valeur de ${m('η')}.`,
      [`${eq(`Γ = ${f('η','(2/3) × (1/2)')} = 3η`)}`,1]
    ])+context(['Valeurs illustratives.',`${m('L')} et parts fixes ; ${m('δ = 0')}.`]),
    `<table class="ia-table" aria-label="Calcul de la force de la boucle"><thead><tr><th scope="col">${m('η')}</th><th scope="col">${m('Γ')}</th><th scope="col">Régime</th></tr></thead><tbody>
      <tr><td>1/6</td><td><span data-step="2">1/2</span></td><td><span data-step="2">Le taux tend vers zéro</span></td></tr>
      <tr><td>1/3</td><td><span data-step="3">1</span></td><td><span data-step="3">Croissance exponentielle</span></td></tr>
      <tr><td>1/2</td><td><span data-step="4">3/2</span></td><td><span data-step="4">Divergence en temps fini</span></td></tr>
    </tbody></table>`),source:`Modèle simplifié d’après ${ajj} ; ${proof}.`},
    '<p>Réponses pédagogiques au clic, toutes visibles en lecture et à l’impression. Le seuil est η* = (1−α)(1−φ) = 1/3. Ces nombres ne sont pas une calibration de l’économie ni une estimation de notre proximité d’une singularité. Le calcul vise à interpréter des paramètres, pas à mémoriser une preuve. Le taux nul à la limite ne signifie pas un niveau de production constant.</p>');

  add({id:'s4-goulots',title:'Une tâche peut limiter l’ensemble',prov:'sim',html:split(
    ul([
      `Découvrir ${m('(x₁)')} et tester ${m('(x₂)')} sont <strong>complémentaires</strong>.${eq(`Q = ${f('2','1/x₁ + 1/x₂')}`)}`,
      [`Découverte ${m('× 10')}, tests inchangés : résultat ${m('× 1,82')}.`,1],
      [`Avec ${m('x₂ = 1')}, le résultat reste inférieur à ${m('2')}.`,2]
    ]),chart('ia-goulots-chart','Résultat de la recherche, indice initial = 1',{height:420,
      controls:'',note:`Tests inchangés : ${m('x₂ = 1')}.`
    })+`<div class="ia-slider"><label for="ia-capacite">Découverte ${m('x₁')} = <output id="ia-capacite-val" for="ia-capacite">1</output></label><input id="ia-capacite" type="range" min="1" max="20" step="0.5" value="1" aria-label="Capacité de découverte, indice initial 1"></div>`),source:`Exemple harmonique adapté de ${jep}, p. 9–12 ; complément : ${ben}.`},
    '<p>Q = 2/(1/x₁ + 1/x₂), normalisé pour Q = 1 lorsque x₁ = x₂ = 1. Avec x₂ = 1, Q = 2x₁/(x₁+1), donc Q(10) = 20/11 ≈ 1,82 et Q tend vers deux lorsque x₁ tend vers l’infini. Le second intrant reste fixe. Cet exemple n’est pas le calcul à budget fixe avec réallocation optimale de Benjamin Jones (2025). Q est un indice illustratif, pas une nouvelle équation de PIB ajoutée au système précédent.</p><p>Les molécules et les essais sont une analogie pédagogique, pas une estimation du processus clinique. Les contraintes humaines et physiques, l’adoption et les complémentarités peuvent limiter les gains. La Cobb–Douglas précédente suppose davantage de possibilités de substitution. Des goulots freinent une accélération ; ils ne prouvent pas qu’elle est impossible. Le curseur déplace un point sur la courbe sans modifier le tracé ; la lecture et l’impression montrent le calcul x₁ = 10. Les références et leurs versions sont détaillées dans sources/litterature_ia/revue_et_corrections.md.</p>');

  add({id:'s4-message',title:'L’IA peut accélérer la croissance, sous conditions',html:split(
    card('Deux canaux',ul([
      '<strong>Produire :</strong> confier plus de tâches au capital.',
      ['<strong>Inventer :</strong> utiliser ce capital pour améliorer la productivité.',1]
    ])),
    card('Deux conditions',ul([
      ['Des rendements suffisants pour entretenir la boucle.',1],
      ['Des tâches complémentaires qui ne bloquent pas les gains.',2]
    ]),{orange:true})),source:`${ajj} ; ${ben} ; ${jep}.`},
    '<p>Conclusion de la section, avant la séparation bleue de conclusion générale. Le modèle explique un mécanisme ; les paramètres et contraintes décident du résultat. Les scénarios d’Anthropic figurent déjà dans l’introduction : leurs écarts de PIB en 2030 ne sont pas des estimations du seuil Γ. Leurs gains d’innovation à court horizon ne réfutent pas la boucle de long terme d’AJJ.</p><p>Transition orale vers la conclusion générale : le moteur proportionnel décrit les régimes exponentiels usuels. Le cas Γ &gt; 1 exploré ici est une exception à ce régime à taux constant. Les ressources naturelles omises du petit modèle d’IA restent des contraintes possibles ; la compatibilité environnementale n’est pas démontrée par les équations.</p>');

  /* Quatre graphiques : tous utilisent le moteur natif et son survol/clavier. */
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
