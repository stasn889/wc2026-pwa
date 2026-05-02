const CONFIG = {
    BUDGET: 100,
    MAX_PLAYERS: 11,
    POSITION_LIMITS: { GK: 1, DEF: 5, MID: 5, FWD: 3 },
    MAX_PER_TEAM: 2,
    POSITION_COLORS: { GK: '#f59e0b', DEF: '#3b82f6', MID: '#10b981', FWD: '#ef4444' },
    SCORING: {
        goal:        { GK: 8, DEF: 6, MID: 5, FWD: 6 },
        assist:      3,
        cleanSheet:  { GK: 4, DEF: 4, MID: 1, FWD: 0 },
        yellowCard: -1,
        redCard:    -3
    }
};

const TEAM_FLAGS = {
    'Argentina':'🇦🇷','Brazil':'🇧🇷','Uruguay':'🇺🇾','Colombia':'🇨🇴',
    'Chile':'🇨🇱','Ecuador':'🇪🇨','Peru':'🇵🇪','Paraguay':'🇵🇾',
    'Mexico':'🇲🇽','USA':'🇺🇸','Canada':'🇨🇦','Costa Rica':'🇨🇷',
    'Panama':'🇵🇦','Jamaica':'🇯🇲',
    'France':'🇫🇷','Germany':'🇩🇪','Spain':'🇪🇸','Italy':'🇮🇹',
    'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Portugal':'🇵🇹','Netherlands':'🇳🇱','Belgium':'🇧🇪',
    'Croatia':'🇭🇷','Denmark':'🇩🇰','Switzerland':'🇨🇭','Austria':'🇦🇹',
    'Poland':'🇵🇱','Ukraine':'🇺🇦','Sweden':'🇸🇪','Czech Republic':'🇨🇿',
    'Morocco':'🇲🇦','Senegal':'🇸🇳','Tunisia':'🇹🇳','Algeria':'🇩🇿',
    'Nigeria':'🇳🇬','Egypt':'🇪🇬','Cameroon':'🇨🇲','Ghana':'🇬🇭',
    'Japan':'🇯🇵','South Korea':'🇰🇷','Australia':'🇦🇺','Iran':'🇮🇷',
    'Saudi Arabia':'🇸🇦','Qatar':'🇶🇦',
    'New Zealand':'🇳🇿','Honduras':'🇭🇳','El Salvador':'🇸🇻','Bolivia':'🇧🇴'
};

const GROUPS = [
    { id:'A', teams:['Argentina','France','Morocco','Japan'] },
    { id:'B', teams:['Brazil','Germany','Senegal','Australia'] },
    { id:'C', teams:['Uruguay','Spain','Nigeria','South Korea'] },
    { id:'D', teams:['Colombia','Italy','Ghana','Iran'] },
    { id:'E', teams:['Chile','England','Tunisia','Saudi Arabia'] },
    { id:'F', teams:['Ecuador','Portugal','Algeria','Qatar'] },
    { id:'G', teams:['Peru','Netherlands','Egypt','New Zealand'] },
    { id:'H', teams:['Paraguay','Belgium','Cameroon','USA'] },
    { id:'I', teams:['Mexico','Croatia','Switzerland','Honduras'] },
    { id:'J', teams:['Canada','Austria','Poland','Costa Rica'] },
    { id:'K', teams:['Jamaica','Denmark','Ukraine','El Salvador'] },
    { id:'L', teams:['Panama','Sweden','Czech Republic','Bolivia'] }
];

// 6 match pairs per group (round-robin)
function getGroupMatches(teams, groupId) {
    const pairs = [
        [0,1],[2,3],[0,2],[1,3],[0,3],[1,2]
    ];
    const dates = ['12 יוני','13 יוני','17 יוני','18 יוני','21 יוני','22 יוני'];
    return pairs.map((p, i) => ({
        home: teams[p[0]], away: teams[p[1]], date: dates[i]
    }));
}
