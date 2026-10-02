export type Movement={id:string;type:'expense'|'income';cents:number;category:string;note:string;date:string;created?:string};
export const expenseCategories=['Casa','Medicinas','Trabajo','Gustos','Niños','Otros'];
export const incomeCategories=['Consultas','Cirugías','Otros'];
export type MovementType = 'expense' | 'income';
export type Category = { type: MovementType; name: string };
export const defaults = (type: MovementType) => type === 'expense' ? expenseCategories : incomeCategories;
export function cleanCategory(value: unknown): string | null {
 if (typeof value !== 'string') return null;
 const name = value.normalize('NFKC').trim().replace(/\s+/g,' ');
 return name.length > 0 && name.length <= 40 && !/[\x00-\x1f\x7f<>]/.test(name) ? name : null;
}
export function categoryKey(name: string) { return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es-MX'); }
export function parseCents(value:string):number|null {const v=value.trim().replace(',','.');if(!/^\d{1,9}(\.\d{1,2})?$/.test(v))return null;const [a,b='']=v.split('.');const n=Number(a)*100+Number(b.padEnd(2,'0'));return n>0&&n<=99999999999?n:null;}
export function validDate(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T12:00:00Z');return !Number.isNaN(+d)&&d.toISOString().slice(0,10)===value&&value>='1900-01-01'&&value<='2100-12-31';}
export function validateMovement(x:unknown):Movement|null{if(!x||typeof x!=='object')return null;const m=x as Movement;return typeof m.id==='string'&&/^[0-9a-f-]{36}$/.test(m.id)&&(m.type==='expense'||m.type==='income')&&Number.isSafeInteger(m.cents)&&m.cents>0&&m.cents<=99999999999&&cleanCategory(m.category)===m.category&&typeof m.note==='string'&&m.note.length<=160&&typeof m.date==='string'&&validDate(m.date)?m:null;}
export function totals(rows:Movement[]){return rows.reduce((a,m)=>{a[m.type]+=m.cents;return a;},{income:0,expense:0});}
