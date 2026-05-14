const TeamTheme = (() => {
    const STORAGE_KEY = 'wc2026_team_theme';

    // p=primary, pd=darker, g=glow-rgba, bg,card,el,el2,bd,bdb=backgrounds+borders, t1,t2=topbar gradient
    const TEAMS = {
        // ── CONMEBOL ──────────────────────────────────────────────
        'Argentina':     { p:'#74ACDF', pd:'#4a8abf', g:'rgba(116,172,223,.3)',  bg:'#04080f', card:'#09102a', el:'#0e1a3f', el2:'#12234d', bd:'#1a3a6b', bdb:'#2a5a9b', t1:'#74ACDF', t2:'#1a3f8c' },
        'Brazil':        { p:'#00a84f', pd:'#007a38', g:'rgba(0,168,79,.28)',     bg:'#030d06', card:'#071b0d', el:'#0b2a12', el2:'#0f3316', bd:'#174d22', bdb:'#226b30', t1:'#009c3b', t2:'#ffdf00' },
        'Uruguay':       { p:'#5AAADC', pd:'#3a8abf', g:'rgba(90,170,220,.28)',   bg:'#040810', card:'#091525', el:'#0e2038', el2:'#122843', bd:'#1a3a60', bdb:'#265588', t1:'#5AAADC', t2:'#1a3f8c' },
        'Colombia':      { p:'#FCD116', pd:'#d4af00', g:'rgba(252,209,22,.28)',   bg:'#0f0c02', card:'#1e1a04', el:'#2b2506', el2:'#352e07', bd:'#4f4409', bdb:'#6e5e0d', t1:'#FCD116', t2:'#003087' },
        'Chile':         { p:'#D52B1E', pd:'#a81f14', g:'rgba(213,43,30,.28)',    bg:'#0e0303', card:'#1e0707', el:'#2d0b0b', el2:'#380d0d', bd:'#5c1414', bdb:'#7d1c1c', t1:'#D52B1E', t2:'#0032a0' },
        'Ecuador':       { p:'#FFD100', pd:'#cca800', g:'rgba(255,209,0,.28)',    bg:'#0f0d02', card:'#1e1a04', el:'#2c2606', el2:'#362e07', bd:'#504408', bdb:'#6e5e0d', t1:'#FFD100', t2:'#003087' },
        'Peru':          { p:'#D91023', pd:'#a80c1b', g:'rgba(217,16,35,.28)',    bg:'#0e0203', card:'#1e0505', el:'#2c0909', el2:'#370b0b', bd:'#5a1012', bdb:'#7a1518', t1:'#D91023', t2:'#ffffff' },
        'Paraguay':      { p:'#D52B1E', pd:'#a81f14', g:'rgba(213,43,30,.28)',    bg:'#0e0303', card:'#1e0707', el:'#2d0b0b', el2:'#380d0d', bd:'#5c1414', bdb:'#7d1c1c', t1:'#D52B1E', t2:'#0038a8' },
        'Bolivia':       { p:'#D52B1E', pd:'#a81f14', g:'rgba(213,43,30,.28)',    bg:'#0e0303', card:'#1e0707', el:'#2d0b0b', el2:'#380d0d', bd:'#5c1414', bdb:'#7d1c1c', t1:'#D52B1E', t2:'#007a3d' },

        // ── CONCACAF ──────────────────────────────────────────────
        'Mexico':        { p:'#00703c', pd:'#005430', g:'rgba(0,112,60,.28)',     bg:'#030d07', card:'#071b0e', el:'#0b2915', el2:'#0e3219', bd:'#164c24', bdb:'#1f6a33', t1:'#006847', t2:'#CE1126' },
        'USA':           { p:'#3C3B6E', pd:'#2a2a52', g:'rgba(60,59,110,.28)',    bg:'#060609', card:'#0e0d18', el:'#161526', el2:'#1c1b31', bd:'#282750', bdb:'#39376e', t1:'#3C3B6E', t2:'#BF0A30' },
        'Canada':        { p:'#FF0000', pd:'#cc0000', g:'rgba(255,0,0,.25)',      bg:'#0f0303', card:'#1e0606', el:'#2d0a0a', el2:'#380c0c', bd:'#5c1313', bdb:'#7d1a1a', t1:'#FF0000', t2:'#000000' },
        'Costa Rica':    { p:'#002B7F', pd:'#001e5c', g:'rgba(0,43,127,.28)',     bg:'#04060f', card:'#090e22', el:'#0d1534', el2:'#111b3f', bd:'#192e62', bdb:'#23408a', t1:'#002B7F', t2:'#CE1126' },
        'Panama':        { p:'#DA121A', pd:'#a80e14', g:'rgba(218,18,26,.28)',    bg:'#0e0303', card:'#1e0606', el:'#2c0a0a', el2:'#370c0c', bd:'#5a1012', bdb:'#7a1518', t1:'#DA121A', t2:'#003893' },
        'Jamaica':       { p:'#FED100', pd:'#cca800', g:'rgba(254,209,0,.28)',    bg:'#0f0d02', card:'#1e1a04', el:'#2c2606', el2:'#362e07', bd:'#504408', bdb:'#6e5e0d', t1:'#FED100', t2:'#007A3D' },
        'Honduras':      { p:'#0073CF', pd:'#0059a0', g:'rgba(0,115,207,.28)',    bg:'#030a10', card:'#071625', el:'#0b2038', el2:'#0e2843', bd:'#143f65', bdb:'#1e598d', t1:'#0073CF', t2:'#000000' },
        'El Salvador':   { p:'#001489', pd:'#000e64', g:'rgba(0,20,137,.28)',     bg:'#040510', card:'#090c22', el:'#0d1234', el2:'#11173f', bd:'#192462', bdb:'#23348a', t1:'#001489', t2:'#0F4D8E' },

        // ── UEFA ──────────────────────────────────────────────────
        'France':        { p:'#2a52be', pd:'#1e3d94', g:'rgba(42,82,190,.28)',    bg:'#030609', card:'#080e1e', el:'#0c1530', el2:'#101c3b', bd:'#182e5f', bdb:'#234285', t1:'#002395', t2:'#ED2939' },
        'Germany':       { p:'#DD0000', pd:'#aa0000', g:'rgba(221,0,0,.25)',      bg:'#0e0303', card:'#1a0606', el:'#280909', el2:'#320b0b', bd:'#521010', bdb:'#701616', t1:'#DD0000', t2:'#FFCE00' },
        'Spain':         { p:'#c60b1e', pd:'#9a0918', g:'rgba(198,11,30,.28)',    bg:'#0e0204', card:'#1e0507', el:'#2d080b', el2:'#380a0d', bd:'#5c1014', bdb:'#7d1619', t1:'#C60B1E', t2:'#FFC400' },
        'Italy':         { p:'#0066cc', pd:'#004fa0', g:'rgba(0,102,204,.28)',    bg:'#030810', card:'#071520', el:'#0b2030', el2:'#0e273a', bd:'#143e5f', bdb:'#1e5882', t1:'#003399', t2:'#009246' },
        'England':       { p:'#CF0A2C', pd:'#a00822', g:'rgba(207,10,44,.28)',    bg:'#0e0205', card:'#1e0509', el:'#2d080e', el2:'#380a12', bd:'#5c101a', bdb:'#7d1625', t1:'#CF0A2C', t2:'#000000' },
        'Portugal':      { p:'#006600', pd:'#004d00', g:'rgba(0,102,0,.28)',      bg:'#030d03', card:'#071a07', el:'#0b280b', el2:'#0e310e', bd:'#164c16', bdb:'#1f6a1f', t1:'#006600', t2:'#FF0000' },
        'Netherlands':   { p:'#FF6300', pd:'#d45200', g:'rgba(255,99,0,.28)',     bg:'#0f0602', card:'#1e0f04', el:'#2d1606', el2:'#381b07', bd:'#5c2d0b', bdb:'#7d3e10', t1:'#FF6300', t2:'#003DA5' },
        'Belgium':       { p:'#FAE042', pd:'#d4bc35', g:'rgba(250,224,66,.28)',   bg:'#0f0e02', card:'#1e1c04', el:'#2c2906', el2:'#363207', bd:'#504b09', bdb:'#6e680d', t1:'#000000', t2:'#FAE042' },
        'Croatia':       { p:'#FF0000', pd:'#cc0000', g:'rgba(255,0,0,.25)',      bg:'#0e0303', card:'#1e0606', el:'#2d0a0a', el2:'#380c0c', bd:'#5c1313', bdb:'#7d1a1a', t1:'#FF0000', t2:'#FFFFFF' },
        'Denmark':       { p:'#C60C30', pd:'#9a0926', g:'rgba(198,12,48,.28)',    bg:'#0e0204', card:'#1e0508', el:'#2d080d', el2:'#380a10', bd:'#5c1019', bdb:'#7d1622', t1:'#C60C30', t2:'#000000' },
        'Switzerland':   { p:'#DC143C', pd:'#a80e2e', g:'rgba(220,20,60,.28)',    bg:'#0e0305', card:'#1e0609', el:'#2d0a0f', el2:'#380c12', bd:'#5c101b', bdb:'#7d1626', t1:'#DC143C', t2:'#FFFFFF' },
        'Austria':       { p:'#ED2939', pd:'#ba1e2c', g:'rgba(237,41,57,.28)',    bg:'#0e0304', card:'#1e0608', el:'#2d0a0d', el2:'#380c10', bd:'#5c1018', bdb:'#7d1622', t1:'#ED2939', t2:'#FFFFFF' },
        'Poland':        { p:'#DC143C', pd:'#a80e2e', g:'rgba(220,20,60,.28)',    bg:'#0e0305', card:'#1e0609', el:'#2d0a0f', el2:'#380c12', bd:'#5c101b', bdb:'#7d1626', t1:'#DC143C', t2:'#FFFFFF' },
        'Ukraine':       { p:'#FFD500', pd:'#ccaa00', g:'rgba(255,213,0,.28)',    bg:'#0f0e02', card:'#1e1b04', el:'#2c2806', el2:'#362f07', bd:'#504508', bdb:'#6e5f0d', t1:'#005BBB', t2:'#FFD500' },
        'Sweden':        { p:'#006AA7', pd:'#005180', g:'rgba(0,106,167,.28)',    bg:'#030910', card:'#071522', el:'#0b2034', el2:'#0e273f', bd:'#144062', bdb:'#1e5a88', t1:'#006AA7', t2:'#FECC02' },
        'Czech Republic':{ p:'#D7141A', pd:'#a81014', g:'rgba(215,20,26,.28)',    bg:'#0e0303', card:'#1e0606', el:'#2d0a0a', el2:'#380c0c', bd:'#5c1212', bdb:'#7d1919', t1:'#D7141A', t2:'#11457E' },

        // ── CAF ───────────────────────────────────────────────────
        'Morocco':       { p:'#C1272D', pd:'#941f22', g:'rgba(193,39,45,.28)',    bg:'#0e0304', card:'#1e0607', el:'#2d0a0b', el2:'#380c0e', bd:'#5c1014', bdb:'#7d1619', t1:'#C1272D', t2:'#006233' },
        'Senegal':       { p:'#00853F', pd:'#006630', g:'rgba(0,133,63,.28)',     bg:'#030d06', card:'#071b0d', el:'#0b2912', el2:'#0e3216', bd:'#164c21', bdb:'#1f6a2f', t1:'#00853F', t2:'#FDEF42' },
        'Tunisia':       { p:'#E70013', pd:'#b5000f', g:'rgba(231,0,19,.28)',     bg:'#0e0203', card:'#1e0506', el:'#2d0809', el2:'#38090b', bd:'#5c1010', bdb:'#7d1616', t1:'#E70013', t2:'#FFFFFF' },
        'Algeria':       { p:'#006233', pd:'#004a27', g:'rgba(0,98,51,.28)',      bg:'#030d06', card:'#071a0c', el:'#0b2811', el2:'#0e3115', bd:'#164a1f', bdb:'#1f672b', t1:'#006233', t2:'#FFFFFF' },
        'Nigeria':       { p:'#008751', pd:'#00673e', g:'rgba(0,135,81,.28)',     bg:'#030d07', card:'#071b0e', el:'#0b2914', el2:'#0e3218', bd:'#164d23', bdb:'#1f6b32', t1:'#008751', t2:'#FFFFFF' },
        'Egypt':         { p:'#CE1126', pd:'#a00d1e', g:'rgba(206,17,38,.28)',    bg:'#0e0304', card:'#1e0607', el:'#2d0a0b', el2:'#380c0e', bd:'#5c1013', bdb:'#7d1619', t1:'#CE1126', t2:'#000000' },
        'Cameroon':      { p:'#007A5E', pd:'#005c46', g:'rgba(0,122,94,.28)',     bg:'#030e0b', card:'#071d15', el:'#0b2c20', el2:'#0e3527', bd:'#16523b', bdb:'#1f7253', t1:'#007A5E', t2:'#CE1126' },
        'Ghana':         { p:'#FCD116', pd:'#cca900', g:'rgba(252,209,22,.28)',   bg:'#0f0d02', card:'#1e1b04', el:'#2c2806', el2:'#362f07', bd:'#504508', bdb:'#6e5f0d', t1:'#006B3F', t2:'#FCD116' },

        // ── AFC + OFC ─────────────────────────────────────────────
        'Japan':         { p:'#BC002D', pd:'#900023', g:'rgba(188,0,45,.28)',     bg:'#0e0204', card:'#1e0508', el:'#2d080d', el2:'#380a10', bd:'#5c1018', bdb:'#7d1622', t1:'#BC002D', t2:'#FFFFFF' },
        'South Korea':   { p:'#CD2E3A', pd:'#a0232d', g:'rgba(205,46,58,.28)',    bg:'#0e0304', card:'#1e0608', el:'#2d0a0d', el2:'#380c10', bd:'#5c1018', bdb:'#7d1622', t1:'#CD2E3A', t2:'#003478' },
        'Australia':     { p:'#FFD700', pd:'#ccac00', g:'rgba(255,215,0,.28)',    bg:'#0f0e02', card:'#1e1c04', el:'#2c2a06', el2:'#363207', bd:'#504c09', bdb:'#6e680d', t1:'#FFD700', t2:'#00843D' },
        'Iran':          { p:'#239F40', pd:'#1b7a31', g:'rgba(35,159,64,.28)',    bg:'#030d06', card:'#071b0c', el:'#0b2911', el2:'#0e3215', bd:'#164c1f', bdb:'#1f6a2c', t1:'#239F40', t2:'#DA0000' },
        'Saudi Arabia':  { p:'#165C38', pd:'#0f452a', g:'rgba(22,92,56,.28)',     bg:'#030e07', card:'#071e0e', el:'#0b2d15', el2:'#0e371a', bd:'#165427', bdb:'#1f7437', t1:'#165C38', t2:'#FFFFFF' },
        'Qatar':         { p:'#8D1B3D', pd:'#6a142e', g:'rgba(141,27,61,.28)',    bg:'#0e0306', card:'#1e060e', el:'#2d0a17', el2:'#380c1c', bd:'#5c102c', bdb:'#7d163d', t1:'#8D1B3D', t2:'#FFFFFF' },
        'New Zealand':   { p:'#00247D', pd:'#001c60', g:'rgba(0,36,125,.28)',     bg:'#040610', card:'#090f23', el:'#0e1637', el2:'#121e44', bd:'#193068', bdb:'#234392', t1:'#00247D', t2:'#CC0000' },
    };

    const REGIONS = [
        { name: 'CONMEBOL', teams: ['Argentina','Brazil','Uruguay','Colombia','Chile','Ecuador','Peru','Paraguay','Bolivia'] },
        { name: 'CONCACAF', teams: ['Mexico','USA','Canada','Costa Rica','Panama','Jamaica','Honduras','El Salvador'] },
        { name: 'UEFA',     teams: ['France','Germany','Spain','Italy','England','Portugal','Netherlands','Belgium','Croatia','Denmark','Switzerland','Austria','Poland','Ukraine','Sweden','Czech Republic'] },
        { name: 'CAF',      teams: ['Morocco','Senegal','Tunisia','Algeria','Nigeria','Egypt','Cameroon','Ghana'] },
        { name: 'AFC / OFC',teams: ['Japan','South Korea','Australia','Iran','Saudi Arabia','Qatar','New Zealand'] },
    ];

    let current = null;

    function hexRgb(hex) {
        const h = hex.replace('#','');
        return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
    }

    function apply(teamName) {
        current = teamName || null;
        const el = document.getElementById('team-theme-style') || (() => {
            const s = document.createElement('style');
            s.id = 'team-theme-style';
            document.head.appendChild(s);
            return s;
        })();

        if (!teamName || !TEAMS[teamName]) {
            el.textContent = '';
            localStorage.removeItem(STORAGE_KEY);
            _updateTopbar();
            closePicker();
            return;
        }

        const t  = TEAMS[teamName];
        const p  = hexRgb(t.p);
        const t2 = hexRgb(t.t2.startsWith('#') ? t.t2 : t.t1);

        el.textContent = `
/* ── CSS variables ── */
:root {
  --primary:       ${t.p};
  --primary-d:     ${t.pd};
  --primary-glow:  rgba(${p},.28);
  --bg:            ${t.bg};
  --bg2:           ${t.bg};
  --card:          ${t.card};
  --elevated:      ${t.el};
  --elevated2:     ${t.el2};
  --border:        ${t.bd};
  --border-bright: ${t.bdb};
}
html.theme-light {
  --primary:       ${t.p};
  --primary-d:     ${t.pd};
  --primary-glow:  rgba(${p},.18);
}

/* ── Body: kit pattern + radial corner glows ── */
body {
  background:
    repeating-linear-gradient(
      -58deg,
      transparent 0px, transparent 28px,
      rgba(${p},.035) 28px, rgba(${p},.035) 29px
    ),
    radial-gradient(ellipse 85% 65% at 5% 95%,  rgba(${p},.18) 0%, transparent 60%),
    radial-gradient(ellipse 65% 55% at 95% 5%,  rgba(${t2},.12) 0%, transparent 55%),
    ${t.bg} !important;
}

/* ── Topbar: gradient + shimmer sweep ── */
#topbar {
  background: linear-gradient(135deg, ${t.t1} 0%, ${t.t2} 100%) !important;
  box-shadow: 0 3px 24px rgba(${p},.45), 0 1px 0 rgba(255,255,255,.08) !important;
  overflow: hidden !important;
}
#topbar::after {
  content: '';
  position: absolute; top: -60%; left: -120%;
  width: 60%; height: 220%;
  background: linear-gradient(105deg, transparent, rgba(255,255,255,.2), transparent);
  animation: tt-shine 5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes tt-shine {
  0%, 100% { left: -120%; opacity: 0; }
  15%       { opacity: 1; }
  35%       { left: 180%; opacity: 0; }
}

/* ── Nav bar: background tint + active glow ── */
#bottom-nav {
  background: rgba(${p},.06) !important;
  border-bottom: 1px solid rgba(${p},.18) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,.5) !important;
}
#bottom-nav button.active {
  background: rgba(${p},.14) !important;
  border-bottom-color: ${t.p} !important;
}
#bottom-nav button.active .nav-icon {
  filter: drop-shadow(0 0 7px rgba(${p},.9)) !important;
}

/* ── Cards: team-tinted border glow ── */
.group-card, .squad-group, .lb-row, .bet-card {
  box-shadow: 0 4px 16px rgba(0,0,0,.5), 0 0 0 1px rgba(${p},.14) !important;
  transition: box-shadow .25s, transform .2s !important;
}
.group-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,.65), 0 0 24px rgba(${p},.22), 0 0 0 1px rgba(${p},.35) !important;
}
.pitch-wrap {
  border-color: rgba(${p},.4) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,.5), 0 0 40px rgba(${p},.12) !important;
}

/* ── Screen headers: team gradient tint ── */
.screen-header {
  background: linear-gradient(135deg,
    rgba(${p},.18) 0%, rgba(${p},.06) 100%) !important;
  border-bottom-color: rgba(${p},.3) !important;
}

/* ── Input focus ── */
input:focus, textarea:focus {
  border-color: ${t.p} !important;
  box-shadow: 0 0 0 3px rgba(${p},.2), 0 0 12px rgba(${p},.15) !important;
  outline: none !important;
}

/* ── Send/confirm buttons glow ── */
.chat-send, .bet-btn-confirm, .pick-apply {
  box-shadow: 0 4px 18px rgba(${p},.4) !important;
}

/* ── Chat tabs active glow ── */
.chat-tab.active {
  text-shadow: 0 0 14px rgba(${p},.8);
}

/* ── Pitch: inner team glow ── */
.pitch {
  box-shadow: inset 0 0 80px rgba(${p},.07), inset 0 0 20px rgba(0,0,0,.4) !important;
}`;

        localStorage.setItem(STORAGE_KEY, teamName);
        _updateTopbar();
        closePicker();
    }

    function _updateTopbar() {
        const btn = document.getElementById('btn-team-theme');
        if (!btn) return;
        if (current && TEAMS[current]) {
            btn.textContent = TEAM_FLAGS[current] || '🎨';
            btn.title = current;
        } else {
            btn.textContent = '🎨';
            btn.title = currentLang === 'he' ? 'ערכת נבחרת' : 'Team Theme';
        }
    }

    function restore() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && TEAMS[saved]) apply(saved);
        else _updateTopbar();
    }

    function openPicker() {
        const overlay = document.getElementById('team-theme-picker');
        overlay.innerHTML = _buildPickerHTML();
        overlay.classList.add('active');
    }

    function closePicker() {
        document.getElementById('team-theme-picker')?.classList.remove('active');
    }

    function _buildPickerHTML() {
        const title = currentLang === 'he' ? 'ערכת נבחרת' : 'Team Theme';
        const resetLabel = currentLang === 'he' ? '↩ ברירת מחדל' : '↩ Default';
        return `
<div class="ttp-box" onclick="event.stopPropagation()">
  <div class="ttp-header">
    <h3>🎨 ${title}</h3>
    <button onclick="TeamTheme.closePicker()">✕</button>
  </div>
  <div class="ttp-scroll">
    <button class="ttp-reset${!current ? ' ttp-active' : ''}" onclick="TeamTheme.apply(null)">${resetLabel}</button>
    ${REGIONS.map(r => `
      <div class="ttp-region">${r.name}</div>
      <div class="ttp-grid">
        ${r.teams.filter(t => TEAMS[t]).map(t => `
          <button class="ttp-item${current === t ? ' ttp-active' : ''}"
                  onclick="TeamTheme.apply('${t}')"
                  style="--ttp-color:${TEAMS[t].p}">
            <span class="ttp-flag">${TEAM_FLAGS[t] || ''}</span>
            <span class="ttp-name">${t}</span>
          </button>`).join('')}
      </div>`).join('')}
  </div>
</div>`;
    }

    return { apply, restore, openPicker, closePicker };
})();
