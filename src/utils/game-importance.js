// Determine game importance for "Games to Watch" filtering

const RIVALRY_MATCHUPS = {
  nba: [
    ['LAL', 'BOS'], ['LAL', 'GSW'], ['BOS', 'PHI'],
    ['NYK', 'BKN'], ['CHI', 'DET'], ['LAC', 'LAL'],
    ['MIA', 'BOS'], ['DAL', 'HOU'], ['POR', 'SEA']
  ],
  ncaam: [
    ['UNC', 'DUKE'], ['UK', 'UL'], ['UCLA', 'USC'],
    ['MICH', 'OSU'], ['KU', 'MU'], ['IU', 'PUR']
  ]
};

const TOP_TEAMS_THRESHOLD = 10; // Top 10 teams in standings

// Favorite teams - always considered important
const FAVORITE_TEAMS = {
  nba: ['NYK'], // Knicks
  ncaam: []
};

export const calculateGameImportance = (game, league = 'nba') => {
  const competition = game.competitions?.[0];
  if (!competition) return 0;

  const [away, home] = competition.competitors || [];
  const awayAbbr = away.team?.abbreviation;
  const homeAbbr = home.team?.abbreviation;
  
  let score = 0;
  
  // 0. Favorite team (+3 points - ensures it's always "important")
  const favorites = FAVORITE_TEAMS[league] || [];
  if (favorites.includes(awayAbbr) || favorites.includes(homeAbbr)) {
    score += 3;
  }
  
  // 1. Rivalry matchup (+3 points)
  const rivalries = RIVALRY_MATCHUPS[league] || [];
  const isRivalry = rivalries.some(([t1, t2]) => 
    (awayAbbr === t1 && homeAbbr === t2) || (awayAbbr === t2 && homeAbbr === t1)
  );
  if (isRivalry) score += 3;
  
  // 2. Close records (+2 points if within 5 games)
  const awayWins = parseInt(away.records?.[0]?.summary?.split('-')[0] || 0);
  const homeWins = parseInt(home.records?.[0]?.summary?.split('-')[0] || 0);
  if (Math.abs(awayWins - homeWins) <= 5) score += 2;
  
  // 3. Top teams playing (+2 points if either is ranked/top record)
  const awayRank = away.curatedRank?.current || away.team?.rank;
  const homeRank = home.curatedRank?.current || home.team?.rank;
  if (awayRank && awayRank <= TOP_TEAMS_THRESHOLD) score += 2;
  if (homeRank && homeRank <= TOP_TEAMS_THRESHOLD) score += 2;
  
  // 4. Playoff-caliber matchup (both teams over .500)
  const awayRecord = away.records?.[0]?.summary || '0-0';
  const homeRecord = home.records?.[0]?.summary || '0-0';
  const [awayW, awayL] = awayRecord.split('-').map(n => parseInt(n) || 0);
  const [homeW, homeL] = homeRecord.split('-').map(n => parseInt(n) || 0);
  const awayWinPct = awayW / (awayW + awayL);
  const homeWinPct = homeW / (homeW + homeL);
  if (awayWinPct > 0.5 && homeWinPct > 0.5) score += 1;
  
  return score;
};

export const sortGamesByImportance = (games, league = 'nba') => {
  return [...games].sort((a, b) => {
    const scoreA = calculateGameImportance(a, league);
    const scoreB = calculateGameImportance(b, league);
    return scoreB - scoreA; // Highest importance first
  });
};

export const isGameImportant = (game, league = 'nba') => {
  return calculateGameImportance(game, league) >= 3; // Threshold for "important"
};
