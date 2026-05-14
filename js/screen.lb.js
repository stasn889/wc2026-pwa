const ScreenLB = (() => {
    function render() {
        const users = Auth.getAllUsers()
            .filter(u => !u.isAdmin)
            .sort((a,b) => (b.points||0) - (a.points||0));
        const me = Auth.currentUser ? Auth.currentUser.username : '';

        const podiumOrder = [users[1], users[0], users[2]]; // 2nd, 1st, 3rd
        const podiumSlots = [2, 1, 3];
        const podiumPodHTML = users.length >= 1 ? `
            <div class="lb-podium">
                ${podiumOrder.map((u, i) => u ? `
                    <div class="lb-podium-slot lb-podium-${podiumSlots[i]}">
                        <div class="lb-podium-avatar">${u.username.charAt(0).toUpperCase()}</div>
                        <div class="lb-podium-name">${u.username}</div>
                        <div class="lb-podium-pts">${u.points||0} ${t('pts')}</div>
                        <div class="lb-podium-bar"></div>
                    </div>` : '').join('')}
            </div>` : '';

        const el = document.getElementById('screen-lb');
        el.innerHTML = `
            <div class="screen-header"><h2>${t('standings')}</h2></div>
            ${podiumPodHTML}
            <div class="lb-table">
                <div class="lb-head">
                    <span>${t('rank')}</span>
                    <span>${t('user')}</span>
                    <span>${t('players')}</span>
                    <span>${t('points')}</span>
                </div>
                ${users.map((u,i) => `
                    <div class="lb-row${u.username===me?' lb-me':''}" onclick="ScreenLB.openProfile('${u.username}')">
                        <span class="lb-rank${i<3?' lb-rank-'+(i+1):''}">
                            ${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
                        </span>
                        <span class="lb-name">${u.username}${u.username===me?' ★':''}</span>
                        <span>${(u.team||[]).length}/11</span>
                        <span class="lb-pts">${u.points||0}</span>
                    </div>`).join('')}
            </div>
            <div id="profile-modal" class="modal-overlay"></div>`;
    }

    function openProfile(username) {
        const users = Auth.getAllUsers();
        const u = users.find(x => x.username === username);
        if (!u) return;
        const modal = document.getElementById('profile-modal');
        modal.innerHTML = `
            <div class="modal-box">
                <div class="modal-header">
                    <h3>👤 ${u.username}</h3>
                    <button onclick="ScreenLB.closeProfile()">✕</button>
                </div>
                <div class="profile-stats">
                    <div class="stat-pill">⭐ ${u.points||0} ${t('pts')}</div>
                    <div class="stat-pill">👥 ${(u.team||[]).length}/11</div>
                    <div class="stat-pill">💰 ${u.budget||0}M</div>
                </div>
                <div class="profile-team">
                    ${(u.team||[]).length === 0
                        ? `<p class="empty-msg">${t('noPlayers')}</p>`
                        : (u.team||[]).map(p => `
                            <div class="profile-player">
                                <span class="pi-pos" style="background:${CONFIG.POSITION_COLORS[p.position]}">${p.position}</span>
                                <span>${p.name}</span>
                                <span>${TEAM_FLAGS[p.team]||''} ${p.team}</span>
                                <span>${p.points||0} ${t('pts')}</span>
                            </div>`).join('')}
                </div>
            </div>`;
        modal.classList.add('active');
    }

    function closeProfile() {
        const modal = document.getElementById('profile-modal');
        if (modal) modal.classList.remove('active');
    }

    return { render, openProfile, closeProfile };
})();
