(()=>{const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY='ae_sql', st=JSON.parse(localStorage.getItem(KEY)||'{}'), save=()=>{localStorage.setItem(KEY,JSON.stringify(st));stats()};
const today=()=>new Date().toISOString().slice(0,10), addDays=n=>new Date(Date.now()+n*864e5).toISOString().slice(0,10), IV=[1,2,4,8,16,32,64];
const S=id=>st[id]||(st[id]={}); let db=null, view='all', cur=localStorage.getItem('ae_sql_cur')||PROBLEMS[0].id;
const topics=[...new Set(PROBLEMS.map(p=>p.topic))].sort(); $('#ptopic').innerHTML+=topics.map(t=>`<option>${t}</option>`).join('');
const due=()=>PROBLEMS.filter(p=>st[p.id]?.due&&st[p.id].due<=today());
function stats(){ $('#st-sql').textContent=PROBLEMS.filter(p=>st[p.id]?.done).length+'/'+PROBLEMS.length; const d=due().length; $('#st-due').textContent=d; $('#dueN').textContent=d?`(${d})`:'';
  const w={}; PROBLEMS.forEach(p=>{const f=st[p.id]?.forgot||0; if(f) w[p.topic]=(w[p.topic]||0)+f});
  $('#weak').innerHTML=Object.keys(w).length?Object.entries(w).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`<span class="tag">${t} ×${n}</span>`).join(' '):'None yet. Use “Forgot” on problems you struggle with.'; }
function list(){ const t=$('#ptier').value, tp=$('#ptopic').value, ss=$('#pstat').value;
  let L=PROBLEMS.filter(p=>(!t||p.tier===t)&&(!tp||p.topic===tp)&&(!ss||(ss==='done')===!!st[p.id]?.done));
  if(view==='review') L=due(); if(view==='flag') L=PROBLEMS.filter(p=>st[p.id]?.flag);
  $('#pcount').textContent=L.length+' problems';
  $('#plist').innerHTML=L.length?L.map((p,i)=>`<div class="plist-item ${p.id===cur?'on':''}" data-p="${p.id}"><span class="tier ${p.tier}">${p.tier[0]}</span>${PROBLEMS.indexOf(p)+1}. ${esc(p.title)} ${st[p.id]?.done?'✓':''}${st[p.id]?.flag?' 🚩':''}</div>`).join(''):`<p class="muted small">${view==='review'?'Nothing due. 🎉':'No problems.'}</p>`; }
function table(r){ if(!r||!r.length) return '<p class="muted small">(no rows)</p>'; const x=r[0]; return `<table><tr>${x.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>${x.values.slice(0,200).map(v=>`<tr>${v.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>${x.values.length>200?'<p class="muted small">first 200 rows</p>':''}`; }
const norm=(r,ordered)=>{const rows=(r[0]?.values||[]).map(v=>v.map(c=>typeof c==='number'?Math.round(c*100)/100:c===null?'∅':String(c)).join('|')); return JSON.stringify(ordered?rows:rows.sort())};
function show(id){ cur=id; localStorage.setItem('ae_sql_cur',id); const p=PROBLEMS.find(x=>x.id===id), s=S(id), n=PROBLEMS.indexOf(p)+1;
  $('#pbody').innerHTML=`<p class="eyebrow"><span class="tier ${p.tier}">${p.tier}</span> · ${p.topic} · #${n}</p><h3>${esc(p.title)}</h3><p>${esc(p.prompt)}</p>
  <details><summary>💡 Hint</summary>${esc(p.hint)}</details>
  <textarea class="sql" id="sq" spellcheck="false" placeholder="-- write your SQL here (SQLite)">${esc(s.draft||'')}</textarea>
  <div class="row"><button class="btn sm" id="run">▶ Run (Ctrl+Enter)</button><button class="btn sm" id="chk">✓ Check vs expected</button><button class="btn sm ghost" id="exp">Show expected output</button></div>
  <div id="msg"></div><div class="res" id="out"></div>
  <details><summary>🔒 Solution &amp; explanation</summary><pre><code>${esc(p.solution.replace(/ (FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT JOIN|SELECT|WINDOW|UNION ALL|QUALIFY)\b/g,'\n$1').replace(/\), (\w+) AS \(/g,'),\n$1 AS ('))}</code></pre><p>${esc(p.explanation)}</p></details>
  <div class="row"><button class="btn sm ${s.done?'':'ghost'}" id="dn">${s.done?'✓ Done':'Mark done'}</button><button class="btn sm ghost" id="fl">${s.flag?'🚩 Flagged':'Flag for review'}</button>
  <button class="btn sm ghost" id="got">😀 Got it (review later)</button><button class="btn sm ghost" id="forgot">😵 Forgot (review soon)</button><span class="muted small">${s.due?'Next review: '+s.due:''}</span></div>`;
  const ta=$('#sq'); ta.oninput=()=>{s.draft=ta.value;save()}; ta.onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run()}};
  const run=()=>{ if(!db) return $('#msg').innerHTML='<p class="bad">SQL engine not loaded (offline?). You can still read the hints and solutions.</p>'; try{const r=db.exec(ta.value);$('#msg').innerHTML='';$('#out').innerHTML=table(r);return r}catch(e){$('#msg').innerHTML=`<p class="bad">${esc(e.message)}</p>`;$('#out').innerHTML='';return null} };
  $('#run').onclick=run; $('#exp').onclick=()=>{ if(db) $('#out').innerHTML='<p class="muted small">Expected:</p>'+table(db.exec(p.solution)) };
  $('#chk').onclick=()=>{ const r=run(); if(!r) return; const ok=norm(r,p.ordered)===norm(db.exec(p.solution),p.ordered);
    $('#msg').innerHTML=ok?'<p class="ok">✅ Correct: matches the expected output'+(p.ordered?' (including order)':'')+'.</p>':`<p class="bad">❌ Doesn't match yet. Compare with “Show expected output”${p.ordered?' (row order matters)':''}. Column names don't matter; numbers are compared to 2 dp.</p>`;
    if(ok&&!s.done){s.done=true;s.box=0;s.due=addDays(IV[0]);save();list()} };
  $('#dn').onclick=()=>{s.done=!s.done; if(s.done&&!s.due){s.box=0;s.due=addDays(1)} save();show(id);list()};
  $('#fl').onclick=()=>{s.flag=!s.flag;save();show(id);list()};
  $('#got').onclick=()=>{s.box=Math.min((s.box??-1)+1,IV.length-1);s.due=addDays(IV[s.box]);s.done=true;save();next(id)};
  $('#forgot').onclick=()=>{s.box=0;s.due=addDays(1);s.forgot=(s.forgot||0)+1;s.flag=true;save();next(id)};
  list(); }
function next(id){ const L=[...document.querySelectorAll('#plist [data-p]')].map(e=>e.dataset.p); list(); const i=L.indexOf(id); const nx=L[i+1]||L[0]; show(view==='review'&&due()[0]?due()[0].id:(nx||id)); }
function schema(){ const T=['policies','claims','quotes','customers','users','orders','events','employees','logins'];
  $('#plist').innerHTML=T.map(t=>`<div class="plist-item" data-t="${t}">${t}</div>`).join('');
  $('#pbody').innerHTML='<h3>Schema &amp; sample data</h3><p class="muted">Insurance tables: policies, claims, quotes, customers. General business tables: users, orders, events, employees, logins. Dates are ISO text (YYYY-MM-DD).</p>'+T.map(t=>`<h4 id="sch-${t}">${t}</h4>`+(db?`<p class="muted small">${db.exec(`SELECT COUNT(*) FROM ${t}`)[0].values[0][0]} rows · first 5:</p>`+table(db.exec(`SELECT * FROM ${t} LIMIT 5`)):'')).join('')+(db?'':`<pre><code>${esc(SEED_SQL.split('\n').filter(l=>l.startsWith('CREATE')).join('\n'))}</code></pre>`); }
document.addEventListener('click',e=>{const p=e.target.closest('[data-p]'); if(p&&p.closest('#plist')) show(p.dataset.p); const t=e.target.closest('[data-t]'); if(t&&t.closest('#plist')) document.getElementById('sch-'+t.dataset.t)?.scrollIntoView({behavior:'smooth',block:'center'});
  const v=e.target.closest('#ptabs button'); if(v){view=v.dataset.v;document.querySelectorAll('#ptabs button').forEach(b=>b.classList.toggle('on',b===v)); $('#pfilters').style.display=view==='all'?'':'none'; if(view==='schema') schema(); else { list(); const f=document.querySelector('#plist [data-p]'); if(f) show(f.dataset.p);} }});
['#ptier','#ptopic','#pstat'].forEach(s=>$(s).addEventListener('change',list));
stats(); list(); show(cur);
if(window.initSqlJs) initSqlJs({locateFile:f=>'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/'+f}).then(SQL=>{db=new SQL.Database();db.run(SEED_SQL);if(view==='schema')schema();else show(cur)}).catch(e=>console.error(e));
// Drills
const cats=['All',...new Set(DRILLS.map(d=>d.cat))]; let dc='All', dd=JSON.parse(localStorage.getItem('ae_drills')||'{}');
$('#dtabs').innerHTML=cats.map(c=>`<button data-c="${c}" class="${c===dc?'on':''}">${c}</button>`).join('');
function drills(){ $('#dlist').innerHTML=DRILLS.map((d,i)=>[d,i]).filter(([d])=>dc==='All'||d.cat===dc).map(([d,i])=>`<div class="card drill"><div class="cat">${d.cat}</div><b>${d.title}</b> ${dd[i]?'<span class="tag ins">practiced</span>':''}<div>${d.q}</div>
 <textarea class="sql" style="min-height:90px;margin-top:8px" data-d="${i}" placeholder="Write your answer first…">${esc(dd['a'+i]||'')}</textarea><details><summary>Sample answer</summary>${d.a}</details><button class="btn sm ghost" data-mk="${i}">${dd[i]?'✓ Practiced':'Mark practiced'}</button></div>`).join(''); }
$('#dtabs').onclick=e=>{if(!e.target.dataset.c)return;dc=e.target.dataset.c;document.querySelectorAll('#dtabs button').forEach(b=>b.classList.toggle('on',b===e.target));drills()};
$('#dlist').addEventListener('input',e=>{if(e.target.dataset.d){dd['a'+e.target.dataset.d]=e.target.value;localStorage.setItem('ae_drills',JSON.stringify(dd))}});
$('#dlist').addEventListener('click',e=>{const i=e.target.dataset.mk; if(i!==undefined){dd[i]=!dd[i];localStorage.setItem('ae_drills',JSON.stringify(dd));drills()}});
drills();})();
