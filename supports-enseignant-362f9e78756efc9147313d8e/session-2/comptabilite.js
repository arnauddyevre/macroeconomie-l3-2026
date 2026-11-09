/* Première séquence empirique : adaptation d’Antonin Bergeaud, 9 novembre 2026.
   Données, méthodes et contrôles : sources/comptabilite_2026-11-09/. */
(function () {
  'use strict';
  const G=window.G2,D=window.CH02_COMPTA_DATA,C=window.Charts;
  if(!G||!D)throw new Error('Composants ou données de comptabilité absents');
  const part=G.titles[1],colors={output:'#000000',capital:'#B45309',human:'#697386',tfp:'#001F5F'};
  const fmt=(x,d=1)=>C.fmt(x,d),pct=(x,d=1)=>fmt(100*x,d)+' %';
  const m=html=>`<span class="g-math">${html}</span>`,f=G.f;
  const term=(html,key,label)=>`<span class="cp-term cp-${key}">${m(html)}<small>${label}</small></span>`;
  const step=(n,html)=>`<div data-step="${n}">${html}</div>`;
  const source='<a href="https://www.rug.nl/ggdc/productivity/pwt/" target="_blank" rel="noopener">Penn World Table 11.0</a>, 2023. α = 1/3. Calculs à partir de cgdpo/emp, cn/emp et hc.';
  const add=obj=>G.add({part,cls:'cp-slide',source:'',...obj});
  const notes=html=>`<p>Première séquence confirmée par Arnaud le 9 novembre 2026. Adaptation des diapositives cd-formule, compta-scen et compta-monde d’Antonin ; décomposition logarithmique ajoutée.</p>${html}`;

  add({id:'s2',layout:'section',title:part,html:G.plan(1),notes:notes('<p>Cette première séquence traite des différences de niveaux à une date donnée. Les applications temporelles de comptabilité de la croissance restent à discuter. Aucun écran supplémentaire n’est présumé adopté.</p>')});

  add({id:'s2-capital-humain',title:'Lier le modèle de Solow aux données',html:`
    <p class="cp-intro">Nous adaptons la fonction de production du cours en ajoutant le <strong>capital humain</strong>.</p>
    <div class="cp-production">${term('Y','output','production<br><strong>observée</strong>')}<span>=</span>${term('A','tfp','PGF<br><strong>résidu</strong>')}<span>×</span>${term('K<sup>α</sup>','capital','capital physique<br><strong>observé</strong>')}<span>×</span>${term('(hL)<sup>1−α</sup>','human','travail corrigé du capital humain<br><strong>observé dans les données</strong>')}</div>
    <div class="cp-human-layout"><div class="def"><div class="def-label">Définition</div><div class="def-term">Le capital humain, ${m('h')}</div><p class="def-text">Les compétences des travailleurs, approchées dans les données à partir des <strong>années d’études</strong>.</p></div>
    <p class="cp-reason">Cette mesure est disponible pour de nombreux pays. Elle aide à comprendre les écarts de <strong>productivité</strong> et de <strong>niveau de vie</strong>.</p></div>
    ${step(1,`<div class="cp-per-worker"><span>Par travailleur :</span>${m('y = A k<sup>α</sup> h<sup>1−α</sup>')}<span class="cp-conventions">${m(`y = ${f('Y','L')}, &nbsp; k = ${f('K','L')}, &nbsp; α = ${f('1','3')}`)}</span></div>`)}
    ${step(2,`<p class="cp-living">${m(`${f('Y','N')} = ${f('Y','L')} × ${f('L','N')}`)}<span>La productivité par travailleur contribue au niveau de vie.<br><small>${m('L')} : personnes en emploi ; ${m('N')} : population.</small></span></p>`)}`,
    source:'Extension de la fonction du cours : Y = AK<sup>α</sup>L<sup>1−α</sup>. Capital humain : indice hc de la PWT.',
    notes:notes('<p>hL est le travail corrigé du capital humain, distinct de EL, notre normalisation technologique dans Solow. h est un indice construit à partir de la scolarité, pas une mesure directe de toutes les compétences ou de la qualité de l’enseignement. Le résidu A change lorsque h est séparé. Les heures travaillées restent hors de cette décomposition par personne en emploi.</p>')});

  const relative=(x)=>f(`${x}<sub>i</sub>`,`${x}<sub>US</sub>`);
  add({id:'s2-decomposition-logs',title:'Décomposer les écarts de production par travailleur',html:`
    <p class="cp-intro">Les logarithmes transforment un produit en somme.</p>
    <div class="cp-log-level g-eq">ln y = ln A + α ln k + (1−α) ln h</div>
    ${step(1,`<div class="cp-log-comparison"><p>Comparons un pays ${m('i')} aux États-Unis, <strong>à la même date</strong>.</p>
      <div class="cp-log-identity">${term('ln '+relative('y'),'output','écart total')}<span>=</span>${term(f('1','3')+' ln '+relative('k'),'capital','capital physique')}<span>+</span>${term(f('2','3')+' ln '+relative('h'),'human','capital humain')}<span>+</span>${term('ln '+relative('A'),'tfp','PGF')}</div></div>`)}
    ${step(2,`<div class="g-panel orange cp-share-rule"><h3>Quelle part de l’écart attribuer à chaque terme ?</h3><p>Diviser chaque contribution par l’écart logarithmique total, puis multiplier par 100.</p><p class="cp-sum">Part du capital + part du capital humain + part de la PGF = <strong>100 %</strong>.</p></div>
    <p class="cp-residual">La PGF est le <strong>résidu</strong>, après prise en compte du capital physique et du capital humain.</p>`)}`,
    source:'Décomposition des niveaux entre pays, sans variation temporelle. y = Y/L ; k = K/L ; α = 1/3.',
    notes:notes('<p>Identité exacte : ln(y_i/y_US) = (1/3)ln(k_i/k_US) + (2/3)ln(h_i/h_US) + ln(A_i/A_US). Les parts sont ces trois termes divisés par ln(y_i/y_US). Une part peut être négative ; une autre peut alors dépasser 100 %. Si y_i = y_US, l’écart total est nul et les parts ne sont pas définies. Il s’agit d’une décomposition comptable, sans attribution causale.</p>')});

  const shareTerms=[['capital','Capital physique','k',1/3,'kRatio'],['human','Capital humain','h',2/3,'hRatio'],['tfp','PGF','A',1,'aRatio']];
  function shareCalculation(c,key,digits=6){
    const [,label,symbol,weight,field]=shareTerms.find(t=>t[0]===key);
    const coefficient=key==='capital'?'(1/3) ':key==='human'?'(2/3) ':'';
    const denominator=Math.log(c.yRatio),numerator=weight*Math.log(c[field]);
    return {label,numerator,denominator,
      symbolic:f(coefficient+`ln(${symbol}<sub>i</sub>/${symbol}<sub>US</sub>)`,'ln(y<sub>i</sub>/y<sub>US</sub>)')+' × 100',
      numeric:f(coefficient+`ln(${fmt(c[field],digits)})`,`ln(${fmt(c.yRatio,digits)})`)+' × 100',
      evaluated:f(fmt(numerator,6),fmt(denominator,6))+' × 100 ≈ '+pct(c.shares[key])};
  }
  function shareBubble(c,key){
    const calc=shareCalculation(c,key),id='cp-calc-'+c.iso+'-'+key;
    return `<aside id="${id}" class="cp-calculation-bubble" aria-labelledby="${id}-title" hidden>
      <button class="cp-calculation-close" type="button" aria-label="Fermer le calcul">×</button>
      <h3 id="${id}-title">${G.esc(c.name)} : ${calc.label}</h3>
      <p>Contribution logarithmique ÷ écart logarithmique total × 100</p>
      <div class="cp-calculation-formula">${m(calc.symbolic)}</div>
      <div class="cp-calculation-formula">${m('≈ '+calc.numeric)}</div>
      <div class="cp-calculation-formula cp-${key}">${m('≈ '+calc.evaluated)}</div>
      <p class="cp-calculation-note">Rapports exprimés en nombres décimaux, pas en pourcentages. Valeurs affichées arrondies ; résultat calculé sur les données non arrondies.${c.iso==='KOR'?' L’écart total est négatif. Les contributions du capital et du capital humain sont positives : leurs parts sont donc négatives.':''}</p>
    </aside>`;
  }
  function countryText(c,index){
    return `<p class="cp-country-position">${index+1} / 4</p><h2 class="cp-country-name">${G.esc(c.name)}</h2>
      <p class="cp-country-sub">Rapports aux États-Unis</p>
      <div class="cp-country-equation">${m(`${fmt(c.yRatio,3)} ≈ <span class="cp-capital">${fmt(c.kFactor,3)}</span> × <span class="cp-human">${fmt(c.hFactor,3)}</span> × <span class="cp-tfp">${fmt(c.aRatio,3)}</span>`)}</div>
      <p class="cp-ratio-note">Les contributions se <strong>multiplient</strong>.</p>
      <h3 class="cp-shares-title">Parts de l’écart en logarithme</h3>
      <dl class="cp-shares">${shareTerms.map(([key,label])=>`<div class="cp-${key}"><dt>${label}</dt><dd>${pct(c.shares[key])}<button type="button" class="cp-calculation-trigger" aria-expanded="false" aria-controls="cp-calc-${c.iso}-${key}" aria-label="Calcul de la part : ${label}">Calcul</button></dd></div>`).join('')}</dl>
      ${shareTerms.map(([key])=>shareBubble(c,key)).join('')}
      <p class="cp-country-message">${c.iso==='KOR'?'Le capital et le capital humain <strong>réduisent l’écart</strong>. Leurs parts sont négatives ; celle de la PGF dépasse 100 %.':'La PGF représente la plus grande part de cet écart.'}</p>`;
  }
  function table(){return `<div class="cp-static-table"><p>Quatre pays comparés aux États-Unis, en 2023</p><table class="g-table"><thead><tr><th rowspan="2">Pays</th><th colspan="4">Rapports aux États-Unis, en %</th><th colspan="3">Parts de l’écart logarithmique, en %</th></tr><tr><th>Production<br>par travailleur</th><th class="cp-capital">Contribution<br>du capital</th><th class="cp-human">Contribution<br>du capital humain</th><th class="cp-tfp">PGF</th><th class="cp-capital">Capital</th><th class="cp-human">Capital<br>humain</th><th class="cp-tfp">PGF</th></tr></thead><tbody>${D.countries.map(c=>`<tr><th>${G.esc(c.name)}</th>${[c.yRatio,c.kFactor,c.hFactor,c.aRatio].map(v=>`<td>${fmt(100*v)}</td>`).join('')}${shareTerms.map(([key])=>`<td class="cp-static-share"><strong>≈ ${fmt(100*c.shares[key])}</strong><small>${m(shareCalculation(c,key,4).numeric)}</small></td>`).join('')}</tr>`).join('')}</tbody></table>
      <p class="cp-table-note">Les contributions du capital et du capital humain sont les rapports élevés aux puissances 1/3 et 2/3. Leur produit avec la PGF redonne la production relative. Sous chaque part : contribution logarithmique divisée par ln(y/y<sub>US</sub>), multipliée par 100. Rapports décimaux arrondis ; parts calculées sans arrondi intermédiaire.</p>
      <p class="cp-table-note"><strong>Corée du Sud :</strong> le capital et le capital humain réduisent l’écart ; leurs parts négatives compensent une partie de la contribution de la PGF. Les parts totalisent 100 %, aux arrondis près.</p></div>`;}
  add({id:'s2-compta-pays',title:'La même décomposition, pays par pays',html:`<div class="cp-live cp-country-layout"><div id="cp-country-text"></div><div id="cp-country-chart" class="g-chart cp-chart" style="height:570px"></div></div><div class="cp-static">${table()}</div><span class="cp-step-marker" data-step="1"></span><span class="cp-step-marker" data-step="2"></span><span class="cp-step-marker" data-step="3"></span>`,
    source,prov:'obs',notes:notes('<p>Quatre pays dans l’ordre d’Antonin : Chine, Inde, Nigeria et Corée du Sud. Ratios et parts calculés sans arrondir les données. Les barres de capital montrent k_rel^(1/3) et h_rel^(2/3), pas les rapports bruts. Les rapports ne s’additionnent pas. La Corée possède davantage de capital par travailleur et un indice h plus élevé que les États-Unis : parts de l’écart −7,408 %, −2,014 % et 109,421 %. La PGF pédagogique n’est pas la série officielle ctfp de la PWT. Trois boutons « Calcul » ouvrent au clic les formules symboliques, les rapports numériques, les contributions logarithmiques et les parts. Les bulles se ferment au second clic, avec leur croix, Échap, un clic extérieur ou au changement de pays. Le tableau statique conserve les quatre états et les calculs numériques, visibles en lecture et impression.</p>')});

  const legend=()=>`<div class="cp-legend">${[['capital','Capital physique'],['human','Capital humain'],['tfp','PGF']].map(([k,l])=>`<span><i style="background:${colors[k]}"></i>${l}</span>`).join('')}</div>`;
  add({id:'s2-compta-groupes',title:'Partout, la productivité globale des facteurs pèse le plus',html:`<div class="cp-group-layout"><div class="cp-group-text"><p class="cp-group-scope"><strong>95 pays, répartis en quatre groupes</strong>, dont la production par travailleur est inférieure à la moitié du niveau américain.</p>
    ${step(1,'<div class="cp-group-result"><p>Dans chacun des quatre groupes :</p><strong>PGF : 50 à 61 %</strong><p>de l’écart de production par travailleur, en logarithme.</p></div>')}
    ${step(2,'<div class="g-panel orange cp-group-caveat"><h3>La PGF est un résidu</h3><p>Elle comprend aussi ce que l’on mesure mal, notamment la qualité du capital humain.</p></div>')}</div>
    <div><p class="cp-group-chart-title">Parts de l’écart avec les États-Unis</p><div id="cp-group-chart" class="g-chart cp-chart" style="height:440px"></div>${legend()}<p class="cp-group-caption">Groupes définis par la production par travailleur,<br>en % du niveau américain.</p></div></div>`,
    source:source+' Pays de plus d’un million d’habitants, hors Venezuela. Moyennes géométriques à poids égaux.',prov:'obs',
    notes:notes('<p>L’échantillon complet comprend 133 pays ; les quatre groupes représentés en comprennent 95 : 13, 18, 29 et 35. On prend les moyennes des logarithmes, puis leur rapport pour obtenir les parts ; on ne moyenne pas les parts individuelles. PGF : 51,759 %, 49,924 %, 54,501 % et 61,071 %. « Partout » signifie ici dans chacun des quatre groupes, pas dans chaque pays : neuf des 95 pays ont individuellement une autre composante dominante. Le résidu ne constitue pas une identification causale. Les exclusions et seuils sont documentés dans les sources locales.</p>')});

  // Même moteur SVG et mêmes infobulles que les autres graphiques du cours.
  // Les flèches inspectent les valeurs quand le graphique a le focus ; Échap rend la navigation au cours.
  function inspect(box,items){
    const readout=document.createElement('div');readout.className='ch-readout cp-readout';readout.setAttribute('role','status');readout.setAttribute('aria-live','polite');box.append(readout);
    let current=0;
    const hide=()=>{readout.classList.remove('on');items.forEach(item=>item.node.classList.remove('cp-inspected'));};
    const show=i=>{current=(i+items.length)%items.length;hide();items[current].node.classList.add('cp-inspected');readout.textContent=items[current].text;readout.classList.add('on');};
    box.tabIndex=0;box.setAttribute('role','group');box.setAttribute('aria-label','Graphique interactif. Flèches pour consulter les valeurs, Échap pour revenir aux diapositives.');
    box.onkeydown=e=>{if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();e.stopPropagation();show(current+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1));}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();hide();box.blur();}};
    box.onfocus=()=>show(0);box.onblur=hide;box.onpointerleave=hide;
    items.forEach((item,i)=>{item.node.setAttribute('aria-label',item.text);C.el('title',{},item.node).textContent=item.text;item.node.addEventListener('pointerenter',()=>show(i));});
  }
  function text(svg,x,y,value,attrs={}){return C.txt(svg,x,y,value,'cp-svg-text',attrs);}
  function countryChart(box,c,ctx){
    const key=c.iso+'|'+box.clientWidth;
    if(box.dataset.render===key&&!ctx.entry)return;
    box.dataset.render=key;
    const {svg,Wd,Ht,arrow}=C.frame(box,{height:570,aria:c.name+' : rapports aux États-Unis, en %'}),left=4,right=76,top=54,bottom=44;
    const X=v=>left+v/1.1*(Wd-left-right),rowH=(Ht-top-bottom)/4;
    text(svg,0,25,c.name+' : États-Unis = 100 %',{'font-size':25,'font-weight':700});
    C.el('line',{x1:X(1),x2:X(1),y1:40,y2:Ht-bottom,stroke:'#697386','stroke-dasharray':'6 6','stroke-width':2},svg);
    const rows=[['Production par travailleur',c.yRatio,'output'],['Contribution du capital',c.kFactor,'capital'],['Contribution du capital humain',c.hFactor,'human'],['PGF (résidu)',c.aRatio,'tfp']],items=[];
    rows.forEach(([label,value,key],i)=>{
      const y=top+i*rowH;
      text(svg,left,y+26,label,{'font-size':25,'font-weight':600,fill:colors[key]});
      const node=C.el('rect',{x:left,y:y+42,width:X(value)-left,height:48,fill:colors[key],class:ctx.animate?'ch-bar anim-x':'ch-bar',style:`animation-delay:${i*.08}s`},svg);
      text(svg,X(value)+10,y+74,pct(value),{'font-size':25,'font-weight':700,fill:colors[key]});
      items.push({node,text:c.name+' — '+label+' : '+pct(value,2)+' du niveau américain.'});
    });
    C.el('line',{x1:left,y1:Ht-bottom,x2:Wd-right+20,y2:Ht-bottom,class:'ch-axis','marker-end':arrow},svg);
    [0,.25,.5,.75,1,1.1].forEach(v=>{C.el('line',{x1:X(v),x2:X(v),y1:Ht-bottom,y2:Ht-bottom+7,class:'ch-tickmark'},svg);text(svg,X(v),Ht-13,fmt(100*v,0),{'text-anchor':'middle','font-size':21});});
    inspect(box,items);
  }
  G.on('s2-compta-pays',(el,ctx)=>{
    el.classList.toggle('cp-static-mode',ctx.static);
    if(ctx.static)return;
    const index=Math.min(3,ctx.step),c=D.countries[index];
    el.querySelector('#cp-country-text').innerHTML=countryText(c,index);
    const triggers=[...el.querySelectorAll('.cp-calculation-trigger')];
    const closeAll=()=>triggers.forEach(button=>{button.setAttribute('aria-expanded','false');el.querySelector('#'+button.getAttribute('aria-controls')).hidden=true;});
    triggers.forEach(button=>{button.onclick=e=>{e.stopPropagation();const open=button.getAttribute('aria-expanded')!=='true';closeAll();button.setAttribute('aria-expanded',String(open));el.querySelector('#'+button.getAttribute('aria-controls')).hidden=!open;};});
    el.querySelectorAll('.cp-calculation-close').forEach(button=>{button.onclick=e=>{e.stopPropagation();const trigger=triggers.find(t=>t.getAttribute('aria-controls')===button.parentElement.id);closeAll();trigger.focus();};});
    el.onclick=e=>{if(!e.target.closest('.cp-calculation-bubble,.cp-calculation-trigger'))closeAll();};
    el.onkeydown=e=>{if(e.key==='Escape'){const active=triggers.find(t=>t.getAttribute('aria-expanded')==='true');if(active){e.preventDefault();e.stopPropagation();closeAll();active.focus();}}};
    countryChart(el.querySelector('#cp-country-chart'),c,ctx);
  });
  G.on('s2-compta-groupes',(el,ctx)=>{
    const box=el.querySelector('#cp-group-chart'),key=box.clientWidth+'|'+ctx.static;
    if(box.dataset.render===key&&!ctx.entry)return;
    box.dataset.render=key;
    const {svg,Wd,Ht}=C.frame(box,{height:440,aria:'Parts du capital, du capital humain et de la PGF dans quatre groupes de pays'}),left=164,right=14,top=15,bottom=46;
    const X=v=>left+v*(Wd-left-right),rowH=(Ht-top-bottom)/4,items=[];
    D.groups.forEach((group,i)=>{
      const y=top+rowH*i+12,h=55;let accumulated=0;
      text(svg,left-16,y+25,group.label,{'text-anchor':'end','font-size':24});
      text(svg,left-16,y+49,group.count+' pays',{'text-anchor':'end','font-size':19,fill:'#536078'});
      [['capital','Capital physique'],['human','Capital humain'],['tfp','PGF']].forEach(([key,label],j)=>{
        const value=group.shares[key],x=X(accumulated),w=X(accumulated+value)-x;
        const node=C.el('rect',{x,y,width:w-1,height:h,fill:colors[key],class:ctx.animate?'ch-bar anim-x':'ch-bar',style:`animation-delay:${i*.12+j*.07}s`},svg);
        text(svg,x+w/2,y+35,pct(value),{'text-anchor':'middle','font-size':24,'font-weight':700,fill:'#fff','pointer-events':'none'});
        items.push({node,text:group.label+' du niveau américain ('+group.count+' pays) — '+label+' : '+pct(value,2)+' de l’écart logarithmique.'});
        accumulated+=value;
      });
    });
    C.el('line',{x1:X(0),x2:X(1),y1:Ht-bottom,y2:Ht-bottom,class:'ch-axis'},svg);
    [0,.25,.5,.75,1].forEach(v=>{C.el('line',{x1:X(v),x2:X(v),y1:Ht-bottom,y2:Ht-bottom+7,class:'ch-tickmark'},svg);text(svg,X(v),Ht-15,pct(v,0),{'text-anchor':'middle','font-size':21});});
    inspect(box,items);
  });
})();
