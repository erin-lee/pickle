// ── Data layer ────────────────────────────────────────────────
const STORAGE_KEY = 'pickle-state-v2';

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
  { id: 'k1', groupId: 'kitchen', name: 'Cross-court dink', isGoal: false, description: "Soft, low shot hit diagonally into the opponent's kitchen to extend rallies and open angles." },
  { id: 'k2', groupId: 'kitchen', name: 'Speed-up dink', isGoal: false, description: 'An aggressive, faster dink meant to catch your opponent off guard and force a weak reply.' },
  { id: 'k3', groupId: 'kitchen', name: 'Dead dink / reset', isGoal: false, description: 'A soft, controlled shot that kills pace on a fast ball, resetting the point to neutral.' },
  { id: 'k4', groupId: 'kitchen', name: 'Dink volley (out of air)', isGoal: false, description: 'Dinking the ball before it bounces, taken clean out of the air at the kitchen line.' },
  { id: 't1', groupId: 'transition', name: 'Third shot drop', isGoal: true, description: 'The soft arcing shot after the serve/return that lands in the kitchen, letting you advance to the net.' },
  { id: 't2', groupId: 'transition', name: 'Third shot drive', isGoal: false, description: 'A firm, flat third shot driven low past the opposing team instead of dropping it.' },
  { id: 't3', groupId: 'transition', name: 'Reset off a drive', isGoal: false, description: 'Absorbing pace off an incoming drive and softly dropping it back into the kitchen.' },
  { id: 'sp1', groupId: 'specials', name: 'Offensive lob', isGoal: false, description: "A deep, arcing shot over the opponents' heads when they're crowding the net." },
  { id: 'sp2', groupId: 'specials', name: 'Erne', isGoal: false, description: 'Stepping around the kitchen (without touching it) to volley a wide ball out of the air.' },
  { id: 'sp3', groupId: 'specials', name: 'ATP', isGoal: false, description: 'Hitting the ball around the net post, outside the court boundary, to win the point.' },
  { id: 'sv1', groupId: 'serve', name: 'Deep serve', isGoal: false, description: 'A serve hit deep into the service box to push the returner back and limit their options.' },
  { id: 'sv2', groupId: 'serve', name: 'Spin serve', isGoal: false, description: 'A serve with added spin to make the bounce less predictable for the returner.' },
  { id: 'sv3', groupId: 'serve', name: 'Body serve', isGoal: false, description: "A serve aimed at the returner's body to jam their swing." },
  { id: 'sv4', groupId: 'serve', name: 'Short serve', isGoal: false, description: 'A serve that lands just past the kitchen line, pulling the returner forward.' },
  { id: 'r1', groupId: 'return', name: 'Deep return', isGoal: true, description: 'Returning serve deep in the court to prevent the serving team from advancing easily.' },
  { id: 'r2', groupId: 'return', name: 'Short angle return', isGoal: false, description: 'A sharply angled return that pulls the server wide off the court.' },
  { id: 'r3', groupId: 'return', name: 'Lob return', isGoal: false, description: 'A high, deep return used to buy time to get to the net.' },
  { id: 'r4', groupId: 'return', name: 'Drive return', isGoal: false, description: 'A hard, flat return aimed low to rush the serving team.' },
  { id: 'd1', groupId: 'drive', name: 'Forehand drive', isGoal: false, description: 'A firm, flat groundstroke hit with the forehand to apply pressure.' },
  { id: 'd2', groupId: 'drive', name: 'Backhand drive', isGoal: false, description: 'A firm, flat groundstroke hit with the backhand.' },
  { id: 'd3', groupId: 'drive', name: 'Two-handed backhand drive', isGoal: false, description: 'A backhand drive hit with both hands for extra power and control.' },
  { id: 'v1', groupId: 'volleys', name: 'Punch volley', isGoal: false, description: 'A short, compact volley hit with a punching motion rather than a swing.' },
  { id: 'v2', groupId: 'volleys', name: 'Roll volley', isGoal: true, description: 'A volley hit with topspin by rolling the paddle face over the ball.' },
  { id: 'v3', groupId: 'volleys', name: 'Reset volley', isGoal: false, description: 'A soft volley meant to kill pace and drop the ball into the kitchen.' },
  { id: 'v4', groupId: 'volleys', name: 'Block volley', isGoal: false, description: 'A firm, compact volley used to redirect a hard-hit ball back with minimal swing.' },
  { id: 'f1', groupId: 'footwork', name: 'Split-step timing', isGoal: false, description: 'Timing a small hop as your opponent contacts the ball to stay ready to move any direction.' },
  { id: 'f2', groupId: 'footwork', name: 'Court recovery', isGoal: false, description: 'Moving quickly back to the ready position/center of the court after hitting a shot.' },
  { id: 'f3', groupId: 'footwork', name: 'Ready position', isGoal: false, description: 'The balanced, paddle-up stance used between shots to react quickly.' },
];

function seedState() { return { groups: SEED_GROUPS, shots: SEED_SHOTS, sessions: [] }; }

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { const s = seedState(); saveState(s); return s; }
  try { return JSON.parse(raw); } catch (e) { const s = seedState(); saveState(s); return s; }
}
function saveState(state) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function resetState() { const s = seedState(); saveState(s); return s; }

const FLOW_STORAGE_KEY = 'pickle-flow-v1';
function loadLogFlow() {
  try { return JSON.parse(localStorage.getItem(FLOW_STORAGE_KEY)) || {}; } catch (e) { return {}; }
}
function persistLogFlow() { localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(logFlow)); }

function addShot(state, groupId, name, description) {
  const id = 'shot_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  state.shots.push({ id, groupId, name, description: description || '', isGoal: false });
  saveState(state);
  return id;
}
function updateShot(state, shotId, patch) {
  const s = state.shots.find(sh => sh.id === shotId);
  if (s) Object.assign(s, patch);
  saveState(state);
}
function deleteShot(state, shotId) {
  state.shots = state.shots.filter(sh => sh.id !== shotId);
  saveState(state);
}

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
function updateSessionEntry(state, sessionId, entryId, patch) {
  const session = state.sessions.find(s => s.id === sessionId);
  const entry = session && session.entries.find(e => e.id === entryId);
  if (entry) Object.assign(entry, patch);
  saveState(state);
}
function deleteSessionEntry(state, sessionId, entryId) {
  const session = state.sessions.find(s => s.id === sessionId);
  if (!session) return;
  session.entries = session.entries.filter(e => e.id !== entryId);
  if (!session.entries.length) state.sessions = state.sessions.filter(s => s.id !== sessionId);
  saveState(state);
}
function deleteSession(state, sessionId) {
  state.sessions = state.sessions.filter(s => s.id !== sessionId);
  saveState(state);
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
let pendingSwap = null; // shotId awaiting a swap target
let logFlow = loadLogFlow(); // shotId -> { used, feel, note, tags } — persisted so a reload can't silently wipe tonight's progress
let skillDrawer = null; // { mode: 'view'|'edit'|'add', shotId, groupId }
let expandedNoteShot = null; // shotId whose inline note editor is open on the Log page
let editingEntry = null; // { sessionId, entryId } being edited on a session-detail screen
let entryDraft = null; // { rating, tags } draft for the entry being edited

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
  else if (view === 'log-flow') html = renderLogFlow(param);
  else if (view === 'sessions') html = renderSessionsList();
  else if (view === 'session') html = renderSessionDetail(param);
  else html = renderLog();
  if (skillDrawer && (view === 'log' || view === 'goals')) html += renderSkillDrawer();
  document.getElementById('root').innerHTML = html;
}

const RATE_LABELS = [[1, 'Off'], [2, 'Shaky'], [3, 'Okay'], [4, 'Solid'], [5, 'Dialed in']];

function rateLegend() {
  return `<div style="font-size:11px;font-weight:800;letter-spacing:.06em;color:rgba(32,30,29,.5);text-transform:uppercase;">${RATE_LABELS.map(([n, l]) => `${n} ${l}`).join(' · ')}</div>`;
}

function feelSquares(shotId, feel, active) {
  let out = '<div style="display:flex;gap:5px;">';
  for (let n = 1; n <= 5; n++) {
    const on = active && (feel || 0) >= n;
    const clickAttrs = active ? `data-action="inline-feel" data-shot="${shotId}" data-n="${n}"` : '';
    out += `<div ${clickAttrs} style="flex:1;min-width:20px;height:20px;border:2px solid ${active ? 'var(--ink)' : 'rgba(32,30,29,.25)'};background:${on ? 'var(--red)' : 'transparent'};${active ? 'cursor:pointer;' : ''}"></div>`;
  }
  out += '</div>';
  return out;
}

function skillCheckbox(checked) {
  return `<div style="width:24px;height:24px;border:2px solid ${checked ? 'var(--ink)' : 'rgba(32,30,29,.3)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${checked ? 'var(--ink)' : 'transparent'};">
    ${checked ? '<span style="color:var(--cream);font-weight:800;font-size:14px;">✓</span>' : ''}
  </div>`;
}

function infoDot(light) {
  return `<span class="info-dot" style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;border:1px solid ${light ? 'rgba(243,242,242,.7)' : 'rgba(32,30,29,.4)'};color:${light ? 'rgba(243,242,242,.9)' : 'rgba(32,30,29,.55)'};font-size:11px;font-weight:800;flex-shrink:0;">i</span>`;
}

// ── LOG ────────────────────────────────────────────────────────
function renderLog() {
  const goalShots = state.shots.filter(s => s.isGoal);
  const otherGroups = state.groups;
  const todayISO = new Date().toISOString().slice(0, 10);
  const today = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const sessionsToday = state.sessions.filter(s => s.date === todayISO).length;
  const sessionLabel = sessionsToday === 0 ? 'Open play' : `Session ${sessionsToday + 1} today · Open play`;

  const usedCount = goalShots.filter(s => logFlow[s.id] && logFlow[s.id].used).length;
  const statusLabel = goalShots.length === 0 ? '' : (usedCount === 0 ? 'Not logged' : (usedCount === goalShots.length ? 'Logged' : `${usedCount}/${goalShots.length} logged`));

  let goalBand = `<div class="red-band" ${goalShots.length ? `data-action="nav-flow" data-shot="${goalShots[0].id}" style="cursor:pointer;"` : ''}>
    <div style="display:flex;justify-content:space-between;align-items:baseline;">
      <div class="kicker" style="color:rgba(243,242,242,.8);">Mastering now</div>
      ${statusLabel ? `<div style="font-size:13px;color:rgba(243,242,242,.75);">${statusLabel}</div>` : ''}
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:12px;">
      ${goalShots.map((s, i) => {
        const timesLogged = entriesForShot(state, s.id).length;
        const used = !!(logFlow[s.id] && logFlow[s.id].used);
        return `<div data-action="nav-flow" data-shot="${s.id}" style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid rgba(243,242,242,.35);opacity:${used || i === 0 ? 1 : 0.55};cursor:pointer;">
          <div>
            <div data-action="skill-info" data-shot="${s.id}" style="display:inline-flex;align-items:center;gap:8px;padding:6px 8px;margin:-6px 0 -6px -8px;cursor:pointer;">
              <span style="font-size:20px;font-weight:800;">${s.name}</span>
              ${infoDot(true)}
            </div>
            <div class="kicker" style="color:rgba(243,242,242,.75);margin-top:4px;">${timesLogged === 0 ? 'Not logged yet' : `Logged ${timesLogged} time${timesLogged === 1 ? '' : 's'}`}</div>
          </div>
          <div style="width:26px;height:26px;border:2px solid var(--cream);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${used ? '<span style="color:var(--cream);font-weight:800;font-size:16px;">✓</span>' : ''}
          </div>
        </div>`;
      }).join('')}
      ${goalShots.length === 0 ? `<div style="font-size:13px;color:rgba(243,242,242,.85);">No goals picked yet — set your top 3 on the Goals tab.</div>` : ''}
    </div>
  </div>`;

  const hasRest = otherGroups.some(g => state.shots.some(s => s.groupId === g.id && !s.isGoal));

  let rest = otherGroups.map(g => {
    const shots = state.shots.filter(s => s.groupId === g.id && !s.isGoal);
    if (!shots.length) return '';
    return `<div class="group-block">
      <div class="kicker" style="margin-bottom:8px;">${g.name}</div>
      ${shots.map(s => {
        const entry = logFlow[s.id] || {};
        const used = !!entry.used;
        const noteOpen = expandedNoteShot === s.id;
        const row = `<div class="shot-row" style="align-items:center;">
          <div style="display:flex;align-items:center;gap:12px;min-width:0;">
            <div data-action="inline-toggle-used" data-shot="${s.id}" style="cursor:pointer;">${skillCheckbox(used)}</div>
            <span data-action="skill-info" data-shot="${s.id}" style="display:inline-flex;align-items:center;gap:8px;padding:6px 8px;margin:-6px 0;cursor:pointer;">${s.name} ${infoDot(false)}</span>
          </div>
          ${feelSquares(s.id, entry.feel, used)}
        </div>`;
        const notePanel = noteOpen ? `<div style="padding:2px 0 16px;">
          <div class="kicker" style="margin-bottom:8px;">Note</div>
          <textarea id="inline-note-input" placeholder="What clicked / what didn't?" style="width:100%;min-height:70px;font-family:inherit;font-size:14px;border:2px solid var(--ink);padding:10px;background:var(--cream);margin-bottom:10px;">${entry.note || ''}</textarea>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-primary" style="flex:1;" data-action="inline-note-save" data-shot="${s.id}">Save</button>
            <button class="btn" style="flex:1;" data-action="inline-note-cancel" data-shot="${s.id}">Cancel</button>
          </div>
        </div>` : '';
        return row + notePanel;
      }).join('')}
    </div>`;
  }).join('');

  const hasProgress = Object.values(logFlow).some(e => e.used || e.feel);

  return shell('log', `
    <div class="kicker">${sessionLabel}</div>
    <h1 style="font-size:30px;margin:6px 0 18px;">${today}</h1>
    ${goalBand}
    ${hasRest ? `<div style="display:flex;justify-content:space-between;align-items:baseline;margin:22px 0 10px;">
      <div class="kicker">Rate tonight</div>
      ${rateLegend()}
    </div>` : ''}
    ${rest}
    ${hasProgress ? `<div style="display:flex;gap:10px;margin-top:18px;">
      <button class="btn btn-primary" style="flex:1;" data-action="finish-session">Save session</button>
      <button class="btn" style="flex:1;" data-action="reset-session">Reset session</button>
    </div>` : ''}
  `);
}

// ── LOG FLOW (per-goal-skill logging) ──────────────────────────
const FLOW_TAGS = ['Soft hands', 'Tempo', 'Footwork', 'Paddle angle'];

function renderLogFlow(shotId) {
  const goalShots = state.shots.filter(s => s.isGoal);
  const goalIdx = goalShots.findIndex(s => s.id === shotId);
  const shot = goalShots[goalIdx];
  if (!shot) { location.hash = '#/log'; return ''; }
  const entry = logFlow[shot.id] || {};
  const todayISO = new Date().toISOString().slice(0, 10);
  const sessionNum = state.sessions.filter(s => s.date === todayISO).length + 1;
  const isLast = goalIdx === goalShots.length - 1;
  const nextLabel = isLast ? 'Finish' : 'Next · ' + goalShots[goalIdx + 1].name;
  const tags = entry.tags || [];

  return `
    <div style="padding-bottom:90px;">
      <div class="red-band" style="margin:0;padding:20px 20px 22px;">
        <div class="kicker" style="color:rgba(243,242,242,.8);">Skill ${goalIdx + 1} of ${goalShots.length} · Session ${sessionNum}</div>
        <h1 style="color:var(--cream);font-size:32px;margin:8px 0 16px;">${shot.name}</h1>
        <div data-action="flow-toggle-used" data-shot="${shot.id}" style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <div style="width:22px;height:22px;border:2px solid var(--cream);display:flex;align-items:center;justify-content:center;background:${entry.used ? 'var(--cream)' : 'transparent'};flex-shrink:0;">
            ${entry.used ? '<span style="color:var(--red);font-weight:800;">✓</span>' : ''}
          </div>
          <span style="font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;">Used it tonight</span>
        </div>
      </div>
      <div style="padding:20px;">
        <div class="kicker" style="margin-bottom:10px;">How did it feel?</div>
        <div style="display:flex;gap:6px;margin-bottom:20px;">
          ${[1, 2, 3, 4, 5].map(n => `<div data-action="flow-feel" data-shot="${shot.id}" data-n="${n}" style="flex:1;height:44px;border:2px solid var(--ink);display:flex;align-items:center;justify-content:center;font-weight:800;cursor:pointer;background:${entry.feel === n ? 'var(--ink)' : 'transparent'};color:${entry.feel === n ? 'var(--cream)' : 'var(--ink)'};">${n}</div>`).join('')}
        </div>
        <div class="kicker" style="margin-bottom:8px;">Note</div>
        <textarea class="flow-note-input" data-shot="${shot.id}" placeholder="What clicked / what didn't?" style="width:100%;min-height:70px;font-family:inherit;font-size:14px;border:2px solid var(--ink);padding:10px;background:var(--cream);margin-bottom:14px;">${entry.note || ''}</textarea>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${FLOW_TAGS.map(t => `<div class="btn ${tags.includes(t) ? 'btn-primary' : ''}" style="font-size:11px;padding:8px 12px;" data-action="flow-tag-toggle" data-shot="${shot.id}" data-tag="${t}">${t}</div>`).join('')}
          ${tags.filter(t => !FLOW_TAGS.includes(t)).map(t => `<div class="btn btn-primary" style="font-size:11px;padding:8px 12px;" data-action="flow-tag-toggle" data-shot="${shot.id}" data-tag="${t}">${t}</div>`).join('')}
          <div class="btn" style="font-size:11px;padding:8px 12px;" data-action="flow-tag-add" data-shot="${shot.id}">+ Tag</div>
        </div>
      </div>
    </div>
    <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;display:flex;border-top:2px solid var(--ink);background:var(--cream);">
      <button class="btn btn-primary" style="flex:1;border:none;padding:18px;font-size:13px;" data-action="flow-next" data-shot="${shot.id}">${nextLabel}</button>
      <button class="btn" style="border:none;border-left:2px solid var(--ink);padding:18px 22px;font-size:13px;" data-action="flow-skip" data-shot="${shot.id}">Skip</button>
    </div>
  `;
}

function finishFlow() {
  const entries = state.shots
    .filter(s => logFlow[s.id] && (logFlow[s.id].used || logFlow[s.id].feel))
    .map(s => ({ shotId: s.id, rating: logFlow[s.id].feel || 0, note: logFlow[s.id].note || '', tags: logFlow[s.id].tags || [] }));
  if (entries.length) addSession(state, entries, '');
  logFlow = {};
  location.hash = '#/log';
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
      <div style="padding:12px;border-right:1px solid rgba(32,30,29,.25);cursor:pointer;" data-action="nav" data-route="sessions"><div class="kicker">Sessions →</div><div style="font-size:28px;font-weight:800;">${stats.sessions}</div></div>
      <div style="padding:12px;border-right:1px solid rgba(32,30,29,.25);"><div class="kicker">Avg rating</div><div style="font-size:28px;font-weight:800;">${stats.avg ?? '—'}</div></div>
      <div style="padding:12px;"><div class="kicker">Solid+ ratings</div><div style="font-size:28px;font-weight:800;color:var(--red);">${stats.goalHits}<span style="font-size:14px;color:rgba(32,30,29,.5);">/${stats.goalPossible}</span></div></div>
    </div>
    <div class="kicker" style="margin-bottom:10px;">Rating trend</div>
    ${chart}
    <div class="kicker" style="margin:20px 0 6px;">By skill — tap for detail</div>
    ${table}
  `);
}

// ── SESSIONS ─────────────────────────────────────────────────
function renderSessionsList() {
  const chronological = state.sessions;
  const perDayCount = {};
  const ordinalById = {};
  chronological.forEach(sess => {
    perDayCount[sess.date] = (perDayCount[sess.date] || 0) + 1;
    ordinalById[sess.id] = perDayCount[sess.date];
  });

  const rows = chronological.slice().reverse().map(sess => {
    const avg = avgRating(sess.entries);
    const skillNames = sess.entries.map(e => {
      const shot = state.shots.find(sh => sh.id === e.shotId);
      return shot ? shot.name : 'Deleted skill';
    });
    const dateLabel = new Date(sess.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const ordinal = perDayCount[sess.date] > 1 ? ` · Session ${ordinalById[sess.id]}` : '';
    return `<div class="shot-row" data-action="nav-session" data-session="${sess.id}" style="cursor:pointer;flex-direction:column;align-items:flex-start;">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:baseline;">
        <span style="font-weight:800;">${dateLabel}${ordinal}</span>
        <span style="font-weight:800;">${avg ?? '—'}</span>
      </div>
      <div style="font-size:13px;color:rgba(32,30,29,.55);margin-top:4px;">${skillNames.join(', ')}</div>
    </div>`;
  }).join('') || `<div class="kicker" style="padding:10px 0;">No sessions logged yet.</div>`;

  return shell('progress', `
    <div class="kicker" data-action="nav" data-route="progress" style="cursor:pointer;">← Progress</div>
    <h1 style="font-size:30px;margin:6px 0 18px;">Sessions</h1>
    ${rows}
  `);
}

function renderSessionDetail(sessionId) {
  const session = state.sessions.find(s => s.id === sessionId);
  if (!session) {
    return shell('progress', `
      <div class="kicker" data-action="nav" data-route="sessions" style="cursor:pointer;">← Sessions</div>
      <div class="kicker" style="margin-top:20px;">Session not found.</div>
    `);
  }
  const dateLabel = new Date(session.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  const rows = session.entries.map(e => {
    const shot = state.shots.find(sh => sh.id === e.shotId);
    const shotName = shot ? shot.name : 'Deleted skill';
    const isEditing = editingEntry && editingEntry.sessionId === session.id && editingEntry.entryId === e.id;

    if (isEditing) {
      const draft = entryDraft || { rating: e.rating, tags: e.tags || [] };
      return `<div class="group-block">
        <div class="kicker" style="margin-bottom:10px;">${shotName}</div>
        <div style="display:flex;gap:6px;margin-bottom:14px;">
          ${[1, 2, 3, 4, 5].map(n => `<div data-action="entry-edit-rate" data-n="${n}" style="flex:1;height:40px;border:2px solid var(--ink);display:flex;align-items:center;justify-content:center;font-weight:800;cursor:pointer;background:${draft.rating === n ? 'var(--ink)' : 'transparent'};color:${draft.rating === n ? 'var(--cream)' : 'var(--ink)'};">${n}</div>`).join('')}
        </div>
        <textarea id="entry-edit-note-input" placeholder="What clicked / what didn't?" style="width:100%;min-height:60px;font-family:inherit;font-size:14px;border:2px solid var(--ink);padding:10px;background:var(--cream);margin-bottom:12px;">${e.note || ''}</textarea>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
          ${FLOW_TAGS.map(t => `<div class="btn ${draft.tags.includes(t) ? 'btn-primary' : ''}" style="font-size:11px;padding:8px 12px;" data-action="entry-edit-tag-toggle" data-tag="${t}">${t}</div>`).join('')}
          ${draft.tags.filter(t => !FLOW_TAGS.includes(t)).map(t => `<div class="btn btn-primary" style="font-size:11px;padding:8px 12px;" data-action="entry-edit-tag-toggle" data-tag="${t}">${t}</div>`).join('')}
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary" style="flex:1;" data-action="entry-edit-save" data-session="${session.id}" data-entry="${e.id}">Save</button>
          <button class="btn" style="flex:1;" data-action="entry-edit-cancel">Cancel</button>
        </div>
      </div>`;
    }

    const rateLabel = RATE_LABELS[e.rating - 1];
    return `<div class="group-block">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <span style="font-weight:800;font-size:16px;">${shotName}</span>
        <span style="font-weight:800;">${e.rating}${rateLabel ? ' · ' + rateLabel[1] : ''}</span>
      </div>
      ${e.note ? `<div style="font-size:14px;color:rgba(32,30,29,.7);margin-top:6px;line-height:1.5;">${e.note}</div>` : ''}
      ${e.tags && e.tags.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">${e.tags.map(t => `<span class="kicker" style="border:1px solid rgba(32,30,29,.3);padding:4px 8px;">${t}</span>`).join('')}</div>` : ''}
      <div style="display:flex;gap:16px;margin-top:10px;">
        <span class="kicker" style="cursor:pointer;color:var(--red);" data-action="entry-edit" data-session="${session.id}" data-entry="${e.id}">Edit</span>
        <span class="kicker" style="cursor:pointer;color:var(--red-deep);" data-action="entry-delete" data-session="${session.id}" data-entry="${e.id}">Delete</span>
      </div>
    </div>`;
  }).join('');

  return shell('progress', `
    <div class="kicker" data-action="nav" data-route="sessions" style="cursor:pointer;">← Sessions</div>
    <h1 style="font-size:30px;margin:6px 0 18px;">${dateLabel}</h1>
    ${rows}
    <div style="margin-top:20px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--red-deep);cursor:pointer;" data-action="session-delete" data-session="${session.id}">Delete entire session</div>
  `);
}

// ── SKILL DETAIL ─────────────────────────────────────────────
function renderSkill(shotId) {
  const s = state.shots.find(sh => sh.id === shotId);
  if (!s) return shell('progress', `<div class="kicker">Skill not found.</div>`);
  const entries = entriesForShot(state, shotId);
  const rating = avgRating(entries);

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
        return `<div class="shot-row" style="align-items:center;${isSwapTarget ? 'background:rgba(236,48,19,0.08);' : ''}">
          <span data-action="skill-info" data-shot="${s.id}" style="display:inline-flex;align-items:center;gap:8px;padding:6px 8px;margin:-6px 0 -6px -8px;cursor:pointer;">${s.name} ${infoDot(false)}</span>
          <span style="font-size:18px;color:${s.isGoal ? 'var(--red)' : 'rgba(32,30,29,.3)'};cursor:pointer;padding:4px 0 4px 12px;" data-action="toggle-goal" data-shot="${s.id}">${s.isGoal ? '★' : '☆'}</span>
        </div>`;
      }).join('')}
      <div style="padding:10px 0 2px;font-size:13px;font-weight:800;color:var(--red);cursor:pointer;" data-action="add-skill" data-group="${g.id}">+ Add skill</div>
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

// ── SKILL DRAWER (view/edit/add) ────────────────────────────────
function renderSkillDrawer() {
  const groupOptions = (selectedGroupId) => state.groups.map(g => `<option value="${g.id}" ${g.id === selectedGroupId ? 'selected' : ''}>${g.name}</option>`).join('');

  let inner;
  if (skillDrawer.mode === 'add') {
    inner = `
      <div class="kicker" style="margin-bottom:14px;">Add skill</div>
      <div class="kicker" style="margin-bottom:6px;">Name</div>
      <input id="drawer-name-input" type="text" placeholder="Skill name" style="width:100%;font-family:inherit;font-size:16px;font-weight:800;border:2px solid var(--ink);padding:10px;background:var(--cream);margin-bottom:14px;">
      <div class="kicker" style="margin-bottom:6px;">Group</div>
      <select id="drawer-group-select" style="width:100%;font-family:inherit;font-size:14px;border:2px solid var(--ink);padding:10px;background:var(--cream);margin-bottom:14px;">${groupOptions(skillDrawer.groupId)}</select>
      <div class="kicker" style="margin-bottom:6px;">Description</div>
      <textarea id="drawer-desc-input" placeholder="What is this skill?" style="width:100%;min-height:80px;font-family:inherit;font-size:14px;border:2px solid var(--ink);padding:10px;background:var(--cream);margin-bottom:18px;"></textarea>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-primary" style="flex:1;" data-action="drawer-save">Save</button>
        <button class="btn" style="flex:1;" data-action="drawer-close">Cancel</button>
      </div>`;
  } else {
    const s = state.shots.find(sh => sh.id === skillDrawer.shotId);
    if (!s) { skillDrawer = null; return ''; }
    const group = state.groups.find(g => g.id === s.groupId);
    if (skillDrawer.mode === 'edit') {
      inner = `
        <div class="kicker" style="margin-bottom:14px;">Edit skill</div>
        <div class="kicker" style="margin-bottom:6px;">Name</div>
        <input id="drawer-name-input" type="text" value="${s.name}" style="width:100%;font-family:inherit;font-size:16px;font-weight:800;border:2px solid var(--ink);padding:10px;background:var(--cream);margin-bottom:14px;">
        <div class="kicker" style="margin-bottom:6px;">Group</div>
        <select id="drawer-group-select" style="width:100%;font-family:inherit;font-size:14px;border:2px solid var(--ink);padding:10px;background:var(--cream);margin-bottom:14px;">${groupOptions(s.groupId)}</select>
        <div class="kicker" style="margin-bottom:6px;">Description</div>
        <textarea id="drawer-desc-input" placeholder="What is this skill?" style="width:100%;min-height:80px;font-family:inherit;font-size:14px;border:2px solid var(--ink);padding:10px;background:var(--cream);margin-bottom:18px;">${s.description || ''}</textarea>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary" style="flex:1;" data-action="drawer-save" data-shot="${s.id}">Save</button>
          <button class="btn" style="flex:1;" data-action="drawer-close">Cancel</button>
        </div>
        <div style="margin-top:14px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--red-deep);cursor:pointer;" data-action="drawer-delete" data-shot="${s.id}">Delete skill</div>`;
    } else {
      inner = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
          <div class="kicker">${group ? group.name : ''}${s.isGoal ? ' · Mastering now' : ''}</div>
        </div>
        <h2 style="font-size:26px;margin:0 0 14px;">${s.name}</h2>
        <div class="kicker" style="margin-bottom:6px;">Description</div>
        <div style="font-size:14px;line-height:1.5;margin-bottom:22px;${s.description ? '' : 'color:rgba(32,30,29,.5);'}">${s.description || 'No description yet.'}</div>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary" style="flex:1;" data-action="drawer-edit">Edit</button>
          <button class="btn" style="flex:1;" data-action="drawer-close">Close</button>
        </div>
        <div style="margin-top:14px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--red-deep);cursor:pointer;" data-action="drawer-delete" data-shot="${s.id}">Delete skill</div>`;
    }
  }

  return `
    <div data-action="drawer-close" style="position:fixed;inset:0;background:rgba(32,30,29,.5);z-index:20;"></div>
    <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;max-height:70vh;overflow-y:auto;background:var(--cream);border:2px solid var(--ink);border-bottom:none;padding:22px 20px 28px;z-index:21;">
      ${inner}
    </div>
  `;
}

// ── Event delegation ──────────────────────────────────────────
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'nav') { location.hash = '#/' + el.dataset.route; }
  else if (action === 'nav-skill') { location.hash = '#/skill/' + el.dataset.shot; }
  else if (action === 'nav-session') { location.hash = '#/session/' + el.dataset.session; }
  else if (action === 'reset-session') {
    if (confirm("Reset tonight's session? This clears all progress you haven't saved yet.")) {
      logFlow = {};
      expandedNoteShot = null;
      render('log');
    }
  }
  else if (action === 'finish-session') { finishFlow(); }
  else if (action === 'inline-toggle-used') {
    const shotId = el.dataset.shot;
    const entry = logFlow[shotId];
    if (entry && entry.used) {
      delete logFlow[shotId];
      if (expandedNoteShot === shotId) expandedNoteShot = null;
    } else {
      logFlow[shotId] = { ...(entry || {}), used: true };
    }
    render('log');
  }
  else if (action === 'inline-feel') {
    const shotId = el.dataset.shot;
    const entry = logFlow[shotId] || {};
    if (!entry.used) return;
    entry.feel = Number(el.dataset.n);
    logFlow[shotId] = entry;
    expandedNoteShot = shotId;
    render('log');
  }
  else if (action === 'inline-note-save') {
    const shotId = el.dataset.shot;
    const noteEl = document.getElementById('inline-note-input');
    const entry = logFlow[shotId] || {};
    entry.note = noteEl ? noteEl.value : (entry.note || '');
    logFlow[shotId] = entry;
    expandedNoteShot = null;
    render('log');
  }
  else if (action === 'inline-note-cancel') {
    delete logFlow[el.dataset.shot];
    expandedNoteShot = null;
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
  else if (action === 'nav-flow') {
    const shotId = el.dataset.shot;
    logFlow[shotId] = { ...(logFlow[shotId] || {}), used: true };
    location.hash = '#/log-flow/' + shotId;
  }
  else if (action === 'flow-toggle-used') {
    const shotId = el.dataset.shot;
    const entry = logFlow[shotId] || {};
    entry.used = !entry.used;
    logFlow[shotId] = entry;
    route();
  }
  else if (action === 'flow-feel') {
    const shotId = el.dataset.shot;
    const entry = logFlow[shotId] || {};
    entry.feel = Number(el.dataset.n);
    entry.used = true;
    logFlow[shotId] = entry;
    route();
  }
  else if (action === 'flow-tag-toggle') {
    const shotId = el.dataset.shot;
    const tag = el.dataset.tag;
    const entry = logFlow[shotId] || {};
    entry.tags = entry.tags || [];
    entry.tags = entry.tags.includes(tag) ? entry.tags.filter(t => t !== tag) : [...entry.tags, tag];
    logFlow[shotId] = entry;
    route();
  }
  else if (action === 'flow-tag-add') {
    const shotId = el.dataset.shot;
    const tag = (prompt('Add a tag') || '').trim();
    if (tag) {
      const entry = logFlow[shotId] || {};
      entry.tags = entry.tags || [];
      if (!entry.tags.includes(tag)) entry.tags.push(tag);
      logFlow[shotId] = entry;
      route();
    }
  }
  else if (action === 'flow-next') {
    const goalShots = state.shots.filter(s => s.isGoal);
    const idx = goalShots.findIndex(s => s.id === el.dataset.shot);
    if (idx < goalShots.length - 1) location.hash = '#/log-flow/' + goalShots[idx + 1].id;
    else finishFlow();
  }
  else if (action === 'flow-skip') {
    delete logFlow[el.dataset.shot];
    const goalShots = state.shots.filter(s => s.isGoal);
    const idx = goalShots.findIndex(s => s.id === el.dataset.shot);
    if (idx < goalShots.length - 1) location.hash = '#/log-flow/' + goalShots[idx + 1].id;
    else finishFlow();
  }
  else if (action === 'skill-info') { skillDrawer = { mode: 'view', shotId: el.dataset.shot }; route(); }
  else if (action === 'add-skill') { skillDrawer = { mode: 'add', groupId: el.dataset.group }; route(); }
  else if (action === 'drawer-close') { skillDrawer = null; route(); }
  else if (action === 'drawer-edit') { skillDrawer.mode = 'edit'; route(); }
  else if (action === 'drawer-save') {
    const nameEl = document.getElementById('drawer-name-input');
    const descEl = document.getElementById('drawer-desc-input');
    const groupEl = document.getElementById('drawer-group-select');
    const name = (nameEl.value || '').trim();
    if (name) {
      if (skillDrawer.mode === 'add') { addShot(state, groupEl.value, name, descEl.value); }
      else { updateShot(state, skillDrawer.shotId, { name, description: descEl.value, groupId: groupEl.value }); }
    }
    skillDrawer = null;
    route();
  }
  else if (action === 'drawer-delete') {
    if (confirm('Delete this skill? This cannot be undone.')) {
      deleteShot(state, el.dataset.shot);
      skillDrawer = null;
      route();
    }
  }
  else if (action === 'entry-edit') {
    editingEntry = { sessionId: el.dataset.session, entryId: el.dataset.entry };
    const session = state.sessions.find(s => s.id === editingEntry.sessionId);
    const entry = session && session.entries.find(en => en.id === editingEntry.entryId);
    entryDraft = { rating: entry.rating, tags: [...(entry.tags || [])] };
    render('session', editingEntry.sessionId);
  }
  else if (action === 'entry-edit-rate') {
    entryDraft.rating = Number(el.dataset.n);
    render('session', editingEntry.sessionId);
  }
  else if (action === 'entry-edit-tag-toggle') {
    const tag = el.dataset.tag;
    entryDraft.tags = entryDraft.tags.includes(tag) ? entryDraft.tags.filter(t => t !== tag) : [...entryDraft.tags, tag];
    render('session', editingEntry.sessionId);
  }
  else if (action === 'entry-edit-save') {
    const noteEl = document.getElementById('entry-edit-note-input');
    updateSessionEntry(state, el.dataset.session, el.dataset.entry, {
      rating: entryDraft.rating,
      tags: entryDraft.tags,
      note: noteEl.value,
    });
    editingEntry = null;
    entryDraft = null;
    render('session', el.dataset.session);
  }
  else if (action === 'entry-edit-cancel') {
    editingEntry = null;
    entryDraft = null;
    route();
  }
  else if (action === 'entry-delete') {
    if (confirm('Delete this entry?')) {
      const sessionId = el.dataset.session;
      deleteSessionEntry(state, sessionId, el.dataset.entry);
      const stillExists = state.sessions.some(s => s.id === sessionId);
      if (stillExists) render('session', sessionId); else location.hash = '#/sessions';
    }
  }
  else if (action === 'session-delete') {
    if (confirm('Delete this entire session? This cannot be undone.')) {
      deleteSession(state, el.dataset.session);
      location.hash = '#/sessions';
    }
  }
  persistLogFlow();
});
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('flow-note-input')) {
    const shotId = e.target.dataset.shot;
    const entry = logFlow[shotId] || {};
    entry.note = e.target.value;
    logFlow[shotId] = entry;
    persistLogFlow();
  }
});

route();

// ── PWA: offline app shell via service worker ─────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => console.warn('SW registration failed', err));
  });
}
