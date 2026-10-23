
window.COURSE = {title: '0. Introduction à la macroéconomie', chapter: 'Introduction', author: 'Arnaud Dyèvre'};
window.SLIDES = INTRO_SLIDES.map(s => ({
  id: s.id, title: s.title, part: s.part, source: s.source || '', appendix: s.appendix,
  layout: s.kind === 'cover' ? 'cover' : s.kind === 'divider' ? 'section' : undefined,
  cls: [s.kind || '', s.exercise ? 'exercise' : ''].filter(Boolean).join(' '),
  html: s.kind === 'cover' ? `<div class="slide-body">${s.html}</div>` : s.html
}));


