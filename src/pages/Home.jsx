import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import DatePicker from '../components/scores/DatePicker';
import { GameCard } from '../components/scores/GameCard';
import { GameCardSkeleton } from '../components/ui/Skeleton';
import { useScoreboard } from '../hooks/useBasketballData';
import { sortGamesByImportance } from '../utils/game-importance';
import { format } from 'date-fns';

export const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [league, setLeague] = useState('nba');
  
  const dateStr = format(selectedDate, 'yyyyMMdd');
  const { data, loading, error } = useScoreboard(league, dateStr);
  const games = data?.events || [];

  const liveGames = games.filter(g => g.status.type.state === 'in');
  const otherGames = games.filter(g => g.status.type.state !== 'in');
  
  const sortedOther = sortGamesByImportance(otherGames, league);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        
        <div className="flex gap-2 mb-12 justify-center">
          {['nba', 'mens-college-basketball'].map((l) => (
            <button
              key={l}
              onClick={() => setLeague(l)}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                league === l 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {l === 'nba' ? 'NBA' : 'NCAAM'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <GameCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-sm font-medium text-slate-400">{error}</span>
          </div>
        ) : (
          <div className="space-y-12">
            {liveGames.length > 0 && (
              <section className="animate-slide-in">
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Now
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveGames.map(game => (
                    <GameCard key={game.id} game={game} league={league} />
                  ))}
                </div>
              </section>
            )}

            <section className="animate-slide-in" style={{ animationDelay: '100ms' }}>
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">
                {liveGames.length > 0 ? 'Upcoming & Final' : 'Games'}
              </h2>
              {sortedOther.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedOther.map(game => (
                    <GameCard key={game.id} game={game} league={league} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <span className="text-sm font-medium text-slate-500">No games scheduled for this date</span>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
