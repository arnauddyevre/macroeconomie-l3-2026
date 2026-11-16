/* Fin de la section 3 : réponse à la question du chapitre, ajout local du 15 novembre 2026.
 * Module séparé de pgf.js. Chiffres : scripts/preparer_monde_fini.py.
 * Sources, conventions et limites : sources/monde_fini_2026-11-15/. */
(function(){
  'use strict';
  const G=window.G2;
  if(!G)throw new Error('Composants du chapitre 2 absents');
  const m=html=>`<span class="g-math">${html}</span>`;
  const link=(url,label)=>`<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
  const terme=(famille,symbole,nom)=>`<span class="mf-terme ${famille}"><span class="mf-symbole">${symbole}</span><span class="mf-nom">${nom}</span></span>`;
  G.add({
    id:'s3-monde-fini',part:G.titles[2],cls:'pgf-slide mf-slide',planPosition:'67 quinquies',
    title:'Alors, peut-on croître à l’infini dans un monde fini ?',
    html:`
      <p class="mf-intro">Introduisons les matières premières (${m('P')}) dans la fonction de production, pour répondre à cette question.</p>
      <div class="mf-formule" role="img" aria-label="Y égale A, fois K puissance alpha, fois P puissance bêta, fois h L puissance un moins alpha moins bêta. P désigne les matières premières.">
        ${terme('','Y','production')}
        <span class="mf-egal">=</span>
        ${terme('mf-savoir','A','PGF')}
        ${terme('mf-matiere','K<sup>α</sup>','capital')}
        ${terme('mf-matiere','P<sup>β</sup>','matières premières')}
        ${terme('','(<span class="mf-h">h</span>L)<sup>1−α−β</sup>','<span class="mf-h-nom">capital humain</span> et travail')}
      </div>
      <p class="mf-cle"><span class="mf-cle-matiere">${m('K')}, ${m('P')} : de la matière, des atomes</span><span class="mf-cle-savoir">${m('h')}, ${m('A')} : du savoir, des octets</span></p>
      <div class="mf-reponses">
        <div class="pgf-card" data-step="1">
          <h3><span class="mf-mot">Non</span>, si la croissance vient de la matière</h3>
          <p>Plus de machines&nbsp;(${m('K')}), plus de matières premières&nbsp;(${m('P')}).</p>
          <p class="mf-fait">Monde, 2000–2022 : de 9,0 à 13,8 tonnes de matières premières par habitant.</p>
        </div>
        <div class="pgf-card pgf-card-accent" data-step="2">
          <h3><span class="mf-mot">Oui</span>, si elle vient du savoir</h3>
          <p>Des travailleurs mieux formés&nbsp;(${m('h')}), de meilleures recettes&nbsp;(${m('A')}).</p>
          <p class="mf-fait">France, 1950–2023 : deux tiers de la croissance de la production par travailleur viennent de ${m('h')} et de ${m('A')}.</p>
        </div>
      </div>
      <p class="mf-aphorisme" data-step="3">La croissance par la PGF mobilise plus d’<strong class="mf-octets">octets</strong>, pas nécessairement plus d’<strong class="mf-atomes">atomes</strong>.</p>`,
    source:`Matières premières : Programme des Nations unies pour l’environnement, via ${link('https://ourworldindata.org/grapher/material-footprint-per-capita','Our World in Data')}, indicateur 12.2.1 des objectifs de développement durable. Croissance : calculs d’après ${link('https://www.rug.nl/ggdc/productivity/pwt/','Penn World Table 11.0')}, α = 1/3.`,
    notes:`<p>Écran ajouté le 15 novembre 2026 à la demande d’Arnaud, à la fin de la section 3, après « La croissance se mesure en valeur, pas en tonnes ». Il précédera le séparateur de la section IA lorsqu’elle existera ; aujourd’hui la séparation « Conclusion » le suit. Les deux réponses, la lettre P et l’aphorisme sur les octets et les atomes sont ses choix. Déroulé : fonction annotée et clé de lecture à l’entrée ; « non » au premier clic ; « oui » au deuxième ; aphorisme au troisième. Lecture et impression : état complet. Sources, calculs et limites : sources/monde_fini_2026-11-15/README.md.</p>
      <p><b>La lettre P.</b> Arnaud retient P pour les matières premières. M est écarté : il désigne les importations au chapitre 1 (X − M). P regroupe ce qui est tiré de la nature : biomasse, combustibles fossiles, minerais métalliques, minéraux non métalliques. Ce ne sont pas tous les matériaux achetés à d’autres entreprises, qui s’annulent dans la valeur ajoutée. β est l’élasticité de la production aux matières premières. La fonction est une aide de lecture : elle n’est pas résolue, et les huit équations de Solow ne changent pas. Arnaud n’a pas dit si elle est exigible.</p>
      <p><b>Ce que la fonction permet de dire.</b> Sur un sentier équilibré, K/Y est constant et g = [γ + β(g<sub>P</sub> − n) + (1 − α − β)g<sub>h</sub>] / (1 − α), où g est la croissance de la production par travailleur. À matières premières constantes, avec n = 0 et h constant, on retrouve la formule du cours, g = γ/(1 − α) : toute la croissance vient de A. Si P doit baisser au rythme m, la croissance reste positive tant que γ dépasse βm. Si la population croît à P donné, la croissance par travailleur perd βn/(1 − α). Démonstration dans le dossier de sources.</p>
      <p><b>Deux « non » à distinguer.</b> Le premier est celui de Solow : les rendements du capital sont décroissants, l’accumulation seule s’épuise, même dans un monde infini. Le second est la finitude physique, absente du modèle du cours. Ordre de grandeur pour Boulding : à 2 % par an, un flux physique est multiplié par 7,2 en un siècle et par 400 millions en mille ans.</p>
      <p><b>Un « oui » sous condition.</b> « Pas nécessairement » compte : le chiffre mondial montre que la matière utilisée par habitant augmente encore. La PGF de la section 2 est un résidu calculé sans P, que la Penn World Table ne mesure pas ; elle contient donc aussi l’effet des matières premières utilisées en plus. Le « oui » porte sur A à matières premières données. Des gains d’efficacité peuvent être compensés par les volumes.</p>
      <p><b>Capital humain.</b> Insister sur la qualité : les années d’études ont un plafond, la qualité des apprentissages n’en a pas d’évident. L’indice h de la Penn World Table repose sur les années d’études et leur rendement ; les gains de qualité tombent donc dans A. Autre limite : h est attaché à une personne et se reconstruit à chaque génération, alors que A est non rival et se cumule. La croissance sans borne repose sur A ; chez Jones, elle dépend de la croissance du nombre de chercheurs.</p>
      <p><b>Chiffres.</b> Monde : empreinte matérielle par habitant, indicateur 12.2.1 des objectifs de développement durable, 8,99 tonnes en 2000 et 13,76 tonnes en 2022, soit +53,1 %. L’empreinte attribue les matières premières au pays de la demande finale ; à l’échelle du monde, elle égale l’extraction. Estimations du Programme des Nations unies pour l’environnement. France : Y = AK<sup>α</sup>(hL)<sup>1−α</sup>, α = 1/3, variables rgdpna, rnna, emp et hc. De 1950 à 2023, la production par personne en emploi est multipliée par 5,37, soit 2,30 % par an : capital 32,9 %, capital humain 16,5 %, PGF 50,6 %, donc 67,1 % pour h et A. États-Unis : 72,0 %. Corée du Sud, 1953–2023 : 66,8 %. C’est une décomposition comptable, pas une attribution causale : une partie de l’accumulation du capital répond elle-même à la hausse de A, et les parts dépendent de α.</p>
      <p><b>Octets et atomes.</b> Les octets ne sont pas immatériels : centres de données, réseaux et terminaux consomment de l’énergie et des métaux. Transition possible vers la section IA.</p>`
  });
})();
