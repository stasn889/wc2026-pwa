const Nav = (() => {
    let currentScreen = 'groups';
    let currentTheme  = 'dark';

    function setScreen(name, skipRender) {
        // Screens that require login
        const authRequired = ['myteam', 'admin'];
        if (authRequired.includes(name) && !Auth.currentUser) {
            document.getElementById('login-modal').classList.add('active');
            return;
        }
        if (name === 'admin' && Auth.currentUser && !Auth.currentUser.isAdmin) return;

        currentScreen = name;
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById('screen-' + name);
        if (screen) screen.classList.add('active');

        document.querySelectorAll('#bottom-nav button').forEach(b => {
            b.classList.toggle('active', b.dataset.screen === name);
        });

        if (!skipRender) {
            if      (name === 'groups')  ScreenGroups.render();
            else if (name === 'myteam')  ScreenMyTeam.render();
            else if (name === 'lb')      ScreenLB.render();
            else if (name === 'bets')    ScreenBets.render();
            else if (name === 'rules')   ScreenRules.render();
            else if (name === 'admin')   ScreenAdmin.render();
            else if (name === 'user')    ScreenUser.render();
        }
        window.scrollTo(0, 0);
    }

    function toggleLang() {
        const newLang = currentLang === 'he' ? 'en' : 'he';
        setLang(newLang);
        updateLangBtns(newLang);
        updateTopbar();
        setScreen(currentScreen, false);
    }

    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('wc2026_theme', currentTheme);
    }

    function applyTheme(theme) {
        currentTheme = theme;
        if (theme === 'light') {
            document.documentElement.classList.add('theme-light');
        } else {
            document.documentElement.classList.remove('theme-light');
        }
        const btn = document.getElementById('btn-theme');
        if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    function restoreTheme() {
        const saved = localStorage.getItem('wc2026_theme') || 'dark';
        applyTheme(saved);
    }

    function updateTopbar() {
        const u         = Auth.currentUser;
        const tbUser    = document.getElementById('tb-user');
        const btnLogin  = document.getElementById('btn-topbar-login');
        const btnLogout = document.getElementById('btn-logout');
        const navAdmin  = document.getElementById('nav-admin');
        const tbLang    = document.getElementById('tb-lang');

        if (u) {
            tbUser.textContent   = '👤 ' + u.username;
            tbUser.style.display = '';
            btnLogin.style.display  = 'none';
            btnLogout.style.display = '';
        } else {
            tbUser.textContent   = '';
            tbUser.style.display = 'none';
            btnLogin.style.display  = '';
            btnLogout.style.display = 'none';
        }

        if (navAdmin) navAdmin.style.display = (u && u.isAdmin) ? '' : 'none';
        if (tbLang)   tbLang.textContent = currentLang === 'he' ? 'EN' : 'עב';
    }

    return {
        get current() { return currentScreen; },
        setScreen, toggleLang, toggleTheme, applyTheme, restoreTheme, updateTopbar
    };
})();
