import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameImportance } from '../../utils/game-importance';
import { GameCardExpanded } from './GameCardExpanded';
import MomentumSparkline from './MomentumSparkline';
import { espnAPI } from '../../utils/api-client';

export const GameCard = ({ game, league = 'nba' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summary, setSummary] = useState(null);
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

  return (
    <>
      <div 
        onClick={() => setIsExpanded(true)}
        className="group relative overflow-hidden rounded-xl transition-all duration-200 hover:border-white/20 bg-[#0f1117] border border-white/5 cursor-pointer hover:shadow-2xl"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{status.type?.shortDetail}</span>
               {importanceScore >= 5 && (
                 <span className="text-[9px] text-blue-400 font-bold uppercase mt-0.5">✨ {reason}</span>
               )}
            </div>
            {isLive && <MomentumSparkline plays={summary?.plays} />}
          </div>
          
          <div className="space-y-3">
            {[away, home].map((team, idx) => (
              <div key={team?.team?.id} className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/team/${league}/${team?.team?.id}`);
                  }}
                >
                   <img src={team?.team?.logo} className="w-8 h-8 object-contain" />
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-white uppercase tracking-tight">{team?.team?.abbreviation}</span>
                      <span className="text-[10px] text-slate-500">{team?.records?.[0]?.summary}</span>
                   </div>
                </div>
                <div className={`text-xl font-bold tabular-nums ${team?.team?.id === home?.team?.id ? 'text-blue-500' : 'text-slate-100'}`}>
                   {team?.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isExpanded && (
        <GameCardExpanded 
          game={game}
          league={league}
          onClose={() => setIsExpanded(false)} 
        />
      )}
    </>
  );
};
