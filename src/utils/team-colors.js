const NCAAM_TEAM_COLORS = {
  // Big Ten
  ILL: { primary: '#FF5F05', secondary: '#13294B', name: 'Illinois' },
  MINN: { primary: '#7A0019', secondary: '#FFCC33', name: 'Minnesota' },
  MSU: { primary: '#18453B', secondary: '#FFFFFF', name: 'Michigan State' },
  NU: { primary: '#4E2A84', secondary: '#FFFFFF', name: 'Northwestern' },
  MICH: { primary: '#00274C', secondary: '#FFCB05', name: 'Michigan' },
  PSU: { primary: '#041E42', secondary: '#FFFFFF', name: 'Penn State' },
  
  // Big 12
  BYU: { primary: '#002E5D', secondary: '#FFFFFF', name: 'BYU' },
  OKST: { primary: '#FF7300', secondary: '#000000', name: 'Oklahoma State' },
  
  // SEC
  CLEM: { primary: '#F66733', secondary: '#522D80', name: 'Clemson' },
  
  // ACC
  LOU: { primary: '#AD0000', secondary: '#000000', name: 'Louisville' },
  ND: { primary: '#0C2340', secondary: '#C99700', name: 'Notre Dame' },
  
  // American
  HOU: { primary: '#C8102E', secondary: '#FFFFFF', name: 'Houston' },
  
  // West Coast
  GONZ: { primary: '#041E42', secondary: '#C8102E', name: 'Gonzaga' },
  PORT: { primary: '#542F85', secondary: '#FFFFFF', name: 'Portland' },
  
  // Mountain West
  
  // Independent / Other
  UCF: { primary: '#BA9B37', secondary: '#000000', name: 'UCF' },
  STAN: { primary: '#8C1515', secondary: '#FFFFFF', name: 'Stanford' },
  SJU: { primary: '#CE1141', secondary: '#FFFFFF', name: 'St. Johns' },
  CONN: { primary: '#000E2F', secondary: '#E4002B', name: 'UConn' },
};

export const NBA_TEAM_COLORS = {
  LAL: { primary: '#552583', secondary: '#FDB927', name: 'Lakers' },
  GSW: { primary: '#1D428A', secondary: '#FFC72C', name: 'Warriors' },
  BOS: { primary: '#007A33', secondary: '#BA9653', name: 'Celtics' },
  MIA: { primary: '#98002E', secondary: '#F9A01B', name: 'Heat' },
  DAL: { primary: '#00538C', secondary: '#002B5E', name: 'Mavericks' },
  DET: { primary: '#C8102E', secondary: '#1D42BA', name: 'Pistons' },
  PHI: { primary: '#006BB6', secondary: '#ED174C', name: '76ers' },
  BKN: { primary: '#000000', secondary: '#FFFFFF', name: 'Nets' },
  NY: { primary: '#006BB6', secondary: '#F58426', name: 'Knicks' },
  TOR: { primary: '#CE1141', secondary: '#000000', name: 'Raptors' },
  CHI: { primary: '#CE1141', secondary: '#000000', name: 'Bulls' },
  CLE: { primary: '#860038', secondary: '#FDBB30', name: 'Cavaliers' },
  IND: { primary: '#002D62', secondary: '#FDBB30', name: 'Pacers' },
  MIL: { primary: '#00471B', secondary: '#EEE1C6', name: 'Bucks' },
  ATL: { primary: '#E03A3E', secondary: '#C1D32F', name: 'Hawks' },
  CHA: { primary: '#1D1160', secondary: '#00788C', name: 'Hornets' },
  ORL: { primary: '#0077C0', secondary: '#C4CED4', name: 'Magic' },
  WSH: { primary: '#002B5C', secondary: '#E31837', name: 'Wizards' },
  DEN: { primary: '#0E2240', secondary: '#FEC524', name: 'Nuggets' },
  MIN: { primary: '#0C2340', secondary: '#236192', name: 'Timberwolves' },
  OKC: { primary: '#007AC1', secondary: '#EF3B24', name: 'Thunder' },
  POR: { primary: '#E03A3E', secondary: '#000000', name: 'Trail Blazers' },
  UTAH: { primary: '#002B5C', secondary: '#F9A01B', name: 'Jazz' },
  MEM: { primary: '#5D76A9', secondary: '#12173F', name: 'Grizzlies' },
  NO: { primary: '#0C2340', secondary: '#C8102E', name: 'Pelicans' },
  SA: { primary: '#C4CED4', secondary: '#000000', name: 'Spurs' },
  HOU: { primary: '#CE1141', secondary: '#000000', name: 'Rockets' },
  LAC: { primary: '#C8102E', secondary: '#1D428A', name: 'Clippers' },
  SAC: { primary: '#5A2D81', secondary: '#63727A', name: 'Kings' },
  PHX: { primary: '#1D1160', secondary: '#E56020', name: 'Suns' },
};

export const getTeamColors = (abbreviation) => {
  return NBA_TEAM_COLORS[abbreviation] || NCAAM_TEAM_COLORS[abbreviation] || { 
    primary: '#1E293B', 
    secondary: '#64748b' 
  };
};

export const getWinnerColors = (awayTeam, homeTeam, awayScore, homeScore) => {
  if (awayScore > homeScore) return getTeamColors(awayTeam);
  if (homeScore > awayScore) return getTeamColors(homeTeam);
  return { primary: '#1E293B', secondary: '#64748b' };
};
