// Scoring rivalries and situational importance
export const RIVALRIES = {
  'NBA': [
    ['LAL', 'BOS'], ['GS', 'LAL'], ['PHI', 'BOS'], ['NY', 'BKN'], ['DAL', 'PHX']
  ]
};

export const getGameImportance = (game, league) => {
  try {
    const competition = game?.competitions?.[0];
    if (!competition) return { score: 0, isHighStakes: false, reason: '' };
    
    const home = competition.competitors?.find(c => c.role === 'home' || c.homeAway === 'home');
    const away = competition.competitors?.find(c => c.role === 'away' || c.homeAway === 'away');
    
    if (!home || !away) return { score: 0, isHighStakes: false, reason: '' };
    
    let score = 0;
    
    // 1. Close records
    const getWins = (team) => {
      const summary = team.records?.[0]?.summary || team.record || '0-0';
      return parseInt(summary.split('-')[0]) || 0;
    };
    const homeWins = getWins(home);
    const awayWins = getWins(away);
    if (Math.abs(homeWins - awayWins) <= 5) score += 2;
    
    // 2. High stakes (Post-season or late season)
    const detail = (competition.status?.type?.detail || '').toLowerCase();
    const isCrunchTime = competition.status?.type?.state === 'in' && 
                        (detail.includes('4th') || detail.includes('2nd half')) && 
                        (parseInt(competition.status.displayClock?.split(':')[0] || 0) < 5);
    
    if (isCrunchTime) score += 5;
    
    // 3. Rivalry check
    const homeAbbr = home.team?.abbreviation || '';
    const awayAbbr = away.team?.abbreviation || '';
    const isRivalry = RIVALRIES[league?.toUpperCase()]?.some(r => 
      (r.includes(homeAbbr) && r.includes(awayAbbr))
    );
    if (isRivalry) score += 4;

    return {
      score,
      isHighStakes: score >= 5,
      reason: isCrunchTime ? 'High Stakes' : isRivalry ? 'Classic Rivalry' : 'Competitive'
    };
  } catch (err) {
    console.error('Importance cal failed', err);
    return { score: 0, isHighStakes: false, reason: '' };
  }
};

export const sortGamesByImportance = (games, league) => {
  if (!games) return [];
  return [...games].sort((a, b) => {
    const aImp = getGameImportance(a, league).score;
    const bImp = getGameImportance(b, league).score;
    return bImp - aImp;
  });
};
