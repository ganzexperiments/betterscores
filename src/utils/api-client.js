const ESPN_BASE = 'https://site.api.espn.com/apis';

export const espnAPI = {
  // NBA Endpoints
  getNBAScoreboard: async (date) => {
    console.log('Fetching NBA Scoreboard for date:', date);
    const url = date 
      ? `${ESPN_BASE}/site/v2/sports/basketball/nba/scoreboard?dates=${date}`
      : `${ESPN_BASE}/site/v2/sports/basketball/nba/scoreboard`;
    const response = await fetch(url);
    return response.json();
  },

  getNBAStandings: async () => {
    const response = await fetch(`${ESPN_BASE}/v2/sports/basketball/nba/standings`);
    return response.json();
  },

  // NCAAM Endpoints
  getNCAAMScoreboard: async (date) => {
    const url = date
      ? `${ESPN_BASE}/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=${date}`
      : `${ESPN_BASE}/site/v2/sports/basketball/mens-college-basketball/scoreboard`;
    const response = await fetch(url);
    return response.json();
  },

  getNCAAMRankings: async () => {
    const response = await fetch(
      `${ESPN_BASE}/site/v2/sports/basketball/mens-college-basketball/rankings`
    );
    return response.json();
  },

  getNCAAMStandings: async () => {
    const response = await fetch(
      `${ESPN_BASE}/v2/sports/basketball/mens-college-basketball/standings`
    );
    return response.json();
  },

  // Player Stats
  getPlayerStats: async (playerId) => {
    // Use core API for player data
    const response = await fetch(
      `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/athletes/${playerId}/statistics/0?lang=en&region=us`
    );
    const statsData = await response.json();
    
    // Also fetch basic player info
    const playerResponse = await fetch(
      `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/athletes/${playerId}?lang=en&region=us`
    );
    const playerData = await playerResponse.json();
    
    return {
      athlete: playerData,
      statistics: statsData.splits?.categories || []
    };
  },

  // Team Details
  getTeamInfo: async (league, teamId) => {
    const leaguePath = league === 'nba' ? 'nba' : 'mens-college-basketball';
    const response = await fetch(
      `${ESPN_BASE}/site/v2/sports/basketball/${leaguePath}/teams/${teamId}`
    );
    return response.json();
  },

  getTeamRoster: async (league, teamId) => {
    const leaguePath = league === 'nba' ? 'nba' : 'mens-college-basketball';
    const response = await fetch(
      `${ESPN_BASE}/site/v2/sports/basketball/${leaguePath}/teams/${teamId}/roster`
    );
    return response.json();
  },

  getTeamStatistics: async (league, teamId) => {
    const leaguePath = league === 'nba' ? 'nba' : 'mens-college-basketball';
    const response = await fetch(
      `${ESPN_BASE}/site/v2/sports/basketball/${leaguePath}/teams/${teamId}/statistics`
    );
    return response.json();
  },

  getGameOdds: async (league, gameId) => {
    const leaguePath = league === 'nba' ? 'nba' : 'mens-college-basketball';
    const response = await fetch(
      `${ESPN_BASE}/site/v2/sports/basketball/${leaguePath}/scoreboard/${gameId}/odds`
    );
    return response.json();
  },

  // Live game box score
  getGameSummary: async (league, gameId) => {
    const leaguePath = league === 'nba' ? 'nba' : 'mens-college-basketball';
    const response = await fetch(
      `${ESPN_BASE}/site/v2/sports/basketball/${leaguePath}/summary?event=${gameId}`
    );
    return response.json();
  },

  getWinProbability: async (league, gameId) => {
    const leaguePath = league === 'nba' ? 'nba' : 'mens-college-basketball';
    const response = await fetch(
      `${ESPN_BASE}/site/v2/sports/basketball/${leaguePath}/summary?event=${gameId}`
    );
    const data = await response.json();
    return data.winProbability || [];
  },

  getPlayByPlay: async (league, gameId) => {
    const leaguePath = league === 'nba' ? 'nba' : 'mens-college-basketball';
    const response = await fetch(
      `${ESPN_BASE}/site/v2/sports/basketball/${leaguePath}/summary?event=${gameId}`
    );
    const data = await response.json();
    return data.plays || [];
  }
};

// Date formatting helper for ESPN API (YYYYMMDD)
export const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};
