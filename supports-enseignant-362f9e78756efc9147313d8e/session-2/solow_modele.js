/* Modèle continu du chapitre 2, 3 novembre 2026.
 * A est la PGF multiplicative. E=A^(1/(1-alpha)). Aucune récurrence annuelle.
 * Module sans DOM : les échantillons sont seulement des points de dessin. */
(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.SolowContinu = model;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const BASE = Object.freeze({alpha: 1 / 3, s: .24, delta: .04, n: .005, gamma: .01});
  const effectiveGrowth = p => p.gamma / (1 - p.alpha);
  const maintenance = p => p.delta + p.n + effectiveGrowth(p);
  function validate(p) {
    if (!(p.alpha > 0 && p.alpha < 1 && p.s > 0 && p.s < 1 && maintenance(p) > 0))
      throw new RangeError('Paramètres hors du modèle de Solow étudié.');
  }
  function steady(p = BASE) {
    validate(p);
    const b = maintenance(p), k = (p.s / b) ** (1 / (1 - p.alpha));
    const y = k ** p.alpha, r = p.alpha * y / k;
    return {b, k, y, ky: k / y, gPerCapita: effectiveGrowth(p), gTotal: p.n + effectiveGrowth(p), r, rNet: r - p.delta};
  }
  function derivative(k, p = BASE) { return p.s * k ** p.alpha - maintenance(p) * k; }
  function normalised(kInitial, duration, p = BASE) {
    validate(p);
    if (!(kInitial > 0) || duration < 0) throw new RangeError('Capital initial positif et durée non négative requis.');
    const b = maintenance(p), uInitial = kInitial ** (1 - p.alpha);
    const u = p.s / b + (uInitial - p.s / b) * Math.exp(-(1 - p.alpha) * b * duration);
    return u ** (1 / (1 - p.alpha));
  }
  function segment(duration, p = BASE, initial = {}) {
    const k0 = initial.k ?? steady(p).k, E0 = initial.E ?? 1, L0 = initial.L ?? 1, share = initial.employmentShare ?? .5;
    const k = normalised(k0, duration, p), E = E0 * Math.exp(effectiveGrowth(p) * duration), L = L0 * Math.exp(p.n * duration);
    const K = k * E * L, Y = E * L * k ** p.alpha, N = L / share;
    const gPerCapita = effectiveGrowth(p) + p.alpha * derivative(k, p) / k;
    return {t: duration, k, E, L, N, A: E ** (1 - p.alpha), K, Y, I: p.s * Y, C: (1 - p.s) * Y,
      yPerCapita: Y / N, gPerCapita, gTotal: gPerCapita + p.n, r: p.alpha * Y / K, w: (1 - p.alpha) * Y / L};
  }
  function trajectory(t, scenario = {}) {
    const baseline = Object.assign({}, BASE, scenario.base || {});
    const shock = scenario.shock ?? 20;
    const initial = {k: scenario.kInitial ?? steady(baseline).k, E: scenario.EInitial ?? 1, L: 1, employmentShare: .5};
    if (t < shock || !scenario.change && !scenario.AFactor) return segment(t, baseline, initial);
    const before = segment(shock, baseline, initial), after = Object.assign({}, baseline, scenario.change || {}), q = scenario.AFactor ?? 1;
    const eMultiplier = q ** (1 / (1 - baseline.alpha));
    const start = {k: before.k / eMultiplier, E: before.E * eMultiplier, L: before.L, employmentShare: .5};
    const state = segment(t - shock, after, start);
    state.t = t;
    if (q !== 1 && Math.abs(t - shock) < 1e-10) { state.gPerCapita = null; state.gTotal = null; }
    return state;
  }
  function sample(scenario = {}, horizon = 100, step = 1) {
    const times = new Set();
    for (let t = 0; t <= horizon + 1e-9; t += step) times.add(Math.min(t, horizon));
    const shock = scenario.shock ?? 20;
    if ((scenario.change || scenario.AFactor && scenario.AFactor !== 1) && shock <= horizon) {
      // Limites de chaque segment continu : le changement n'est jamais étalé
      // sur une année par le seul échantillonnage du graphique.
      if (shock > 0) times.add(shock - 1e-7);
      times.add(shock);
      if (shock < horizon) times.add(shock + 1e-7);
    }
    return [...times].sort((a, b) => a - b).map(t => trajectory(t, scenario));
  }
  return Object.freeze({BASE, effectiveGrowth, maintenance, validate, steady, derivative, normalised, segment, trajectory, sample});
});
