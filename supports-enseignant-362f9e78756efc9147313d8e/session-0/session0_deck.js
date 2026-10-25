/* Adaptation du contenu de la session 0 au moteur de navigation du chapitre 1. */
window.COURSE = {title: '0. Introduction à la macroéconomie', chapter: 'Introduction', author: 'Arnaud Dyèvre'};
window.SLIDES = INTRO_SLIDES.map(s => ({
  id: s.id, title: s.title, part: s.part, source: s.source || '', appendix: s.appendix, prov:s.prov,
  layout: s.kind === 'cover' ? 'cover' : s.kind === 'divider' ? 'section' : undefined,
  cls: [s.kind || '', s.exercise ? 'exercise' : ''].filter(Boolean).join(' '),
  html: s.kind === 'cover' ? `<div class="slide-body">${s.html}</div>` : s.html
}));

/* TEACHER_ONLY_START */
const escapeNote = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
window.NOTES = Object.fromEntries(INTRO_SLIDES.map(s => [s.id,
  `<p>${escapeNote(s.notes)}</p><p class="xsmall">${s.sourcePages.length
    ? `Support de master, page${s.sourcePages.length > 1 ? 's' : ''} ${s.sourcePages.join(', ')}. Voir la correspondance des sources dans le dossier de préparation.`
    : 'Diapositive créée pour la version L3 2026.'}</p>`
]));
/* TEACHER_ONLY_END */
