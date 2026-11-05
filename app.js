// AE Study app: tabs, theme, Postgres (PGlite) runner, practice, courses, drills, jobs.
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS = (k, d = {}) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } };
const SV = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const N = window.AENorm;
const PGLITE = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.15/dist/index.js';

/* ---------- theme ---------- */
const themeBtn = $('#theme');
const setTheme = t => { document.documentElement.dataset.theme = t; themeBtn.textContent = t === 'dark' ? '☀' : '☾'; };
setTheme(document.documentElement.dataset.theme);
themeBtn.onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('ae_theme', t); setTheme(t); };
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => { if (!localStorage.getItem('ae_theme')) setTheme(e.matches ? 'dark' : 'light'); });

/* ---------- Postgres engine ---------- */
let dbPromise = null;
function getDB() {
  if (!dbPromise) {
    const st = $('#dbstatus'); st.textContent = 'Postgres: loading…';
    dbPromise = import(PGLITE).then(async ({ PGlite }) => {
      const db = new PGlite({ parsers: N.parsers });
      await db.exec(window.SEED_SQL);
      const v = (await db.query("select current_setting('server_version') v")).rows[0].v;
      st.textContent = 'PostgreSQL ' + v.split(' ')[0] + ' ready'; st.classList.add('ready');
      return db;
    }).catch(e => { st.textContent = 'Postgres failed to load'; dbPromise = null; throw e; });
  }
  return dbPromise;
}
// Runs SQL inside a transaction that is always rolled back, so the sample data never changes.
async function runSQL(sql) {
  const db = await getDB();
  await db.exec('BEGIN');
  try {
    const rs = await db.exec(sql, { rowMode: 'array' });
    const last = [...rs].reverse().find(r => r.fields && r.fields.length) || rs[rs.length - 1] || { rows: [], fields: [] };
    return { rows: last.rows || [], fields: (last.fields || []).map(f => f.name), affected: last.affectedRows };
  } finally { try { await db.exec('ROLLBACK') } catch {} }
}
function gridHTML(r, max = 500) {
  if (!r.fields.length) return `<div class="msg info">Statement ran (no result set${r.affected != null ? ', ' + r.affected + ' rows affected' : ''}).</div>`;
  const rows = r.rows.slice(0, max);
  return `<div class="muted small">${r.rows.length} row${r.rows.length === 1 ? '' : 's'}${r.rows.length > max ? ' (showing ' + max + ')' : ''}</div>
  <div class="grid"><table><thead><tr>${r.fields.map(f => `<th>${esc(f)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(v => v === null ? '<td class="null">NULL</td>' : `<td>${esc(v instanceof Date ? v.toISOString().slice(0, 10) : v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function compare(r, expected, cols, ordered) {
  if (!r.fields.length) return { ok: false, why: 'Your query returned no result set.' };
  if (r.fields.length !== cols.length) return { ok: false, why: `Expected ${cols.length} column(s) (${cols.join(', ')}), got ${r.fields.length}.` };
  const got = N.normRows(r.rows, r.fields.map((_, i) => i), ordered);
  if (got.length !== expected.length) return { ok: false, why: `Expected ${expected.length} row(s), got ${got.length}.` };
  for (let i = 0; i < got.length; i++) if (got[i] !== expected[i]) return { ok: false, why: `Row ${i + 1} differs from the expected output${ordered ? ' (row order matters here)' : ''}.` };
  return { ok: true };
}
function expectedGrid(cols, expected) {
  return gridHTML({ fields: cols, rows: expected.map(s => s.split('\u241F').map(v => v === 'NULL' ? null : v)) });
}
// Editor helpers: Tab inserts spaces, Ctrl/Cmd+Enter runs.
function wireEditor(ta, onRun, onChange) {
  ta.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); onRun(); }
    else if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('  ', s, ta.selectionEnd, 'end'); onChange && onChange(); }
  });
  if (onChange) ta.addEventListener('input', onChange);
}

/* ---------- state ---------- */
const sql = LS('ae_sql'), lessonsDone = LS('ae_lessons'), drillsSt = LS('ae_drills'), ms = LS('ae_ms');
const saveSql = () => { SV('ae_sql', sql); refreshCounts(); };
const S = id => sql[id] || (sql[id] = {});
const today = () => new Date().toLocaleDateString('en-CA');
const addDays = n => new Date(Date.now() + n * 864e5).toLocaleDateString('en-CA');
const IV = [1, 2, 4, 8, 16, 32, 64];
const dueList = () => PROBLEMS.filter(p => sql[p.id]?.due && sql[p.id].due <= today());
const ALL_LESSONS = LESSONS.flatMap(m => m.lessons.map(l => ({ ...l, mod: m.title })));

function refreshCounts() {
  const solved = PROBLEMS.filter(p => sql[p.id]?.done).length, due = dueList().length;
  $('#t-due').textContent = due; $('#dueN').textContent = due ? `(${due})` : '';
  $('#t-solved').textContent = `${solved}/${PROBLEMS.length}`;
  $('#t-lessons').textContent = `${ALL_LESSONS.filter(l => lessonsDone[l.id]).length}/${ALL_LESSONS.length}`;
  $('#t-drills').textContent = `${DRILLS.filter((d, i) => drillsSt[i]).length}/${DRILLS.length}`;
  const nextP = PROBLEMS.find(p => !sql[p.id]?.done); $('#t-next-p').href = nextP ? '#practice/' + nextP.id : '#practice';
  $('#t-due-go').href = due ? '#practice/' + dueList()[0].id : '#practice';
  const nextL = ALL_LESSONS.find(l => !lessonsDone[l.id]); $('#t-next-l').href = '#courses/' + (nextL || ALL_LESSONS[0]).id;
}

/* ---------- router (tabs in URL hash) ---------- */
const TABS = ['plan', 'practice', 'courses', 'drills', 'jobs'];
function route() {
  const [tab0, sub] = location.hash.replace(/^#/, '').split('/');
  const tab = TABS.includes(tab0) ? tab0 : (localStorage.getItem('ae_tab') || 'plan');
  if (!TABS.includes(tab0)) { history.replaceState(null, '', '#' + tab + (tab === 'courses' && localStorage.getItem('ae_lesson') ? '/' + localStorage.getItem('ae_lesson') : '')); return route(); }
  localStorage.setItem('ae_tab', tab);
  TABS.forEach(t => { $('#tab-' + t).hidden = t !== tab; });
  $$('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
  if (tab === 'practice') { if (sub === 'schema') showSchema(); else if (sub) showProblem(sub); else showList(); }
  if (tab === 'courses') showLesson(sub || localStorage.getItem('ae_lesson') || ALL_LESSONS[0].id);
  if (tab === 'practice' || tab === 'courses') getDB().catch(() => {});
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

/* ---------- plan ---------- */
$('#phases').innerHTML = PHASES.map((p, i) => `<details class="phase" ${i === 0 ? 'open' : ''}><summary><span>${esc(p.when)} · ${esc(p.title)}</span><span class="muted small" id="phc-${i}"></span></summary><div>
  <p class="muted">${esc(p.goal)}</p><h4>Milestones</h4><ul class="ms">${p.ms.map((m, j) => `<li><input type="checkbox" id="ms-${i}-${j}" data-k="${i}-${j}" ${ms[i + '-' + j] ? 'checked' : ''}><label for="ms-${i}-${j}">${m}</label></li>`).join('')}</ul>
  <h4>Topics</h4><ul>${p.topics.map(t => `<li>${t}</li>`).join('')}</ul><p><b>Deliverable:</b> ${p.proj.replace(/^<b>[^<]*<\/b>\s*/, '')}</p></div></details>`).join('');
const phaseCounts = () => PHASES.forEach((p, i) => { $('#phc-' + i).textContent = `${p.ms.filter((_, j) => ms[i + '-' + j]).length}/${p.ms.length}`; });
$('#phases').addEventListener('change', e => { const k = e.target.dataset.k; if (k) { ms[k] = e.target.checked; SV('ae_ms', ms); phaseCounts(); } });
phaseCounts();
$('#habits').innerHTML = HABITS.map(h => `<div class="card"><b>${h[0]}</b><div class="muted small">${h[1]}</div></div>`).join('');
$('#res').innerHTML = RESOURCES.map(r => `<li><a href="${r[1]}" target="_blank" rel="noopener">${r[0]}</a></li>`).join('');

/* ---------- practice list ---------- */
let pview = 'all';
const topics = [...new Set(PROBLEMS.map(p => p.topic))].sort();
$('#ptopic').innerHTML += topics.map(t => `<option>${t}</option>`).join('');
const statusOf = p => { const s = sql[p.id] || {}; return s.done ? 'done' : (s.tried ? 'tried' : 'todo'); };
const TIER = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
function filteredProblems() {
  const q = $('#pq').value.toLowerCase(), t = $('#ptier').value, tp = $('#ptopic').value, ss = $('#pstat').value;
  let L = pview === 'review' ? dueList() : pview === 'flag' ? PROBLEMS.filter(p => sql[p.id]?.flag) : PROBLEMS;
  return L.filter(p => (!q || p.title.toLowerCase().includes(q)) && (!t || p.tier === t) && (!tp || p.topic === tp) && (!ss || statusOf(p) === ss));
}
function renderList() {
  const L = filteredProblems();
  $('#pcount').textContent = `${L.length} problem${L.length === 1 ? '' : 's'}`;
  $('#ptbody').innerHTML = L.length ? L.map(p => { const s = sql[p.id] || {}, st = statusOf(p), n = PROBLEMS.indexOf(p) + 1;
    return `<tr data-p="${p.id}"><td>${n}</td><td><a href="#practice/${p.id}">${esc(p.title)}</a>${s.flag ? '<span class="tag">flagged</span>' : ''}${s.due && s.due <= today() ? '<span class="tag">review due</span>' : ''}</td>
    <td class="d-${p.tier}">${TIER[p.tier]}</td><td>${esc(p.topic)}</td><td class="st-${st}">${st === 'done' ? '✓ Solved' : st === 'tried' ? 'Attempted' : '—'}</td></tr>`; }).join('')
    : `<tr><td colspan="5" class="muted">${pview === 'review' ? 'Nothing due for review today.' : 'No problems match.'}</td></tr>`;
  const w = {}; PROBLEMS.forEach(p => { const f = sql[p.id]?.forgot || 0; if (f) w[p.topic] = (w[p.topic] || 0) + f; });
  $('#weak').innerHTML = '<b>Weak topics</b> <span class="muted">(from “Forgot” ratings)</span>: ' + (Object.keys(w).length ? Object.entries(w).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${esc(t)} ×${n}`).join(', ') : '<span class="muted">none yet</span>');
}
function showList() { $('#p-listview').hidden = false; $('#p-probview').hidden = true; $('#p-schemaview').hidden = true; renderList(); }
$('#ptbody').addEventListener('click', e => { const tr = e.target.closest('tr[data-p]'); if (tr && e.target.tagName !== 'A') location.hash = 'practice/' + tr.dataset.p; });
['#pq', '#ptier', '#ptopic', '#pstat'].forEach(s => $(s).addEventListener('input', renderList));
$('#pview').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; pview = b.dataset.v; $$('#pview button').forEach(x => x.classList.toggle('on', x === b)); renderList(); });

/* ---------- schema rendering ---------- */
function tableCard(t, open) {
  const T = SCHEMA[t];
  return `<div class="tbl"><div class="th"><span>Table: <code>${t}</code></span><span class="muted small">${T.rows} rows</span></div>
  <div class="cols">${T.cols.map(([c, ty]) => `<span><b>${c}</b> <i>${ty.replace('character varying', 'varchar')}</i></span>`).join('')}</div>
  <details ${open ? 'open' : ''}><summary>Sample rows</summary><div class="grid"><table><thead><tr>${T.cols.map(c => `<th>${c[0]}</th>`).join('')}</tr></thead><tbody>${T.sample.map(r => `<tr>${r.map(v => v === null ? '<td class="null">NULL</td>' : `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details></div>`;
}
function showSchema() {
  $('#p-listview').hidden = true; $('#p-probview').hidden = true; const v = $('#p-schemaview'); v.hidden = false;
  v.innerHTML = `<div class="crumbs"><a href="#practice">← All problems</a></div><h2>Tables</h2><p class="muted">Insurance: customers, policies, claims, quotes. General business: users, orders, events, employees, logins. PostgreSQL types shown next to each column.</p>` + Object.keys(SCHEMA).map(t => tableCard(t, true)).join('');
}

/* ---------- problem view ---------- */
function showProblem(id) {
  const p = PROBLEMS.find(x => x.id === id); if (!p) { location.hash = 'practice'; return; }
  $('#p-listview').hidden = true; $('#p-schemaview').hidden = true; const v = $('#p-probview'); v.hidden = false;
  const s = S(id), i = PROBLEMS.indexOf(p), prev = PROBLEMS[i - 1], next = PROBLEMS[i + 1];
  v.innerHTML = `<div class="crumbs"><a href="#practice">← All problems</a>
    <span class="row" style="margin:0"><a class="btn sm ghost" ${prev ? `href="#practice/${prev.id}"` : 'aria-disabled="true"'}>← Prev</a><a class="btn sm ghost" ${next ? `href="#practice/${next.id}"` : 'aria-disabled="true"'}>Next →</a></span></div>
  <div class="pv">
   <div class="pane q">
    <div class="muted small">#${i + 1} · <span class="d-${p.tier}">${TIER[p.tier]}</span> · ${esc(p.topic)}</div>
    <h2>${esc(p.title)}</h2>
    <p>${esc(p.prompt)}</p>
    <p class="small"><b>Tables used:</b> ${p.tables.map(t => `<code>${t}</code>`).join(', ')} · <b>Expected columns:</b> ${p.columns.map(c => `<code>${esc(c)}</code>`).join(', ')}${p.ordered ? ' · row order matters' : ''}</p>
    ${p.tables.map(t => tableCard(t, false)).join('')}
    <details><summary>Hint</summary><p>${esc(p.hint)}</p></details>
    <details><summary>Expected output</summary>${expectedGrid(p.columns, p.expected)}</details>
    <details id="solbox"><summary>Solution and explanation</summary><pre><code>${esc(p.solution)}</code></pre><p>${esc(p.explanation)}</p></details>
    ${p.similar ? `<p class="small">Similar: <a href="${p.similar.url}" target="_blank" rel="noopener">${esc(p.similar.title)}</a></p>` : ''}
   </div>
   <div class="pane">
    <textarea class="sql" id="sq" spellcheck="false" placeholder="-- PostgreSQL. Ctrl/Cmd+Enter to run.\nSELECT ...">${esc(s.draft || '')}</textarea>
    <div class="row"><button class="btn" id="run">Run</button><button class="btn" id="sub">Submit</button><button class="btn ghost sm" id="reset">Clear</button><span class="muted small">Ctrl/Cmd+Enter runs</span></div>
    <div id="msg"></div><div id="out"></div>
    <div class="card small" style="margin-top:14px">
      <div class="row" style="margin:0"><b>Status:</b> <span id="pst" class="st-${statusOf(p)}">${statusOf(p) === 'done' ? '✓ Solved' : statusOf(p) === 'tried' ? 'Attempted' : 'Unsolved'}</span>
      ${s.due ? `<span class="muted">· next review ${s.due}</span>` : ''}</div>
      <div class="row"><span class="muted">Rate your recall:</span><button class="btn sm ghost" id="got">Got it</button><button class="btn sm ghost" id="forgot">Forgot</button>
      <button class="btn sm ghost" id="fl">${s.flag ? 'Unflag' : 'Flag'}</button><button class="btn sm ghost" id="dn">${s.done ? 'Mark unsolved' : 'Mark solved'}</button></div>
      <div class="muted">“Got it” pushes the next review further out (1, 2, 4 … 64 days); “Forgot” brings it back tomorrow.</div>
    </div>
   </div>
  </div>`;
  const ta = $('#sq'), msg = $('#msg'), out = $('#out');
  const run = async () => {
    if (!ta.value.trim()) { msg.innerHTML = '<div class="msg info">Write a query first.</div>'; return null; }
    msg.innerHTML = '<div class="msg info">Running…</div>';
    try { const r = await runSQL(ta.value); msg.innerHTML = ''; out.innerHTML = gridHTML(r); return r; }
    catch (e) { msg.innerHTML = `<div class="msg bad">${esc(e.message)}</div>`; out.innerHTML = ''; return null; }
  };
  wireEditor(ta, run, () => { s.draft = ta.value; SV('ae_sql', sql); });
  $('#run').onclick = run;
  $('#sub').onclick = async () => {
    const r = await run(); s.tried = true; if (!r) { saveSql(); return; }
    const c = compare(r, p.expected, p.columns, p.ordered);
    if (c.ok) { msg.innerHTML = '<div class="msg ok">Accepted: your output matches the expected result.</div>'; if (!s.done) { s.done = true; s.box = 0; s.due = addDays(IV[0]); } $('#pst').textContent = '✓ Solved'; $('#pst').className = 'st-done'; }
    else msg.innerHTML = `<div class="msg bad">Wrong answer. ${esc(c.why)} Column names don't matter; numbers compare to 2 decimals.</div>`;
    saveSql();
  };
  $('#reset').onclick = () => { ta.value = ''; s.draft = ''; SV('ae_sql', sql); ta.focus(); };
  $('#dn').onclick = () => { s.done = !s.done; if (s.done && !s.due) { s.box = 0; s.due = addDays(1); } saveSql(); showProblem(id); };
  $('#fl').onclick = () => { s.flag = !s.flag; saveSql(); showProblem(id); };
  const afterRate = () => { saveSql(); const d = dueList().filter(x => x.id !== id); location.hash = 'practice/' + (pview === 'review' && d[0] ? d[0].id : (next || p).id); if ((next || p).id === id) showProblem(id); };
  $('#got').onclick = () => { s.box = Math.min((s.box ?? -1) + 1, IV.length - 1); s.due = addDays(IV[s.box]); s.done = true; afterRate(); };
  $('#forgot').onclick = () => { s.box = 0; s.due = addDays(1); s.forgot = (s.forgot || 0) + 1; afterRate(); };
}

/* ---------- courses ---------- */
function renderNav(cur) {
  const n = ALL_LESSONS.filter(l => lessonsDone[l.id]).length;
  $('#cnav').innerHTML = `<div class="muted small" style="margin:4px 6px">${n} of ${ALL_LESSONS.length} lessons done</div><div class="prog"><div style="width:${Math.round(n / ALL_LESSONS.length * 100)}%"></div></div>` +
    LESSONS.map(m => `<div class="mod">${esc(m.title)}</div>${m.lessons.map(l => `<a href="#courses/${l.id}" class="${l.id === cur ? 'on' : ''} ${lessonsDone[l.id] ? 'done' : ''}">${esc(l.title)}</a>`).join('')}`).join('');
}
function showLesson(id) {
  let i = ALL_LESSONS.findIndex(l => l.id === id); if (i < 0) i = 0; const l = ALL_LESSONS[i], prev = ALL_LESSONS[i - 1], next = ALL_LESSONS[i + 1];
  localStorage.setItem('ae_lesson', l.id); renderNav(l.id);
  const drafts = LS('ae_lesson_drafts');
  $('#cbody').innerHTML = `<div class="muted small">${esc(l.mod)} · Lesson ${i + 1} of ${ALL_LESSONS.length}</div><h2>${esc(l.title)}</h2>${l.body}
   <h3>Example <span class="muted small">(runnable, edit freely)</span></h3>
   <textarea class="sql" id="exq" spellcheck="false" style="min-height:140px">${esc(l.example)}</textarea>
   <div class="row"><button class="btn sm" id="exrun">Run</button><button class="btn sm ghost" id="exreset">Reset example</button></div><div id="exmsg"></div><div id="exout"></div>
   <h3>Practice</h3><p>${esc(l.prompt)}</p>
   <textarea class="sql" id="prq" spellcheck="false" style="min-height:140px" placeholder="-- your PostgreSQL answer">${esc(drafts[l.id] || '')}</textarea>
   <div class="row"><button class="btn sm" id="prrun">Run</button><button class="btn sm" id="prsub">Submit</button></div><div id="prmsg"></div><div id="prout"></div>
   <details><summary>Show solution</summary><pre><code>${esc(l.solution)}</code></pre></details>
   <div class="lnav"><a class="btn ghost" ${prev ? `href="#courses/${prev.id}"` : 'aria-disabled="true" style="visibility:hidden"'}>← ${prev ? esc(prev.title) : ''}</a>
   <button class="btn ${lessonsDone[l.id] ? 'ghost' : ''}" id="lmark">${lessonsDone[l.id] ? '✓ Completed (undo)' : 'Mark complete'}</button>
   <a class="btn ghost" ${next ? `href="#courses/${next.id}"` : 'aria-disabled="true" style="visibility:hidden"'}>${next ? esc(next.title) : ''} →</a></div>`;
  const mk = (taSel, msgSel, outSel) => async () => { const m = $(msgSel); m.innerHTML = '<div class="msg info">Running…</div>';
    try { const r = await runSQL($(taSel).value); m.innerHTML = ''; $(outSel).innerHTML = gridHTML(r); return r; } catch (e) { m.innerHTML = `<div class="msg bad">${esc(e.message)}</div>`; $(outSel).innerHTML = ''; return null; } };
  const exRun = mk('#exq', '#exmsg', '#exout'), prRun = mk('#prq', '#prmsg', '#prout');
  wireEditor($('#exq'), exRun); $('#exrun').onclick = exRun; $('#exreset').onclick = () => { $('#exq').value = l.example; };
  wireEditor($('#prq'), prRun, () => { const d = LS('ae_lesson_drafts'); d[l.id] = $('#prq').value; SV('ae_lesson_drafts', d); }); $('#prrun').onclick = prRun;
  $('#prsub').onclick = async () => { const r = await prRun(); if (!r) return; const c = compare(r, l.expected, l.columns, l.ordered);
    $('#prmsg').innerHTML = c.ok ? '<div class="msg ok">Correct. Lesson marked complete.</div>' : `<div class="msg bad">Not yet. ${esc(c.why)}</div>`;
    if (c.ok && !lessonsDone[l.id]) { lessonsDone[l.id] = true; SV('ae_lessons', lessonsDone); renderNav(l.id); refreshCounts(); $('#lmark').textContent = '✓ Completed (undo)'; $('#lmark').classList.add('ghost'); } };
  $('#lmark').onclick = () => { lessonsDone[l.id] = !lessonsDone[l.id]; SV('ae_lessons', lessonsDone); refreshCounts(); showLesson(l.id); };
}

/* ---------- drills ---------- */
const cats = ['All', ...new Set(DRILLS.map(d => d.cat))]; let dcat = 'All';
$('#dtabs').innerHTML = cats.map(c => `<button data-c="${esc(c)}" class="${c === dcat ? 'on' : ''}">${esc(c)}</button>`).join('');
function renderDrills() {
  $('#dlist').innerHTML = DRILLS.map((d, i) => [d, i]).filter(([d]) => dcat === 'All' || d.cat === dcat).map(([d, i]) => `<div class="card drill"><div class="cat">${esc(d.cat)}</div>
   <div class="row" style="justify-content:space-between;margin:2px 0"><b>${d.title}</b><button class="btn sm ${drillsSt[i] ? '' : 'ghost'}" data-mk="${i}">${drillsSt[i] ? '✓ Practiced' : 'Mark practiced'}</button></div>
   <div>${d.q}</div><textarea data-d="${i}" placeholder="Write your answer first…">${esc(drillsSt['a' + i] || '')}</textarea>
   <details><summary>Sample answer</summary>${d.a}</details></div>`).join('');
}
$('#dtabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; dcat = b.dataset.c; $$('#dtabs button').forEach(x => x.classList.toggle('on', x === b)); renderDrills(); };
$('#dlist').addEventListener('input', e => { if (e.target.dataset.d) { drillsSt['a' + e.target.dataset.d] = e.target.value; SV('ae_drills', drillsSt); } });
$('#dlist').addEventListener('click', e => { const i = e.target.dataset.mk; if (i !== undefined) { drillsSt[i] = !drillsSt[i]; SV('ae_drills', drillsSt); refreshCounts(); renderDrills(); } });
renderDrills();

/* ---------- jobs ---------- */
let JOBS = { jobs: [] }, jtab = 'ins';
const daysAgo = d => d ? Math.floor((Date.now() - new Date(d)) / 864e5) : 9999;
function renderJobs() {
  const q = $('#jq').value.toLowerCase(), loc = $('#jloc').value, age = +$('#jage').value, aeOnly = $('#jaeonly').checked, L = j => (j.location || '').toLowerCase();
  const list = JOBS.jobs.filter(j => (jtab === 'all' || (jtab === 'ins' ? j.insurance : j.role_type === 'Analytics Engineer'))
    && (!aeOnly || j.role_type === 'Analytics Engineer') && (!q || (j.title + j.company + j.location).toLowerCase().includes(q)) && (!age || daysAgo(j.posted) <= age)
    && (!loc || (loc === 'remote' ? (j.remote || L(j).includes('remote')) : loc === 'us' ? /united states|usa|\bus\b|, [a-z]{2}\b|new york|san francisco|remote - us|nyc|cambridge/.test(L(j)) : /uk|london|cardiff|france|paris|belgium|spain|poland|bulgaria|europe|germany|ireland/.test(L(j)))));
  $('#jlist').innerHTML = list.length ? list.map(j => `<tr><td><a href="${esc(j.url)}" target="_blank" rel="noopener">${esc(j.title)}</a>${j.role_type !== 'Analytics Engineer' ? '<span class="tag">adjacent</span>' : ''}${daysAgo(j.posted) <= 7 ? '<span class="tag">new</span>' : ''}</td>
    <td>${esc(j.company)}${j.insurance ? '<span class="tag">insurance</span>' : ''}</td><td>${esc(j.location || '—')}</td><td class="muted">${j.posted ? esc(j.posted) : 'n/a'}</td></tr>`).join('') : '<tr><td colspan="4" class="muted">No postings match these filters.</td></tr>';
}
function initJobs(d) { JOBS = d; $('#jmeta').textContent = `${d.count} postings (${d.insurance_count} insurance) from ${Object.keys(d.boards_found || {}).length} public job boards · updated ${new Date(d.generated).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`; renderJobs(); }
['#jq', '#jloc', '#jage', '#jaeonly'].forEach(s => $(s).addEventListener('input', renderJobs));
$('#jtabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; jtab = b.dataset.t; $$('#jtabs button').forEach(x => x.classList.toggle('on', x === b)); renderJobs(); });
fetch('jobs.json', { cache: 'no-store' }).then(r => r.json()).then(initJobs).catch(() => window.JOBS_FALLBACK && initJobs(window.JOBS_FALLBACK));

refreshCounts();
route();
window.__ae = { runSQL, compare, getDB };
