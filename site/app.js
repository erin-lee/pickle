// ── Data layer ────────────────────────────────────────────────
const STORAGE_KEY = 'pickle-state-v1';

const SEED_GROUPS = [
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'transition', name: 'Transition' },
  { id: 'specials', name: 'Specials' },
  { id: 'serve', name: 'Serve' },
  { id: 'return', name: 'Return' },
  { id: 'drive', name: 'Drive' },
  { id: 'volleys', name: 'Volleys / Hands' },
  { id: 'footwork', name: 'Footwork / Positioning' },
];

const SEED_SHOTS = [
  { id: 'k1', groupId: 'kitchen', name: 'Cross-court dink', isGoal: false },
  { id: 'k2', groupId: 'kitchen', name: 'Speed-up dink', isGoal: false },
  { id: 'k3', groupId: 'kitchen', name: 'Dead dink / reset', isGoal: false },
  { id: 'k4', groupId: 'kitchen', name: 'Dink volley (out of air)', isGoal: false },
  { id: 't1', groupId: 'transition', name: 'Third shot drop', isGoal: true },
  { id: 't2', groupId: 'transition', name: 'Third shot drive', isGoal: false },
  { id: 't3', groupId: 'transition', name: 'Reset off a drive', isGoal: false },
  { id: 'sp1', groupId: 'specials', name: 'Offensive lob', isGoal: false },
  { id: 'sp2', groupId: 'specials', name: 'Erne', isGoal: false },
  { id: 'sp3', groupId: 'specials', name: 'ATP', isGoal: false },
  { id: 'sv1', groupId: 'serve', name: 'Deep serve', isGoal: false },
  { id: 'sv2', groupId: 'serve', name: 'Spin serve', isGoal: false },
  { id: 'sv3', groupId: 'serve', name: 'Body serve', isGoal: false },
  { id: 'sv4', groupId: 'serve', name: 'Short serve', isGoal: false },
  { id: 'r1', groupId: 'return', name: 'Deep return', isGoal: true },
  { id: 'r2', groupId: 'return', name: 'Short angle return', isGoal: false },
  { id: 'r3', groupId: 'return', name: 'Lob return', isGoal: false },
  { id: 'r4', groupId: 'return', name: 'Drive return', isGoal: false },
  { id: 'd1', groupId: 'drive', name: 'Forehand drive', isGoal: false },
  { id: 'd2', groupId: 'drive', name: 'Backhand drive', isGoal: false },
  { id: 'd3', groupId: 'drive', name: 'Two-handed backhand drive', isGoal: false },
  { id: 'v1', groupId: 'volleys', name: 'Punch volley', isGoal: false },
  { id: 'v2', groupId: 'volleys', name: 'Roll volley', isGoal: true },
  { id: 'v3', groupId: 'volleys', name: 'Reset volley', isGoal: false },
  { id: 'v4', groupId: 'volleys', name: 'Block volley', isGoal: false },
  { id: 'f1', groupId: 'footwork', name: 'Split-step timing', isGoal: false },
  { id: 'f2', groupId: 'footwork', name: 'Court recovery', isGoal: false },
  { id: 'f3', groupId: 'footwork', name: 'Ready position', isGoal: false },
];

function seedState() { return { groups: SEED_GROUPS, shots: SEED_SHOTS, sessions: [] }; }

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { const s = seedState(); saveState(s); return s; }
  try { return JSON.parse(raw); } catch (e) { const s = seedState(); saveState(s); return s; }
}
function saveState(state) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function resetState() { const s = seedState(); saveState(s); return s; }

function addSession(state, entries, note) {
  const sessionId = 'sess_' + Date.now();
  const session = {
    id: sessionId,
    date: new Date().toISOString().slice(0, 10),
    entries: entries.map((e, i) => ({ id: sessionId + '_' + i, sessionId, note: note || '', tags: [], ...e })),
  };
  state.sessions.push(session);
  saveState(state);
  return state;
}
function entriesForShot(state, shotId) {
  const out = [];
  state.sessions.forEach(s => s.entries.forEach(e => { if (e.shotId === shotId) out.push({ ...e, date: s.date }); }));
  return out;
}
function avgRating(entries) {
  if (!entries.length) return null;
  return Math.round((entries.reduce((a, e) => a + (e.rating || 0), 0) / entries.length) * 10) / 10;
}
function shotRating(state, shotId) { return avgRating(entriesForShot(state, shotId)); }
function groupRating(state, groupId) {
  const shots = state.shots.filter(s => s.groupId === groupId);
  const ratings = shots.map(s => shotRating(state, s.id)).filter(r => r != null);
  if (!ratings.length) return null;
  return Math.round((ratings.reduce((a, r) => a + r, 0) / ratings.length) * 10) / 10;
}
function overallStats(state) {
  const allEntries = state.sessions.flatMap(s => s.entries);
  const avg = avgRating(allEntries);
  const goalShotIds = state.shots.filter(s => s.isGoal).map(s => s.id);
  const goalEntries = allEntries.filter(e => goalShotIds.includes(e.shotId));
  const goalHits = goalEntries.filter(e => e.rating >= 4).length;
  return { sessions: state.sessions.length, avg, goalHits, goalPossible: goalEntries.length };
}
function sessionAverages(state) {
  return state.sessions.map(s => ({ date: s.date, avg: avgRating(s.entries) }));
}

// ── App state / router ───────────────────────────────────────
let state = loadState();
let logForm = {};     // shotId -> rating
let logNote = '';
let pendingSwap = null; // shotId awaiting a swap target

function route() {
  const hash = location.hash || '#/log';
  const parts = hash.replace('#/', '').split('/');
  render(parts[0] || 'log', parts[1]);
}
window.addEventListener('hashchange', route);

function shell(activeTab, contentHtml) {
  const tabs = [
    { id: 'log', label: 'Log' },
    { id: 'progress', label: 'Progress' },
    { id: 'goals', label: 'Goals' },
  ];
  return `
    <div class="page">${contentHtml}</div>
    <div class="tabbar">
      ${tabs.map(t => `<div class="tab ${activeTab === t.id ? 'active' : ''}" data-action="nav" data-route="${t.id}">${t.label}</div>`).join('')}
    </div>
  `;
}

function render(view, param) {
  let html;
  if (view === 'skill') html = renderSkill(param);
  else if (view === 'progress') html = renderProgress();
  else if (view === 'goals') html = renderGoals();
  else html = renderLog();
  document.getElementById('root').innerHTML = html;
}

function ratingSquares(shotId, current) {
  let out = '<div style="display:flex;gap:5px;">';
  for (let n = 1; n <= 5; n++) {
    out += `<div class="rate-sq ${n <= current ? 'on' : ''}" data-action="rate" data-shot="${shotId}" data-n="${n}"></div>`;
  }
  out += '</div>';
  return out;
}

// ── LOG ────────────────────────────────────────────────────────
function renderLog() {
  const goalShots = state.shots.filter(s => s.isGoal);
  const otherGroups = state.groups;
  const today = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  let goalBand = `<div class="red-band">
    <div class="kicker" style="color:rgba(243,242,242,.8);">Mastering now</div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
      ${goalShots.map(s => `
        <div style="border-bottom:1px solid rgba(243,242,242,.35);padding-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <span style="font-size:16px;font-weight:800;">${s.name}</span>
          </div>
          ${ratingSquares(s.id, logForm[s.id] || 0)}
        </div>`).join('')}
      ${goalShots.length === 0 ? `<div style="font-size:13px;color:rgba(243,242,242,.85);">No goals picked yet — set your top 3 on the Goals tab.</div>` : ''}
    </div>
  </div>`;

  let rest = otherGroups.map(g => {
    const shots = state.shots.filter(s => s.groupId === g.id && !s.isGoal);
    if (!shots.length) return '';
    return `<div class="group-block">
      <div class="kicker" style="margin-bottom:8px;">${g.name}</div>
      ${shots.map(s => `
        <div class="shot-row" style="align-items:center;">
          <span>${s.name}</span>
          ${ratingSquares(s.id, logForm[s.id] || 0)}
        </div>`).join('')}
    </div>`;
  }).join('');

  return shell('log', `
    <div class="kicker">Session ${state.sessions.length + 1} · Open play</div>
    <h1 style="font-size:30px;margin:6px 0 18px;">${today}</h1>
    ${goalBand}
    ${rest}
    <div style="margin:18px 0;">
      <div class="kicker" style="margin-bottom:8px;">Note</div>
      <textarea id="log-note-input" placeholder="How'd it go tonight?" style="width:100%;min-height:70px;font-family:inherit;font-size:14px;border:2px solid var(--ink);padding:10px;background:var(--cream);">${logNote}</textarea>
    </div>
    <button class="btn btn-primary" style="width:100%;" data-action="save-session">Save session</button>
  `);
}

// ── PROGRESS ─────────────────────────────────────────────────
function renderProgress() {
  const stats = overallStats(state);
  const sessAvgs = sessionAverages(state).slice(-12);

  let chart = `<div style="height:130px;display:flex;align-items:flex-end;gap:6px;border-bottom:2px solid var(--ink);">
    ${sessAvgs.map((s, i) => `<div style="flex:1;height:${Math.max(6, (s.avg || 0) / 5 * 100)}%;background:${i >= sessAvgs.length - 3 ? 'var(--red)' : 'var(--rule-light)'};"></div>`).join('') || '<div class="kicker" style="padding-bottom:10px;">Log a session to start the trend.</div>'}
  </div>`;

  let table = state.shots.map(s => {
    const entries = entriesForShot(state, s.id);
    if (!entries.length) return null;
    const now = avgRating(entries);
    const prev = entries.length > 1 ? avgRating(entries.slice(0, -1)) : now;
    const delta = Math.round((now - prev) * 10) / 10;
    return `<div class="shot-row" data-action="nav-skill" data-shot="${s.id}" style="cursor:pointer;">
      <span>${s.isGoal ? '★ ' : ''}${s.name}</span>
      <span style="font-weight:800;">${now} <span style="color:${delta > 0 ? 'var(--red-deep)' : 'rgba(32,30,29,.5)'};">${delta > 0 ? '+' : ''}${delta || '0.0'}</span></span>
    </div>`;
  }).filter(Boolean).join('') || `<div class="kicker" style="padding:10px 0;">No skills logged yet.</div>`;

  return shell('progress', `
    <div class="kicker">Progress</div>
    <h1 style="font-size:30px;margin:6px 0 18px;">Last ${sessAvgs.length} sessions</h1>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border:2px solid var(--ink);border-bottom:none;margin-bottom:18px;">
      <div style="padding:12px;border-right:1px solid rgba(32,30,29,.25);"><div class="kicker">Sessions</div><div style="font-size:28px;font-weight:800;">${stats.sessions}</div></div>
      <div style="padding:12px;border-right:1px solid rgba(32,30,29,.25);"><div class="kicker">Avg rating</div><div style="font-size:28px;font-weight:800;">${stats.avg ?? '—'}</div></div>
      <div style="padding:12px;"><div class="kicker">Goal hits</div><div style="font-size:28px;font-weight:800;color:var(--red);">${stats.goalHits}<span style="font-size:14px;color:rgba(32,30,29,.5);">/${stats.goalPossible}</span></div></div>
    </div>
    <div class="kicker" style="margin-bottom:10px;">Rating trend</div>
    ${chart}
    <div class="kicker" style="margin:20px 0 6px;">By skill — tap for detail</div>
    ${table}
  `);
}

// ── SKILL DETAIL ─────────────────────────────────────────────
function renderSkill(shotId) {
  const s = state.shots.find(sh => sh.id === shotId);
  if (!s) return shell('progress', `<div class="kicker">Skill not found.</div>`);
  const entries = entriesForShot(state, shotId);
  const rating = avgRating(entries);
  const made = entries.reduce((a, e) => a + (e.made || 0), 0);
  const missed = entries.reduce((a, e) => a + (e.missed || 0), 0);
  const pct = made + missed ? Math.round(made / (made + missed) * 100) : null;

  let history = `<div style="height:110px;display:flex;align-items:flex-end;gap:5px;border-bottom:2px solid var(--ink);">
    ${entries.map((e, i) => `<div style="flex:1;height:${e.rating / 5 * 100}%;background:${i >= entries.length - 2 ? 'var(--red)' : 'var(--rule-light)'};"></div>`).join('') || '<div class="kicker" style="padding-bottom:10px;">No sessions logged yet.</div>'}
  </div>`;

  let notes = entries.filter(e => e.note).map(e => `
    <div style="padding-bottom:12px;border-bottom:1px solid rgba(32,30,29,.25);margin-bottom:12px;">
      <div class="kicker">${e.date}</div>
      <div style="font-size:14px;line-height:1.5;margin-top:3px;">${e.note}</div>
    </div>`).join('') || `<div class="kicker">No notes yet.</div>`;

  return shell('progress', `
    <div class="kicker" data-action="nav" data-route="progress" style="cursor:pointer;">← Progress</div>
    <h1 style="font-size:28px;margin:6px 0 6px;">${s.name}</h1>
    ${s.isGoal ? `<div style="display:inline-block;background:var(--red);color:var(--cream);font-size:10px;font-weight:800;letter-spacing:.1em;padding:4px 8px;margin-bottom:14px;">MASTERING NOW</div>` : '<div style="height:14px;"></div>'}
    <div style="display:flex;border:2px solid var(--ink);margin-bottom:20px;">
      <div style="flex:1;padding:14px;border-right:1px solid rgba(32,30,29,.25);"><div class="kicker">Current</div><div style="font-size:40px;font-weight:800;">${rating ?? '—'}</div></div>
      <div style="flex:1;padding:14px;"><div class="kicker">Sessions</div><div style="font-size:40px;font-weight:800;">${entries.length}</div></div>
    </div>
    <div class="kicker" style="margin-bottom:10px;">Rating by session</div>
    ${history}
    <div class="kicker" style="margin:20px 0 8px;">Drill reps · all time</div>
    ${pct != null ? `
      <div style="display:flex;height:24px;border:2px solid var(--ink);">
        <div style="width:${pct}%;background:var(--red);"></div>
        <div style="width:${100 - pct}%;background:var(--cream-2);"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:12px;font-weight:800;">
        <span>${made} MADE</span><span style="color:rgba(32,30,29,.55);">${missed} MISSED · ${pct}%</span>
      </div>` : `<div class="kicker">No reps logged.</div>`}
    <div class="kicker" style="margin:20px 0 8px;">Notes</div>
    ${notes}
  `);
}

// ── GOALS ────────────────────────────────────────────────────
function renderGoals() {
  const goalCount = state.shots.filter(s => s.isGoal).length;
  let banner = '';
  if (pendingSwap) {
    const s = state.shots.find(sh => sh.id === pendingSwap);
    banner = `<div class="red-band" style="margin-bottom:16px;">
      <div style="font-size:14px;">You have 3 goals already. Tap one below to swap in <strong>${s.name}</strong>, or <span data-action="cancel-swap" style="text-decoration:underline;cursor:pointer;">cancel</span>.</div>
    </div>`;
  }

  let rows = state.groups.map(g => {
    const shots = state.shots.filter(s => s.groupId === g.id);
    return `<div class="group-block">
      <div class="kicker" style="margin-bottom:8px;">${g.name}</div>
      ${shots.map(s => {
        const isSwapTarget = pendingSwap && s.isGoal;
        return `<div class="shot-row" style="align-items:center;cursor:pointer;${isSwapTarget ? 'background:rgba(236,48,19,0.08);' : ''}" data-action="toggle-goal" data-shot="${s.id}">
          <span>${s.name}</span>
          <span style="font-size:18px;color:${s.isGoal ? 'var(--red)' : 'rgba(32,30,29,.3)'};">${s.isGoal ? '★' : '☆'}</span>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');

  return shell('goals', `
    <div class="kicker">Goals</div>
    <h1 style="font-size:30px;margin:6px 0 6px;">Pick your top 3</h1>
    <div class="kicker" style="margin-bottom:16px;">${goalCount} of 3 selected</div>
    ${banner}
    ${rows}
  `);
}

// ── Event delegation ──────────────────────────────────────────
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'nav') { location.hash = '#/' + el.dataset.route; }
  else if (action === 'nav-skill') { location.hash = '#/skill/' + el.dataset.shot; }
  else if (action === 'rate') { logForm[el.dataset.shot] = Number(el.dataset.n); render('log'); }
  else if (action === 'save-session') {
    const entries = Object.entries(logForm).filter(([, r]) => r > 0).map(([shotId, rating]) => ({ shotId, rating }));
    if (entries.length) { addSession(state, entries, logNote); }
    logForm = {}; logNote = '';
    render('log');
  }
  else if (action === 'toggle-goal') {
    const shotId = el.dataset.shot;
    const s = state.shots.find(sh => sh.id === shotId);
    if (s.isGoal) { s.isGoal = false; pendingSwap = null; }
    else {
      const count = state.shots.filter(sh => sh.isGoal).length;
      if (count < 3) { s.isGoal = true; }
      else if (pendingSwap) {
        // clicking a current goal while a swap is pending: swap it out
        if (s.isGoal) { s.isGoal = false; const inbound = state.shots.find(sh => sh.id === pendingSwap); if (inbound) inbound.isGoal = true; pendingSwap = null; }
      } else { pendingSwap = shotId; }
    }
    saveState(state);
    render('goals');
  }
  else if (action === 'cancel-swap') { pendingSwap = null; render('goals'); }
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'log-note-input') logNote = e.target.value;
});

route();

// ── PWA: offline app shell via service worker ─────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => console.warn('SW registration failed', err));
  });
}
