import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const base='http://127.0.0.1:5173';
const signin=await fetch(base+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});
const cookie=signin.headers.getSetCookie().map(s=>s.split(';')[0]).join('; ');
assert.ok(cookie,'Local sign-in cookie required');
const request=(path,method='GET',body)=>fetch(base+path,{method,headers:{cookie,'Content-Type':'application/json',origin:base},...(body?{body:JSON.stringify(body)}:{})});
const name='QA '+randomUUID().slice(0,8);
let createdCategory=false;
const id=randomUUID();
try{
 assert.equal((await fetch(base+'/api/categories')).status,401);
 const created=await request('/api/categories','POST',{type:'expense',name});assert.equal(created.status,201);createdCategory=true;
 assert.equal((await request('/api/categories','POST',{type:'expense',name:name.toUpperCase()})).status,409);
 assert.equal((await request('/api/categories','POST',{type:'income',name:'cirugias'})).status,409);
 const categories=await (await request('/api/categories')).json();assert.ok(categories.some(c=>c.name===name&&c.type==='expense'));
 const row={id,type:'expense',cents:12345,category:name,note:'[QA BanQK]',date:'2026-10-01'};
 assert.equal((await request('/api/movements','POST',row)).status,200);
 assert.equal((await request('/api/movements','POST',{...row,cents:23456})).status,200);
 const records=await (await request('/api/movements')).json();assert.equal(records.filter(r=>r.id===id).length,1);assert.equal(records.find(r=>r.id===id).cents,23456);
 assert.equal((await request('/api/movements','POST',{...row,category:'Categoría inexistente QA'})).status,400);
 assert.equal((await request('/api/movements','POST',{...row,cents:-100})).status,400);
 const unauth=await fetch(base+'/api/movements',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(row)});assert.equal(unauth.status,401);
 const cross=await fetch(base+'/api/categories',{method:'POST',headers:{cookie,'Content-Type':'application/json',origin:'https://example.com'},body:JSON.stringify({type:'expense',name:'Never'})});assert.equal(cross.status,403);
 console.log('API: categoría persistente, duplicados, guardar/editar sin duplicar, validación y autenticación: OK');
}finally{
 await request('/api/movements?id='+id,'DELETE');
 if(createdCategory){
 const cleanup=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state','--command',`DELETE FROM categories WHERE key = '${name.toLowerCase()}'`],{encoding:'utf8'});
 assert.equal(cleanup.status,0,'Cleanup of synthetic category failed');
 }
}
