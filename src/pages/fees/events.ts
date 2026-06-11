export const prerender = false;
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getBurns } from '../../lib/fees';
const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
export const GET: APIRoute = async () => {
  try { return new Response(JSON.stringify(await getBurns(env as any)), { headers }); }
  catch { return new Response('[]', { headers }); }
};
