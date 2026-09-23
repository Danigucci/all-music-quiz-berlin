const GAME_RE = /(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}):(\d{2})\s*—\s*Игра\s*#(\d+):?\s*(.*)$/u;

const VENUES = {
  default: { name: 'The Castle Berlin Mitte', address: 'Invalidenstraße 129, 10115 Berlin' },
  4: { name: 'Straßenbräu Ausschank 2', address: 'Görlitzer Str. 52, 10997 Berlin' },
};

export function venueForGame(number) {
  return VENUES[number] || VENUES.default;
}

// Parses the "game" field submitted by the registration form,
// e.g. "17.09.2026, 19:00 — Игра #2: 90е и 00е"
export function parseGameField(value) {
  const m = GAME_RE.exec(String(value || '').trim());
  if (!m) return null;
  const [, dd, mm, yyyy, hh, min, num, name] = m;
  return {
    dateStr: `${yyyy}-${mm}-${dd}`,
    time: `${hh}:${min}`,
    number: Number(num),
    name: name.trim(),
    dateLabel: `${dd}.${mm}.${yyyy}`,
  };
}

export function berlinTodayStr(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(now);
}

function toUtcDays(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Date.UTC(y, m - 1, d) / 86400000;
}

export function daysUntil(gameDateStr, todayStr) {
  return toUtcDays(gameDateStr) - toUtcDays(todayStr);
}

export function isReminderDue(gameDateStr, todayStr, leadDays = 2) {
  return daysUntil(gameDateStr, todayStr) === leadDays;
}

function isSpamSubmission(sub) {
  return Boolean(sub?.data?.botcheck) || sub?.state === 'spam';
}

// Given raw Netlify Forms submissions and "now", returns the list of
// submissions that should get a reminder email today.
export function selectDueSubmissions(submissions, now = new Date(), leadDays = 2) {
  const today = berlinTodayStr(now);
  const due = [];
  for (const sub of submissions || []) {
    if (isSpamSubmission(sub)) continue;
    const data = sub.data || {};
    if (!data.email) continue;
    const game = parseGameField(data.game);
    if (!game) continue;
    if (!isReminderDue(game.dateStr, today, leadDays)) continue;
    due.push({ submission: sub, data, game });
  }
  return due;
}
