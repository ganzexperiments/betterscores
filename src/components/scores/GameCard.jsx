import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isGameImportant } from '../../utils/game-importance';
import { GameCardExpanded } from './GameCardExpanded';

export const GameCard = ({ game, league = 'nba' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { competitions } = game;
  const competition = competitions?.[0];
  
  if (!competition) return null;

  const { competitors, status } = competition;
  const [away, home] = competitors || [];

  const isLive = status?.type?.state === 'in';
  const isFinal = status?.type?.state === 'post';
  const isPregame = status?.type?.state === 'pre';
  
  const awayScore = parseInt(away?.score || 0);
  const homeScore = parseInt(home?.score || 0);
  
  const important = isGameImportant(game, league);

  return (
    <>
      <div 
        onClick={() => setIsExpanded(true)}
        className={`relative overflow-hidden rounded-lg transition-colors duration-200 hover:border-white/20 bg-[#12151c] cursor-pointer ${
          important ? 'border border-blue-500/40' : 'border border-white/10'
        }`}
      >
        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-xs text-slate-500 font-medium">
              {status.type?.shortDetail}
            </div>
            {isLive && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-green-500 tracking-wide">LIVE</span>
              </div>
            )}
            {isFinal && (
              <div className="px-2 py-1 rounded bg-slate-800/50 border border-white/5">
                <span className="text-xs font-medium text-slate-400">Final</span>
              </div>
            )}
          </div>
          
          {/* Teams & Scores */}
          <div className="space-y-4">
            {/* Away Team */}
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-70 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/team/${league}/${away.team?.id}`);
                }}
              >
                {away.team?.logo ? (
                  <img 
                    src={away.team.logo}
                    alt={away.team.displayName}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-slate-800 animate-pulse" />
                )}
                <div className="flex flex-col">
                  <div className="text-base font-medium text-slate-200">
                    {away.team?.abbreviation}
                  </div>
                  {away.records?.[0] && (
                    <div className="text-xs text-slate-500">
                      {away.records[0].summary}
                    </div>
                  )}
                </div>
              </div>
              <div className={`text-2xl font-semibold tabular-nums ${isPregame ? 'text-slate-600' : 'text-slate-100'}`}>
                {isPregame ? '–' : awayScore}
              </div>
            </div>
            
            {/* Home Team */}
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-70 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/team/${league}/${home.team?.id}`);
                }}
              >
                {home.team?.logo ? (
                  <img 
                    src={home.team.logo}
                    alt={home.team.displayName}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-slate-800 animate-pulse" />
                )}
                <div className="flex flex-col">
                  <div className="text-base font-medium text-slate-200">
                    {home.team?.abbreviation}
                  </div>
                  {home.records?.[0] && (
                    <div className="text-xs text-slate-500">
                      {home.records[0].summary}
                    </div>
                  )}
                </div>
              </div>
              <div className={`text-2xl font-semibold tabular-nums ${isPregame ? 'text-slate-600' : 'text-slate-100'}`}>
                {isPregame ? '–' : homeScore}
              </div>
            </div>
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
