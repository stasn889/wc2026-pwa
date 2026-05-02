const Auth = (() => {
    const STORAGE_KEY = 'wc2026_users';
    const SESSION_KEY = 'wc2026_session';

    const DEFAULT_USERS = {
        admin:      { username:'admin',      password:'admin123', isAdmin:true,  team:[], budget:100, points:0,   coins:1000, captain:null, viceCaptain:null, bankers:[] },
        KingMessi:  { username:'KingMessi',  password:'demo',     isAdmin:false, team:[], budget:100, points:142, coins:1000, captain:null, viceCaptain:null, bankers:[] },
        BlueMoon:   { username:'BlueMoon',   password:'demo',     isAdmin:false, team:[], budget:100, points:138, coins:1000, captain:null, viceCaptain:null, bankers:[] },
        LionHeart:  { username:'LionHeart',  password:'demo',     isAdmin:false, team:[], budget:100, points:127, coins:1000, captain:null, viceCaptain:null, bankers:[] },
        SambaMagic: { username:'SambaMagic', password:'demo',     isAdmin:false, team:[], budget:100, points:115, coins:1000, captain:null, viceCaptain:null, bankers:[] }
    };

    let users = {};
    let currentUser = null;

    function migrate(u) {
        if (u.coins       === undefined) u.coins       = 1000;
        if (u.viceCaptain === undefined) u.viceCaptain = null;
        if (!Array.isArray(u.bankers))   u.bankers     = [];
    }

    function load() {
        const saved = localStorage.getItem(STORAGE_KEY);
        users = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_USERS));
        Object.values(users).forEach(migrate);
        const sessionUser = localStorage.getItem(SESSION_KEY);
        if (sessionUser && users[sessionUser]) {
            currentUser = users[sessionUser];
        }
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    function login(username, password) {
        const user = users[username];
        if (!user || user.password !== password) return false;
        currentUser = user;
        localStorage.setItem(SESSION_KEY, username);
        return true;
    }

    function register(username, password, passwordConfirm) {
        if (!username || !password) return t('fillAll');
        if (password !== passwordConfirm) return t('passwordMismatch');
        if (users[username]) return t('userExists');
        users[username] = { username, password, isAdmin:false, team:[], budget:100, points:0, coins:1000, captain:null, viceCaptain:null, bankers:[] };
        save();
        return null;
    }

    function logout() {
        currentUser = null;
        localStorage.removeItem(SESSION_KEY);
    }

    function updateUser() {
        if (currentUser) {
            users[currentUser.username] = currentUser;
            save();
        }
    }

    function getAllUsers() { return Object.values(users); }

    function setAdmin(username, isAdmin) {
        if (users[username]) { users[username].isAdmin = isAdmin; save(); }
    }

    function deleteUser(username) {
        delete users[username];
        save();
    }

    function setUserPoints(username, points) {
        if (users[username]) { users[username].points = Math.max(0, points); save(); }
    }

    function setUserCoins(username, coins) {
        if (users[username]) { users[username].coins = Math.max(0, coins); save(); }
    }

    load();
    return {
        login, register, logout, updateUser, getAllUsers,
        setAdmin, deleteUser, setUserPoints, setUserCoins,
        get currentUser() { return currentUser; },
        set currentUser(u) { currentUser = u; }
    };
})();
