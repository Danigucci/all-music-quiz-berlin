import { SCHEDULE } from './reminder-core.mjs';

export const SITE_URL = 'https://allmusicquiz.com';
const FROM = 'All Music Quiz Berlin <noreply@allmusicquiz.com>';
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const normalizeEmail = (v) => String(v || '').trim().toLowerCase();
export const isValidEmail = (v) => v.length <= 254 && EMAIL_RE.test(v);

export const newToken = () => crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');

export function pageHtml(title, message) {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#181454;color:#fff;font-family:Arial,Helvetica,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px;box-sizing:border-box">
<div style="max-width:420px"><div style="color:#ffd83e;letter-spacing:2px;font-weight:bold;font-size:14px">ALL MUSIC QUIZ BERLIN</div>
<h1 style="font-size:26px;margin:14px 0">${escapeHtml(title)}</h1><p style="color:#ffb3d9;line-height:1.5">${escapeHtml(message)}</p>
<a href="${SITE_URL}" style="color:#ffd83e">На сайт</a></div></body></html>`;
}

export function gameInfo(dateStr) {
  const g = SCHEDULE[dateStr];
  if (!g) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
  const month = new Intl.DateTimeFormat('ru-RU', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
  return { ...g, dateStr, whenLabel: `${weekday[0].toUpperCase()}${weekday.slice(1)}, ${month.replace(/ г\.$/, '')}, ${g.time}` };
}

export function unsubscribeUrl(token) {
  return `${SITE_URL}/api/newsletter/unsubscribe?token=${token}`;
}

export function buildAnnouncement(game, token, legacy = false) {
  const venueLine = game.venue.address ? `${game.venue.name}, ${game.venue.address}` : game.venue.name;
  const registerUrl = `${SITE_URL}/#register`;
  const unsub = unsubscribeUrl(token);
  const html = `
<div style="background:#f4f2fb;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
    <div style="background:#181454;padding:28px 24px;text-align:center;">
      <div style="color:#ffd83e;font-size:14px;letter-spacing:2px;font-weight:bold;">ALL MUSIC QUIZ BERLIN</div>
      <div style="color:#ffffff;font-size:28px;font-weight:bold;margin-top:10px;line-height:1.15;">${escapeHtml(game.name)}</div>
      <div style="color:#ffb3d9;font-size:16px;margin-top:8px;">Игра #${game.number}</div>
    </div>
    <div style="padding:26px 24px;color:#181454;font-size:16px;line-height:1.55;">
      <p style="margin:0 0 14px;">Привет! Приглашаем тебя и твою команду на новую игру All Music Quiz Berlin.</p>
      <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:16px;">
        <tr><td style="padding:8px 0;color:#7a77a8;width:110px;">Когда</td><td style="padding:8px 0;"><strong>${escapeHtml(game.whenLabel)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#7a77a8;">Где</td><td style="padding:8px 0;"><strong>${escapeHtml(venueLine)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#7a77a8;">Формат</td><td style="padding:8px 0;">7 музыкальных раундов, команды от 2 до 10 человек</td></tr>
        <tr><td style="padding:8px 0;color:#7a77a8;">Участие</td><td style="padding:8px 0;">15 € с человека</td></tr>
      </table>
      <p style="margin:0 0 22px;">Места ограничены, так что лучше записаться заранее.</p>
      <div style="text-align:center;margin:26px 0;">
        <a href="${registerUrl}" style="display:inline-block;background:#ff4fa3;color:#181454;text-decoration:none;font-weight:bold;font-size:18px;padding:14px 34px;border-radius:999px;">Записать команду</a>
      </div>
      <p style="margin:0;font-size:14px;color:#5b5890;">Instagram: <a href="https://instagram.com/allmusicquiz_berlin" style="color:#ff4fa3;">@allmusicquiz_berlin</a></p>
    </div>
    <div style="background:#f4f2fb;padding:16px 24px;color:#7a77a8;font-size:12px;line-height:1.5;">
      ${legacy ? 'Вы получили это письмо, потому что ранее регистрировались на игры All Music Quiz Berlin.' : 'Вы получили это письмо, потому что подписались на анонсы игр All Music Quiz Berlin.'}
      <a href="${unsub}" style="color:#7a77a8;">Отписаться</a><br>
      All Music Quiz Berlin · Danil Lappo · Konrad-Zuse-Str. 17, 12489 Berlin · danlappo@yahoo.com
    </div>
  </div>
</div>`;
  const text = [
    `ALL MUSIC QUIZ BERLIN — ${game.name} (Игра #${game.number})`, '',
    'Привет! Приглашаем тебя и твою команду на новую игру.', '',
    `Когда: ${game.whenLabel}`, `Где: ${venueLine}`,
    'Формат: 7 музыкальных раундов, команды от 2 до 10 человек', 'Участие: 15 € с человека', '',
    `Запишись заранее: ${registerUrl}`, '',
    legacy ? 'Вы получили это письмо, потому что ранее регистрировались на игры All Music Quiz Berlin.' : 'Вы подписались на анонсы игр All Music Quiz Berlin.',
    `Отписаться: ${unsub}`,
    'All Music Quiz Berlin · Danil Lappo · Konrad-Zuse-Str. 17, 12489 Berlin',
  ].join('\n');
  return { html, text, subject: `Приглашение: ${game.name} — ${game.dateStr.split('-').reverse().slice(0, 2).join('.')} в ${game.time}`, unsub };
}

export function buildConfirmEmail(token) {
  const url = `${SITE_URL}/api/newsletter/confirm?token=${token}`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#181454;">
<h2>Подтвердите подписку 🎶</h2>
<p>Вы (или кто-то с вашим адресом) попросили присылать анонсы игр All Music Quiz Berlin. Чтобы подтвердить, нажмите кнопку. Если это были не вы — просто проигнорируйте письмо, ничего не произойдёт.</p>
<p style="text-align:center;margin:24px 0;"><a href="${url}" style="background:#ff4fa3;color:#181454;text-decoration:none;font-weight:bold;padding:12px 28px;border-radius:999px;display:inline-block;">Подтвердить подписку</a></p>
<p style="color:#999;font-size:12px;">All Music Quiz Berlin · Konrad-Zuse-Str. 17, 12489 Berlin</p></div>`;
  return { html, text: `Подтвердите подписку на анонсы All Music Quiz Berlin: ${url}\nЕсли это были не вы — проигнорируйте письмо.`, subject: 'Подтвердите подписку на анонсы All Music Quiz Berlin' };
}

export async function sendEmail(apiKey, { to, subject, html, text, headers }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, text, headers }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

// store: Blobs-like { get(key,{type}), setJSON, list }.
// Records are keyed by email; token index lives under "t:<token>" -> email.
export async function handleNewsletter({ route, method, query, password, body }, store, deps) {
  const { apiKey, adminPassword } = deps;
  const send = deps.send || ((m) => sendEmail(apiKey, m));
  const byToken = async (token) => {
    if (!/^[a-f0-9]{64}$/.test(token || '')) return null;
    const email = await store.get(`t:${token}`, { type: 'json' });
    return email ? { email, rec: await store.get(`e:${email}`, { type: 'json' }) } : null;
  };

  if (route === 'subscribe' && method === 'POST') {
    const email = normalizeEmail(body?.email);
    if (!isValidEmail(email)) return { status: 400, json: { error: 'invalid email' } };
    const existing = await store.get(`e:${email}`, { type: 'json' });
    if (existing?.status === 'active' || (existing?.status === 'pending' && Date.now() - Date.parse(existing.requestedAt) < 60000)) {
      return { status: 200, json: { ok: true } };
    }
    const token = existing?.token || newToken();
    await store.setJSON(`e:${email}`, { email, token, status: 'pending', requestedAt: new Date().toISOString(), source: String(body?.source || 'form').slice(0, 20) });
    await store.setJSON(`t:${token}`, email);
    const m = buildConfirmEmail(token);
    await send({ to: email, ...m });
    return { status: 200, json: { ok: true } };
  }

  if (route === 'confirm' && method === 'GET') {
    const hit = await byToken(query.token);
    if (!hit?.rec) return { status: 404, html: pageHtml('Ссылка недействительна', 'Попробуйте подписаться ещё раз на сайте.') };
    if (hit.rec.status !== 'active') {
      await store.setJSON(`e:${hit.email}`, { ...hit.rec, status: 'active', confirmedAt: new Date().toISOString() });
    }
    return { status: 200, html: pageHtml('Подписка подтверждена 🎶', 'Спасибо! Мы будем присылать анонсы новых игр. Отписаться можно по ссылке в любом письме.') };
  }

  if (route === 'unsubscribe' && (method === 'GET' || method === 'POST')) {
    const hit = await byToken(query.token);
    if (!hit?.rec) return { status: 404, html: pageHtml('Ссылка недействительна', 'Если вы хотите отписаться, напишите нам: danlappo@yahoo.com') };
    if (hit.rec.status !== 'unsubscribed') {
      await store.setJSON(`e:${hit.email}`, { ...hit.rec, status: 'unsubscribed', unsubscribedAt: new Date().toISOString() });
    }
    return { status: 200, html: pageHtml('Вы отписались', 'Больше писем с анонсами вы не получите.') };
  }

  // Admin routes
  if (route === 'count' || route === 'send') {
    if (!adminPassword || password !== adminPassword) return { status: 401, json: { error: 'unauthorized' } };
    const keys = (await store.list({ prefix: 'e:' })).blobs.map((b) => b.key);
    const recs = (await Promise.all(keys.map((k) => store.get(k, { type: 'json' })))).filter(Boolean);
    const active = recs.filter((r) => r.status === 'active');
    if (route === 'count') {
      return { status: 200, json: { active: active.length, pending: recs.filter((r) => r.status === 'pending').length, unsubscribed: recs.filter((r) => r.status === 'unsubscribed').length } };
    }
    const info = gameInfo(String(body?.date || ''));
    if (!info) return { status: 400, json: { error: 'unknown game date' } };
    if (body?.testTo) {
      const to = normalizeEmail(body.testTo);
      if (!isValidEmail(to)) return { status: 400, json: { error: 'invalid testTo' } };
      const m = buildAnnouncement(info, 'f'.repeat(64));
      await send({ to, ...m, subject: `[ТЕСТ] ${m.subject}`, headers: {} });
      return { status: 200, json: { sent: 1, test: true } };
    }
    const sentKey = `sent:${info.dateStr}`;
    const already = (await store.get(sentKey, { type: 'json' })) || {};
    let sent = 0, failed = 0;
    for (const r of active) {
      if (already[r.email]) continue;
      const m = buildAnnouncement(info, r.token);
      try {
        await send({ to: r.email, ...m, headers: { 'List-Unsubscribe': `<${m.unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } });
        already[r.email] = new Date().toISOString();
        sent += 1;
      } catch (e) { failed += 1; }
    }
    await store.setJSON(sentKey, already);
    return { status: 200, json: { sent, failed, skippedAlreadySent: active.length - sent - failed } };
  }

  if (route === 'legacy-count' || route === 'legacy-send') {
    if (!adminPassword || password !== adminPassword) return { status: 401, json: { error: 'unauthorized' } };
    const emails = [...new Set((await deps.listRegistrantEmails()).map(normalizeEmail).filter(isValidEmail))];
    const targets = [];
    for (const email of emails) {
      const rec = await store.get(`e:${email}`, { type: 'json' });
      if (rec?.status === 'unsubscribed') continue;
      targets.push({ email, rec });
    }
    if (route === 'legacy-count') return { status: 200, json: { eligible: targets.length, skippedUnsubscribed: emails.length - targets.length } };
    const info = gameInfo(String(body?.date || ''));
    if (!info) return { status: 400, json: { error: 'unknown game date' } };
    const sentKey = `sent:${info.dateStr}`;
    const already = (await store.get(sentKey, { type: 'json' })) || {};
    let sent = 0, failed = 0, skipped = 0;
    for (const { email, rec } of targets) {
      if (already[email]) { skipped += 1; continue; }
      let r = rec;
      if (!r) {
        r = { email, token: newToken(), status: 'imported', importedAt: new Date().toISOString() };
        await store.setJSON(`e:${email}`, r);
        await store.setJSON(`t:${r.token}`, email);
      }
      const m = buildAnnouncement(info, r.token, r.status !== 'active');
      try {
        await send({ to: email, ...m, headers: { 'List-Unsubscribe': `<${m.unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } });
        already[email] = new Date().toISOString();
        sent += 1;
      } catch (e) { failed += 1; }
    }
    await store.setJSON(sentKey, already);
    return { status: 200, json: { sent, failed, skippedAlreadySent: skipped } };
  }

  return { status: 404, json: { error: 'not found' } };
}
