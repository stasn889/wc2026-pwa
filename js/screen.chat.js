const ScreenChat = (() => {
    const STORAGE_KEY = 'wc2026_chat';
    let activeTab = 'public';
    let activeDM  = null;

    function getData() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { public: [], private: {} }; }
        catch { return { public: [], private: {} }; }
    }

    function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

    function pairKey(a, b) { return [a, b].sort().join('|'); }

    function escape(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function fmtTime(ts) {
        const d = new Date(ts);
        return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
    }

    function fmtDate(ts) {
        const d = new Date(ts);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return fmtTime(ts);
        return (d.getDate()) + '/' + (d.getMonth()+1) + ' ' + fmtTime(ts);
    }

    function msgHtml(m, me) {
        const mine = m.from === me;
        return `<div class="cm ${mine ? 'cm-mine' : ''}">
            <div class="cm-meta"><span class="cm-from">${escape(m.from)}</span><span class="cm-time">${fmtDate(m.ts)}</span></div>
            <div class="cm-bubble">${escape(m.text)}</div>
        </div>`;
    }

    function sendPublic(text) {
        const u = Auth.currentUser;
        if (!u || !text.trim()) return;
        const d = getData();
        d.public.push({ from: u.username, text: text.trim(), ts: Date.now() });
        if (d.public.length > 300) d.public = d.public.slice(-300);
        saveData(d);
        refreshPublic();
    }

    function sendPrivate(to, text) {
        const u = Auth.currentUser;
        if (!u || !text.trim()) return;
        const d = getData();
        const k = pairKey(u.username, to);
        if (!d.private[k]) d.private[k] = [];
        d.private[k].push({ from: u.username, text: text.trim(), ts: Date.now() });
        saveData(d);
        refreshDM(to);
    }

    function refreshPublic() {
        const el = document.getElementById('chat-pub-msgs');
        if (!el) return;
        const d = getData();
        const me = Auth.currentUser?.username;
        if (!d.public.length) {
            el.innerHTML = `<p class="chat-empty">${currentLang==='he'?'אין הודעות עדיין':'No messages yet'}</p>`;
        } else {
            el.innerHTML = d.public.map(m => msgHtml(m, me)).join('');
            el.scrollTop = el.scrollHeight;
        }
    }

    function refreshDM(username) {
        const el = document.getElementById('chat-dm-msgs');
        if (!el) return;
        const d = getData();
        const me = Auth.currentUser?.username;
        const k  = pairKey(me, username);
        const msgs = d.private[k] || [];
        if (!msgs.length) {
            el.innerHTML = `<p class="chat-empty">${currentLang==='he'?'אין הודעות עדיין':'No messages yet'}</p>`;
        } else {
            el.innerHTML = msgs.map(m => msgHtml(m, me)).join('');
            el.scrollTop = el.scrollHeight;
        }
    }

    function buildUserList() {
        const me   = Auth.currentUser?.username;
        const all  = Auth.getAllUsers().filter(u => u.username !== me);
        if (!all.length) return `<p class="chat-empty">${currentLang==='he'?'אין משתמשים אחרים':'No other users'}</p>`;
        const d = getData();
        return `<div class="chat-users">${all.map(u => {
            const k    = pairKey(me, u.username);
            const msgs = d.private[k] || [];
            const last = msgs.length ? msgs[msgs.length-1] : null;
            const preview = last
                ? `<span class="cu-preview">${last.from===me?'↗ ':''}${escape(last.text.slice(0,28))}${last.text.length>28?'…':''}</span>`
                : '';
            return `<div class="chat-user-row" onclick="ScreenChat.openDM('${escape(u.username)}')">
                <div class="cu-avatar">${u.username[0].toUpperCase()}</div>
                <div class="cu-body">
                    <span class="cu-name">${escape(u.username)}</span>${preview}
                </div>
                ${msgs.length ? `<div class="cu-badge">${msgs.length > 99 ? '99+' : msgs.length}</div>` : ''}
            </div>`;
        }).join('')}</div>`;
    }

    function render() {
        const el   = document.getElementById('screen-chat');
        const user = Auth.currentUser;

        el.innerHTML = `
            <div class="chat-wrap">
                <div class="chat-tabs">
                    <button class="chat-tab${activeTab==='public'?' active':''}" onclick="ScreenChat.setTab('public')">${t('chatPublic')}</button>
                    <button class="chat-tab${activeTab==='private'?' active':''}" onclick="ScreenChat.setTab('private')">${t('chatPrivate')}</button>
                </div>

                <div class="chat-pane${activeTab==='public'?' active':''}">
                    <div id="chat-pub-msgs" class="chat-msgs"></div>
                    ${user
                        ? `<div class="chat-input-row">
                               <input id="chat-pub-in" class="chat-in" type="text" placeholder="${t('chatPlaceholder')}"
                                   onkeydown="if(event.key==='Enter')ScreenChat.submitPublic()">
                               <button class="chat-send" onclick="ScreenChat.submitPublic()">${t('chatSend')}</button>
                           </div>`
                        : `<p class="chat-login">${t('loginToUse')}</p>`}
                </div>

                <div class="chat-pane${activeTab==='private'?' active':''}">
                    ${user ? buildUserList() : `<p class="chat-login">${t('loginToUse')}</p>`}
                </div>
            </div>

            <div id="chat-dm-overlay" class="modal-overlay" onclick="if(event.target===this)ScreenChat.closeDM()"></div>
        `;

        refreshPublic();
        if (user) document.getElementById('chat-pub-in')?.focus();
    }

    function openDM(username) {
        activeDM = username;
        const ov = document.getElementById('chat-dm-overlay');
        ov.innerHTML = `
            <div class="modal-box chat-dm-box" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>💬 ${t('chatWith')} ${escape(username)}</h3>
                    <button onclick="ScreenChat.closeDM()">✕</button>
                </div>
                <div id="chat-dm-msgs" class="chat-msgs chat-dm-msgs"></div>
                <div class="chat-input-row">
                    <input id="chat-dm-in" class="chat-in" type="text" placeholder="${t('chatPlaceholder')}"
                        onkeydown="if(event.key==='Enter')ScreenChat.submitDM()">
                    <button class="chat-send" onclick="ScreenChat.submitDM()">${t('chatSend')}</button>
                </div>
            </div>`;
        ov.classList.add('active');
        refreshDM(username);
        document.getElementById('chat-dm-in')?.focus();
    }

    function closeDM() {
        document.getElementById('chat-dm-overlay')?.classList.remove('active');
        activeDM = null;
        if (activeTab === 'private') render();
    }

    function submitPublic() {
        const inp = document.getElementById('chat-pub-in');
        if (!inp || !inp.value.trim()) return;
        sendPublic(inp.value);
        inp.value = '';
        inp.focus();
    }

    function submitDM() {
        if (!activeDM) return;
        const inp = document.getElementById('chat-dm-in');
        if (!inp || !inp.value.trim()) return;
        sendPrivate(activeDM, inp.value);
        inp.value = '';
        inp.focus();
    }

    function setTab(tab) {
        activeTab = tab;
        render();
    }

    return { render, setTab, openDM, closeDM, submitPublic, submitDM };
})();
