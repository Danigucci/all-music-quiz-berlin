const PLACE = "Kvartira 62, Lübbener Str. 18, 10997 Berlin-Bezirk Friedrichshain-Kreuzberg";
const CAL_LOCATION = "Kvartira 62, Lübbener Str. 18, 10997 Berlin";
const GAME_HOURS = 3; // length of the calendar event
const GAMES = {
  "07.10.26": { title: "Осенняя серия игр", time: "19:00", place: PLACE, price: "12 €", closeAt: "2026-10-07T18:00:00+02:00" },
  "18.11.26": { title: "День рождения квиза: нам ровно год!", time: "19:00", place: PLACE, price: "15 €", closeAt: "2026-11-18T19:00:00+01:00" },
  "15.12.26": { title: "Новогодний движ", time: "19:00", place: PLACE, price: "12 €", closeAt: "2026-12-15T19:00:00+01:00" },
};

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const data = await req.json();
    const { name, phone, email, team, message, gameDate } = data;
    // Unknown date (old page in a browser tab): fall back to the next game that is still open
    const nextOpen = Object.keys(GAMES).find((d) => !GAMES[d].closeAt || Date.now() < new Date(GAMES[d].closeAt).getTime()) || "15.12.26";
    const date = GAMES[gameDate] ? gameDate : nextOpen;
    const game = GAMES[date];

    if (game.closeAt && Date.now() >= new Date(game.closeAt).getTime()) {
      return new Response(JSON.stringify({ error: "Registration closed" }), { status: 410 });
    }

    if (!email || !name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = "Kaifzeit Quiz <noreply@kaifzeit.com>";
    const toEmail = (process.env.SPORT_TO_EMAIL || process.env.TO_EMAIL);

    if (!apiKey || !toEmail) {
      return new Response(JSON.stringify({ error: "Server email config missing" }), { status: 500 });
    }

    const html = `
      <h2>Новая заявка на регистрацию (${date})</h2>
      <p><strong>Имя:</strong> ${escapeHtml(name)}</p>
      ${phone ? `<p><strong>Телефон:</strong> ${escapeHtml(phone)}</p>` : ""}
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${team ? `<p><strong>Команда:</strong> ${escapeHtml(team)}</p>` : ""}
      ${message ? `<p><strong>Сообщение:</strong> ${escapeHtml(message)}</p>` : ""}
    `;

    const cal = calendarFor({
      date, time: game.time, title: `KAIFZEIT Sport — ${game.title}`, location: CAL_LOCATION,
      details: `Спортивный квиз KAIFZEIT. Вход: ${game.price} с человека. Команда: ${team || "—"}. https://kaifzeit.com/sport.html`,
    });

    const confirmationHtml = `
      <p>Привет!</p>
      <p>Вы зарегистрированы на игру <strong>«${game.title}»</strong>:</p>
      <p>
        📅 <strong>${date}</strong>, начало в <strong>${game.time}</strong><br>
        📍 ${game.place}<br>
        💶 Вход: <strong>${game.price}</strong> с человека<br>
        👥 Команда: <strong>${escapeHtml(team || "—")}</strong>
      </p>
      ${calendarBlock(cal.google)}
      <p>До встречи на игре!<br>KAIFZEIT Sport</p>
    `;

    const [adminRes, confirmRes] = await Promise.all([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmail,
          reply_to: email,
          subject: `Новая заявка (${date}): ${name}`,
          html,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: "Вы зарегистрированы — KAIFZEIT Sport ⚽",
          html: confirmationHtml,
          attachments: [{ filename: "kaifzeit-sport.ics", content: Buffer.from(cal.ics).toString("base64") }],
        }),
      }),
    ]);

    if (!adminRes.ok) {
      const errText = await adminRes.text();
      return new Response(JSON.stringify({ error: "Resend error (admin)", details: errText }), { status: 502 });
    }
    if (!confirmRes.ok) {
      const errText = await confirmRes.text();
      return new Response(JSON.stringify({ error: "Resend error (confirmation)", details: errText }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected error", details: String(err) }), { status: 500 });
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ---- "Add to calendar": Google Calendar link + .ics file (Apple Calendar, Outlook) ----
// date "16.12.26", time "19:00" (Berlin time)
function calendarFor({ date, time, title, location, details }) {
  const [d, m, y] = date.split(".");
  const [hh, mm] = time.split(":").map(Number);
  const pad = (n) => String(n).padStart(2, "0");
  const day = `20${y}${m}${d}`;
  const start = `${day}T${pad(hh)}${pad(mm)}00`;
  const endH = hh + GAME_HOURS;
  const end = endH < 24 ? `${day}T${pad(endH)}${pad(mm)}00` : `${day}T235900`;
  const google = "https://calendar.google.com/calendar/render?" + new URLSearchParams({
    action: "TEMPLATE", text: title, dates: `${start}/${end}`, ctz: "Europe/Berlin", details, location,
  }).toString();
  const esc = (t) => String(t).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//KAIFZEIT//Quiz//RU", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${start}-${Math.random().toString(36).slice(2)}@kaifzeit.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toUtc(start)}`,
    `DTEND:${toUtc(end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(location)}`,
    `DESCRIPTION:${esc(details)}`,
    "BEGIN:VALARM", "TRIGGER:-PT3H", "ACTION:DISPLAY", `DESCRIPTION:${esc(title)}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].map(fold).join("\r\n");
  return { google, ics };
}

function calendarBlock(googleUrl) {
  return `
      <p style="margin:20px 0;">
        <a href="${googleUrl}" style="display:inline-block;background:#c9ec9b;color:#101010;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:6px;">📅 Добавить в Google Календарь</a>
      </p>
      <p style="color:#666;font-size:13px;">Для Apple Календаря или Outlook открой файл <strong>kaifzeit-sport.ics</strong> во вложении к письму.</p>`;
}

// "20261216T190000" in Berlin time -> "20261216T180000Z"
function toUtc(local) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(local);
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  for (const offsetH of [1, 2]) {
    const t = new Date(asUtc - offsetH * 3600e3);
    const berlinHour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hour: "2-digit", hourCycle: "h23" }).format(t));
    if (berlinHour === +m[4]) return t.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  }
  return new Date(asUtc - 3600e3).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
}

// iCalendar lines must be at most 75 bytes; longer ones continue on the next line after a space
function fold(line) {
  const out = [];
  let cur = "";
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch) > (out.length ? 74 : 75)) { out.push(cur); cur = ""; }
    cur += ch;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export const config = { path: '/api/sport-register' };
