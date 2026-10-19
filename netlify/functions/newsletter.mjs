import { getStore } from '@netlify/blobs';
import { handleNewsletter } from '../lib/newsletter-core.mjs';

async function listRegistrantEmails(siteId) {
  const token = process.env.NETLIFY_FORMS_TOKEN;
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  const forms = await (await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, auth)).json();
  const form = forms.find((f) => f.name === 'registration');
  if (!form) throw new Error('registration form not found');
  const emails = [];
  for (let page = 1; ; page += 1) {
    const res = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions?per_page=100&page=${page}`, auth);
    if (!res.ok) throw new Error(`Netlify API ${res.status}`);
    const batch = await res.json();
    for (const sub of batch) {
      if (sub?.data?.botcheck || sub?.state === 'spam' || !sub?.data?.email) continue;
      emails.push(sub.data.email);
    }
    if (batch.length < 100) break;
  }
  return emails;
}

export const config = { path: '/api/newsletter/*' };

export default async (req, context) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/newsletter\/?/, '');
  let body = {};
  if (req.method === 'POST') {
    try { body = await req.json(); } catch { body = {}; }
  }
  const out = await handleNewsletter(
    { route, method: req.method, query: Object.fromEntries(url.searchParams), password: req.headers.get('x-admin-password') || '', body },
    getStore({ name: 'newsletter', consistency: 'strong' }),
    { apiKey: process.env.RESEND_API_KEY, adminPassword: process.env.RAFFLE_ADMIN_PASSWORD, listRegistrantEmails: () => listRegistrantEmails(context.site.id) }
  );
  const headers = { 'cache-control': 'no-store' };
  if (out.html) return new Response(out.html, { status: out.status, headers: { ...headers, 'content-type': 'text/html; charset=utf-8' } });
  return new Response(JSON.stringify(out.json), { status: out.status, headers: { ...headers, 'content-type': 'application/json' } });
};
