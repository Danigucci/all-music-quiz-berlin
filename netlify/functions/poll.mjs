import { getStore } from '@netlify/blobs';
import { createHash, timingSafeEqual } from 'node:crypto';
import { createPoll } from '../lib/poll-core.mjs';

export const config = { path: '/api/poll/*' };

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const digest = (s) => createHash('sha256').update(String(s)).digest();

// Same password as the live quiz host screen
function isAdmin(req) {
  const expected = process.env.LIVE_ADMIN_PASSWORD || process.env.RAFFLE_ADMIN_PASSWORD;
  if (!expected) return null;
  const given = req.headers.get('x-admin-password') || '';
  return timingSafeEqual(digest(given), digest(expected));
}

const readBody = async (req) => {
  try { return (await req.json()) || {}; } catch { return null; }
};

export default async (req) => {
  const poll = createPoll(getStore({ name: 'poll', consistency: 'strong' }));
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/poll\/?/, '');

  if (route === 'state' && req.method === 'GET') {
    return json(200, await poll.view(url.searchParams.get('pid') || ''));
  }

  if (route === 'vote' && req.method === 'POST') {
    const data = await readBody(req);
    if (!data) return json(400, { error: 'bad_request' });
    const { status, body } = await poll.vote(data);
    return json(status, body);
  }

  if (route.startsWith('admin/') && req.method === 'POST') {
    const auth = isAdmin(req);
    if (auth === null) return json(503, { error: 'admin_not_configured' });
    if (!auth) return json(401, { error: 'unauthorized' });

    const data = (await readBody(req)) || {};
    const action = route.slice('admin/'.length);
    if (action === 'status') return json(200, await poll.hostStatus());
    if (action === 'save') return json(200, await poll.saveDraft(data));
    if (action === 'open') return json(200, await poll.open(data));
    if (action === 'results') return json(200, await poll.showResults());
    if (action === 'pause') return json(200, await poll.pause());
    if (action === 'resume') return json(200, await poll.resume());
    if (action === 'close') return json(200, await poll.close());
  }

  return json(404, { error: 'not_found' });
};
