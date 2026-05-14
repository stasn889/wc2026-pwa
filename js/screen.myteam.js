const ScreenMyTeam = (() => {
    function render() {
        const stats = Team.getStats();
        const el = document.getElementById('screen-myteam');
        el.innerHTML = `
            <div class="mt-stats">
                <div class="stat-pill">💰 ${stats.budget.toFixed(1)}M</div>
                <div class="stat-pill">👥 ${stats.count}/11</div>
                <div class="stat-pill">⭐ ${stats.points} ${t('pts')}</div>
                <div class="stat-pill">💎 ${stats.value}M</div>
                ${stats.bankerValue > 0 ? `<div class="stat-pill pill-banker">🔒 ${stats.bankerValue}M</div>` : ''}
            </div>
            ${captainSummary()}
            <div class="pitch-wrap">
                <div class="pitch">
                    ${renderRow('FWD')}
                    ${renderRow('MID')}
                    ${renderRow('DEF')}
                    ${renderRow('GK')}
                </div>
            </div>`;
    }

    function captainSummary() {
        const cap  = Team.getCaptain();
        const vice = Team.getViceCaptain();
        const team = Team.get();
        const capP  = team.find(p => p.id === cap);
        const viceP = team.find(p => p.id === vice);
        if (!capP && !viceP) return '';
        return `
            <div class="captain-summary">
                ${capP  ? `<span class="cs-badge cs-c1">C1 👑 ${shortName(capP.name)}</span>` : ''}
                ${viceP ? `<span class="cs-badge cs-c2">C2 🥈 ${shortName(viceP.name)}</span>` : ''}
            </div>`;
    }

    function renderRow(pos) {
        const team  = Team.get();
        const cap   = Team.getCaptain();
        const vice  = Team.getViceCaptain();
        const inPos = team.filter(p => p.position === pos);
        const color = CONFIG.POSITION_COLORS[pos];
        const limit = pos === 'GK' ? 1 : pos === 'FWD' ? 3 : 4;

        let slots = '';
        inPos.forEach(p => {
            const isCap    = cap  === p.id;
            const isVice   = vice === p.id;
            const isBanker = Team.isBanker(p.id);
            slots += `
                <div class="pitch-card" style="border-color:${color}"
                     onclick="ScreenMyTeam.tapPlayer(${p.id})">
                    <div class="pc-badges">
                        ${isCap    ? '<span class="pcb pcb-c1">C1</span>' : ''}
                        ${isVice   ? '<span class="pcb pcb-c2">C2</span>' : ''}
                        ${isBanker ? '<span class="pcb pcb-b">B</span>'   : ''}
                    </div>
                    ${playerAvatarHtml(p.name, 'pc-avatar')}
                    <div class="pc-name">${shortName(p.name)}</div>
                    <div class="pc-team">${TEAM_FLAGS[p.team]||''}</div>
                    <div class="pc-pts">${p.points||0} ${t('pts')}</div>
                </div>`;
        });

        for (let i = 0; i < Math.max(0, limit - inPos.length); i++) {
            slots += `
                <div class="pitch-slot" style="border-color:${color}"
                     onclick="Picker.open('${pos}', null)">
                    <div class="slot-pos" style="color:${color}">${pos}</div>
                    <div class="slot-plus">+</div>
                </div>`;
        }

        return `<div class="pitch-row">${slots}</div>`;
    }

    function tapPlayer(playerId) {
        const team = Team.get();
        const p    = team.find(x => x.id === playerId);
        if (!p) return;

        const isCap    = Team.getCaptain()    === playerId;
        const isVice   = Team.getViceCaptain()=== playerId;
        const isBanker = Team.isBanker(playerId);
        const color    = CONFIG.POSITION_COLORS[p.position];
        const modal = document.getElementById('player-action-modal');
        modal.innerHTML = `
            <div class="player-action-sheet">
                <div class="pas-header">
                    ${playerAvatarHtml(p.name, 'pc-avatar pas-avatar')}
                    <div>
                        <div style="font-weight:800;font-size:15px">${p.name}</div>
                        <div style="color:var(--muted);font-size:12px">${TEAM_FLAGS[p.team]||''} ${p.team} · ${p.price}M</div>
                    </div>
                    <button class="pas-close" onclick="document.getElementById('player-action-modal').classList.remove('active')">✕</button>
                </div>
                <div class="pas-actions">
                    <button class="pas-btn ${isCap ? 'pas-active-c' : ''}"
                        onclick="Team.setCaptain(${p.id});ScreenMyTeam.render();document.getElementById('player-action-modal').classList.remove('active')">
                        👑 C1 — ${t('captain')} ${isCap ? '✓' : ''}
                    </button>
                    <button class="pas-btn ${isVice ? 'pas-active-v' : ''}"
                        onclick="Team.setViceCaptain(${p.id});ScreenMyTeam.render();document.getElementById('player-action-modal').classList.remove('active')">
                        🥈 C2 — ${t('viceCaptain')} ${isVice ? '✓' : ''}
                    </button>
                    <button class="pas-btn ${isBanker ? 'pas-active-b' : ''}"
                        onclick="Team.toggleBanker(${p.id});ScreenMyTeam.render();document.getElementById('player-action-modal').classList.remove('active')">
                        🔒 ${t('banker')} ${isBanker ? '✓' : ''}
                    </button>
                    <button class="pas-btn pas-remove"
                        onclick="Team.remove(${p.id});ScreenMyTeam.render();document.getElementById('player-action-modal').classList.remove('active')">
                        ✕ ${t('removePlayer')}
                    </button>
                </div>
            </div>`;
        modal.classList.add('active');
        modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };
    }

    function shortName(name) {
        const parts = name.trim().split(' ');
        if (parts.length === 1) return name;
        return parts[0][0] + '. ' + parts[parts.length - 1];
    }

    return { render, tapPlayer };
})();
