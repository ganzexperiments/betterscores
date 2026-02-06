import { Badge } from '../ui/Badge';
import { getTeamColors, getWinnerColors } from '../../utils/team-colors';

export const LiveGameHero = ({ game }) => {
  const { competitions } = game;
  const competition = competitions?.[0];
  
  if (!competition) return null;
  
  const { competitors, status } = competition;
  const [away, home] = competitors || [];
  
  const awayScore = parseInt(away?.score || 0);
  const homeScore = parseInt(home?.score || 0);
  
  // Get winner's colors for background
  const winnerColors = getWinnerColors(
    away.team?.abbreviation,
    home.team?.abbreviation,
    awayScore,
    homeScore
  );
  
  return (
    <div 
      className="relative overflow-hidden rounded-3xl p-8 mb-8 animate-slide-up"
      style={{
        background: `linear-gradient(135deg, ${winnerColors.primary}20 0%, ${winnerColors.secondary}10 100%)`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 80px ${winnerColors.primary}30`
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-[200px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          🏀
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <Badge variant="live" pulse className="text-base px-6 py-2">
            🔴 LIVE NOW
          </Badge>
        </div>
        
        <div className="flex items-center justify-center gap-12 mb-6">
          {/* Away Team */}
          <div className="text-center flex-1">
            <img 
              src={away.team?.logo} 
              alt={away.team?.displayName}
              className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl"
            />
            <div className="text-white text-2xl font-bold tracking-tight">
              {away.team?.displayName || away.team?.abbreviation}
            </div>
            {away.team?.rank && (
              <div className="text-yellow-400 text-sm font-bold mt-1">
                #{away.team.rank} Ranked
              </div>
            )}
          </div>
          
          {/* Score */}
          <div className="text-center">
            <div className="flex items-center gap-8">
              <span 
                className={`text-7xl font-black tabular-nums ${
                  awayScore > homeScore ? 'text-white' : 'text-white/50'
                }`}
              >
                {awayScore}
              </span>
              <span className="text-4xl text-white/40 font-bold">:</span>
              <span 
                className={`text-7xl font-black tabular-nums ${
                  homeScore > awayScore ? 'text-white' : 'text-white/50'
                }`}
              >
                {homeScore}
              </span>
            </div>
          </div>
          
          {/* Home Team */}
          <div className="text-center flex-1">
            <img 
              src={home.team?.logo} 
              alt={home.team?.displayName}
              className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl"
            />
            <div className="text-white text-2xl font-bold tracking-tight">
              {home.team?.displayName || home.team?.abbreviation}
            </div>
            {home.team?.rank && (
              <div className="text-yellow-400 text-sm font-bold mt-1">
                #{home.team.rank} Ranked
              </div>
            )}
          </div>
        </div>
        
        {/* Status bar */}
        <div className="text-center">
          <div className="text-white/80 text-lg font-semibold mb-3">
            {status.type?.detail}
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden max-w-md mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-1000"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
