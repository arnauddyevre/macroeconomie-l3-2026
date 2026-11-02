/* Passage du RNB au revenu disponible ajusté des ménages — Insee, 2025.
 * Graphique autonome pour pib-revenu ; données et provenance dans
 * data/revenu_menages_data.js et sources/revenu_menages_2026-11-01/.
 */
(function () {
  'use strict';
  const CH = window.Charts, D = window.REVENU_MENAGES_DATA, ID = 'pib-revenu';
  if (!CH || !D || !window.Deck) throw new Error('Sources du graphique des revenus des ménages absentes.');
  const fmt = (value, digits = 0) => CH.fmt(value, digits);
  const gap = D.rnb - D.rdbAdjusted;
  const otherSectors = D.administrations + D.npish;
  const afterTransfers = D.rnb - D.netCurrentTransfersAbroad;
  const afterCorporations = afterTransfers - D.corporations;
  const rows = [
    {key:'pib',label:'PIB',value:D.pib,start:0,end:D.pib,
      detail:'Produit intérieur brut : valeur ajoutée créée par la production intérieure.'},
    {key:'rnb',label:'RNB',value:D.rnb,start:0,end:D.rnb,
      detail:'Revenu national brut : revenus primaires des résidents, y compris le solde des revenus primaires avec l’étranger.'},
    {key:'transfers',label:'Transferts courants nets à l’étranger',value:D.netCurrentTransfersAbroad,start:afterTransfers,end:D.rnb,deduction:true,
      detail:'Transferts courants versés au reste du monde moins ceux reçus. Exemples :',
      examples:[
        'Rémittances : argent envoyé à la famille résidant à l’étranger.',
        'Impôts courants, cotisations et prestations sociales, dont les pensions.',
        'Aides et contributions courantes de coopération internationale.',
        'Primes nettes et indemnités d’assurance dommages.'
      ],
      result:`Après ce solde, le revenu national disponible brut est de ${fmt(D.rndb,3)} milliards d’euros.`},
    {key:'corporations',label:'Revenu disponible des sociétés',value:D.corporations,start:afterCorporations,end:afterTransfers,deduction:true,
      detail:'Revenu disponible des sociétés financières et non financières, après rémunérations, revenus de propriété et redistribution. Il contribue notamment au financement de leur investissement. Les entrepreneurs individuels sont inclus dans le secteur des ménages.'},
    {key:'other-sectors',label:'Administrations publiques et associations',value:otherSectors,start:afterCorporations-otherSectors,end:afterCorporations,deduction:true,
      detail:`Revenu disponible ajusté des administrations (${fmt(D.administrations,3)}) et des associations au service des ménages (${fmt(D.npish,3)} milliards d’euros), après attribution aux ménages des services reçus en nature. Ces ressources financent notamment des services collectifs et l’épargne de ces secteurs.`},
    {key:'adjusted',label:'RDB ajusté des ménages',value:D.rdbAdjusted,start:0,end:D.rdbAdjusted,
      detail:`Revenu disponible brut (${fmt(D.rdb,3)}) augmenté des services reçus en nature (${fmt(D.transfersInKind,3)} milliards d’euros), notamment en santé et en éducation. L’écart avec le RNB est de ${fmt(gap,3)} milliards d’euros ; la décomposition comporte un écart d’arrondi de 0,001 milliard.`},
    {key:'rdb',label:'RDB des ménages',value:D.rdb,start:0,end:D.rdb,
      detail:'Revenu disponible brut dont disposent les ménages pour consommer ou épargner, après impôts directs, cotisations et prestations sociales en espèces, avant ajout des services reçus en nature.'}
  ];
  let current = null;

  function draw(element, ctx = {}) {
    const host = element.querySelector('#pj-rev');
    if (!host) return;
    const box = window.PJ.zoom(host,1.08);
    const animate = !(ctx.print || ctx.reading || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const {svg,Wd,Ht} = CH.frame(box,{
      height:box.clientHeight,
      aria:`France, ${D.year}, milliards d’euros. Du RNB (${fmt(D.rnb)}) au revenu disponible ajusté des ménages (${fmt(D.rdbAdjusted)}) : ${fmt(gap)} d’écart. Sept barres consultables au clavier.`
    });
    svg.setAttribute('role','group');
    svg.classList.add('rm-svg');
    const top = 67, bottom = Ht-35, stride = (bottom-top-17)/6, barH = 22;
    const labelY = index => top + stride*index + (index === 6 ? 17 : 0);
    const barY = index => labelY(index)+10;
    const left = 9, right = Wd-76;
    const X = value => left + value / D.rnb * (right-left);
    const heading = CH.txt(svg,left,21,`Du RNB au RDB ajusté : −${fmt(gap)} Md€`,'rm-heading');
    heading.setAttribute('aria-hidden','true');
    CH.txt(svg,left,44,`France, ${D.year} · milliards d’euros`,'rm-meta',{'aria-hidden':'true'});
    CH.el('line',{x1:left,x2:left,y1:barY(0)-3,y2:barY(6)+barH+3,class:'rm-origin','aria-hidden':'true'},svg);

    // Chaque retrait se lit de la droite vers la gauche. Le dernier raccord
    // rejoint le total publié : les tableaux en M€ diffèrent de 1 M€ à l’arrondi.
    const links = CH.el('g',{class:'rm-connectors','aria-hidden':'true'},svg);
    for (let i = 1; i < 5; i++) {
      const endpoint = i === 1 ? D.rnb : rows[i].start;
      CH.el('line',{x1:X(endpoint),x2:X(endpoint),y1:barY(i)+barH,y2:barY(i+1),class:'rm-connector'},links);
    }
    CH.el('line',{x1:X(D.rdbAdjusted),x2:X(D.rdbAdjusted),y1:barY(4)+barH,y2:barY(5),class:'rm-connector'},links);

    const tip = document.createElement('div');
    tip.className = 'ch-readout rm-readout';
    tip.id = 'rm-revenue-tooltip';
    tip.setAttribute('role','tooltip');
    tip.hidden = true;
    box.appendChild(tip);
    const groups = [];
    function hide() {
      tip.hidden = true;
      tip.classList.remove('on');
      groups.forEach(group => group.classList.remove('rm-focused'));
    }
    function show(row, index) {
      groups.forEach(group => group.classList.remove('rm-focused'));
      groups[index].classList.add('rm-focused');
      tip.replaceChildren();
      const title = document.createElement('strong');
      title.textContent = `${row.label} : ${row.deduction ? '−' : ''}${fmt(row.value,3)} Md€`;
      const detail = document.createElement('span');
      detail.textContent = row.detail;
      tip.append(title,detail);
      if (row.examples) {
        const examples = document.createElement('ul');
        examples.className = 'rm-examples';
        row.examples.forEach(example => {
          const item = document.createElement('li');
          item.textContent = example;
          examples.appendChild(item);
        });
        tip.appendChild(examples);
      }
      if (row.result) {
        const result = document.createElement('span');
        result.className = 'rm-result';
        result.textContent = row.result;
        tip.appendChild(result);
      }
      tip.hidden = false;
      tip.classList.add('on');
      const lower = barY(index)+barH+10;
      const y = lower+tip.offsetHeight < Ht ? lower : Math.max(3,labelY(index)-tip.offsetHeight-13);
      tip.style.top = `${y}px`;
    }

    rows.forEach((row,index) => {
      const y = barY(index), group = CH.el('g',{
        class:`rm-row${row.deduction ? ' rm-deduction' : ''}`,
        tabindex:ctx.print ? null : 0,'data-keys':'','data-row':row.key,
        'data-start':row.start,'data-end':row.end,'data-value':row.value,
        role:'img','aria-label':`${row.label} : ${row.deduction ? 'moins ' : ''}${fmt(row.value,3)} milliards d’euros. ${[row.detail,...(row.examples || []),row.result].filter(Boolean).join(' ')}`,
        'aria-describedby':tip.id
      },svg);
      groups.push(group);
      CH.el('rect',{x:0,y:labelY(index)-24,width:Wd,height:51,rx:4,class:'rm-hit'},group);
      CH.txt(group,left,labelY(index),row.label,'rm-label',{'aria-hidden':'true'});
      const totalColor = row.key === 'pib' ? '#65768C' : '#001F5F';
      function bar(start,end,color,extraClass = '') {
        return CH.el('rect',{
          x:X(start),y,width:Math.max(.1,X(end)-X(start)),height:barH,fill:color,
          class:`rm-bar ${extraClass}${animate ? ' ch-bar anim-x' : ''}`,
          style:animate ? `animation-delay:${index*.12}s` : null,'aria-hidden':'true'
        },group);
      }
      if (row.key === 'adjusted') {
        bar(0,D.rdb,'#001F5F');
        bar(D.rdb,D.rdbAdjusted,'#BFCDE0','rm-in-kind');
        const center = (X(D.rdb)+X(D.rdbAdjusted))/2;
        CH.txt(group,center,y+17,`+${fmt(D.transfersInKind)}`,'rm-in-kind-value',{'text-anchor':'middle','aria-hidden':'true'});
        CH.txt(group,center,y+barH+20,'en nature','rm-in-kind-label',{'text-anchor':'middle','aria-hidden':'true'});
        CH.el('line',{x1:center,x2:center,y1:y+barH+1,y2:y+barH+6,stroke:'#65768C','stroke-width':1.2,'aria-hidden':'true'},group);
      } else bar(row.start,row.end,row.deduction ? '#B45309' : totalColor,row.deduction ? 'rm-subtract' : '');
      CH.txt(group,X(row.end)+9,y+18,`${row.deduction ? '−' : ''}${fmt(row.value)}`,'rm-value ch-num',{'aria-hidden':'true'});
      group.addEventListener('pointerenter',() => show(row,index));
      group.addEventListener('pointerleave',() => {
        const focusedIndex = groups.indexOf(document.activeElement);
        if (focusedIndex >= 0) show(rows[focusedIndex],focusedIndex); else hide();
      });
      group.addEventListener('focus',() => show(row,index));
      group.addEventListener('blur',hide);
      group.addEventListener('keydown',event => {
        if (['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key)) {
          event.preventDefault();event.stopPropagation();
          let next = index + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1);
          if (event.key === 'Home') next = 0;
          if (event.key === 'End') next = rows.length-1;
          groups[Math.max(0,Math.min(rows.length-1,next))].focus();
        } else if (event.key === 'Escape') {
          event.preventDefault();event.stopPropagation();hide();group.blur();
        }
      });
    });
    current = {element,hide};
  }

  // Deck.on fusionne les propriétés : seule l’ancienne fonction enter du
  // diagramme à quatre barres est remplacée ; les étapes du texte sont intactes.
  window.Deck.on(ID,{enter:draw,leave(){if(current)current.hide();}});
  window.addEventListener('beforeprint',() => {
    const element = window.Deck.slideEl(ID);if(element)draw(element,{print:true});
  });
  window.addEventListener('afterprint',() => {
    const element = window.Deck.slideEl(ID);
    if(element)draw(element,{reading:true});
  });
  window.REVENU_MENAGES_CHART = {id:ID,rows,draw};
})();
