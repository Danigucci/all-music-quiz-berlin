import { getStore } from '@netlify/blobs';
export const config = { path: '/api/tmp-test-invite' };
export default async () => {
  const store = getStore({ name: 'tmp-test-invite', consistency: 'strong' });
  const { modified } = await store.setJSON('sent', { at: new Date().toISOString() }, { onlyIfNew: true });
  if (!modified) return new Response('already sent', { status: 409 });
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'All Music Quiz Berlin <noreply@allmusicquiz.com>',
      to: [to],
      subject: '[ТЕСТ] Приглашение: Halloween Music Party — 29.10 в 19:00 в The Castle',
      html, text,
    }),
  });
  if (!res.ok) await store.delete('sent');
  return new Response(`resend ${res.status}`, { status: res.ok ? 200 : 502 });
};
