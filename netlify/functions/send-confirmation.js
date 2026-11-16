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
  const cal = calendarFor(game, teamLine);

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#09070f;">Регистрация подтверждена ✅</h2>
      <p>Привет, ${escapeHtml(captain || '')}!</p>
      <p>Мы получили вашу заявку на <strong>Kaifzeit Quiz</strong>.</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <tr><td style="padding:6px 0; color:#666;">Игра</td><td style="padding:6px 0;"><strong>${escapeHtml(game || '')}</strong></td></tr>
        <tr><td style="padding:6px 0; color:#666;">Команда</td><td style="padding:6px 0;">${escapeHtml(teamLine)}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Число игроков</td><td style="padding:6px 0;">${escapeHtml(players || '')}</td></tr>
      </table>
      ${cal ? `
      <p style="margin:20px 0;">
        <a href="${cal.google}" style="display:inline-block;background:#eeb3cc;color:#191919;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:6px;">📅 Добавить в Google Календарь</a>
      </p>
      <p style="color:#666;font-size:13px;">Для Apple Календаря или Outlook открой файл <strong>kaifzeit-music.ics</strong> во вложении к письму.</p>` : ''}
      <p>До встречи на игре! 🎶</p>
      <p style="color:#999; font-size:12px; margin-top:24px;">Kaifzeit Quiz · Instagram: @kaifzeitmusic</p>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Kaifzeit Quiz <noreply@kaifzeit.com>',
      to: [email],
      subject: 'Регистрация подтверждена — Kaifzeit Quiz',
      html,
      ...(cal ? { attachments: [{ filename: 'kaifzeit-music.ics', content: Buffer.from(cal.ics).toString('base64') }] } : {}),
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

// ---- "Add to calendar": Google Calendar link + .ics file (Apple Calendar, Outlook) ----
// Venue per game date; the form only sends "26.11.2026, 19:00 — Музыка в кино".
const CASTLE = 'The Castle Berlin Mitte, Invalidenstraße 129, 10115 Berlin';
const BELUSHIS = "Belushi's Berlin Mitte, Berlin";
const VENUES = {
  '26.11.2026': BELUSHIS,
  '10.12.2026': CASTLE,
  '22.12.2026': BELUSHIS,
  '29.12.2026': CASTLE,
};
const GAME_HOURS = 3;

function calendarFor(game, teamLine) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{1,2}):(\d{2})\s*[—-]\s*(.+)$/.exec(String(game || '').trim());
  if (!m) return null; // unknown format: send the email without the calendar part
  const [, d, mo, y, hRaw, min, name] = m;
  const hh = Number(hRaw);
  const pad = (n) => String(n).padStart(2, '0');
  const day = `${y}${mo}${d}`;
  const start = `${day}T${pad(hh)}${min}00`;
  const end = hh + GAME_HOURS < 24 ? `${day}T${pad(hh + GAME_HOURS)}${min}00` : `${day}T235900`;
  const title = `KAIFZEIT Music — ${name.trim()}`;
  const location = VENUES[`${d}.${mo}.${y}`] || 'Berlin';
  const details = `Музыкальный квиз KAIFZEIT. Вход: 15 € с человека. Команда: ${teamLine}. https://kaifzeit.com/music.html`;
  const google = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
    action: 'TEMPLATE', text: title, dates: `${start}/${end}`, ctz: 'Europe/Berlin', details, location,
  }).toString();
  const esc = (t) => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KAIFZEIT//Quiz//RU', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${start}-${Math.random().toString(36).slice(2)}@kaifzeit.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toUtc(start)}`,
    `DTEND:${toUtc(end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(location)}`,
    `DESCRIPTION:${esc(details)}`,
    'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].map(fold).join('\r\n');
  return { google, ics };
}

// "20261216T190000" in Berlin time -> "20261216T180000Z"
function toUtc(local) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(local);
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  for (const offsetH of [1, 2]) {
    const t = new Date(asUtc - offsetH * 3600e3);
    const berlinHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', hourCycle: 'h23' }).format(t));
    if (berlinHour === +m[4]) return t.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  }
  return new Date(asUtc - 3600e3).toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
}

// iCalendar lines must be at most 75 bytes; longer ones continue on the next line after a space
function fold(line) {
  const out = [];
  let cur = '';
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch) > (out.length ? 74 : 75)) { out.push(cur); cur = ''; }
    cur += ch;
  }
  out.push(cur);
  return out.join('\r\n ');
}
