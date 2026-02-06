import { useState, useEffect } from 'react';
import { X, TrendingUp, Zap, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { espnAPI } from '../../utils/api-client';

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

  const competition = game.competitions?.[0];
  if (!competition) return null;

  const [away, home] = competition.competitors || [];
  if (!home || !away) return null;

  const isLive = competition.status?.type?.state === 'in';
  const isOver = competition.status?.type?.state === 'post';

  const getOdds = () => {
    const odds = game.competitions?.[0]?.odds?.[0];
    if (!odds) return null;
    
    const mlHome = odds.moneyline?.home?.close?.odds;
    const mlAway = odds.moneyline?.away?.close?.odds;
    
    return {
      moneylineHome: mlHome || 'N/A',
      moneylineAway: mlAway || 'N/A',
      spread: odds.spread,
      spreadText: odds.details || 'N/A',
      overUnder: odds.overUnder,
    };
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
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 transition-all duration-500 overflow-hidden pt-2 sm:pt-4" onClick={handleClose}>
      <div 
        className="bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Enhanced Header with Records (Sticky) */}
        <div className="sticky top-0 p-4 sm:p-6 border-b border-white/5 flex justify-between items-start bg-[#0f1117]/95 backdrop-blur z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
               <span className="text-[10px] sm:text-[11px] font-black text-blue-400 uppercase tracking-widest flex-shrink-0">
                 {competition.status.type.detail}
               </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mb-1 truncate">
              {away.team?.abbreviation} @ {home.team?.abbreviation}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              {away.team?.shortDisplayName} ({away.records?.[0]?.summary || '—'}) vs {home.team?.shortDisplayName} ({home.records?.[0]?.summary || '—'})
            </p>
          </div>
          <button onClick={handleClose} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg border border-white/5 transition-all text-slate-500 hover:text-slate-200 flex-shrink-0 ml-2">
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Info Grid (Scrollable Content) */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
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

           {/* Betting Data - Complete */}
           {displayOdds && (
             <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Vegas Lines</h4>
                <div className="grid grid-cols-3 gap-3 items-start">
                   <div className="text-center">
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-wider block mb-3">Moneyline</span>
                      <div className="text-sm font-bold text-white mb-2">{displayOdds.moneylineAway} / {displayOdds.moneylineHome}</div>
                      <div className="text-[9px] text-slate-500">{away.team?.abbreviation} / {home.team?.abbreviation}</div>
                   </div>
                   <div className="text-center">
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-wider block mb-3">Spread</span>
                      <div className="text-base font-bold text-white tabular-nums mb-2">{displayOdds.spreadText}</div>
                      <div className="text-[9px] text-slate-500">{displayOdds.spread ? `(${displayOdds.spread})` : '(—)'}</div>
                   </div>
                   <div className="text-center">
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-wider block mb-3">Total</span>
                      <div className="text-base font-bold text-white tabular-nums mb-2">{displayOdds.overUnder || 'N/A'}</div>
                      <div className="text-[9px] text-slate-500">(—)</div>
                   </div>
                </div>
             </div>
           )}

           {/* Live Game Context */}
           {isLive && (
              <div className="space-y-4 pt-2 border-t border-white/5">
                 <div>
                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Leading Scorers</h4>
                    <div className="grid grid-cols-1 divide-y divide-white/5">
                       {summary?.boxscore?.players?.map(team => {
                          const leader = team.statistics?.[0]?.athletes?.[0];
                          const fouls = leader?.stats?.[10]; // Foul count typically at index 10
                          const hasFoulTrouble = fouls >= 4;
                          return (
                             <div key={team.team.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3 flex-1">
                                   <img src={team.team.logo} className="w-6 h-6 opacity-70" />
                                   <div className="flex-1">
                                      <div className="text-sm font-semibold text-slate-100">{leader?.athlete?.displayName}</div>
                                      <div className="text-[10px] text-slate-500">{team.team.abbreviation}</div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="text-sm font-black text-white tabular-nums">{leader?.stats?.[1] || 0}</div>
                                   <div className="text-[9px] text-slate-500">PTS</div>
                                   {hasFoulTrouble && (
                                      <div className="text-[8px] text-yellow-400 font-bold mt-0.5">⚠️ {fouls} fouls</div>
                                   )}
                                </div>
                             </div>
                          )
                       })}
                    </div>
                 </div>

                 {/* Live Game Status */}
                 <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Quarter {competition.status?.period || '—'}</div>
                    <div className="text-base font-bold text-white mt-1">{competition.status?.displayClock || '—'}</div>
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

        {/* Footer CTA (Sticky) */}
        <div className="sticky bottom-0 p-4 sm:p-6 border-t border-white/5 bg-[#0f1117]/95 backdrop-blur z-10 flex gap-3">
           <button 
              onClick={() => navigate(`/standings`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm"
           >
              View Full Stats
           </button>
           <button 
              onClick={handleClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-200 font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm border border-white/10"
           >
              Close
           </button>
        </div>
      </div>
    </div>
  );
};
