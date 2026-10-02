import { env } from 'cloudflare:workers';
export function database() {
 if (!env.DB) throw new Error('Missing database');
 return env.DB;
}
