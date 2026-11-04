/* Introduction du chapitre — plan confirmé le 3 novembre 2026. */
(function(){
  'use strict';
  const G=G2,D=G.DATA,f=G.f,eq=G.eq,fmt=G.fmt,part='Introduction';
  const maddison='<a href="https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023" target="_blank" rel="noopener">Maddison Project Database 2023</a>';
  const anthropic='<a href="https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf" target="_blank" rel="noopener">Korinek, Jones, Sacher, Cotter et McCrory (2026), Economic Scenarios for Transformative AI, tableau 3</a>';
  G.add({id:'croissance-couverture',part,layout:'cover',cls:'g-cover',title:'2. Croître à l’infini dans un monde fini ?',html:`<div class="slide-body"><p class="cover-label">Macroéconomie L3</p><div class="g-cover-heading"><h1>2. Croître à l’infini dans un monde fini ?</h1><p class="g-cover-subtitle">Comprendre la croissance économique de long terme</p></div><p class="cover-author">Arnaud Dyèvre, HEC Paris</p><p class="cover-term">Automne 2026</p></div>`,notes:'<p>Décision confirmée le 3 novembre 2026 : titre interrogatif sur une seule ligne et sous-titre « Comprendre la croissance économique de long terme ». Pas de graphique sur la couverture. Solow ne démontre pas la possibilité matérielle d’une croissance indéfinie.</p>'});
  G.add({    id: 'croissance-monde-fini', part, title: 'Une croissance infinie dans un monde fini ?',
    html: `<div class="citations-grid">
      <article class="citation-col" aria-label="Kenneth E. Boulding">
        <figure>
          <img src="sources/citations_monde_fini_2026-11-03/Kenneth_E._Boulding.jpg" width="227" height="300" alt="Portrait de Kenneth E. Boulding">
          <figcaption><a href="https://en.wikipedia.org/wiki/File:Kenneth_E._Boulding.jpg" target="_blank" rel="noopener">University of Michigan, via Wikipédia : photographe inconnu</a></figcaption>
        </figure>
        <blockquote>« Celui qui croit qu’une croissance exponentielle peut continuer indéfiniment dans un monde fini est soit un fou, soit un économiste. »</blockquote>
        <p class="citation-attribution"><strong>Kenneth E. Boulding (1910–1993)</strong><span class="citation-role">Économiste et philosophe</span><span class="citation-context">Cité dans <em>Jump the Curve</em>, Jack Uldrich, 2008</span></p>
      </article>
      <article class="citation-col rapport-col" aria-label="The Limits to Growth, rapport au Club de Rome, 1972">
        <figure>
          <img src="sources/limits_to_growth_1972/couverture_capture.png" alt="Couverture de The Limits to Growth, capture du rapport de 1972 fournie par Arnaud">
          <figcaption><a href="https://www.library.dartmouth.edu/digital/digital-collections/limits-growth" target="_blank" rel="noopener">Dartmouth Libraries : capture du rapport</a></figcaption>
        </figure>
        <p class="rapport-these"><b>Thèse :</b> à tendances inchangées, la croissance de la population et de la production matérielle se heurte aux ressources limitées et à la pollution. Une stabilisation peut éviter le dépassement suivi d’un déclin.</p>
        <p class="citation-attribution"><strong><em>The Limits to Growth</em> (1972)</strong><span class="citation-role">Rapport au Club de Rome</span></p>
      </article>
      <article class="citation-col" aria-label="Camille Étienne">
        <figure>
          <img src="sources/citations_monde_fini_2026-11-03/camille_etienne.png" alt="Camille Étienne au micro de France Inter, capture de l’entretien fournie par Arnaud">
          <figcaption>France Inter : capture d’écran YouTube</figcaption>
        </figure>
        <blockquote>« Les chiffres parlent ; l’accumulation de ressources illimitées dans un monde aux ressources limitées, qui viennent de plus en plus à manquer, un enfant de quatre ans comprendrait qu’on ne peut pas rentrer un carré dans un cercle. »</blockquote>
        <p class="citation-attribution"><strong>Camille Étienne</strong><span class="citation-role">Militante écologiste</span><span class="citation-context">Matinale de France Inter, 14 février 2025</span></p>
      </article>
    </div>`,
    notes: `<p><b>Décision confirmée par Arnaud, 3 novembre 2026 :</b> mettre Boulding et son portrait à gauche, Camille Étienne et la capture fournie à droite, après la couverture.</p>
      <p><b>Provenance des citations :</b> Boulding, attribution secondaire à <em>Jump the Curve</em> (Jack Uldrich, 2008), reprise de la notice Wikipédia française. Le livre n’a pas été consulté. 2008 est la date du livre, pas celle de la formulation. Pour Camille Étienne, texte et date fournis par Arnaud, sans vérification de l’enregistrement. Orthographe harmonisée : « resources illimités / limités » devient « ressources illimitées / limitées ». Texte reçu conservé dans les sources.</p>
      <p><b>Repères biographiques ajoutés le 3 novembre 2026 :</b> Kenneth E. Boulding (1910–1993), économiste et philosophe ; Camille Étienne, militante écologiste. Vérification des <a href="https://fr.wikipedia.org/wiki/Kenneth_E._Boulding">repères de Boulding</a> et de la <a href="https://fr.wikipedia.org/wiki/Camille_%C3%89tienne">présentation de Camille Étienne</a> dans leurs notices Wikipédia.</p>
      <p><b>Portrait :</b> fichier précis indiqué par Arnaud, <a href="https://en.wikipedia.org/wiki/File:Kenneth_E._Boulding.jpg">notice Wikipédia</a>, source déclarée University of Michigan Faculty History. Auteur et titulaire inconnus, date indiquée 1949–1968. Image non libre, employée sous fair use sur Wikipédia anglais, sans licence libre transposable. Capture de Camille Étienne : France Inter, YouTube, fichier fourni sans URL de vidéo.</p>
      <p><b>Troisième référence ajoutée le 3 novembre 2026 :</b> <em>The Limits to Growth</em> (1972), par Donella H. Meadows, Dennis L. Meadows, Jørgen Randers et William W. Behrens III, équipe du MIT, pour le Club de Rome. La capture fournie est conservée sans modification. La synthèse au centre est une reformulation, pas une citation.</p>
      <p><b>Vérification :</b> <a href="https://collections.dartmouth.edu/xcdas-derivative/meadows/pdf/meadows_ltg-001.pdf?disposition=inline">rapport original de Dartmouth</a>, conclusions de l’introduction, pages imprimées 23–24 (PDF 25–26), lues et inspectées. À tendances inchangées : limites dans le siècle suivant 1972, déclin probable de la population et de la capacité industrielle. Autre issue possible : stabilité écologique et économique durable, favorisée par une action précoce. Ne pas présenter ce résultat conditionnel comme une date d’effondrement certaine.</p>
      <p><b>Idée à discuter :</b> rapprocher deux citations critiques et un rapport de modélisation, sans présenter leur juxtaposition comme une preuve. Distinguer croissance du PIB réel et accumulation de ressources physiques. La phrase du carré et du cercle est une analogie rhétorique, pas une démonstration économique.</p>`,
    prov: null});
  const longRun=window.CH02_MADDISON_LONG_TERME.series;
  const orangeY='<span class="g-accent">Y</span>';
  G.add({id:'croissance-origines',part,title:'D’où vient la croissance du niveau de vie ?',prov:'obs',
    html:G.cols(`<p class="g-intro-rappel">Rappel : notre décomposition du PIB par habitant du chapitre précédent</p><div class="g-intro-identite">${f(orangeY,'N')} = ${f(orangeY,'H')} × ${f('H','L')} × ${f('L','N')}</div><div class="g-intro-labels"><div><b class="g-math">${orangeY}/H</b> Productivité horaire</div><div><b>H/L</b> Heures par personne en emploi</div><div><b>L/N</b> Emploi rapporté à la population</div></div><div class="g-intro-rates" data-step="2"><p>Croissance annuelle moyenne, 1820–2022</p>${longRun.map(item=>`<div><span style="color:${item.color}">${item.name}</span><strong>${fmt(item.growthPercent,2)} %</strong><span>doublement ≈ ${fmt(item.doublingYears,0)} ans</span></div>`).join('')}</div>`,
      `<div class="g-live-only" data-step="1"><h2>« Moore’s Law of Economics »</h2>${G.buttons('intro-vues',[['level','Niveaux'],['log','Échelle logarithmique']])}${G.chart('intro-us',400)}</div><div class="g-static-only"><h3>Niveaux</h3>${G.chart('intro-us-niveaux-statique',200)}<h3>Échelle logarithmique</h3>${G.chart('intro-us-log-statique',200)}</div>`)+`<aside class="g-panel orange g-intro-purpose" data-step="2">Le but de ce chapitre : expliquer d'où vient la croissance de <i>Y</i> et si elle peut continuer</aside>`,
    source:`Dollars internationaux de 2011 (PPA). Source : ${maddison}. Monde : années disponibles.`,
    notes:'<p>Rappel du chapitre 1. N : population. L : personnes en emploi. H : heures totales. Y : PIB réel. La question finale porte sur Y ; les courbes représentent Y/N. Le rôle de la population reste à distinguer.</p><p>Retouche demandée le 3 novembre 2026 : reprendre France et monde, avec les États-Unis conservés. Mêmes données et même période que deux-siecles et transition-croissance au chapitre 1 : 1820–2022. France et États-Unis : 203 observations annuelles chacun. Monde : 21 dates irrégulières. Aucune interpolation de données ; les segments mondiaux relient uniquement les dates observées.</p><p>En vue logarithmique, MCO de ln(PIB par habitant) sur année − 1820, une régression par série et un poids identique pour chaque observation. Les taux affichés sont les moyennes géométriques entre 1820 et 2022 : France 1,532655 %, États-Unis 1,539060 %, monde 1,342388 %. Ils ne sont pas les pentes MCO. Doublement : ln(2)/ln(1+g), conditionnel au rythme moyen. Aucun prolongement après 2022. Analogie pédagogique, pas prévision. Source locale reproductible : scripts/preparer_maddison_long_terme.py.</p>'});
  function longRunChart(id,log,animate){
    const chart=G.line(id,{animate,duration:1.4,ends:false,labelGap:24,margin:{l:78,r:145,t:44,b:42},x:{min:1820,max:2022,ticks:[1820,1870,1920,1970,2022]},y:log?{log:true,min:500,max:100000,ticks:[1000,5000,20000,100000],format:v=>fmt(v,0)}:{min:0,max:65000,ticks:[0,20000,40000,60000],format:v=>fmt(v,0)},yTitle:'Dollars de 2011 par habitant',series:longRun.map(item=>({name:item.name,endLabel:item.name,color:item.color,data:item.data,format:v=>fmt(v,0)+' $'}))});
    if(!chart)return;
    if(chart.svg.querySelector('.g-axis-help'))return; // Annotations déjà présentes sur le tracé conservé.
    const axisTitle=chart.svg.querySelector('.ch-ytitle');
    const tip=document.createElement('div');
    tip.id=id+'-axis-tip';tip.className='g-intro-axis-tip';tip.setAttribute('role','tooltip');tip.hidden=true;
    tip.innerHTML='PIB réel par habitant : 1820–2022<br>En logarithmes : tirets fins = droites d’ajustement.';
    chart.svg.parentNode.append(tip);
    axisTitle.setAttribute('tabindex','0');axisTitle.setAttribute('aria-describedby',tip.id);
    axisTitle.classList.add('g-axis-help');
    const showTip=()=>{tip.hidden=false;};
    const hideTip=()=>{tip.hidden=true;};
    axisTitle.addEventListener('pointerenter',showTip);
    axisTitle.addEventListener('pointerleave',()=>{if(document.activeElement!==axisTitle)hideTip();});
    axisTitle.addEventListener('focus',showTip);axisTitle.addEventListener('blur',hideTip);
    axisTitle.addEventListener('keydown',event=>{if(event.key==='Escape'&&!tip.hidden){hideTip();event.stopPropagation();}});
    if(!log)return;
    const firstLine=chart.svg.querySelector('.ch-line');
    const trends=Charts.el('g',{class:'g-intro-trends','aria-label':'Ajustements logarithmiques'},firstLine.parentNode);
    firstLine.parentNode.insertBefore(trends,firstLine);
    longRun.forEach(item=>Charts.el('path',{
      d:`M${chart.S.X(1820)},${chart.S.Y(Math.exp(item.fit.a))} L${chart.S.X(2022)},${chart.S.Y(Math.exp(item.fit.a+item.fit.b*202))}`,
      class:'g-intro-trend',stroke:item.color,'stroke-dasharray':'8 6','stroke-width':2.5,opacity:.6,fill:'none',
      'aria-label':`Ajustement de ${item.name}`,'data-slope':item.fit.b
    },trends));
  }
  G.on('croissance-origines',(el,ctx)=>{if(ctx.static){longRunChart('intro-us-niveaux-statique',false,false);longRunChart('intro-us-log-statique',true,false);return;}const mode=G.bindChoices(el,'intro-vues',ctx.step>=2?'log':'level',value=>longRunChart('intro-us',value==='log',false));longRunChart('intro-us',mode==='log',ctx.animate);});
  const growthCountries=window.CH02_CROISSANCE_PAYS.series;
  G.add({id:'croissance-rythmes',part,title:'Des rythmes de croissance très différents',prov:'obs',
    html:G.cols(`<h2>1960–2022</h2><p>Une différence de rythme se cumule au fil des décennies.</p><table class="g-table g-growth-countries"><thead><tr><th>Pays</th><th>Multiplication<br>du PIB par habitant</th><th data-step="1">Croissance<br>annuelle moyenne</th></tr></thead><tbody>${growthCountries.map(item=>`<tr style="color:${item.color}"><td>${item.name}</td><td><span class="g-math">× ${fmt(item.statistics.multiple,1)}</span></td><td data-step="1"><span class="g-math">${fmt(item.statistics.growthPercent,2)} %</span></td></tr>`).join('')}</tbody></table><p class="g-note" data-step="2">Repère : <span class="g-math">durée de doublement ≈ 70 ÷ taux annuel en %</span>.</p>`,G.chart('intro-coree-ghana',535)),
    source:`Dollars internationaux de 2011 (PPA), échelle logarithmique. Source : ${maddison}.`,
    notes:'<p>Graphique et calculs harmonisés sur 1960–2022 pour la Corée du Sud, la Chine, l’Inde et le Ghana. 63 observations annuelles par pays, sans interpolation. Source : classeur local officiel Maddison Project Database 2023, feuille GDPpc, colonnes CF (KOR), AB (CHN), BR (IND), BE (GHA). Les séries coréenne et ghanéenne sont conservées exactement.</p><p>Taux géométriques sur 62 ans : (niveau 2022 / niveau 1960) puissance (1/62), moins 1. Chine : ×18,2007, soit 4,7910 % par an. Inde : ×6,4713, soit 3,0577 % par an. Corée du Sud : ×26,6984, soit 5,4406 %. Ghana : ×1,9310, soit 1,0670 %. La règle des 70 est une approximation. Ces trajectoires motivent le cours, sans identifier leur cause à ce stade. Extraction reproductible : scripts/preparer_croissance_pays.py.</p>'});
  G.on('croissance-rythmes',(el,ctx)=>{
    G.line('intro-coree-ghana',{animate:ctx.animate,ends:false,labelGap:27,margin:{l:76,r:155,t:62,b:48},x:{min:1960,max:2022,ticks:[1960,1980,2000,2022]},y:{log:true,min:500,max:50000,ticks:[500,1000,2000,5000,10000,20000,40000],format:v=>fmt(v,0)},yTitle:'PIB réel par habitant',series:growthCountries.map(item=>({name:item.name,endLabel:item.name,color:item.color,dash:item.dash,data:item.data,format:v=>fmt(v,0)+' $'}))});
  });
  G.add({id:'croissance-corees-espace',part,title:"La croissance de long terme, vue de l'espace",
    html:`<figure class="g-corees-espace"><img src="sources/corees_espace_2012/8249377151_692e248e6b_o.jpg" alt="Vue nocturne de la péninsule coréenne : éclairage dense en Corée du Sud et beaucoup plus rare en Corée du Nord, avec Pyongyang visible."><figcaption><a href="https://www.flickr.com/photos/gsfc/8249377151/in/photostream/" target="_blank" rel="noopener">NASA Earth Observatory : Jesse Allen et Robert Simmon, 24 septembre 2012</a>. <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a></figcaption></figure>`,
    notes:'<p>Ajout demandé par Arnaud le 3 novembre 2026, après les quatre trajectoires de croissance. Photo fournie, conservée entière sans modification. Source : page Flickr NASA Goddard, « Korea and the Yellow Sea ». Acquisition le 24 septembre 2012 par VIIRS sur Suomi NPP. Image NASA Earth Observatory par Jesse Allen et Robert Simmon, à partir des données VIIRS Day-Night Band. Crédit et licence CC BY 2.0 vérifiés sur la page originale.</p><p>Faire observer le contraste entre les deux Corées. Les lumières nocturnes renseignent sur l’activité et l’accès à l’électricité, sans constituer une mesure directe du PIB. Une photographie de 2012 ne mesure pas à elle seule un taux de croissance de long terme. Aucune nouvelle estimation chiffrée n’est déduite de cette image.</p>'});
  G.add({id:'croissance-ia-intro',part,title:'L’IA pourrait-elle changer la pente ?',prov:'sim',
    html:`<p class="g-ia-heading">États-Unis : quatre scénarios, 2025–2030, modélisations des économistes d’Anthropic</p>${G.chart('intro-ia-croissance',590)}`,
    source:`<a href="https://www.anthropic.com/institute/econ-scenarios" target="_blank" rel="noopener">Anthropic : explorateur de scénarios</a>. ${anthropic.replace('tableau 3','figure 2')}.`,
    notes:'<p>Demandes d’Arnaud des 3 et 4 novembre 2026 : présenter le niveau du PIB américain sur 2025–2030, ajouter la mention des modélisations des économistes d’Anthropic, retirer la phrase projetée sur les probabilités et afficher les taux annuels sous les indices en fin de courbe. Les courbes restent des indices en volume, base 100 pour le scénario sans IA en janvier 2025 ; leurs ordonnées ne sont ni des taux annuels ni des écarts en pourcentage avec le scénario sans IA.</p><p>Les 61 valeurs mensuelles de chaque courbe sont calculées par la fonction rv du code public de l’explorateur officiel, sans lecture approximative des pixels ni interpolation locale. Référence : 100 × 1,02 puissance (année − 2025). Niveau avec IA : référence multipliée par exp(lnY_act). Les légers effets IA déjà présents début 2025 sont conservés : les trois scénarios ne sont pas artificiellement remis à 100 à cette date. En janvier 2030 : 110,4 ; 112,2 ; 119,6 ; 146,2. Les écarts correspondants par rapport au scénario sans IA, +1,6 %, +8,3 % et +32,4 %, reproduisent le tableau 3 et le volet gauche de la figure 2 du rapport.</p><p>Les étiquettes ajoutent les taux annuels à janvier 2030 : 2,0 %, 2,4 %, 5,4 % et 15,4 %. Ils proviennent directement de la fonction officielle rC, conformément au tableau 3 et au volet droit de la figure 2. Taux sur les douze mois précédents selon la convention du rapport : référence de 2 % plus 100 fois la variation annuelle de lnY_act. Ce ne sont ni les moyennes sur 2025–2030 ni des prévisions pour l’ensemble de l’année civile 2030. Le code officiel utilise 1,02 puissance (année − 2025) pour les niveaux et exactement 2 % comme référence des taux : nous conservons ces conventions au lieu de recalculer les taux depuis les indices arrondis.</p><p>Libellés français demandés : Status quo = No AI ; Bas = Modest ; Modeste = Substantial ; Haut = Extreme. « Modeste » est ici le libellé pédagogique du scénario intermédiaire, pas la traduction de Modest dans la source. Les montants au survol sont des milliards de dollars aux prix de 2025 : indice / 100 × 30 374. La constante monétaire rp et la conversion sZ sont reprises du code officiel. Il s’agit du PIB annuel en volume à chaque date mensuelle, pas du PIB du seul mois ni de dollars courants futurs. Les cinq auteurs sont Anton Korinek, Charles I. Jones, Szymon Sacher, Tess Cotter et Peter McCrory. Aucune probabilité attribuée aux scénarios. Archive et calcul reproductible : sources/anthropic_scenarios_2026/README.md.</p>'});
  const iaDate=v=>Number.isInteger(v)?String(v):`${String(Math.round((v-Math.floor(v))*12)+1).padStart(2,'0')}/${Math.floor(v)}`;
  G.on('croissance-ia-intro',(el,ctx)=>{
    const chart=G.line('intro-ia-croissance',{
    animate:ctx.animate,duration:2.4,ends:false,labelGap:56,margin:{l:90,r:245,t:64,b:65},
    x:{min:2025,max:2030,ticks:[2025,2026,2027,2028,2029,2030],format:iaDate,hoverFormat:v=>`${iaDate(v)}<br>PIB en milliards de dollars de ${CH02_ANTHROPIC.monetary.priceYear}`},
    y:{min:100,max:150,ticks:[100,110,120,130,140,150],format:v=>fmt(v,0)},
    xTitle:'Année',yTitle:'Niveau du PIB (base 100 : status quo en 2025)',
    series:CH02_ANTHROPIC.series.map(item=>({name:item.name,endLabel:`${item.name} : ${fmt(item.data.at(-1)[1],1)}`,color:item.color,dash:item.dash,data:item.data,format:v=>`${fmt(v/100*CH02_ANTHROPIC.monetary.billionsPer100,0)} (indice ${fmt(v,2)})`}))
    });
    // Garder les taux sous les indices, dans les légendes animées du graphique.
    chart.svg.querySelectorAll('.ch-lab').forEach(label=>{
      if(label.querySelector('.g-ia-rate'))return;
      const item=CH02_ANTHROPIC.series.find(s=>label.textContent===`${s.name} : ${fmt(s.data.at(-1)[1],1)}`);
      if(!item)return;
      const rate=Charts.el('tspan',{x:label.getAttribute('x'),dy:25,class:'g-ia-rate'},label);
      rate.textContent=`${fmt(item.annualGrowth2030,1)} %/an en 2030`;
      const detail=Charts.el('title',{},label);
      detail.textContent=CH02_ANTHROPIC.annualGrowth.definition;
    });
  });
  G.add({id:'croissance-plan',part,title:'Les quatre questions du chapitre',html:G.plan(),notes:'<p>Décomposer le niveau de vie → modéliser sa croissance → mesurer les contributions → comprendre la PGF → examiner ce que l’IA pourrait changer. Cette livraison couvre l’introduction et Solow. La suite du plan général sera réalisée séparément.</p>'});
})();
