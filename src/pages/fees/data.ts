export const prerender = false;
import type { APIRoute } from 'astro';
import { getData } from '../../lib/fees';

const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };

// CORS + security headers are added in src/middleware.ts
export const GET: APIRoute = async () => {
  try {
    const d: any = await getData();
    if (d && typeof d === 'object') delete d.dexErr;
    return new Response(JSON.stringify(d), { headers });
  } catch {
    return new Response(JSON.stringify({ error: 'upstream_unavailable' }), { status: 502, headers });
  }
};
