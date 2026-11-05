const $=s=>document.querySelector(s), LS=k=>JSON.parse(localStorage.getItem(k)||'{}'), SV=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// Gameplan
const msDone=LS('ae_ms');
$('#phases').innerHTML=PHASES.map((p,i)=>`<div class="phase"><div class="when">${p.when}</div><h3>${p.title}</h3><p class="muted small">${p.goal}</p>
<h4>Milestones</h4><ul class="ms">${p.ms.map((m,j)=>`<li><input type="checkbox" data-k="${i}-${j}" ${msDone[i+'-'+j]?'checked':''}><span>${m}</span></li>`).join('')}</ul>
<h4>Topics</h4><ul>${p.topics.map(t=>`<li>${t}</li>`).join('')}</ul><div class="proj">${p.proj}</div></div>`).join('');
$('#phases').addEventListener('change',e=>{const k=e.target.dataset.k;if(!k)return;msDone[k]=e.target.checked;SV('ae_ms',msDone)});
$('#habits').innerHTML=HABITS.map(h=>`<div class="card"><b>${h[0]}</b><p class="muted small">${h[1]}</p></div>`).join('');
$('#res').innerHTML=RESOURCES.map(r=>`<a class="card" href="${r[1]}" target="_blank" rel="noopener">${r[0]} ↗<div class="muted small">${new URL(r[1]).host}</div></a>`).join('');
// Courses
const all=COURSES.flatMap(m=>m.lessons.map(l=>({...l,mod:m.title})));
let done=LS('ae_done'), cur=localStorage.getItem('ae_cur')||all[0].id;
function nav(){ $('#cnav').innerHTML=COURSES.map(m=>`<div class="mod"><b>${m.title}</b>${m.lessons.map(l=>`<a href="#courses" data-l="${l.id}" class="${l.id===cur?'on':''} ${done[l.id]?'done':''}">${l.title}</a>`).join('')}</div>`).join('');
  const n=all.filter(l=>done[l.id]).length, pct=Math.round(n/all.length*100);
  $('#pbar').style.width=pct+'%'; $('#ptext').textContent=`${n} of ${all.length} lessons complete (${pct}%) · ${COURSES.length} modules`; $('#st-prog').textContent=pct+'%'; }
function show(id){ cur=id; localStorage.setItem('ae_cur',id); const i=all.findIndex(l=>l.id===id), l=all[i];
  $('#cbody').innerHTML=`<p class="eyebrow">${l.mod}</p><h3>${l.title}</h3>${l.body}<h4>Exercises</h4>${l.ex.map((x,k)=>`<div class="ex"><p><b>Exercise ${k+1}.</b> ${x.q}</p><details><summary>Show solution</summary>${x.a}</details></div>`).join('')}
  <div class="lnav"><button class="btn ghost" ${i?'':'disabled'} data-go="${all[i-1]?.id||''}">← Prev</button><button class="btn" id="mark">${done[id]?'✓ Completed — undo':'Mark complete'}</button><button class="btn ghost" ${all[i+1]?'':'disabled'} data-go="${all[i+1]?.id||''}">Next →</button></div>`;
  nav(); }
document.addEventListener('click',e=>{const t=e.target; if(t.dataset.l){show(t.dataset.l)} if(t.dataset.go){show(t.dataset.go);$('#courses').scrollIntoView()}
  if(t.id==='mark'){done[cur]=!done[cur];SV('ae_done',done);show(cur)}});
show(cur);
// Jobs
let JOBS={jobs:[]}, tab='ins';
const daysAgo=d=>d?Math.floor((Date.now()-new Date(d))/864e5):9999;
function renderJobs(){ const q=$('#jq').value.toLowerCase(), loc=$('#jloc').value, age=+$('#jage').value, aeOnly=$('#jaeonly').checked;
  const L=j=>(j.location||'').toLowerCase();
  const list=JOBS.jobs.filter(j=>(tab==='all'||(tab==='ins'?j.insurance:j.role_type==='Analytics Engineer'))
    &&(!aeOnly||j.role_type==='Analytics Engineer')&&(!q||(j.title+j.company+j.location).toLowerCase().includes(q))
    &&(!age||daysAgo(j.posted)<=age)
    &&(!loc||(loc==='remote'?(j.remote||L(j).includes('remote')):loc==='us'?/united states|usa|\bus\b|, [a-z]{2}\b|new york|san francisco|remote - us|nyc|cambridge/.test(L(j)):/uk|london|cardiff|france|paris|belgium|spain|poland|bulgaria|europe|germany|ireland/.test(L(j)))));
  $('#jlist').innerHTML=list.length?list.map(j=>`<a class="job" href="${esc(j.url)}" target="_blank" rel="noopener"><div class="logo">${esc(j.company.trim()[0])}</div>
   <div><div class="t">${esc(j.title)}${j.insurance?'<span class="tag ins">Insurance</span>':''}${j.role_type!=='Analytics Engineer'?'<span class="tag">Adjacent</span>':''}${daysAgo(j.posted)<=7?'<span class="tag new">New</span>':''}</div>
   <div class="m">${esc(j.company)} · ${esc(j.location||'—')} · via ${esc(j.source)}</div></div><div class="date">${j.posted?esc(j.posted):'date n/a'}</div></a>`).join(''):'<p class="muted">No postings match these filters.</p>';
}
function initJobs(d){ JOBS=d; $('#st-jobs').textContent=d.count; $('#st-ins').textContent=d.insurance_count;
  $('#jmeta').innerHTML=`${d.count} real postings (${d.insurance_count} insurance) from ${Object.keys(d.boards_found||{}).length} public company job boards · updated ${new Date(d.generated).toLocaleString()}. Insurance tab includes adjacent data roles at insurers.`; renderJobs(); }
['#jq','#jloc','#jage','#jaeonly'].forEach(s=>$(s).addEventListener('input',renderJobs));
$('#jtabs').addEventListener('click',e=>{if(!e.target.dataset.t)return;tab=e.target.dataset.t;document.querySelectorAll('#jtabs button').forEach(b=>b.classList.toggle('on',b===e.target));renderJobs()});
fetch('jobs.json',{cache:'no-store'}).then(r=>r.json()).then(initJobs).catch(()=>window.JOBS_FALLBACK&&initJobs(window.JOBS_FALLBACK));
