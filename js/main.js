function updateLangBtns(lang) {
    const he = document.getElementById('lang-btn-he');
    const en = document.getElementById('lang-btn-en');
    if (he) he.classList.toggle('active', lang === 'he');
    if (en) en.classList.toggle('active', lang === 'en');
}

document.addEventListener('DOMContentLoaded', () => {
    // Restore theme preference
    Nav.restoreTheme();
    TeamTheme.restore();

    // Restore session + update topbar
    Nav.updateTopbar();

    // Render initial screen
    ScreenGroups.render();
    const firstBtn = document.querySelector('#bottom-nav button[data-screen="groups"]');
    if (firstBtn) firstBtn.classList.add('active');

    // Theme toggle
    document.getElementById('btn-theme').addEventListener('click', Nav.toggleTheme);

    // Topbar login button
    document.getElementById('btn-topbar-login').addEventListener('click', () => {
        document.getElementById('login-modal').classList.add('active');
    });

    // Close login modal on overlay click
    document.getElementById('login-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('login-modal'))
            document.getElementById('login-modal').classList.remove('active');
    });

    // Auth tab toggle
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll('.auth-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
            document.getElementById('login-form').style.display    = tab === 'login'    ? '' : 'none';
            document.getElementById('register-form').style.display = tab === 'register' ? '' : 'none';
        });
    });

    // Login
    document.getElementById('btn-login').addEventListener('click', () => {
        const u = document.getElementById('in-username').value.trim();
        const p = document.getElementById('in-password').value;
        if (!u || !p) { alert(t('fillAll')); return; }
        if (Auth.login(u, p)) {
            document.getElementById('login-modal').classList.remove('active');
            document.getElementById('in-username').value = '';
            document.getElementById('in-password').value = '';
            Nav.updateTopbar();
            Nav.setScreen(Nav.current);
        } else {
            alert(t('loginFailed'));
        }
    });

    // Register
    document.getElementById('btn-register').addEventListener('click', () => {
        const u  = document.getElementById('reg-username').value.trim();
        const p  = document.getElementById('reg-password').value;
        const p2 = document.getElementById('reg-confirm').value;
        const err = Auth.register(u, p, p2);
        if (err) { alert(err); return; }
        alert(currentLang === 'he' ? 'נרשמת בהצלחה! התחבר עכשיו' : 'Registered! Please login.');
        document.querySelector('[data-tab="login"]').click();
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        Auth.logout();
        Nav.updateTopbar();
        Nav.setScreen('groups');
    });

    // Lang toggle
    document.getElementById('tb-lang').addEventListener('click', Nav.toggleLang);

    // Enter key on password
    document.getElementById('in-password').addEventListener('keypress', e => {
        if (e.key === 'Enter') document.getElementById('btn-login').click();
    });

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
});
