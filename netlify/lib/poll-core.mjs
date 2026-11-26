import { randomBytes } from 'node:crypto';

// Live voting: the host prepares questions, opens the vote, guests answer every question
// on their phones, and the results appear only when the host shows them.
const PID_RE = /^[A-Za-z0-9-]{8,64}$/;
const MAX_QUESTIONS = 20;
const MAX_OPTIONS = 10;

const clean = (s, max) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export function normalizeQuestions(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, MAX_QUESTIONS).map((q, i) => {
    const text = clean(q && q.text, 200);
    const options = (Array.isArray(q && q.options) ? q.options : []).map((o) => clean(o, 120)).filter(Boolean).slice(0, MAX_OPTIONS);
    const id = /^[a-z0-9]{1,16}$/.test(String(q && q.id || '')) ? q.id : `q${i + 1}${randomBytes(2).toString('hex')}`;
    return { id, text, options };
  }).filter((q) => q.text && q.options.length >= 2);
}

export function createPoll(store) {
  const readState = async () => (await store.get('state', { type: 'json' })) || { phase: 'off', session: null, questions: [] };
  const writeState = (s) => store.setJSON('state', s);
  const readDraft = async () => (await store.get('draft', { type: 'json' })) || [];

  const listVotes = async (session) => {
    const prefix = `s/${session}/v/`;
    const { blobs } = await store.list({ prefix });
    const rows = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })));
    return rows.filter(Boolean);
  };

  const tally = (questions, votes) => questions.map((q) => {
    const counts = q.options.map(() => 0);
    let total = 0;
    for (const v of votes) {
      const o = v.answers && v.answers[q.id];
      if (Number.isInteger(o) && o >= 0 && o < counts.length) { counts[o] += 1; total += 1; }
    }
    return { id: q.id, text: q.text, options: q.options, counts, total };
  });

  // ---------- guests ----------
  async function view(pid) {
    const state = await readState();
    if (state.phase === 'off') return { phase: 'off' };
    const mine = PID_RE.test(pid || '') ? await store.get(`s/${state.session}/v/${pid}`, { type: 'json' }) : null;
    const base = { phase: state.phase, session: state.session, title: state.title || '', questions: state.questions, mine: mine ? mine.answers : null };
    if (state.phase === 'results') base.results = tally(state.questions, await listVotes(state.session));
    return base;
  }

  async function vote({ pid, session, answers }) {
    const state = await readState();
    if (state.phase !== 'open') return { status: 409, body: { error: 'closed' } };
    if (session && session !== state.session) return { status: 409, body: { error: 'stale_session' } };
    if (!PID_RE.test(String(pid || ''))) return { status: 400, body: { error: 'invalid_voter' } };
    const picked = {};
    for (const q of state.questions) {
      const o = answers && answers[q.id];
      if (Number.isInteger(o) && o >= 0 && o < q.options.length) picked[q.id] = o;
    }
    if (!Object.keys(picked).length) return { status: 400, body: { error: 'empty' } };
    // A guest can change their vote while voting is open
    await store.setJSON(`s/${state.session}/v/${pid}`, { answers: picked, at: Date.now() });
    return { status: 200, body: { ok: true } };
  }

  // ---------- host ----------
  async function hostStatus() {
    const [state, draft, draftTitle] = await Promise.all([readState(), readDraft(), store.get('title', { type: 'json' })]);
    const out = { phase: state.phase, title: state.title || '', draft, draftTitle: draftTitle || '', questions: state.questions || [] };
    if (state.phase !== 'off') {
      const votes = await listVotes(state.session);
      out.voters = votes.length;
      if (state.phase === 'results') out.results = tally(state.questions, votes);
    }
    return out;
  }

  async function saveDraft({ questions, title }) {
    await store.setJSON('draft', normalizeQuestions(questions));
    if (title !== undefined) await store.setJSON('title', clean(title, 80));
    return hostStatus();
  }

  async function open({ questions } = {}) {
    if (questions) await store.setJSON('draft', normalizeQuestions(questions));
    const qs = await readDraft();
    if (!qs.length) return { error: 'no_questions', ...(await hostStatus()) };
    const prev = await readState();
    const title = (await store.get('title', { type: 'json' })) || '';
    await writeState({ phase: 'open', session: randomBytes(6).toString('hex'), title, questions: qs });
    if (prev.session) await purge(prev.session);
    return hostStatus();
  }

  async function showResults() {
    const state = await readState();
    if (state.phase === 'open') await writeState({ ...state, phase: 'results' });
    return hostStatus();
  }

  async function resume() {
    const state = await readState();
    if (state.phase === 'results') await writeState({ ...state, phase: 'open' });
    return hostStatus();
  }

  async function close() {
    const prev = await readState();
    await writeState({ phase: 'off', session: null, questions: [] });
    if (prev.session) await purge(prev.session);
    return hostStatus();
  }

  async function purge(session) {
    const { blobs } = await store.list({ prefix: `s/${session}/` });
    await Promise.all(blobs.map((b) => store.delete(b.key)));
  }

  return { view, vote, hostStatus, saveDraft, open, showResults, resume, close };
}
