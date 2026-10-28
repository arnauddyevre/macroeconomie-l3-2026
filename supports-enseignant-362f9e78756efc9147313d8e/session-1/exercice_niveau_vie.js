/* Cinq parties de l’exercice TeX, version relue et validée le 28 octobre 2026.
 * Charger après revision.js et les données, avant reorganisation.js.
 * Énoncés seuls sur les quatre premières diapositives, puis illustration empirique. */
(function () {
  'use strict';
  const data = window.EXERCICE_NIVEAU_VIE_DATA;
  if (!data) throw new Error('Données manquantes pour l’exercice sur le niveau de vie.');
  const C = window.C, fmt = (value, digits = 0) => window.Charts.fmt(value, digits);
  const v = name => `<var>${name}</var>`;
  const frac = (a, b) => C.frac(a, b);
  const dot = name => `<span class="nv-overdot">${v(name)}<span aria-hidden="true">˙</span></span>`;
  const g = name => `${v('g')}<sub>${name}</sub>`;
  const x = n => `${v('x')}<sub>${n}</sub>`;
  const ynom = `${v('y')}<sup>nom</sup>`, Ynom = `${v('Y')}<sup>nom</sup>`;
  const pibpc = frac(v('Y'), v('N'));
  const derivative = name => frac(dot(name) + '(t)', v(name) + '(t)');
  const dln = name => frac(`d ln ${name}`, `d${v('t')}`);
  const eq = html => `<div class="nv-equation"><span>${html}</span></div>`;
  const questions = items => `<ol class="nv-questions" type="a">${items.map(html => `<li>${html}</li>`).join('')}</ol>`;
  const part = 'Partie 3 · Par personne et par heure ?';
  const slide = (number, title, html, extra = {}) => ({
    id: `exercice-niveau-vie-${number}`, title: `${number}. ${title}`, part,
    exercise: number < 5, cls: `nv-slide nv-page-${number}`, source: '',
    html: `<div class="nv-content">${html}</div>`, ...extra
  });
  const years = data.years;
  const metrics = [
    {key: 'y', label: 'PIB réel par habitant', ratio: `${v('Y')}/${v('N')}`, unit: 'dollars internationaux par an', digits: 0, scale: 1},
    {key: 'p', label: 'Productivité horaire', ratio: `${v('Y')}/${v('H')}`, unit: 'dollars internationaux par heure', digits: 1, scale: 1},
    {key: 'h', label: 'Heures par personne en emploi', ratio: `${v('H')}/${v('L')}`, unit: 'heures par an', digits: 0, scale: 1},
    {key: 'e', label: 'Personnes en emploi par habitant', ratio: `${v('L')}/${v('N')}`, unit: '% de la population totale', digits: 1, scale: 100}
  ];
  const table = `<table class="nv-data-table"><thead>
    <tr><th rowspan="2" scope="col">Grandeur</th><th colspan="2" scope="colgroup">Niveaux en ${years.level}</th><th colspan="2" scope="colgroup">Croissance ${years.start}–${years.end}<span>% par an, moyenne logarithmique</span></th></tr>
    <tr><th scope="col">France</th><th scope="col">États-Unis</th><th scope="col">France</th><th scope="col">États-Unis</th></tr>
    </thead><tbody>${metrics.map(item => {
      const row = data.metrics.find(value => value.key === item.key);
      if (!row || !['levelFrance', 'levelUSA', 'growthFrance', 'growthUSA'].every(key => Number.isFinite(row[key]))) {
        throw new Error(`Données de niveau ou de croissance incomplètes : ${item.key}`);
      }
      return `<tr${item.key === 'y' ? ' class="nv-total"' : ''}><th scope="row"><span>${item.label} <span class="nv-table-ratio">${item.ratio}</span></span><small>${item.unit}</small></th><td>${fmt(item.scale * row.levelFrance, item.digits)}</td><td>${fmt(item.scale * row.levelUSA, item.digits)}</td><td>${fmt(row.growthFrance, 2)}</td><td>${fmt(row.growthUSA, 2)}</td></tr>`;
    }).join('')}</tbody></table>`;

  const slides = [
    slide(1, 'Rappels : variations, logarithmes et temps', `
      <p class="nv-context">${v('x')} &gt; 0. ${x('n')} en temps discret, ${v('x')}(t) dérivable en temps continu. Temps en années, taux en unités décimales.</p>
      <div class="nv-given-equations">${eq(`${v('r')}<sub>x,n</sub> = ${frac(x('n+1') + ' − ' + x('n'), x('n'))}`)}${eq(`${g('x')}(t) = ${derivative('x')} &emsp; avec &ensp; ${dot('x')}(t) = ${frac('d' + v('x') + '(t)', 'd' + v('t'))}`)}</div>
      <div class="nv-log-reminder"><strong>Rappel.</strong><span>${frac('d ln ' + v('f') + '(' + v('x') + ')', 'd' + v('x'))} = ${frac(v('f') + '′(' + v('x') + ')', v('f') + '(' + v('x') + ')')}</span><span>pour ${v('f')} dérivable et ${v('f')}(${v('x')}) &gt; 0.</span></div>
      ${questions([
        `<strong>Variation annuelle.</strong> Exprimer ${frac(x('n+1'), x('n'))} en fonction de ${v('r')}<sub>x,n</sub>. Montrer que ln ${x('n+1')} − ln ${x('n')} = ln(1 + ${v('r')}<sub>x,n</sub>). Quand cet écart est-il proche de la variation relative ?`,
        `<strong>Croissance instantanée.</strong> Dériver la fonction composée ln ${v('x')}(t) pour montrer que ${dln(v('x') + '(t)')} = ${g('x')}(t). Quelle différence entre ${dot('x')} et ${g('x')} ?`,
        `<strong>Deux trajectoires.</strong> Avec ${v('r')} &gt; −1 constant, partir de ${x('n+1')} = (1 + ${v('r')})${x('n')} pour retrouver ${x('n')}. Avec ${g('x')} = ${v('g')} constant, retrouver ln ${v('x')}(t), puis ${v('x')}(t).`,
        `<strong>Relier les deux taux.</strong> Les trajectoires partent de ${x('0')} et coïncident à chaque date annuelle. Comparer leurs niveaux après un an. Établir le lien exact entre ${v('g')} et ${v('r')}, puis une approximation pour les petits taux.`
      ])}`),
    slide(2, 'Décomposer le PIB réel par habitant', `
      <div class="nv-definitions"><span><b>${v('Y')}</b> : PIB réel</span><span><b>${v('N')}</b> : population totale</span><span><b>${v('H')}</b> : heures totales travaillées sur un an</span><span><b>${v('L')}</b> : personnes en emploi</span></div>
      <p class="nv-context">Ces grandeurs sont positives et dérivables. On pose ${v('y')} = ${pibpc}.</p>
      ${questions([
        `Prendre le logarithme de ${v('y')} = ${pibpc}, puis dériver par rapport au temps. Relier ${g('y')}, ${g('Y')} et ${g('N')}. Si le PIB réel et la population doublent ensemble, que devient ${v('y')} ?`,
        `Faire apparaître ${v('H')} et ${v('L')} pour écrire ${v('y')} comme le produit de trois rapports : <strong>productivité horaire</strong>, <strong>heures par personne en emploi</strong> et <strong>personnes en emploi par habitant</strong>. Interpréter chacun d’eux.`,
        `Prendre les logarithmes de ce produit, puis dériver. Obtenir une décomposition de la croissance du PIB réel par habitant en trois contributions.`
      ])}`),
    slide(3, 'Introduire les prix : du réel au nominal', `
      <p class="nv-context">${Ynom} est le PIB nominal. Le déflateur ${v('P')} = ${frac(Ynom, v('Y'))} vaut 1 à la date de référence. Ainsi, ${Ynom} = ${v('P')}${v('Y')} et ${ynom} = ${frac(Ynom, v('N'))}. Un indice en base 100 vaut 100${v('P')}.</p>
      ${questions([
        `Compléter la décomposition précédente : exprimer le PIB <strong>nominal</strong> par habitant comme le produit de l’indice de prix et des trois rapports réels.`,
        `On définit l’inflation instantanée du déflateur par ${v('π')}(t) = ${dln(v('P') + '(t)')}. L’exprimer avec ${v('P')} et ${dot('P')}. Pourquoi ${dot('P')} seul n’est-il pas un taux d’inflation ? Le taux change-t-il avec l’indice 100${v('P')} ?`,
        `Prendre les logarithmes, puis dériver la décomposition nominale. Relier ${g(ynom)} à ${v('π')} et aux trois contributions réelles. En déduire la relation entre ${g(Ynom)}, ${v('π')} et ${g('Y')}.`,
        `Si ${g('Y')} = ${g('N')} et ${v('π')} &gt; 0, le PIB nominal par habitant augmente-t-il ? Cela traduit-il une hausse de la production <strong>réelle</strong> par habitant ?`
      ])}`),
    slide(4, 'Dériver la règle des 70', `
      <p class="nv-lead">Le PIB <strong>réel</strong> par habitant croît à un taux instantané constant ${v('g')} &gt; 0.</p>
      <p class="nv-context">${v('T')} désigne le temps nécessaire pour passer de ${v('y')}(0) à 2${v('y')}(0).</p>
      ${questions([
        `En utilisant la trajectoire trouvée à la question 1, résoudre ${v('y')}(${v('T')}) = 2${v('y')}(0).`,
        `Poser ${g('%')} = 100${v('g')} et utiliser ln 2 ≈ 0,693 pour retrouver la règle des 70. Quelle étape est approximative ?`,
        `Si l’on connaît le taux annuel discret ${v('r')} &gt; 0, exprimer le temps de doublement de la trajectoire continue équivalente en fonction de ${v('r')}. Quelle approximation supplémentaire conduit à ${frac('70', v('r') + '<sub>%</sub>')}, avec ${v('r')}<sub>%</sub> = 100${v('r')} ?`
      ])}`),
    slide(5, 'Illustration : France–États-Unis', `
      <p class="nv-context">Quantités réelles. Montants en dollars internationaux de ${years.level}, à parité de pouvoir d’achat.</p>
      ${table}
      <p class="nv-data-note">Croissance annuelle moyenne = ${frac(`ln ${x(years.end)} − ln ${x(years.start)}`, String(years.end - years.start))} × 100. Les contributions s’additionnent avant arrondi.</p>
      <div class="nv-empirical-benchmarks"><p><strong>PIB par habitant : indice 100 en ${years.start} dans chaque pays</strong><br>En ${years.end} : France <b>${fmt(data.trajectory.FRA.indexEnd)}</b> · États-Unis <b>${fmt(data.trajectory.USA.indexEnd)}</b></p><p><strong>PIB par habitant français / américain</strong><br>${fmt(100 * data.ratios.start, 1)} % en ${years.start} → ${fmt(100 * data.ratios.end, 1)} % en ${years.end}</p></div>
      <p class="nv-data-note">Les niveaux et les rapports utilisent le même ancrage PPA de 2021. L’emploi est rapporté à toute la population. Sa croissance est une variation relative, pas une variation en points de pourcentage.</p>`,
      {prov: 'obs', source: 'Source : <a href="https://www.rug.nl/ggdc/productivity/pwt/">Penn World Table 11.0</a>. Calculs à partir de rgdpna, pop, emp et avh.'})
  ];

  const index = window.SLIDES.findIndex(item => item.id === 'exercice-rattrapage');
  if (index < 0) throw new Error('Emplacement de l’exercice introuvable.');
  window.SLIDES.splice(index, 1, ...slides);
  delete window.NOTES['exercice-rattrapage'];
  for (let number = 1; number <= 4; number++) delete window.NOTES[`correction-niveau-vie-${number}`];
  const provenance = '<p>28 octobre 2026 : exercice synchronisé avec le document TeX relu et validé par Arnaud. Les quatre premières diapositives reprennent ses quatorze sous-questions, sans correction. <a href="exercices/niveau_vie_exercice_etudiant.pdf">Feuille étudiante</a>. Les sept propriétés du logarithme et les autres rappels sont fournis dans la feuille. La dérivée du logarithme composé est aussi rappelée sur la première diapositive. Les interprétations détaillées de l’illustration restent dans la feuille.</p><p>Provenance mathématique : six propriétés tirées des photographies de l’appendice Jones–Vollrath, A.2, avec les rappels A.3.1–A.3.3. Septième propriété ajoutée à la demande d’Arnaud : dérivée du logarithme d’une fonction. <a href="sources/exercice_niveau_vie_2026-10-27/README.md">Sources et calculs</a>.</p>';
  slides.forEach(item => { window.NOTES[item.id] = provenance; });
  window.NOTES['exercice-niveau-vie-5'] += '<p>Source : Penn World Table 11.0. Feenstra, Inklaar et Timmer (2015), « The Next Generation of the Penn World Table », American Economic Review, 105(10), 3150–3182. Niveaux 2021 : rgdpna/pop, rgdpna/(emp×avh), avh et emp/pop. L’emploi concerne toute la population, pas les seuls 15–64 ans. Croissances : 100×ln(x2023/x2000)/23. 2021 est une année de sortie de pandémie. La décomposition est comptable et ne démontre pas une causalité.</p>';
})();
