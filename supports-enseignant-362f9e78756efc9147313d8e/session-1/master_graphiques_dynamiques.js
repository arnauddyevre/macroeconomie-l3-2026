/* Graphiques natifs du master et actualisations Insee, depuis les données archivées.
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

  const consommation = window.CONSOMMATION_INSEE_DATA;
  const consumptionStyles = {
    CP01:{name:'Alimentation et boissons non alcoolisées',endLabel:'Alimentation',color:'#B45309',dash:false},
    CP04:{name:'Logement, eau et énergie',endLabel:'Logement, eau et énergie',color:'#001F5F',dash:false},
    CP03:{name:'Habillement et chaussures',endLabel:'Habillement',color:'#B45309',dash:'9 5'},
    CP07:{name:'Transports',endLabel:'Transports',color:'#001F5F',dash:'3 5'}
  };
  install('master-ipc-poids',
    `<div class="master-consumption-layout">
      <figure class="master-native-figure master-consumption-figure">
        <p class="master-chart-metadata">France · 1960–2025 · parts des dépenses à prix courants · 2025 provisoire</p>
        <div id="master-consumption-chart" class="master-native-chart"></div>
        <figcaption>La structure des dépenses change. Les <b>pondérations d’un indice de prix doivent être actualisées.</b></figcaption>
        <p class="master-chart-definition">Quatre postes sélectionnés. Logement : eau, énergie et loyers imputés inclus. Ces parts des comptes nationaux diffèrent des poids exacts de l’IPC.</p>
      </figure>
      <aside class="def master-chain-note" aria-labelledby="master-chain-title">
        <h2 id="master-chain-title">Une solution partielle : le chaînage d'indice</h2>
        <p class="master-chain-idea"><b>Idée :</b> actualiser le panier tous les ans et calculer l'inflation sur plusieurs années comme un produit d'inflations annuelles.</p>
        <p>À chaque étape, on compare <b>le même panier aux prix des deux dates</b> (principe de Laspeyres).</p>
        <p>On multiplie les <b>facteurs 1 + π<sub>t</sub></b>, avec π<sub>t</sub> le taux annuel en décimal.</p>
        <div class="master-chain-formula" aria-label="IPC à la date T égale IPC initial multiplié par le produit, de t égal 1 à T, de 1 plus pi t">
          <span>IPC<sub><var>T</var></sub> = IPC<sub>0</sub> ×</span>
          <span class="master-chain-product"><sup><var>T</var></sup><span>∏</span><sub><var>t</var> = 1</sub></span>
          <span>(1 + <var>π</var><sub><var>t</var></sub>)</span>
        </div>
        <p class="master-chain-example"><b>10 % puis 5 % :</b> 1,10 × 1,05 − 1 = <b>15,5 %</b> au total.</p>
        <p class="master-chain-limit"><b>Limite :</b> les substitutions entre produits et les changements de qualité restent à traiter.</p>
      </aside>
    </div>`,
    link(consommation.sourceUrl,'Insee, comptes nationaux, tableau 2.201, base 2020')+' · publication du 29 mai 2026.',
    '<p>27 octobre 2026 : graphique demandé par Arnaud après la proposition de quatre courbes sur 1960–2025. Remplace le tableau historique du master p. 64, dont la somme des postes visibles était à confirmer. Source officielle : tableau 2.201 à prix courants, publication du 29 mai 2026. Pour chaque année, part = 100 × dépense du poste / dépense de consommation individuelle des ménages (S14). Quatre séries complètes, CP01, CP04, CP03 et CP07, 66 observations annuelles chacune. Les lignes relient les observations sans inventer d’année manquante. Le champ inclut les loyers imputés et ne représente pas les pondérations officielles de l’IPC. La dépense totale S14 inclut le solde territorial CP16. Les changements de parts reflètent prix relatifs et quantités, sans identifier séparément leurs contributions. Données 2025 provisoires. Le classeur conserve aussi 1959, hors fenêtre affichée. Source, extraction reproductible et contrôles dans sources/consommation_insee_2026-10-27/README.md. L’ancienne image et sa transcription restent archivées.</p>',
    (el, ctx) => {
      const host=el.querySelector('#master-consumption-chart');
      host.innerHTML='';
      const box=window.PJ.zoom(host,1.1);
      C.line(box,{
        height:box.clientHeight,animate:animated(ctx),duration:2,stagger:0,
        hover:!ctx.print,ends:true,legend:false,labelGap:29,
        aria:'France, parts de la consommation des ménages de 1960 à 2025. Alimentation, logement, habillement et transports. Comptes nationaux, loyers imputés inclus.',
        yTitle:'Part des dépenses (%)',
        y:{min:0,max:35,ticks:[0,5,10,15,20,25,30,35]},
        x:{min:1960,max:2025,ticks:[1960,1980,2000,2025]},
        series:consommation.series.map(s=>({...consumptionStyles[s.code],
          endLabel:s.code==='CP04'?'Logement':consumptionStyles[s.code].endLabel,
          data:s.values,gaps:1.5,format:pct}))
      });
      box.querySelector('.ch-readout')?.setAttribute('aria-live','polite');
    });
  window.NOTES['master-ipc-poids'] += '<p>28 octobre 2026 : graphique placé à gauche et ajout à droite de l’encadré bleu « Une solution partielle : le chaînage d’indice », à la demande d’Arnaud. Sa première phrase reprend la formulation demandée. La formule précise que le produit porte sur les facteurs 1 + π_t, pas sur les taux eux-mêmes. Exemple fictif : 1,10 × 1,05 − 1 = 15,5 %. Chaque maillon compare un panier fixé aux prix des deux dates. L’IPC français est de type Laspeyres, avec mise à jour annuelle du panier et des pondérations, raccordement en décembre. Le schéma pédagogique ne décrit pas les calculs élémentaires ni le décalage des données de pondération. L’actualisation ne résout pas seule les substitutions ou les ajustements de qualité. Source méthodologique : <a href="https://www.insee.fr/fr/statistiques/documentation/IPC_op%C3%A9rations%20changement%20ann%C3%A9e%202024.pdf" target="_blank" rel="noopener noreferrer">Insee, changements de l’IPC en 2024</a>, pp. 1–2, consulté le 28 octobre 2026. Les quatre séries de comptabilité nationale et leurs 264 observations sont conservées. « Logement » abrège uniquement le libellé de fin de courbe. Le nom complet reste accessible dans l’infobulle et le champ est précisé sous le graphique.</p>';

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
