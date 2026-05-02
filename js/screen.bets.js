const ScreenBets = (() => {
    const BETS_KEY = 'wc2026_bets';

    function getBets() {
        try { return JSON.parse(localStorage.getItem(BETS_KEY)) || []; }
        catch (e) { return []; }
    }

    function saveBets(bets) {
        localStorage.setItem(BETS_KEY, JSON.stringify(bets));
    }

    function teamOptions(selected) {
        return Object.keys(TEAM_FLAGS)
            .map(t => `<option value="${t}"${t === selected ? ' selected' : ''}>${TEAM_FLAGS[t]} ${t}</option>`)
            .join('');
    }

    function render() {
        const el   = document.getElementById('screen-bets');
        const bets = getBets();
        const u    = Auth.currentUser;

        el.innerHTML = `
            <div class="screen-header">
                <h2>🎲 ${t('bets')}</h2>
                ${u ? `<button class="btn-primary btn-sm" onclick="ScreenBets.openCreate()">+ ${t('createBet')}</button>` : ''}
            </div>
            ${bets.length === 0
                ? `<div class="empty-msg" style="padding:40px 0">${t('noBets')}</div>`
                : bets.map(b => renderCard(b, u)).join('')
            }`;
    }

    function renderCard(bet, u) {
        const flagA      = TEAM_FLAGS[bet.teamA] || '';
        const flagB      = TEAM_FLAGS[bet.teamB] || '';
        const isCreator  = u && u.username === bet.creator;
        const hasJoined  = u && bet.participants.includes(u.username);
        const isFull     = bet.participants.length >= bet.maxParticipants;
        const canJoin    = u && !isCreator && !hasJoined && !isFull && bet.status === 'open';
        const isAdmin    = u && u.isAdmin;
        const canDelete  = bet.status === 'open' && ((isCreator && bet.participants.length === 0) || isAdmin);
        const canResolve = isAdmin && bet.status === 'open' && bet.participants.length > 0;

        let statusArea = '';
        if (bet.status === 'resolved') {
            const winnerName = bet.winner === 'teamA' ? bet.teamA : bet.teamB;
            statusArea = `<span class="bet-badge-resolved">🏅 ${t('betWonBy')} ${TEAM_FLAGS[winnerName] || ''} ${winnerName}</span>`;
        } else if (isFull) {
            statusArea = `<span class="bet-tag-full">${t('betFull')}</span>`;
        }

        return `
            <div class="bet-card${bet.status === 'resolved' ? ' bet-resolved' : ''}">
                <div class="bet-teams">
                    <div class="bet-side">
                        <span class="bet-flag">${flagA}</span>
                        <span class="bet-tname">${bet.teamA}</span>
                        <span class="bet-creator-label">${t('betCreatorLabel')}</span>
                    </div>
                    <span class="bet-vs">${t('vs')}</span>
                    <div class="bet-side bet-side-b">
                        <span class="bet-flag">${flagB}</span>
                        <span class="bet-tname">${bet.teamB}</span>
                        <span class="bet-creator-label">${t('betJoinerLabel')}</span>
                    </div>
                </div>
                <div class="bet-terms">
                    <span class="bet-win">🏆 ${t('betWinLabel')}: <strong>+${bet.coinsWin}</strong> 🪙</span>
                    <span class="bet-lose">❌ ${t('betLoseLabel')}: <strong>+${bet.coinsLose}</strong> 🪙</span>
                </div>
                <div class="bet-meta">
                    👤 ${t('betCreatedBy')} <strong>${bet.creator}</strong>
                    &nbsp;·&nbsp;
                    👥 ${bet.participants.length} / ${bet.maxParticipants} ${t('betParticipants')}
                    ${bet.participants.length > 0 ? `&nbsp;·&nbsp; ${bet.participants.join(', ')}` : ''}
                </div>
                <div class="bet-actions">
                    ${isCreator   ? `<span class="bet-badge-mine">${t('betMyBet')}</span>`   : ''}
                    ${hasJoined   ? `<span class="bet-badge-joined">${t('betJoined')}</span>` : ''}
                    ${statusArea}
                    ${canJoin     ? `<button class="btn-add-sm" onclick="ScreenBets.confirmJoin(${bet.id})">${t('betJoin')}</button>` : ''}
                    ${canResolve  ? `<button class="btn-warning btn-sm" onclick="ScreenBets.openResolve(${bet.id})">${t('betFinish')}</button>` : ''}
                    ${canDelete   ? `<button class="btn-danger btn-sm" onclick="ScreenBets.deleteBet(${bet.id})">${t('betDelete')}</button>` : ''}
                </div>
            </div>`;
    }

    function openCreate() {
        if (!Auth.currentUser) {
            document.getElementById('login-modal').classList.add('active');
            return;
        }
        const modal = document.getElementById('bet-create-modal');
        modal.innerHTML = `
            <div class="modal-box">
                <div class="modal-header">
                    <h3>🎲 ${t('createBet')}</h3>
                    <button onclick="document.getElementById('bet-create-modal').classList.remove('active')">✕</button>
                </div>
                <div class="bet-form">
                    <div class="bet-form-row">
                        <label>${t('betVsLabel')}</label>
                        <select id="bc-teamA" class="admin-input">${teamOptions('Argentina')}</select>
                    </div>
                    <div class="bet-form-row">
                        <label>${t('betAgainst')}</label>
                        <select id="bc-teamB" class="admin-input">${teamOptions('France')}</select>
                    </div>
                    <div class="score-row">
                        <label>${t('betOnWin')}</label>
                        <input type="number" id="bc-win" value="50" min="1" max="999" class="score-num-input">
                    </div>
                    <div class="score-row">
                        <label>${t('betOnLose')}</label>
                        <input type="number" id="bc-lose" value="30" min="1" max="999" class="score-num-input">
                    </div>
                    <div class="score-row">
                        <label>${t('betMaxP')}</label>
                        <input type="number" id="bc-max" value="5" min="1" max="50" class="score-num-input">
                    </div>
                    <button class="btn-primary btn-full" style="margin-top:4px" onclick="ScreenBets.submitCreate()">
                        ${t('betConfirm')}
                    </button>
                </div>
            </div>`;
        modal.classList.add('active');
        modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };
    }

    function submitCreate() {
        const teamA = document.getElementById('bc-teamA').value;
        const teamB = document.getElementById('bc-teamB').value;
        const win   = parseInt(document.getElementById('bc-win').value)  || 0;
        const lose  = parseInt(document.getElementById('bc-lose').value) || 0;
        const max   = parseInt(document.getElementById('bc-max').value)  || 0;

        if (teamA === teamB) { alert(currentLang === 'he' ? 'בחר שתי נבחרות שונות' : 'Pick two different teams'); return; }
        if (win  < 1)        { alert(currentLang === 'he' ? 'ערך ניצחון חייב להיות לפחות 1' : 'Win value must be at least 1'); return; }
        if (lose < 1)        { alert(currentLang === 'he' ? 'ערך הפסד חייב להיות לפחות 1' : 'Loss value must be at least 1'); return; }
        if (max  < 1)        { alert(currentLang === 'he' ? 'חייב להיות לפחות משתתף אחד' : 'Must allow at least 1 participant'); return; }

        const bets = getBets();
        bets.unshift({
            id:              Date.now(),
            creator:         Auth.currentUser.username,
            teamA, teamB,
            coinsWin:       win,
            coinsLose:      lose,
            maxParticipants: max,
            participants:    [],
            status:          'open',
            winner:          null
        });
        saveBets(bets);
        document.getElementById('bet-create-modal').classList.remove('active');
        render();
    }

    function confirmJoin(betId) {
        if (!Auth.currentUser) {
            document.getElementById('login-modal').classList.add('active');
            return;
        }
        const bet = getBets().find(b => b.id === betId);
        if (!bet) return;

        const flagB = TEAM_FLAGS[bet.teamB] || '';
        const msg = currentLang === 'he'
            ? `אתה מהמר שـ${flagB} ${bet.teamB} תנצח.\n\nאם תנצח: +${bet.coinsLose} 🪙\nאם תפסיד: -${bet.coinsWin} 🪙\n\n${t('betJoinConfirm')}`
            : `You bet ${flagB} ${bet.teamB} wins.\n\nIf you win: +${bet.coinsLose} 🪙\nIf you lose: -${bet.coinsWin} 🪙\n\n${t('betJoinConfirm')}`;
        if (!confirm(msg)) return;

        const bets = getBets();
        const b = bets.find(x => x.id === betId);
        if (!b || b.participants.includes(Auth.currentUser.username)) return;
        if (b.participants.length >= b.maxParticipants) return;
        b.participants.push(Auth.currentUser.username);
        saveBets(bets);
        render();
    }

    function openResolve(betId) {
        const bet = getBets().find(b => b.id === betId);
        if (!bet) return;
        const modal = document.getElementById('bet-resolve-modal');
        modal.innerHTML = `
            <div class="modal-box" style="max-width:360px">
                <div class="modal-header">
                    <h3>🏁 ${currentLang === 'he' ? 'סיום הימור' : 'Resolve Bet'}</h3>
                    <button onclick="document.getElementById('bet-resolve-modal').classList.remove('active')">✕</button>
                </div>
                <p style="color:var(--muted);margin-bottom:20px;font-size:14px">
                    ${TEAM_FLAGS[bet.teamA]||''} ${bet.teamA} ${t('vs')} ${TEAM_FLAGS[bet.teamB]||''} ${bet.teamB}<br>
                    ${currentLang === 'he' ? 'מי ניצחה?' : 'Who won?'}
                </p>
                <div style="display:flex;gap:10px">
                    <button class="btn-primary btn-full" onclick="ScreenBets.resolve(${bet.id},'teamA')">
                        ${TEAM_FLAGS[bet.teamA]||''} ${bet.teamA}
                    </button>
                    <button class="btn-secondary btn-full" onclick="ScreenBets.resolve(${bet.id},'teamB')">
                        ${TEAM_FLAGS[bet.teamB]||''} ${bet.teamB}
                    </button>
                </div>
            </div>`;
        modal.classList.add('active');
        modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };
    }

    function resolve(betId, winner) {
        const bets = getBets();
        const bet  = bets.find(b => b.id === betId);
        if (!bet || bet.status === 'resolved') return;

        bet.status = 'resolved';
        bet.winner = winner;

        const allUsers = Auth.getAllUsers();
        const findUser = name => allUsers.find(u => u.username === name);

        if (winner === 'teamA') {
            // Creator wins: gets coinsWin from each participant
            const creator = findUser(bet.creator);
            if (creator) Auth.setUserCoins(bet.creator, (creator.coins||0) + bet.coinsWin * bet.participants.length);
            bet.participants.forEach(p => {
                const pu = findUser(p);
                if (pu) Auth.setUserCoins(p, Math.max(0, (pu.coins||0) - bet.coinsWin));
            });
        } else {
            // Creator loses: pays coinsLose to each participant
            const creator = findUser(bet.creator);
            if (creator) Auth.setUserCoins(bet.creator, Math.max(0, (creator.coins||0) - bet.coinsLose * bet.participants.length));
            bet.participants.forEach(p => {
                const pu = findUser(p);
                if (pu) Auth.setUserCoins(p, (pu.coins||0) + bet.coinsLose);
            });
        }

        saveBets(bets);
        document.getElementById('bet-resolve-modal').classList.remove('active');
        render();
    }

    function deleteBet(betId) {
        if (!confirm(currentLang === 'he' ? 'למחוק את ההימור?' : 'Delete this bet?')) return;
        saveBets(getBets().filter(b => b.id !== betId));
        render();
    }

    return { render, openCreate, submitCreate, confirmJoin, openResolve, resolve, deleteBet };
})();
