# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Live Site

https://stasn889.github.io/wc2026-pwa (GitHub Pages)

## Running Locally

Zero-build static PWA — no npm, no bundler. Must be served via HTTP (Service Worker requires it):

```bash
python -m http.server 8000
# open http://localhost:8000
```

Do **not** open `index.html` as `file://` — the Service Worker will not register.

## Architecture

**Modular IIFE globals.** Each JS file defines one module as a `const` IIFE returning a public API, loaded in order via `<script>` tags in `index.html`. There is no import/export system. Load order matters: `config → i18n → data → auth → team → nav → picker → screen.* → main`.

**Module responsibilities:**

| Module | Role |
|--------|------|
| `js/config.js` | `CONFIG` (budget/limits/scoring), `TEAM_FLAGS`, `GROUPS`, `getGroupMatches()` |
| `js/i18n.js` | `TRANSLATIONS`, `currentLang` global, `t(key)`, `setLang(lang)` |
| `js/data.js` | `ALL_PLAYERS` global array (1152 players, 48 teams) |
| `js/auth.js` | `Auth` — localStorage user store, session, login/register/logout |
| `js/team.js` | `Team` — add/remove players, captain/vice/banker, budget math |
| `js/nav.js` | `Nav` — screen switching, theme, topbar, language toggle |
| `js/picker.js` | `Picker` — bottom-sheet player picker modal with filters |
| `js/screen.*.js` | One module per screen; each exposes `.render()` |
| `js/main.js` | `DOMContentLoaded` bootstrap: wires all event listeners, registers SW |

**Screen model:** Eight `<div id="screen-*" class="screen">` containers. `Nav.setScreen(name)` removes `.active` from all and adds it to the target, then calls the matching `Screen*.render()`. Login is a modal overlay, not a screen. Screens render their content into `innerHTML` on each `.render()` call — event handlers use inline `onclick="Module.method()"`.

**i18n system:** `data-i18n="key"` attributes on HTML elements are swapped by `setLang()` using `t(key)`. Placeholders use `data-i18n-ph`. Hard-coded strings inside JS modules use `t('key')` or `currentLang === 'he' ? '...' : '...'` directly. Direction toggled via `document.documentElement.dir`.

**Data flow:**
- `Auth` stores all users in `localStorage` under key `wc2026_users`; session username under `wc2026_session`
- `Team` reads/writes through `Auth.currentUser` (live object reference), calls `Auth.updateUser()` to persist
- Player point updates (`ScreenAdmin`) mutate the `ALL_PLAYERS` entry **and** the copy stored in each user's `team` array in localStorage
- Bets are stored separately under `wc2026_bets` (managed entirely in `ScreenBets`)
- Theme stored under `wc2026_theme`

**CSS split:**
- `css/base.css` — CSS variables, reset, topbar, nav, layout
- `css/screens.css` — per-screen styles
- `css/components.css` — shared components (modals, cards, buttons, picker)

## Key Constraints

- **Position limits:** GK×1, DEF×4 slots shown on pitch, MID×4, FWD×3 — defined in `CONFIG.POSITION_LIMITS`; `MAX_PER_TEAM: 2` limits players per nation
- **Budget:** 100M total, stored as float; use `parseFloat(...toFixed(1))` for all budget arithmetic to avoid float drift
- **Service Worker cache name** is `wc2026-v4.1` in `sw.js` — bump this string when deploying changed assets, or the browser will serve stale files
- **`files/` directory** at repo root contains old pre-refactor versions — not part of the live app, do not edit

## Default Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| KingMessi | demo | User |
| BlueMoon | demo | User |
| LionHeart | demo | User |
| SambaMagic | demo | User |

## File Structure

```
index.html / manifest.json / sw.js / icon-*.png  ← PWA root
css/base.css / screens.css / components.css       ← all styling
js/config.js                                      ← constants (scoring/limits/groups)
js/i18n.js                                        ← all UI strings (Hebrew + English)
js/data.js                                        ← ALL_PLAYERS array
js/auth.js / team.js / nav.js / picker.js         ← core logic modules
js/screen.groups.js / squad.js / myteam.js        ← screen modules
js/screen.lb.js / bets.js / rules.js / admin.js / user.js
js/main.js                                        ← bootstrap only
files/                                            ← archived old versions, not served
tools/                                            ← dev utilities, not part of the app
docs/                                             ← documentation only
```
