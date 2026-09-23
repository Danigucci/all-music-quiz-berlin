import { getStore } from '@netlify/blobs';
import { selectDueSubmissions, venueForGame } from '../lib/reminder-core.mjs';

export const config = { schedule: '@daily' };

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function fetchAllSubmissions(siteId, token, formId) {
  const submissions = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `https://api.netlify.com/api/v1/forms/${formId}/submissions?per_page=100&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(`Netlify API error ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    submissions.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return submissions;
}

async function findRegistrationFormId(siteId, token) {
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Netlify API error ${res.status}: ${await res.text()}`);
  const forms = await res.json();
  const form = forms.find((f) => f.name === 'registration');
  if (!form) throw new Error('registration form not found');
  return form.id;
}

async function sendReminderEmail({ email, captain, teamLine, game, venue }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#181454;">Напоминаем про игру 🎶</h2>
      <p>Привет, ${escapeHtml(captain || '')}!</p>
      <p>Через 2 дня — <strong>All Music Quiz Berlin</strong>, не забудь прийти.</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <tr><td style="padding:6px 0; color:#666;">Игра</td><td style="padding:6px 0;"><strong>${escapeHtml(`Игра #${game.number}: ${game.name}`)}</strong></td></tr>
        <tr><td style="padding:6px 0; color:#666;">Когда</td><td style="padding:6px 0;">${escapeHtml(game.dateLabel)}, ${escapeHtml(game.time)}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Где</td><td style="padding:6px 0;">${escapeHtml(venue.name)}, ${escapeHtml(venue.address)}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Команда</td><td style="padding:6px 0;">${escapeHtml(teamLine)}</td></tr>
      </table>
      <p>До встречи! 🎶</p>
      <p style="color:#999; font-size:12px; margin-top:24px;">All Music Quiz Berlin · Instagram: @allmusicquiz_berlin</p>
    </div>
  `;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'All Music Quiz Berlin <noreply@allmusicquiz.com>',
      to: [email],
      subject: `Напоминание: игра ${game.dateLabel} в ${game.time}`,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend API error ${res.status}: ${await res.text()}`);
}

export default async () => {
  const siteId = process.env.SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  if (!siteId || !token) {
    console.error('game-reminders: SITE_ID or NETLIFY_API_TOKEN not set');
    return new Response('misconfigured', { status: 500 });
  }

  const sentStore = getStore({ name: 'game-reminders-sent', consistency: 'strong' });
  const formId = await findRegistrationFormId(siteId, token);
  const submissions = await fetchAllSubmissions(siteId, token, formId);
  const due = selectDueSubmissions(submissions);

  let sent = 0;
  for (const { submission, data, game } of due) {
    const key = String(submission.id);
    const { modified } = await sentStore.setJSON(key, { at: new Date().toISOString() }, { onlyIfNew: true });
    if (!modified) continue;

    const teamLine = data.no_team === 'true' || data.no_team === true ? 'Без команды (подсадка)' : data.team || '—';
    try {
      await sendReminderEmail({
        email: data.email,
        captain: data.captain,
        teamLine,
        game,
        venue: venueForGame(game.number),
      });
      sent += 1;
    } catch (e) {
      console.error('game-reminders: failed to send', key, e);
      await sentStore.delete(key);
    }
  }

  console.log(`game-reminders: checked ${submissions.length} submissions, sent ${sent} reminders`);
  return new Response('ok');
};
