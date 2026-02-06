import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { espnAPI } from '../../utils/api-client';

export const GameCardExpanded = ({ game, league = 'nba', onClose }) => {
  const [boxScore, setBoxScore] = useState(null);
  const [loadingBox, setLoadingBox] = useState(false);
  
  const competition = game.competitions?.[0];
  if (!competition) return null;

  const [away, home] = competition.competitors || [];
  const broadcast = competition.broadcasts?.[0];
  const isLive = competition.status?.type?.state === 'in';
  
  // Fetch box score for live games
  useEffect(() => {
    if (isLive && game.id) {
      setLoadingBox(true);
      espnAPI.getGameSummary(league, game.id)
        .then(data => {
          setBoxScore(data.boxscore);
          setLoadingBox(false);
        })
        .catch(() => {
          setLoadingBox(false);
        });
    }
  }, [isLive, game.id, league]);
  
  // Get recent form from records
  const getRecentForm = (records) => {
    const formRecord = records?.find(r => r.type === 'lastten' || r.name?.includes('L10'));
    return formRecord?.summary || null;
  };

  const awayForm = getRecentForm(away.records);
  const homeForm = getRecentForm(home.records);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-[#12151c] border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
              {competition.status?.type?.shortDetail}
              {isLive && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-green-500">LIVE</span>
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold text-slate-100">
              {away.team?.displayName} @ {home.team?.displayName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Teams Overview */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {away.team?.logo && (
                  <img src={away.team.logo} alt="" className="w-12 h-12 object-contain" />
                )}
                <div>
                  <div className="font-semibold text-slate-100">{away.team?.displayName}</div>
                  <div className="text-sm text-slate-400">{away.records?.[0]?.summary}</div>
                </div>
              </div>
              {awayForm && (
                <div className="text-xs text-slate-500">Last 10: {awayForm}</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {home.team?.logo && (
                  <img src={home.team.logo} alt="" className="w-12 h-12 object-contain" />
                )}
                <div>
                  <div className="font-semibold text-slate-100">{home.team?.displayName}</div>
                  <div className="text-sm text-slate-400">{home.records?.[0]?.summary}</div>
                </div>
              </div>
              {homeForm && (
                <div className="text-xs text-slate-500">Last 10: {homeForm}</div>
              )}
            </div>
          </div>

          {/* Live Box Score */}
          {isLive && boxScore && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Player Stats
              </div>
              
              {boxScore.players?.map((teamBox) => (
                <div key={teamBox.team.id} className="bg-white/5 rounded border border-white/10 overflow-hidden">
                  <div className="px-4 py-2 bg-white/5 border-b border-white/10 font-semibold text-slate-100 text-sm">
                    {teamBox.team.displayName}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-3 py-2 text-left text-slate-400 font-medium sticky left-0 bg-[#12151c]">Player</th>
                          <th className="px-2 py-2 text-center text-slate-400 font-medium">MIN</th>
                          <th className="px-2 py-2 text-center text-slate-400 font-medium">PTS</th>
                          <th className="px-2 py-2 text-center text-slate-400 font-medium">REB</th>
                          <th className="px-2 py-2 text-center text-slate-400 font-medium">AST</th>
                          <th className="px-2 py-2 text-center text-slate-400 font-medium">FG</th>
                          <th className="px-2 py-2 text-center text-slate-400 font-medium">3PT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {teamBox.statistics?.[0]?.athletes?.slice(0, 8).map((playerStat) => {
                          const stats = playerStat.stats || [];
                          return (
                            <tr key={playerStat.athlete.id} className="hover:bg-white/5">
                              <td className="px-3 py-2 text-slate-200 sticky left-0 bg-[#12151c]">
                                {playerStat.athlete.shortName}
                              </td>
                              <td className="px-2 py-2 text-center text-slate-300">{stats[0] || '-'}</td>
                              <td className="px-2 py-2 text-center text-slate-100 font-semibold">{stats[1] || '0'}</td>
                              <td className="px-2 py-2 text-center text-slate-300">{stats[5] || '0'}</td>
                              <td className="px-2 py-2 text-center text-slate-300">{stats[6] || '0'}</td>
                              <td className="px-2 py-2 text-center text-slate-300 text-xs">{stats[2] || '-'}</td>
                              <td className="px-2 py-2 text-center text-slate-300 text-xs">{stats[3] || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Broadcast Info */}
          {!isLive && broadcast && (
            <div className="p-4 bg-white/5 rounded border border-white/10">
              <div className="text-xs text-slate-400 mb-1">Broadcast</div>
              <div className="text-sm font-medium text-slate-200">
                {broadcast.names?.join(', ') || broadcast.market?.type}
              </div>
            </div>
          )}

          {/* Additional Details (for non-live games) */}
          {!isLive && (
            <div className="grid grid-cols-2 gap-4">
              {competition.venue?.fullName && (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Venue</div>
                  <div className="text-sm text-slate-200">{competition.venue.fullName}</div>
                  {competition.venue.address?.city && (
                    <div className="text-xs text-slate-500">
                      {competition.venue.address.city}, {competition.venue.address.state}
                    </div>
                  )}
                </div>
              )}
              
              {competition.odds?.[0] && (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Spread</div>
                  <div className="text-sm text-slate-200">
                    {competition.odds[0].details || 'N/A'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
