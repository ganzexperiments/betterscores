import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameImportance } from '../../utils/game-importance';
import { getTeamColor } from '../../utils/team-colors';
import { GameCardExpanded } from './GameCardExpanded';
import MomentumSparkline from './MomentumSparkline';
import { espnAPI } from '../../utils/api-client';

export const GameCard = ({ game, league = 'nba' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summary, setSummary] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();
  
  const competition = game.competitions?.[0];
  if (!competition) return null;

  const { competitors, status } = competition;
  const [away, home] = competitors || [];

  const isLive = status?.type?.state === 'in';
  
  useEffect(() => {
    if (isLive) {
      espnAPI.getGameSummary(league, game.id).then(setSummary);
    }
  }, [isLive, game.id, league]);

  const { score: importanceScore, reason } = getGameImportance(game, league);

  const handleExpandClick = () => {
    setIsExpanded(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsExpanded(false);
    document.body.style.overflow = 'auto';
  };

  const homeTeamColor = getTeamColor(home?.team?.id);
  const awayTeamColor = getTeamColor(away?.team?.id);

  return (
    <>
      <div 
        onClick={handleExpandClick}
        className="group relative overflow-hidden rounded-lg transition-all duration-300 bg-gradient-to-br from-[#0f1117] to-[#0a0e27] border border-white/8 cursor-pointer hover:border-white/15 hover:shadow-lg hover:shadow-blue-500/10"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)`
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider letter-spacing-1">{status.type?.shortDetail}</span>
               {importanceScore >= 5 && (
                 <span className="text-[9px] text-blue-300 font-semibold uppercase tracking-wide">✨ {reason}</span>
               )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className="text-slate-400 hover:text-yellow-400 transition-colors duration-200"
            >
              {isFavorited ? '⭐' : '☆'}
            </button>
            {isLive && <MomentumSparkline plays={summary?.plays} />}
          </div>
          
          <div className="space-y-4">
            {[away, home].map((team, idx) => (
              <div key={team?.team?.id} className="flex items-center justify-between group/team">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/team/${league}/${team?.team?.id}`);
                  }}
                >
                   <div className="relative">
                     <img src={team?.team?.logo} className="w-9 h-9 object-contain filter drop-shadow-lg" />
                   </div>
                   <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-white uppercase tracking-tight leading-tight">{team?.team?.abbreviation}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{team?.records?.[0]?.summary}</span>
                   </div>
                </div>
                <div className={`text-2xl font-bold tabular-nums ml-3 ${team?.team?.id === home?.team?.id ? 'text-blue-400' : 'text-slate-100'}`}>
                   {team?.score}
                </div>
              </div>
            ))}
          </div>

          {/* Betting odds placeholder - ready for integration */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-2">Vegas Line</div>
            <div className="flex justify-between items-center text-xs">
              <div className="text-slate-400">Moneyline • Spread • Total</div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                View →
              </button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <GameCardExpanded 
          game={game}
          league={league}
          onClose={handleClose} 
        />
      )}
    </>
  );
};
