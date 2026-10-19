import { getStore } from '@netlify/blobs';
export const config = { path: '/api/tmp-test-invite' };
const to = 'bikmetova.ania@gmail.com';
const registerUrl = 'https://allmusicquiz.com/#register';

const html = `
<div style="background:#f4f2fb; padding:24px 12px; font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden;">
    <div style="background:#181454; padding:28px 24px; text-align:center;">
      <div style="color:#ffd83e; font-size:14px; letter-spacing:2px; font-weight:bold;">ALL MUSIC QUIZ BERLIN</div>
      <div style="color:#ffffff; font-size:30px; font-weight:bold; margin-top:10px; line-height:1.15;">Halloween Music Party 🎃</div>
      <div style="color:#ffb3d9; font-size:16px; margin-top:8px;">Музыкальный квиз в страшно хорошем настроении</div>
    </div>
    <div style="padding:26px 24px; color:#181454; font-size:16px; line-height:1.55;">
      <p style="margin:0 0 14px;">Привет! Приглашаем тебя и твою команду на новую игру All Music Quiz Berlin.</p>
      <table style="width:100%; border-collapse:collapse; margin:18px 0; font-size:16px;">
        <tr><td style="padding:8px 0; color:#7a77a8; width:110px;">Когда</td><td style="padding:8px 0;"><strong>Четверг, 29 октября, 19:00</strong></td></tr>
        <tr><td style="padding:8px 0; color:#7a77a8;">Где</td><td style="padding:8px 0;"><strong>The Castle Berlin Mitte</strong><br>Invalidenstraße 129, 10115 Berlin</td></tr>
        <tr><td style="padding:8px 0; color:#7a77a8;">Формат</td><td style="padding:8px 0;">7 музыкальных раундов, команды от 2 до 10 человек</td></tr>
        <tr><td style="padding:8px 0; color:#7a77a8;">Участие</td><td style="padding:8px 0;">15 € с человека, оплата на месте</td></tr>
      </table>
      <p style="margin:0 0 6px;">Призы от организаторов и партнёров, а ещё наш Лудотрон 🎰 — случайный розыгрыш среди всех участников.</p>
      <p style="margin:0 0 22px;">Места ограничены, так что лучше записаться заранее.</p>
      <div style="text-align:center; margin:26px 0;">
        <a href="${registerUrl}" style="display:inline-block; background:#ff4fa3; color:#181454; text-decoration:none; font-weight:bold; font-size:18px; padding:14px 34px; border-radius:999px;">Записать команду</a>
      </div>
      <p style="margin:0; font-size:14px; color:#5b5890;">Instagram: <a href="https://instagram.com/allmusicquiz_berlin" style="color:#ff4fa3;">@allmusicquiz_berlin</a></p>
    </div>
    <div style="background:#f4f2fb; padding:16px 24px; color:#7a77a8; font-size:12px; line-height:1.5;">
      Вы получили это письмо, потому что регистрировались на игры All Music Quiz Berlin.<br>
      <strong>[Здесь будет ссылка «Отписаться» — в боевой рассылке она обязательна]</strong><br>
      All Music Quiz Berlin · Danil Lappo · Konrad-Zuse-Str. 17, 12489 Berlin · danlappo@yahoo.com
    </div>
  </div>
</div>`;

const text = [
  'ALL MUSIC QUIZ BERLIN — Halloween Music Party',
  '',
  'Привет! Приглашаем тебя и твою команду на новую игру.',
  '',
  'Когда: четверг, 29 октября, 19:00',
  'Где: The Castle Berlin Mitte, Invalidenstraße 129, 10115 Berlin',
  'Формат: 7 музыкальных раундов, команды от 2 до 10 человек',
  'Участие: 15 € с человека, оплата на месте',
  '',
  'Призы от организаторов и партнёров, а также Лудотрон — случайный розыгрыш среди всех участников.',
  'Места ограничены — запишись заранее: ' + registerUrl,
  '',
  'Instagram: @allmusicquiz_berlin',
  '',
  '[Здесь будет ссылка «Отписаться»]',
  'All Music Quiz Berlin · Danil Lappo · Konrad-Zuse-Str. 17, 12489 Berlin',
].join('\n');
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
