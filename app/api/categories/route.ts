import { database } from '../../../db/raw';
import { getChatGPTUser } from '../../chatgpt-auth';
import { categoryKey, cleanCategory, defaults } from '../../../lib/money';
export const dynamic = 'force-dynamic';
const json = (data: unknown, status = 200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET() {
 const user = await getChatGPTUser();
 if (!user) return json({error:'Inicia sesión.'},401);
 try {
  const result = await database().prepare('SELECT type,name FROM categories WHERE owner=? ORDER BY created,name').bind(user.userId).all();
  return json(result.results);
 } catch(e) { console.error(e); return json({error:'No pudimos cargar tus categorías.'},503); }
}
export async function POST(request: Request) {
 const user = await getChatGPTUser();
 if (!user) return json({error:'Inicia sesión.'},401);
 if (request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin) return json({error:'Origen no permitido.'},403);
 let value: {type?: unknown; name?: unknown};
 try { value = await request.json() as typeof value; } catch { return json({error:'Revisa la categoría.'},400); }
 if (!value || (value.type!=='expense'&&value.type!=='income')) return json({error:'Revisa la categoría.'},400);
 const name = cleanCategory(value.name);
 if (!name) return json({error:'Escribe un nombre de hasta 40 caracteres.'},400);
 const key = categoryKey(name);
 const duplicate = defaults(value.type).find(n=>categoryKey(n)===key);
 if (duplicate) return json({error:'Esta categoría ya existe.'},409);
 try {
  const result = await database().prepare('INSERT INTO categories (owner,type,key,name,created) VALUES (?,?,?,?,?) ON CONFLICT(owner,type,key) DO NOTHING').bind(user.userId,value.type,key,name,new Date().toISOString()).run();
  if (!result.meta.changes) return json({error:'Esta categoría ya existe.'},409);
  return json({type:value.type,name},201);
 } catch(e) { console.error(e);return json({error:'No se guardó la categoría. Reintenta.'},503); }
}
