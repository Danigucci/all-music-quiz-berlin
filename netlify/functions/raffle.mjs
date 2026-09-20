import { getStore } from '@netlify/blobs';
import { createHash, timingSafeEqual } from 'node:crypto';
import { createRaffle } from '../lib/raffle-core.mjs';

export const config = { path: '/api/raffle/*' };

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const digest = (s) => createHash('sha256').update(String(s)).digest();

function isAdmin(req) {
  const expected = process.env.RAFFLE_ADMIN_PASSWORD;
  if (!expected) return null;
  const given = req.headers.get('x-admin-password') || '';
  return timingSafeEqual(digest(given), digest(expected));
}

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function sendEmail({ email, team, number }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const teamLine = team ? `<p style="color:#666;">Команда: ${escapeHtml(team)}</p>` : '';
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; text-align:center;">
      <h2 style="color:#181454;">Твой номер для розыгрыша</h2>
      <div style="font-size:64px; font-weight:800; color:#ff4fa3; margin:16px 0;">${number}</div>
      ${teamLine}
      <p>Сохрани это письмо или сделай скриншот — номер понадобится при розыгрыше призов. Удачи! 🎶</p>
      <p style="color:#999; font-size:12px; margin-top:24px;">All Music Quiz Berlin · Instagram: @allmusicquiz_berlin</p>
    </div>`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'All Music Quiz Berlin <noreply@allmusicquiz.com>',
      to: [email],
      subject: `Твой номер для розыгрыша: ${number}`,
      html,
    }),
  });
}

export default async (req) => {
  const raffle = createRaffle(getStore({ name: 'raffle', consistency: 'strong' }), { sendEmail });
  const route = new URL(req.url).pathname.replace(/^\/api\/raffle\/?/, '');

  if (route === 'status' && req.method === 'GET') {
    return json(200, await raffle.publicStatus());
  }

  if (route === 'claim' && req.method === 'POST') {
    let data;
    try { data = await req.json(); } catch { return json(400, { error: 'bad_request' }); }
    const { status, body } = await raffle.claim(data || {});
    return json(status, body);
  }

  if (route.startsWith('admin/') && req.method === 'POST') {
    const auth = isAdmin(req);
    if (auth === null) return json(503, { error: 'admin_not_configured' });
    if (!auth) return json(401, { error: 'unauthorized' });

    const action = route.slice('admin/'.length);
    if (action === 'status') return json(200, await raffle.adminStatus());
    if (action === 'open') return json(200, await raffle.adminOpen());
    if (action === 'close') return json(200, await raffle.adminClose());
    if (action === 'purge') return json(200, await raffle.adminPurge());
    if (action === 'draw') {
      const { status, body } = await raffle.adminDraw();
      return json(status, body);
    }
  }

  return json(404, { error: 'not_found' });
};
