import { useState, useEffect } from 'react';
import { X, TrendingUp, Zap, Target, BarChart3, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { espnAPI } from '../../utils/api-client';
import { mockOdds } from '../../utils/mock-odds';

export const GameCardExpanded = ({ game, league = 'nba', onClose }) => {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await espnAPI.getGameSummary(league, game.id);
        setSummary(summaryData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [game.id, league]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const competition = game.competitions?.[0];
  if (!competition) return null;

  const [away, home] = competition.competitors || [];
  if (!home || !away) return null;

  const isLive = competition.status?.type?.state === 'in';
  const isOver = competition.status?.type?.state === 'post';

  const getOdds = () => {
    const odds = game.competitions?.[0]?.odds?.[0];
    
    // Try to get ESPN data first
    const mlHome = odds?.moneyline?.home?.close?.odds;
    const mlAway = odds?.moneyline?.away?.close?.odds;
    
    // Use ESPN if available, otherwise generate mock
    if (mlHome && mlAway && mlHome !== 'N/A' && mlAway !== 'N/A') {
      return mockOdds.enrichOdds(
        {
          moneylineHome: mlHome,
          moneylineAway: mlAway,
          spread: odds.spread,
          spreadText: odds.details || 'N/A',
          overUnder: odds.overUnder,
        },
        home.team?.shortDisplayName,
        away.team?.shortDisplayName,
        home.records?.[0]?.summary,
        away.records?.[0]?.summary
      );
    }
    
    // Generate mock odds for MVP
    return mockOdds.generateGameOdds(
      home.team?.shortDisplayName,
      away.team?.shortDisplayName,
      home.records?.[0]?.summary,
      away.records?.[0]?.summary
    );
  };

  const getSmartAnalysis = () => {
    if (!summary && !isLive) return { 
      title: "Pregame Setup", 
      description: "Loading analysis...", 
      icon: <TrendingUp size={16} /> 
    };
    
    const plays = summary?.plays || [];
    const homeScoreValue = parseInt(home.score) || 0;
    const awayScoreValue = parseInt(away.score) || 0;
    const detail = (competition.status?.type?.detail || '').toLowerCase();
    const isCrunchTime = isLive && (detail.includes('4th') || detail.includes('2nd half')) && (parseInt(competition.status?.displayClock?.split(':')[0] || 0) < 5);

    // Run Detection for live games
    let homeRun = 0;
    let awayRun = 0;
    if (plays.length >= 2) {
      for (let i = plays.length - 1; i >= 0 && i > plays.length - 8; i--) {
         const p = plays[i];
         const prev = plays[i-1];
         if (p.scoringPlay && prev) {
            if (p.homeScore > prev.homeScore) homeRun += (p.homeScore - prev.homeScore);
            if (p.awayScore > prev.awayScore) awayRun += (p.awayScore - prev.awayScore);
         }
      }
    }

    // Crunchy time analysis
    if (isCrunchTime) {
        const margin = Math.abs(homeScoreValue - awayScoreValue);
        const leader = homeScoreValue > awayScoreValue ? home.team.shortDisplayName : away.team.shortDisplayName;
        return {
            title: "Crunch Time",
            description: `${leader} up ${margin}. Possession and execution are everything in the final minutes.`,
            icon: <Zap className="text-yellow-400" size={16} />
        };
    }

    // Momentum swing
    if (homeRun >= 8 || awayRun >= 8) {
       const runTeam = homeRun >= 8 ? home.team.shortDisplayName : away.team.shortDisplayName;
       return {
          title: "Hot Streak",
          description: `${runTeam} on a ${Math.max(homeRun, awayRun)}-point run. Offense clicking on all cylinders.`,
          icon: <TrendingUp className="text-orange-400" size={16} />
       };
    }

    // Live game general analysis
    if (isLive) {
        const leader = homeScoreValue > awayScoreValue ? home.team.shortDisplayName : away.team.shortDisplayName;
        return {
            title: "Live Action",
            description: `${leader} leads. Check the full stats for scoring trends and bench performance.`,
            icon: <Target className="text-blue-400" size={16} />
        };
    }

    // Pregame: Use records to inform analysis
    const homeRecord = home.records?.[0]?.summary || '';
    const awayRecord = away.records?.[0]?.summary || '';
    const homeSeedIcon = home.seedValue ? `(#${home.seedValue})` : '';
    const awaySeedIcon = away.seedValue ? `(#${away.seedValue})` : '';
    
    const oddsData = getOdds();
    const suggestsFavorite = oddsData?.spreadText?.includes('-') ? 
      `${home.team.shortDisplayName} favored` : 
      `${away.team.shortDisplayName} favored`;
    
    return {
        title: "Pregame Matchup",
        description: `${away.team.shortDisplayName} ${awayRecord} ${awaySeedIcon} @ ${home.team.shortDisplayName} ${homeRecord} ${homeSeedIcon}. ${suggestsFavorite} per oddsmakers.`,
        icon: <BarChart3 className="text-slate-400" size={16} />
    };
  };

  const analysis = getSmartAnalysis();
  const displayOdds = getOdds();

  const handleClose = () => {
    document.body.style.overflow = 'auto';
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div 
        className="bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '80vh' }}
      >
        {/* Enhanced Header with Records (Sticky) */}
        <div className="sticky top-0 p-4 sm:p-6 border-b border-white/5 flex justify-between items-start bg-[#0f1117]/95 backdrop-blur z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
               <span className="text-[10px] sm:text-[11px] font-black text-blue-400 uppercase tracking-widest flex-shrink-0">
                 {competition?.status?.type?.detail || 'Game'}
               </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mb-1 truncate">
              {away.team?.abbreviation} @ {home.team?.abbreviation}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              {away.team?.shortDisplayName} ({away.records?.[0]?.summary || '—'}) vs {home.team?.shortDisplayName} ({home.records?.[0]?.summary || '—'})
            </p>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all text-slate-400 hover:text-slate-100 flex-shrink-0 ml-2 group"
            title="Close modal (Esc)"
          >
            <X size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Info Grid (Scrollable Content) */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Analysis Card - Muted */}
          <div className="bg-blue-500/[0.03] border border-blue-500/10 p-4 rounded-xl flex gap-3 items-center">
             <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                {analysis.icon}
             </div>
             <div>
                <h4 className="text-[10px] font-black text-blue-400/80 uppercase tracking-widest mb-0.5">{analysis.title}</h4>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{analysis.description}</p>
             </div>
          </div>

           {/* Betting Data - Enhanced with Implied Probability */}
           {displayOdds && (
             <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-5">
                <div>
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    Vegas Lines
                    {displayOdds.source === 'mock-data' && (
                      <span className="text-[8px] bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded opacity-60">MVP Data</span>
                    )}
                  </h4>
                  
                  {/* Moneyline with Implied Probability */}
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Moneyline (Implied %)</div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Away Team */}
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm font-bold text-white">{mockOdds.formatOdds(displayOdds.moneylineAway)}</span>
                          <span className="text-[10px] font-bold text-cyan-400">{displayOdds.moneylineProbAway}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500/60 rounded-full transition-all duration-300"
                            style={{ width: `${displayOdds.moneylineProbAway}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-slate-500">{away.team?.abbreviation}</div>
                      </div>
                      
                      {/* Home Team */}
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm font-bold text-white">{mockOdds.formatOdds(displayOdds.moneylineHome)}</span>
                          <span className="text-[10px] font-bold text-orange-400">{displayOdds.moneylineProbHome}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-orange-500/60 rounded-full transition-all duration-300"
                            style={{ width: `${displayOdds.moneylineProbHome}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-slate-500">{home.team?.abbreviation}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spread & Total */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                  <div>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-wider block mb-2">Spread</span>
                    <div className="text-base font-bold text-white tabular-nums">{displayOdds.spread > 0 ? `+${displayOdds.spread}` : displayOdds.spread}</div>
                    <div className="text-[9px] text-slate-500 mt-1">{home.team?.abbreviation} favored</div>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-wider block mb-2">Total</span>
                    <div className="text-base font-bold text-white tabular-nums">{displayOdds.overUnder}</div>
                    <div className="text-[9px] text-slate-500 mt-1">O/U</div>
                  </div>
                </div>
             </div>
           )}

           {/* Live Game Context */}
           {isLive && (
              <div className="space-y-4 pt-2 border-t border-white/5">
                 {/* Leading Scorers - Top 3 only */}
                 {summary?.boxscore?.players && (
                    <div>
                       <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Leading Scorers</h4>
                       <div className="space-y-2">
                          {summary.boxscore.players.slice(0, 2).map((team, teamIdx) => {
                             const leader = team.statistics?.[0]?.athletes?.[0];
                             if (!leader) return null;
                             const fouls = leader?.stats?.[10]; // Foul count typically at index 10
                             const hasFoulTrouble = fouls >= 4;
                             return (
                                <div key={`${team.team.id}-${teamIdx}`} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                   <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <img src={team.team.logo} className="w-7 h-7 flex-shrink-0 opacity-80" />
                                      <div className="flex-1 min-w-0">
                                         <div className="text-sm font-semibold text-slate-100 truncate">{leader?.athlete?.displayName}</div>
                                         <div className="text-[10px] text-slate-500">{team.team.abbreviation}</div>
                                      </div>
                                   </div>
                                   <div className="text-right flex-shrink-0 ml-2">
                                      <div className="text-base font-black text-white tabular-nums">{leader?.stats?.[1] || 0}</div>
                                      <div className="text-[9px] text-slate-500 font-medium">PTS</div>
                                      {hasFoulTrouble && (
                                         <div className="text-[8px] text-yellow-400 font-bold mt-0.5">⚠️ {fouls}F</div>
                                      )}
                                   </div>
                                </div>
                             )
                          })}
                       </div>
                    </div>
                 )}

                 {/* Live Game Status */}
                 <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-4 flex justify-between items-end">
                    <div>
                       <div className="text-[9px] font-black text-blue-400/70 uppercase tracking-widest mb-1">Live Status</div>
                       <div className="text-sm text-slate-300 font-medium">Q{competition.status?.period || '—'} • {competition.status?.displayClock || '—'}</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                 </div>
              </div>
           )}

           {/* Postgame Summary */}
           {isOver && (
              <div className="pt-2 border-t border-white/5">
                 <p className="text-sm text-slate-300">
                    Final: {parseInt(home.score) > parseInt(away.score) ? home.team.shortDisplayName : away.team.shortDisplayName} wins
                 </p>
              </div>
           )}
        </div>

        {/* Footer padding to prevent content hiding under bottom of modal */}
        <div className="h-4"></div>
      </div>
    </div>
  );
};
