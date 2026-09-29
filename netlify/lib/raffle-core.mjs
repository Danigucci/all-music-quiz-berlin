import { createHash, randomBytes } from 'node:crypto';

const MIN = 1;
const MAX = 90;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

export function createRaffle(store, { random = Math.random, sendEmail = async () => {} } = {}) {
  const normalizePrize = (p) => {
    const src = typeof p === 'string' ? { name: p } : (p || {});
    const name = String(src.name || '').trim().slice(0, 120);
    if (!name) return null;
    const instagram = String(src.instagram || '').trim().replace(/^@+/, '');
    const image = String(src.image || '').trim();
    const video = String(src.video || '').trim();
    const isSafeFilename = (f) => /^[A-Za-z0-9._-]{1,100}$/.test(f) && !f.startsWith('.');
    return {
      name,
      instagram: /^[A-Za-z0-9._]{1,30}$/.test(instagram) ? instagram : '',
      image: isSafeFilename(image) ? image : '',
      video: isSafeFilename(video) ? video : '',
    };
  };

  const readState = async () => {
    const state = (await store.get('state', { type: 'json' })) || { open: false, session: null, drawn: [] };
    return { ...state, prizes: (state.prizes || []).map(normalizePrize).filter(Boolean) };
  };
  const writeState = (state) => store.setJSON('state', state);

  const cleanPrizeList = (list) =>
    (Array.isArray(list) ? list : []).map(normalizePrize).filter(Boolean).slice(0, 200);

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

  async function claim({ name, email, team, deviceId }) {
    const state = await readState();
    if (!state.open) return { status: 403, body: { error: 'closed' } };

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(name || '').trim().slice(0, 60);
    const cleanTeam = String(team || '').trim().slice(0, 60);
    const cleanDevice = String(deviceId || '');
    if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 200) {
      return { status: 400, body: { error: 'invalid_email' } };
    }
    if (!cleanName) return { status: 400, body: { error: 'invalid_name' } };
    if (!cleanTeam) return { status: 400, body: { error: 'invalid_team' } };
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
      const record = { number, name: cleanName, team: cleanTeam, email: cleanEmail, at: new Date().toISOString() };
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

      try { await sendEmail({ email: cleanEmail, name: cleanName, team: cleanTeam, number }); } catch (e) { console.error('raffle email failed', e); }
      return { status: 200, body: { number, existing: false, session } };
    }
    return { status: 409, body: { error: 'full' } };
  }

  const remainingPrizeIndexes = (state) => {
    const used = new Set((state.drawnPrizes || []).filter((i) => i != null));
    return (state.prizes || []).map((_, i) => i).filter((i) => !used.has(i));
  };

  async function adminStatus() {
    const state = await readState();
    const issued = state.session ? await listIssued(state.session) : [];
    const byNumber = new Map(issued.map((r) => [r.number, r]));
    const prizes = state.prizes || [];
    const drawnPrizes = state.drawnPrizes || [];
    return {
      open: state.open,
      session: state.session,
      max: MAX,
      issued: issued.length,
      participants: issued.map((r) => ({ number: r.number, name: r.name || '', team: r.team, email: r.email })),
      drawn: state.drawn.map((n, i) => ({
        number: n,
        name: byNumber.get(n)?.name || '',
        team: byNumber.get(n)?.team || '',
        email: byNumber.get(n)?.email || '',
        prize: drawnPrizes[i] != null ? prizes[drawnPrizes[i]] || null : null,
      })),
      prizes,
      remainingPrizeIndexes: remainingPrizeIndexes(state),
      pendingPrize: state.pendingPrize ?? null,
    };
  }

  async function adminOpen() {
    const prior = await readState();
    await purgeAll();
    const session = `${Date.now().toString(36)}${randomBytes(3).toString('hex')}`;
    await writeState({ open: true, session, drawn: [], drawnPrizes: [], pendingPrize: null, prizes: prior.prizes || [] });
    return adminStatus();
  }

  async function adminSetPrizes(list) {
    const state = await readState();
    const prizes = cleanPrizeList(list);
    const pendingPrize = state.pendingPrize != null && state.pendingPrize < prizes.length ? state.pendingPrize : null;
    await writeState({ ...state, prizes, pendingPrize });
    return adminStatus();
  }

  async function adminClose() {
    const state = await readState();
    await writeState({ ...state, open: false });
    return adminStatus();
  }

  const undrawnCandidates = async (state) => {
    const issued = await listIssued(state.session);
    return issued.filter((r) => !state.drawn.includes(r.number));
  };

  // Step 1: the wheel picks which remaining prize is played for next.
  async function adminSpin() {
    const state = await readState();
    if (!state.session) return { status: 400, body: { error: 'no_session' } };
    const prizes = state.prizes || [];
    if (!prizes.length) return { status: 400, body: { error: 'no_prizes' } };
    if (state.pendingPrize != null && prizes[state.pendingPrize]) {
      return { status: 409, body: { error: 'already_spun', prizeIndex: state.pendingPrize, prize: prizes[state.pendingPrize] } };
    }
    const remaining = remainingPrizeIndexes(state);
    if (!remaining.length) return { status: 409, body: { error: 'no_prizes_left' } };
    if (!(await undrawnCandidates(state)).length) return { status: 409, body: { error: 'nothing_to_draw' } };
    const prizeIndex = remaining[Math.floor(random() * remaining.length)];
    await writeState({ ...state, pendingPrize: prizeIndex });
    return { status: 200, body: { prizeIndex, prize: prizes[prizeIndex], remainingPrizes: remaining.length } };
  }

  // Step 2: draw the winning number for the prize chosen by the wheel.
  async function adminDraw() {
    const state = await readState();
    if (!state.session) return { status: 400, body: { error: 'no_session' } };
    const prizes = state.prizes || [];
    const hasPrizes = prizes.length > 0;
    if (hasPrizes) {
      if (!remainingPrizeIndexes(state).length) return { status: 409, body: { error: 'no_prizes_left' } };
      if (state.pendingPrize == null || !prizes[state.pendingPrize]) return { status: 409, body: { error: 'spin_first' } };
    }
    const candidates = await undrawnCandidates(state);
    if (!candidates.length) return { status: 409, body: { error: 'nothing_to_draw' } };
    const winner = candidates[Math.floor(random() * candidates.length)];
    const prizeIndex = hasPrizes ? state.pendingPrize : null;
    await writeState({
      ...state,
      drawn: [...state.drawn, winner.number],
      drawnPrizes: [...(state.drawnPrizes || []), prizeIndex],
      pendingPrize: null,
    });
    return {
      status: 200,
      body: {
        number: winner.number,
        name: winner.name || '',
        team: winner.team,
        email: winner.email,
        remaining: candidates.length - 1,
        prizeIndex,
        prize: prizeIndex != null ? prizes[prizeIndex] : null,
      },
    };
  }

  async function adminPurge() {
    await purgeAll();
    await writeState({ open: false, session: null, drawn: [], drawnPrizes: [], pendingPrize: null, prizes: [] });
    return adminStatus();
  }

  return { publicStatus, claim, adminStatus, adminOpen, adminClose, adminSpin, adminDraw, adminPurge, adminSetPrizes };
}
