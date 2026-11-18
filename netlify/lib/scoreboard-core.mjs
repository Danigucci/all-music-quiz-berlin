import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const ROUNDS = 7; // default number of rounds
export const MAX_ROUNDS = 15;
const MAX_TEAMS = 60;

const digest = (s) => createHash('sha256').update(String(s)).digest();

export function checkPassword(given, expected) {
  if (!expected) return null;
  return timingSafeEqual(digest(given || ''), digest(expected));
}

export const emptyState = () => ({ title: '', rounds: ROUNDS, teams: [], scores: {}, rev: 0 });

export function sanitizeState(input, fallbackRounds = ROUNDS, fallbackSplits, fallbackExtra) {
  const src = input && typeof input === 'object' ? input : {};
  const title = String(src.title ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);

  const teams = [];
  const seen = new Set();
  for (const t of Array.isArray(src.teams) ? src.teams : []) {
    const name = String(t?.name ?? '').trim().replace(/\s+/g, ' ').slice(0, 60);
    if (!name) continue;
    let id = String(t?.id ?? '');
    if (!/^[a-z0-9]{4,20}$/.test(id) || seen.has(id)) id = randomBytes(5).toString('hex');
    seen.add(id);
    teams.push({ id, name });
    if (teams.length >= MAX_TEAMS) break;
  }

  const ids = new Set(teams.map((t) => t.id));
  const scores = {};
  const srcScores = src.scores && typeof src.scores === 'object' ? src.scores : {};
  let rounds = Math.round(Number(src.rounds));
  if (!Number.isFinite(rounds)) rounds = Math.round(Number(fallbackRounds)) || ROUNDS;
  rounds = Math.min(MAX_ROUNDS, Math.max(1, rounds));
  // Extra rounds like "6.1" (shown right after round 6)
  const EXTRA_RE = /^(\d{1,2})\.([1-9])$/;
  const extraSrc = [...(Array.isArray(src.extra) ? src.extra : (Array.isArray(fallbackExtra) ? fallbackExtra : [])), ...Object.keys(srcScores)];
  const extra = [...new Set(extraSrc.map(String).filter((k) => EXTRA_RE.test(k) && Number(k.split('.')[0]) <= rounds))]
    .sort((a, b) => Number(a) - Number(b));
  const keys = [...Array.from({ length: rounds + 1 }, (_, r) => String(r)), ...extra];
  for (const r of keys) { // round 0: optional warm-up round
    const row = srcScores[r];
    if (!row || typeof row !== 'object') continue;
    const out = {};
    for (const [id, v] of Object.entries(row)) {
      if (!ids.has(id) || v === '' || v === null || v === undefined) continue;
      const n = Number(v);
      if (!Number.isFinite(n)) continue;
      const i = Math.round(n);
      if (i < -999 || i > 999) continue;
      out[id] = i;
    }
    if (Object.keys(out).length) scores[r] = out;
  }
  // Rounds after which the screen shows a running total ("После N"). Not stored = default (after 3 and 6).
  const rawSplits = Array.isArray(src.splits) ? src.splits : (Array.isArray(fallbackSplits) ? fallbackSplits : null);
  const out = { title, rounds, teams, scores };
  if (extra.length) out.extra = extra;
  if (rawSplits) {
    out.splits = [...new Set(rawSplits.map((x) => Math.round(Number(x))))]
      .filter((x) => Number.isFinite(x) && x >= 1 && x < rounds)
      .sort((a, b) => a - b);
  }
  return out;
}

export async function handleScoreboard({ route, method, password, body }, store, adminPassword) {
  if (method !== 'POST') return { status: 405, body: { error: 'method_not_allowed' } };
  const auth = checkPassword(password, adminPassword);
  if (auth === null) return { status: 503, body: { error: 'admin_not_configured' } };
  if (!auth) return { status: 401, body: { error: 'unauthorized' } };

  const load = async () => {
    const st = (await store.get('state', { type: 'json' })) || emptyState();
    return { rounds: ROUNDS, ...st };
  };

  if (route === 'get') return { status: 200, body: await load() };

  if (route === 'save') {
    const current = await load();
    if (Number(body?.baseRev) !== current.rev) return { status: 409, body: { error: 'stale', ...current } };
    const next = { ...sanitizeState(body?.state, current.rounds || ROUNDS, current.splits, current.extra), rev: current.rev + 1 };
    await store.setJSON('state', next);
    return { status: 200, body: next };
  }

  if (route === 'clear') {
    const current = await load();
    const next = { ...emptyState(), rev: current.rev + 1 };
    await store.setJSON('state', next);
    return { status: 200, body: next };
  }

  return { status: 404, body: { error: 'not_found' } };
}
