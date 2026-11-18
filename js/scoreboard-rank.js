(function (root) {
  const ROUNDS = 7; // default; a table can have its own number of rounds in state.rounds
  const MAX_ROUNDS = 15;
  const roundsOf = (state) => Math.min(MAX_ROUNDS, Math.max(1, Math.round(Number(state && state.rounds)) || ROUNDS));

  function computeRows(state) {
    const R = roundsOf(state);
    const teams = (state && state.teams) || [];
    const scores = (state && state.scores) || {};
    const roundsWithData = [];
    for (let r = 0; r <= R; r++) { // round 0 = optional warm-up round
      if (scores[r] && Object.keys(scores[r]).length) roundsWithData.push(r);
    }

    const rows = teams.map((t) => {
      const per = {};
      let total = 0;
      for (let r = 0; r <= R; r++) {
        const raw = scores[r] && scores[r][t.id];
        const v = raw === undefined || raw === null || raw === '' ? undefined : Number(raw);
        per[r] = v === undefined || !Number.isFinite(v) ? null : v;
        total += per[r] || 0;
      }
      const sum3 = (per[0] || 0) + (per[1] || 0) + (per[2] || 0) + (per[3] || 0);
      const sum6 = sum3 + (per[4] || 0) + (per[5] || 0) + (per[6] || 0);
      const cum = {}; // running total after each round
      let acc = 0;
      for (let r = 0; r <= R; r++) { acc += per[r] || 0; cum[r] = acc; }
      return { id: t.id, team: t.name, per, sum3, sum6, cum, total };
    });

    // tie on total: higher score in the latest round wins, then the one before it, ...
    rows.sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      for (let r = R; r >= 0; r--) {
        const d = (b.per[r] || 0) - (a.per[r] || 0);
        if (d) return d;
      }
      return a.team.localeCompare(b.team, 'ru');
    });
    rows.forEach((row, i) => { row.place = i + 1; });

    return { rows, roundsWithData, rounds: R };
  }

  // splits (optional): rounds after which to show a running total, e.g. [3, 6, 8].
  // Without it the classic layout is used: after 3 and after 6.
  function columns(roundsWithData, splits) {
    const has = new Set(roundsWithData);
    const last = roundsWithData.length ? Math.max(...roundsWithData) : 0;
    const cols = [];
    if (Array.isArray(splits)) {
      const after = new Set(splits);
      for (let r = 0; r <= last; r++) {
        if (has.has(r)) cols.push({ kind: 'round', r, label: r + ' тур' });
        if (after.has(r) && has.has(r) && roundsWithData.some((x) => x > r)) {
          cols.push({ kind: 'sum', r, label: 'После ' + r });
        }
      }
      cols.push({ kind: 'total', label: 'Итого' });
      return cols;
    }
    for (let r = 0; r <= last; r++) {
      if (has.has(r)) cols.push({ kind: 'round', r, label: r + ' тур' });
      if (r === 3 && has.has(3) && roundsWithData.some((x) => x > 3)) {
        cols.push({ kind: 'sum3', label: 'После 3' });
      }
      if (r === 6 && has.has(6) && roundsWithData.some((x) => x > 6)) {
        cols.push({ kind: 'sum6', label: 'После 6' });
      }
    }
    cols.push({ kind: 'total', label: 'Итого' });
    return cols;
  }

  const api = { ROUNDS, MAX_ROUNDS, roundsOf, computeRows, columns };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Scoreboard = api;
})(typeof window !== 'undefined' ? window : globalThis);
