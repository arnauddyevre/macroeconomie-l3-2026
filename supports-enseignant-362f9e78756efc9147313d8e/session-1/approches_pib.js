/* Trois approches du PIB — adaptation demandée par Arnaud le 23 octobre 2026.
 * Master, pages physiques 10, 13–15, 20–26 et 33 ; filière du pain d’Antonin.
 * Chargé après les apports du master, avant l’ordre final et le marquage des exercices. */
(() => {
  'use strict';
  const part = 'Partie 1 · Que mesure-t-on ?';
  const byId = id => window.SLIDES.find(s => s.id === id);
  const photo = () => C.photo('boulangerie', {h:600, pos:'center 40%'});
  const example = (chain, result, detail) => `<div class="bp-bread"><div class="bp-photo">${photo()}</div><div class="bp-example"><div class="bp-chain">${chain}</div><div class="bp-result">${result}</div><p class="bp-detail">${detail}</p></div></div>`;
  const actor = (name, country, product, price, rows) => `<div class="bp-actor"><h2>${name}</h2><p class="bp-country">${country}</p><p class="bp-product">${product}</p><div class="bp-price">${price} €</div><div class="bp-actor-lines">${rows.map(x=>`<p>${x}</p>`).join('')}</div></div>`;
  const flaggedCountry = country => {
    const colors = country === 'Italie' ? ['#009246', '#fff', '#CE2B37'] : ['#000091', '#fff', '#E1000F'];
    return `<svg class="bp-country-flag" viewBox="0 0 3 2" aria-hidden="true" focusable="false">${colors.map((color, x) => `<rect x="${x}" y="0" width="1" height="2" fill="${color}"/>`).join('')}</svg>${country}`;
  };
  const add = (id, title, html, source, notes) => {
    window.SLIDES.push({id,title,part,cls:'bp-slide',html,source,exercise:false});
    window.NOTES[id] = notes;
  };
  const assumptions = 'Exemple fictif par fournée, sans autres intrants, impôts, subventions ni stocks.';
  const definition = byId('pib-def');
  definition.title = 'Le PIB : trois définitions équivalentes';
  definition.cls = 'bp-slide';
  definition.html = `<div class="bp-definitions">
    <p class="bp-definition-intro">Le PIB mesure la production des <strong>unités résidentes</strong> d’un territoire, <strong>sur une période</strong>.</p>
    <div class="bp-definition"><h2>1. Production</h2><div><p>La valeur de la production, diminuée des biens et services consommés pour produire.</p><p class="bp-definition-formula">PIB = somme des valeurs ajoutées <span class="bp-precision">(aux prix de base)</span><br>+ impôts sur les produits − subventions sur les produits</p></div></div>
    <div class="bp-definition"><h2>2. Revenus</h2><div><p>La somme des revenus engendrés par la production intérieure.</p><p class="bp-definition-formula">PIB = rémunération des salariés + excédent brut d’exploitation + revenu mixte<br>+ impôts sur la production et les importations − subventions</p></div></div>
    <div class="bp-definition"><h2>3. Dépenses</h2><div><p>La somme des emplois finals, corrigée de la production étrangère qu’ils contiennent.</p><p class="bp-definition-formula">PIB = consommation + investissement + exportations − importations</p></div></div>
  </div>`;
  definition.source = '';
  window.NOTES['pib-def'] = `<p>23 octobre 2026 : les trois définitions du master sont réunies avant l’exemple du pain, en remplacement de l’ancienne définition isolée. La production non marchande est incluse ; elle est généralement valorisée par ses coûts.</p><p><strong>Production :</strong> VA = production − consommations intermédiaires. Les VA sont aux prix de base ; les impôts nets sur les produits conduisent au PIB aux prix du marché.</p><p><strong>Revenus :</strong> rémunération des salariés (salaires et cotisations employeurs), EBE, revenu mixte des indépendants, impôts moins subventions sur la production et les importations. L’EBE est brut : la consommation de capital fixe n’est pas retranchée. « Net transfers » dans le master est corrigé : les transferts sociaux n’entrent pas dans cette identité. Les intérêts, dividendes et loyers de terrains ne s’ajoutent pas une seconde fois à l’EBE. Une location de machines ou de bâtiments est un service produit, et souvent une consommation intermédiaire pour l’entreprise locataire.</p><p><strong>Dépenses :</strong> C + G + I + X − M. C inclut les ménages et les ISBLSM ; G est la consommation finale publique ; I regroupe tous les secteurs (publics compris), la FBCF, les variations de stocks et les acquisitions nettes d’objets de valeur. Exportations et importations incluent les biens intermédiaires. On ne retranche pas deux fois des importations déjà exclues d’une définition de dépenses « domestiques ».</p>`;

  const pain = byId('pain');
  pain.title = 'Définition 1 : la valeur ajoutée';
  pain.cls = 'bp-slide';
  pain.exercise = false;
  pain.html = example(
    actor('Agriculteur','France','Vente de blé',40,['Intrants : 0 €','<strong>VA = 40 − 0 = 40 €</strong>'])+
    actor('Meunier','France','Vente de farine',70,['Achats de blé : 40 €','<strong>VA = 70 − 40 = 30 €</strong>'])+
    actor('Boulanger','France','Vente de pain',100,['Achats de farine : 70 €','<strong>VA = 100 − 70 = 30 €</strong>']),
    'PIB = 40 + 30 + 30 = <strong>100 €</strong>',
    'Production totale : 210 € ; consommations intermédiaires : 110 €.<br>On compte ce que chaque producteur ajoute : <strong>210 − 110 = 100 €</strong>.');
  pain.source = assumptions;
  window.NOTES['pain'] = '<p>23 octobre 2026 : fusion de pain et pain-va en une seule slide de cours, sans QCM, sans fond orange ni label Exercice. Même photo de boulangerie et mêmes montants qu’Antonin. Tout le calcul est visible. Une chaîne entièrement résidente produit pour 210 € et utilise 110 € de consommations intermédiaires ; la valeur ajoutée totale est de 100 €, égale au pain acheté par les ménages. Les montants 1/2/10 du master ne sont pas substitués à ceux d’Antonin.</p>';

  add('pain-revenus','Définition 2 : les revenus',example(
    actor('Agriculteur','Locataire','Revenu total',30,['Travail : <strong>30 €</strong>','Loyer versé au meunier : <strong>10 €</strong>'])+
    actor('Meunier','Propriétaire','Revenu total',50,['Travail : <strong>20 €</strong>','Loyers reçus : <strong>20 €</strong>','Loyer imputé : <strong>10 €</strong>'])+
    actor('Boulanger','Locataire','Revenu total',20,['Travail : <strong>20 €</strong>','Loyer versé au meunier : <strong>10 €</strong>']),
    'PIB = 70 € + 30 € = <strong>100 €</strong>',
    '<strong>70 €</strong> de revenus du travail + <strong>30 €</strong> de revenus du capital.<br>Le meunier possède les trois locaux. Le loyer imputé valorise l’usage de son propre local.'),
    'Exemple fictif, sans impôts ni subventions. Loyer imputé : sans versement, déjà compris dans le revenu du capital.',
    '<p>23 octobre 2026 : titres demandés par Arnaud, « Définition 1 : la valeur ajoutée » et « Définition 2 : les revenus ». Nouvelle hypothèse confirmée : le meunier possède les locaux des trois activités. Il reçoit 10 € de l’agriculteur et 10 € du boulanger ; 10 € sont attribués à l’usage de son propre local. Les rémunérations du travail restent 30/20/20. Le revenu du capital est désormais entièrement attribué au meunier : 20 € encaissés et 10 € pour l’usage propre, soit 30 €. Les revenus totaux des trois acteurs sont 30/50/20 ; travail 70 + capital 30 = PIB 100.</p><p>Le « loyer imputé » est ici une décomposition pédagogique du surplus de la meunerie, sans paiement à soi-même, ni service locatif supplémentaire ajouté aux comptes. Ne pas l’assimiler à l’imputation officielle des services de logement des propriétaires occupants. Pour des indépendants, la séparation travail/capital est conventionnelle et leur revenu mixte ne doit pas être rebaptisé salaire ; une représentation en sociétés rémunérant leurs dirigeants donnerait 70 € de rémunération des salariés et 30 € d’EBE. Les 30 € sont bruts : aucune consommation de capital fixe n’est retranchée.</p><p>La slide précédente décrit la chaîne sans location. Avec les deux services de location introduits ici, les VA par activité changent : agriculteur 40 − 10 = 30 ; meunier 70 + 20 − 40 = 50 (meunerie et locations réunies) ; boulanger 100 − 70 − 10 = 20. Production totale 230, consommations intermédiaires 130, VA totale 100. Les loyers versés ne sont pas à ajouter aux revenus des locataires ; ils sont déjà attribués au propriétaire. Les 10 € d’usage propre restent dans les 30 € de surplus de la meunerie avant rémunération du travail. Il s’agit de locaux, non de terrains : les services de location de bâtiments sont des consommations intermédiaires, contrairement à la rente foncière, revenu de propriété.</p><p>Références comptables : <a href="https://ec.europa.eu/eurostat/documents/3859598/5925693/KS-02-13-269-EN.PDF.pdf/44cd9d01-bc64-40e5-bd40-d17df0c69334?t=1414781932000">SEC 2010, § 3.14, 3.80, 3.89–3.90</a> ; <a href="https://www.insee.fr/fr/metadonnees/definition/c2270">Insee, loyers D45</a>. La chaîne 40/70/100 et la photo proviennent du support d’Antonin ; la répartition locative répond à la demande d’Arnaud. Elle remplace l’hypothèse précédente d’EBE 10/10/10 sans location.</p>');

  add('pain-depenses','Définition 3 : les dépenses et les échanges',example(
    actor('Agriculteur',flaggedCountry('France'),'Blé exporté en Italie',40,['Exportations : <strong>X = 40 €</strong>','<strong>VA française : 40 €</strong>'])+
    actor('Meunier',flaggedCountry('Italie'),'Farine vendue en France',70,['Achats de blé : 40 €','<strong>VA italienne : 30 €</strong>'])+
    actor('Boulanger',flaggedCountry('France'),'Pain acheté en France',100,['Farine importée : <strong>M = 70 €</strong>','<strong>VA française : 30 €</strong>']),
    'PIB français = 100 + 40 − 70 = <strong>70 €</strong>',
    '<strong>C = 100 €</strong> de pain + <strong>X = 40 €</strong> de blé − <strong>M = 70 €</strong> de farine.<br>France : 40 + 30 = 70 € ; Italie : 70 − 40 = 30 €.'),
    `${assumptions} Meunerie en Italie ; pain consommé en France.`,
    '<p>Variante ouverte du même exemple, conforme au raisonnement de la page 21 du master, mais avec les montants d’Antonin. Blé français exporté pour 40 € ; meunier résident italien produisant 70 € de farine avec ce blé ; farine importée par la boulangerie française ; pain final consommé en France pour 100 €. France : VA 40 + 30 = 70, dépenses C 100 + X 40 − M 70 = 70, G=I=0. Italie : VA 70−40=30, dépenses X 70−M 40=30. Ensemble : 100 €. X inclut ici un bien intermédiaire ; M en retranche aussi un. Les importations sont une correction de l’origine de la production, pas un jugement sur les effets économiques du commerce. Le schéma ne postule ni consommations intermédiaires supplémentaires ni taxes ni stocks.</p>');

  add('pib-depenses','Le PIB par les dépenses',`<div class="bp-expenditure">
    <div class="bp-spending-col"><div class="bp-eq-term"><span class="bp-eq-prefix"><var>Y</var> =</span><var>C</var></div><div class="bp-spending-box"><h2>Consommation</h2><p>Ménages.</p><p><b>Durables :</b> voiture, mobilier, électroménager.</p><p><b>Non durables :</b> alimentation, vêtements.</p><p><b>Services :</b> transport, santé, logement.</p><p class="bp-small-note">Logement neuf → I ; service de logement → C.</p></div></div>
    <div class="bp-spending-col"><div class="bp-eq-term"><span class="bp-eq-op">+</span><var>G</var></div><div class="bp-spending-box"><h2>Administrations</h2><p>Consommation finale publique.</p><p>École, justice, défense : une production souvent évaluée par ses coûts.</p><p><b>Allocations et pensions :</b> transferts de revenu, hors G.</p><p class="bp-small-note">L’investissement public est déjà dans I.</p></div></div>
    <div class="bp-spending-col"><div class="bp-eq-term"><span class="bp-eq-op">+</span><var>I</var></div><div class="bp-spending-box"><h2>Investissement</h2><p><b>Capital fixe :</b> bâtiments, machines, logiciels, R&amp;D.</p><p><b>Variations de stocks :</b> stockage moins déstockage.</p><p><b>Logements neufs.</b></p><p>Tous les secteurs, publics et privés.</p><p class="bp-small-note">Actions et logements anciens : transfert d’un actif existant.</p></div></div>
    <div class="bp-spending-col"><div class="bp-eq-term bp-eq-trade"><span class="bp-eq-op">+</span><var>X</var><span>−</span><var>M</var></div><div class="bp-trade-boxes"><div class="bp-spending-box"><h2>X</h2><p><b>Exportations</b></p><p>Biens et services vendus aux non-résidents.</p></div><div class="bp-spending-box"><h2>M</h2><p><b>Importations</b></p><p>Biens et services achetés aux non-résidents.</p></div></div><div class="bp-spending-box bp-net-exports"><h2>X − M</h2><p><b>Exportations nettes</b></p><p>Ajouter la production vendue à l’étranger et retirer la production étrangère comprise dans les dépenses.</p></div></div>
  </div>`,
  `Convention française : G = consommation publique ; I = investissement de tous les secteurs, variations de stocks et objets de valeur compris.`,
  '<p>23 octobre 2026 : fusion des contenus de master-consommation, master-investissement et master-administrations dans une seule slide, dans l’ordre demandé Y=C+G+I+X−M. Six encadrés : C, G, I, X, M et X−M. La convention du master (I privé et G incluant investissement public) est adaptée à celle des comptes français déjà retenue. C inclut les ISBLSM (institutions sans but lucratif au service des ménages). I inclut la FBCF, les variations de stocks et les acquisitions nettes d’objets de valeur. Les dépenses en logement neuf sont de l’investissement, les services de logement de la consommation. Les opérations sur actifs existants ne créent pas la même valeur de production ; les frais de transaction et d’intermédiation peuvent cependant constituer une production. Les échanges comprennent les biens intermédiaires. G ne comprend pas les prestations monétaires et pensions.</p>');

  const fusions = {'pain':['pain-va'],'pib-def':['master-revenus'],'pib-depenses':['master-consommation','master-investissement','master-administrations']};
  ['pain','pain-revenus','pain-depenses'].forEach(id=>window.Deck.on(id,{enter(el,ctx={}) {
    const chain = el.querySelector('.bp-bread');
    chain.classList.remove('bp-animated');
    if(!ctx.print && !ctx.reading && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void chain.offsetWidth;
      chain.classList.add('bp-animated');
    }
  }}));
  const retired = new Set(Object.values(fusions).flat());
  window.SLIDES = window.SLIDES.filter(s=>!retired.has(s.id));
  retired.forEach(id=>delete window.NOTES[id]);
  if(window.MASTER_INTEGRATION) window.MASTER_INTEGRATION.mainAdded = window.MASTER_INTEGRATION.mainAdded.filter(id=>!retired.has(id));
  window.APPROCHES_PIB = {date:'2026-10-23',fusions,ordre:['pib-def','pain','pain-revenus','va-revenus-schema','pain-depenses','va-depenses-schema','pib-depenses','trois-approches','master-composantes-france']};
})();
