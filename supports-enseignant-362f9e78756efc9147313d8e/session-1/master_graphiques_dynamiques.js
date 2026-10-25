/* Reconstruction de deux graphiques historiques, depuis les données archivées.
 * Charger après integrerApportsMaster(). */
(function () {
  'use strict';
  const C = window.Charts;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pct = v => C.fmt(v, 1) + ' %';
  const animated = ctx => !(ctx.print || ctx.reading || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const find = id => window.SLIDES.find(s => s.id === id);
  const link = (url, text) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;

  function install(id, html, source, note, draw) {
    const s = find(id);
    if (!s) throw new Error('Diapositive absente : ' + id);
    s.html = html; s.source = source;
    s.cls = (s.cls || '') + ' master-dynamic-slide';
    window.NOTES[id] = note;
    const render = (el, ctx = {}) => draw(el, ctx);
    window.Deck.on(id, {enter:render});
    window.addEventListener('beforeprint', () => {
      const el = window.Deck.slideEl(id); if (el) render(el, {print:true});
    });
    window.addEventListener('afterprint', () => {
      const el = window.Deck.slideEl(id); if (el) render(el, {reading:document.body.classList.contains('reading')});
    });
  }

  const data = window.MASTER_GDP_COMPONENTS;
  const fields = [
    {key:'private_consumption', name:'Consommation privée', color:'#001F5F'},
    {key:'public_consumption', name:'Consommation publique', color:'#B45309'},
    {key:'investment', name:'Investissement hors stocks', color:'#536078', dash:'10 5'},
    {key:'exports', name:'Exportations', color:'#001F5F', dash:'3 5'},
    {key:'imports', name:'Importations', color:'#B45309', dash:'10 5'},
    {key:'stocks', name:'Variations de stocks', color:'#536078'}
  ];
  install('master-composantes-france',
    '<figure class="master-native-figure"><p class="master-chart-metadata">France · 1949–2025 · comptes nationaux, base 2020 · millésime mai 2026</p><div id="master-components-chart" class="master-native-chart"></div><figcaption>Les parts de la consommation, de l’investissement et des échanges évoluent. Les <b>importations sont à soustraire</b> dans le calcul du PIB.</figcaption><p class="master-chart-definition">Consommation privée : ménages et ISBLSM. Investissement hors stocks : FBCF et acquisitions nettes d’objets de valeur, tous secteurs.</p></figure>',
    link(data.source.url, 'Insee, comptes nationaux annuels, tableau 1.101, base 2020') + ' · données à prix courants, 1949–2025.',
    '<p>Choix de présentation confirmé par Arnaud le 23 octobre 2026 : graphiques dynamiques. Remplace l’image du master p. 29 par une reconstruction depuis le classeur officiel archivé, sans numérisation des pixels. La période et le millésime sont explicitement actualisés : 1949–2025, base 2020, fichier du 21 mai 2026. Ce n’est pas une reproduction identique du millésime historique. Convention française : C inclut les ISBLSM ; G exclut l’investissement public, inclus dans I. Parts de montants à prix courants, non séries de volume. L’identité C + G + I hors stocks + stocks + X − M = PIB présente deux écarts internes au classeur publié : −0,024 Md€ en 2023 et +0,442 Md€ en 2024 (environ −0,00085 et +0,01506 point de PIB), liés à la ligne de consommation publique S13. Les séries sont conservées telles que publiées ; les autres années sont cohérentes aux arrondis près. Audit détaillé dans data/master_gdp_components.json.</p>',
    (el, ctx) => {
      const host = el.querySelector('#master-components-chart');
      host.innerHTML = '';
      const box = window.PJ.zoom(host, 1.2);
      C.line(box, {
        height:box.clientHeight, animate:animated(ctx), duration:2, stagger:0,
        hover:!ctx.print, ends:true, legend:false, labelGap:27,
        aria:'Composantes de la dépense en France de 1949 à 2025, en pourcentage du PIB à prix courants',
        yTitle:'En % du PIB à prix courants',
        y:{min:-5,max:70,ticks:[0,10,20,30,40,50,60,70]},
        x:{min:1949,max:2025,ticks:[1950,1960,1970,1980,1990,2000,2010,2025]},
        series:fields.map(f => ({...f, endLabel:f.name, data:data.rows.map(r => [r.year,r[f.key]]), gaps:1.5, format:pct}))
      });
    });

  const informal = window.MASTER_INFORMAL_DATA;
  install('master-informel',
    '<figure class="master-native-figure"><p class="master-chart-metadata">Économie souterraine estimée · moyennes 1991–2015 · 19 économies sélectionnées</p><div class="master-informal-panels"><div class="master-informal-panel"></div><div class="master-informal-panel"></div></div><figcaption>Informel ne signifie pas automatiquement « hors PIB ». Le problème est aussi l’observation.</figcaption><p class="master-chart-definition">Estimations de recherche, principalement d’activités productives légales dissimulées aux autorités. Les transactions illégales consenties peuvent aussi entrer dans les comptes.</p></figure>',
    link(informal.source.url, 'Medina et Schneider (2018), FMI WP/18/17, tableau 18, pp. 50–54') + ' · % du PIB officiel.',
    '<p>Master p. 38 et 40. Remplace l’image FT/FMI par les valeurs publiées dans la colonne Average du tableau 18 de Medina et Schneider (2018), 19 économies et ordre de la capture conservés. Période 1991–2015. Aucune actualisation et aucune valeur déduite des pixels. Il s’agit d’estimations d’économie souterraine, principalement productive légale, non d’une mesure globale des activités illégales ni d’une fraction mécaniquement absente du PIB officiel. Les auteurs discutent les limites de leur définition pp. 4–6. Le vol n’est pas une production. Dépenser un revenu dissimulé dans le secteur formel ne prouve pas que la production initiale a déjà été comptée.</p>',
    (el, ctx) => {
      el.querySelectorAll('.master-informal-panel').forEach((host, panel) => {
        host.innerHTML = '';
        const rows = panel ? informal.rows.slice(10) : informal.rows.slice(0,10);
        const box = window.PJ.zoom(host, 1.16);
        const {svg} = C.hbars(box, {
          height:box.clientHeight, animate:animated(ctx), max:60,
          margin:{l:176,r:55,t:44,b:panel ? 8 + (box.clientHeight - 52) / 10 : 8}, yTitle:'En % du PIB officiel',
          aria:'Économie souterraine, moyenne 1991–2015 : '+rows.map(r=>r.label).join(', '),
          data:rows.map(r=>({...r, color:r.iso3 === 'FRA' ? '#B45309' : '#001F5F'})),
          format:pct
        });
        if (ctx.print) return;
        const readout = document.createElement('div'); readout.className = 'ch-readout';
        readout.setAttribute('aria-live','polite'); box.appendChild(readout);
        const bars = [...svg.querySelectorAll('g > rect')];
        const show = i => {
          const r = rows[i];
          readout.innerHTML = `<b>${esc(r.label)}</b><div>${pct(r.value)} du PIB officiel</div><div>Moyenne 1991–2015 · estimation</div>`;
          readout.classList.add('on'); bars.forEach((b,j)=>b.setAttribute('opacity',i===j?1:.4));
        };
        const hide = () => {readout.classList.remove('on'); bars.forEach(b=>b.setAttribute('opacity',1));};
        bars.forEach((bar,i) => {
          bar.classList.add('ch-bar'); bar.tabIndex = 0; bar.setAttribute('role','img');
          bar.setAttribute('data-keys','');
          bar.setAttribute('aria-label',rows[i].label+' : '+pct(rows[i].value)+', moyenne 1991–2015');
          bar.addEventListener('pointerenter',()=>show(i)); bar.addEventListener('pointerleave',hide);
          bar.addEventListener('focus',()=>show(i)); bar.addEventListener('blur',hide);
          bar.addEventListener('keydown',e=>{
            if (['ArrowUp','ArrowDown','Home','End'].includes(e.key)) {
              e.preventDefault(); e.stopPropagation();
              bars[e.key==='Home'?0:e.key==='End'?bars.length-1:Math.max(0,Math.min(bars.length-1,i+(e.key==='ArrowDown'?1:-1)))].focus();
            }
            if (e.key==='Escape') { e.stopPropagation(); bar.blur(); }
          });
        });
      });
    });
})();
