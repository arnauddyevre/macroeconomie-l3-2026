/* Deux schémas du cours de master, reconstruits en SVG natif.
 * Arnaud Dyèvre, 23 octobre 2026. Pages physiques 15 et 22 du PDF archivé.
 * Charger avant reorganisation.js et avant la construction du Deck.
 * Les surfaces sont schématiques, sans données ni proportions quantitatives. */
(function () {
  'use strict';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const master = '../../references/sources/master_2025/MEF_Macroeconomics_Lecture_1(1).pdf';
  const commune = '<p><strong>Convention comptable :</strong> la valeur ajoutée est évaluée aux prix de base. Pour obtenir le PIB aux prix du marché, ajouter les impôts sur les produits et retrancher les subventions sur les produits. Le schéma des dépenses suppose les impôts nets sur les produits nuls ; cette hypothèse rend la valeur ajoutée égale au PIB. Les rectangles et les flèches sont schématiques : aucune surface ne représente une donnée ou une part observée.</p>';

  function text(x, y, lines, cls = '') {
    const start = y - (lines.length - 1) * 18;
    return `<text x="${x}" y="${start}" text-anchor="middle" dominant-baseline="middle" class="${cls}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? 36 : 0}">${esc(line)}</tspan>`).join('')}</text>`;
  }

  function block(id, x, y, w, h, lines, detail, cls, delay) {
    return `<g class="pib-schema-block ${cls}" tabindex="0" role="img" data-keys="" data-detail="${esc(detail)}" aria-label="${esc(lines.join(' ') + '. ' + detail)}" style="--reveal-delay:${delay}ms">
      <title>${esc(lines.join(' ') + ' : ' + detail)}</title>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" />
      ${text(x + w / 2, y + h / 2, lines)}
    </g>`;
  }

  function diagram(id, kind) {
    const income = kind === 'income';
    const heads = text(300, 37, ['Production totale'], 'pib-schema-heading') + text(1070, 37, [income ? 'Répartition des revenus' : 'Origine des dépenses'], 'pib-schema-heading');
    const left = block(id, 85, 95, 430, 110, ['Consommations', 'intermédiaires'], 'Biens et services transformés ou entièrement consommés pendant la production.', 'pib-schema-intermediate', 0)
      + block(id, 85, 205, 430, 330, ['Valeur ajoutée'], 'Production moins consommations intermédiaires : la richesse créée par les unités productrices.', 'pib-schema-value', 150);
    const rows = income ? [
      {lines:['Fournisseurs'], detail:'Les achats intermédiaires rémunèrent d’autres producteurs. Ils sont déduits pour calculer la valeur ajoutée de l’unité.', cls:'pib-schema-intermediate', y:95, h:110},
      {lines:['Rémunération des salariés'], detail:'Salaires et cotisations sociales à la charge des employeurs.', cls:'pib-schema-light', y:205, h:110},
      {lines:['Autres impôts sur la production', 'nets des autres subventions'], detail:'Autres impôts sur la production, nets des autres subventions ; les impôts sur les produits relèvent de la passerelle entre valeur ajoutée et PIB.', cls:'pib-schema-warm', y:315, h:110},
      {lines:['Excédent brut d’exploitation', '+ revenu mixte'], detail:'Solde brut après rémunération des salariés et autres impôts nets sur la production. Il inclut la consommation de capital fixe.', cls:'pib-schema-light', y:425, h:110}
    ] : [
      {lines:['Achats intermédiaires'], detail:'Les ventes intermédiaires se compensent avec les consommations intermédiaires lors de l’agrégation des unités résidentes.', cls:'pib-schema-intermediate', y:95, h:110},
      {lines:['C · Consommation privée'], detail:'Dépenses de consommation finale des ménages et des institutions sans but lucratif au service des ménages.', cls:'pib-schema-light', y:205, h:82.5},
      {lines:['I · Investissement'], detail:'Formation brute de capital de tous les secteurs, y compris public : capital fixe, variations de stocks et acquisitions nettes d’objets de valeur.', cls:'pib-schema-warm', y:287.5, h:82.5},
      {lines:['G · Consommation publique'], detail:'Dépenses de consommation finale des administrations publiques. L’investissement public est dans I ; les transferts monétaires ne sont pas une dépense finale.', cls:'pib-schema-light', y:370, h:82.5},
      {lines:['X − M · Exportations nettes'], detail:'Exportations moins importations. Les importations sont soustraites pour ne retenir que la production intérieure. Ce solde peut être négatif.', cls:'pib-schema-warm', y:452.5, h:82.5}
    ];
    const right = rows.map((r, i) => block(id, 790, r.y, 560, r.h, r.lines, r.detail, r.cls, 300 + i * 150)).join('');
    const arrows = rows.map((r, i) => {
      const y = r.y + r.h / 2;
      const x1 = income ? 524 : 779, x2 = income ? 777 : 528;
      return `<path class="pib-schema-arrow" d="M ${x1} ${y} H ${x2}" marker-end="url(#${id}-arrow)" pathLength="1" style="--reveal-delay:${400 + i * 150}ms" />`;
    }).join('');
    return `<svg class="pib-schema-svg" viewBox="0 0 1440 570" role="group" aria-label="${income ? 'La production se répartit entre les fournisseurs et les revenus issus de la valeur ajoutée.' : 'La production se répartit entre consommations intermédiaires et dépenses finales nettes des importations.'}">
      <defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="#001F5F" stroke-width="1.5" /></marker></defs>
      ${heads}${left}${right}${arrows}
    </svg>`;
  }

  function install(id, title, kind, page, caption, note) {
    window.SLIDES.push({
      id, title, part:'Partie 1 · Que mesure-t-on ?', cls:'pib-schema-slide',
      html:`<figure class="pib-schema">${diagram(id, kind)}<figcaption>${caption}</figcaption><p class="pib-schema-convention">${kind === 'expenditure' ? 'Hypothèse : impôts nets sur les produits nuls (PIB = valeur ajoutée). Schéma sans proportions quantitatives.' : 'Schéma sans proportions quantitatives · PIB = valeur ajoutée + impôts nets sur les produits.'}</p><div class="ch-readout pib-schema-readout" role="status" aria-live="polite"></div></figure>`,
      source:''
    });
    window.NOTES[id] = `<p>23 octobre 2026 : reconstruction native en SVG, à la demande d’Arnaud, de la page physique ${page} du <a href="${master}#page=${page}">cours de master</a>. Les deux colonnes empilées et le sens des flèches reprennent la figure source. Animation à l’entrée ; descriptions des blocs au survol et au clavier. L’impression et le mode lecture montrent le schéma complet.</p>${note}${commune}`;
    window.Deck.on(id, {enter(el, ctx = {}) {
      const figure = el.querySelector('.pib-schema');
      const animated = !(ctx.print || ctx.reading || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      figure.classList.remove('pib-schema-animated');
      if (animated) { void figure.offsetWidth; figure.classList.add('pib-schema-animated'); }
      if (figure.dataset.bound || ctx.print) return;
      figure.dataset.bound = 'true';
      const readout = figure.querySelector('.pib-schema-readout');
      const blocks = [...figure.querySelectorAll('.pib-schema-block')];
      const show = block => {
        readout.textContent = block.dataset.detail;
        readout.classList.add('on');
        block.classList.add('pib-schema-selected');
      };
      const hide = block => {
        block.classList.remove('pib-schema-selected');
        readout.classList.remove('on');
      };
      blocks.forEach((block, i) => {
        block.addEventListener('pointerenter', () => show(block));
        block.addEventListener('pointerleave', () => { if (document.activeElement !== block) hide(block); });
        block.addEventListener('focus', () => show(block));
        block.addEventListener('blur', () => hide(block));
        block.addEventListener('keydown', e => {
          if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
            e.preventDefault(); e.stopPropagation();
            const next = e.key === 'Home' ? 0 : e.key === 'End' ? blocks.length - 1 : Math.max(0, Math.min(blocks.length - 1, i + (['ArrowDown','ArrowRight'].includes(e.key) ? 1 : -1)));
            blocks[next].focus();
          }
          if (e.key === 'Escape') { e.stopPropagation(); block.blur(); }
        });
      });
    }});
  }

  install('va-revenus-schema', 'Valeur ajoutée = revenus', 'income', 15,
    'La valeur ajoutée se répartit entre <strong>travail, prélèvements sur la production et excédent brut</strong>.',
    '<p><strong>Lecture :</strong> la production paie d’abord les consommations intermédiaires aux fournisseurs. La valeur ajoutée se répartit ensuite en rémunération des salariés, autres impôts sur la production nets des autres subventions, et excédent brut d’exploitation (EBE) ou revenu mixte. La rémunération des salariés comprend les cotisations sociales employeurs. Le revenu mixte concerne les entreprises individuelles, où travail et capital sont difficilement séparables.</p><p><strong>Adaptation de la figure du master :</strong> les rubriques « Rent » et « Profits + interest + capital depreciation » sont remplacées par les catégories des comptes nationaux français. Les intérêts, dividendes et rentes foncières sont des revenus de la propriété distribués après la formation de l’EBE ; il ne faut pas les ajouter une deuxième fois. Les locations de bâtiments ou d’équipements sont des services : leur coût est une consommation intermédiaire du locataire producteur et une production du bailleur. L’EBE et le revenu mixte sont bruts : ils incluent la consommation de capital fixe. Le passage au net la retrancherait.</p>');

  install('va-depenses-schema', 'Valeur ajoutée = dépenses finales', 'expenditure', 22,
    'En agrégeant les producteurs, les achats intermédiaires se compensent. Restent les <strong>dépenses finales nettes des importations</strong>.',
    '<p><strong>Lecture :</strong> les flèches vont des dépenses vers la production. L’agrégation élimine les achats intermédiaires entre unités résidentes ; les importations, intermédiaires ou finales, sont retirées avec M. L’identité exacte aux prix du marché est PIB = C + G + I + X − M. La différence entre cette identité et la valeur ajoutée aux prix de base tient aux impôts nets sur les produits, supposés nuls dans ce schéma simplifié.</p><p><strong>Conventions françaises :</strong> C regroupe la consommation finale des ménages et des ISBLSM. G est la consommation finale des administrations, et non toutes les dépenses publiques. I désigne la formation brute de capital de tous les secteurs : FBCF, variations de stocks et acquisitions nettes d’objets de valeur ; l’investissement public est donc dans I. Les transferts monétaires ne sont pas une production ni une dépense finale. X − M peut être négatif : le rectangle n’indique aucun signe ni aucune proportion. Le schéma suppose une représentation positive à seule fin de lecture.</p>');
})();
