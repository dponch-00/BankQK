import { database } from '../../../db/raw';
import { getChatGPTUser } from '../../chatgpt-auth';
import { validateMovement, defaults } from '../../../lib/money';
export const dynamic = 'force-dynamic';
const json = (data: unknown,status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET() {
 const user=await getChatGPTUser(); if(!user)return json({error:'Inicia sesión para ver tus movimientos.'},401);
 try { const r=await database().prepare('SELECT id,type,cents,category,note,date,created FROM movements WHERE owner=? ORDER BY date DESC,created DESC').bind(user.userId).all(); return json(r.results); }
 catch(e) {console.error(e);return json({error:'No pudimos cargar tus movimientos. Intenta otra vez.'},503);}
}
export async function POST(request: Request) {
 const user=await getChatGPTUser(); if(!user)return json({error:'Inicia sesión para guardar.'},401);
 if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origen no permitido.'},403);
 let item; try {item=validateMovement(await request.json());}catch{return json({error:'Revisa el monto y la fecha.'},400);}
 if(!item)return json({error:'Revisa el monto y la fecha.'},400);
 try {
  const custom = defaults(item.type).includes(item.category) || await database().prepare('SELECT name FROM categories WHERE owner=? AND type=? AND name=?').bind(user.userId,item.type,item.category).first() || await database().prepare('SELECT id FROM movements WHERE id=? AND owner=? AND type=? AND category=?').bind(item.id,user.userId,item.type,item.category).first();
  if (!custom) return json({error:'Selecciona una categoría o crea una nueva.'},400);
  const result = await database().prepare('INSERT INTO movements (id,owner,type,cents,category,note,date,created) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET type=excluded.type,cents=excluded.cents,category=excluded.category,note=excluded.note,date=excluded.date WHERE movements.owner=excluded.owner').bind(item.id,user.userId,item.type,item.cents,item.category,item.note,item.date,new Date().toISOString()).run();
  if (!result.meta.changes) return json({error:'No pudimos guardar este movimiento.'},409);
  return json({ok:true});
 }
 catch(e){console.error(e);return json({error:'No se guardó. Conservamos lo que escribiste para que puedas reintentar.'},503);}
}
export async function DELETE(request: Request) {
 const user=await getChatGPTUser();if(!user)return json({error:'Inicia sesión.'},401);
 if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origen no permitido.'},403);
 const id=new URL(request.url).searchParams.get('id');if(!id)return json({error:'Falta el movimiento.'},400);
 try {await database().prepare('DELETE FROM movements WHERE id=? AND owner=?').bind(id,user.userId).run();return json({ok:true});}catch(e){console.error(e);return json({error:'No pudimos eliminarlo. Intenta otra vez.'},503);}
}
