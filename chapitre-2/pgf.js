
(function(){
  'use strict';
  const G=window.G2,P=window.CH02_PGF,CD=window.CH02_COMPTA_DATA,C=window.Charts;
  if(!G||!P||!CD)throw new Error('Composants ou données de la section PGF absents');
  const part=G.titles[2],navy='#001F5F',orange='#B45309',slate='#526780',grey='#8A9BA8';
  const fmt=(x,d=1)=>C.fmt(x,d);
  const m=html=>`<span class="g-math">${html}</span>`;
  const link=(url,label)=>`<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
  const points=items=>G.list(items);
  const visual=(id,height,title,after='')=>`<div class="pgf-visual"><p class="pgf-chart-title">${title}</p>${G.chart(id,height)}${after}</div>`;
  const split=(text,right,cls='')=>`<div class="pgf-split ${cls}"><div class="pgf-text">${text}</div>${right}</div>`;
  const add=(n,obj)=>G.add({part,cls:'pgf-slide',source:'',...obj});

  const sujets=['idées','éducation','recherche et développement','automatisation','qualité des institutions','management','allocation des facteurs'];
  const sujet=i=>`Ce qu’il y a dans la PGF (${i}) : ${sujets[i-1]}`;
  const sources={
    pwt:link('https://www.rug.nl/ggdc/productivity/pwt/','Penn World Table 11.0'),
    owid:(slug,label)=>link('https://ourworldindata.org/grapher/'+slug,label)
  };



  add(57,{id:'s3',layout:'section',title:part,html:G.plan(2)});

  const residu=CD.countries.map(c=>({name:c.name,sans:c.aRatio*c.hFactor,avec:c.aRatio}));
  add(58,{id:'s3-solow-exogene',title:'Manna from heaven ?',prov:'obs',html:split(points([
    `Chez Solow, ${m('A')} tombe du ciel : le modèle décrit ses effets, pas son origine.`,
    `Or ${m('A')} pèse <strong>50 à 61 %</strong> des écarts de production par travailleur.`,
    ['Abramovitz (1956) : la PGF est une <strong>« mesure de notre ignorance »</strong>. Elle dépend de ce que l’on sait mesurer.',1]
  ]),visual('pgf-residu-chart',500,'PGF résiduelle en 2023, États-Unis = 100',
    `<div class="pgf-legend"><span><i style="background:${grey}"></i>Sans compter le capital humain</span><span data-step="1"><i style="background:${navy}"></i>En comptant le capital humain</span></div>`)),
  source:`${link('https://doi.org/10.2307/1884513','Solow (1956)')} ; Abramovitz (1956), Resource and Output Trends in the United States since 1870. Calculs : ${sources.pwt}, 2023, α = 1/3.`});

  add(59,{id:'s3-croissance-endogene',title:sujet(1),html:split(`
    <p class="pgf-lead">La <strong>croissance par les idées</strong>, ou croissance endogène : la PGF augmente quand des chercheurs trouvent de nouvelles idées.</p>
    <p class="pgf-list-title">Une idée est :</p>
    ${points([
      '<strong>non rivale</strong> : elle sert à tous en même temps ;',
      '<strong>coûteuse à trouver</strong>, presque gratuite à reproduire ;',
      '<strong>cumulative</strong> : elle s’appuie sur les précédentes ;',
      '<strong>partiellement exclusive</strong> : un brevet ou le secret en réserve l’usage.'
    ])}`,
  `<div class="pgf-visual pgf-usines">
    <div class="pgf-card"><h3>Recopier l’usine</h3><p>${m('K')} et ${m('L × 2 &nbsp;⇒&nbsp; Y × 2')}</p><small>L’idée n’a pas besoin d’être recopiée : la seconde usine l’utilise aussi.</small></div>
    <div class="pgf-card pgf-card-accent" data-step="1"><h3>Recopier l’usine et doubler ${m('A')}</h3><p>${m('A')}, ${m('K')} et ${m('L × 2 &nbsp;⇒&nbsp; Y × 4')}</p><small>Les rendements d’échelle deviennent croissants.</small></div>
    <div class="pgf-idees" data-step="2">
      <div class="pgf-model">
        <div><span>Idées</span>${m(`${G.f(G.dot('A'),'A')} = z L<sub>chercheurs</sub>`)}</div>
        <div><span>Ressources</span>${m('L<sub>chercheurs</sub> + L<sub>production</sub> = L')}</div>
      </div>
      <p class="pgf-model-note">${m('z')} : efficacité de la recherche. Chez Solow, ce taux était donné, ${m('γ')}. Ici, il dépend du nombre de chercheurs.</p>
    </div>
  </div>`,'pgf-idees-slide'),
  source:`${link('https://doi.org/10.1086/261725','Romer (1990)')}, prix Nobel 2018 ; ${link('https://doi.org/10.2307/2951599','Aghion et Howitt (1992)')}, prix Nobel 2025.`});

  const ecole=P.scolarite.stats;
  add(60,{id:'s3-education',title:sujet(2),prov:'obs',html:split(points([
    `Les compétences mesurées sont dans ${m('h')}, pas dans ${m('A')}.`,
    `Ce qui reste dans ${m('A')} : la capacité à <strong>adopter</strong> les nouvelles technologies.`,
    [`En France : <strong>${fmt(ecole.france1900,1)} années</strong> d’études en moyenne en 1900, <strong>${fmt(ecole.france2010,1)}</strong> en 2010.`,1]
  ]),visual('pgf-scolarite-chart',540,'Années d’études moyennes, population de 15 à 64 ans')),
  source:`Lee et Lee (2016), Human Capital in the Long Run, via ${sources.owid('mean-years-of-schooling-long-run','Our World in Data')}. Estimations tous les cinq ans, 1870–2010.`});

  const rd=P.rd.stats;
  add(62,{id:'s3-recherche',title:sujet(3),prov:'obs',html:split(points([
    'Les dépenses de recherche et développement sont un <strong>intrant</strong> : elles paient des chercheurs, des équipements, des expériences.',
    'Ce qui est dans la PGF, ce n’est pas la dépense : c’est le <strong>capital d’idées</strong> qu’elle crée.',
    [`Objectif de l’Union européenne : <strong>3 % du PIB</strong>. Elle en est à ${fmt(rd.unionEuropeenne,1)} % en ${P.rd.lastYear}.`,1]
  ]),visual('pgf-rd-chart',540,'Dépenses de recherche et développement, en % du PIB')),
  source:`${link('https://data.worldbank.org/indicator/GB.XPD.RSDV.GD.ZS','Banque mondiale')}, source Institut de statistique de l’UNESCO, 1996–${P.rd.lastYear}.`});

  const robots=P.robots.stats;
  add(63,{id:'s3-automatisation',title:sujet(4),prov:'obs',html:split(points([
    '<strong>Automatiser</strong> : confier à une machine une tâche réalisée par une personne.',
    `Même production avec moins de travail : la productivité du travail, ${m('Y/L')}, augmente.`,
    ['Le travail humain va-t-il <strong>disparaître</strong> ?',1]
  ]),visual('pgf-robots-chart',510,'Robots industriels installés par an, en milliers',
    `<p class="pgf-caption">Monde : ${fmt(1000*robots.monde2012,0)} installations en 2012, ${fmt(1000*robots.monde2024,0)} en 2024, soit ${fmt(robots.multiple,1)} fois plus.</p>`)),
  source:`Fédération internationale de robotique, via AI Index Report (2026) et ${sources.owid('annual-industrial-robots-installed','Our World in Data')}. Valeurs arrondies au millier.`});

  const emploi=P.emploi.stats;
  add(64,{id:'s3-automatisation-travail',title:'Les tâches changent, l’emploi se déplace',prov:'obs',html:split(points([
    'Un métier réunit plusieurs <strong>tâches</strong> : certaines sont remplacées, d’autres complétées.',
    ['Produire moins cher permet de vendre plus : cet <strong>effet d’expansion</strong> peut soutenir l’emploi.',1],
    ['Les gains ne profitent pas à tous : salariés remplacés, entreprises concurrentes.',2]
  ]),visual('pgf-emploi-chart',510,'France : répartition de l’emploi par secteur, en %',
    `<p class="pgf-caption">Emploi total : ${fmt(emploi.totalDebut/1e6,0)} millions en ${emploi.debut}, ${fmt(emploi.totalFin/1e6,0)} millions en ${emploi.fin}.</p>`)),
  source:`Herrendorf, Rogerson et Valentinyi, via ${sources.owid('employment-by-economic-sector','Our World in Data')}. France, ${emploi.debut}–${emploi.fin} ; observations espacées avant 1970.`});

  const corees=P.corees.stats;
  add(65,{id:'s3-institutions',title:sujet(5),prov:'obs',html:split(points([
    'Les <strong>institutions</strong> : les règles qui organisent la vie économique et politique.',
    'Droits de propriété, contrats, concurrence : elles orientent les <strong>incitations</strong> à investir et à innover.',
    [`En 1940, le Nord est plus riche que le Sud. En 2022, le Sud est <strong>${fmt(corees.rapport2022,0)} fois</strong> plus riche.`,1]
  ]),visual('pgf-corees-chart',540,'PIB par habitant, en dollars de 2011')),
  source:`${link('https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023','Maddison Project Database 2023')}, dollars internationaux de 2011 (PPA). Acemoglu, Johnson et Robinson : prix Nobel 2024.`});

  const inst=P.institutions;
  const instText=`<p class="pgf-scope"><strong>${inst.points.length} pays</strong> en ${inst.year}. Chaque point est un pays.</p>`;
  const caution='<div class="g-panel orange pgf-caution"><h3>Une corrélation n’est pas une causalité</h3><p>Un pays riche peut aussi financer de meilleures institutions.</p></div>';
  add(66,{id:'s3-institutions-correlations',title:'De meilleures institutions vont avec un revenu plus élevé',prov:'obs',html:`
    <div class="g-live-only">${split(`${instText}${G.buttons('pgf-inst-choix',[['rl','État de droit'],['cc','Contrôle de la corruption']])}<div data-step="2">${caution}</div>`,
      visual('pgf-inst-chart',560,'<span id="pgf-inst-titre">État de droit</span> et PIB par habitant'),'pgf-inst')}<span data-step="1"></span></div>
    <div class="g-static-only pgf-inst-static">${instText}<div class="pgf-inst-pair"><div><p class="pgf-chart-title">État de droit et PIB par habitant</p>${G.chart('pgf-inst-chart-rl',400)}</div><div><p class="pgf-chart-title">Contrôle de la corruption et PIB par habitant</p>${G.chart('pgf-inst-chart-cc',400)}</div></div>${caution}</div>`,
  source:`${link('https://www.worldbank.org/en/publication/worldwide-governance-indicators','Banque mondiale, Worldwide Governance Indicators')} et PIB par habitant en parité de pouvoir d’achat, ${inst.year}.`});

  const scores=P.management.countries;
  add(67,{id:'s3-management',title:sujet(6),prov:'obs',html:split(points([
    'Des usines textiles indiennes, <strong>tirées au sort</strong>, reçoivent un conseil gratuit en management. Leur productivité augmente de <strong>17 %</strong> la première année.',
    ['Le management s’adopte comme une technologie, et toutes les entreprises ne l’adoptent pas.',1]
  ]),visual('pgf-management-chart',540,'Score moyen de management des entreprises industrielles, de 1 à 5')),
  source:`${link('https://doi.org/10.1093/qje/qjs044','Bloom, Eifert, Mahajan, McKenzie et Roberts (2013)')}. Scores : ${link('https://worldmanagementsurvey.org/','World Management Survey')}, ${P.management.period}, jeu de données de Békés et Kézdi (2021).`});

  add('67 bis',{id:'s3-allocation',title:sujet(7),prov:'fictif',html:split(`
    <div class="pgf-model">
      <div><span>Production</span>${m('X<sub>acier</sub> = L<sub>acier</sub> , &nbsp; X<sub>latte</sub> = L<sub>latte</sub>')}</div>
      <div><span>Ressources</span>${m('L<sub>acier</sub> + L<sub>latte</sub> = L')}</div>
      <div><span>PIB</span>${m('Y = X<sub>acier</sub><sup>1/2</sup> X<sub>latte</sub><sup>1/2</sup>')}</div>
      <div><span>Allocation</span><span class="pgf-model-text">${m('x = L<sub>acier</sub> / L')} : part du travail dans l’acier</span></div>
    </div>
    <div class="pgf-model-result" data-step="1">${m('Y = A(x) L')} &nbsp;avec&nbsp; ${m('A(x) = √<span class="pgf-root">x (1 − x)</span>')}</div>
    <span data-step="2"></span><p class="pgf-evidence" data-step="3">En Chine et en Inde, une allocation aussi efficace qu’aux États-Unis augmenterait la PGF industrielle de <strong>30 à 60 %</strong>.</p>`,
    visual('pgf-allocation-chart',480,'La PGF dépend de l’allocation du travail',
      `<div class="pgf-slider g-live-only" data-step="1"><label for="pgf-allocation-x">Déplacer ${m('x')}</label><input id="pgf-allocation-x" type="range" min="0" max="1" step="0.01" value="0.2"><output id="pgf-allocation-sortie" for="pgf-allocation-x"></output></div>`),'pgf-allocation'),
  source:`Exemple de ${link('https://web.stanford.edu/~chadj/facts.pdf','C. I. Jones (2016), The Facts of Economic Growth')}, section 4.7. Ordre de grandeur : ${link('https://doi.org/10.1162/qjec.2009.124.4.1403','Hsieh et Klenow (2009)')}.`});

  const smithsonian='https://americanhistory.si.edu/explore/stories/two-tons-pig-parts-making-insulin-1920s';
  add('67 ter',{id:'s3-insuline',title:'Un exemple : l’insuline, des abattoirs aux bactéries',prov:'obs',html:split(`
    <div class="pgf-usines">
      <div class="pgf-card"><h3>Avant 1982 : extraire</h3><p>Pancréas de porcs et de bœufs, sous-produits des abattoirs.</p><p><strong>23 500 animaux</strong> pour 454 g d’insuline.</p></div>
      <div class="pgf-card pgf-card-accent" data-step="1"><h3>Depuis 1982 : faire fabriquer</h3><p>Un gène humain inséré dans des bactéries, cultivées en cuve.</p><p><strong>Aucun animal</strong> : l’offre ne dépend plus des abattoirs.</p></div>
    </div>
    <p class="pgf-lecture" data-step="2">Ce qui a changé, c’est la recette : <strong>une idée a levé une contrainte de ressources</strong>.</p>
    <p class="pgf-question" data-step="3">Quels sujets de notre liste retrouvez-vous ?</p>`,
    `<figure class="pgf-photo"><img src="assets/ad2e33dfd03b82d8.jpg" alt="Deux photographies d’atelier chez Eli Lilly : un employé examine des pancréas dans un bac, un autre alimente un broyeur."><figcaption>À gauche, les pancréas sont examinés à leur arrivée de l’abattoir. À droite, ils passent dans des broyeurs avant l’extraction de l’insuline.<span class="pgf-credit">Fabrication de l’insuline chez Eli Lilly. Photographies publiées par Diane Wendt, ${link(smithsonian,'« Two tons of pig parts: Making insulin in the 1920s »')}, National Museum of American History, Smithsonian Institution, 2013.</span></figcaption></figure>`,'pgf-insuline'),
  source:`Chiffres : ${link('https://www.gene.com/40th/cloning-insulin','Genentech, Cloning insulin')} ; ${link(smithsonian,'National Museum of American History (2013)')}. Dates : ${link('https://www.nsf.gov/impacts/rdna-insulin','National Science Foundation')}.`});

  add('67 quater',{id:'s3-valeur-matiere',title:'La croissance se mesure en valeur, pas en tonnes',html:split(`<div class="pgf-jancovici-col"><figure class="pgf-photo pgf-jancovici-photo"><img src="assets/e421d14196e5c3b4.png" alt="Jean-Marc Jancovici sur le plateau de Quotidien, dans la capture de la vidéo fournie."><figcaption><span class="pgf-credit">Capture d'écran, Youtube</span></figcaption></figure>
    <blockquote class="pgf-jancovici-quote" cite="https://www.youtube.com/watch?v=ahk6fsUn7Mc">« Je regarde un indicateur pour savoir comment va l'économie, c'est la <em>quantité de marchandise qui circule dans les camions</em>. [...] Tout ce que vous avez chez vous sera passé par la caisse d'un camion. Cet indicateur diminue depuis 2007 en Europe. En termes physiques, je considère que l'Europe est déjà entrée en décroissance depuis une petite vingtaine d'années. [...] La décroissance est déjà là. »</blockquote>
    <p class="pgf-jancovici-attribution"><strong>Jean-Marc Jancovici</strong>, <cite>Quotidien</cite>, 25 juin 2026.<br>${link('https://www.youtube.com/watch?v=ahk6fsUn7Mc','Voir l’intervention sur YouTube')}.</p></div>`,
    `<div class="pgf-valeur-points">
    ${points([
      'Le PIB réel mesure la <strong>valeur ajoutée à prix constants</strong>, pas des tonnes (chapitre&nbsp;1).',
      ['Une meilleure recette crée de la valeur <strong>sans matière en plus</strong> : l’insuline.',1],
      ['Moins de fret n’implique donc pas moins de PIB : les <strong>services</strong> font 75 % du PIB des pays riches.',2]
    ])}
    <aside class="pgf-mcafee-book" data-step="2" aria-label="Pour aller plus loin : More from Less et Ordinary Abundance">
      <img src="assets/897aacb895c0ca1d.jpg" alt="Première de couverture de More from Less, Andrew McAfee, Scribner, 2019.">
      <div><p class="pgf-book-label">Pour aller plus loin</p>
        <p class="pgf-book-title"><cite>More from Less</cite></p>
        <p class="pgf-book-author">Andrew McAfee, 2019</p>
        <p class="pgf-book-thesis">Sa thèse : prospérer en utilisant moins de ressources.</p>
        <p class="pgf-book-links">${link('https://inquisitivebiologist.com/2020/04/27/book-review-more-from-less-the-surprising-story-of-how-we-learned-to-prosper-using-fewer-resources-and-what-happens-next/','Compte rendu critique')}.<br>Couverture : ${link('https://www.simonandschuster.com/books/More-from-Less/Andrew-McAfee/9781982103576','Scribner')}.</p>
      </div>
      <p class="pgf-site"><cite>${link('https://ordinaryabundance.com/','Ordinary Abundance')}</cite>, Jordan Dworkin. Une visite d’appartement : ce que la croissance a mis dans nos objets ordinaires.</p>
    </aside>
    </div>`, 'pgf-valeur-matiere'),
    source:`Services : ${link('https://documents1.worldbank.org/curated/en/099258110092319807/pdf/IDU0be37875e0bee10474f0907a043151e283794.pdf','Banque mondiale et OMC (2023), Trade in Services for Development')}, p. 14–16.`});




  function inspect(box,items){
    const readout=document.createElement('div');readout.className='ch-readout pgf-readout';readout.setAttribute('role','status');readout.setAttribute('aria-live','polite');box.append(readout);
    let current=0;
    const hide=()=>{readout.classList.remove('on');items.forEach(item=>item.node.classList.remove('pgf-inspected'));};
    const show=i=>{current=(i+items.length)%items.length;hide();items[current].node.classList.add('pgf-inspected');readout.textContent=items[current].text;readout.classList.add('on');};
    box.tabIndex=0;box.setAttribute('role','group');box.setAttribute('aria-label','Graphique interactif. Flèches pour consulter les valeurs, Échap pour revenir aux diapositives.');
    box.onkeydown=e=>{if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();e.stopPropagation();show(current+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1));}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();hide();box.blur();}};
    box.onfocus=()=>show(0);box.onblur=hide;box.onpointerleave=hide;
    items.forEach((item,i)=>{item.node.setAttribute('aria-label',item.text);C.el('title',{},item.node).textContent=item.text;item.node.addEventListener('pointerenter',()=>show(i));});
  }
  const svgText=(svg,x,y,value,attrs={})=>C.txt(svg,x,y,value,'pgf-svg-text',attrs);


  function barRows(box,o,ctx){
    const key=[box.clientWidth,o.key||''].join('|');
    if(box.dataset.render===key&&!ctx.entry)return;
    box.dataset.render=key;
    const {svg,Wd,Ht,arrow}=C.frame(box,{height:o.height,aria:o.aria}),left=o.left,right=o.right??86,top=8,bottom=46;
    const X=v=>left+(v-o.min)/(o.max-o.min)*(Wd-left-right),rowH=(Ht-top-bottom)/o.rows.length,items=[];
    if(o.reference!=null)C.el('line',{x1:X(o.reference),x2:X(o.reference),y1:top,y2:Ht-bottom,stroke:'#697386','stroke-dasharray':'6 6','stroke-width':2},svg);
    o.rows.forEach((row,i)=>{
      const count=row.bars.length,barH=Math.min(o.barHeight||34,(rowH-10)/Math.max(count,o.slots||count)),slots=o.slots||count;
      const y0=top+i*rowH+(rowH-slots*barH-(slots-1)*4)/2;
      svgText(svg,left-16,top+i*rowH+rowH/2+8,row.label,{'text-anchor':'end','font-size':24,'font-weight':row.bold?700:500});
      row.bars.forEach((bar,j)=>{
        const y=y0+j*(barH+4),animated=ctx.animate&&bar.animate!==false;
        const node=C.el('rect',{x:left,y,width:Math.max(1,X(bar.value)-left),height:barH,fill:bar.color,class:animated?'ch-bar anim-x':'ch-bar',style:`animation-delay:${i*.07}s`},svg);
        svgText(svg,X(bar.value)+10,y+barH/2+8,bar.label,{'font-size':23,'font-weight':700,fill:C.darken(bar.color,.8)});
        items.push({node,text:bar.readout});
      });
    });
    C.el('line',{x1:left,y1:Ht-bottom,x2:Wd-right+24,y2:Ht-bottom,class:'ch-axis','marker-end':arrow},svg);
    o.ticks.forEach(v=>{C.el('line',{x1:X(v),x2:X(v),y1:Ht-bottom,y2:Ht-bottom+7,class:'ch-tickmark'},svg);svgText(svg,X(v),Ht-13,(o.tickFormat||(t=>fmt(t,0)))(v),{'text-anchor':'middle','font-size':21});});
    inspect(box,items);
  }

  G.on('s3-solow-exogene',(el,ctx)=>{
    const second=ctx.static||ctx.step>=1;
    barRows(el.querySelector('#pgf-residu-chart'),{key:String(second),height:500,left:200,min:0,max:1.08,reference:1,ticks:[0,.25,.5,.75,1],tickFormat:v=>fmt(100*v,0),slots:2,barHeight:36,
      aria:'PGF résiduelle de quatre pays, en % du niveau américain, sans puis avec le capital humain',
      rows:residu.map(c=>({label:c.name,bars:[
        {value:c.sans,color:grey,label:fmt(100*c.sans,0)+' %',animate:ctx.entry,readout:`${c.name} — résidu sans compter le capital humain : ${fmt(100*c.sans,1)} % du niveau américain.`},
        ...(second?[{value:c.avec,color:navy,label:fmt(100*c.avec,0)+' %',readout:`${c.name} — PGF en comptant le capital humain : ${fmt(100*c.avec,1)} % du niveau américain.`}]:[])
      ]}))},ctx);
  });

  const line=(id,ctx,options)=>G.line(id,{animate:ctx.entry?ctx.animate:false,duration:1.8,labelGap:27,legend:false,...options});
  const annotate=(chart,cls,draw)=>{if(chart&&!chart.svg.querySelector('.'+cls))draw(C.el('g',{class:cls},chart.svg),chart.S,chart.m);};

  G.on('s3-education',(el,ctx)=>{
    const styles={USA:[navy,null],FRA:[orange,null],KOR:[slate,null],CHN:[grey,null],IND:[grey,'8 6']};
    line('pgf-scolarite-chart',ctx,{margin:{r:150,t:30,b:46},x:{min:1870,max:2010,ticks:[1870,1900,1950,1980,2010]},y:{min:0,max:14,ticks:[0,2,4,6,8,10,12,14]},
      series:P.scolarite.series.map(s=>({name:s.name,endLabel:s.name,color:styles[s.code][0],dash:styles[s.code][1],data:s.data,format:v=>fmt(v,1)+' ans'}))});
  });

  G.on('s3-recherche',(el,ctx)=>{
    const styles={KOR:[navy,null],USA:[slate,null],DEU:[grey,null],CHN:[grey,'8 6'],FRA:[orange,null]},target=ctx.static||ctx.step>=1;
    const chart=line('pgf-rd-chart',ctx,{ends:true,margin:{r:200,t:30,b:46},x:{min:1996,max:P.rd.lastYear,ticks:[1996,2005,2014,P.rd.lastYear]},y:{min:0,max:5.5,ticks:[0,1,2,3,4,5]},
      refLines:target?[{y:3,color:orange,dash:'7 6'}]:[],
      series:P.rd.series.map(s=>({name:s.name,endLabel:s.name,color:styles[s.code][0],dash:styles[s.code][1],data:s.data,format:v=>fmt(v,1)+' %'}))});
    if(target)annotate(chart,'pgf-target',(g,S)=>C.txt(g,S.X(1996.6),S.Y(3)-12,'Objectif européen : 3 %','ch-lab',{fill:C.darken(orange,.85)}));
  });

  G.on('s3-automatisation',(el,ctx)=>{
    line('pgf-robots-chart',ctx,{ends:true,margin:{r:140,t:30,b:46},x:{min:2012,max:2024,ticks:[2012,2016,2020,2024]},y:{min:0,max:600,ticks:[0,100,200,300,400,500,600]},
      series:P.robots.series.map((s,i)=>({name:s.name,endLabel:s.name,color:i?orange:navy,data:s.data,format:v=>fmt(v,0)}))});
  });

  G.on('s3-automatisation-travail',(el,ctx)=>{
    const styles={agriculture:orange,industrie:slate,services:navy};
    line('pgf-emploi-chart',ctx,{ends:true,margin:{r:175,t:30,b:46},x:{min:1856,max:2007,ticks:[1856,1900,1950,2007]},y:{min:0,max:80,ticks:[0,20,40,60,80]},
      series:P.emploi.series.map(s=>({name:s.name,endLabel:s.name,color:styles[s.key],data:s.data,format:v=>fmt(v,0)+' %'}))});
  });

  G.on('s3-institutions',(el,ctx)=>{
    const chart=line('pgf-corees-chart',ctx,{margin:{r:160,t:30,b:46},x:{min:1911,max:2022,ticks:[1911,1945,1990,2022]},y:{min:0,max:45000,ticks:[0,10000,20000,30000,40000],format:v=>fmt(v,0)},
      series:P.corees.series.map((s,i)=>({name:s.name,endLabel:s.name,color:i?orange:navy,gaps:1.5,data:s.data,format:v=>fmt(v,0)+' $'}))});
    annotate(chart,'pgf-partition',(g,S,margin)=>{
      C.el('line',{x1:S.X(1945),x2:S.X(1945),y1:margin.t,y2:S.Y(0),stroke:'#697386','stroke-width':2,'stroke-dasharray':'6 6'},g);
      C.txt(g,S.X(1945)+10,margin.t+18,'1945 : partition','ch-lab',{fill:'#536078'});
      [['Corée du Nord :',orange],['pas de données',orange],['de 1944 à 1989',orange]].forEach(([label,color],i)=>C.txt(g,S.X(1950),S.Y(21000)+24*i,label,'ch-lab',{fill:C.darken(color,.85)}));
      [['En 1940',slate],[`Nord : ${fmt(corees.nord1940,0)} $`,orange],[`Sud : ${fmt(corees.sud1940,0)} $`,navy]].forEach(([label,color],i)=>C.txt(g,S.X(1912.5),S.Y(11000)+24*i,label,'ch-lab',{fill:C.darken(color,.85)}));
    });
  });


  const instLabels={
    USA:{name:'États-Unis',rl:{dx:10,dy:-12,anchor:'start'},cc:{dx:10,dy:-12,anchor:'start'}},
    FRA:{name:'France',rl:{dx:-12,dy:26,anchor:'end'},cc:{dx:12,dy:26,anchor:'start'}},
    KOR:{name:'Corée du Sud',rl:{dx:12,dy:26,anchor:'start'},cc:{dx:-10,dy:-12,anchor:'end'}},
    CHN:{name:'Chine',rl:{dx:-12,dy:-10,anchor:'end'},cc:{dx:-12,dy:-10,anchor:'end'}},
    IND:{name:'Inde',rl:{dx:12,dy:24,anchor:'start'},cc:{dx:12,dy:24,anchor:'start'}},
    NGA:{name:'Nigeria',rl:{dx:-12,dy:24,anchor:'end'},cc:{dx:-12,dy:24,anchor:'end'}}
  };
  const instNames={rl:'État de droit',cc:'Contrôle de la corruption'};
  const instPoints=key=>inst.points.map(p=>{const hl=instLabels[p.iso];return {key:p.iso,x:p[key],y:p.gdp,name:p.name,indicator:instNames[key],hl:!!hl,label:hl?hl.name:null,color:hl?orange:navy,...(hl?hl[key]:{})};});
  function instChart(box,key,animate,height){
    return C.scatter(box,{height,width:box.clientWidth||680,animate,opacity:.42,radius:p=>p.hl?8.5:5.5,
      x:{min:-2.5,max:2.5,ticks:[-2,-1,0,1,2],format:v=>fmt(v,0)},y:{log:true,min:800,max:200000,ticks:[1000,3000,10000,30000,100000],format:v=>fmt(v,0)},
      xTitle:'Indice de gouvernance, de −2,5 (faible) à +2,5 (élevé)',yTitle:'PIB par habitant, dollars de 2021, échelle logarithmique',
      points:instPoints(key),tip:p=>`<b>${G.esc(p.name)}</b><br>${p.indicator} : ${fmt(p.x,2)}<br>PIB par habitant : ${fmt(p.y,0)} $`});
  }
  let instLive=null;
  const instState={step:null,key:'rl'};
  G.on('s3-institutions-correlations',(el,ctx)=>{
    if(ctx.static){
      ['rl','cc'].forEach(key=>{const box=el.querySelector('#pgf-inst-chart-'+key),mark=key+'|'+box.clientWidth;if(box.dataset.render!==mark){box.dataset.render=mark;instChart(box,key,false,400);}});
      return;
    }
    const box=el.querySelector('#pgf-inst-chart'),title=el.querySelector('#pgf-inst-titre'),group=el.querySelector('#pgf-inst-choix');
    const show=key=>{
      instState.key=key;title.textContent=instNames[key];
      group.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.value===key)));
      if(!instLive||instLive.width!==box.clientWidth||!box.contains(instLive.chart.svg))instLive={width:box.clientWidth,chart:instChart(box,key,ctx.animate&&ctx.entry,560)};
      else instLive.chart.update(instPoints(key));
    };

    if(ctx.entry||(instState.step!==ctx.step&&ctx.step<=1))instState.key=ctx.step>=1?'cc':'rl';
    instState.step=ctx.step;
    group.querySelectorAll('button').forEach(button=>{button.onclick=()=>show(button.dataset.value);});
    show(instState.key);
  });

  G.on('s3-management',(el,ctx)=>{
    barRows(el.querySelector('#pgf-management-chart'),{height:540,left:205,right:70,min:1,max:4,ticks:[1,2,3,4],barHeight:30,
      aria:'Score moyen de management dans dix pays, sur une échelle de 1 à 5',
      rows:scores.map(c=>({label:c.country,bold:c.country==='France',bars:[{value:c.mean,color:c.country==='France'?orange:navy,label:fmt(c.mean,2),
        readout:`${c.country} — score moyen de management : ${fmt(c.mean,2)} sur 5, ${fmt(c.n,0)} entreprises.`}]}))},ctx);
  });


  const A=x=>Math.sqrt(x*(1-x)),courbe=Array.from({length:201},(_,i)=>[i/200,A(i/200)]);
  G.on('s3-allocation',(el,ctx)=>{
    const step=ctx.static?99:ctx.step,shown=step>=1;
    const fraction=v=>v===.5?'1/2':v===.25?'1/4':String(v);
    const chart=G.line('pgf-allocation-chart',{animate:shown&&step===1&&ctx.animate,duration:1.6,legend:false,hover:false,margin:{l:74,r:46,t:62,b:74},yTitle:'PGF, A(x)',
      x:{min:0,max:1,ticks:[0,.5,1],format:fraction},y:{min:0,max:.6,ticks:[0,.25,.5],format:fraction},xTitle:'Part du travail dans l’acier, x',
      series:[{name:'A(x)',color:shown?navy:'transparent',data:courbe}],
      markers:[...(step>=2?[{x:.5,y:.5,color:navy,label:'Optimum : x = 1/2, A = 1/2',dy:-18}]:[]),...(step>=3?[{x:.9,y:.3,color:orange}]:[])]});
    if(!chart)return;
    if(step>=2)annotate(chart,'pgf-guides',(g,S)=>{
      [[.5,.5,navy],...(step>=3?[[.9,.3,orange]]:[])].forEach(([x,y,color])=>{
        C.el('line',{x1:S.X(0),x2:S.X(x),y1:S.Y(y),y2:S.Y(y),stroke:color,'stroke-width':2,'stroke-dasharray':'6 6'},g);
        C.el('line',{x1:S.X(x),x2:S.X(x),y1:S.Y(0),y2:S.Y(y),stroke:color,'stroke-width':2,'stroke-dasharray':'6 6'},g);
      });

      if(step>=3)['x = 0,9 : A = 0,3','soit 40 % de moins'].forEach((label,i)=>C.txt(g,S.X(.86),S.Y(.3)+(i?27:-12),label,'ch-val',{fill:C.darken(orange,.85),'text-anchor':'end','font-style':i?null:'italic'}));
    });
    const input=el.querySelector('#pgf-allocation-x'),output=el.querySelector('#pgf-allocation-sortie');
    let cursor=chart.svg.querySelector('.pgf-cursor');
    if(!cursor)cursor=C.el('circle',{class:'pgf-cursor',r:10,fill:'#fff',stroke:orange,'stroke-width':4},chart.svg);
    const move=()=>{
      const x=Number(input.value),value=A(x),loss=100*(1-value/.5);
      cursor.setAttribute('cx',chart.S.X(x));cursor.setAttribute('cy',chart.S.Y(value));cursor.style.display=shown&&!ctx.static?'':'none';
      output.innerHTML=`${m('x = '+fmt(x,2))} &nbsp;→&nbsp; ${m('A(x) = '+fmt(value,2))}${step<2?'':loss>=.5?`, soit ${fmt(loss,0)} % de moins qu’à l’optimum`:', l’optimum'}`;
    };
    input.oninput=move;input.onpointerup=()=>input.blur();input.onkeydown=e=>{if(e.key==='Escape')input.blur();};
    move();
  });
})();
