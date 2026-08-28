// Netlify Function: sends a registration-confirmation email to the participant via Resend.
// Called (fire-and-forget) from the registration form's submit handler.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Bad Request' };
  }

  const { email, captain, team, game, players, no_team } = data;

  if (!email) {
    return { statusCode: 400, body: 'Missing email' };
  }

  const teamLine = no_team ? 'Без команды (подсадка)' : (team || '—');

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#181454;">Регистрация подтверждена ✅</h2>
      <p>Привет, ${escapeHtml(captain || '')}!</p>
      <p>Мы получили вашу заявку на <strong>All Music Quiz Berlin</strong>.</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <tr><td style="padding:6px 0; color:#666;">Игра</td><td style="padding:6px 0;"><strong>${escapeHtml(game || '')}</strong></td></tr>
        <tr><td style="padding:6px 0; color:#666;">Команда</td><td style="padding:6px 0;">${escapeHtml(teamLine)}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Число игроков</td><td style="padding:6px 0;">${escapeHtml(players || '')}</td></tr>
      </table>
      <p>До встречи на игре! 🎶</p>
      <p style="color:#999; font-size:12px; margin-top:24px;">All Music Quiz Berlin · Instagram: @allmusicquiz_berlin</p>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'All Music Quiz Berlin <noreply@allmusicquiz.com>',
      to: [email],
      subject: 'Регистрация подтверждена — All Music Quiz Berlin',
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Resend API error:', res.status, errText);
    return { statusCode: 502, body: 'Failed to send email' };
  }

  return { statusCode: 200, body: 'ok' };
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
