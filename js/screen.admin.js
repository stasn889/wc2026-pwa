const ScreenAdmin = (() => {
    function render() {
        if (!Auth.currentUser?.isAdmin) return;
        const users = Auth.getAllUsers().filter(u => u.username !== 'admin');
        const el = document.getElementById('screen-admin');
        el.innerHTML = `
            <div class="screen-header"><h2>${t('admin')}</h2></div>
            <div class="admin-section">
                <h3>${t('updateScore')}</h3>
                <input type="text" id="admin-search" placeholder="${t('searchPlayer')}"
                    oninput="ScreenAdmin.searchPlayers(this.value)" class="admin-input" />
                <div id="admin-results"></div>
            </div>
            <div class="admin-section">
                <h3>${t('manageUsers')}</h3>
                <div class="users-list">
                    ${users.map(u => `
                        <div class="admin-user-row">
                            <span class="au-name">${u.username}</span>
                            <span class="au-pts">${u.points||0} ${t('pts')}</span>
                            <div class="au-actions">
                                <button class="btn-sm btn-primary" onclick="ScreenAdmin.editPts('${u.username}')">✏️</button>
                                <button class="btn-sm ${u.isAdmin?'btn-warning':'btn-secondary'}"
                                    onclick="ScreenAdmin.toggleAdmin('${u.username}')">
                                    ${u.isAdmin ? t('removeAdmin') : t('makeAdmin')}
                                </button>
                                <button class="btn-sm btn-danger" onclick="ScreenAdmin.deleteUser('${u.username}')">🗑</button>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`;
    }

    function searchPlayers(query) {
        const results = document.getElementById('admin-results');
        if (!query) { results.innerHTML = ''; return; }
        const found = ALL_PLAYERS.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
        results.innerHTML = found.map(p => `
            <div class="admin-player-item" onclick="ScreenAdmin.openScoreModal(${p.id})">
                <span class="pi-pos" style="background:${CONFIG.POSITION_COLORS[p.position]}">${p.position}</span>
                <span>${p.name}</span>
                <span>${TEAM_FLAGS[p.team]||''} ${p.team}</span>
                <span>${p.points||0} ${t('pts')}</span>
            </div>`).join('');
    }

    function openScoreModal(playerId) {
        const p = ALL_PLAYERS.find(x => x.id === playerId);
        if (!p) return;
        const modal = document.getElementById('score-modal');
        modal.innerHTML = `
            <div class="modal-box">
                <div class="modal-header">
                    <h3>${p.name} — ${p.team}</h3>
                    <button onclick="ScreenAdmin.closeScoreModal()">✕</button>
                </div>
                <div class="score-form">
                    ${scoreRow('goals',    t('goals'),    'number', 0)}
                    ${scoreRow('assists',  t('assists'),  'number', 0)}
                    ${scoreRow('cs',       t('cleanSheet'),'checkbox', false)}
                    ${scoreRow('yellow',   t('yellowCards'),'number', 0)}
                    ${scoreRow('red',      t('redCard'),  'checkbox', false)}
                </div>
                <button class="btn-primary btn-full" onclick="ScreenAdmin.saveScore(${p.id})">${t('saveScore')}</button>
            </div>`;
        modal.classList.add('active');
    }

    function scoreRow(id, label, type, def) {
        if (type === 'checkbox')
            return `<div class="score-row"><label>${label}</label><input type="checkbox" id="sc-${id}"></div>`;
        return `<div class="score-row"><label>${label}</label><input type="number" id="sc-${id}" value="${def}" min="0"></div>`;
    }

    function saveScore(playerId) {
        const p = ALL_PLAYERS.find(x => x.id === playerId);
        if (!p) return;
        const goals  = parseInt(document.getElementById('sc-goals').value)  || 0;
        const assists= parseInt(document.getElementById('sc-assists').value) || 0;
        const cs     = document.getElementById('sc-cs').checked;
        const yellow = parseInt(document.getElementById('sc-yellow').value)  || 0;
        const red    = document.getElementById('sc-red').checked;

        const pos = p.position;
        let pts = CONFIG.SCORING.goal[pos] * goals
                + CONFIG.SCORING.assist   * assists
                + (cs ? CONFIG.SCORING.cleanSheet[pos] : 0)
                + CONFIG.SCORING.yellowCard * yellow
                + (red ? CONFIG.SCORING.redCard : 0);

        p.points = (p.points || 0) + pts;

        // Sync to all users' teams
        Auth.getAllUsers().forEach(u => {
            const tp = (u.team||[]).find(x => x.id === playerId);
            if (tp) {
                tp.points = p.points;
                u.points = (u.team||[]).reduce((s,x) => s+(x.points||0), 0);
            }
        });
        Auth.updateUser();
        closeScoreModal();
        render();
    }

    function closeScoreModal() {
        document.getElementById('score-modal').classList.remove('active');
    }

    function editPts(username) {
        const val = prompt(t('setValue'), '0');
        if (val === null) return;
        Auth.setUserPoints(username, parseInt(val) || 0);
        render();
    }

    function toggleAdmin(username) {
        const users = Auth.getAllUsers();
        const u = users.find(x => x.username === username);
        if (u) Auth.setAdmin(username, !u.isAdmin);
        render();
    }

    function deleteUser(username) {
        if (!confirm(username + '?')) return;
        Auth.deleteUser(username);
        render();
    }

    return { render, searchPlayers, openScoreModal, saveScore, closeScoreModal, editPts, toggleAdmin, deleteUser };
})();
