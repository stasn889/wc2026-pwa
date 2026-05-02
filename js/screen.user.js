const ScreenUser = (() => {
    function render() {
        const el = document.getElementById('screen-user');
        const u  = Auth.currentUser;

        if (!u) {
            el.innerHTML = `
                <div class="screen-header"><h2>${t('profile')}</h2></div>
                <div class="user-guest">
                    <div class="user-avatar-lg">👤</div>
                    <p style="color:var(--muted);margin:16px 0 20px">${t('loginToUse')}</p>
                    <button class="btn-primary" style="padding:12px 32px"
                        onclick="document.getElementById('login-modal').classList.add('active')">
                        ${t('login')}
                    </button>
                </div>`;
            return;
        }

        const stats = Team.getStats();
        const initials = u.username.slice(0, 2).toUpperCase();
        el.innerHTML = `
            <div class="screen-header"><h2>${t('profile')}</h2></div>
            <div class="user-hero">
                <div class="user-avatar-circle">${initials}</div>
                <div class="user-hero-info">
                    <h2>${u.username}</h2>
                    ${u.isAdmin ? '<span class="user-admin-tag">⚙️ Admin</span>' : ''}
                </div>
            </div>
            <div class="mt-stats" style="margin-bottom:16px">
                <div class="stat-pill">🏆 ${u.points||0} ${t('pts')}</div>
                <div class="stat-pill">🪙 ${u.coins||0}</div>
                <div class="stat-pill">💰 ${stats.budget.toFixed(1)}M</div>
                <div class="stat-pill">👥 ${stats.count}/11</div>
            </div>
            <div class="user-actions">
                <button class="user-action-btn" onclick="Nav.setScreen('rules')">
                    <span>📋</span><span>${t('rules')}</span>
                </button>
                <button class="user-action-btn" onclick="Nav.setScreen('bets');setTimeout(()=>ScreenBets.openCreate(),50)">
                    <span>🎲</span><span>${t('createBet')}</span>
                </button>
                <button class="user-action-btn user-action-danger" onclick="Auth.logout();Nav.updateTopbar();Nav.setScreen('groups')">
                    <span>🚪</span><span>${t('logout')}</span>
                </button>
            </div>`;
    }

    return { render };
})();
