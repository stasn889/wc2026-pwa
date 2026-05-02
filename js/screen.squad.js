const ScreenSquad = (() => {
    function show(teamName) {
        Nav.setScreen('squad', true);
        const players = ALL_PLAYERS.filter(p => p.team === teamName);
        const positions = ['GK','DEF','MID','FWD'];
        const el = document.getElementById('screen-squad');
        el.innerHTML = `
            <div class="screen-header">
                <button class="back-btn" onclick="Nav.setScreen('groups')">${t('backToGroups')}</button>
                <h2>${TEAM_FLAGS[teamName]||''} ${t('squadOf')} ${teamName}</h2>
            </div>
            <div class="squad-container">
                ${positions.map(pos => {
                    const group = players.filter(p => p.position === pos);
                    if (!group.length) return '';
                    return `
                        <div class="squad-group">
                            <h3 class="squad-pos-label" style="color:${CONFIG.POSITION_COLORS[pos]}">${t('pos'+pos)}</h3>
                            ${group.map(p => {
                                const inTeam = Team.isInTeam(p.id);
                                return `
                                <div class="squad-player-row">
                                    <div class="squad-player-info">
                                        <span class="squad-name">${p.name}</span>
                                        <span class="squad-meta">${p.price}M · ${p.points||0} ${t('pts')}</span>
                                    </div>
                                    <button class="btn-${inTeam?'remove':'add'}-sm"
                                        onclick="${inTeam ? 'Team.remove('+p.id+')' : 'Team.add(ALL_PLAYERS.find(x=>x.id==='+p.id+'))'};ScreenSquad.show('${teamName}')">
                                        ${inTeam ? t('removePlayer') : t('addPlayer')}
                                    </button>
                                </div>`;
                            }).join('')}
                        </div>`;
                }).join('')}
            </div>`;
    }

    return { show };
})();
