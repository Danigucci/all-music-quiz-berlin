(function (root) {
  const ROUNDS = 7; // default; a table can have its own number of rounds in state.rounds
  const MAX_ROUNDS = 15;
  const roundsOf = (state) => Math.min(MAX_ROUNDS, Math.max(1, Math.round(Number(state && state.rounds)) || ROUNDS));

  // Round keys: 0 (optional warm-up), 1..R, and extra rounds like 6.1, 6.2 (shown right after their round).
  const EXTRA_RE = /^(\d{1,2})\.([1-9])$/;
  const isExtra = (k) => EXTRA_RE.test(String(k));
  const groupOf = (k) => Math.floor(Number(k));

  function keysOf(state) {
    const R = roundsOf(state);
    const scores = (state && state.scores) || {};
    const keys = new Set();
    for (let r = 0; r <= R; r++) keys.add(r);
    const extra = [...((state && state.extra) || []), ...Object.keys(scores)];
    for (const k of extra) {
      if (isExtra(k) && groupOf(k) <= R) keys.add(Number(k));
    }
    return [...keys].sort((a, b) => a - b);
  }

  function computeRows(state) {
    const R = roundsOf(state);
    const keys = keysOf(state);
    const teams = (state && state.teams) || [];
    const scores = (state && state.scores) || {};
    const roundsWithData = keys.filter((k) => scores[k] && Object.keys(scores[k]).length);

    const rows = teams.map((t) => {
      const per = {};
      const cum = {}; // running total after each round key
      let total = 0;
      let sum3 = 0;
      let sum6 = 0;
      for (const k of keys) {
        const raw = scores[k] && scores[k][t.id];
        const v = raw === undefined || raw === null || raw === '' ? undefined : Number(raw);
        per[k] = v === undefined || !Number.isFinite(v) ? null : v;
        total += per[k] || 0;
        cum[k] = total;
        if (groupOf(k) <= 3) sum3 += per[k] || 0;
        if (groupOf(k) <= 6) sum6 += per[k] || 0;
      }
      return { id: t.id, team: t.name, per, sum3, sum6, cum, total };
    });

    // tie on total: higher score in the latest round wins, then the one before it, ...
    const desc = keys.slice().reverse();
    rows.sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      for (const k of desc) {
        const d = (b.per[k] || 0) - (a.per[k] || 0);
        if (d) return d;
      }
      return a.team.localeCompare(b.team, 'ru');
    });
    rows.forEach((row, i) => { row.place = i + 1; });

    return { rows, roundsWithData, rounds: R };
  }

  // splits (optional): rounds after which to show a running total, e.g. [3, 6, 8].
  // The total comes after the round's extra rounds (after 6.1 for "После 6").
  // Without splits the classic layout is used: after 3 and after 6.
  function columns(roundsWithData, splits) {
    const keys = roundsWithData.slice().sort((a, b) => a - b);
    const after = Array.isArray(splits) ? new Set(splits) : null;
    const cols = [];
    keys.forEach((k, i) => {
      cols.push({ kind: 'round', r: k, label: k + ' тур' });
      const g = groupOf(k);
      const next = keys[i + 1];
      if (next !== undefined && groupOf(next) === g) return; // the round's group goes on
      const later = keys.some((x) => groupOf(x) > g);
      if (!later) return;
      if (after) {
        if (after.has(g)) cols.push({ kind: 'sum', r: k, label: 'После ' + g });
      } else if (g === 3) {
        cols.push({ kind: 'sum3', label: 'После 3' });
      } else if (g === 6) {
        cols.push({ kind: 'sum6', label: 'После 6' });
      }
    });
    cols.push({ kind: 'total', label: 'Итого' });
    return cols;
  }

  const api = { ROUNDS, MAX_ROUNDS, roundsOf, keysOf, isExtra, groupOf, computeRows, columns };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Scoreboard = api;
})(typeof window !== 'undefined' ? window : globalThis);
