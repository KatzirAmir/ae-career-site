import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
process.chdir(new URL('.', import.meta.url).pathname); await import('../norm.js');
const N=globalThis.AENorm;
const seed=fs.readFileSync('seed.sql','utf8');
const P=JSON.parse(fs.readFileSync('build/p.json','utf8'));
const db=new PGlite({parsers:N.parsers});
await db.exec(seed);
const tl=(await db.query(`select table_name from information_schema.tables where table_schema='public' order by 1`)).rows.map(r=>r.table_name);
const schema={};
for(const t of tl){
  const cols=(await db.query(`select column_name, data_type from information_schema.columns where table_name=$1 order by ordinal_position`,[t])).rows;
  const cnt=(await db.query(`select count(*)::int n from ${t}`)).rows[0].n;
  const sample=(await db.query(`select * from ${t} limit 5`)).rows.map(r=>cols.map(c=>N.cell(r[c.column_name])==='NULL'?null:String(r[c.column_name])));
  schema[t]={cols:cols.map(c=>[c.column_name,c.data_type]),rows:cnt,sample};
}
async function run(sql){await db.exec('BEGIN');try{const rs=await db.exec(sql);const r=rs[rs.length-1];return r}finally{await db.exec('ROLLBACK')}}
let bad=0;
for(const p of P){
  try{
    const r=await run(p.solution);
    p.columns=r.fields.map(f=>f.name);
    p.expected=N.normRows(r.rows,p.columns,p.ordered);
    p.tables=tl.filter(t=>new RegExp('\\b(from|join)\\s+'+t+'\\b','i').test(p.solution));
    if(!p.tables.length) throw new Error('no tables');
    console.log(p.id,p.tier,r.rows.length,p.tables.join(','),p.title);
  }catch(e){bad++;console.log('FAIL',p.id,p.title,e.message)}
}
const L=JSON.parse(fs.readFileSync('build/l.json','utf8'));
for(const m of L)for(const l of m.lessons){try{
  const ex=await run(l.example); if(!ex.fields.length) throw new Error('example no result');
  const r=await run(l.solution); l.columns=r.fields.map(f=>f.name); l.expected=N.normRows(r.rows,l.columns,l.ordered);
  console.log(l.id,'ex',ex.rows.length,'sol',r.rows.length,l.title)}catch(e){bad++;console.log('FAIL',l.id,e.message)}}
fs.writeFileSync('../lessons.js','window.LESSONS='+JSON.stringify(L)+';\n');
const ver=(await db.query('select version()')).rows[0].version;
console.log('failures',bad,ver);
fs.writeFileSync('../problems.js','window.SEED_SQL='+JSON.stringify(seed)+';\nwindow.SCHEMA='+JSON.stringify(schema)+';\nwindow.PROBLEMS='+JSON.stringify(P,null,0)+';\n');
