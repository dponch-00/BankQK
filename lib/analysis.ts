import { totals, type Movement, type MovementType } from './money.ts';
export function shiftMonth(month: string, delta: number) {
 const date = new Date(month+'-01T12:00:00Z'); date.setUTCMonth(date.getUTCMonth()+delta);
 return date.toISOString().slice(0,7);
}
export function distribution(rows: Movement[], type: MovementType) {
 const grouped = new Map<string,number>();
 rows.filter(r=>r.type===type).forEach(r=>grouped.set(r.category,(grouped.get(r.category)||0)+r.cents));
 const total = [...grouped.values()].reduce((a,b)=>a+b,0);
 return [...grouped.entries()].map(([name,cents])=>({name,cents,value:cents/100,percent:total?cents/total*100:0})).sort((a,b)=>b.cents-a.cents);
}
export function dailyTrend(rows: Movement[], month: string, asOf?: string) {
 const selected = rows.filter(r=>r.date.startsWith(month));
 const monthDays = new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate();
 const count = asOf?.startsWith(month) ? Math.max(Number(asOf.slice(8,10)),...selected.map(r=>Number(r.date.slice(8,10)))) : monthDays;
 let net = 0;
 return Array.from({length:count},(_,i)=>{
  const date=month+'-'+String(i+1).padStart(2,'0');
  const sum=totals(selected.filter(r=>r.date===date));net+=sum.income-sum.expense;
  return {day:String(i+1),income:sum.income/100,expense:sum.expense/100,net:net/100};
 });
}
export function monthlyTrend(rows: Movement[], month: string) {
 return Array.from({length:6},(_,i)=>{
  const key=shiftMonth(month,i-5), sum=totals(rows.filter(r=>r.date.startsWith(key)));
  return {month:key,label:new Date(key+'-01T12:00:00Z').toLocaleDateString('es-MX',{month:'short',timeZone:'UTC'}),income:sum.income/100,expense:sum.expense/100,net:(sum.income-sum.expense)/100};
 });
}
