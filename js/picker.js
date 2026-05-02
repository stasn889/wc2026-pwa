const Picker = (() => {
    let targetPosition = null;
    let onSelect = null;

    function open(position, callback) {
        targetPosition = position;
        onSelect = callback;
        render();
        document.getElementById('picker-modal').classList.add('active');
    }

    function close() {
        document.getElementById('picker-modal').classList.remove('active');
        targetPosition = null;
        onSelect = null;
    }

    function render() {
        const el = document.getElementById('picker-modal');
        el.innerHTML = `
            <div class="picker-overlay" onclick="Picker.close()"></div>
            <div class="picker-sheet">
                <div class="picker-header">
                    <span>${t('pickPlayer')}${targetPosition ? ' — ' + targetPosition : ''}</span>
                    <button class="picker-close" onclick="Picker.close()">✕</button>
                </div>
                <div class="picker-filters">
                    <div class="picker-pos-tabs">
                        ${['','GK','DEF','MID','FWD'].map(p => `
                            <button class="pos-tab${targetPosition===p||(!p&&!targetPosition)?'':''}"
                                onclick="Picker.setPos('${p}')" data-pos="${p}">
                                ${p ? t('pos'+p) : t('posAll')}
                            </button>`).join('')}
                    </div>
                    <input type="range" id="picker-price" min="0" max="20" step="0.5" value="20"
                        oninput="Picker.renderList()" />
                    <div class="picker-price-row">
                        <span>${t('maxPrice')}: </span>
                        <span id="picker-price-val">20M</span>
                    </div>
                    <select id="picker-country" onchange="Picker.renderList()">
                        <option value="">${t('allCountries')}</option>
                        ${[...new Set(ALL_PLAYERS.map(p=>p.team))].sort()
                            .map(tm=>`<option value="${tm}">${TEAM_FLAGS[tm]||''} ${tm}</option>`).join('')}
                    </select>
                    <input type="text" id="picker-search" placeholder="${t('search')}"
                        oninput="Picker.renderList()" />
                </div>
                <div id="picker-list" class="picker-list"></div>
            </div>`;
        setActivePos(targetPosition || '');
        renderList();
    }

    function setPos(pos) {
        targetPosition = pos || null;
        setActivePos(pos);
        renderList();
    }

    function setActivePos(pos) {
        document.querySelectorAll('.pos-tab').forEach(b => {
            b.classList.toggle('active', b.dataset.pos === pos);
        });
    }

    function renderList() {
        const maxPrice = parseFloat(document.getElementById('picker-price')?.value || 20);
        const country  = document.getElementById('picker-country')?.value || '';
        const search   = (document.getElementById('picker-search')?.value || '').toLowerCase();
        const priceEl  = document.getElementById('picker-price-val');
        if (priceEl) priceEl.textContent = maxPrice + 'M';

        let list = ALL_PLAYERS.filter(p => {
            if (targetPosition && p.position !== targetPosition) return false;
            if (p.price > maxPrice) return false;
            if (country && p.team !== country) return false;
            if (search && !p.name.toLowerCase().includes(search)) return false;
            return true;
        });

        const container = document.getElementById('picker-list');
        if (!container) return;

        if (list.length === 0) {
            container.innerHTML = `<p class="picker-empty">${t('noPlayers')}</p>`;
            return;
        }

        container.innerHTML = list.map(p => {
            const inTeam = Team.isInTeam(p.id);
            const err    = Team.canAdd(p);
            const disabled = inTeam || (err && err !== t('alreadyIn'));
            return `<div class="picker-item${disabled ? ' picker-disabled' : ''}${inTeam ? ' picker-in-team' : ''}"
                onclick="${disabled ? '' : 'Picker.select(' + p.id + ')'}">
                <div class="pi-left">
                    <span class="pi-pos" style="background:${CONFIG.POSITION_COLORS[p.position]}">${p.position}</span>
                    <div>
                        <div class="pi-name">${p.name}</div>
                        <div class="pi-team">${TEAM_FLAGS[p.team]||''} ${p.team}</div>
                    </div>
                </div>
                <div class="pi-right">
                    <div class="pi-price">${p.price}M</div>
                    <div class="pi-pts">${p.points||0} ${t('pts')}</div>
                    ${inTeam ? '<div class="pi-badge">✓</div>' : ''}
                </div>
            </div>`;
        }).join('');
    }

    function select(playerId) {
        const player = ALL_PLAYERS.find(p => p.id === playerId);
        if (!player) return;
        if (onSelect) {
            onSelect(player);
        } else {
            Team.add(player);
            ScreenMyTeam.render();
        }
        close();
    }

    return { open, close, render, renderList, setPos, select };
})();
