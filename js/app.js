// Fantasy World Cup 2026 - Enhanced App with Bug Fixes
class FantasyApp {
    constructor() {
        this.currentUser = null;
        this.currentLang = 'he';
        this.currentView = 'team';
        this.selectedPlayer = null;
        
        // Load users from localStorage or initialize with defaults
        this.users = this.loadUsers();
        
        this.init();
    }

    loadUsers() {
        const saved = localStorage.getItem('fantasyUsers');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default users
        return {
            admin: {
                username: 'admin',
                password: 'admin123',
                isAdmin: true,
                team: [],
                budget: 100,
                points: 0
            },
            KingMessi: {
                username: 'KingMessi',
                password: 'demo',
                isAdmin: false,
                team: [],
                budget: 100,
                points: 0
            }
        };
    }

    saveUsers() {
        localStorage.setItem('fantasyUsers', JSON.stringify(this.users));
    }

    init() {
        this.setupEventListeners();
        this.setupLanguageToggle();
        this.hideLoading();
        this.populateTeamFilter();
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.remove('active');
        }, 1000);
    }

    setupEventListeners() {
        // Login
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('register-btn').addEventListener('click', () => this.register());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        
        // About modal
        document.getElementById('about-btn').addEventListener('click', () => this.showAbout());
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Filters - FIXED: Price filter bug
        document.getElementById('search-players').addEventListener('input', (e) => this.filterPlayers());
        document.getElementById('filter-position').addEventListener('change', () => this.filterPlayers());
        document.getElementById('filter-team').addEventListener('change', () => this.filterPlayers());
        document.getElementById('filter-price').addEventListener('input', (e) => {
            document.getElementById('price-value').textContent = e.target.value + 'M';
            this.filterPlayers();
        });

        // Admin
        document.getElementById('admin-player-search').addEventListener('input', (e) => this.searchPlayersForScore(e.target.value));
        document.querySelectorAll('.admin-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchAdminTab(tab);
            });
        });

        // Enter key login
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });
    }

    setupLanguageToggle() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update all translatable elements
        document.querySelectorAll('[data-en][data-he]').forEach(el => {
            const text = lang === 'he' ? el.dataset.he : el.dataset.en;
            if (el.tagName === 'INPUT') {
                el.placeholder = lang === 'he' ? el.dataset.placeholderHe : el.dataset.placeholderEn;
            } else {
                el.textContent = text;
            }
        });

        // Re-render current view
        if (this.currentUser) {
            this.refreshCurrentView();
        }
    }

    refreshCurrentView() {
        if (this.currentView === 'team') {
            this.renderTeam();
        } else if (this.currentView === 'players') {
            this.renderPlayers();
        } else if (this.currentView === 'standings') {
            this.renderStandings();
        } else if (this.currentView === 'admin') {
            this.renderAdminContent();
        }
    }

    login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert(this.currentLang === 'he' ? 'נא למלא את כל השדות' : 'Please fill all fields');
            return;
        }

        const user = this.users[username];
        if (user && user.password === password) {
            this.currentUser = user;
            this.showMainScreen();
        } else {
            alert(this.currentLang === 'he' ? 'שם משתמש או סיסמה שגויים' : 'Invalid username or password');
        }
    }

    register() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert(this.currentLang === 'he' ? 'נא למלא את כל השדות' : 'Please fill all fields');
            return;
        }

        if (this.users[username]) {
            alert(this.currentLang === 'he' ? 'שם המשתמש כבר תפוס' : 'Username already exists');
            return;
        }

        this.users[username] = {
            username: username,
            password: password,
            isAdmin: false,
            team: [],
            budget: 100,
            points: 0
        };

        this.saveUsers(); // Save new user
        alert(this.currentLang === 'he' ? 'נרשמת בהצלחה! כעת התחבר' : 'Registration successful! Please login');
    }

    logout() {
        this.currentUser = null;
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('main-screen').classList.remove('active');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    showMainScreen() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('main-screen').classList.add('active');
        
        // FIXED: Better alignment for user display
        const userDisplay = document.getElementById('user-display');
        userDisplay.textContent = `👤 ${this.currentUser.username}`;

        // Show/hide admin features
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = this.currentUser.isAdmin ? '' : 'none';
        });

        this.switchView('team');
    }

    showAbout() {
        document.getElementById('about-modal').classList.add('active');
    }

    switchView(view) {
        this.currentView = view;

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
        });

        document.getElementById(`${view}-view`).classList.add('active');

        if (view === 'team') this.renderTeam();
        else if (view === 'players') this.renderPlayers();
        else if (view === 'standings') this.renderStandings();
        else if (view === 'admin') this.renderAdminContent();
    }

    renderTeam() {
        const team = this.currentUser.team;
        const budget = this.currentUser.budget;
        const points = this.currentUser.points;

        document.getElementById('budget-display').textContent = budget.toFixed(1) + 'M';
        document.getElementById('players-count').textContent = `${team.length}/11`;
        document.getElementById('team-points').textContent = points;

        const field = document.getElementById('formation-field');
        field.innerHTML = '';

        if (team.length === 0) {
            field.innerHTML = `<div class="empty-team">${this.currentLang === 'he' ? 'לחץ על "שחקנים" כדי להתחיל לבנות את הקבוצה' : 'Click "Players" to start building your team'}</div>`;
            return;
        }

        const positions = { GK: [], DEF: [], MID: [], FWD: [] };
        team.forEach(p => positions[p.position].push(p));

        const formation = [
            { pos: 'FWD', players: positions.FWD, label: this.currentLang === 'he' ? 'התקפה' : 'Forward' },
            { pos: 'MID', players: positions.MID, label: this.currentLang === 'he' ? 'קישור' : 'Midfield' },
            { pos: 'DEF', players: positions.DEF, label: this.currentLang === 'he' ? 'הגנה' : 'Defense' },
            { pos: 'GK', players: positions.GK, label: this.currentLang === 'he' ? 'שוער' : 'Goalkeeper' }
        ];

        formation.forEach(line => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'formation-line';
            
            line.players.forEach(player => {
                const card = this.createPlayerCard(player, true);
                lineDiv.appendChild(card);
            });

            field.appendChild(lineDiv);
        });
    }

    createPlayerCard(player, inTeam = false) {
        const card = document.createElement('div');
        card.className = 'player-card';
        if (inTeam) card.classList.add('in-team');

        card.innerHTML = `
            <div class="player-card-header">
                <span class="player-position">${player.position}</span>
                <span class="player-price">${player.price}M</span>
            </div>
            <div class="player-name">${player.name}</div>
            <div class="player-team">${player.team}</div>
            <div class="player-points">${player.points || 0} ${this.currentLang === 'he' ? 'נק׳' : 'pts'}</div>
            ${inTeam ? 
                `<button class="btn-remove" onclick="app.removePlayer(${player.id})">×</button>` :
                `<button class="btn-add" onclick="app.addPlayer(${player.id})">${this.currentLang === 'he' ? 'הוסף' : 'Add'}</button>`
            }
        `;

        return card;
    }

    addPlayer(playerId) {
        const player = ALL_PLAYERS.find(p => p.id === playerId);
        if (!player) return;

        if (this.currentUser.team.length >= 11) {
            alert(this.currentLang === 'he' ? 'הקבוצה מלאה (11 שחקנים)' : 'Team is full (11 players)');
            return;
        }

        if (this.currentUser.budget < player.price) {
            alert(this.currentLang === 'he' ? 'אין מספיק תקציב' : 'Not enough budget');
            return;
        }

        // Position limits
        const positions = this.currentUser.team.reduce((acc, p) => {
            acc[p.position] = (acc[p.position] || 0) + 1;
            return acc;
        }, {});

        const limits = { GK: 1, DEF: 5, MID: 5, FWD: 3 };
        if (positions[player.position] >= limits[player.position]) {
            alert(this.currentLang === 'he' ? `לא ניתן להוסיף יותר שחקני ${player.position}` : `Cannot add more ${player.position} players`);
            return;
        }

        this.currentUser.team.push(player);
        this.currentUser.budget -= player.price;
        this.saveUsers();
        this.renderTeam();
        this.renderPlayers();
    }

    removePlayer(playerId) {
        const index = this.currentUser.team.findIndex(p => p.id === playerId);
        if (index === -1) return;

        const player = this.currentUser.team[index];
        this.currentUser.budget += player.price;
        this.currentUser.team.splice(index, 1);
        this.saveUsers();
        this.renderTeam();
        this.renderPlayers();
    }

    populateTeamFilter() {
        const select = document.getElementById('filter-team');
        const teams = [...new Set(ALL_PLAYERS.map(p => p.team))].sort();
        
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            select.appendChild(option);
        });
    }

    renderPlayers() {
        this.filterPlayers();
    }

    filterPlayers() {
        const search = document.getElementById('search-players').value.toLowerCase();
        const position = document.getElementById('filter-position').value;
        const team = document.getElementById('filter-team').value;
        const maxPrice = parseFloat(document.getElementById('filter-price').value); // FIXED: Parse as float

        let filtered = ALL_PLAYERS.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(search);
            const matchPosition = !position || p.position === position;
            const matchTeam = !team || p.team === team;
            const matchPrice = p.price <= maxPrice; // FIXED: Simple comparison
            
            return matchSearch && matchPosition && matchTeam && matchPrice;
        });

        const grid = document.getElementById('players-grid');
        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="empty-state">${this.currentLang === 'he' ? 'לא נמצאו שחקנים' : 'No players found'}</div>`;
            return;
        }

        filtered.forEach(player => {
            const inTeam = this.currentUser.team.some(p => p.id === player.id);
            const card = this.createPlayerCard(player, inTeam);
            grid.appendChild(card);
        });
    }

    renderStandings() {
        const table = document.getElementById('standings-table');
        const standings = Object.values(this.users)
            .filter(u => !u.isAdmin)
            .map(u => ({
                username: u.username,
                points: u.points || 0,
                players: u.team.length
            }))
            .sort((a, b) => b.points - a.points);

        table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>${this.currentLang === 'he' ? 'דירוג' : 'Rank'}</th>
                        <th>${this.currentLang === 'he' ? 'משתמש' : 'User'}</th>
                        <th>${this.currentLang === 'he' ? 'נקודות' : 'Points'}</th>
                        <th>${this.currentLang === 'he' ? 'שחקנים' : 'Players'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${standings.map((s, i) => `
                        <tr${s.username === this.currentUser.username ? ' class="highlight"' : ''}>
                            <td>${i + 1}</td>
                            <td>${s.username}</td>
                            <td>${s.points}</td>
                            <td>${s.players}/11</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    switchAdminTab(tab) {
        document.querySelectorAll('.admin-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        document.querySelectorAll('.admin-content').forEach(content => {
            content.classList.remove('active');
        });

        document.getElementById(`admin-${tab}`).classList.add('active');

        if (tab === 'teams') this.renderUserTeams();
        if (tab === 'users') this.renderUsersList();
    }

    renderAdminContent() {
        this.switchAdminTab('scores');
    }

    searchPlayersForScore(query) {
        const results = document.getElementById('admin-player-results');
        
        if (!query) {
            results.innerHTML = '';
            return;
        }

        const filtered = ALL_PLAYERS.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);

        results.innerHTML = filtered.map(p => `
            <div class="admin-player-item" onclick="app.openScoreModal(${p.id})">
                <span>${p.name}</span>
                <span class="player-team">${p.team}</span>
                <span class="player-points">${p.points || 0} pts</span>
            </div>
        `).join('');
    }

    openScoreModal(playerId) {
        this.selectedPlayer = ALL_PLAYERS.find(p => p.id === playerId);
        if (!this.selectedPlayer) return;

        document.getElementById('score-modal-title').textContent = this.selectedPlayer.name;
        document.getElementById('score-goals').value = 0;
        document.getElementById('score-assists').value = 0;
        document.getElementById('score-cleansheet').checked = false;
        document.getElementById('score-yellow').value = 0;
        document.getElementById('score-red').checked = false;

        document.getElementById('score-modal').classList.add('active');

        // Setup save button
        const saveBtn = document.getElementById('save-score-btn');
        saveBtn.onclick = () => this.saveScore();
    }

    saveScore() {
        const goals = parseInt(document.getElementById('score-goals').value) || 0;
        const assists = parseInt(document.getElementById('score-assists').value) || 0;
        const cleansheet = document.getElementById('score-cleansheet').checked;
        const yellow = parseInt(document.getElementById('score-yellow').value) || 0;
        const red = document.getElementById('score-red').checked;

        let points = 0;
        const pos = this.selectedPlayer.position;

        // Goals
        if (pos === 'GK') points += goals * 8;
        else if (pos === 'DEF') points += goals * 6;
        else if (pos === 'MID') points += goals * 5;
        else if (pos === 'FWD') points += goals * 6;

        // Assists
        points += assists * 3;

        // Clean sheet
        if (cleansheet) {
            if (pos === 'GK' || pos === 'DEF') points += 4;
            else if (pos === 'MID') points += 1;
        }

        // Cards
        points -= yellow * 1;
        points -= red ? 3 : 0;

        this.selectedPlayer.points = (this.selectedPlayer.points || 0) + points;

        // Update all users who have this player
        Object.values(this.users).forEach(user => {
            const playerInTeam = user.team.find(p => p.id === this.selectedPlayer.id);
            if (playerInTeam) {
                playerInTeam.points = this.selectedPlayer.points;
                user.points = user.team.reduce((sum, p) => sum + (p.points || 0), 0);
            }
        });

        this.saveUsers();
        document.getElementById('score-modal').classList.remove('active');
        alert(this.currentLang === 'he' ? `${points} נקודות נוספו ל-${this.selectedPlayer.name}` : `${points} points added to ${this.selectedPlayer.name}`);
    }

    renderUserTeams() {
        const container = document.getElementById('admin-user-teams');
        const users = Object.values(this.users).filter(u => !u.isAdmin);

        container.innerHTML = users.map(user => `
            <div class="admin-user-team">
                <h4>${user.username} - ${user.points} ${this.currentLang === 'he' ? 'נקודות' : 'points'}</h4>
                <div class="admin-team-players">
                    ${user.team.map(p => `
                        <div class="admin-team-player">
                            ${p.name} (${p.position}) - ${p.points || 0} pts
                        </div>
                    `).join('') || `<div class="empty-state">${this.currentLang === 'he' ? 'אין שחקנים' : 'No players'}</div>`}
                </div>
            </div>
        `).join('');
    }

    renderUsersList() {
        const container = document.getElementById('admin-users-list');
        const users = Object.values(this.users).filter(u => !u.isAdmin);

        container.innerHTML = `
            <table class="users-table">
                <thead>
                    <tr>
                        <th>${this.currentLang === 'he' ? 'שם משתמש' : 'Username'}</th>
                        <th>${this.currentLang === 'he' ? 'נקודות' : 'Points'}</th>
                        <th>${this.currentLang === 'he' ? 'שחקנים' : 'Players'}</th>
                        <th>${this.currentLang === 'he' ? 'פעולות' : 'Actions'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.username}</td>
                            <td>${user.points || 0}</td>
                            <td>${user.team.length}/11</td>
                            <td>
                                <button class="btn-danger" onclick="app.deleteUser('${user.username}')">
                                    ${this.currentLang === 'he' ? 'מחק' : 'Delete'}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    deleteUser(username) {
        if (!confirm(this.currentLang === 'he' ? `למחוק את ${username}?` : `Delete ${username}?`)) {
            return;
        }

        delete this.users[username];
        this.saveUsers();
        this.renderUsersList();
        this.renderStandings();
        
        alert(this.currentLang === 'he' ? 'המשתמש נמחק בהצלחה' : 'User deleted successfully');
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FantasyApp();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed', err));
}
