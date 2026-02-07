/**
 * Mock Odds Generator
 * Produces realistic Vegas-style odds with implied probability calculations
 * Used for MVP while real odds data source is integrated
 */

// Implied probability from American odds
// Negative odds (favorite): implied% = |odds| / (|odds| + 100)
// Positive odds (underdog): implied% = 100 / (odds + 100)
const calculateImpliedProbability = (americanOdds) => {
  const odds = parseInt(americanOdds);
  if (odds < 0) {
    return Math.round((Math.abs(odds) / (Math.abs(odds) + 100)) * 100);
  } else {
    return Math.round((100 / (odds + 100)) * 100);
  }
};

// Generate mock odds based on seed, record, or arbitrary weighting
const generateMoneyline = (favoriteMargin = 3.5) => {
  // Convert point spread to moneyline
  // Rough formula: -110 is baseline for 3pt spread
  // Each additional point ≈ 10-15 in the odds
  const spread = Math.round(favoriteMargin * 10) / 10;
  
  // Favorite (negative)
  const favoriteMoney = Math.round(spread * 15);
  const favorite = -Math.max(100, 100 + favoriteMoney);
  
  // Underdog (positive) - slightly worse than perfect inverse due to vigorish
  const underdog = Math.round(Math.abs(favorite * 1.05));
  
  return { favorite, underdog };
};

export const mockOdds = {
  // Generate a single game's odds
  generateGameOdds: (homeTeam, awayTeam, homeRecord, awayRecord, seed = null) => {
    // Simple ELO-like calculation for demonstration
    // In reality: use ESPN/Vegas data or ML model
    
    // Seed advantage (if college)
    const homeSeeded = seed?.home ? Math.pow(seed.home, 0.8) : 0;
    const awaySeeded = seed?.away ? Math.pow(seed.away, 0.8) : 0;
    
    // Record parsing: "5-3" → wins
    const getWins = (record) => {
      if (!record) return 10;
      const [wins] = record.split('-').map(Number);
      return wins || 10;
    };
    
    const homeWins = getWins(homeRecord);
    const awayWins = getWins(awayRecord);
    
    // Home court advantage (2.5 pts) + record difference + seed
    const pointDifferential = 2.5 + (homeWins - awayWins) * 0.3 - (homeSeeded - awaySeeded) * 0.5;
    
    // Generate moneyline
    const { favorite, underdog } = generateMoneyline(Math.abs(pointDifferential));
    
    const [homeML, awayML] = pointDifferential > 0 
      ? [favorite, underdog]
      : [underdog, favorite];
    
    // Spread (roughly: point differential × 1.1 for vigorish)
    const spreadValue = Math.round(pointDifferential * 11) / 10;
    
    // Over/Under (simplified: base 210, adjust ±5 for pace/defense)
    const baseTotal = 210;
    const paceFactor = (homeWins + awayWins) / 20; // Teams that win = fast pace
    const total = Math.round(baseTotal + (paceFactor * 5));
    
    return {
      moneylineHome: homeML,
      moneylineAway: awayML,
      moneylineProbHome: calculateImpliedProbability(homeML),
      moneylineProbAway: calculateImpliedProbability(awayML),
      spread: spreadValue,
      spreadDisplay: spreadDisplay,
      overUnder: total,
      source: 'mock-data', // Indicates this is demo/MVP
    };
  },

  // Parse existing ESPN odds or fill with mock
  enrichOdds: (espnOdds, homeTeam, awayTeam, homeRecord, awayRecord) => {
    // If ESPN odds exist, use them
    if (espnOdds?.moneylineHome && espnOdds.moneylineHome !== 'N/A') {
      return {
        ...espnOdds,
        moneylineProbHome: calculateImpliedProbability(espnOdds.moneylineHome),
        moneylineProbAway: calculateImpliedProbability(espnOdds.moneylineAway),
      };
    }
    
    // Otherwise generate mock
    return mockOdds.generateGameOdds(homeTeam, awayTeam, homeRecord, awayRecord);
  },

  // Calculate parlay payout (for future feature)
  calculateParlayPayout: (bets) => {
    // bets: [{ odds: -110, wager: 100 }, ...]
    let payout = bets[0].wager;
    
    for (let i = 0; i < bets.length; i++) {
      const odds = bets[i].odds;
      const multiplier = odds < 0 
        ? 100 / Math.abs(odds)
        : odds / 100;
      payout = payout * (1 + multiplier);
    }
    
    return Math.round(payout);
  },

  // Format odds for display
  formatOdds: (odds) => {
    if (odds === 'N/A' || !odds) return 'N/A';
    const num = parseInt(odds);
    return num > 0 ? `+${num}` : `${num}`;
  },
};
