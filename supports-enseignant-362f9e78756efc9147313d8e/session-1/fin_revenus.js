/* Fin du chapitre, partie 4 — décision d’Arnaud du 1er novembre 2026.
 * Les graphiques, leurs sources et leurs gestionnaires restent ceux du support.
 * Les deux diapositives PSID et le QCM rdb-q ne sont pas modifiés. */
(function () {
  'use strict';
  const slide=id=>window.SLIDES.find(s=>s.id===id);
  const edit=(id,title,html,note)=>{
    const s=slide(id);if(!s)throw new Error('Diapositive absente : '+id);
    s.title=title;s.html=html;s.cls=[s.cls,'fin-revenus'].filter(Boolean).join(' ');
    window.NOTES[id]=note;
  };
  const list=items=>`<ul class="fr-bullets">${items.map((text,i)=>`<li${i?` data-step="${i}"`:''}>${text}</li>`).join('')}</ul>`;
  const row=(copy,visual)=>`<div class="fr-layout"><div class="fr-copy">${copy}</div><div class="fr-visual">${visual}</div></div>`;
  edit('master-rnb','1. Production des résidents ou revenus des résidents ?',
    `<div class="fr-rnb-layout"><div class="fr-rnb-top">
      <ul class="fr-bullets">
        <li><strong>PIB : produit intérieur brut.</strong><br>Mesure la production des unités résidentes.</li>
        <li><strong>RNB : revenu national brut.</strong><br>Revenus primaires<sup>*</sup> des résidents, y compris ceux reçus de l’étranger.</li>
        <li data-step="1"><strong>Résidence ≠ nationalité</strong></li>
      </ul>
      <div class="fr-rnb-equation">
        <div class="fr-formula" aria-label="RNB égal PIB plus revenus primaires reçus de l’étranger moins revenus primaires versés à l’étranger">
          <strong>RNB = PIB</strong>
          <span class="fr-rnb-term"><b>+</b> revenus primaires<sup>*</sup> reçus de l’étranger</span>
          <span class="fr-rnb-term"><b>−</b> revenus primaires<sup>*</sup> versés à l’étranger</span>
        </div>
        <p class="fr-small fr-primary-note"><sup>*</sup> <strong>Primaire :</strong> lié à la participation à la production ou à la détention d’actifs, avant redistribution par les impôts sur le revenu et les prestations sociales.</p>
      </div>
    </div>
    <aside class="fr-rnb-bubble" data-step="2">
      <h3>Pourquoi le PIB par les revenus n’est-il pas le RNB ?</h3>
      <ul>
        <li><strong>PIB par les revenus :</strong> les revenus créés par la production des unités résidentes, même s’ils reviennent à des non-résidents.</li>
        <li><strong>RNB :</strong> les revenus primaires qui reviennent aux résidents, y compris ceux reçus de l’étranger.</li>
      </ul>
    </aside></div>`,
    window.NOTES['master-rnb']+'<p>1er novembre 2026 : titre et précisions demandés par Arnaud. PIB signifie produit intérieur brut, RNB revenu national brut. L’identité complète est visible dès l’entrée, avec les deux termes de revenus internationaux sur une ligne chacun. La note définit « primaire » avant la redistribution par les impôts sur le revenu et les prestations sociales. La résidence économique désigne le centre d’intérêt économique prédominant, pas la nationalité.</p><p>La bulle finale répond à la question d’Arnaud : l’approche du PIB par les revenus additionne la rémunération des salariés, l’excédent brut d’exploitation, le revenu mixte brut et les impôts sur la production et les importations nets de subventions, engendrés par la production des unités résidentes. Une partie de ces revenus peut revenir à des non-résidents. Le RNB ajoute les revenus primaires reçus du reste du monde et retranche ceux qui lui sont versés. Les intérêts et dividendes répartissent les revenus issus de la production et ne doivent pas être ajoutés une seconde fois à l’EBE. « Primaire » ne signifie pas avant toute fiscalité : les impôts liés à la production sont déjà pris en compte. Les transferts personnels ne sont pas des revenus primaires.</p><p>Définitions vérifiées auprès de l’Insee : PIB, c1365 ; revenu national brut et revenus primaires, c2271. Le rapprochement porte sur le périmètre des revenus, pas sur deux méthodes concurrentes pour calculer le PIB.</p>');
  slide('master-rnb').source='<a href="https://www.insee.fr/fr/metadonnees/definition/c1365" target="_blank" rel="noopener noreferrer">Insee, définition du PIB</a> · <a href="https://www.insee.fr/fr/metadonnees/definition/c2271" target="_blank" rel="noopener noreferrer">Revenu national brut</a>.';

  edit('pib-revenu','La production crée des revenus et finance des services',row(
    window.C.def('Revenu disponible brut (RDB)',
      'Revenu dont les ménages disposent pour consommer ou épargner, après impôts directs et cotisations sociales et après réception des prestations sociales en espèces.',
      {cls:'compact mb-m'})+
    `<ul class="fr-bullets">
      <li data-step="1"><strong>Services reçus en nature :</strong> santé, éducation… Leur valeur s’ajoute au revenu disponible pour former le RDB ajusté.</li>
      <li data-step="2"><strong>Pourquoi l’écart avec le RNB ?</strong> Des ressources restent aux sociétés, administrations et associations. S’y ajoutent les transferts courants nets à l’étranger.</li>
    </ul>`,
    `<div id="pj-rev" class="fr-revenue-chart"></div><p class="fr-small">Les barres orange expliquent l’écart de 629 Md€ avec le RNB.</p>`),
    '<p>1er novembre 2026 : explication du revenu disponible et des services en nature, avec les quatre agrégats du graphique conservés. Insee, comptes nationaux annuels base 2020, tableaux 1.114 et 7.401, comptes des ménages 2025, publication du 29 mai 2026. PIB 2 991 Md€, RDB des ménages 1 877 Md€ : environ 63 € pour 100 € de PIB, environ 81 € avec les transferts en nature (QCM précédent).</p><p>Le PIB, le RNB, le RDB et le RDB ajusté ne constituent pas les éléments d’une partition. Le passage d’un agrégat à l’autre dépend du secteur institutionnel et des opérations considérés : revenus primaires avec l’étranger, prélèvements, transferts monétaires et en nature. PIB et RDB sont bruts ; ne pas retrancher la consommation de capital fixe pour passer de l’un à l’autre. Le RDB sert à la consommation et à l’épargne ; le RDB ajusté inclut aussi les transferts sociaux en nature. Les services collectifs indivisibles ne sont pas tous des transferts sociaux en nature aux ménages.</p>');

  window.NOTES['pib-revenu'] += '<p>Décomposition ajoutée le 1er novembre 2026 à la demande d’Arnaud. Insee, TEE 2025 (9.500), onglet EA, B7g : sociétés non financières 309,242 Md€, sociétés financières 11,738, administrations publiques 253,813, ménages 2 413,480 et ISBLSM 3,176. Le tableau 1.114 donne RNB 3 042,365 et revenu national disponible brut 2 991,448 : les transferts courants nets vers l’étranger valent 50,917. Ainsi, l’écart RNB moins RDB ajusté des ménages vaut 628,885 Md€, expliqué par 320,980 pour les sociétés, 256,989 pour les administrations et ISBLSM, et 50,917 pour les transferts nets vers l’étranger. La somme des cellules arrondies diffère de 0,001 Md€ du solde national.</p><p>Les ressources conservées par les administrations sont mesurées après les transferts sociaux en nature attribués aux ménages. Elles couvrent notamment la consommation collective (252,490 Md€ pour les administrations), ainsi que leur épargne brute. Le revenu disponible des sociétés ne doit pas être assimilé exactement à leur épargne : un ajustement pour variation des droits à pension de 6,324 Md€ est versé par les sociétés financières aux ménages. Les associations du graphique désignent les institutions sans but lucratif au service des ménages (ISBLSM, S15), pas toutes les associations juridiques. Le tableau 7.401 confirme RDB des ménages 1 876,863 + transferts sociaux en nature 536,617 = RDB ajusté 2 413,480 Md€. La cascade décrit une identité comptable, sans trajectoire chronologique des flux ni relation causale.</p>';
  slide('pib-revenu').source='Insee, comptes nationaux 2025, base 2020 : <a href="https://www.insee.fr/fr/statistiques/8988797" target="_blank" rel="noopener noreferrer">1.114, agrégats nationaux</a> · <a href="https://www.insee.fr/fr/statistiques/8988835" target="_blank" rel="noopener noreferrer">7.401, ménages</a> · <a href="https://www.insee.fr/fr/statistiques/8988861" target="_blank" rel="noopener noreferrer">9.500, TEE</a>. Calculs de la décomposition.';

  const redistribution=slide('redistribution-elargie');
  edit('comptes-distribues','2. Le PIB revient-il aux riches ? Aux pauvres ?',row(list([
    '<strong>Comptes nationaux distribués :</strong> répondent à la question « Qui, dans la distribution des revenus, reçoit les revenus du PIB ? » <span class="fr-dina">(en anglais : DINA, <i>Distributional National Accounts</i>).</span>',
    '<strong>Répartir les ressources :</strong> ventiler les revenus et les transferts publics entre groupes de ménages.',
    '<strong>Des écarts plus faibles :</strong> le rapport des revenus moyens des dixièmes extrêmes passe de <b>26,3 à 3,5</b> après transferts publics.',
    '<strong>Une vision élargie :</strong> prélèvements, prestations monétaires et services publics sont pris en compte.'
  ]),`<div class="fr-distribution-figure" data-step="3">${redistribution.html}</div>`),
    '<p>1er novembre 2026 : fusion demandée par Arnaud de l’introduction aux comptes distribués et de redistribution-elargie. Quatre puces à gauche ; graphique Insee conservé à droite et révélé avec la dernière puce (étape 3). La diapositive indépendante de redistribution est retirée dans reorganisation.js. Les revenus du travail PSID des diapositives suivantes restent distincts de l’agrégat présenté ici.</p><p>« Qui reçoit les revenus du PIB ? » résume la question générale. Les DINA (Distributional National Accounts) de WID répartissent le revenu national net, soit le PIB diminué de la consommation de capital fixe et augmenté des revenus primaires nets reçus de l’étranger. Le graphique vient des comptes distribués de l’Insee : revenu primaire élargi net et niveau de vie élargi après transferts publics, en euros par unité de consommation. Ce périmètre dépasse le seul RDB ajusté des ménages ; il tient notamment compte des profits non distribués réattribués aux ménages et des services publics collectifs.</p><p>France, 2023, Insee Analyses 118, figure 1c, édition 2026. Les groupes sont des dixièmes de niveau de vie usuel et restent fixes avant/après transferts publics. 26,3 et 3,5 sont des rapports de revenus moyens des dixièmes extrêmes, pas des rapports de seuils D9/D1. Le graphique précède l’imputation du déficit public. Les données, leurs arrondis, les infobulles et la légende sont conservés.</p>');
  slide('comptes-distribues').cls+=' macro-dynamic-slide';
  slide('comptes-distribues').source=redistribution.source+' · <a href="https://wid.world/methodology/" target="_blank" rel="noopener noreferrer">WID, méthodologie DINA</a>.';

  const nature=slide('transferts-nature').html;
  edit('transferts-nature','Santé et éducation contribuent aux ressources des ménages',row(list([
    '<strong>Soigner et instruire :</strong> des services financés collectivement bénéficient directement aux ménages.',
    '<strong>Des ressources en nature :</strong> leur valeur complète les prestations monétaires dans les comptes distribués.'
  ]),nature),'<p>1er novembre 2026 : graphique conservé, deux puces à gauche après retrait, à la demande d’Arnaud, de « Le revenu monétaire ne dit pas tout ». Même source et mêmes groupes que comptes-distribues : France 2023, Insee Analyses 118, figure 1c. Les transferts non monétaires du graphique dépassent les seuls exemples santé et éducation. La valorisation comptable ne signifie ni que les ménages perçoivent ces montants en espèces, ni qu’elle mesure directement la qualité ou le bien-être procuré. Les retraites figurent parmi les prestations monétaires ; les prélèvements sont négatifs.</p>');
})();
