const ScreenGroups = (() => {
    const openGroups = new Set();

    function render() {
        const el = document.getElementById('screen-groups');
        el.innerHTML = `
            <div class="screen-header"><h2>${t('groups')}</h2></div>
            <div class="groups-grid">
                ${GROUPS.map(g => renderGroup(g)).join('')}
            </div>`;
    }

    function renderGroup(g) {
        const matches = getGroupMatches(g.teams, g.id);
        const isOpen  = openGroups.has(g.id);
        return `
            <div class="group-card" id="group-${g.id}">
                <div class="group-header" onclick="ScreenGroups.toggleMatches('${g.id}')">
                    <span class="group-label">${t('groupLabel')} ${g.id}</span>
                    <span class="group-arrow">${isOpen ? '▲' : '▼'}</span>
                </div>
                <div class="group-teams">
                    ${g.teams.map(team => `
                        <div class="group-team" onclick="ScreenSquad.show('${team}')">
                            <span class="team-flag">${TEAM_FLAGS[team]||'🏳'}</span>
                            <span class="team-name">${team}</span>
                        </div>`).join('')}
                </div>
                <div class="group-matches${isOpen ? ' open' : ''}">
                    ${matches.map(m => `
                        <div class="match-row">
                            <span class="match-team">${TEAM_FLAGS[m.home]||''} ${m.home}</span>
                            <span class="match-vs">${t('vs')}</span>
                            <span class="match-team">${TEAM_FLAGS[m.away]||''} ${m.away}</span>
                            <span class="match-date">${m.date}</span>
                        </div>`).join('')}
                </div>
            </div>`;
    }

    function toggleMatches(groupId) {
        if (openGroups.has(groupId)) openGroups.delete(groupId);
        else openGroups.add(groupId);
        const card = document.getElementById('group-' + groupId);
        const g = GROUPS.find(g => g.id === groupId);
        if (card && g) card.outerHTML = renderGroup(g);
    }

    return { render, toggleMatches };
})();
