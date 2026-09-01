# Handoff: Pickle — Skills Log

## Overview
A pickleball skills-tracking app. A player logs a session's shots with a 1–5 rating, sees progress over time, drills into a single shot's history, and picks 3 "goal" shots that get featured everywhere. Target: `erin-lee/pickle` on GitHub Pages, no backend.

## About the design files
Unlike a typical handoff, the bundled `site/` folder is **not a visual reference to recreate** — it is working, dependency-free HTML/CSS/JS meant to run as-is. There is no framework, build step, or bundler; it's plain `index.html` + `styles.css` + `app.js` using a hash router and `localStorage`.

**The task for this codebase is:**
1. Push `site/` (or its contents, if the repo root should serve directly) to `erin-lee/pickle` on `main`.
2. Enable GitHub Pages in the repo: Settings → Pages → Source: Deploy from a branch → `main` / root (or `/site` if kept as a subfolder — adjust accordingly, or move `site/*` to repo root for the simplest Pages config).
3. Verify the deployed URL loads, the tab bar navigates, and a logged session persists across a reload (localStorage).
4. From there, treat it as a normal codebase to extend — it does not need to be rewritten in React/etc. unless the team wants to; nothing here assumes one.

## Fidelity
High-fidelity for structure and interaction; the visual system is intentionally minimal (see Design tokens) and was not pixel-tuned against a comp — treat spacing/type as a solid default, not a locked spec.

## Data model
```
Group { id, name }                                  // 8 seeded groups
Shot  { id, groupId, name, isGoal }                  // 28 seeded shots; isGoal = one of the 3 featured skills
Session { id, date, entries: Entry[] }
Entry { id, shotId, sessionId, rating(1-5), made, missed, note, tags[] }
```
Persisted as one JSON blob under `localStorage['pickle-state-v1']`. Seeded on first load if the key is empty (`seedState()` in `app.js`). Shot rating = average of its entries; group rating = average of its shots' ratings.

## Screens / views
Hash-routed (`#/log`, `#/progress`, `#/skill/:id`, `#/goals`), one `render(view, param)` swap into `#root`. Shared: a fixed bottom tab bar (Log / Progress / Goals), a 480px-max-width centered "app shell" with a 2px ink border on both sides.

### Log (`#/log`) — default route
- Header: session number + today's date.
- **Red goal band** (full-bleed, `.red-band`): each of the 3 goal shots with its name and a row of 5 rating squares (`.rate-sq`), cream-on-red.
- Below, remaining shots grouped by their group name, each with the same 5-square rating control (ink-on-cream).
- A note textarea, then a full-width primary "Save session" button — collects every shot with a rating > 0 into one `Session`, clears the form.

### Progress (`#/progress`)
- 3-column stat strip: sessions logged, overall avg rating, goal-hit count (entries on goal shots rated ≥4) out of goal entries logged.
- Bar chart of the last 12 sessions' average rating (last 3 bars highlighted red).
- "By skill" list: every shot with a logged entry, current rating and delta vs. its previous entry; tapping a row navigates to Skill detail.

### Skill detail (`#/skill/:shotId`)
- Back link to Progress, shot name, a red "MASTERING NOW" chip if it's a goal shot.
- Current rating and session count in a 2-up stat block.
- Bar chart of rating per session (most recent 2 bars highlighted).
- Drill-rep bar: made vs. missed reps summed across entries, as a 2-segment bar + counts.
- Notes: every entry with a non-empty note, dated.

### Goals (`#/goals`)
- All 28 shots grouped, each toggleable as a goal via a star.
- Selecting a goal is direct while under 3; at 3, tapping a 4th shot sets `pendingSwap` and shows a red banner ("tap one below to swap in X, or cancel") — tapping any current goal swaps it out for the pending shot.

## Interactions & behavior
- All navigation is via `data-action` attributes handled through one delegated `click` listener (see bottom of `app.js`) — no per-element listeners.
- No animations/transitions currently; all state changes are instant re-renders (`render()` re-generates the `#root` innerHTML from current in-memory `state`).
- No loading or error states — everything is synchronous localStorage.
- No responsive breakpoints beyond the fixed 480px max-width shell (intended as a mobile-first single column; scales down fine, doesn't adapt up).

## Design tokens (from `styles.css`)
- `--ink: #201e1d` (text, borders, rules)
- `--cream: #f3f2f2` (app background)
- `--cream-2: #eae9e9` (page background outside the shell)
- `--red: #ec3013` (accent, primary actions, goal band)
- `--red-deep: #ae1800` (numerals/deltas on cream)
- `--rule-light: #d7d3d3` (chart bars, non-recent)
- Font: Archivo (falls back to Helvetica/Arial/sans-serif — no webfont is loaded; add a `<link>`/`@font-face` for the real Archivo family if desired)
- No border radius anywhere (square corners throughout); rules and borders are 1–2px solid, no shadows

## Assets
None — no images or icons; all UI is CSS shapes and text/unicode glyphs (★ / ☆).

## Files
- `site/index.html` — shell + root mount
- `site/styles.css` — all tokens and component classes
- `site/app.js` — data layer, seed data, router, all 4 views, event delegation
