import { createHash, randomBytes } from 'node:crypto';

const MIN = 1;
const MAX = 90;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

export function createRaffle(store, { random = Math.random, sendEmail = async () => {} } = {}) {
  const readState = async () =>
    (await store.get('state', { type: 'json' })) || { open: false, session: null, drawn: [] };
  const writeState = (state) => store.setJSON('state', state);

  const listIssued = async (session) => {
    const { blobs } = await store.list({ prefix: `s/${session}/n/` });
    const records = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })));
    return records.filter(Boolean).sort((a, b) => a.number - b.number);
  };

  const purgeAll = async () => {
    const { blobs } = await store.list({ prefix: 's/' });
    await Promise.all(blobs.map((b) => store.delete(b.key)));
  };

  async function publicStatus() {
    const state = await readState();
    return { open: state.open, session: state.session, min: MIN, max: MAX };
  }

  async function claim({ email, team, deviceId }) {
    const state = await readState();
    if (!state.open) return { status: 403, body: { error: 'closed' } };

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanTeam = String(team || '').trim().slice(0, 60);
    const cleanDevice = String(deviceId || '');
    if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 200) {
      return { status: 400, body: { error: 'invalid_email' } };
    }
    if (!/^[A-Za-z0-9-]{8,64}$/.test(cleanDevice)) {
      return { status: 400, body: { error: 'invalid_device' } };
    }

    const session = state.session;
    const emailKey = `s/${session}/e/${sha256(cleanEmail)}`;
    const deviceKey = `s/${session}/d/${cleanDevice}`;

    const existing = (await store.get(emailKey, { type: 'json' })) || (await store.get(deviceKey, { type: 'json' }));
    if (existing) return { status: 200, body: { number: existing.number, existing: true, session } };

    const issued = await listIssued(session);
    const taken = new Set(issued.map((r) => r.number));
    const free = [];
    for (let n = MIN; n <= MAX; n++) if (!taken.has(n)) free.push(n);

    while (free.length) {
      const idx = Math.floor(random() * free.length);
      const number = free.splice(idx, 1)[0];
      const record = { number, team: cleanTeam, email: cleanEmail, at: new Date().toISOString() };
      const numberKey = `s/${session}/n/${number}`;
      const { modified } = await store.setJSON(numberKey, record, { onlyIfNew: true });
      if (!modified) continue;

      const ref = { number };
      const emailWrite = await store.setJSON(emailKey, ref, { onlyIfNew: true });
      const deviceWrite = emailWrite.modified ? await store.setJSON(deviceKey, ref, { onlyIfNew: true }) : { modified: false };
      if (!emailWrite.modified || !deviceWrite.modified) {
        if (emailWrite.modified) await store.delete(emailKey);
        await store.delete(numberKey);
        const prior = (await store.get(emailKey, { type: 'json' })) || (await store.get(deviceKey, { type: 'json' }));
        if (prior) return { status: 200, body: { number: prior.number, existing: true, session } };
        return { status: 409, body: { error: 'conflict' } };
      }

      try { await sendEmail({ email: cleanEmail, team: cleanTeam, number }); } catch (e) { console.error('raffle email failed', e); }
      return { status: 200, body: { number, existing: false, session } };
    }
    return { status: 409, body: { error: 'full' } };
  }

  async function adminStatus() {
    const state = await readState();
    const issued = state.session ? await listIssued(state.session) : [];
    const byNumber = new Map(issued.map((r) => [r.number, r]));
    return {
      open: state.open,
      session: state.session,
      max: MAX,
      issued: issued.length,
      drawn: state.drawn.map((n) => ({ number: n, team: byNumber.get(n)?.team || '', email: byNumber.get(n)?.email || '' })),
    };
  }

  async function adminOpen() {
    await purgeAll();
    const session = `${Date.now().toString(36)}${randomBytes(3).toString('hex')}`;
    await writeState({ open: true, session, drawn: [] });
    return adminStatus();
  }

  async function adminClose() {
    const state = await readState();
    await writeState({ ...state, open: false });
    return adminStatus();
  }

  async function adminDraw() {
    const state = await readState();
    if (!state.session) return { status: 400, body: { error: 'no_session' } };
    const issued = await listIssued(state.session);
    const candidates = issued.filter((r) => !state.drawn.includes(r.number));
    if (!candidates.length) return { status: 409, body: { error: 'nothing_to_draw' } };
    const winner = candidates[Math.floor(random() * candidates.length)];
    await writeState({ ...state, drawn: [...state.drawn, winner.number] });
    return { status: 200, body: { number: winner.number, team: winner.team, email: winner.email, remaining: candidates.length - 1 } };
  }

  async function adminPurge() {
    await purgeAll();
    await writeState({ open: false, session: null, drawn: [] });
    return adminStatus();
  }

  return { publicStatus, claim, adminStatus, adminOpen, adminClose, adminDraw, adminPurge };
}
