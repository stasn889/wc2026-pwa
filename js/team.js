const Team = (() => {
    function get()          { return Auth.currentUser ? (Auth.currentUser.team || []) : []; }
    function getBudget()    { return Auth.currentUser ? Auth.currentUser.budget : 100; }
    function getCaptain()   { return Auth.currentUser ? (Auth.currentUser.captain    || null) : null; }
    function getViceCaptain(){ return Auth.currentUser ? (Auth.currentUser.viceCaptain || null) : null; }
    function getBankers()   { return Auth.currentUser ? (Auth.currentUser.bankers    || [])   : []; }

    function canAdd(player) {
        const team = get();
        if (team.length >= CONFIG.MAX_PLAYERS)                         return t('teamFull');
        if (getBudget() < player.price)                                return t('noBudget');
        if (team.find(p => p.id === player.id))                        return t('alreadyIn');
        if (team.filter(p => p.position === player.position).length >= CONFIG.POSITION_LIMITS[player.position]) return t('posLimit');
        if (team.filter(p => p.team    === player.team).length    >= CONFIG.MAX_PER_TEAM)                       return t('teamLimit');
        return null;
    }

    function add(player) {
        const err = canAdd(player);
        if (err) { alert(err); return false; }
        Auth.currentUser.team.push({ ...player });
        Auth.currentUser.budget = parseFloat((getBudget() - player.price).toFixed(1));
        Auth.updateUser();
        return true;
    }

    function remove(playerId) {
        const team = get();
        const idx = team.findIndex(p => p.id === playerId);
        if (idx === -1) return;
        Auth.currentUser.budget = parseFloat((getBudget() + team[idx].price).toFixed(1));
        Auth.currentUser.team.splice(idx, 1);
        if (Auth.currentUser.captain     === playerId) Auth.currentUser.captain     = null;
        if (Auth.currentUser.viceCaptain === playerId) Auth.currentUser.viceCaptain = null;
        const bi = (Auth.currentUser.bankers || []).indexOf(playerId);
        if (bi >= 0) Auth.currentUser.bankers.splice(bi, 1);
        Auth.updateUser();
    }

    function setCaptain(playerId) {
        const u = Auth.currentUser;
        if (!u) return;
        u.captain = (u.captain === playerId) ? null : playerId;
        if (u.captain === playerId && u.viceCaptain === playerId) u.viceCaptain = null;
        Auth.updateUser();
    }

    function setViceCaptain(playerId) {
        const u = Auth.currentUser;
        if (!u) return;
        u.viceCaptain = (u.viceCaptain === playerId) ? null : playerId;
        if (u.viceCaptain === playerId && u.captain === playerId) u.captain = null;
        Auth.updateUser();
    }

    function toggleBanker(playerId) {
        const u = Auth.currentUser;
        if (!u) return;
        if (!u.bankers) u.bankers = [];
        const idx = u.bankers.indexOf(playerId);
        if (idx >= 0) u.bankers.splice(idx, 1);
        else          u.bankers.push(playerId);
        Auth.updateUser();
    }

    function isBanker(playerId)  { return getBankers().includes(playerId); }
    function isInTeam(playerId)  { return get().some(p => p.id === playerId); }

    function getStats() {
        const u = Auth.currentUser;
        if (!u) return { count:0, budget:100, points:0, coins:0, value:0, bankerValue:0 };
        const team    = u.team    || [];
        const bankers = u.bankers || [];
        const value       = parseFloat(team.reduce((s,p) => s+(p.price||0), 0).toFixed(1));
        const bankerValue = parseFloat(team.filter(p => bankers.includes(p.id)).reduce((s,p) => s+(p.price||0), 0).toFixed(1));
        const points  = team.reduce((s,p) => s+(p.points||0), 0);
        return { count:team.length, budget:u.budget, points, coins:u.coins||0, value, bankerValue };
    }

    return { get, getBudget, getCaptain, getViceCaptain, getBankers,
             canAdd, add, remove, setCaptain, setViceCaptain, toggleBanker,
             isBanker, isInTeam, getStats };
})();
