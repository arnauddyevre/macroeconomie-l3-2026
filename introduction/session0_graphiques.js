
(function () {
  'use strict';
  function render(el, ctx = {}) {
    const rows = window.INTRO_OAT.observations;
    const date = value => new Date(value.length === 7 ? value + '-01T00:00:00Z' : value + 'T00:00:00Z');
    const data = rows.map(r => [date(r[0]).getTime(), r[1]]);
    const first = data[0][0], last = data[data.length - 1][0];
    const ticks = [];
    for (let y = date(rows[0][0]).getUTCFullYear(); y <= date(rows.at(-1)[0]).getUTCFullYear(); y++) {
      const t = Date.UTC(y, 0, 1); if (t >= first && t <= last) ticks.push(t);
    }
    const month = value => new Date(value).toLocaleDateString('fr-FR', {month:'long', year:'numeric', timeZone:'UTC'});
    const box = window.PJ.zoom(el.querySelector('#oat10-chart'), 1.2);
    const animate = !(ctx.reading || ctx.print || document.body.classList.contains('reading') || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const chart = window.Charts.line(box, {
      height: box.clientHeight, animate, duration: 2, ends: true, legend: false, hover: true,
      aria: 'Rendement des obligations de l’État français à dix ans, moyennes mensuelles de janvier 2020 à septembre 2026, en pourcentage.',
      x: {min:first, max:last, ticks, format:t=>new Date(t).getUTCFullYear(), hoverFormat:month},
      y: {min:-1, max:5, ticks:[-1,0,1,2,3,4,5]}, yTitle:'Rendement à 10 ans (%)',
      margin:{l:70,r:105,t:66,b:50},
      series:[{name:'France, 10 ans',color:'blue',data,gaps:45*86400000,format:v=>window.Charts.fmt(v,2)+' %'}]
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
