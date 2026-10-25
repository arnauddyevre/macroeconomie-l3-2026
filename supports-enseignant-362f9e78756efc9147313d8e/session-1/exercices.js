/* Questions réellement posées aux étudiants et corrections associées.
   Un titre interrogatif ou la case de relecture « À retirer » ne suffit pas.
   Pour un nouvel exercice, déclarer exercise: true dans sa définition. */
(() => {
  const questions = new Set([
    'q-1820', 'ralentissement', 'r70-q', 'pib-q', 'four',
    'patrimoine', 'notre-dame', 'ca-compte-1', 'ca-compte-2',
    'master-rnb-quiz', 'us-2022', 'labo-q', 'labo-scen', 'deux-biens',
    'courses', 'salaire-q', 'salaire-scen', 'p2-verif', 'fr-us-q',
    'par-habitant', 'ph-verif', 'decomp-q', 'keynes', 'long-terme-verif',
    'rdb-q', 'kaya-q', 'decouplage-verif', 'empreinte-verif', 'reponse', 'master-va-profit'
  ]);
  const corrections = new Set([
    'deux-siecles', 'regle-70', 'pib-combien', 'deux-biens-reel',
    'us-2022-reponse', 'fr-us', 'decomp', 'keynes-bilan', 'pib-revenu'
  ]);
  for (const s of window.SLIDES) {
    if (s.layout === 'cover' || s.layout === 'section-open') continue;
    if (!s.exercise && !questions.has(s.id) && !corrections.has(s.id)) continue;
    s.exercise = true;
    s.cls = [s.cls, 'exercise'].filter(Boolean).join(' ');
  }
})();
