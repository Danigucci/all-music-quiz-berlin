// The registration form submits the selected <option value>, e.g.
// "26.11.2026, 19:00 — Музыка в кино" (older/other variants may carry an "Игра #N:" prefix).
const GAME_RE = /(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}):(\d{2})\s*[—–-]\s*(?:Игра\s*#(\d+):?\s*)?(.*)$/u;

const THE_CASTLE = { name: 'The Castle Berlin Mitte', address: 'Invalidenstraße 129, 10115 Berlin' };
const STRASSENBRAEU = { name: 'Straßenbräu Ausschank 2', address: 'Görlitzer Str. 52, 10997 Berlin' };
const BELUSHIS = { name: "Belushi's Berlin (Mitte)", address: '' };

// Keep in sync with the schedule in index.html. Keyed by game date (YYYY-MM-DD).
export const SCHEDULE = {
  '2026-10-15': { number: 4, venue: STRASSENBRAEU },
  '2026-10-29': { number: 5, venue: THE_CASTLE },
  '2026-11-12': { number: 6, venue: THE_CASTLE },
  '2026-11-26': { number: 7, venue: BELUSHIS },
  '2026-12-10': { number: 8, venue: THE_CASTLE },
  '2026-12-22': { number: 9, venue: BELUSHIS },
  '2026-12-29': { number: 10, venue: THE_CASTLE },
};

export function venueForGame(game) {
  return SCHEDULE[game?.dateStr]?.venue || THE_CASTLE;
}

export function parseGameField(value) {
  const m = GAME_RE.exec(String(value || '').trim());
  if (!m) return null;
  const [, dd, mm, yyyy, hh, min, num, rawName] = m;
  const dateStr = `${yyyy}-${mm}-${dd}`;
  return {
    dateStr,
    time: `${hh}:${min}`,
    number: num ? Number(num) : (SCHEDULE[dateStr]?.number ?? null),
    name: rawName.replace(/\s*\((?:резерв|мест нет[^)]*|регистрация закрыта)\)\s*$/iu, '').trim(),
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
