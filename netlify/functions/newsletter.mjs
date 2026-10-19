import { getStore } from '@netlify/blobs';
import { handleNewsletter } from '../lib/newsletter-core.mjs';

export const config = { path: '/api/newsletter/*' };

export default async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/newsletter\/?/, '');
  let body = {};
  if (req.method === 'POST') {
    try { body = await req.json(); } catch { body = {}; }
  }
  const out = await handleNewsletter(
    { route, method: req.method, query: Object.fromEntries(url.searchParams), password: req.headers.get('x-admin-password') || '', body },
    getStore({ name: 'newsletter', consistency: 'strong' }),
    { apiKey: process.env.RESEND_API_KEY, adminPassword: process.env.RAFFLE_ADMIN_PASSWORD }
  );
  const headers = { 'cache-control': 'no-store' };
  if (out.html) return new Response(out.html, { status: out.status, headers: { ...headers, 'content-type': 'text/html; charset=utf-8' } });
  return new Response(JSON.stringify(out.json), { status: out.status, headers: { ...headers, 'content-type': 'application/json' } });
};
