
(function () {
  'use strict';
  function render(el, ctx = {}) {
    const rows = window.INTRO_OAT.observations;
    const date = value => new Date(value.length === 7 ? value + '-01T00:00:00Z' : value + 'T00:00:00Z');
    const data = rows.map(r => [date(r[0]).getTime(), r[1]]);
    const first = Date.UTC(2025,0,1), last = data.at(-1)[0];
    const ticks = [Date.UTC(2025,0,1),Date.UTC(2025,6,1),Date.UTC(2026,0,1),Date.UTC(2026,6,1),Date.UTC(2026,9,1)];
    const tickLabel = value => new Date(value).toLocaleDateString('fr-FR', {month:'short',year:'numeric',timeZone:'UTC'});
    const week = value => {
      const period = window.INTRO_OAT.weeks.find(w => date(w.date).getTime() === value);
      const format = d => date(d).toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
      return `Du ${format(period.firstDate)} au ${format(period.lastDate)} · ${period.count} observations`;
    };
    const box = window.PJ.zoom(el.querySelector('#oat10-chart'), 1.2);
    const animate = !(ctx.reading || ctx.print || document.body.classList.contains('reading') || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const chart = window.Charts.line(box, {
      height: box.clientHeight, animate, duration: 2, ends: true, legend: false, hover: true,
      aria: 'Rendement des OAT françaises à dix ans (TEC10), moyennes hebdomadaires de janvier 2025 au 23 octobre 2026, en pourcentage.',
      x: {min:first, max:last, ticks, format:tickLabel, hoverFormat:week},
      y: {min:2.5, max:5.5, ticks:[2.5,3,3.5,4,4.5,5], format:v=>window.Charts.fmt(v,Number.isInteger(v)?0:1)}, yTitle:'Rendement à 10 ans (%)',
      margin:{l:70,r:105,t:66,b:50},
      series:[{name:'TEC10 · moyenne hebdomadaire',color:'blue',data,gaps:10*86400000,format:v=>window.Charts.fmt(v,2)+' %'}]
    });
    // Dernier rendement en orange, comme les valeurs mises en avant dans le cours.
    chart.svg.querySelectorAll('.ch-lab').forEach(label => label.setAttribute('fill', '#B45309'));
    chart.svg.querySelectorAll('circle[r="6.5"]').forEach(dot => dot.setAttribute('fill', '#B45309'));
    el.querySelector('#oat10-chart').dataset.observations = rows.length;
  }
  window.Deck.on('politiques', {enter: render});
  // Le tracé complet doit être imprimé, même si l’impression commence pendant l’animation.
  window.addEventListener('beforeprint', () => {
    const el = document.getElementById('politiques');
    if (el) render(el, {print:true});
  });
})();
