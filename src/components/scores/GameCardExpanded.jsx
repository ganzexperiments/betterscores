import { useState, useEffect } from 'react';
import { X, TrendingUp, Zap, Target } from 'lucide-react';
import { espnAPI } from '../../utils/api-client';

export const GameCardExpanded = ({ game, league = 'nba', onClose }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const competition = game.competitions?.[0];
  if (!competition) return null;

  const [away, home] = competition.competitors || [];
  if (!home || !away) return null;

  const isLive = competition.status?.type?.state === 'in';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await espnAPI.getGameSummary(league, game.id);
        setSummary(summaryData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [game.id, league]);

  const getSmartAnalysis = () => {
    if (!summary) return { title: "Analyzing", description: "Calculating momentum coefficients...", icon: <TrendingUp size={16} /> };
    
    // ESPN nests odds deeper in the scoreboard/header response
    const currentOdds = game.competitions?.[0]?.odds?.[0] || summary.header?.competitions?.[0]?.odds?.[0] || summary.odds?.[0];
    
    const plays = summary.plays || [];
    const homeScoreValue = parseInt(home.score) || 0;
    const awayScoreValue = parseInt(away.score) || 0;
    const detail = (game.status?.type?.detail || '').toLowerCase();
    const isCrunchTime = isLive && (detail.includes('4th') || detail.includes('2nd half')) && (parseInt(game.status.displayClock?.split(':')[0] || 0) < 5);

    // Run Detection Magic
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

    if (isCrunchTime) {
        return {
            title: "High Leverage",
            description: "Winning probability at peak volatility. Every play is a pivot point.",
            icon: <Zap className="text-yellow-400 fill-yellow-400/20" size={16} />,
            odds: currentOdds
        };
    }

    if (homeRun >= 8 || awayRun >= 8) {
       return {
          title: "Momentum Swing",
          description: `${homeRun >= 8 ? home.team.shortDisplayName : away.team.shortDisplayName} is on a ${Math.max(homeRun, awayRun)}-0 blitz.`,
          icon: <TrendingUp className="text-orange-400" size={16} />,
          odds: currentOdds
       };
    }

    if (isLive) {
        const leader = homeScoreValue > awayScoreValue ? home.team.shortDisplayName : away.team.shortDisplayName;
        return {
            title: "Efficiency Index",
            description: `${leader} currently holding the technical advantage based on possession delta.`,
            icon: <Target className="text-blue-400" size={16} />,
            odds: currentOdds
        };
    }
    
    return {
        title: "Matchup Recap",
        description: `Analysis complete. ${homeScoreValue > awayScoreValue ? home.team.shortDisplayName : away.team.shortDisplayName} optimized their transition play.`,
        icon: <TrendingUp className="text-slate-400" size={16} />,
        odds: currentOdds
    };
  };

  const analysis = getSmartAnalysis();
  const displayOdds = analysis.odds;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-500" onClick={onClose}>
      <div 
        className="bg-[#0f1117] border border-white/10 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simplified Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div>
            <div className="flex items-center gap-2 mb-1 opacity-60">
               <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                 {game.status.type.detail}
               </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {away.team?.abbreviation} @ {home.team?.abbreviation}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg border border-white/5 transition-all text-slate-500 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        {/* Info Grid */}
        <div className="p-6 space-y-6">
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

           {/* Betting Data - High Density */}
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Spread</span>
                 <div className="text-lg font-bold text-white">{displayOdds?.details || 'N/A'}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Total</span>
                 <div className="text-lg font-bold text-white tabular-nums">{displayOdds?.overUnder || 'N/A'}</div>
              </div>
           </div>

           {/* Leaderboard - Clean Table Style */}
           {isLive && summary?.boxscore && (
              <div className="space-y-3 pt-2">
                 <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Top Performers</h4>
                 <div className="grid grid-cols-1 divide-y divide-white/5">
                    {summary.boxscore.players?.map(team => {
                       const leader = team.statistics?.[0]?.athletes?.[0];
                       return (
                          <div key={team.team.id} className="flex items-center justify-between py-3 px-1">
                             <div className="flex items-center gap-3">
                                <img src={team.team.logo} className="w-6 h-6 grayscale opacity-50" />
                                <div className="text-sm font-semibold text-slate-200">{leader?.athlete?.displayName}</div>
                             </div>
                             <div className="text-xs font-black text-white tabular-nums">
                                {leader?.stats?.[1]} <span className="text-slate-500 font-bold ml-1 text-[10px]">PTS</span>
                             </div>
                          </div>
                       )
                    })}
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
