/* Format commun des définitions — référence : « Trois grandeurs à savoir calculer ».
 * Retouche de présentation : label « Définition » commun, contenus et étapes conservés. */
(function () {
  'use strict';
  const targets = {
    'pib-mots': [['.pj-word', '.w', 'p']],
    'pib-def': [['.bp-definition', 'h2', 'p']],
    'pib-depenses': [['.bp-spending-box', 'h2', 'p']],
    'master-ipc-formule': [['.pj-fbox', null, '.pj-f']],
    'master-ipc-poids': [['.master-chain-note', 'h2', 'p']],
    'master-rnb': [['.fr-formula', ':scope > strong', '.fr-rnb-term'], ['.fr-rnb-top > .fr-bullets', 'li > strong', 'li']],
    'retenir-definitions': [['.rev-retenir-item', '.rev-retenir-term', 'p']],
    'formules-1': [['.pj-fm', '.t', '.e']]
  };
  const listDefinitions = {
    'ppa-change': ['.master-list', [0, 1]],
    'master-inflation-mesures': ['.master-list', [0, 1]],
    'decouplage-emergents': ['.fin-climat-copy > ul', [1, 2]]
  };
  const changed = [], labelsAdded = [];
  for (const slide of window.SLIDES) {
    if (!slide.html.includes('class="def ') && !slide.html.includes('class="def"') && !targets[slide.id] && !listDefinitions[slide.id]) continue;
    const template = document.createElement('template');
    template.innerHTML = slide.html;
    const root = template.content;
    root.querySelectorAll('.def').forEach(box => box.classList.add('definition-bubble'));
    for (const [selector, title, text] of targets[slide.id] || []) {
      root.querySelectorAll(selector).forEach(box => {
        box.classList.add('definition-bubble');
        if (title) box.querySelectorAll(title).forEach(node => node.classList.add('definition-title'));
        if (text) box.querySelectorAll(text).forEach(node => node.classList.add('definition-text'));
      });
    }
    const listSpec = listDefinitions[slide.id];
    if (listSpec) {
      const list = root.querySelector(listSpec[0]);
      if (!list) throw new Error('Liste de définitions absente : ' + slide.id);
      list.classList.add('definition-list');
      listSpec[1].forEach(index => {
        const item = list.children[index];
        item.classList.add('definition-bubble', 'definition-text');
        const title = item.querySelector(':scope > strong, :scope > b');
        if (title) title.classList.add('definition-title');
      });
    }
    root.querySelectorAll('.definition-bubble:not(.master-chain-note)').forEach(box => {
      let label = box.querySelector(':scope > .def-label');
      if (!label) {
        // La bulle PIB/RNB est une liste : conserver un enfant HTML valide.
        label = document.createElement(box.matches('ul,ol') ? 'li' : 'div');
        label.className = 'def-label';
        if (box.matches('ul,ol')) label.setAttribute('role', 'presentation');
        box.prepend(label);
        box.classList.add('definition-label-added');
        labelsAdded.push(slide.id);
      }
      label.textContent = 'Définition';
    });
    slide.html = template.innerHTML;
    changed.push(slide.id);
  }
  window.DEFINITION_STYLE = {reference: 'identite-defs', labelReference: 'nominal-reel', slides: changed, labelsAdded};
})();
